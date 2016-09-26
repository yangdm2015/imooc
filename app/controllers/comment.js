
var Comment = require('../models/comment');
var _ = require('underscore')

//comment
exports.save = function(req,res){
  var _comment = req.body.comment
  var movieId = _comment.movie
  var comment = new Comment(_comment)
  comment.save(function(err,comment){
      if(err){
        c(err)
      }
      res.redirect('/movie/'+movieId)
  })  
}


function c(str){
  console.log(str)
}