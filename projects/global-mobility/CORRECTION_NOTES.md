# Correction notes

## Route coverage

The earlier prototype incorrectly populated 2014 and 2015 with provisional corridor values. Those rows have been removed. The global timeline still reports annual totals from 2013 to 2023, but the audited headline-route layer now begins in 2016.

The 2016 layer has been expanded from 11 to 33 published major corridors. The route layer remains a selected thresholded view, not a complete global origin-destination matrix.

## Map alignment

The earlier basemap and browser coordinates used different projections, which displaced country nodes. Both world and European basemaps are now generated with the exact equirectangular bounds used by the JavaScript overlays.

Routes crossing the antimeridian are split at the map edges so Asia–North America corridors follow the Pacific rather than cutting across the centre of the map.
