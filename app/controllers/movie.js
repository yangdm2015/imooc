
var Comment = require('../models/comment');
var Movie = require('../models/movie');
var _ = require('underscore')
//detail

exports.detail=function(req,res){
	var id = req.params.id

	Movie.findById(id,function(err,movie){
		Comment
		.find({movie:id})
		.populate('from','name')
		.populate('reply.from reply.to','name')
		.exec(function(err,comments){
			c('comments')
			c(comments)
			if(err){
						console.log("*********here is err33333!*************")
						console.log(err)
					}
			res.render('detail',{
				title: 'iMovie'+movie.title,
				movie: movie,
				comments:comments
			})
		})
	})
}

//admin new page
	exports.new = function(req,res){
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
	}
//admin update
exports.update=function(req,res){
	var id = req.params.id
	if(id){
		Movie.findById(id,function(err,movie){
			res.render('admin',{
				title:'imooc 后台更新页',
				movie:movie
			})
		})
	}
}
//admin post movie
exports.save = function(req,res){
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
	}


	//list page
	exports.list=function(req,res){
		Movie.fetch(function(err,movies) {
			if(err){
				console.log(err)
			}
			res.render('list',{
				title:'imooc 列表页',
				movies: movies
			})
		})
	}

	//list delete movie
	exports.del=function(req,res){
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
	}
	function c(str){
	console.log(str)
}