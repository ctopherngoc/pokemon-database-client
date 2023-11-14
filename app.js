/*
    SETUP
*/

// Express
var express = require('express');
var app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));

const PORT = process.env.PORT || 2733;

// Database
var db = require('./database/db-connector');

// Handlebars
var { engine } = require('express-handlebars');
const { json } = require('express');
var helpers = require('handlebars-helpers')();
app.engine('.hbs', engine({extname: '.hbs'}));
app.set('view engine', '.hbs');

app.use(express.static('public'));


/*
    ROUTES
*/

app.get('/', function(req, res) {

        res.render('index');
    });

// Route handler for Pokemon Trainers page
app.get('/trainer', function(req, res) {  

    let query1;
    if (req.query.name_id === undefined){
        query1 = "SELECT * FROM Trainer";
    }
    else{
        query1 = `SELECT * FROM Trainer WHERE name_id="${req.query.name_id}"`;
    }            
    db.pool.query(query1, function(error, rows, fields){
        trainers = rows;
        // res.render('trainer', {Trainer: rows}); 
        
    let query2;
    if (req.query.region_name === undefined){
        query2 = "SELECT * FROM Region";
    }
    else{
        query2 = `SELECT * FROM Region WHERE region_name="${req.query.region_name}"`;
        }
    db.pool.query(query2, function (error, rows2, fields){
        region = rows2;
        console.log("value", region)
        res.render('trainer', {Trainer: trainers, Region: region});  
    })
    })
        
});

/* Adds new trainer to database */
app.post('/trainer', function(req, res) {
        let insertQuery = "INSERT INTO Trainer (name_id, gender, age, region) VALUES (?,?,?,?)";
        let insertData = [req.body.name_id, req.body.gender, req.body.age, req.body.region];
        db.pool.query(insertQuery, insertData, function(error, rows, fields) {
            if(error) {
                res.write(JSON.stringify(error));
                res.end();
            }else {
                res.redirect('/trainer')
        }
    }) 
});

/* Update button redirects to update_trainer*/
/* Searches for Region from table */
/* Converts letter to full gender text */

app.get('/update_trainer', function (req, res) {
    let insertQuery = `SELECT * FROM Region WHERE unique_region_id=${req.query.region}`;
    let result;

    // console.log("value", req.query.unique_player_id)

    /* Gets region string from index */
    db.pool.query(insertQuery, req.query.region, function(error, rows, fields) {
        if(error) {
            res.write(JSON.stringify(error));
            res.end();
        }else {
            setValue(rows[0].region_name);
        }
    function setValue(value) {
        result = value;
      }

    /* Converts gender letter to gender string */
    let gender;
    if (req.query.gender == "M") {
        gender = "Male";
    } else {
        gender ="Female";
    }

    console.log("data", gender);
    console.log("data", typeof result, result);

    let query2;
    if (req.query.region_name === undefined){
        query2 = "SELECT * FROM Region";
    }
    else{
        query2 = `SELECT * FROM Region WHERE region_name="${req.query.region_name}"`;
        }
    db.pool.query(query2, function (error, rows2, fields){
        region = rows2;
        res.render('update_trainer', {unique_player_id: 
                                     req.query.unique_player_id, 
                                     name_id: req.query.name_id, 
                                     gender: gender, 
                                     age: req.query.age, 
                                     region: result, Region: region});

        res.render('trainer', {Trainer: trainers, Region: region});  
    })
    })
});


/* Updates trainer data */
app.post('/update_trainer', function (req, res) {

    let data = req.body;
    console.log('data', req.body);

    let updateQuery = `UPDATE Trainer SET name_id="${req.body.name_id}", 
                                        gender="${req.body.gender}", 
                                        age="${parseInt(req.body.age)}", 
                                        region="${parseInt(req.body.region)}" 
                                        WHERE unique_player_id = "${req.body.unique_player_id}"`;

    db.pool.query(updateQuery, function (error, rows, fields) {
        if(error) {
            res.write(JSON.stringify(error));
            res.end();
        }
        else {
            res.redirect('/trainer')
        }
    }) 
});

/* Deletes Trainer */
/* need to update so that it also deletes all Pokemons in Trainer's storage */
app.get('/delete_trainer', function (req, res) {

    let unique_player_id = req.query.unique_player_id;

    /* delete trainer entries in storage */
    let deleteStorage = `DELETE FROM Storage WHERE pid=${unique_player_id}`;

    db.pool.query(deleteStorage, function (error, rows, fields) {
        if(error) {
            res.write(JSON.stringify(error));
            res.end();
        }})

    /* delete trainer from trainer */
    let deleteQuery = `DELETE FROM Trainer WHERE unique_player_id=${unique_player_id}`;

    db.pool.query(deleteQuery, function (error, rows, fields) {
        if(error) {
            res.write(JSON.stringify(error));
            res.end();
        }
        else {
            res.redirect('/trainer')
        }
    }) 
});

