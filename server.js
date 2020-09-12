var express = require('express');
var app = express();
var register = require('./public/register');
var data = require('./public/data');

app.engine('html', require('ejs').renderFile);
app.use(express.static(__dirname));

app.configure(function(){
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
})

app.post('/register', function(req,res){
    register(req.body.name,req.body.lname,req.body.date,req.body.time, function(data) {
        console.log(data);
        res.send(data);
      });
});
app.post('/table', function(req,res){
  data(function(data) {
    res.send(data);
  });
});

app.get('/register', function(req,res) {
    res.render('register.html');
  })

app.listen(8080);
console.log("Listening on port 8080");