var express=require('express')
var path = require('path')
var bodyParser = require('body-parser')
var mongoose = require('mongoose')
var _ = require('underscore')
var Movie = require('./models/movie');
var port = 3002;
var app = express()

mongoose.connect('mongodb://localhost/imooc')


app.set('views','./views/jade')
app.set('view engine','jade')
/*app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())*/


app.use(bodyParser.json({limit: '1mb'}));  //body-parser 解析json格式数据
app.use(bodyParser.urlencoded({            //此项必须在 bodyParser.json 下面,为参数编码
  extended: true
}));
app.locals.moment = require('moment')

app.use(express.static(path.join(__dirname,'public')))
app.listen(port)

console.log('imooc started on port'+port)
app.get('/hi',function(req,res){
	res.send('hello!')
})


//index
app.get('/',function(req,res){
	Movie.fetch(function(err,movies) {
		if(err){
			console.log(err)
		}
		res.render('index',{
			title:'iMovie 首页',
			movies: movies
		})
	})
})
//detail
app.get('/movie/:id',function(req,res){

	console.log("^^^^^^^^^^ 进入 detail! ^^^^^^^^^^")
	var id = req.params.id
	console.log("######### req.params is   ##########")
	console.log(req.params)
	console.log("*********params ended!*************")
	
	Movie.findById(id,function(err,movie){
		console.log("\n\n^^^^^^^^^^ 进入 detail里的findById!，此时movie是： ^^^^^^^^^^")
		console.log(movie)
	  console.log("*********movie ended!*************\n\n")
	if(err){
				console.log("*********here is err33333!*************")
				console.log(err)
			}
		res.render('detail',{
			title: 'iMovie'+movie.title,
			movie: movie
		})

	})
})
//admin
app.get('/admin/movie',function(req,res){
	res.render('admin',{
		title:'iMovie 后台管理',
		movie: {
			title: ' ',
			doctor: ' ',
			country: ' ',
			year: ' ',
			language: ' ',
			summary: ' ',
			poster: ' ',
			flash: ' '
		}
	})
})
//admin update
app.get('/admin/update/:id',function(req,res){
	var id = req.params.id
	if(id){
		Movie.findById(id,function(err,movie){
			res.render('admin',{
				title:'imooc 后台更新页',
				movie:movie
			})
		})
	}
})

app.post('/admin/movie/new',function(req,res){
	/*console.log(req.body.movie);
	console.log(req.body.movie.title);*/
	console.log("|||||||||| here is new! ||||||||||||||")
	var id = req.body.movie._id
	var movieObj = req.body.movie
	var _movie
	if(id !== 'undefined'){
		Movie.findById(id,function(err,movie) {
			
			if(err){
				console.log("*********here is err11111!*************")
				console.log(err)
			}
			
			_movie = _.extend(movie,movieObj)
			_movie.save(function(err,movie){
				if(err){
					console.log("*********here is err22222!*************")
					console.log(err)
				}
				/*console.log("movie is "+movie)*/
				res.redirect('/movie/'+movie._id)
			})
		})
	}else{
		_movie = new Movie({
			doctor: movieObj.doctor,
		  title: movieObj.title,
		  language:movieObj.language,
		  conutry:movieObj.conutry,
		  summary:movieObj.summary,
		  flash:movieObj.flash,
		  poster:movieObj.poster,
		  year:movieObj.year,
		})
		_movie.save(function(err,movie){
				if(err){
					console.log("error incurred2222 movie="+movie)
					console.log(err)
				}
				/*console.log("error incurred111111 movie="+movie)*/
				res.redirect('/movie/'+movie._id)
		})
	}
})

//list
app.get('/admin/list',function(req,res){
	Movie.fetch(function(err,movies) {
		if(err){
			console.log(err)
		}
		res.render('list',{
			title:'imooc 列表页',
			movies: movies
		})
	})	
})

//list delete movie
app.delete('/admin/list',function(req,res){
	var id = req.query.id
	if(id){
		Movie.remove({_id:id},function(err,movie){
			if(err){
				console.log(err)
			}else{
				res.json({success:1})
			}

		})
	}
})










