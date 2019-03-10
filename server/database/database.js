const Sequelize = require('sequelize');
require('./../config/config');
// const {User} = require('./../models/user');
// const {Idea} = require('./../models/idea');

const db = new Sequelize(process.env.DATABASE, process.env.username, process.env.password, {
	host: process.env.host,
	dialect: 'mysql',
	operatorsAliases: false,



// const db = new Sequelize('root', 'root', 'password', {
// 	host: 'localhost',
// 	dialect: 'mysql',
// 	operatorsAliases: false,

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


// db.sync({force: true})
// 	.then(()=>{
// 		console.log('Database & tables created');
// 	}).catch((e)=>{
// 		console.log('Error', e);
// 	})





module.exports = db;