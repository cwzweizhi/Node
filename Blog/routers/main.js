var express = require('express');
var router = express.Router();

var Category = require('../models/Category');

var data;


router.use(function(req, res, next){
    data = {
        userInfo: req.userInfo,
        categories: []
    }
    Category.find().then(function(categories){
        data.categories = categories;
        next();
    })

});

router.get('/', function(req, res, next){
    res.render('main/index', data);
})

module.exports = router;