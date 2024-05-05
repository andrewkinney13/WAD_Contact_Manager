// Add express
const express = require('express');
const router = express.Router();

// Add geocoder 
const geo = require('node-geocoder'); 
const geocoder = geo({ provider: 'openstreetmap' });

// Middleware function to check if contact exists
const checkContactExists = async (req, res, next) => {

    // Attempt to find the contact
    const contact = await req.db.findContactById(req.params.id);
   
    // Check contact was found
    if (contact === undefined) {
        res.status(404).render("error", {hide_login: true, not_found : true});
        return;
    }

    // Attatch contact to the req
    req.contact = contact;

    // Call next middleware if no error occurred
    next();
};

// Middleware function to check if user is logged in
const checkLoggedIn = (req, res, next) => {

    // Check permission
    if (!req.session.user) {
        res.status(401).render("error", {hide_login: true, unauthorized : true});
        return;
    }

    // Call next middleware if no error occurred
    next();
};

// Returns a contact object given req
const getContact = (req) => {
    return {
        first_name : req.body.first_name.trim(),
        last_name : req.body.last_name.trim(),
        phone : req.body.phone.trim(),
        email : req.body.email.trim(),
        address : req.body.address.trim(),
        contact_phone : req.body.contact_phone !== undefined ? 1 : 0,
        contact_email : req.body.contact_email !== undefined ? 1 : 0,
        contact_mail : req.body.contact_mail !== undefined ? 1 : 0,
        lat : req.body.lat !== undefined ? 1 : 0,
        long : req.body.long !== undefined ? 1 : 0,
    }
}

// Initial create page
router.get('/create', async (req, res) => {
    
    res.render("editCreate");
});

// User submitted create form
router.put('/create', async (req, res) => {

    // Obtain the information from the req
    console.log(req.body);
    const contact = getContact(req);

    // Check address validity
    const result = await geocoder.geocode(contact.address);

    // Do nothing if invalid address
    if (result.length == 0) {
        return;
    }
    
    // Create the contact 
    await req.db.createContact(contact);

    // Bring to home
    res.redirect('/');
});


// User accessing a contact
router.get('/:id', checkContactExists, async (req, res) => {

    // Render the contact
    res.render("contact", {contact : req.contact, loggedIn : req.session.user})
});

// User accessing edit page
router.get('/:id/edit', checkContactExists, checkLoggedIn, async (req, res) => {

    // Render the edit page
    res.render("editCreate", {contact : req.contact})
});

// User made an edit to a contact
router.post('/:id/edit', checkContactExists, checkLoggedIn, async (req, res) => {

    // Obtain the contact
    const contact = await getContact(req);

    // Make the edit
    await req.db.editContact(req.params.id, contact);

    // Return to home
    res.redirect("/");
});

// User accessing delete page
router.get('/:id/delete', checkContactExists, checkLoggedIn, async (req, res) => {

    // Render the delete page
    res.render("delete", {contact : req.contact})
});

// User deleting contact
router.post('/:id/delete', checkContactExists, checkLoggedIn, async (req, res) => {

    // Delete the contact
    await req.db.deleteContact(req.contact.id);

    // Go to home
    res.redirect('/');
});

module.exports = router;