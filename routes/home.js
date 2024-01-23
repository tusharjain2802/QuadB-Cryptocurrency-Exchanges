const express = require('express')
const app = express()
const bodyParser = require("body-parser");
const ejs = require("ejs");
const session = require("express-session");
const bcrypt = require('bcryptjs')
const Item = require('../Models/Item');
const passport = require('passport');
const axios = require('axios');

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));
app.set('view engine', 'ejs');



app.get("/",function(req,res){  
    async function getData(){
        await Item.deleteMany({});
        const apiUrl = 'https://api.wazirx.com/api/v2/tickers';
        const response = await axios.get(apiUrl);
        const first10Items = Object.entries(response.data).slice(0, 10).map(([key, value]) => {
            const { name, last, buy, sell, volume, base_unit } = value;
            return { name, last, buy, sell, volume, base_unit };
          });
        await Item.insertMany(first10Items);
        res.render('index', {allItems: first10Items});
    }
    getData();
    
    
});
app.get("/error",function(req,res){
    res.render("error");
});


  
module.exports = app;