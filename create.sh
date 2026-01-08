#!/bin/bash

type="${1,,}"
name="${2,,}"

if [[ $1 == '' ]]; then
    echo 'Argument 1 (type) empty'
    exit
elif [[ $2 == '' ]]; then
    echo 'Argument 2 (name) empty'
    exit
elif ! [[ "$name" =~ ^[a-z][a-z0-9\/\-]*[a-z0-9]$ ]]; then
    echo 'Valid characters in argument 2 (name) are a-z and separating slashes and dashes'
    exit
elif [[ "$name" =~ [\-\/][\-\/] ]]; then
    echo 'No double separators allowed'
    exit
fi

php_root='./public_html'

if ! [ -d $php_root ]; then
    echo "Defined root directory ($php_root) does not exist"
    exit
fi

components_dir="${php_root}/components"
services_dir="${php_root}/services"
models_dir="${php_root}/models"

template_dir='./templates/'

if ! [ -d $template_dir ]; then
    echo "Defined templates directory ($template_dir) does not exist"
    exit
fi

component_css_template_file="${template_dir}component-css.template"
component_module_template_file="${template_dir}component-module.template"
component_php_template_file="${template_dir}component-php.template"

function split_string() { # arg1 = string, arg2 = delimiters
    old_ifs=$IFS
    IFS=$2
    split_result=($1)
    IFS=$old_ifs
}

function make_namespace() { # args = all name parts
    local path_parts=($@)
    namespace=''

    length=${#path_parts[@]}
    old_ifs=$IFS
    IFS='-'
    for (( i=0; i<length-1; i++ )); do
        sub_parts=(${path_parts[$i]})
        
        namespace_part='\'
        for element in ${sub_parts[@]}; do
            initial=${element:0:1}
            namespace_part+=${initial^^}

            element_length=${#element}
            if [ $element_length -gt 1 ]; then
                namespace_part+=${element:1:element_length-1}
            fi
        done
        namespace+=$namespace_part
    done
    IFS=$old_ifs
}

function make_name_variants() { # arg1 = hyphen-delimited string
    old_split_result=$split_result
    pascal_name=''
    camel_name=''
    snake_name=''

    split_string $1 '-'

    for i in ${!split_result[@]}; do
        name_part=${split_result[$i]}

        pascal_part=${name_part:0:1}
        pascal_part=${pascal_part^^}

        length=${#name_part}
        if [ $length -gt 1 ]; then
            pascal_part+=${name_part:1:$length-1}
        fi

        pascal_name+=$pascal_part

        if [[ $i == 0 ]]; then
            camel_name+=$name_part
            snake_name+=$name_part
        else
            camel_name+=$pascal_part
            snake_name+="_$name_part"
        fi
    done

    split_result=$old_split_result
}

function file_from_template() {
    # arg1 = source
    # arg2 = target

    if [ ! -f $1 ]; then
        echo "Defined template file does not exist: $1"
        exit
    fi

    if [ -f $2 ]; then
        echo "File already exists: $2"
        exit
    fi

    template=$(<$1)
    template=${template//'{base_name}'/"$base_name"}
    template=${template//'{pascal_name}'/"$pascal_name"}
    template=${template//'{camel_name}'/"$camel_name"}
    template=${template//'{snake_name}'/"$snake_name"}
    template=${template//'{namespace}'/"$namespace"}
    
    cat <<< $template > $2
    echo "cat: created file: '$2'"
}

function create_component() {
    if ! [ -d $components_dir ]; then
        echo "Defined components directory ($components_dir) does not exist"
        exit
    fi

    dir_path="$components_dir/$name"

    if [ -d $dir_path ]; then
        echo "Component already exists: $dir_path"
        exit
    fi

    mkdir $dir_path --parents --verbose

    split_string $name '/'
    base_name=${split_result[-1]}
    make_namespace ${split_result[@]}
    make_name_variants $base_name

    file_from_template $component_css_template_file "$dir_path/$base_name.css"
    file_from_template $component_module_template_file "$dir_path/$base_name.module.js"
    file_from_template $component_php_template_file "$dir_path/$base_name.php"
}

function create_service() {
    if ! [ -d $services_dir ]; then
        echo "Defined services directory ($services_dir) does not exist"
        exit
    fi

    echo $services_dir
}

function create_model() {
    if ! [ -d $models_dir ]; then
        echo "Defined models directory ($models_dir) does not exist"
        exit
    fi

    echo $models_dir
}

case $type in
    'c' | 'component')
        create_component
        ;;
    's' | 'service')
        create_service
        ;;
    'm' | 'model')
        create_model
        ;;
    *)
        echo 'Invalid type in argument 1'
        ;;
esac