const express = require('express');
const parser = require('body-parser');
const server = express();

server.use(parser.json());
server.use(express.static('client/build'));
server.use(parser.urlencoded({extended: true}));


const MongoClient = require("mongodb").MongoClient;
const ObjectID = require("mongodb").ObjectID;

MongoClient.connect("mongodb://localhost:27017", function(err, client){
  if(err){
    console.log(err);
    return;
  }

  const db = client.db("bucket_list");
  console.log("connected to database");

  server.post('/api/countries', function(req, res, next){
    const countryCollection = db.collection("countries");
    const countryToSave = req.body;
    countryCollection.save(countryToSave, function(err, result){
      if(err) next(err);
      res.status(201);
      res.json(result.ops[0])
      res.send();
      console.log("saved to DB");
    })
  })

  server.get("/api/countries", function(req, res, next){
    const countryCollection = db.collection("countries");
    countryCollection.find().toArray(function(err, allCountries){
    if(err) next(err); //Cool error handeling line
    res.json(allCountries);
    });
  });

  server.delete('/api/countries/:id', function(req, res, next){
   const countryCollection = db.collection("countries");
   const objectID = ObjectID(req.params.id);
   countryCollection.remove({_id: objectID}, function(err, result){
     if(err) next(err);
     res.status(200).send();
   })
 });

  server.delete("/api/countries", function(req, res, next) {
    const countryCollection = db.collection("countries");
    countryCollection.remove({}, function(err, result) {
      if (err) next(err);
      res.status(204).send();
    });
  });




  server.listen(3000, function(){
    console.log("Listening on port 3000");
  });

});
