const express = require('express');
const router = express.Router();
var { cartModel } = require('../models/cartModel');
var { checkoutModel } = require('../models/checkoutModel');

router.post('/', (req, res, next)=> {
    if (req.body.userId) {
        // user's cart items add to checkout list and removed from cart.
        cartModel.findOne({'userId': req.body.userId}, (err, cart)=> {
            cart.purchaseDate =new Date();
            let checkoutData = {
                userId: cart.userId,
                selectedItems: cart.selectedItems,
                purchaseDate: new Date()
            };
            var checkout = new checkoutModel(checkoutData);
            checkout.save((err, result)=> {
                if(err) {
                    res.json({status: 'Error'});
                }
            }, cartModel.findByIdAndDelete(cart._id, (err, result)=> {
                if (err) {
                    res.json({status: 'Error'});
                } else {
                    res.json({status:'Success', data: result})
                }
            }))
        })
    } else {
        res.json({status: 'User id is missing'});
    }
})

module.exports = router;