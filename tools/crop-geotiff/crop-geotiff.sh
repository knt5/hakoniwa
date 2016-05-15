#!/bin/bash

# check args
if [ $# -ne 2 ]
then
	echo "Usage: $0 target coordinates"
	exit 1
fi

# target tile
target=$1

# crop coordinates
coordinates=$2

# src
dir="../../data/jaxa/dsm/${target}/MEDIAN"
dsmSrc="${dir}/${target}_MED_DSM.tif"
mskSrc="${dir}/${target}_MED_MSK.tif"

# dest
destDir="../../data/"

# crop DSM
gdal_translate -co COMPRESS=PACKBITS -projwin $coordinates "${dsmSrc}" "${destDir}/${target}.tif"

# crop MSK
gdal_translate -co COMPRESS=PACKBITS -projwin $coordinates "${mskSrc}" "${destDir}/${target}.mask.tif"
