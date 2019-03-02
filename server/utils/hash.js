const bcrypt = require('bcryptjs');

function generatePassword(password, callback){
	bcrypt.genSalt(10, (err, salt)=>{
		if(err){
			return err;
		}
		bcrypt.hash(password, salt, (err, hash)=>{
			
			return(err, hash);
		})
	})
}

module.exports = generatePassword();