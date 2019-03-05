const Sequelize = require('sequelize');
const db = require('./../database/database');
const {User} = require('./../models/user');
const {Post} = require('./../models/post');
const {Image} = require('./../models/image');

User.hasMany(Post, {foreignKey: 'fk_user_id'});
Post.belongsTo(User, {foreignKey: 'fk_user_id'});
User.hasOne(Image, {foreignKey: 'fk_user_id'});
// Image.belongsTo(User);

// db.sync({force: true})
// 	.then(()=>{
// 		console.log('Database & tables created');
// 	})