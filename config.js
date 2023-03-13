const Sequelize = require('sequelize');
const config = new Sequelize("taskmanager", "root", "daisy", {dialect:"mariadb"});

module.exports = config;

//working along with Emmanuel
