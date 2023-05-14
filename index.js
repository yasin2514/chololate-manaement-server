const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// middleware 
app.use(cors());
app.use(express.json());

console.log()


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zexvqii.mongodb.net/?retryWrites=true&w=majority`;


const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        await client.connect();
        const chocolateCollection = client.db("ChocolateDB").collection('chocolate');


        app.get('/chocolates', async (req, res) => {
            const cursor = chocolateCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        });

        app.get('/chocolates/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await chocolateCollection.findOne(query);
            res.send(result);
        })


        app.post('/chocolates', async (req, res) => {
            const chocolate = req.body;
            console.log('new data', chocolate)
            const result = await chocolateCollection.insertOne(chocolate);
            res.send(result);
        })

        app.delete('/chocolates/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await chocolateCollection.deleteOne(query);
            res.send(result);
        })

        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Chocolate server is running')
});

app.listen(port, () => {
    console.log(`chocolate server is running on port ${port}`)
})