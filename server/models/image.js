const Sequelize = require('sequelize');
const db = require('./../database/database');


const Image = db.define('img', {
	title:{
		type: Sequelize.STRING,
		validate: {
			notEmpty: {
				msg: 'Add title'
			}
		}
	},
	url:{
		type: Sequelize.STRING
	}},{
		freezeTableName: true
});

module.exports = {Image};