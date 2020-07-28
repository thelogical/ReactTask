const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const { Client } = require('pg');
const fs = require('fs');


var connectionString = "postgres://postgres:postgres@localhost:5432/mydb";
const client = new Client({
    connectionString: connectionString
});

client.connect();

//test query to output current date and time
client.query('SELECT NOW() as now', (err, res) => {
  if (err) {
    console.log(err.stack)
  } else {
    console.log(res.rows[0])
  }
})

//set POST payload type and maximum size
app.use(bodyParser.json({ type: 'application/x-www-form-urlencoded',limit: '50mb',extended: true }));

//Disable security measures enforced by CORS for testing purposes
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//This route will accept table data as POST and upload to database
app.post('/upload', (req, res) => {

  res.setHeader('Content-Type', 'application/json');
  nm = req.body.name;
  //column names might have spaces and dash which are illegal in postgreSQL
  colnm = req.body.data[0].map(function(x){return x.replace(/[-\s+,]/g, '_')});
  dtypes = req.body.schema;
  query = 'create table '+nm+' (';
  for(var i=0;i<colnm.length;i++) {
    query += ' '+colnm[i]+' '+dtypes[i]+','
  }
  query = query.slice(0,-1)+ ')';
  client.query(query, (err, rs) => {
    if (err) {
      console.log(err.stack)
      //console.log(query);
      res.send(JSON.stringify("Failure!"));
    } else {
      var csv = req.body.data.map(function(d){return d.join();}).join('\n')
       .replace(/(^\[)|(\]$)/mg, '');
      fs.writeFileSync('/tmp/data123.csv', csv);
      client.query('copy '+nm+' from \'/tmp/data123.csv\' delimiter \',\' csv header;', (err, r) => {
        if (err) {
          console.log(err.stack)
          //console.log(query);
          res.send(JSON.stringify("Failure!"));
        } else {
          res.send(JSON.stringify("Success"));
        }
      })
    }
  });

});

app.listen(4000,() => {
  console.log("Its Working!!");
});
