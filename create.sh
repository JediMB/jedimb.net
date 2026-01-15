#!/bin/bash

type="${1,,}" # e.g. model
name="${2,,}" # e.g. user, or db/user

if [[ $1 == '' ]]; then
    echo 'create 1.0'
    echo 'Usage: create.sh [type] [name]'
    echo
    echo 'create.sh is a bash shell script intended to speed up'
    echo 'the creation of new api, component, model and service'
    echo 'files for the PHP web app for which it was created.'
    echo
    echo 'Currently supported [type]s:'
    echo '  api (a)'
    echo '  component (c)'
    echo '  model (m)'
    echo '  service (c)'
    echo
    echo '[Name]s use the lower-case English standard alphabet,'
    echo 'with hyphens between words and forward-slashes as'
    echo 'directory separators. No numbers at the start of file'
    echo 'or directory names. E.g.'
    echo '  api-9'
    echo '  fancy-component-name'
    echo '  dto/cute-model-name'
    echo '  db/cool-service-name'
    exit
elif [[ $2 == '' ]]; then
    echo 'Argument 2 (name) empty'
    exit
elif ! [[ "$name" =~ ^[a-z][a-z0-9\/\-]*[a-z0-9]$ ]]; then
    echo 'Valid characters in argument 2 (name) are a-z and separating slashes and dashes'
    exit
elif [[ $name =~ \/\d ]]; then
    echo 'File and directory names may not begin with a number';
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

api_dir="${php_root}/api"
components_dir="${php_root}/components"
models_dir="${php_root}/models"
services_dir="${php_root}/services"

template_dir='./templates'

if ! [ -d $template_dir ]; then
    echo "Defined templates directory ($template_dir) does not exist"
    exit
fi

api_php_template_file="$template_dir/api-php.template"
component_css_template_file="$template_dir/component-css.template"
component_module_template_file="$template_dir/component-module.template"
component_php_template_file="$template_dir/component-php.template"
model_db_php_template_file="$template_dir/model-db-php.template"
model_dto_php_template_file="$template_dir/model-dto-php.template"
model_php_template_file="$template_dir/model-php.template"
service_db_php_template_file="$template_dir/service-db-php.template"
service_php_template_file="$template_dir/service-php.template"

function make_namespace() { # args = all name parts
    local path_parts=($@)
    namespace=''

    local length=${#path_parts[@]}
    local old_ifs=$IFS
    IFS='-'
    for (( i=0; i<length-1; i++ )); do
        path_part=${path_parts[$i]}

        if [[ $i == 0 ]]; then
            if [[ $path_part == 'db' || $path_part == 'dto' ]]; then
                namespace+="\\${path_part^^}"
                continue
            fi
        fi

        local sub_parts=($path_part)
        
        local namespace_part='\'
        for element in ${sub_parts[@]}; do
            local initial=${element:0:1}
            namespace_part+=${initial^^}

            local element_length=${#element}
            if [ $element_length -gt 1 ]; then
                namespace_part+=${element:1:element_length-1}
            fi
        done
        namespace+=$namespace_part
    done
    IFS=$old_ifs
}

function make_name_variants() { # arg1 = hyphen-delimited string
    pascal_name=''
    camel_name=''
    snake_name=''

    local old_ifs=$IFS
    IFS='-'
    local split_name=($1)
    IFS=$old_ifs

    for i in ${!split_name[@]}; do
        local name_part=${split_name[$i]}

        local pascal_part=${name_part:0:1}
        pascal_part=${pascal_part^^}

        local length=${#name_part}
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
}

function prepare() {
    local type_name=$1
    local type_dir=$2
    local use_name_dir=$3

    if ! [ -d $type_dir ]; then
        echo "defined $type_name directory ($type_dir) does not exist"
        exit
    fi

    local old_ifs=$IFS
    IFS='/'
    split_name=($name)
    IFS=$old_ifs

    local arr_length=${#split_name[@]}
    base_name=${split_name[-1]}

    if [[ $use_name_dir == true ]]; then
        dir_path="$type_dir/$name"
    else
        dir_path=$type_dir
        
        for (( i=0; i<arr_length-1; i++)); do
            dir_path+="/${split_name[$i]}"
        done
    fi

    if [ -d $dir_path ]; then
        if [[ $use_name_dir == true ]]; then
            echo "$type_name already exists: $dir_path"
            exit
        fi
    else
        mkdir $dir_path --parents --verbose
    fi

    make_namespace ${split_name[@]}
    make_name_variants $base_name
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

case $type in
    'a' | 'api')
        prepare 'api' $api_dir
        file_from_template $api_php_template_file "$dir_path/$base_name.php"
        ;;
    'c' | 'component')
        prepare 'component' $components_dir true
        file_from_template $component_css_template_file "$dir_path/$base_name.css"
        file_from_template $component_module_template_file "$dir_path/$base_name.module.js"
        file_from_template $component_php_template_file "$dir_path/$base_name.php"
        ;;
    'm' | 'model')
        prepare 'model' $models_dir
        if [[ ${split_name[0]} == 'db' ]]; then
            file_from_template $model_db_php_template_file "$dir_path/$base_name.db.model.php"
        elif [[ ${split_name[0]} == 'dto' ]]; then
            file_from_template $model_dto_php_template_file "$dir_path/$base_name.dto.model.php"
        else
            file_from_template $model_php_template_file "$dir_path/$base_name.model.php"
        fi
        ;;
    's' | 'service')
        prepare 'service' $services_dir
        if [[ ${split_name[0]} == 'db' ]]; then
            file_from_template $service_db_php_template_file "$dir_path/$base_name.db.service.php"
        else
            file_from_template $service_php_template_file "$dir_path/$base_name.service.php"
        fi
        ;;
    *)
        echo 'Invalid type in argument 1'
        ;;
esac