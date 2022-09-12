module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getPokemon(res, mysql, context, complete){
        mysql.pool.query("SELECT breed_id, pokemon_name, health, attack, defence, special_atk, special_def, speed, type_1, type_2, ability_1, ability_2, hidden_ability FROM Pokemon;", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.Pokemon = results;
            complete();
            console.log(results)
        });
    }

    /*Display all pokemon. Requires web based javascript to delete users with AJAX*/

    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        var mysql = req.app.get('mysql');
        getPokemon(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('pokemon', context);
            }
        }
    });

    router.post('/', function(req, res){
        console.log(req.body.pokemon)
        console.log(req.body)
        var mysql = req.app.get('mysql');

        var sql = "INSERT INTO Pokemon (pokemon_name, health, attack, defence, special_atk, special_def, speed, type_1, type_2, ability_1, ability_2, hidden_ability) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)";
        var inserts = [req.body.pokemon_name, req.body.health, req.body.attack, req.body.defence, req.body.special_atk, req.body.special_def, req.body.speed, req.body.type_1, req.body.type_2, req.body.ability_1, req.body.ability_2, req.body.hidden_ability];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                console.log(req.body);
                res.redirect('/pokemon');
            }
        });
    });

    return router;
}();
