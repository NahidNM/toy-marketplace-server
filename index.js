const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()
const app = express();
const cors = require('cors');

const port = process.env.PORT || 4000;

// midleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jo7sbx1.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

const toyCollection = client.db('toyMarket').collection('myToys');
const allToyCollection = client.db('toyMarket').collection('allToys');

app.get('/myToys', async(req, res) =>{

    const cursor = toyCollection.find();
    const result = await cursor.toArray();
    res.send(result);
})

// All toy get data base
app.get('/alltoys', async(req, res) =>{
  const cursor = allToyCollection.find();
  const result = await cursor.toArray();
  console.log(result)
  res.send(result)
})


// Add toy data
app.post('/addToys', async(req,  res) =>{
  const toydata = req.body;
  const result = await toyCollection.insertOne(toydata);
  res.send(result)
})


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res)=>{
res.send("toy is running");
});



app.listen(port, ()=>{
    console.log(`toy api is running on port : ${port}`)
})