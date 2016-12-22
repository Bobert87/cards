var mysql      = require('mysql');

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'admin',
    password : '123456',
    database        : 'cryptozoic_dc'
});
module.exports = connection;
