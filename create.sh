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

php_root='./public_html/'

if ! [ -d "$php_root" ]; then
    echo "Defined root folder (${php_root}) does not exist"
    exit
fi

components_dir="${php_root}components/"
services_dir="${php_root}services/"
models_dir="${php_root}models/"

function create_component() {
    echo $components_dir$name
}

function create_service() {
    echo $services_dir
}

function create_model() {
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