const Sequelize = require('sequelize');
const db = require('./../database/database');
const bcrypt = require('bcryptjs');

const Token = db.define('token',{
	access: {
		type: Sequelize.STRING
	},
	token: {
		type: Sequelize.STRING
	}
} )

module.exports = {Token};