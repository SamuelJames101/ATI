const events = require('events');
const os = require('os');
const bodyParser = require("body-parser");
const spawn = require('child_process').spawn;
const mysql = require('mysql');
const fs = require('fs');
const express = require('express');
const tabulator = require('tabulator-tables');



var app = express();
app.use('/css', express.static(__dirname + '/css'));

app.set('view engine', 'ejs');
var urlencodedParser = bodyParser.urlencoded({ extended: false });

var connection = mysql.createConnection({
  host: 'localhost',
  port: '3306',
  user: 'root',
  password: 'rootroot',
  database: 'automationGo',
  socketPath: '/tmp/mysql.sock'
});

connection.connect(function(err){
  if(err){
    console.log(err)
    console.log('Can not connect to database.');
  } else {
    console.log('Connected to database.')
  }
});


// index page
app.get('/', function(req, res) {
    connection.query("SELECT * FROM devices", function(err, rows, fields){
      if(err){
        console.log(err);
        console.log('Could not get database information');
      }else {
        res.render('start', {rows:rows});
      }
    });
});

//Post request from the user to add an adittional phone into the database
app.post('/addDevice', urlencodedParser, function(req, res, next){
  var post = {ID: null, name: req.body.friendlyName, model_name: req.body.modelName, port: req.body.port, os: req.body.os, os_version: req.body.osVersion, connection: req.body.connected};

    connection.query('INSERT INTO devices SET ?', post, function (err, results, fields){
      if (err){
        console.log(err);
        if (err.code == 'ER_DUP_ENTRY'){
          connection.query("SELECT * FROM devices", function(error, rows, fields){
            if(error){
              console.log(error);
              console.log('Could not get database information');
            }else {
              res.render('start', {error: err.sqlMessage, rows:rows});
            }
          });
        }
      }
  })
});

app.delete('/removeDevice', urlencodedParser, function(req, res, next){
  connection.query('DELETE FROM devices WHERE name = ?', req.body.ID, function (error, results, fields) {
  if (error) throw error;
  console.log('deleted ' + results.affectedRows + ' rows');
})
});

//Post request from the user to start the Eggplant tests
app.post('/start', urlencodedParser, function(req, res, next){
  console.log(req.body);

  var cmd = spawn('/Applications/Eggplant.app/Contents/MacOS/runscript', ['/Users/sam/BT-Mobile-Eggplant/BT\ Mobile\ Test.suite/Scripts/MainScript.script','-host','10.96.4.19', '-port',req.body.option]);
  cmd.stdout.on('data', function (data){
    process.stdout.write(data.toString());
  })

  cmd.stderr.on('data', function (data){
    process.stderr.write(data.toString());
  })
});

app.listen(3000);
