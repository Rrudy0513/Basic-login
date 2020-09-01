// import db
require('./db/config');

const express = require('express'),
	userRouter = require('./routes/secure/users'),
	cookieParser = require('cookie-parser'),
	taskRouter = require('./routes/secure/tasks'),
	openRoutes = require('./routes/open'),
	passport = require('./middleware/authentication'),
	path = require('path'),
	app = express(),
	fileUpload = require('express-fileupload');

// Parse incoming JSON into objects
app.use(express.json());

// Unauthenticated routes
app.use(openRoutes);

app.use(cookieParser());

//
if (process.env.NODE_ENV === 'production') {
	// Serve any static files
	app.use(express.static(path.join(__dirname, '../client/build')));
}

app.use(
	passport.authenticate('jwt', {
		session: false,
	})
);

app.use(
	fileUpload({
		useTempFiles: true,
		tempFileDir: '/tmp/images',
	})
);

//  Authenticated  Routes
app.use(userRouter);
app.use(taskRouter);

if (process.env.NODE_ENV === 'production') {
	// Handle React routing, return all requests to React app
	app.get('*', (request, response) => {
		response.sendFile(path.join(__dirname, '../client/build', 'index.html'));
	});
}

module.exports = app;
