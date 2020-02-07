const express = require("express");
const router = express.Router();
const paypal = require('paypal-rest-sdk');
const stripeSecretKey = require('./config/keys.js').stripeSecretKey;
const stripe = require('stripe')(stripeSecretKey);

const User = require('./models/users_model.js');
const Item = require('./models/items_model.js');
const Order = require('./models/orders_model.js');

const paypalReturnUrl = "http://localhost:8080/pay/paypal/success";
const paypalCancelUrl = "http://localhost:8080/cancel";

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
        success_url: '',
        cancel_url: 'http://localhost:8080/cancel',
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
    const send = JSON.stringify(stripeOrder.line_items);
    stripeOrder.success_url = 'http://localhost:8080/pay/stripe/success?order=' + send;
    stripe.checkout.sessions.create(stripeOrder, (err, session) =>{
        res.send(session.id);
    });
})

// stripe success
router.get('/pay/stripe/success',(req, res) =>{
    let subtotal = JSON.parse(req.query.order);
    let total = 0;
    let detail = [];
    for(let i = 0; i < subtotal.length; i++){
        total += subtotal[i].amount / 100;
        detail[i] = subtotal[i];
    }
    for(let i = 0; i < detail.length; i++){
        detail[i].amount = detail[i].amount / 100;
    }
    const newOrder = new Order ({
        detail: detail,
        shipping: [req.user.address, req.user.state, req.user.postal],
        subtotal: total,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        paid: true
    })
    newOrder.save()
        .then(order => res.redirect('/success'))
        .catch(err => console.log(err));

})

//payment success page
router.get('/success',(req, res) =>{
    res.sendFile(__dirname + "/public/pages/payment_success.html");
})

//cancel payment
router.get('/cancel', (req, res) =>{
    res.sendFile(__dirname + "/public/pages/checkout.html");
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
            // const payerFirstName = payment.payer.payer_info.first_name;
            // const payerLastName = payment.payer.payer_info.last_name;
            // const shippingName = payment.payer.payer_info.shipping_address.receipient_name;
            // const shippingLine1 = payment.payer.payer_info.shipping_address.line1;
            // const shippingCity = payment.payer.payer_info.shipping_address.city;
            // const shippingState = payment.payer.payer_info.shipping_address.state;
            // const shippingPostal = payment.payer.payer_info.shipping_address.postal_code;
            // const shippingCountry = payment.payer.payer_info.shipping_address.country_code;
            const total = payment.transactions[0].amount.details.subtotal;
            const items = payment.transactions[0].item_list.items;
            let arr = [];
            for(let i = 0; i < items.length; i++){
                arr[i] = items[i];
            }
            // const shipping = [shippingLine1,shippingCity,shippingState,shippingPostal,shippingCountry];
            const newOrder = new Order({
                detail: arr,
                shipping: [req.user.address, req.user.state, req.user.postal],
                firstName: req.user.firstName,
                lastName: req.user.lastName,
                subtotal: total,
                paid: true
            })
            newOrder.save()
                .then(order => res.redirect('/success'))
                .catch(err => console.log(err));               
        }
    })
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

//get user info
router.get('/getUserInfo', (req,res) =>{
    User.findById(req.user._id)
        .then(user => res.json(user))
        .catch(err => res.redirect('/login'));
})

//change user info
router.post('/changeUserInfo', (req,res) => {
    const { data, dataType } = req.body;
    const updateParam = { dataType: data }
    User.findOneAndUpdate({ _id: req.user._id}, { $inc: updateParam }, { new: true})
        .then(user => res.json(user))
        .catch(err => res.redirect('/login'));
})

//main page
router.get('/', (req, res) =>{
    res.sendFile(__dirname + "/public/index.html");
})

module.exports = router