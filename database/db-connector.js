var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'sql3.freesqldatabase.com',
  user            : 'sql3519154',
  password        : 'yYlknvBb6z',
  database        : 'sql3519154',
  dateStrings: true
});
module.exports.pool = pool;
