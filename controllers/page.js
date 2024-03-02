const path = require('path');
const User = require('../models/user');
const axios = require('axios');
const config = require('../config');
const verifyToken = require('../middleware/authMiddleware');
const createPath = (page) => path.resolve(__dirname, '..', 'views', `${page}.ejs`);

exports.home = async (req, res) => {
  verifyToken(req, res);
	// 3-api fact
	const resp3 = await axios.get('https://api.api-ninjas.com/v1/facts?limit=3', {
		headers: {
			'X-Api-Key': config.api_ninja
		}
	});
	let facts = resp3.data;
	if(res.auth){
		const user = await User.findOne({_id:req.userId});
		res.render(createPath('index'), {auth: res.auth, admin: res.admin, 'user': user, 'facts': facts});
	}else{
		res.render(createPath('index'), {auth: res.auth, admin: res.admin, 'user': '', 'facts': facts});
	}
};


exports.loginPage = async (req, res) => {
  verifyToken(req, res);
	if(res.auth){
		res.redirect('/');
	}else{
		res.render(createPath('login'), {message:''});
	}
};
exports.registrationPage = async (req, res) => {
  verifyToken(req, res);
	if(res.auth){
		res.redirect('/');
	}else{
		res.render(createPath('registration'), {message:''});
	}
};