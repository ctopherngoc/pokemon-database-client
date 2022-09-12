module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getStorage(res, mysql, context, complete){
        mysql.pool.query("SELECT pid, pokeid FROM Storage;", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.Storage = results;
            complete();
        });
    }

    /*Display all storage. Requires web based javascript to delete users with AJAX*/

    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        var mysql = req.app.get('mysql');
        getStorage(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('storage', context);
            }
        }
    });

    router.post('/', function(req, res){
        console.log(req.body.storage)
        console.log(req.body)
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO Storage (pid,pokeid) VALUES (?,?)";
        var inserts = [req.body.pid, req.body.pokeid];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/storage');
            }
        });
    });

    return router;
}();
