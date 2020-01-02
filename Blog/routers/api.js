var express = require('express');
var router = express.Router();
var User = require('../models/User');

//统一格式返回格式
var responseData;

router.use(function(req, res, next){
    responseData = {
        code: 0,
        message: ''
    }
    next();
});


router.post('/user/register', function(req, res, next) {

    var username = req.body.username;
    var password = req.body.password;
    var repassword = req.body.repassword;

    //用户是否为空
    if ( username == '' ) {
        responseData.code = 1;
        responseData.message = '用户名不能为空';
        res.json(responseData);
        return;
    }
    //密码不能为空
    if (password == '') {
        responseData.code = 2;
        responseData.message = '密码不能为空';
        res.json(responseData);
        return;
    }
    //两次输入的密码必须一致
    if (password != repassword) {
        responseData.code = 3;
        responseData.message = '两次输入的密码不一致';
        res.json(responseData);
        return;
    }

    //用户名是否已经被注册了，如果数据库中已经存在和我们要注册的用户名同名的数据，表示该用户名已经被注册了
    User.findOne({
        username: username
    }).then(function( userInfo ) {
        if ( userInfo ) {
            //表示数据库中有该记录
            responseData.code = 4;
            responseData.message = '用户名已经被注册了';
            res.json(responseData);
            return;
        }
        //保存用户注册的信息到数据库中
        var user = new User({
            username: username,
            password: password
        });
        return user.save();
    }).then(function(newUserInfo) {
        responseData.message = '注册成功';
        res.json(responseData);
    });
});

//登录
router.post('/user/login', (req, res) => {
    var username = req.body.username;
    var password = req.body.password;

    if ( username == '' || password == '' ) {
        responseData.code = 1;
        responseData.message = '用户名和密码不能为空';
        res.json(responseData);
        return;
    }

    User.findOne({
        username,
        password
    }).then((userInfo) => {
        if (!userInfo) {
            responseData.code = 2;
            responseData.message = '用户名或密码错误';
            res.json(responseData);
            return;
        }
          //用户名和密码是正确的
          responseData.message = '登录成功';
          responseData.userInfo = {
              _id: userInfo._id,
              username: userInfo.username
          }
          req.cookies.set('userInfo', JSON.stringify({
            _id: userInfo._id,
            username: userInfo.username
          }));
          res.json(responseData);
          return;

    })
});


router.get('/user/logout', function(req, res){
    req.cookies.set('userInfo', null);
    res.json(responseData);
})





module.exports = router;