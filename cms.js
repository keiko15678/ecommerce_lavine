const express = require("express");
const router = express.Router();

const CmsUser = require('./models/cmsusers_model.js');
const Item = require('./models/items_model.js');
const Order = require('./models/orders_model.js');
const User = require('./models/users_model.js');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


//inquiries page
router.get('/cms/inquiries', (req, res) =>{
    res.sendFile(__dirname + '/public/cms_pages/inquiries.html');
})

//users page
router.get('/cms/users', (req, res) =>{
    res.sendFile(__dirname + '/public/cms_pages/users.html');
})

//items page
router.get('/cms/items', (req, res) =>{
    res.sendFile(__dirname + '/public/cms_pages/items.html');
})

//orders page
router.get('/cms/orders', (req, res) =>{
    res.sendFile(__dirname + '/public/cms_pages/orders.html');
})

//register page
router.get('/cms/register', (req, res) =>{
    res.sendFile(__dirname + '/public/cms_pages/register.html');
})
//register handle
router.post('/cms/registerForm', (req, res) =>{
    const { email, password } = req.body;
    let errors = [];

    if(!email || !password){
        errors.push('Please fill in all fields. ');
    }
    if(errors.length > 0){
        res.send(errors)
    } else{
        //check user exist
        CmsUser.findOne({ email: email })
            .then(cmsUser => {
                if(cmsUser){
                    errors.push('Email is already registered.');
                } else{
                    const newCmsUser = new CmsUser({
                        email,
                        password
                    })
                    //hash password
                    bcrypt.genSalt(10, (err, salt) =>{
                        bcrypt.hash(newCmsUser.password, salt, (err, hash) =>{
                            if(err) throw err;
                            newCmsUser.password = hash;
                            newCmsUser.save()
                                .then(res.redirect('/cms/'))
                                .catch(err => console.log(err));  
                                console.log('cms user registered')                            
                        })
                    })
                }
            })
            .catch(err => console.log(err));
    } 
})

//login handle
router.post('/cms/login', (req, res) =>{
    const { email, password } = req.body;
    CmsUser.findOne({ email: email }, (err, cmsUser) =>{
        if(err) throw err;
        if(cmsUser){
            bcrypt.compare(password, cmsUser.password, (err, isMatch) =>{
                //logging in
                if(isMatch){
                    jwt.sign({ user: cmsUser }, 'secretKey', { expiresIn: '10h'}, (err, token) =>{
                        let emailForCookieSplit = email.split('@');
                        let emailForCookie = emailForCookieSplit[0] + '_' + emailForCookieSplit[1];
                        res.cookie('authorization', token + '!' + emailForCookie);
                        res.redirect('/cms/main');
                    });
                } else{
                    res.redirect('/cms/');
                }
            });
        } else{
            res.redirect('/cms/');
        }
    })
})

//main page
router.get('/cms/main', verifyToken, (req, res) =>{
    res.sendFile(__dirname + '/public/cms_pages/main.html')
})

//display login page
router.get('/cms/', (req, res) =>{
    res.sendFile(__dirname + '/public/cms_pages/login.html');
})

//verify token middleware
//Token format- Authorization: Bearer 'YourToken'
function verifyToken(req, res, next){
    //check with cookie
    if(typeof req.headers.cookie !== 'undefined'){
        const parseCookie = req.headers.cookie.split(' ');
        let filter = "";
        for(let i = 0; i < parseCookie.length; i++){
            if(parseCookie[i].includes('authorization')){
                filter = parseCookie[i];        
            }
        }
        let tokenArr = "";
        if(filter.length > 0){
            tokenArr = filter.split('=')[1];
            let token = tokenArr.split('!')[0];

            //verify jwt token
            jwt.verify(token, 'secretKey', (err, decodedToken) =>{
                if(err) {
                    //token expired or wrong... etc
                    res.redirect('/cms/');
                }
                else{
                    next();
                }
            })
        } else{
            //no token
            res.redirect('/cms/');
        }
    } else{
        //no token
        res.redirect('/cms/');
    }
    
    //check with header
    // const bearerHeader = req.headers['authorization'];
    // console.log(req.headers['authorization'])
    // if(typeof bearerHeader !== 'undefined'){
    //     //get token out of header
    //     const bearer = bearerHeader.split(' ');
    //     const token = bearer[1];
    //     //set the token
    //     req.token = token;
        
    //     next();
    // } else{
    //     res.sendStatus(403);
    // }
}
//remove user by id
router.get('/users/remove/:id', (req,res) =>{
    const id = req.params.id;
    User.findByIdAndDelete(id)
        .then(users => res.redirect('/cms/users'))
})
//activate user by id
router.get('/users/activate/:id', (req,res) =>{
    const id = req.params.id;
    User.findByIdAndUpdate(id, { status: true })
        .then(users => res.redirect('/cms/users'))
})

//deactivate user by id
router.get('/users/deactivate/:id', (req,res) =>{
    const id = req.params.id;
    User.findByIdAndUpdate(id, { status: false })
        .then(users => res.redirect('/cms/users'))
})

