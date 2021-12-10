#!/bin/bash

# Assign the filename
filename="/etc/ImageMagick-6/policy.xml"
search="<policy domain=\"coder\" rights=\"none\" pattern=\"PDF\" />"
replace="<policy domain=\"coder\" rights=\"read|write\" pattern=\"PDF\" />"
# Take the search string
# read -p "search string: " search

# Take the replace string
# read -p "replace string: " replace

if [[ $search != "" && $replace != "" ]]; then
sed -i "s,$search,$replace,g" $filename
fi

