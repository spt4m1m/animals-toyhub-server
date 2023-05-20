const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const path = require('path');
const cors = require('cors');
require('dotenv').config()
const colors = require('colors');
const app = express();
const port = process.env.PORT || 5000;

// middlewares 
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASS}@cluster0.negee10.mongodb.net/?retryWrites=true&w=majority`;

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
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log(`animals-toyhub DATABASE Connected`.cyan);
        // database
        const allToys = client.db('alltoys').collection('alltoys');

        // add a toy 
        app.post('/alltoys', async (req, res) => {
            const toyData = req.body;
            const result = await allToys.insertOne(toyData);
            res.status(200).json({
                status: "success",
                data: result
            })
        })

        // get all toys 
        app.get('/alltoys', async (req, res) => {
            let query = {};
            const email = req.query.email;
            if (email) {
                query = { sellerEmail: email }
            }
            const result = await allToys.find(query).limit(20).toArray();
            res.send(result)
        })
        // get all toys by ascending sort
        app.get('/ascendingsort', async (req, res) => {
            const email = req.query.email;
            const result = await allToys.find({ sellerEmail: email }).sort({ price: 1 }).toArray();
            res.send(result)
        })
        // get all toys by dscending sort
        app.get('/dscendingsort', async (req, res) => {
            const email = req.query.email;
            const result = await allToys.find({ sellerEmail: email }).sort({ price: -1 }).toArray();
            res.send(result)
        })

        // get toy by category 
        app.get('/category', async (req, res) => {
            const category = req.query.category;
            const query = { category: category }
            const result = await allToys.find(query).toArray();
            res.send(result)
        })

        // get a single toy
        app.get('/alltoys/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await allToys.find(query).toArray();
            res.send(result)
        })

        // update a single toy 
        app.patch('/updatetoy/:id', async (req, res) => {
            const id = req.params.id;
            const data = req.body;
            const filter = { _id: new ObjectId(id) }
            const updatedDoc = {
                $set: {
                    name: data.name,
                    photoUrl: data.photoUrl,
                    description: data.description,
                    price: data.price,
                    availableQuantity: data.availableQuantity,
                    ratings: data.ratings,
                    category: data.category
                }
            }
            const result = await allToys.updateOne(filter, updatedDoc);
            res.send(result)
        })

        // delete a toy 
        app.delete('/alltoys/delete/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await allToys.deleteOne(query);
            res.status(200).json({
                status: 'success',
                data: result
            })
        })

    } finally {

    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'));
})



app.listen(port, () => {
    console.log(`Server Running On PORT ${port}`.yellow);
})