// Route handler for Pokemon page
app.get('/pokemon', function(req, res) {
    let query1;
    console.log(req.query)

    // on load populate the whole pokemon table
    if (req.query.pokemon_name === undefined){

        query1 = "SELECT * FROM Pokemon";
        db.pool.query(query1, function(error, rows, fields){   
            res.render('pokemon', {Pokemon: rows});                  
        }) 
        
        // on search
     } else {

        // start long Pokemon search query
        query1 = "SELECT * FROM Pokemon WHERE"

        // if pokmeon name is selected
        if (req.query.pokemon_name  != '') {
            query1 += ` pokemon_name = "${req.query.pokemon_name}"`;
            }
        
        // if type_1 not empty
        if (req.query.type_1 != ""){

            // if type_1 not first filter
            if (query1.includes("pokemon_name")){
                query1 += ` AND type_1 = "${req.query.type_1}"`;

            } else{

                // if type_1 is first filter
                query1 += ` type_1 = "${req.query.type_1}"`;
            }
        }

        // if type_2 not empty
        if (req.query.type_2 != "") {

            // if type_2 not first filter
            if(query1.includes("AND")) {  
                query1 += ` AND type_2 = "${req.query.type_2}"`;
            } else {

                // if type_2 first filter
                query1 += ` type_2 = "${req.query.type_1}"`;
            }
        }
        
        // if ability_1 not empty
        if (req.query.ability_1 != ''){
            console.log("we did it");

            // if ability_1 not first filter
            if(query1.includes("AND")) {
            query1 += ` AND ability_1 = "${req.query.ability_1}"`;
            } else {
                // if ability_1 first filter
                query1 += ` ability_1 = "${req.query.ability_1}"`;
            }
        }
        
        // if ability_2 not empty
        if (req.query.ability_2 != ""){
            if(query1.includes("AND")) {

                // if ability_2 not first filter
                query1 += ` AND ability_2 = "${req.query.ability_2}"`;
            } else {
                // if ability_2 first filter
                query1 += ` ability_2 = "${req.query.ability_2}"`;
            }
        }
        
        // if hidden_ability is mot empty
        if (req.query.hidden_ability != ""){

            // if hidden_ability nor first filter
            if(query1.includes("AND")) {
                query1 += ` AND hidden_ability = "${req.query.hidden_ability}"`;
        
            } else {
                // if hidden_ability is first filter
                query1 += ` hidden_ability = "${req.query.hidden_ability}"`;
            }
            }
        }

    console.log(query1);             
    db.pool.query(query1, function(error, rows, fields){    
        res.render('pokemon', {Pokemon: rows});                  
    })                                                      
});


/* Adds new pokemon */
app.post('/pokemon', function(req, res) 
    {
        let insertQuery = `INSERT INTO Pokemon (pokemon_name, 
                                                health, 
                                                attack, 
                                                defence, 
                                                special_atk, 
                                                special_def, 
                                                speed, 
                                                type_1, 
                                                type_2, 
                                                ability_1, 
                                                ability_2, 
                                                hidden_ability) 
                                                VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`;

        let insertData = [req.body.pokemon_name, 
                         req.body.health, 
                         req.body.attack, 
                         req.body.defence, 
                         req.body.special_atk, 
                         req.body.special_def, 
                         req.body.speed, 
                         req.body.type_1, 
                         req.body.type_2, 
                         req.body.ability_1, 
                         req.body.ability_2, 
                         req.body.hidden_ability];

        db.pool.query(insertQuery, insertData, function(error, rows, fields) {
            if(error) {
                res.write(JSON.stringify(error));
                res.end();
            }else {
                res.redirect('/pokemon')
            }
        }) 
    });

/* Delete Pokemon */
/* Need to add function to delete all trainers in storage that caught this Pokemon */
app.get('/delete_pokemon', function (req, res) {

    // let breed_id = req.query.breed_id;

    /* delete pokemon from storage */
    let deleteStorage = `DELETE FROM Storage WHERE pokeid=${req.query.breed_id}`;
    db.pool.query(deleteStorage, function (error, rows, fields) {
        if(error) {

            res.write(JSON.stringify(error));
            res.end();
        }})

    /* delete pokemon from pokemon */
    let deleteQuery = `DELETE FROM Pokemon WHERE breed_id=${req.query.breed_id}`;

    db.pool.query(deleteQuery, function (error, rows, fields) {
        if(error) {
            res.write(JSON.stringify(error));
            res.end();
        }
        else {
            res.redirect('/pokemon')
        }
    }) 
});

/* Update button redirects to update_pokemon*/
/* Searches for Region from table */
/* Converts letter to full gender text */
app.get('/update_pokemon', function (req, res) {
    let insertQuery = `SELECT * FROM Pokemon WHERE breed_id=${req.query.breed_id}`;
    let result;

    console.log("values", req.query)

    res.render('update_pokemon', {breed_id: req.query.breed_id, 
                                 pokemon_name: req.query.pokemon_name, 
                                 health:req.query.health, 
                                 attack: req.query.attack, 
                                 defence: req.query.defence, 
                                 special_atk: req.query.special_atk, 
                                 special_def: req.query.special_def, 
                                 speed: req.query.speed, 
                                 type_1: req.query.type_1, 
                                 type_2: req.query.type_2, 
                                 ability_1: req.query.ability_1, 
                                 ability_2: req.query.ability_2, 
                                 hidden_ability: req.query.hidden_ability});
        });

