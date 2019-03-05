const {User} = require('./../models/user');

const authenticate = (req, res, next)=>{
	let token = req.cookies.jwt;
	// console.log(token.length);
	if(!token){
		console.log('auth token missing')
		// return Promise.reject();
		res.redirect('/login');
	}
	User.findByToken(token).then((user)=>{
		if(!user){
			return Promise.reject();
		};

		req.user = user;
		next();
	}).catch((e)=>{

		res.clearCookie('jwt');
		res.redirect('/login');
	});
};


const loginCheck = (req, res, next)=>{
	let token = req.cookies.jwt;
	if(!token){

		return next();
	}
	User.findByToken(token).then((user)=>{
		if(user){
			res.redirect('/home');
			next();
		};
	}).catch((e)=>{
		next();
	})
}



module.exports = {authenticate, loginCheck};