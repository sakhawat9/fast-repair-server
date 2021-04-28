const express = require('express')
const app = express()
const cors = require('cors');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
require('dotenv').config();
const port = 5000

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0hcik.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

// console.log(process.env.DB_NAME);
app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})



const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
  const serviceCollection = client.db("fastRepair").collection("service");
  const reviewCollection = client.db("fastRepair").collection("review");
  const bookingCollection = client.db("fastRepair").collection("booking");
  const adminCollection = client.db("fastRepair").collection("admin");
    
  app.post("/addService", (req, res) => {
        const newService = req.body;
        serviceCollection.insertOne(newService)
        .then(result => {
            console.log(result.insertedCount);
            res.send(result.insertedCount > 0);
        })
    })
    app.get('/services', (req, res) => {
        serviceCollection.find()
        .toArray((err, items) => {
          res.send(items)
        })
      })

      app.get('/service/:id', (req, res) => {
        const id = ObjectID(req.params.id);
        // console.log(id);
        serviceCollection.find({_id: id})
        .toArray((err, documents) => {
          console.log(documents);
          res.send(documents);
        })
      })

      app.delete('/delete/:id', (req, res) => {
        const id = ObjectID(req.params.id);
        console.log(id);
        serviceCollection.findOneAndDelete({_id: id})
        .then(result => {
          console.log(result);
          res.send(result.value)
        })
      })

      app.post("/addReview", (req, res) => {
        const newReview = req.body;
        console.log('adding new service', newReview);
        reviewCollection.insertOne(newReview)
        .then(result => {
            console.log(result.insertedCount);
            res.send(result.insertedCount > 0);
        })
    })
    app.get('/review', (req, res) => {
      reviewCollection.find()
      .toArray((err, items) => {
        res.send(items)
      })
    })
  
    app.post('/addBooking', (req, res) => {
      const newBooking = req.body;
      bookingCollection.insertOne(newBooking)
      .then(result => {
        res.send(result.insertedCount > 0)
      })
    })
    app.get('/orderList', (req, res) => {
      bookingCollection.find()
      .toArray((err, items) => {
        res.send(items)
      })
    })

    app.get('/bookingList', (req, res) => {
      bookingCollection.find({email: req.query.email})
      .toArray((err, items) => {
        res.send(items)
      })
    })


    app.patch('/updateBookingStatus', (req, res) => {
      const {id, status} = req.body;
      console.log(id);
      bookingCollection.findOneAndUpdate(
      {_id: ObjectID(id)},
      {
        $set: {status: status},
      }
      )
      .then(result => {
        console.log(result);
        res.send(result.lastErrorObject.updateExisting)
      })
    })

    app.post('/admin', (req, res) => {
      const admin = req.body;
      console.log(admin);
      adminCollection.insertOne(admin)
      .then(result => {
        console.log(result);
        res.send(result.insertedCount > 0);
      })
    })

});


app.listen(process.env.PORT || port);
