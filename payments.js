const express = require("express");
const router = express.Router();
const paypal = require('paypal-rest-sdk');
const stripeSecretKey = require('./config/keys.js').stripeSecretKey;
const paypalClientId = require('./config/keys.js').paypalClientId;
const paypalClientSecret = require('./config/keys.js').paypalClientSecret;
const paymentUrl = require('./config/keys.js').paymentUrl;
const stripe = require('stripe')(stripeSecretKey);

const User = require('./models/users_model.js');
const Order = require('./models/orders_model.js');

const paypalReturnUrl = paymentUrl +"/pay/paypal/success";
const paypalCancelUrl = paymentUrl +"/cancel";
const stripeCancelUrl = paymentUrl +"/cancel";

paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': paypalClientId,
    'client_secret': paypalClientSecret
  });

//pay with stripe
router.post('/pay/stripe', (req, res) =>{
    const subtotal = req.body.subtotal;
    const items = req.body.item;
    const jsonParse = JSON.parse(items);
    let stripeOrder = {
        payment_method_types: ['card'],
        line_items: [],
        payment_intent_data: {
          capture_method: 'manual',
        },
        success_url: '',
        cancel_url: stripeCancelUrl,
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
    stripeOrder.success_url = paymentUrl +'/pay/stripe/success?order=' + send;
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
        paid: true,
        completed: false
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
        "payer_id": payerId
    };
    paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
        if(error){
            console.log(error.response);
            throw error;
        } else{
            //save to database
            const total = payment.transactions[0].amount.details.subtotal;
            const items = payment.transactions[0].item_list.items;
            let arr = [];
            for(let i = 0; i < items.length; i++){
                arr[i] = items[i];
            }
            const newOrder = new Order({
                detail: arr,
                shipping: [req.user.address, req.user.state, req.user.postal],
                firstName: req.user.firstName,
                lastName: req.user.lastName,
                subtotal: total,
                paid: true,
                completed: false
            })
            newOrder.save()
                .then(order => res.redirect('/success'))
                .catch(err => console.log(err));               
        }
    })
})

//get user info
router.get('/getUserInfo', (req,res) =>{
    User.findById(req.user._id)
        .then(user => res.json(user))
        .catch(err => res.redirect('/login'));
})

//change user info
router.post('/changeUserInfo', (req,res) => {
    const { data, updateField } = req.body;
    const filter = { _id: req.user._id };
    let field = {};
    if(updateField === "firstName"){
        field = { firstName: data }
    } else if(updateField === "lastName"){
        field = { lastName: data }
    } else if(updateField === "address"){
        field = { address: data }
    } else if(updateField === "state"){
        field = { state: data }
    } else if(updateField === "postal"){
        field = { postal: data }
    } else if(updateField === "email"){
        field = { email: data }
    } else if(updateField === "city"){
        field = { city: data }
    } else if(updateField === "country"){
        field = { country: data }
    } else{
        res.redirect('/dashboard');
    }
    User.findOneAndUpdate(filter, field, { useFindAndModify: false, new: true })
        .then(updatedUser => {
            if(updatedUser){
                res.redirect('/dashboard');
            } else{
                res.redirect('/dashboard');
            }
        })
        .catch(err => res.redirect('/login'));
})

//main page
router.get('/', (req, res) =>{
    res.sendFile(__dirname + "/public/index.html");
})

module.exports = router