var path = require('path');
var express = require('express'); 
var swig = require('swig');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var Cookies = require('cookies');
var app = express();

var User = require('./models/User');


app.engine('html', swig.renderFile); //定义当前应用所使用的模板引擎
app.set('views', './views');
app.set('view engine', 'html');
swig.setDefaults({cache: false});

// app.get('/', function(req, res){
//     // res.send('<h1>Hello World!</h1>');
//     res.render('index', {data:'my data'});
// })

//托管静态文件
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended: true}));

//设置cookie
app.use( function(req, res, next) {
    req.cookies = new Cookies(req, res);

    //解析登录用户的cookie信息
    req.userInfo = {};
    if (req.cookies.get('userInfo')) {
        try {
            req.userInfo = JSON.parse(req.cookies.get('userInfo'));

            //获取当前登录用户的类型，是否是管理员
            User.findById(req.userInfo._id).then(function(userInfo) {
                req.userInfo.isAdmin = Boolean(userInfo.isAdmin);
                next();
            })
        }catch(e){
            next();
        }

    } else {
        next();
    }
} );


/*
* 根据不同的功能划分模块
* */
app.use('/admin', require('./routers/admin'));
app.use('/', require('./routers/main'));
app.use('/api', require('./routers/api'));





//连接数据库
mongoose.connect('mongodb://localhost:27017/blog', function(err){
    if(err){
        console.log('数据库连接失败');
    }else{
        console.log('数据库连接成功');
        app.listen(3000);
    }
})

