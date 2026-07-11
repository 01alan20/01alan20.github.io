# Correction notes

## Timeline coverage

The interactive corridor map now begins in **2016**. The 2014 and 2015 global totals remain only in the separate long-run trend chart; they are no longer selectable map years. No bilateral corridor values are inferred before 2016.

The 2016 layer contains 33 published major corridors. The route layer remains a selected thresholded view, not a complete global origin-destination matrix.

## Country anchors

The earlier map used broad country-centroid coordinates. Those points could appear in northern Canada, central Siberia, or Scotland and looked wrong even when they were technically inside the country.

The project now uses **capital-city coordinates** as transparent visual anchors—for example London, Ottawa, Moscow, Beijing, Canberra, and Washington, D.C. These are country-level route anchors, not institution locations.

## Map alignment

The earlier implementation placed the basemap in an image element and drew routes and dots in a separately scaled SVG overlay. That structure was too fragile.

The world and Europe boundaries, routes, and nodes are now rendered inside the **same inline SVG coordinate system**. This removes projection and scaling drift. Routes crossing the antimeridian are still split at the map edges so Asia–North America corridors follow the Pacific rather than cutting across the centre of the map.
