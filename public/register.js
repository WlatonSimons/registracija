const ConfigFile = require('../setup/config');
var mysql = require('mysql');

module.exports = exports = function(name, lname, date, time, callback) {
  
    var con = mysql.createConnection({
        host:  ConfigFile.host,
        user:  ConfigFile.user,
        password:  ConfigFile.password,
        database: ConfigFile.database
    });


    function checkDateAvailability(db,table,time,date,callback){
      var sql = "SELECT * FROM "+db+"."+table+" WHERE date = '"+date+"' AND time = '"+time+"'";
      con.query(sql, function(err, result)
      {
          if (err) 
              callback(err,null);
          else
              callback(null,result[0]);
      });
    }

    function checkDateValid(entrie,callback){
      const date1 = new Date();
      const date2 = new Date(entrie.recordDate);
      const diffTime = Math.abs(date2 - date1);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

      if(diffDays>7){
        callback(null,"1");
      }else{
        callback(null,"2");
      }
    }

    function write(name, lname, date, time,table, callback)
    {
      var sql = "INSERT INTO "+table+" (name, lname, date, time) VALUES ('"+name+"', '"+lname+"','"+date+"','"+time+"')";
      con.query(sql, function (err, result) {
        if (err){
          callback(err,null);
        } else{
          callback(null,"Registered");
        }
      });
    }

    function getName(name, lname, db, table, callback)
    {
      var sql = "SELECT * FROM "+db+"."+table+" WHERE name = '"+name+"' AND lname = '"+lname+"'";
      con.query(sql, function(err, result)
      {
          if (err) 
              callback(err,null);
          else
              callback(null,result[0]);
      });

    }


    con.connect(function(err) {
        if (err) throw err;

        getName(name,lname,ConfigFile.database,ConfigFile.table, function(err,entrie){
          if (err) {
              console.log("ERROR : ",err);            
          } else {            
              if(entrie == undefined) {
                checkDateAvailability(ConfigFile.database,ConfigFile.table,time,date,function(err,data){
                   if(data == undefined){
                    write(name,lname,date,time,ConfigFile.table, function(err,data){
                      callback("Registracija baigta")
                    });
                   }else{
                    callback("Pasirinkta data užimta");
                   }
                });
              } else {

                checkDateAvailability(ConfigFile.database,ConfigFile.table,time,date,function(err,data){
                  if(data == undefined){
                    checkDateValid(entrie,function(err,data){
                      if(data==1){
                       write(name,lname,date,time,ConfigFile.table, function(err,data){
                         callback("Registracija baigta")
                       });
                      }else{
                        callback("Jus jau esate užsiregistave, registracijos laikas:"+ entrie.date + " " + entrie.time);
                      }
                   });
                  }else{
                   callback("Pasirinkta data užimta");
                  }
               });
                
              }
          }    
        });
    });
};
