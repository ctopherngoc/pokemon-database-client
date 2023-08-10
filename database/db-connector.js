var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'databases.000webhost.com',
  user            : 'id21133066_admin1',
  password        : 'Password123!',
  database        : 'id21133066_pokemon_db',
  dateStrings: true
});
module.exports.pool = pool;
