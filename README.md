# node-ldap-template
[![license](https://img.shields.io/badge/license-GPL3-brightgreen.svg)](https://github.com/asonnino/node-ldap-template/blob/master/LICENSE)

Simple template of nodejs server with ldap client authentication. This project relies on [passportjs](http://passportjs.org) for autentication.


## Pre-requisites
All pre-requisites are listed in `package.json`.


## Install & Run
Dependencies can be installed with `npm`:
```
$ git clone https://github.com/asonnino/node-ldap-template.git
$ cd node-ldap-template
$ npm install
```
Then, run the server with `node`:
```
$ node server.js
```

## Configs
Configuration options can be edited in `server.js`. The port number and is defined by the line below:
```js
var port = process.env.PORT || 3000
```
and ldap configurations as follows:
```js
var ldap_conf = {
    server: {
        url: 'ldap://ldap.example.com:389',
        bindDN: 'cn=admin,dc=example,dc=com',
        bindCredentials: 'AdminPassword',
        searchBase: 'ou=users,dc=example,dc=com',
        searchFilter: '(uid={{username}})'
    }
}
```

## Contribute
Any help is welcome through PRs!


## License
[The GPLv3 license](https://www.gnu.org/licenses/gpl-3.0.en.html)
