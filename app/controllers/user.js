var User = require('../models/user');
function c(str){console.log(str)}
//signup
exports.showSignup = function(req,res){
	c('in showSignup')
	res.render('signup',{
		title:'用户注册页面'
	})
}
exports.showSignin = function(req,res){
	res.render('signin',{
		title:'用户登陆页面'
	})
}
exports.signup=function(req,res){
		var _user = req.body.user
		User.findOne({name:_user.name},function(err,user){
			if(err){
				c(err)
			}
			c('user1= ')
			c(user)
			if(user){//这里之前有问题，使用find方法，返回user是一个数组，当user还没有被注册时，user='',而if(user)为真，所以不能正确注册。当换成findOne方法后，就没有问题了
				c('return res.redirect(signin)')
				return res.redirect('/signin')
			}else{
			  user = new User(_user)
				c('user2= ')
				c(user)
				user.save(function(err,user){
					if(err){
						console.log(err)
					}
					res.redirect('/')
				})
			}
		})
	}

	//signin
	exports.signin=function(req,res){
		var _user = req.body.user
		var name = _user.name
		var password = _user.password
		User.findOne({name:name},function(err,user){
			if(err){
				c(err)
			}
			if(!user){//当找不到user时， user = ''  !user = true
				c('!user!')
				return res.redirect('/signup')
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
					return res.redirect('/signin')
				}
			})

		})
	}
	//logout
	exports.logout=function(req,res){
		c('logout')
		delete req.session.user
		/*delete app.locals.user*/
		res.redirect('/')
	}
	//userlist
exports.list = function(req,res){
	User.fetch(function(err,users) {
		if(err){
			console.log(err)
		}
		res.render('userlist',{
			title:'用户列表页',
			users: users
		})
	})
}
	//midware for user
exports.signinRequired = function(req,res,next){
	var user = req.session.user
	c('current user is ')
	c(user)
	if(!user){
		return res.redirect('/signin')
	}
	next()
}
exports.adminRequired = function(req,res,next){

	var user = req.session.user
	c('^^^user.role=^^^')
  c(user.role)
	if(user.role<=10){
		return res.redirect('/signin')
	}
	next()
}
exports.del=function(req,res){
	var id = req.query.id
	c('in del user! id = ')
	c(id)
	if(id){
		User.remove({_id:id},function(err,user){
			if(err){
				c('err!')
				console.log(err)
			}else{
				c('success!')
				res.json({success:1})
			}

		})
	}
}
