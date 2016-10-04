var Movie = require('../models/movie');
var Category = require('../models/category');

exports.index = function(req,res){
	Category
		.find({})
		.populate({
			path:'movies',
			select:'title poster',
			options:{limit:5}
		})
		.exec(function(err,categories){
			if(err){
				console.log(err)
			}
			res.render('index',{
				title:'iMovie 首页',
				categories: categories
			})
		})
}
//search page
exports.search = function(req,res){
	var catId = req.query.cat
	var page = parseInt(req.query.p,10)
	var itemsperpage = 2
	var index = page * itemsperpage

	Category
		.find({_id:catId})
		.populate({
			path:'movies',
			select:'title poster'
		})
		.exec(function(err,categories){
			c('in search,category is')
			c(categories)
			if(err){
				console.log(err)
			}
			var category= categories[0]||{}
			var movies = category.movies||[]
			var resultes = movies.slice(index,index+itemsperpage)
			var currentPage = page+ 1
			c('in search,index and itemsperpage and currentPage are')
			c(index)
			c(itemsperpage)
			c(currentPage)
			res.render('results',{
				title:'iMovie 结果列表',
				keyword:category.name,
				currentPage : currentPage,
				query:'cat='+catId,
				totalPage:Math.ceil(movies.length/itemsperpage),
				movies: resultes
			})
		})
}
function c(str){
	console.log(str)
}