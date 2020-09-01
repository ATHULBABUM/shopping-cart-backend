const mongoose = require('mongoose');
const schema = mongoose.Schema;

var checkoutSchema = new schema({
    userId: String,
    selectedItems: [ {
        itemId: String,
        quantity: Number
    } ],
    purchaseDate: Date
})

var checkoutModel = mongoose.model('checkout', checkoutSchema);
module.exports = { checkoutModel };