const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;

const password = 'xzjDjYDmopuCzpts';

const uri = "mongodb+srv://glamourUser:xzjDjYDmopuCzpts@cluster0.r1fla.mongodb.net/Glamourdb?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }),)


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})


client.connect(err => {
  const itemCollection = client.db("Glamourdb").collection("products");
  
  app.get('/products', (req, res) => {
      itemCollection.find({})
      .toArray( (err, documents) =>{
          res.send(documents);
      })
  })

  app.post("/addProduct", (req, res) =>{
    const item = req.body;
    itemCollection.insertOne(item)
    .then(result => {
        console.log('data added proudly');
        res.redirect('/')
    })
  })

  app.patch('/update/:id', (req, res) =>{
      itemCollection.updateOne({_id: ObjectId(req.params.id)},
      {
          $set: {quantity: req.body.quantity,
              price: req.body.price}
      })
      .then(result => {
          res.send(result.modifiedCount > 0)
      })
  })


  app.get('/product/:id', (req, res) => {
    itemCollection.find({_id: ObjectId(req.params.id)})
    .toArray( (err, documents) =>{
        res.send(documents[0]);
    })
})

  app.delete('/delete/:id', (req, res) =>{
   itemCollection.deleteOne({_id: ObjectId(req.params.id)})
   .then( result => {
     res.send(result.deletedCount > 0)
   })
  })

});


app.listen(3000);