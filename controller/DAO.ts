export {}
const { MongoClient } = require('mongodb')
require('dotenv').config()
let testya : string = "da"
let files : any 
let notes : any
let test : any
let users : any
let sessions : any
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
        sessions = db.collection("sessions")
        console.log("DB Connected")
        }catch(error){
            console.error(`Error InitDB ${error}`)
        }
    }




    //? TryCatch template

    // try{

    // }catch(error){
    //     console.error(`error on CheckToken on DAO.ts ${error}`)
    //     return "Server transaction error please try again later"
    // }



    
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





//! ---------AUTH--------- 




    static async AddUser(userInfo: any) : Promise<string> {
        try{
            await users.insertOne({username: userInfo.username, password: userInfo.password, settings: userInfo.settings, storage: userInfo.storage, notekey: userInfo.notekey, userid:  userInfo.userid})
            return "success"
        }catch(error){
            if (String(error).startsWith("MongoError: E11000 duplicate key error")) {
                return "A user with the given username already exists."
              }
            console.error(`error on AddUser on DAO.ts ${error}`)
            return "Server transaction error try again later"
        }
    }


    static async GetUser(username : any) : Promise<any> {
        try{
            return await users.findOne({"username" : username})
        }catch(error){
            console.error(`error on GetUser on DAO.ts ${error}`)
            return "Server transaction error please try again later"
        }
        
    }

    static async LoginUser(userid : any, JWT : any) : Promise<any> {
        try{

            var checkLoginUser : any = await sessions.findOne({"userid" : userid}) 

            if (checkLoginUser == null) {
                await sessions.insertOne({"userid" : userid, "JWT" : JWT})
            } else {
                await sessions.deleteOne({ "userid" : userid })
                await sessions.insertOne({"userid" : userid, "JWT" : JWT})
            }

            
            return "success"
        }catch(error){
            console.error(`Error on LoginUser on DAO.ts ${error}`)
            return "Server Login error please try again later"
        }
    }


    static async LogoutUser(userid : any) : Promise<any> {
        try{

            await sessions.deleteOne({ "userid" : userid })

            return "success"

        }catch(error){
            console.error(`Error on LogoutUser on DAO.ts ${error}`)
            return "Server Logout error please try again later"
        }
    }

    static async CheckToken(JWT : any){
        try{
            return await sessions.findOne({"JWT" : JWT})
        }catch(error){
            console.error(`error on CheckToken on DAO.ts ${error}`)
            return "Server transaction error please try again later"
        }
    }

    static async UpdatePassword(userid : any, newPassword : any) : Promise<any> {
        try{

           await users.updateOne(
               { "userid" : userid },
               { $set: { "password" : newPassword } },
               { upsert: true }
           )

           return "success"

        }catch(error){
            console.error(`error on UpdatePassword on DAO.ts ${error}`)
            return "Server transaction error please try again later"
        }
    }


    static async DeleteUser(userid: any) : Promise<any> {
        try{

            await users.deleteOne({"userid" : userid})
            await notes.deleteMany({"userid" : userid})
            await files.deleteMany({"userid" : userid})
            await sessions.deleteMany({"userid" : userid})
            return "success"

        }catch(error){
            console.error(`error on DeleteUser on DAO.ts ${error}`)
            return "Server transaction error please try again later"
        }
    }



}


module.exports = DAO

//movethetext
//files
//notes
//test
//users