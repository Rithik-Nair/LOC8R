const mongoose = require('mongoose');
const User = mongoose.model('User');

module.exports.login = function (req, res) {
  res.render('login', { title: 'Login' });
};

module.exports.register = function (req, res) {
  res.render('register', { title: 'Register' });
};

module.exports.loginSubmit = async function (req, res) {
  try {
    const { username, password } = req.body;

    // Find user
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).send('User not found');
    }

    // TEMP (plain-text check — we’ll hash later)
    if (user.password !== password) {
      return res.status(401).send('Invalid password');
    }

    // ✅ LOGIN SUCCESS → redirect to index.jade
    res.redirect('/locations');
  } catch (err) {
    console.error(err);
    res.status(500).send('Login failed');
  }
};

module.exports.registerSubmit = async function (req, res) {
  try {
    const { username, email, password } = req.body;

    // 🔍 Debug
    console.log('Incoming data:', req.body);

    const user = new User({
      username,
      email,
      password
    });

    await user.save(); // ✅ THIS WAS MISSING / NOT RUNNING

    console.log('✅ User saved successfully');

    res.redirect('/login'); // or res.send('User saved')
  } catch (err) {
    console.error('❌ Error saving user:', err);
    res.status(400).send('User registration failed');
  }
};
