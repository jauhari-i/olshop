const express = require('express')
const cors = require('cors')
const faker = require('faker')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const app = express()

const Category = require('../models/Category')
const Product = require('../models/Product')
const User = require('../models/User')


app.use(cors())
process.env.SCRET_KEY = "secret"

app.post('/register',(req,res) => {
    var first_name = req.body.first_name
    var last_name = req.body.last_name
    var username = req.body.username
    var email = req.body.email
    var password = req.body.password
    if(!first_name || !last_name || !username || !email || !password){
        res.json({ error: 'Please fill all fields' })
    }else{
        User.findOne({username: username},(err,users) => {
            if(users){
                // console.log(users)
                res.json({ error: 'Username already used' })
            }else if(err){
                res.json({ error: err })
            }else{
                User.findOne({email: email},(err,user) => {
                    if(user){
                        res.json({ error: 'Email already used' })
                    }else if(err){
                        res.json({ error: err})
                    }else{
                        bcrypt.hash(password,10,(err,hash) => {
                            if(err){
                                res.json({ error: err})
                            }
                            const newuser = {
                                first_name: first_name,
                                last_name: last_name,
                                username: username,
                                email: email,
                                password: hash,
                            }
                            User.create(newuser,(err,user) => {
                                if(err){
                                    res.json({ error: err})
                                }else{
                                    res.json({ success: newuser.email + ' registered' })
                                }
                            })
                        })
                    }
                })
            }
        })
    }
})

app.post('/login',(req,res) => {
    var username = req.body.usernameOrEmail
    var password = req.body.password
    var criteria = (username.indexOf('@') === -1) ? {username: username} : {email: username};
    User.findOne(criteria,(err, user)=>{
        if(err){
            res.json({ error: err })
        }else if(user){
            if(bcrypt.compareSync(password,user.password)){
                const usertoken = {
                    _id: user._id,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email,
                }
                let token = jwt.sign(usertoken,process.env.SCRET_KEY,{
                    expiresIn: 1440
                })
                res.json({ token: token})
            }else{
                res.json({ error: 'Wrong Password'})
            }
        }else{
            res.json({ error: 'User not found' })
        }
    })
})

// app.get('/fakeproduct',(req,res) => {
//     for(var i = 0; i < 5; i++){
//         var newProduct = new Product()

//         newProduct.name = faker.commerce.productName()
//         newProduct.deskription = faker.commerce.productAdjective()
//         newProduct.value = 10
//         newProduct.price = faker.commerce.price()
//         newProduct.category = faker.commerce.productMaterial()
//         newProduct.owner = faker.company.companyName()
//         newProduct.save(function(err) {
//             if (err) {throw err}
//         })
//     }
//     res.send('Faked')
// })

// app.get('/fakecat',(req,res) => {
//     for(var i = 0;i < 5 ; i++){
//         var newCat = new Category()
//         newCat.name = faker.commerce.productMaterial()
//         newCat.save((err) => {
//             if(err){
//                 throw err
//             }
//         })
//     }
//     res.send('Faked')
// })

app.get('/product',(req,res) => {
    Product.find({},(err,product) => {
        if(err){
            res.json(err)
        }else{
            res.json(product)
        }
    })
})

app.post('/product',(req,res) => {
    var name = req.body.name
    var deskription = req.body.deskription
    var value = req.body.value
    var price = req.body.price
    var category = req.body.category
    var owner = req.body.username

    if(!name || !deskription || !value || !price || !category || !owner ){
        res.json({ error: 'Please fill all field'})
    }else{
        var newProduct = {
            name: name,
            deskription: deskription,
            value: value,
            price: price,
            category: category,
            owner: owner,
        }
        Product.create(newProduct,(err) => {
            if(err){
                res.json(err)
            }else{
                res.json({ success: 'Item is added' })
            }
        })
    }

})

app.delete('/product/:id',(req,res) => {
    var id = req.params.id
    Product.findByIdAndRemove({_id: id},(err,resp) => {
        if(err){
            res.json(err)
        }else{
            res.json({ success: 'Item deleted' })
        }
    })
})

app.put('/product/:id',(req,res) => {
    var id = req.params.id
    var data = req.body
    Product.findByIdAndUpdate(id,data,(err) => {
        if(err){
            res.json(err)
        }else{
            res.json({ success: 'Item Updated' })
        }
    })
})

app.get('/category',(req,res) => {
    Category.find({},(err,cat) => {
        if(err){
            res.json({ error: err })
        }else{
            res.json({ category: cat})
        }
    })
})

app.post('/category',(req,res) => {
    var name = req.body.catname
    Category.findOne({name: name},(err,cat) => {
        if(err){
            res.json({ error: err})
        }else if(cat){
            res.json({ error: 'Category already exist' })
        }else{
            var newCat = new Category()
            newCat.name = name
            newCat.save((err) => {
                if(err){ throw err}
            })
            res.json({ success: 'Category Added' })
        }
    })
})

app.delete('/category/:id',(req,res) => {
    var id = req.params.id
    if(!id){
        res.json({ error: 'Cannot get parameter' })
    }else{
        Category.findByIdAndRemove({_id: id},(err,cat) => {
            if(err){
                res.json({ error: err})
            }else{
                res.json({ success: 'Category Deleted' })
            }
        })
    }
})

app.put('/category/:id',(req,res) => {
    var id = req.params.id
    var name = req.body.catname
    var data = {
        name: name
    }
    Category.findByIdAndUpdate(id,data,(err,updated) => {
        if(err){
            res.json({error: err, msg: `Cant't find category id`})
        }else{
            res.json({ success: 'Category Updated' })
        }
    })
})

module.exports = app