/////////////////////////////////////////////////////////////////////////////////////////////////////
// Load Modules
/////////////////////////////////////////////////////////////////////////////////////////////////////
// load modules
var express      = require('express');
var http         = require('http');
var fileSystem   = require('fs');
var morgan       = require('morgan')
var cookieParser = require('cookie-parser')
var bodyParser   = require('body-parser')
var passport     = require('passport')
var LdapStrategy = require('passport-ldapauth')


/////////////////////////////////////////////////////////////////////////////////////////////////////
// Server
/////////////////////////////////////////////////////////////////////////////////////////////////////
// =================================================================================================
// General 
// =================================================================================================
var name    = 'Test Server'
var version = '0.0.1'
var port    = process.env.PORT || 3000
var ldap_conf = {
    server: {
        url: 'ldap://ldap.example.com:389',
        bindDN: 'cn=admin,dc=example,dc=com',
        bindCredentials: 'AdminPassword',
        searchBase: 'ou=users,dc=example,dc=com',
        searchFilter: '(uid={{username}})'
    }
}


// =================================================================================================
// Middleware
// =================================================================================================
var app = express()
// general
app.use(morgan('dev'))
app.use(cookieParser())
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
// passport 
passport.use(new LdapStrategy(ldap_conf))
app.use(passport.initialize())


// =================================================================================================
// create server
// =================================================================================================
// create http server
var server = http.createServer(app)


// =================================================================================================
// Routes 
// =================================================================================================
require('./routes.js')(app, passport)


// =================================================================================================
// Run 
// =================================================================================================
server.listen(port)
console.log(name + ' v' + version + ' started on port ' + port)


/////////////////////////////////////////////////////////////////////////////////////////////////////