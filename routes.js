const express = require("express")
const router = express.Router()

const Item = require('./models/items_model.js')


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