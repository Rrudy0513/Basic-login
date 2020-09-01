const router = require('express').Router(),
	{ sendWelcomeEmail } = require('../../emails/index'),
	User = require('../../db/models/user');

// ***********************************************//
// Create a user
// ***********************************************//
router.post('/api/users', async (req, res) => {
	const user = new User(req.body);
	try {
		await user.save();
		sendWelcomeEmail(user.email, user.name);
		const token = await user.generateAuthToken();
		res.cookie('jwt', token, {
			httpOnly: true,
			sameSite: 'Strict',
			secure: process.env.NODE_ENV !== 'production' ? false : true,
		});
		res.json(user);
	} catch (e) {
		res.status(201).status(400).send(e);
	}
});

// ***********************************************//
// Login a user
// ***********************************************//
router.post('/api/users/login', async (req, res) => {
	const { email, password } = req.body;
	try {
		const user = await User.findByCredentials(email, password);
		const token = await user.generateAuthToken();
		res.cookie('jwt', token, {
			httpOnly: true,
			sameSite: 'Strict',
			secure: process.env.NODE_ENV !== 'production' ? false : true,
		});
		res.json(user);
	} catch (e) {
		res.status(400).json({ error: e.toString() });
	}
});

// ******************************
// Password Reset Request
// This route sends an email that the
// user must click within 10 minutes
// to reset their password.
// ******************************
router.get('/api/password', async (req, res) => {
	try {
		const { email } = req.query,
			user = await User.findOne({ email });
		if (!user) throw new Error("account doesn't exist");
		// Build jwt token
		const token = jwt.sign(
			{ _id: user._id.toString(), name: user.name },
			process.env.JWT_SECRET,
			{
				expiresIn: '10m',
			}
		);
		forgotPasswordEmail(email, token);
		res.json({ message: 'reset password email sent' });
	} catch (e) {
		res.json({ error: e.toString() });
	}
});

// ******************************
// Redirect to password reset page
// ******************************
router.get('/api/password/:token', (req, res) => {
	const { token } = req.params;
	try {
		jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
			if (err) throw new Error(err.message);
		});
		res.cookie('jwt', token, {
			httpOnly: true,
			maxAge: 6000000,
			sameSite: 'Strict',
		});
		res.redirect(process.env.URL + '/update-password');
	} catch (e) {
		res.json({ error: e.toString() });
	}
});

module.exports = router;
