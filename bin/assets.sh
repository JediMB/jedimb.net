#!/bin/bash

if ! command -v inotifywait >/dev/null 2>&1; then
    echo "inotifywait not found: please install inotify-tools."
    exit 1
fi

if ! [[ "${0%/*}" == "" ]]; then
    cd "${0%/*}"
fi

function main() {
    local INOTIF_REGEX='^([A-Za-z0-9\.\-_ \/]+)\/ ([A-Z_,]+) ([A-Za-z0-9\.\-_ ]+\.([A-Za-z0-9]+))$'

    local ASSET_DIR="../assets"
    local CSS_DIR="$ASSET_DIR/css"
    local JS_DIR="$ASSET_DIR/js"

    local CSS_EXTENSIONS=("css")
    local JS_EXTENSIONS=("js")

    local CSS_DESTINATION_FILE="../test-merge.css"
    local JS_DESTINATION_FILE="../test-merge.js"

    echo Monitoring $ASSET_DIR...
    trap "echo ; echo Monitoring ended." SIGINT

    local INOTIF_OUT=""

    while INOTIF_OUT=`inotifywait -qr -e modify -e move -e create -e delete $ASSET_DIR`; do
        if ! [[ $INOTIF_OUT =~ $INOTIF_REGEX ]]; then
            continue
        fi

        case ${BASH_REMATCH[1]} in

            "$CSS_DIR"*)
                echo "Change in CSS directory!"
                local CSS_EXTENSION=""
                for CSS_EXTENSION in ${CSS_EXTENSIONS[@]}; do
                    if ! [[ $CSS_EXTENSION == ${BASH_REMATCH[4]} ]]; then
                        continue
                    fi

                    echo $CSS_EXTENSION file changed.
                    merge_css
                    break
                done
                ;;

            "$JS_DIR"*)
                echo "Change in JS directory!"
                local JS_EXTENSION=""
                for JS_EXTENSION in ${JS_EXTENSIONS[@]}; do
                    if ! [[ $JS_EXTENSION == ${BASH_REMATCH[4]} ]]; then
                        continue
                    fi

                    echo $JS_EXTENSION file changed.
                    merge_js
                    break
                done
                ;;
        
        esac

        # echo "${BASH_REMATCH[1]}" #directory
        # echo "${BASH_REMATCH[2]}" #TYPE
        # echo "${BASH_REMATCH[3]}" #filename
        # echo "${BASH_REMATCH[4]}" #extension
    done
}

function merge_css() {
    # node ./js/assets.js
}

function merge_js() {
    # node ./js/assets.js
}

main