const mongoose = require('mongoose');
const schema = mongoose.Schema;

var itemSchema = new schema({
    ItemName: String,
    itemId: Number,
    prize: Number,
    company: String,
    promocode: String,
    imageUrl: String
});

var itemsModel = mongoose.model('items', itemSchema);
module.exports = { itemsModel };

