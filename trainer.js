module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getTrainer(res, mysql, context, complete){
        mysql.pool.query("SELECT unique_player_id, name_id, gender, age, region FROM Trainer;", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.Trainer = results;
            complete();
        });
    }

    function deleteTrainer(res, mysql){
        mysql.pool.query("DELETE FROM Trainer WHERE unique_player_id = ?", [req.body.unique_player_id], function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/trainer');
            }
        });
    }
    

    /*Display all trainers. Requires web based javascript to delete users with AJAX*/

    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        var mysql = req.app.get('mysql');
        getTrainer(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('trainer', context);
            }
        }
    });

    router.post('/', function(req, res){
        console.log(req.body.trainer)
        console.log(req.body)
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO Trainer (name_id, gender, age, region) VALUES (?,?,?,?)";
        var inserts = [req.body.name_id, req.body.gender, req.body.age, req.body.region];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/trainer');
            }
        });
    });
    
    return router;
}();
