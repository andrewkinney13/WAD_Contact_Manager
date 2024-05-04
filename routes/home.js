const express = require('express');
const router = express.Router();

// Initial page load
router.get('/', async (req, res) => {

    // Render contacts on the homepage
    const contacts = await req.db.getContacts();
    res.render('home', {contacts : contacts});
});

module.exports = router;