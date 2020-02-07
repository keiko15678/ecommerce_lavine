const express = require("express");
const router = express.Router();
const paypal = require('paypal-rest-sdk');
const stripeSecretKey = require('./config/keys.js').stripeSecretKey;
const stripe = require('stripe')(stripeSecretKey);

const Item = require('./models/items_model.js');
const Order = require('./models/orders_model.js');

const paypalReturnUrl = "http://localhost:8080/pay/paypal/success";
const paypalCancelUrl = "http://localhost:8080/pay/paypal/cancel";

paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': 'AYV-xlf17c80X9vEpELABaHimDk5jQLXR8BrieCmZVaSOYCPm2RlJ7cCIe0ezx0eQ6NC6fUclaeyntpp',
    'client_secret': 'ENrSuvcfqLzoDgjVLs89eB56sX5068E3LEedXgfqqpZ86NW1d906MQGWVOKn_zTy6dbQEA1kccrPZdXF'
  });

//pay with stripe
router.post('/pay/stripe', (req, res) =>{
    const subtotal = req.body.subtotal;
    const items = req.body.item;
    const jsonParse = JSON.parse(items);
    let stripeOrder = {
        payment_method_types: ['card'],
        line_items: [
            // {
            //     name: 'T-shirt',
            //     description: 'An Order',
            //     images: [],
            //     amount: 500,
            //     currency: 'usd',
            //     quantity: 1,
            // }
        ],
        payment_intent_data: {
          capture_method: 'manual',
        },
        success_url: 'http://localhost:8080/pages/payment_success.html?session_id={CHECKOUT_SESSION_ID}',
        cancel_url: 'http://localhost:8080/pay/stripe/cancel',
    }
    for(let i = 0; i < jsonParse.length; i++){
        const { name, price, quantity } = jsonParse[i];
        let stripeItem = {
            name: name,
            description: 'An Order',
            amount: parseInt(price*100),
            currency: 'usd',
            quantity: parseInt(quantity)
        }
        stripeOrder.line_items[i] = stripeItem;
    }
    stripe.checkout.sessions.create(stripeOrder, (err, session) =>{
        res.send(session.id)
    });
})

// stripe canceled
router.get('/pay/stripe/cancel',(req, res) =>{
    res.redirect('/pages/checkout.html');
})

//pay with paypal
router.post('/pay/paypal', (req, res) =>{
    const subtotal = req.body.subtotalforPaypal;
    const items = req.body.itemsforPaypal;
    const jsonParse = JSON.parse(items);
    const create_payment_json = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": paypalReturnUrl,
            "cancel_url": paypalCancelUrl
        },
        "transactions": [{
            "item_list": {
                "items": [{
                    "name": "item",
                    "sku": "item",
                    "price": subtotal,
                    "currency": "USD",
                    "quantity": 1
                }]
            },
            "amount": {
                "currency": "USD",
                "total": subtotal
            },
            "description": "This is the payment description."
        }]
    };
    for(let i = 0; i < jsonParse.length; i++){
        const { name, price, quantity } = jsonParse[i];
        let paypalItem = {
            "name": name,
            "sku": name,
            "price": price,
            "currency": "USD",
            "quantity": parseInt(quantity)
        }
        create_payment_json.transactions[0].item_list.items[i] = paypalItem;
    }

    //create payment
    paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
            throw error;
        } else {
            for(let i = 0; i < payment.links.length; i++){
                if(payment.links[i].rel === 'approval_url'){
                    res.redirect(payment.links[i].href);
                }
            }
        }
    });
})

//successful paypal payment
router.get('/pay/paypal/success', (req, res) =>{
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;
    const execute_payment_json = {
        "payer_id": payerId,
        // "transactions" : [{
        //     "amount": {
        //         "currency": "USD",
        //         "total": subtotal
        //     }
        // }]
    };
    paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
        if(error){
            console.log(error.response);
            throw error;
        } else{
            //save to database
            const payerFirstName = payment.payer.payer_info.first_name;
            const payerLastName = payment.payer.payer_info.last_name;
            const shippingName = payment.payer.payer_info.shipping_address.receipient_name;
            const shippingLine1 = payment.payer.payer_info.shipping_address.line1;
            const shippingCity = payment.payer.payer_info.shipping_address.city;
            const shippingState = payment.payer.payer_info.shipping_address.state;
            const shippingPostal = payment.payer.payer_info.shipping_address.postal_code;
            const shippingCountry = payment.payer.payer_info.shipping_address.country_code;
            const total = payment.transactions[0].amount.details.subtotal;
            const items = payment.transactions[0].item_list.items;
            let arr = [];
            for(let i = 0; i < items.length; i++){
                arr[i] = items[i];
            }
            const shipping = [shippingLine1,shippingCity,shippingState,shippingPostal,shippingCountry];
            const newOrder = new Order({
                detail: arr,
                shipping: shipping,
                firstName: payerFirstName,
                lastName: payerLastName,
                subtotal: total,
                paid: true
            })
            newOrder.save()
                .then(order => res.json(order))
                .catch(err => console.log(err));
                res.redirect(`/pages/payment_success.html?subtotal=${total}`);
        }
    })
})

//cancel paypal payment
router.get('/pay/paypal/cancel', (req, res) =>{
    res.redirect('/pages/checkout.html');
})

//get all items
router.get('/items', (req, res) => {
    Item.find()
        .sort({ date: 1 })
        .then(items => res.json(items))
})

//get one item by id
router.get('/items/:id', (req, res) => {
    const id = req.params.id
    Item.findById(id)
        .then(item => res.json(item))
})

//delete an item by id
router.delete('/items/:id', (req, res) => {
    const id = req.params.id
    Item.findByIdAndRemove(id)
        .then(item => res.json(item))
})

//delete all
router.delete('/items', (req, res) => {
    Item.remove()
        .then(item => res.json(item))
})

//add an item
router.post('/items', (req, res) => {
    const item = new Item({
        name : 'puma', //req.body.name
        price: '35.99', //req.body.price
        imgURL: 'https://www.adidas.com.ph/dw/image/v2/bcbs_prd/on/demandware.static/-/Sites-adidas-products/default/dw3aa60fd2/zoom/F36199_01_standard.jpg?sh=320&strip=false&sw=320', //req.body.imgURL
        type: 'shoes',
        gender: 'male',
        describe: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Rem, minus!',
        productDetails: [],
        delivery: '2 day shipping',
        specifications: 'real leather',
        reviews: ['great','awesome'],
        questions: ['question','answer'],
        slideshow: ['https://www.adidas.com.ph/dw/image/v2/bcbs_prd/on/demandware.static/-/Sites-adidas-products/default/dw3aa60fd2/zoom/F36199_01_standard.jpg?sh=320&strip=false&sw=320'],
        rating: ''
    })
    item.save()
        .then(item => res.json(item))
})


//main page
router.get('/', (req, res) =>{
    res.sendFile(__dirname + "/public/index.html");
})

module.exports = router