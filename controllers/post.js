const Post = require('../models/post');
const User = require('../models/user');
const config = require('../config');
const path = require('path');
const verifyToken = require('../middleware/authMiddleware');
const axios = require('axios');
const sendEmail = require('../middleware/nodemailer')
const createPath = (page) => path.resolve(__dirname, '..', 'views', `${page}.ejs`);

exports.getAll = async (req, res) => {
  verifyToken(req, res);

    //1-api Math
	if(!res.auth) res.render(createPath('error'));
	const resp = await axios.get('https://api.api-ninjas.com/v1/trivia?category=mathematics', {
		headers: {
			'X-Api-Key': config.api_ninja
		}
	});
	let math = resp.data;

    //2-api NewIdea
	if(!res.auth) res.render(createPath('error'));
	const resp2 = await axios.get('https://api.api-ninjas.com/v1/bucketlist', {
		headers: {
			'X-Api-Key': config.api_ninja
		}
	});
	let bucketlist = resp2.data;

	const user = await User.findById(req.userId);
	const posts = await Post.find();
	res.render(createPath('posts'), {'bucketlist': bucketlist, 'math': math, 'auth': res.auth, 'admin': res.admin, 'posts': posts, 'user': user});
};

exports.create = async (req, res) => {
	verifyToken(req, res);
	if(!res.auth || !res.admin ) res.render(createPath('error'));
	
	const { title, text } = req.body;
	
	try {
		const newPost = new Post({ title, text});
		await newPost.save();
		sendEmail('aitzhanulyabylaikhan@gmail.com', `New post created: ${title}`, text);
		res.redirect("/posts");
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

exports.createPage = async (req, res) => {
	verifyToken(req, res);
	if(!res.auth || !res.admin) res.render(createPath('error'));
	const user = await User.findById(req.userId);
	res.render(createPath('create'), {'auth': res.auth, 'admin': res.admin, 'user': user});
};

exports.updatePage = async (req, res) => {
	verifyToken(req, res);
	if(!res.auth || !res.admin) res.render(createPath('error'));
	const post = await Post.findById(req.params.id);
	if(post!=null){
		const user = await User.findById(req.userId);
		res.render(createPath('update'), {'auth': res.auth, 'admin': res.admin, 'user': user, 'post': post});
	}else{
		res.status(404).json("car is not found!");
	}
};

exports.update = async (req, res) => {
	verifyToken(req, res);
	if(!res.auth || !res.admin ) res.render(createPath('error'));
	
	const { title, text } = req.body;
	try {
		const updatedCar = await Post.findByIdAndUpdate(req.params.id, { title, text });
		if (!updatedCar) {
      return res.status(404).json({ message: 'Post not found' });
    }
		res.redirect("/posts");
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

exports.deleteById = async (req, res) => {
	verifyToken(req, res);
	if(!res.auth || !res.admin ) res.render(createPath('error'));
	
	try {
    const deletedPost = await Post.findByIdAndDelete(req.params.id);
    if (!deletedPost) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.redirect('/posts');
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};