const express = require('express');
var { itemsModel } = require('../models/itemModel');
const router = express.Router();

router.get('/', (req,res, next)=> {
    itemsModel.find((err, data)=> {
        if (err) {
            res.json({status: 'Error'});
        } else {
            res.json({status:'Success', items: data});
        }
    })
});

router.post('/', (req, res, next)=> {
    var item = new itemsModel(req.body);
    item.save((err, result)=> {
        if (err) {
            res.json({status: 'Error'});
        } else {
            res.json({status: 'Success', data: result});
        }
    })
})

module.exports = router;
