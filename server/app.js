const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const _ = require('lodash');
const multer = require('multer');
const fs = require('fs');

const {db} = require('./database/database');
const {User} = require('./models/user');
const {authenticate, loginCheck} = require('./middleware/authenticate');


const publicPath = path.join(__dirname + '/../public');


const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

app.use(express.static('public'));
app.use(express.static('uploads'))

// ============ STORAGE ==============
const storage = multer.diskStorage({
	destination: publicPath + '/../uploads/',
	filename: function(req, file, cb){
		cb(null, 'img' + '-' + Date.now() + path.extname(file.originalname));
	}
})

const upload = multer({
	storage: storage,
	limits: {fileSize: 10000000},
	fileFilter: function(req, file, cb){
		checkFileType(file, cb)
	}
}).single('img');

function checkFileType(file, cb){
	const filetypes = /jpeg|jpg|png|gif/;
	const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
	const mimetype = filetypes.test(file.mimetype);
	if(mimetype && extname){
		return cb(null, true)
	} else {
		cb('Error: Images only!')
	}
}



// ============= REGISTER ==============
app.get('/register', loginCheck,  (req, res)=>{
	res.sendFile(`${publicPath}/register.html`);
});

app.post('/register', (req, res)=>{
	let body = _.pick(req.body, ['name', 'email', 'password', 'location']);

	User.create(body).then((user)=>{
		console.log(user);
		res.status(200).send('User created');
	}).catch((err)=>{
		console.log(err);
		res.status(401).send(err);
	});
});

// ==================== LOGIN ========================

app.get('/login', loginCheck, (req, res)=>{
	res.sendFile(`${publicPath}/login.html`);
});

app.post('/login', (req, res)=>{

	let body = _.pick(req.body, ['email', 'password']);

	User.findByCredentials(body.email, body.password).then((user)=>{
		return user.generateAuthToken().then((token)=>{
			res.cookie('jwt', token, {expires: new Date(Date.now() + 1000000)}).status(200).send({user});
		})
	}).catch((e)=>{
		res.status(404).send(e)
	})

})

// ========================= HOME =========================


app.get('/home', authenticate,  (req, res)=>{
	res.sendFile(`${publicPath}/home.html`);
})


app.delete('/home', authenticate,  (req, res)=>{
	req.user.removeToken(req.cookies.jwt).then(()=>{
		res.clearCookie('jwt');
		res.send();
	}).catch((e)=>{
		res.status(400).send(e);
	})
})

// ===================== PROFILE ===========================

app.get('/profile', authenticate, (req, res)=> {
	res.sendFile(publicPath+'/profile.html');
})

app.get('/profile/id', authenticate, (req, res)=>{
	let id = req.user.id;
	console.log(id);
	User.findOne(({where:{id:id}})).then((user)=>{
		res.send(user);
	}).catch((e)=>{
		res.status(404).send(e);
	})
})

app.patch('/profile', authenticate, (req,res)=>{
	let id = req.user.id;
	let body = _.pick(req.body, ['gender', 'telephone', 'address']);
	User.findOne(({where: {id:id}})).then((user)=>{
		if(!user){
			return res.status(400).send();
		};
		user.update({gender: body.gender, telephone: body.telephone, address: body.address})
		res.send({user});
	}).catch((e)=>{
		res.status(400).send();
	})

});

// =================== IMAGES ====================
app.post('/image', authenticate, (req, res)=>{
	let id = req.user.id;
	console.log(id);
	upload(req, res, (err)=>{
		if(err){
			res.status(401).send(err);
		} else {
			if(req.file === undefined){
				res.status(404).send(err);
			} else {
				User.findOne(({where: {id:id}})).then((user)=>{
					if(!user){
						return res.status(400).send();
					};
					user.update({image: req.file.filename})
					res.send({user});
				}).catch((e)=>{
					res.status(400).send();
				})
			}
		}
	})
})


app.patch('/image', authenticate, (req, res)=>{

	let img = req.body.title;

	fs.stat(publicPath + './../uploads/'+img, function (err, stats) {
   		console.log(stats);

	   if (err) {
	       return console.error(err);
	   }

	   fs.unlink(publicPath + './../uploads/'+img,function(err){
	        if(err) return console.log(err);
	        console.log('file deleted successfully');
	   });  
	});


	let id = req.user.id;
	User.findOne(({where: {id:id}})).then((user)=>{
		if(!user){
			return res.status(400).send();
		};
		user.update({image: ''})
		res.send({user});
		}).catch((e)=>{
			res.status(400).send();
		})
})









app.listen(port, ()=>{
	console.log(`Server started on port ${port}`)
})