#!/bin/bash

# check args
if [ $# -ne 3 ]
then
	echo "Usage: $0 target coordinates format(png|asc)"
	exit 1
fi

# target tile
target=$1

# crop coordinates
coordinates=$2

# format
format=$3

# src
dir="../../data/jaxa/dsm/${target}/MEDIAN"
dsmSrc="${dir}/${target}_MED_DSM.tif"
mskSrc="${dir}/${target}_MED_MSK.tif"

# dest
destDir="../../data/jaxa/dsm-${format}/${target}"

# mkdir
if [ ! -d "$destDir" ]
then
	mkdir -p "$destDir"
fi

# output format option
if [ "$format" == "png" ]; then
	formatOption="PNG"
elif [ "$format" == "asc" ]; then
	formatOption="AAIGrid"
fi

# convert
gdal_translate -of $formatOption -projwin $coordinates "${dsmSrc}" "${destDir}/${target}.${format}"
gdal_translate -of $formatOption -projwin $coordinates "${mskSrc}" "${destDir}/${target}.mask.${format}"
