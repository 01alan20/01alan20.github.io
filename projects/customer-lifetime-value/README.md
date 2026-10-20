# Customer Lifetime Value & Retention Engine

This project walks through raw-data cleaning, price and quantity exploration, product and country demand, customer concentration, repeat orders, retention, purchase intervals and observed customer value. The page uses a single column with labeled chart axes and color explanations.

## Outputs

- `index.html`: a wide, single-column analytical story with eleven sections, eighteen labeled charts, and the main conclusion at the beginning and end.
- `customer-lifetime-value.ipynb`: executed and downloadable Jupyter notebook.
- `analysis.html`: static HTML export of the notebook.
- `exploration-results.json`: current cleaning and first-order prediction results; no customer-level records. Older `results.json` is a legacy model output and is not loaded by the current page.
- `first-order-product-results.json`: aggregate first-basket product and pair results, item-count groups, product-variety groups and the model comparison with product flags.
- `retention-next-steps.json`: second-purchase timing, later revenue excluding the original first sale, country/season comparisons, and a matched comparison of first- versus second-order information.

## Reproduce

Download `online_retail_II.xlsx` from the [UCI Online Retail II dataset](https://archive.ics.uci.edu/dataset/502/online%2Bretail) and place it in `data/`. From the repository root, install the requirements and run:

```text
python scripts/rebuild_clv_story.py
python scripts/execute_clv_notebook.py
```

The build reads both annual sheets and audits all 1,067,371 transaction lines. Identical lines are counted and retained because the source cannot distinguish recording errors from legitimate repeated items. It filters invalid prices/dates and zero quantities, keeps returns as negative revenue, and requires an identifier for customer analysis. Anonymous transactions remain in product and price exploration. All positive price and quantity ranges are included in named buckets; no chart uses transformed logarithmic values.

The first-order experiment compares logistic regression, gradient boosting and a constant training-rate probabilistic baseline. Only first-basket value, units and distinct products are features. Chronological gaps let all 90-day training and validation labels mature before the next period. Lowest validation Brier selects the final model. Country value comparisons report an equal first-180-day window and require at least 50 eligible customers per country. First-order spending groups have readable labels, customer counts, repeat-buyer counts and repeat percentages. The time-between-orders chart excludes zero-time gaps and includes repeat buyers only.

Product costs are absent, so value means net revenue rather than profit. Observed customer spans are not complete lifetimes. The previous spending calculator has been removed from the rebuilt page. Customer-level frames stay in notebook memory; published outputs contain aggregates only.

Section 8 also examines physical item counts, distinct product counts, specific products and pairs among the 30 most common first-order products. Individual products and pairs require at least 50 customers; customers can belong to several groups. Wilson intervals describe sampling uncertainty without adjusting for multiple comparisons. Two additional classifiers receive flags for up to 40 common products selected using training customers only. Validation chooses the models; a paired bootstrap measures the Brier difference on later customers. The reused test period is disclosed. A higher descriptive return rate does not establish a causal product effect or guarantee better prediction.

Source: Chen, D. (2012), *Online Retail II*, UCI Machine Learning Repository, DOI 10.24432/C5CG6D. License: CC BY 4.0.

## Reading order

The public page and executed notebook follow the same sequence: cleaning; basic exploration; demand; country value; retention; time to a second purchase; customer value after the first sale; first-order signals; country and season; predictive comparisons after one and two orders; business actions. The notebook begins with a roadmap and a collapsed reproducible analysis cell. Its HTML export hides source inputs while the downloadable notebook retains the complete code.

Second-purchase timing retains non-returners in the denominator and excludes same-timestamp invoices. Later net revenue subtracts the first basket's gross sales from net revenue recorded during the first 180 days; recorded returns remain deducted. The second-order model experiment compares the same repeat buyers, decision dates and future 90-day labels. Models using only first-basket features and models using first/second basket features are independently selected on validation data, then compared using a paired bootstrap on later customers. Their scores are not directly comparable to the first-order test on a different population.
