const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

// User clicked logout link
router.get('/logout', async (req, res) => {

    // Clear session, go to home
    req.session.user = undefined;
    res.redirect('/');
})

// Initial login page
router.get('/login', async (req, res) => {
    
    // Don't show login link on this page
    res.render('login', { hide_login: true });
});

// User submitted login form
router.post('/login', async (req, res) => {

    // Obtain user entered data
    const username = req.body.username.trim();
    const password = req.body.password.trim();

    // Obtain the user
    const user = await req.db.findUserByUsername(username);

    // Check user exists, and password matches
    if (user && bcrypt.compareSync(password, user.password)) {

        // Log them in, redirect to home
        req.session.user = user;
        res.redirect('/');
        return;
    } else {

        // Don't log them in
        res.render('login', { hide_login: true, message: 'Could not authenticate' });
        return;
    }
});

// Initial sign up page
router.get('/signup', async (req, res) => {
    res.render('signup', { hide_login: true });
});

// User submitted a signup form
router.post('/signup', async (req, res) => {

    // Obtain the information from the user
    const first_name = req.body.first_name.trim();
    const last_name = req.body.last_name.trim();
    const username = req.body.username.trim();
    const password1 = req.body.password.trim();
    const password2 = req.body.password2.trim();

    // Check passwords match
    if (password1 != password2) {
        res.render('signup', { hide_login: true, message: 'Passwords do not match!' });
        return;
    }

    // Check duplicate accounts
    const check = await req.db.findUserByUsername(username);
    if (check) {

        res.render('signup', { hide_login: true, message: 'This account already exists!' });
        return;
    }

    // Salt and hash the password
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password1, salt);

    // Create user
    const user = {
        first_name : first_name,
        last_name : last_name,
        username : username,
        password : hash,
    }
    const id = await req.db.createUser(user);

    // Create session (log them in)
    req.session.user = await req.db.findUserById(id);

    // Bring to home
    res.redirect('/');
});

module.exports = router;