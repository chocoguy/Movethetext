const { MongoClient } = require('mongodb')
require('dotenv').config()
let testya = "da"
let files
let notes
let test
let users
let movethetextDb  

const client = new MongoClient(process.env.URI)

class DAO{



    static async InitDB() {
        try{
        await client.connect()
        const db = client.db(process.env.DB_NAME)
        files = db.collection("files")
        notes = db.collection("notes")
        test = db.collection("test")
        users = db.collection("users")
        console.log("DB Connected")
        }catch(error){
            console.error(`Error InitDB ${error}`)
        }
    }

    
    static async injectDB(client) {
        try{
           // movethetextDb = await conn.db(process.env.DB_NAME)
           // users = client
           //  test = dbTest
           // notes = dbNotes
            // files = dbFiles
            // let db = client.db(process.env.DB_NAME)
            // files = db.collection('files')
            // notes = db.collection('notes')
            // test = db.collection('test')
            // users = db.collection('users')
            

        }catch(error){
            console.error(`No DB connection ${error}`)
        }
    }



}


module.exports = DAO

//movethetext
//files
//notes
//test
//users