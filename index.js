const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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

// const toyCollection = client.db('toyMarket').collection('myToys');
const allToyCollection = client.db('toyMarket').collection('allToys');


// All toy get data base
app.get('/alltoys', async(req, res) =>{
  const cursor = allToyCollection.find();
  const result = await cursor.toArray();
  console.log(result)
  res.send(result)
})

// Get id 
app.get('/alltoys/:id', async(req, res)=>{
  const id = req.params.id;
  const query ={_id: new ObjectId(id)}
  const user = await allToyCollection.findOne(query)
  console.log(user)
  res.send(user)
  
})

// Get add My toys
app.get('/mytoys/:email', async(req, res)=>{
  const result = await allToyCollection.find({email: req.params.email}).toArray()
  res.send(result)
})

// Add toy data
app.post('/addToys', async(req,  res) =>{
  const toydata = req.body;
  const result = await allToyCollection.insertOne(toydata);
  res.send(result)
})





// Delete My toys
app.delete('/mytoys/:id', async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) }
  const result = await allToyCollection.deleteOne(query);
  res.send(result);
})




// Update My toys
app.put('/mytoys/:id', async (req, res) => {
  const id = req.params.id;
  const filter = { _id: new ObjectId(id) };
  const options = {upset: true };
  const updatedMyToys = req.body;
  
  const updateDoc = {
      $set: {
          // status: updatedMyToys.status
          name: updatedMyToys.name,
          quantity: updatedMyToys.quantity,
          price: updatedMyToys.price,
          description: updatedMyToys.description
          
      },
  };
  const result = await allToyCollection.updateOne(filter, updateDoc, options);
  res.send(result);
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