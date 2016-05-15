#!/bin/bash

# target tile
target="N035E139"

# crop coordinates
coordinates="139.68 35.76 139.81 35.61"

# crop
bash crop-geotiff.sh "$target" "$coordinates" png
