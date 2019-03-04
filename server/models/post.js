const Sequelize = require('sequelize');
const db = require('./../database/database');


const Post = db.define('post', {
	title:{
		type: Sequelize.STRING,
		validate: {
			notEmpty: {
				msg: 'Add a title'
			}
		}
	},
	type_of: {
		type: Sequelize.STRING,
		validate: {
			notEmpty: {
				msg: 'Add a type'
			}
		}
	},
	post_body: {
		type: Sequelize.STRING,
	}},{
		freezeTableName: true
});

module.exports = {Post};