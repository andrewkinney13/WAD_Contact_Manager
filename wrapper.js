require('dotenv').config();
const bcrypt = require('bcryptjs');
const Database = require('dbcmps369');

// Class containing functions to manipulate database
class Wrapper {

    // Creates database
    constructor() {
        this.db = new Database();
    }

    // Initalizes tables and connects
    async initialize() {
        await this.db.connect();

        await this.db.schema('Contact', [
            { name: 'id', type: 'INTEGER' },
            { name: 'first_name', type: 'TEXT' },
            { name: 'last_name', type: 'TEXT' },
            { name: 'phone', type: 'TEXT' },
            { name: 'email', type: 'TEXT' },
            { name: 'street', type: 'TEXT' },
            { name: 'city', type: 'TEXT' },
            { name: 'state', type: 'TEXT' },
            { name: 'zip', type: 'TEXT' },
            { name: 'country', type: 'TEXT' },
            { name: 'contact_phone', type: 'INTEGER' },
            { name: 'contact_email', type: 'INTEGER' },
            { name: 'contact_mail', type: 'INTEGER' }
        ], 'id');

        await this.db.schema('Users', [
            { name: 'id', type: 'INTEGER' },
            { name: 'first_name', type: 'TEXT' },
            { name: 'last_name', type: 'TEXT' },
            { name: 'username', type: 'TEXT' },
            { name: 'password', type: 'TEXT' }
        ], 'id');

        // Check for cmps369 user
        if (!await this.findUserByUsername("cmps369")) {

            // Create if it doesn't exist
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync("rcnj", salt);
            const user = {
                username : "cmps369",
                password : hash,
                first_name : "Paul",
                last_name : "Atreides"
            }
            this.createUser(user);
        }
    }

    // Creates contact based on object w/ data
    async createContact(contact) {
        const id = await this.db.create('Contact', [
            { column: 'first_name', value: contact.first_name },
            { column: 'last_name', value: contact.last_name },
            { column: 'phone', value: contact.phone },
            { column: 'email', value: contact.email },
            { column: 'street', value: contact.street },
            { column: 'city', value: contact.city },
            { column: 'state', value: contact.state },
            { column: 'zip', value: contact.zip },
            { column: 'country', value: contact.country },
            { column: 'contact_phone', value: contact.contact_phone },
            { column: 'contact_email', value: contact.contact_email },
            { column: 'contact_mail', value: contact.contact_mail }
        ])
        return id;
    }

    // Creates contact based on object w/ data
    async createUser(user) {
        const id = await this.db.create('Users', [
            { column: 'first_name', value: user.first_name },
            { column: 'last_name', value: user.last_name },
            { column: 'username', value: user.username },
            { column: 'password', value: user.password }
        ])
        return id;
    }

    // Returns contact w/ matching ID
    async findContactById(id) {
        const contact = await this.db.read('Contact', [{ column: 'id', value: id }]);
        if (contact.length > 0) return contact[0];
        else {
            return undefined;
        }
    }

    // Returns user w/ matching username
    async findUserByUsername(username) {
        const user = await this.db.read('Users', [{ column: 'username', value: username }]);
        if (user.length > 0) return user[0];
        else {
            return undefined;
        }
    }

    // Returns user w/ matching ID
    async findUserById(id) {
        const user = await this.db.read('Users', [{ column: 'id', value: id }]);
        if (user.length > 0) return user[0];
        else {
            return undefined;
        }
    }

    // Returns an array of all contacts
    async getContacts() {

        const contacts = await this.db.read("Contact", []);
        if (contacts.length > 0) return contacts;
        else {
            return undefined;
        }
    }

    // Deletes a contact given it's id
    async deleteContact(id) {

        await this.db.delete("Contact", [{ column: 'id', value: id }])
    }

    // Replaces all a contact's data given a new one
    async editContact(id, contact) {

        await this.db.update("Contact", [
            { column: 'first_name', value: contact.first_name },
            { column: 'last_name', value: contact.last_name },
            { column: 'phone', value: contact.phone },
            { column: 'email', value: contact.email },
            { column: 'street', value: contact.street },
            { column: 'city', value: contact.city },
            { column: 'state', value: contact.state },
            { column: 'zip', value: contact.zip },
            { column: 'country', value: contact.country },
            { column: 'contact_phone', value: contact.contact_phone },
            { column: 'contact_email', value: contact.contact_email },
            { column: 'contact_mail', value: contact.contact_mail }],
            [{ column: 'id', value: id }]
        )
    }
}

module.exports = Wrapper;