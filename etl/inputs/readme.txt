ETL Input Data Requirements
============================

This directory contains input data files for the district metrics ETL process.

Required Files:
--------------

1. districts.json
   - Contains district information with detailed metrics
   - Structure should match the format in ../public/data/districts.json
   - Each district should have economics, demographics, education, health, and infrastructure data

2. alerts.json (optional)
   - Existing alerts data to be updated
   - Structure should match the format in ../public/data/alerts.json

Data Format Requirements:
------------------------

Districts data should include:
- Basic info: id, name, state, population, area, coordinates
- Demographics: age distribution, race/ethnicity, education, income
- Economics: GDP growth, unemployment, median income, poverty rate, industries
- Education: graduation rates, test scores, teacher ratios, funding
- Health: life expectancy, access to care, outcomes, insurance coverage
- Infrastructure: road quality, broadband, public transport, utilities

The ETL script will:
1. Load input data from this directory
2. Calculate comprehensive scores for each district
3. Generate new alerts based on score thresholds
4. Save processed data to ../public/data/

To run the ETL process:
1. Place your input data files in this directory
2. Run: python build_metrics.py
3. Check ../public/data/ for output files

Note: The script expects JSON format for all input files.


