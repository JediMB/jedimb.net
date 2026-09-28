#!/bin/bash

# DO A CHECK FOR IF inotifywait EXISTS

inotif_regex='^([A-Za-z0-9\.\-_ \/]+)\/ ([A-Z_,]+) ([A-Za-z0-9\.\-_ ]+\.([A-Za-z0-9]+))$'

asset_dir="./assets"
css_dir="$asset_dir/css"
js_dir="$asset_dir/js"

css_extensions=("css")
js_extensions=("js")

while inotif_out=`inotifywait -qr -e modify -e move -e create -e delete $asset_dir`; do
    if ! [[ $inotif_out =~ $inotif_regex ]]; then
        unset inotif_out
        continue
    fi

    case ${BASH_REMATCH[1]} in

        "$css_dir"*)
            echo "Change in CSS directory!"
            ;;

        "$js_dir"*)
            echo "Change in JS directory!"
            ;;
    
    esac

    # echo "${BASH_REMATCH[1]}" #directory
    # echo "${BASH_REMATCH[2]}" #TYPE
    # echo "${BASH_REMATCH[3]}" #filename
    # echo "${BASH_REMATCH[4]}" #extension

    unset inotif_out
done