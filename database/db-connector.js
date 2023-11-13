var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'db4free.net',
  user            : 'ctopherngoc@localhost',
  password        : '',
  database        : 'pokemon_database',
  dateStrings: true
});
module.exports.pool = pool;
