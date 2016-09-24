var _ = require('underscore')
var Movie = require('../models/movie');
var User = require('../models/user');

module.exports = function(app){

	//pre handle user
	app.use(function(req,res,next){
		var _user = req.session.user
		if(_user){
			app.locals.user = _user
		}
			return next()
	})

	//index
	app.get('/',function(req,res){
		c('user in session=')
		c(req.session.user)
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
	function c(str){
		console.log(str)
	}

	//signup
	app.post('/user/signup',function(req,res){
		var _user = req.body.user
		User.find({name:_user.name},function(err,user){
			if(err){
				c(err)
			}
			c('user1= ')
			c(user)
			if(user!=''){
				c('return res.redirect()')
				return res.redirect('/')
			}else{
				var user = new User(_user)
				c('user2= ')
				c(user)
				user.save(function(err,user){
					if(err){
						console.log(err)
					}
					res.redirect('/admin/userlist')
				})
			}
		})
	})

	//signin
	app.post('/user/signin',function(req,res){
		var _user = req.body.user
		var name = _user.name
		var password = _user.password
		User.findOne({name:name},function(err,user){
			if(err){
				c(err)
			}
			if(!user){
				return res.redirect('/')
			}
			user.comparePassword(password,function(err,isMatch){
				if(err){
					c(err)
				}
				if(isMatch){
					req.session.user = user
					c('password is matched')
					return res.redirect('/')
				}else{
					c('password is not matched')
				}
			})

		})
	})
	//logout
	app.get('/logout',function(req,res){
		c('logout')
		delete req.session.user
		delete app.locals.user
		res.redirect('/')
	})
	//userlist
	app.get('/admin/userlist',function(req,res){
		User.fetch(function(err,users) {
			if(err){
				console.log(err)
			}
			res.render('userlist',{
				title:'用户列表页',
				users: users
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

	//list delete user
	app.delete('/admin/userlist',function(req,res){
		var id = req.query.id
		if(id){
			User.remove({_id:id},function(err,user){
				if(err){
					console.log(err)
				}else{
					res.json({success:1})
				}

			})
		}
	})
}