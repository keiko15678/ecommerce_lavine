const express = require("express");
const router = express.Router();

const CmsUser = require('./models/cmsusers_model.js');
const Item = require('./models/items_model.js');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//register handle
router.post('/cms/register', (req, res) =>{
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
                                .then(res.redirect('/cms/loginPage'))
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
                        res.cookie('authorization', token);
                        res.redirect('/cms/main');
                    });
                } else{
                    res.redirect('/cms/login');
                }
            });
        } else{
            res.redirect('/cms/login');
        }
    })
})

//main page
router.get('/cms/main', verifyToken, (req, res) =>{
    res.sendFile(__dirname + '/public/cms_pages/main.html')
})

//display login page
router.get('/cms/loginPage', (req, res) =>{
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
        let token = ""
        if(filter.length > 0){
            token = filter.split('=')[1];

            //verify jwt token
            jwt.verify(token, 'secretKey', (err, decodedToken) =>{
                if(err) {
                    //token expired or wrong... etc
                    res.redirect('/cms/loginPage');
                }
                else{
                    next();
                }
            })
        } else{
            //no token
            res.redirect('/cms/loginPage');
        }
    } else{
        //no token
        res.redirect('/cms/loginPage');
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

module.exports = router