const express = require('express')
const { MongoClient } = require('mongodb');
const app = express()
const cors = require('cors')
require('dotenv').config()
const port = process.env.PORT || 7000;

app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bwvhp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {

        await client.connect();
        const database = client.db('food')
        const foodCollection = database.collection('services')

        // get api
        app.get('/services', async (req, res) => {
            const cursor = foodCollection.find({})
            const services = await cursor.toArray()
            res.send(services)
        })

        // post api
        app.post('/services', async (req, res) => {
            const service = req.body;
            console.log('hit the api', service)

            const result = await foodCollection.insertOne(service)
            console.log(result)
            res.json(result)
        })
    }
    finally {
        // await client.close()
    }
}
run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('hello world Rehad')
})

app.listen(port, () => {
    console.log(`Example app at http://localhost:${port}`)
})