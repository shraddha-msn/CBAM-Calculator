const express = require('express')
const axios = require('axios');
const { body, validationResult } = require('express-validator');
const router = express.Router()

const efactordata = require('../data/data.json');
//console.log(efactordata)

router.get('/currency', (req, res) => {
    axios.get('https://open.er-api.com/v6/latest/EUR')
        .then(response => {
            let currRates = Object.keys(response.data['rates']);
            return res.send(currRates);
        })
        .catch(error => {
            console.log(error);
            return res.status(500).json({ message: 'Error fetching currency data' });
        });
});

router.get('/products', (req, res) => {
    return res.send({efactordata});
});

const resultValidator = [
    body('product').notEmpty().withMessage('Product is required'),
    body('code').notEmpty().withMessage('CN code is required'),
    body('weight')
        .notEmpty().withMessage('Weight is required')
        .isInt({ gt: 0 }).withMessage('Weight must be a positive integer'),
    body('unit').notEmpty().withMessage('Unit is required'),
    body('currency').notEmpty().withMessage('Currency is required')
];

router.post('/result', resultValidator, async (req, res) => {
    const errors = validationResult(req);
    //console.log(req.body)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        let { product, code, weight, unit, currency } = req.body;

        if (!(unit == 'kg' || unit == 'ton' || unit == 'tonne')) {
            return res.status(400).json({ message: 'Invalid unit. Select kg or ton' });
        }

        const prodtypeList = efactordata.filter((p)=>{
            return p.product==product})

        const subProdtypeList= prodtypeList[0].subProduct.filter((sp)=>sp.CNcode==code)
        const sub = subProdtypeList[0]

        if ( sub["CNcode"] != code ) {
            return res.status(400).json({ message: 'Invalid CN code' });
        }
        
        if ( prodtypeList[0]["product"] != product ) {
            return res.status(400).json({ message: 'Invalid product name' });
        }

        if (unit == 'kg') {
            weight = weight / 1000;
        }

        let latestCarbonprice = 90;

        // try {
        //     const response = await axios.get('https://www.ice.com/marketdata/DelayedMarkets.shtml?getContractsAsJson=&productId=4301&hubId=7965');

        //     if (response.data.length !== 0) {
        //         if (response.data[0]['lastPrice']) {
        //             latestCarbonprice = response.data[0]['lastPrice'];
        //         }
        //     }
        // } catch (error) {
        //     console.log(error);
        // } 

        let currRates = 0;
        try {
            const response = await axios.get('https://open.er-api.com/v6/latest/EUR');
            currRates = response.data['rates'][currency];
            if (!currRates) {
                return res.status(404).json({ message: 'Currency is wrong' });
            }
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'Error fetching currency rates' });
        }

        const directEm = weight * sub["directEmissions"];
        const indirectEm = weight * sub["indirectEmissions"];
        const totalEm = weight * sub["totalEmissions"];
        const totalamt = totalEm * latestCarbonprice * currRates;

        //console.log(directEm, indirectEm, totalEm)

        // console.log({
        //     diremission: { directEm: parseFloat(directEm).toFixed(2), unit: 'tonne CO2e' },
        //     indiremission: { indirectEm: parseFloat(indirectEm).toFixed(2), unit: 'tonne CO2e' },
        //     totemission: { totEm: parseFloat(totalEm).toFixed(2), unit: 'tonne CO2e' },
        //     carbonPrice: { price: parseFloat(totalamt).toFixed(2), currency: currency }
        // })

        return res.status(200).json({
            diremission: { directEm: parseFloat(directEm).toFixed(2), unit: 'tonne CO2e' },
            indiremission: { indirectEm: parseFloat(indirectEm).toFixed(2), unit: 'tonne CO2e' },
            totemission: { totEm: parseFloat(totalEm).toFixed(2), unit: 'tonne CO2e' },
            carbonPrice: { price: parseFloat(totalamt).toFixed(2), currency: currency }
        });
        
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

module.exports = router

