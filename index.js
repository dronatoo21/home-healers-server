const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 4000;

// middleware
app.use(cors({
  origin: ['http://localhost:5173'],
  credentials: true
}));
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tcccoqk.mongodb.net/?retryWrites=true&w=majority`;

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
    // await client.connect();

    const servicesCollection = client.db('homeHealers').collection('services');
    const bookingsCollection = client.db('homeHealers').collection('bookings');

    app.post('/services', async(req, res) => {
        const newService = req.body;
        console.log(newService);
        const result = await servicesCollection.insertOne(newService);
        res.send(result);
      })

      app.post('/bookings', async(req, res)=>{
        const newBooking = req.body;
        console.log(newBooking);
        const result = await bookingsCollection.insertOne(newBooking)
        res.send(result)
      })

      app.get('/services', async (req, res) => {
        const cursor = servicesCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    })

      app.get('/bookings', async (req, res) => {
        const cursor = bookingsCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    })

    app.get('/orders', async (req, res) => {
      let query = {};
      if (req.query.providerEamil){
        query = { providerEamil: req.query.providerEamil }
      }
      const result = await bookingsCollection.find(query).toArray();
      res.send(result);
    })

    app.get('/orders/:id', async (req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await bookingsCollection.findOne(query)
      res.send(result);
    })


    app.patch('/orders/:id', async(req, res) =>{
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)}
      const updatedBookings = req.body;
      const updateDoc = {
        $set: {
          status: updatedBookings.status
        }
      }
      const result = await bookingsCollection.updateOne(filter, updateDoc)
      res.send(result);
    })

    app.delete('/bookings/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id : new ObjectId(id)}
      const result = await bookingsCollection.deleteOne(query);
      res.send(result)
    })

    app.get('/myBookings', async (req, res) => {
      let query = {};
      if (req.query?.userEmail){
        query = { userEmail: req.query.userEmail }
      }
      const result = await bookingsCollection.find(query).toArray();
      res.send(result);
    })

    app.get('/myServices', async (req, res) => {
      console.log(req.query);
      let query = {};
      if (req.query?.yourEmail){
        query = { yourEmail: req.query.yourEmail }
      }
      const result = await servicesCollection.find(query).toArray();
      res.send(result);
    })

        
    app.get('/myServices/:id', async (req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await servicesCollection.findOne(query)
      res.send(result);
    })

    app.get('/services/:id', async (req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await servicesCollection.findOne(query)
      res.send(result);
    })

    app.put('/myServices/:id', async (req, res) => {
      const id = req.params.id;
      const filter = {_id : new ObjectId(id)}
      const options = {upsert: true}
      const updatedService = req.body
      const service = {
        $set: {
          pictureUrl: updatedService.pictureUrl, 
          yourImage: updatedService.yourImage,  
          yourName: updatedService.yourName,  
          yourEmail: updatedService.yourEmail, 
          serviceName: updatedService.serviceName, 
          price: updatedService.price, 
          description: updatedService.description, 
          serviceArea: updatedService.serviceArea, 
        }
      }
      const result = await servicesCollection.updateOne(filter, service, options)
      res.send(result)
    })
  // delete
    app.delete('/myServices/:id', async (req, res) => {
      const id = req.params.id;
      const query = {_id : new ObjectId(id)}
      const result = await servicesCollection.deleteOne(query)
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


app.get('/', (req, res) => {
    res.send('server is running')
})

app.listen(port, () => {
    console.log(`server listening on port ${port}`);
})