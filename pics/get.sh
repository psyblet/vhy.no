#!/bin/sh

while read line
do
    if [ ! -f $(basename $line) ]
    then
        wget $line
    fi
done <list.txt
