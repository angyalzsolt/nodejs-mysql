const Sequelize = require('sequelize');
const db = require('./../database/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// const generatePassword = require('./../utils/hash');


const User = db.define('user', {
	name: {
		type: Sequelize.STRING,
		validate: {
			notEmpty: {
				msg: 'Please add name.'
			}		}
	},
	email: {
		type: Sequelize.STRING,
		unique: {
			msg: 'Email address already exists.'
		}
	},
	password: {
		type: Sequelize.STRING,
		validate: {
			notEmpty: {
				msg: 'Please add password.'
			}
		}
	},
	location: {
		type: Sequelize.STRING,
		allowNull: true

	},
	token: {
		type: Sequelize.STRING,
		allowNull: true
	}
	}, {
	freezeTableName: true
});


User.prototype.generateAuthToken = function(){
	let user = this;
	if(user.token !== null){
		return Promise.reject();
	};
	let token = jwt.sign({
		exp: Math.floor(Date.now() / 1000) + 1000,
		_id: user.id
	}, 'secret').toString();
	user.token = token;
	return user.save().then(()=>{
		return token;
	});
};


User.findByToken = function(token){
	let user = this;
	let decoded;
	try {
		decoded = jwt.verify(token, 'secret');
	} catch(e){
		return Promise.reject();
	};
	return User.findOne({where:{id: decoded._id, token: token}})
}




User.findByCredentials = function(email, password){
	let User = this;
	return User.findOne({where:{email}}).then((user)=>{
		if(!user){
			return Promise.reject();
		};
		return bcrypt.compare(password, user.password).then((res)=>{
			if(res){
				return user;
			} else {
				return Promise.reject();
			}
		})
	})
}

User.prototype.removeToken = function(token){
	let user = this;
	return user.update({token: ''});
}


// User.beforeCreate((user, options)=>{
// 	if(user.changed('password')){
// 		return bcrypt.hash(user.password, bcrypt.genSaltSync(10)).then((hash)=>{
// 			user.password = hash;
// 		}).catch((err)=>{
// 			throw new Error();
// 		})
// 	}

// })

User.beforeCreate(async (user, options)=>{
	let err;
	if(user.changed('password')){
		let salt,hash;
		salt = await bcrypt.genSalt(10);
		hash = await bcrypt.hash(user.password, salt);
		user.password = hash;
	}
})


// db.sync({force: true})
// 	.then(()=>{
// 		console.log('Database & tables created');
// 	})



module.exports = {User};
