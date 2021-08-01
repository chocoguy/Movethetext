const MongoClient = require('mongodb').MongoClient
const express = require('express')
const cors = require('cors')
const DAO = require('./controller/DAO')


const app = express();
require('dotenv').config()
app.use(cors())
app.use(express.json({extended: false}))


const PORT = process.env.PORT || 5000


try{

    const client = new MongoClient.connect(
        process.env.URI,
        { useNewUrlParser: true },
        { poolSize: 50 },
        { connectTimeoutMS: 2500 },
        { useUnifiedTopology: true }
    )

    DAO.injectDB(client)
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`))


//comment


}catch(error){
    console.error($`error at index.js ${error}`)
    process.exit(1)
}
