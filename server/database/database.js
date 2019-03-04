const Sequelize = require('sequelize');
// const {User} = require('./../models/user');
// const {Idea} = require('./../models/idea');


const db = new Sequelize('nodejs', 'root', '', {
	host: 'localhost',
	dialect: 'mysql',
	operatorsAliases: false,

	pool: {
		max: 5,
		min: 0,
		acquire: 30000,
		idle: 10000
	}
});

db.authenticate()
	.then(()=>{
		console.log('Connection has been successfully established.');
	}).catch((e)=>{
		console.log('Unable to connect to the database: ', e);
	});



// User.hasOne(Idea, {foreignKey: 'fk_user_id'})

// db.sync({force: true})
// 	.then(()=>{
// 		console.log('Database & tables created');
// 	})

// const dbd = {};

// db.Sequelize = Sequelize;
// db.sequelize = sequelize;

// db.user = require('./../models/user');
// db.user = require('./../token');







module.exports = db;