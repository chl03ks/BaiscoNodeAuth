var express = require('express');
var router = express.Router();
var multer = require('multer');

var upload = multer({
    dest: './uploads/'
});

var User = require('../models/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

router.get('/register', function(req, res, next) {
    res.render('register', {
        title: 'Register'
    });
});

router.get('/login', function(req, res, next) {
    res.render('login', {
        title: 'Login'
    });
});

router.post('/register', upload.single('profileimage'), function(req, res, next) {

    var fieldsArray = ['name', 'email', 'password', 'username'];
    var PretyNames = ['Name', 'Email', 'Password', 'Username'];

    var profileimageName = 'noimage.png';
    // Get the form values
    var name = req.body.name,
        email = req.body.email,
        username = req.body.username,
        password = req.body.password,
        password2 = req.body.password2;
    // Check for img field
    if (req.file) {
        console.log('Uploading file');
        // File info
        var profileimageOriginalName = req.files.profileimage.originalname,
            profileimageMime = req.files.profileimage.mimetype,
            profileimagePath = req.files.profileimage.path,
            profileimageExt = req.files.profileimage.extension,
            profileimageSize = req.files.profileimage.size;

        profileimageName = req.files.profileimage.name;

    } else {
        profileimageName = 'noimage.png';
    }

    for (var i in fieldsArray) {
        req.checkBody(fieldsArray[i], PretyNames[i] + ' field is required.').notEmpty();
    }

    req.checkBody('password2', 'Passwords not match').equals(req.body.password);

    // Check for erros

    var errors = req.validationErrors();

    if (errors) {
        res.render('register', {
            errors: errors,
            name: name,
            email: email,
            username: username,
            password: password,
            password2: password2
        });
    }else{
        var newUser = new User({
            name: name,
            email: email,
            username: username,
            password: password,
            profileimage: profileimageName
        });
        // Create User
        User.createUser(newUser, function(err, user) {
            if (err) throw err;
            console.log(user);
        });

        req.flash('succes', 'You are now registered and my log in');
        res.location('/');
        res.redirect('/');
    }
});


module.exports = router;
