# ONA Studio v7

Browser-based organizational network analysis dashboard. Open `index.html` to explore the network locally. No account, server, internet access or API key needed.

## Views

- **People:** interactive directed network with pan, zoom, drag, reset, node sizing, layer/group/visible-rating controls, employee search and detail inspector. All People filters share a single top area.
- **People ranking:** beneath the network, before Network lookup. All 46 employees are available in a scrollable horizontal bar chart. Independently sort high-to-low or low-to-high by Network bridges (betweenness), Network prominence (PageRank), Reachability (closeness), Connected peers (eigenvector) or Nominations received (incoming degree). Bar colors follow the currently selected Group by setting; selecting a bar opens the person's network inspector. Numbers in the People ranking are whole numbers: nomination counts are displayed directly, while the four network centrality measures are scaled relative to the highest-ranked person (100). Original metric precision and ranking order are preserved.
- **Group Connections:** directed group matrix, with Relationship, Group by and Measure controls consolidated together at the top.
- **Relationship Flows:** direction-specific, count-scaled group ribbon visualization.
- **Network Insights:** ranks for people receiving nominations and distinct contacts across selected groups.
- **Network lookup:** local, rule-based paths, comparisons and connections; no generative model or API charges.

**In-app export functions and controls have been removed.** The downloadable project archive is for code sharing and reproducing the demo; the application itself provides no export buttons.

## Data

Based on the [Kaggle consulting company network dataset](https://www.kaggle.com/datasets/lakshmipriyadarshni/consulting-company-network-data): 46 anonymized people, 877 directed information ties, 855 directed value ties and 959 distinct directed pairs across both. The cleaning pass excluded five self-links but preserved reciprocated directed ties. Data are embedded in the local HTML for offline use.

Metric calculations use the full relationship layer even when the Visible rating slider hides edges from the People graph. Ranking uses the selected relationship layer and updates when that layer changes. `Equal sizes` is a visualization setting rather than a sortable metric, so it does not appear in the ranking chart.

Organizational level, region and location are anonymized numeric codes. Network communities are graph-derived and not verified departments. This is a portfolio demo, not a validated burnout, workload or employee-performance diagnostic.

## Build and validation

- Rebuild with: `python src/build.py`
- The script uses only Python's standard library, reads `data/network_data.json` and regenerates the standalone `index.html`.
- The CSV files and `validation.json` support reproducibility and source inspection.
- Tested in headless Chromium at 1500px desktop and 390px, 760px and 1120px viewport widths. Checked layer switching, sorted chart with all 46 people, color grouping, employee drill-down, Group Connections Measure control, export removal, graph reset and absence of outgoing requests or JavaScript errors.

## Publication caution

Verify the original Kaggle dataset's specific reuse and redistribution license before making the embedded-data dashboard publicly available. This project does not claim ownership of the uploaded source dataset.
