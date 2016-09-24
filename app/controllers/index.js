var Movie = require('../models/movie');

exports.index = function(req,res){
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
	}
	function c(str){
		console.log(str)
	}