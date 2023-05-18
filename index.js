const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
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

        app.post('/alltoys', async (req, res) => {
            const toyData = req.body;
            const result = await allToys.insertOne(toyData);
            res.status(200).json({
                status: "success",
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