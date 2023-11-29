const express = require('express');
const { Client } = require('./scrape'); 
const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');


app.get('/', async (req, res) => {
    const client = new Client();
    const prices = await client.getPrices();

    let countries = {};
    
    prices.forEach(site => {
        site.countries.forEach(country => {
            if (!countries[country.country]) {
                countries[country.country] = [];
            }
            countries[country.country].push({
                site: site.site,
                items: country.items
            });
        });
    });

    res.render('dashboard', { countries });
});


app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});
