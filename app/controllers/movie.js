
var Comment = require('../models/comment');
var Category = require('../models/category');
var Movie = require('../models/movie');
var _ = require('underscore')
var fs = require('fs')
var path = require('path')
//detail

exports.detail=function(req,res){
	var id = req.params.id;
	Movie.update({_id:id},{$inc:{pv:1}},function(err){
		if(err){
			c(err)
		}
	})

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
//admin update
/*exports.update=function(req,res){
	var id = req.params.id
	if(id){
		Movie.findById(id,function(err,movie){
			Category.find({},function(err,categories){
				res.render('admin',{
					title:'imooc 后台更新页',
					movie:movie,
					categories:categories,
					categoryName:category.name
				})
			})
		})
	}
}*/
//admin update
exports.update=function(req,res){
	var id = req.params.id
	if(id){
		Movie.findOne({_id:id})
		.exec(function(err,movie){
			var opts = [{
          path   : 'category',
          select : 'name'
      }];
			movie.populate(opts,function(err){
				c('movie')
				c(movie)
				Category.find({},function(err,categories){
					res.render('admin',{
						title:'imooc 后台更新页',
						movie:movie,
						categories:categories,
					})
				})
			})
		})
	}
}
//admin new page
exports.new = function(req,res){
	Category.find({},function(err,categories){
		c('all categories are ')
		c(categories)
		res.render('admin',{
			title:'iMovie 后台管理',
			categories:categories,
			movie: {}
		})
	})
}

//admin poster
exports.savePoster = function(req,res,next){
	var posterData = req.files.uploadPoster
	var filePath = posterData.path
	var originalFilename = posterData.originalFilename

	c('posterData')
	c(posterData)

	if(originalFilename){
		fs.readFile(filePath,function(err,data){
			var timestamp = Date.now()
			var type = posterData.type.split('/')[1]
			var poster = timestamp+'.'+type
			var newPath = path.join(__dirname,'../..','public/upload/'+poster)
			fs.writeFile(newPath,data,function(err){
				req.poster = poster
				next()
			})
		})
	}else{
		next()
	}
}

//admin post movie
exports.save = function(req,res){
	console.log("|||||||||| here is new! ||||||||||||||")
	var movieObj = req.body.movie
	var id = req.body.movie._id
	var _movie
	if(req.poster){
		movieObj.poster = req.poster
	}
	c("movieObj")
	c(movieObj)
	if(id ){
		c('if(id)!!!!! ')
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
		_movie = new Movie(movieObj)
		var categoryId = movieObj.category
		var categoryName = movieObj.categoryName
		c('_movie')
		c(_movie)
		c('categoryName')
		c(categoryName)
		_movie.save(function(err,movie){
				if(err){
					console.log("error incurred2222 movie="+movie)
					console.log(err)
				}else{
					if(categoryId){
						Category.findById(categoryId,function(err,category){
							category.movies.push(_movie.id)
							category.save(function(err,category){
								res.redirect('/movie/'+movie._id)
							})
						})
					}else if(categoryName){
						var category = new Category({
							name:categoryName,
							movies:[_movie.id]
						})
						c('category')
						c(category)
						category.save(function(err,category){
							movie.category = category._id
							movie.save(function(err,movie){
								res.redirect('/movie/'+movie._id)
							})
						})
					}
				}
		})
	}
}


//list page
exports.list=function(req,res){
	Movie.find({})
	.populate('category','name')
	.exec(function(err,movies) {
		c('movies')
		c(movies)
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