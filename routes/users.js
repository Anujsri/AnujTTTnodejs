var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
router.get('/input', function(req, res){
	res.render('input');
});
router.post('/input',
  passport.authenticate('local', {successRedirect:'/', failureRedirect:'/users/input',failureFlash: true}),
  function(req, res) {
    res.redirect('/');
  });
module.exports = router;