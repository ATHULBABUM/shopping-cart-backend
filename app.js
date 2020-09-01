const express = require('express');
const chalk = require('chalk');
var mongoose = require('mongoose');
var bodyparser = require('body-parser');
var cors = require('cors'); 

var app = new express();

const cartRouter = require('./routes/cartRouter');
const ItemsRouter = require('./routes/itemsRouter');
const checkoutRouter = require('./routes/checkoutRouter');

const port = process.env.PORT|| 3002;
app.use(cors());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({
    extended:true
}));

app.use('/checkout', checkoutRouter);
app.use('/cart', cartRouter);
app.use('/items', ItemsRouter);

app.get('/', (req,res)=> {
    res.send('I am lucky, connected to port: '+ port);
})

mongoose.connect("mongodb://localhost:27017/shoppingCart");
var db =mongoose.connection;
db.on('error', (error)=> {
    console.log(error);
});
db.once('open', ()=> {
    console.log(chalk.yellow('successfully connected mongodb'));
})

app.listen(port, ()=>{
    console.log(chalk.green('server started at: ' + port));
})