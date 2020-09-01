const express = require('express');
var { cartModel } = require('../models/cartModel');
var { itemsModel } = require('../models/itemModel');
const router = express.Router();


router.get('/', (req,res, next)=> {
    if(req.body.userId) {
        cartModel.findOne({'userId': req.body.userId},(err, cart)=> {
            try{
                let selectedItemsIds = []
                cart.selectedItems.forEach((element)=> {
                    selectedItemsIds.push(element.itemId);
                });
                //keep the items id in an array for find items details from items collection and return with the count
                itemsModel.find({
                    'itemId': { $in: selectedItemsIds}
                },(err, itemsData)=> {
                    cart.itemsList = itemsData
                    let cartListData = {
                        selectedItems: cart.selectedItems,
                        itemDetailsList: itemsData
                    }
                    res.json({data : cartListData});
                })
            }
            catch(err) {
                res.json({status:'Error'});
            }
    
        });
    } else {
        res.json('User id is required');
    }

});

router.post('/addtoCart', (req, res)=> {
    // add new items in to cart, upsert used for to create if its not existing for user.
    if (req.body.userId && req.body.selectedItems.itemId) {
        cartModel.updateOne({'userId': req.body.userId}, {$addToSet: {'selectedItems': req.body.selectedItems}}, { upsert: true },
            (err, result)=> {
                if(err) {
                    res.json({status: 'Error'});
                } else {
                    res.json({status:'Success', data: result});
                }
            });
    } else {
        res.json({status: "User id or selected item is missing"});
    }
});

router.patch('/editCart', (req, res)=> {
    //update the count of item in cart.
    cartModel.findOne({'userId': req.body.userId}, (err, cart)=> {
        if (err) {
            res.json({status:'Error'});
        } else {
            cart.selectedItems.forEach((element)=> {
                if (element.itemId == req.body.selectedItems.itemId) {
                    element.quantity = req.body.selectedItems.quantity;                 
                } else {
                    return;
                }
            })
        }
        cart.save((err, result)=> {
            if(err) {
                res.json({status:'Error'});
            } else {
                res.json({status: 'Success', data: result});
            }
        });
    });
});

router.post('/promocodeCheck', (req, res, next)=> {
    if(req.body.itemId && req.body.promocode) {
        
        itemsModel.findOne({'itemId': req.body.itemId}, (err, item)=> {
            try {
                //check promocode and if equal change the flag of item in cart.
                if (item.promocode === req.body.promocode) {
                    cartModel.findOne({'userId': req.body.userId}, (err, cart)=> {
                        cart.selectedItems.forEach((element)=> {
                            if (element.itemId === req.body.itemId) {
                                element.promocodeApplied = true;
                            } else {
                                return;
                            }
                        })
                        cart.save((err, result)=> {
                            if(err) {
                                res.json({status:'Error'});
                            } else {
                                res.json({status: 'promoCode Applied', data: result});
                            }
                        });
                    })
                } else {
                    res.json({status:'promoCode Invalid'});
                }
            }
            catch(err) {
                res.json({status: 'Error'});
            }
        })
     
    } else {
        res.json({status:'Item id or promocode is misiing'});
    }
})

router.delete('/deleteItem', (req,res, next)=> {
    // delete the item from the cart based on item id
    cartModel.findOne({'userId':req.body.userId}, (err, cart)=> {
        try{
            cart.selectedItems.splice(cart.selectedItems.findIndex((item)=> item.itemId === req.body.itemId), 1);
            cart.save((err, result)=> {
                if(err) {
                    res.json({status:'Error'});
                } else {
                    res.json({status: 'Success', data: result});
                }
            });
        }
        catch(err) {
            res.json({status: 'Error'});
        }
    })
});

module.exports = router;