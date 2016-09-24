var express=require('express')
var path = require('path')
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
var session = require('express-session')
var mongoose = require('mongoose')
var mongoStore = require('connect-mongo')(session)
var morgan = require('morgan')
var port = 3002;
var app = express()
var dbUrl = 'mongodb://localhost/imooc'

mongoose.connect(dbUrl)

app.set('views','./views/jade')
app.set('view engine','jade')
/*app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())*/

app.use(bodyParser.json({limit: '1mb'}));  //body-parser 解析json格式数据
app.use(bodyParser.urlencoded({            //此项必须在 bodyParser.json 下面,为参数编码
  extended: true
}));
app.use(cookieParser())
app.use(session({
	secret:'imooc',
	store:new mongoStore({
		url:dbUrl,
		collection:'sessions'
	})
}))

if('development'===app.get('env')){
	app.set('showStackError',true)
	app.use(morgan(':method :url :status'))
	app.locals.pretty=true
	mongoose.set('debug',true)
}

require('./config/routes')(app)
app.listen(port)
app.locals.moment = require('moment')
app.use(express.static(path.join(__dirname,'public')))


console.log('imooc started on port'+port)
app.get('/hi',function(req,res){
	res.send('hello!')
})









