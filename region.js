module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getRegion(res, mysql, context, complete){
        mysql.pool.query("SELECT unique_region_id, region_name FROM Region;", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.Region = results;
            complete();
            console.log(results)
        });
    }

    /*Display all region. Requires web based javascript to delete users with AJAX*/

    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        var mysql = req.app.get('mysql');
        getRegion(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('region', context);
            }
        }
    });

    router.post('/', function(req, res){
        console.log(req.body.region)
        console.log(req.body)
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO Region (region_name) VALUES (?)";
        var inserts = [req.body.region_name];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/region');
            }
        });
    });

    return router;
}();
