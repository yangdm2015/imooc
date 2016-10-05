
var Comment = require('../models/comment');
var _ = require('underscore')
function c(str){console.log(str)}
//comment
exports.save = function(req,res){
  c('%%%%%%%%%%%%%%%%%  in save &&&&&&&&&&&&&&&')
  var _comment = req.body.comment
  c('****************** _comment in save ******************')
  c('****************** _comment in save ******************')
  c('****************** _comment in save ******************')
  c('****************** _comment in save ******************')
  c('****************** _comment in save ******************')
  c('****************** _comment in save ******************')
  c('****************** _comment in save ******************')
  c('****************** _comment in save ******************')
  c('****************** _comment in save ******************')
  c('****************** _comment in save ******************')
  c(_comment)
  var movieId = _comment.movie
  var comment = new Comment(_comment)
  if(_comment.cid){
    c('if(_comment.cid){')
    Comment.findById(_comment.cid,function(err,comment){
      c('****************** what is comment? now******************')
      console.log(comment)
      var reply = {
        from:_comment.from,
        to:_comment.tid,
        content:_comment.content
      }
      comment.reply.push(reply)
      comment.save(function(err,comment){
        if(err){
          c(err)
        }
        res.redirect('/movie/'+movieId)
      })
    })
  }else{
    comment.save(function(err,comment){
        if(err){
          c(err)
        }
        res.redirect('/movie/'+movieId)
    })
  }


}


