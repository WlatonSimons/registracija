const ConfigFile = require('../setup/config');
var mysql = require('mysql');

module.exports = exports = function(callback) {
  
    var con = mysql.createConnection({
        host:  ConfigFile.host,
        user:  ConfigFile.user,
        password:  ConfigFile.password,
        database: ConfigFile.database
    });

    function getJson(callback){
        var sql = "SELECT * FROM "+ConfigFile.database+"."+ConfigFile.table+"";
        con.query(sql, function(err, result)
        {
            if (err) 
                callback(err,null);
            else
                callback(null,result);
        });
      }

      getJson(function(err,data){
        callback(data);
     });
};
