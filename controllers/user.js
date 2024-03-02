const User = require('../models/user');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config');
const {sendEmail} = require('../middleware/nodemailer');
const createPath = (page) => path.resolve(__dirname, '..', 'views', `${page}.ejs`);

exports.loginUser = async (req, res) => {
  const candidate = await User.findOne({email: req.body.email});

	if(candidate){
		const passwordResult = bcrypt.compareSync(req.body.password, candidate.password);
		if(passwordResult){
			const token = jwt.sign({
				email: candidate.email,
				userId: candidate._id
			}, config.jwt, {expiresIn: '1h'});

			res.cookie('token',token);
			res.redirect('/');
		} else{
			res.status(401).render(createPath('login'), {message:'email or password is incorrect'});
		}
	}else{
		res.status(401).render(createPath('login'), {message:'email or password is incorrect'});
	}
};

exports.registrationUser = async (req, res) => {
  const candidate = await User.findOne({email:req.body.email});
	if(candidate){
		res.status(409).render(createPath('registration'), {'message':'this email already exists'})
	}else{
		// Hash the password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

		const user = new User({firstName: req.body.firstName, lastName: req.body.lastName, email: req.body.email, password: hashedPassword, country: req.body.country, age: req.body.age, gender: req.body.gender});

		try {
			// Insert user into the database
			await user.save();
			const registration = "Blog";
			const message = "We thank you for registering on our Blog website"
			sendEmail(req.body.email, registration, message);
			res.redirect('/'); // Redirect to dashboard or home page after successful registration
		} catch (error) {
			console.log(error);
			res.render(createPath('registration'), {message:'server error'});
		}
	}
};

exports.logOutUser = async (req, res) => {
  res.clearCookie('token');
	res.redirect('/');
};