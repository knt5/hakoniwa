#!/bin/bash

# target tile
target="N035E139"

# crop coordinates
coordinates="139.6 35.8 139.85 35.55"

# crop
bash crop-geotiff.sh "$target" "$coordinates"
