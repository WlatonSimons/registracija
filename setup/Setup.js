const ConfigFile = require('./config');
var mysql = require('mysql');

var con = mysql.createConnection({
  host:  ConfigFile.host,
  user:  ConfigFile.user,
  password:  ConfigFile.password,
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connection established");
  con.query("SHOW DATABASES LIKE '" +  ConfigFile .database + "'", function (err, result) {
    if (err) throw err;
    if(result[0] == undefined){
      con.query("CREATE DATABASE " +  ConfigFile .database, function (err, result) {
        if (err) throw err;
        console.log("Database " +  ConfigFile .database + " created");
      });
      con.query("USE " +  ConfigFile .database, function (err, result) {
        if (err) throw err;
        console.log("Connected to database " +  ConfigFile .database);
      });
      var sql = "CREATE TABLE "+ConfigFile.table+" (id INT(11) NOT NULL AUTO_INCREMENT, name VARCHAR(255),lname VARCHAR(255),PRIMARY KEY (`id`), date VARCHAR(255), time TIME,recordDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP)";
      con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Table "+ConfigFile.table+ " created");
      });
      con.end();
    }else{
      console.log("Database found, aborting");
      con.end();
    }
  });
});

