const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jsonwt = require('jsonwebtoken');
const passport = require('passport');
const passportjwt = require('passport-jwt');

var salt = bcrypt.genSaltSync(10);

// @type   GET
// @route  /api/auth
// @desc   just for testing
// @access PUBLIC
router.get('/', (req, res) => {
    res.json({
        'Test': 'Auth is successful'
    });
});

// Import Schema for Person to Register
const Person = require("../../models/Person");

// @type   POST
// @route  /api/auth/register
// @desc   route for registration of users
// @access PUBLIC
router.post('/register', function (req, res) {
    Person.findOne({
        email: req.body.email
    }).then(person => {
        if (person) {
            return res
                .status(400)
                .json({
                    emailerror: "Email is already regsitered in our system"
                });
        } else {
            const newPerson = new Person({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                username: req.body.username
            });
            //Encrypt password using bcryptjs
            newPerson.password = bcrypt.hashSync(newPerson.password, salt, (req, res) => {
                if (err) throw err;
            });

            newPerson
                .save()
                .then(person => res.json(person))
                .catch(err => console.log(err));

        }
    }).catch(err => console.log(err));
});


module.exports = router;