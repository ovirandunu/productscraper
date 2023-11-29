const axios = require('axios');
const { getCode } = require('country-list');

class Client {
    constructor() { }

    async getPrices() {
        let responses = await Promise.all([
            this.getAiralo(),
            this.getHolafly(),
            this.getNomad()
        ]);

        return responses;
    }

    async getAiralo() {
        let { data } = await axios.get('https://www.airalo.com/api/v2/countries');

        let countries = await Promise.all(data.map(c => this.getAiraloPricesByCountry(c.slug)));

        return {
            site: 'airalo.com',
            countries
        };
    }

    async getAiraloPricesByCountry(slug) {
        let { data } = await axios.get('https://www.airalo.com/api/v2/countries/' + slug);

        let items = data.packages.map(p => {
            return {
                data: p.data,
                duration: p.validity,
                price: p.price
            };
        });

        let countryCode = getCode(data.title);

        return { country: data.title, countryCode, items };
    }

    async getHolafly() {
        let { data } = await axios.get('https://esim.holafly.com/shop/');

        let regex = /<\/a><a href="https:\/\/esim.holafly.com\/([^/]+)\/" data-quantity="\d+" class="button product_type_variable add_to_cart_button" data-product_id="\d+" data-product_sku="[^"]+" aria-label="Select options for &ldquo;([^\&]+)&rdquo;"/;

        let matches = data.match(new RegExp(regex, 'g'));

        let countries = await Promise.all(matches.map(m => {
            let [, slug, country] = m.match(regex);
            return this.getHolaflyPricesByCountry(slug, country);
        }));

        return {
            site: 'esim.holafly.com',
            countries
        };
    }

    async getHolaflyPricesByCountry(slug, country) {
        let { data } = await axios.get(`https://esim.holafly.com/${slug}/`);

        let regex = /var productVariations = ([^;]+);\n/;
        let products = JSON.parse(data.match(regex)[1]);

        let items = products.map(p => {
            let [d1, d2, d3, d4] = p.name.split(' ');

            let data = [d3, d4].join(' ');
            let duration = [d1, d2].join(' ');

            return {
                data,
                duration,
                price: p.price
            };
        });

        let countryCode = getCode(country);

        return { country, countryCode, items };
    }

    async getNomad() {
        let { data } = await axios.get('https://www.getnomad.app/shop/all/index.pageContext.json');

        let countries = [];

        for (let plan of data.apiCache['apis-getProducts-[]'].plans) {
            let [name, duration, data] = plan.name.split(' - ');
            let isLocal = name.split(' ')[0] === 'Local';
            if (!isLocal) continue;

            let countryName = name.substring(name.indexOf(' ') + 1); // Get the full country name

            let item = {
                data,
                duration,
                price: plan.price
            };

            let country = countries.find(c => c.country === countryName);

            if (country) {
                country.items.push(item);
            } else {
                let countryCode = getCode(countryName);
                let flagUrl = `https://www.countryflags.io/${countryCode}/flat/64.png`;
                countries.push({ country: countryName, flagUrl, items: [item] });
            }
        }

        
        countries.sort((a, b) => a.country.localeCompare(b.country));

        return { site: 'getnomad.app', countries };
    }
}

module.exports = { Client };