//get valid users
router.get('/users/valid', (req,res) =>{
    User.find({status: true})
        .then(users => res.send(users))
})
//get invalid users
router.get('/users/invalid', (req,res) =>{
    User.find({status: false})
        .then(users => res.send(users))
})

//get all users
router.get('/users', (req,res) =>{
    User.find()
        .then(users => res.send(users))
})

//get newest 3 users
router.get('/users/latest', (req,res) =>{
    User.find()
        .sort({ date: -1 })
        .limit(3)
        .then(users => res.send(users))
})

//get incomplete(active) orders
router.get('/orders/incomplete', (req, res) =>{
    Order.find({ completed: false })
        .sort({ date: 1})
        .then(orders => res.send(orders))
})

//get completed orders
router.get('/orders/complete', (req, res) =>{
    Order.find({ completed: true })
        .sort({ date: 1})
        .then(orders => res.send(orders))
})

//get all orders
router.get('/orders', (req, res) =>{
    Order.find()
        .sort({ date: 1})
        .then(orders => res.send(orders))
})

//mark order as complete by id
router.get('/orders/complete/:id', (req, res) =>{
    const id = req.params.id;
    Order.findByIdAndUpdate(id, { completed: true })
        .then(orders => res.redirect('/cms/orders'))
})

//mark order as incomplete by id
router.get('/orders/incomplete/:id', (req, res) =>{
    const id = req.params.id;
    Order.findByIdAndUpdate(id, { completed: false })
        .then(orders => res.redirect('/cms/orders'))
})

// //delete all orders
// router.delete('/orders/delete', (req, res) => {
//     Order.remove()
//         .then(item => res.json(item))
// })

//get active items
router.get('/items/active', (req, res) => {
    Item.find({ status: true })
        .sort({ date: -1 })
        .then(items => res.json(items))
})

//get inactive items
router.get('/items/inactive', (req, res) => {
    Item.find({ status: false })
        .sort({ date: -1 })
        .then(items => res.json(items))
})

//inactivate item by id
router.get('/items/inactive/:id', (req, res) =>{
    const id = req.params.id;
    Item.findByIdAndUpdate(id, {status: false})
        .then(item => res.redirect('/cms/items'))
})

//activate item by id
router.get('/items/active/:id', (req, res) =>{
    const id = req.params.id;
    Item.findByIdAndUpdate(id, {status: true})
        .then(item => res.redirect('/cms/items'))
})

//get all items
router.get('/items', (req, res) => {
    Item.find()
        .sort({ date: 1 })
        .then(items => res.json(items))
})

//get one item by id
router.get('/items/:id', (req, res) => {
    const id = req.params.id;
    Item.findById(id)
        .then(item => res.json(item))
})

//delete an item by id
router.get('/items/remove/:id', (req, res) => {
    const id = req.params.id
    Item.findByIdAndRemove(id)
        .then(item => res.redirect('/cms/items'))
})

//delete all items
router.delete('/items', (req, res) => {
    Item.remove()
        .then(item => res.json(item))
})



//add an item
router.post('/items', (req, res) => {
    console.log(req.body)
    const { name, price, imgURL, stock, description, delivery, specifications, status, gender } = req.body;
    const item = new Item({
        name, //req.body.name
        price, //req.body.price
        imgURL,
        type: 'shoes',
        gender,
        describe: description,
        // productDetails: [],
        delivery,
        specifications,
        // reviews: ['great','awesome'],
        // questions: ['question','answer'],
        // slideshow: ['https://www.adidas.com.ph/dw/image/v2/bcbs_prd/on/demandware.static/-/Sites-adidas-products/default/dw3aa60fd2/zoom/F36199_01_standard.jpg?sh=320&strip=false&sw=320'],
        // rating: '',
        stock,
        status
    })
    item.save()
        .then(item => res.redirect('/cms/items'))
        .catch(err => console.log(err));
    //create test item
    // const item = new Item({
    //     name : 'Blue High tops', //req.body.name
    //     price: '32.50', //req.body.price
    //     imgURL: 'https://www.adidas.com.ph/dw/image/v2/bcbs_prd/on/demandware.static/-/Sites-adidas-products/default/dw3aa60fd2/zoom/F36199_01_standard.jpg?sh=320&strip=false&sw=320', //req.body.imgURL
    //     type: 'shoes',
    //     gender: 'female',
    //     describe: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Rem, minus!',
    //     productDetails: [],
    //     delivery: '2 day shipping',
    //     specifications: 'real leather',
    //     reviews: ['great','awesome'],
    //     questions: ['question','answer'],
    //     slideshow: ['https://www.adidas.com.ph/dw/image/v2/bcbs_prd/on/demandware.static/-/Sites-adidas-products/default/dw3aa60fd2/zoom/F36199_01_standard.jpg?sh=320&strip=false&sw=320'],
    //     rating: '',
    //     stock: '10',
    //     status: false        
    // })
    // item.save()
    //     .then(item => res.json(item))
    //     .catch(err => console.log(err));
})

module.exports = router