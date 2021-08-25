export {}
const { MongoClient } = require('mongodb')
require('dotenv').config()
let testya : string = "da"
let files : any 
let notes : any
let test : any
let users : any
let movethetextDb : string

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

    
    static async injectDB(client: any) {
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


    static async AddUser(userInfo: any){
        try{
            await users.insertOne({username: userInfo.username, password: userInfo.password, settings: userInfo.settings, storage: userInfo.storage, notekey: userInfo.notekey, userid:  userInfo.userid})
            return "success"
        }catch(error){
            if (String(error).startsWith("MongoError: E11000 duplicate key error")) {
                return { error: "A user with the given username already exists." }
              }
            console.error(`error on AddUser on DAO.js ${error}`)
            return error
        }
    }



}


module.exports = DAO

//movethetext
//files
//notes
//test
//users