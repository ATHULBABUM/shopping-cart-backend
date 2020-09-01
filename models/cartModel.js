const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var cartSchema = new Schema({
    userId: String,
    selectedItems: [ {
        itemId: String,
        quantity: Number,
        promocodeApplied: {type: Boolean, default: 'false'}
    } ],
})

var cartModel = mongoose.model('cart', cartSchema);
module.exports = { cartModel };