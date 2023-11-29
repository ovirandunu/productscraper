# Node.js dashboard for "Roaming Sim-Plans" using axios for web-scraping

## Project Description

This project is a web scraping application designed to gather roaming SIM plans from three different websites: Airalo, Holafly, and Nomad. It automates the process of extracting data about various data plans, including pricing and coverage, and then displays this information in an easy-to-navigate web dashboard. The purpose is to provide a consolidated view of roaming SIM options available in different countries.

![Project Dashboard](\images\main_table.png)
*Screenshot of the project dashboard. Note: the rows must be clicked to expand and display a nested table with the specific data*

## Installation

1. **Clone the Repository:**
   ```
   git clone https://github.com/ovirandunu/productscraper.git
   ```

2. **Navigate to Project Directory:**
   ```
   cd productscraper
   ```

3. **Install Dependencies:**
   ```
   npm install axios
   ```

## Usage

To run the server, execute:
```
node server.js
```
Access the dashboard at `http://localhost:3000/` to view the aggregated SIM plans.

## Code Overview

- `scrape.js`: Implements the logic for scraping data from the Airalo, Holafly, and Nomad websites.
- `server.js`: An Express server that manages routing and serves the web dashboard.
- `dashboard.ejs`: A template for the web interface, displaying the data in an organized and interactive format.


## Contact

For queries or contributions, contact [Ovindu Randunu](https://github.com/ovirandunu).