/* Updates trainer data */
app.post('/update_pokemon', function (req, res) {

    let data = req.body;
    console.log('data', data);

    let updateQuery = `UPDATE Pokemon SET pokemon_name="${req.body.pokemon_name}", 
                                        health="${parseInt(req.body.health)}", 
                                        attack="${parseInt(req.body.attack)}", 
                                        defence="${parseInt(req.body.defence)}", 
                                        special_atk="${parseInt(req.body.special_atk)}",
                                        special_def="${parseInt(req.body.special_def)}", 
                                        speed="${parseInt(req.body.speed)}", 
                                        type_1="${req.body.type_1}", 
                                        type_2="${req.body.type_2}", 
                                        ability_1="${req.body.ability_1}",
                                        ability_2="${req.body.ability_2}", 
                                        hidden_ability="${req.body.hidden_ability}" 
                                        WHERE breed_id="${req.body.breed_id}"`;

    db.pool.query(updateQuery, function (error, rows, fields) {
        if(error) {
            res.write(JSON.stringify(error));
            res.end();
        }
        else {
            res.redirect('/pokemon')
        }
    }) 
});

// Route handler for Regions page
app.get('/region', function(req, res){
    let query1;
    if (req.query.region_name === undefined){
        query1 = "SELECT * FROM Region ORDER BY `unique_region_id` ASC;";
    } else {
        query1 = `SELECT * FROM Region WHERE region_name="${req.query.region_name}"`;
    }
    db.pool.query(query1, function(error, rows, fields){    
        res.render('region', {Region: rows});                  
    })                                                      
});

/* Adds new region */
app.post('/region', function(req, res) 
    {
        let insertQuery = "INSERT INTO Region (region_name) VALUES (?)";
        let insertData = [req.body.region_name];
        db.pool.query(insertQuery, insertData, function(error, rows, fields) {
            if(error) {
                res.write(JSON.stringify(error));
                res.end();
            }else {
                res.redirect('/region')
            }
        }) 
    });

app.get('/update_region', function (req, res) {
    let insertQuery = `SELECT * FROM Region WHERE unique_region_id="${req.query.region_id}"`;
    let result;

    console.log("values", req.query)

    res.render('update_region', {region_id: req.query.region_id, 
                                    region_name: req.query.region_name});
        });

/* Updates region data */
app.post('/update_region', function (req, res) {

    let data = req.body;
    console.log('data', req.body);
    let updateQuery = `UPDATE Region SET region_name="${req.body.region_name}" WHERE unique_region_id="${req.body.region_id}"`;

    db.pool.query(updateQuery, function (error, rows, fields) {
        if(error) {
            res.write(JSON.stringify(error));
            res.end();
        }
        else {
            res.redirect('/region')
        }
    }) 
});

// Route handler for Storage page
app.get('/storage', function(req, res)
    {  
        let query1;
        if (req.query.pid === undefined){
            query1 = "SELECT * FROM Storage";
        }else{
            query1 = `SELECT * FROM Storage WHERE pid="${req.query.pid}"`;            

        }
        db.pool.query(query1, function(error, rows, fields){
            query2 = "SELECT unique_player_id FROM Trainer";

            db.pool.query(query2, function(error, id, fields){
                console.log(id)
                res.render('storage', {Storage: rows, Storage1: id}) 
            })     
        }) 
    });

/* Adds trainer to pokemon relationship */
app.post('/storage', function(req, res) 
    {
        console.log(req.body)
        let insertQuery = "INSERT INTO Storage (pid,pokeid) VALUES (?,?)";
        let insertData = [req.body.pid, req.body.pokeid];
        db.pool.query(insertQuery, insertData, function(error, rows, fields) {
            if(error) {
                res.write(JSON.stringify(error));
                res.end();
            }else {
                res.redirect('/storage')
            }
        }) 
    });


/* deletes pokemon to trainer relationship */
app.get('/delete_storage', function (req, res) {
    let pid = req.query.pid;
    let pokeid = req.query.pokeid;
    let deleteQuery = `DELETE FROM Storage WHERE pid = ${pid} AND pokeid = ${pokeid}`;

    db.pool.query(deleteQuery, function (error, rows, fields)  {
        if(error) {
            res.write(JSON.stringify(error));
            res.end();
        }
        else {
            res.redirect('/storage')
        }
    })
});

// Route handler for internal server error
app.use(function(err, req, res, next)
    {
        console.error(err.stack);
        res.status(500);
        res.send('500 Error');
    });

/*
    LISTENER
*/
app.listen(PORT, function(){
    console.log('Express started on http://localhost: ' + PORT);
});