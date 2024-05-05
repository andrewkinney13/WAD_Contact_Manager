

const obtainContact = async () = {
    return {
        first_name : document.getElementById(),
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

const tryContact = async () => {

    // Obtain contact
    const contact = obtainContact();

    // Attempt to add the contact
    console.log(req.body);
    const res = await axios.put("/create", {body : req.body})

    // If not successful, let user know
    if (res.data.invalidAddress) {
        const errorText = document.getElementById('errorText');
        errorText.innerText = "Invalid address, cannot add place."
    }
}