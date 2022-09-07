const routesUsers = require('express').Router(); // создали роутер

const { updateUsers } = require('../controllers/users');
const { infirmationAboutMe } = require('../controllers/users');

routesUsers.get('/me', infirmationAboutMe);
routesUsers.patch('/me', updateUsers);

module.exports = routesUsers;
