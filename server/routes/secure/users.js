const router = require('express').Router(),
	{ sendCancellationEmail } = require('../../emails/index'),
	cloudinary = require('cloudinary').v2,
	isAdmin = require('../../middleware/authorization/index');

router.get('/api/admin', isAdmin(), async (req, res) => {
	try {
		res.json({ message: 'admin user' });
	} catch (e) {
		res.status(404).json({ error: e.toString() });
	}
});

// ***********************************************//
// Get current user
// ***********************************************//
router.get('/api/users/me', async (req, res) => res.json(req.user));

// ***********************************************//
// Update a user
// ***********************************************//
router.patch('/api/users/me', async (req, res) => {
	const updates = Object.keys(req.body);
	const allowedUpdates = ['name', 'email', 'password', 'avatar'];
	const isValidOperation = updates.every((update) =>
		allowedUpdates.includes(update)
	);
	if (!isValidOperation)
		return res.status(400).send({ error: 'invalid updates!' });
	try {
		updates.forEach((update) => (req.user[update] = req.body[update]));
		await req.user.save();
		res.json(req.user);
	} catch (e) {
		res.status(400).json({ error: e.toString() });
	}
});
// ***********************************************//
// Logout a user
// ***********************************************//
router.post('/api/users/logout', async (req, res) => {
	try {
		req.user.tokens = req.user.tokens.filter((token) => {
			return token.token !== req.token;
		});
		await req.user.save();
		res.clearCookie('jwt');
		res.json({ message: 'Logged out' });
	} catch (e) {
		res.status(500).json({ error: e.toString() });
	}
});

// ***********************************************//
// Logout all devices
// ***********************************************//
router.post('/api/users/logoutAll', async (req, res) => {
	try {
		req.user.tokens = [];
		await req.user.save();
		res.clearCookie('jwt');
		res.json({ message: 'all devices logged out' });
	} catch (e) {
		res.status(500).send();
	}
});

// ***********************************************//
// Delete a user
// ***********************************************//
router.delete('/api/users/me', async (req, res) => {
	try {
		await req.user.remove();
		sendCancellationEmail(req.user.email, req.user.name);
		res.clearCookie('jwt');
		res.json({ message: 'user deleted' });
	} catch (e) {
		res.status(500).json({ error: e.toString() });
	}
});

// ***********************************************//
// Upload avatar
// ***********************************************//
router.post('/api/users/avatar', async (req, res) => {
	try {
		const response = await cloudinary.uploader.upload(
			req.files.avatar.tempFilePath
		);
		req.user.avatar = response.secure_url;
		await req.user.save();
		res.json(response);
	} catch (error) {
		res.json({ error: e.toString() });
	}
});
// ******************************
// Update password
// ******************************
router.put('/api/password', async (req, res) => {
	try {
		req.user.password = req.body.password;
		await req.user.save();
		res.clearCookie('jwt');
		res.json({ message: 'password updated successfully' });
	} catch (e) {
		res.json({ error: e.toString() });
	}
});

module.exports = router;
