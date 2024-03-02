const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const config = require('./config');
const verifyToken = require('./middleware/authMiddleware');
const cookieParser = require('cookie-parser');
const bodyParser = require("body-parser")
const { home, loginPage, registrationPage } = require('./controllers/page');
const { loginUser, registrationUser, logOutUser } = require('./controllers/user');
const { getAll, create, createPage, update, updatePage, deleteById } = require('./controllers/post');

const server = express();
server.set('view engine', 'ejs');
const PORT = 3000;
const db = config.mongoURL;

mongoose.connect(db).then((res) => console.log('Connected to DB')).catch((error) => console.log(error));
const createPath = (page) => path.resolve(__dirname, 'views', `${page}.ejs`)

server.listen(PORT, (error)=>{
	error ? console.log(error) : console.log(`listening port ${PORT}`);
})

server.use(express.urlencoded({ extended: false }));
server.use(express.static(path.join(__dirname, 'public')));
server.use(cookieParser());

//Pages
server.get('/', home)
server.get('/login', loginPage)
server.get('/registration', registrationPage)

//CRUD Car
server.get('/posts', getAll)
server.get('/posts/create', createPage)
server.post('/posts', create)
server.get('/posts/:id/update', updatePage)
server.post('/posts/:id', update)
server.get('/posts/:id/delete', deleteById)

//Sign in and sign up
server.post('/login', loginUser)
server.post('/registration', registrationUser)
server.get('/log_out', logOutUser)

//Error Page
server.use((req, res) => {
	res.status(404).render(createPath('error'));
})