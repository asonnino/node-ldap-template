/////////////////////////////////////////////////////////////////////////////////////////////////////
// Load Modules
/////////////////////////////////////////////////////////////////////////////////////////////////////
var util = require('./util.js');


/////////////////////////////////////////////////////////////////////////////////////////////////////
// Login middleware
/////////////////////////////////////////////////////////////////////////////////////////////////////
module.exports.isPremium = function (req, res, next) {
	// check whether user is premium
	if (req.user.gidNumber <= 501) {return next()}
	else {util.forbidden(req,res)}
}

module.exports.isAdmin = function (req, res, next) {
	// check whether user is premium
	if (req.user.gidNumber == 500) {return next()}
	else {util.forbidden(req,res)}
}