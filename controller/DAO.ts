import { time } from "console"

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



//!TODO

// Figure out proper data types and implement over application
// Implement check user method to double check JWT's making app more secure

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

    static RNG(maxint : number){
        return Math.floor(Math.random() * maxint);
    }

    static AlphaRNG(){
        return (Math.random() + 1).toString(36).substring(3)
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




    static async AddUser(userInfo: any) : Promise<any> {
        try{



                await users.insertOne({username: userInfo.username, password: userInfo.password, settings: userInfo.settings, storage: userInfo.storage, notekey: userInfo.notekey, userid:  userInfo.userid})
                return "success"

        }catch(error){
            if (String(error).startsWith("MongoError: E11000 duplicate key error")) {
                return "A user with the given username already exists."
              }
            console.error(`error on AddUser on DAO.ts ${error}`)
            return null
        }
    }


    static async GetUser(username : any) : Promise<any> {
        try{
            return await users.findOne({"username" : username})
        }catch(error){
            console.error(`error on GetUser on DAO.ts ${error}`)
            return null
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
            return null
        }
    }


    static async LogoutUser(userid : any) : Promise<any> {
        try{

            await sessions.deleteOne({ "userid" : userid })

            return "success"

        }catch(error){
            console.error(`Error on LogoutUser on DAO.ts ${error}`)
            return null
        }
    }

    static async CheckToken(JWT : any){
        try{
            return await sessions.findOne({"JWT" : JWT})
        }catch(error){
            console.error(`error on CheckToken on DAO.ts ${error}`)
            return null
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
            return null
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
            return null
        }
    }

    //!END AUTH




    //!NOTES


    static async CreateNote(userid: any, encryptedtitle : any, encryptedNote : any, privacy : any) : Promise<any> {
        try{

            var lastEditRaw : Date = new Date();
            var noteid : number = this.RNG(999999999);

            

            await notes.insertOne(
                {
                    "noteid" : noteid.toString(),
                    "userid" : userid,
                    "notetitle" : encryptedtitle,
                    "note" : encryptedNote,
                    "privacy" : privacy,
                    "sharekey" : "",
                    "lastedit" : lastEditRaw

                }
            )

            return noteid

        }catch(error){
            console.error(`error on CreateNote on DAO.ts ${error}`)
            return null
        }
    }


    static async CreateNoteShareLink(noteid: any, userid: any) : Promise<any> {
        try{

            var shareKey : string = this.AlphaRNG();

            await notes.updateOne(
                { "noteid" : noteid },
                { "userid" : userid },
                { $set: { "sharekey" : shareKey, "privacy" : "private|link" } },
                { upsert: true }
            )

            return `Share Link: http://localhost:5000/note/id/${noteid}/sharekey/${shareKey}`



        }catch(error){
            console.error(`error on CreateNoteShareLink on DAO.ts ${error}`)
            return null
        }
    }


    static async RevokeNoteShareLink(noteid: any, userid: any) : Promise<any> {
        try{

            await notes.updateOne(
                { "noteid" : noteid },
                { "userid" : userid },
                { $set: { "sharekey" : "", "privacy" : "private|private" } },
                { upsert: true }
            )


            return "link revoked"



        }catch(error){
            console.error(`error on RevokeNoteShareLink on DAO.ts ${error}`)
            return null
        }
    }

 
    //only used to get PERSONAL notes
    static async GetNoteById(noteid : any, userid : any, notetype : string) : Promise<any> {
        try{

            //FOR notetype
            // personal == retrive personal note, check userid and noteid
            //public == retrive public note, check noteid and permissions

            if(notetype == "personal"){
                return await notes.findOne({ "userid" : userid, "noteid" : noteid })
            }else if(notetype == "public"){
                return await notes.findOne({ "noteid" : noteid, "privacy" : "private|public" })
            }



        }catch(error) {
            console.error(`error on GetnoteById on DAO.ts ${error}`)
            return null
        }
    }

    static async GetNoteBySharekey(noteid : any, sharekey : any) : Promise<any> {
        try{

            return await notes.findOne({ "noteid" : noteid, "sharekey" : sharekey, "privacy" : "private|link" })

        }catch(error) {
            console.error(`error on GetNoteByShareKey on DAO.ts ${error}`)
            return null
        }
    }





    static async DeleteNote(noteid : any, userid : any) : Promise<any> {
        try{

            await notes.deleteOne({ "userid" : userid, "noteid" : noteid })

            return "Note removed"

        } catch(error) {
            console.error(`errror on DeleteNote on DAO.ts ${error}`)
            return null
        }
    }


    static async EditNote(noteid : any, userid : any, encryptedtitle : any, encryptedNote : any) : Promise<any> {
        try{

            var lastEditRaw : Date = new Date();

            await notes.updateOne(
                { "noteid" : noteid },
                { "userid" : userid },
                { $set: { "note" : encryptedNote, "notetitle" : encryptedtitle, "lastedit" : lastEditRaw } }
            )

            return "Note Modified"

        } catch(error) {
            console.error(`error on EditNote on DAO.ts ${error}`)
            return null
        }
    }


    static async viewUserNotes(userid : any) : Promise<any> {
        try{

            return await notes.find({ "userid" : userid })


        } catch(error) {
            console.error(`error on viewUserNotes on DAO.ts ${error}`)
            return null
        }
    }


    static async viewPublicNotes() : Promise<any> {
        try{
            return await notes.find({ "privacy" : "private|public" })
        } catch(error) {
            console.error(`error on viewPublicNotes on DAO.ts ${error}`)
            return null
        }
    }

    static async makeNotePublic(noteid : any, userid : any) : Promise<any> {
        try{

            var lastEditRaw : Date = new Date()

            await notes.updateOne(
                { "noteid" : noteid },
                { "userid" : userid },
                { $set: { "privacy" : "private|public", "lastedit" : lastEditRaw } }
            )

            return "Note updated"


        } catch(error) {
            console.error(`error on makeNotePublic on DAO.ts ${error}`)
            return null
        }
    }

    static async makeNotePrivate(noteid : any, userid : any) : Promise<any> {
        try{

            var lastEditRaw : Date = new Date()

            await notes.updateOne(
                { "noteid" : noteid },
                { "userid" : userid },
                { $set: { "privacy" : "private|private", "lastedit" : lastEditRaw } }
            )

            return "Note updated"


        } catch(error) {
            console.error(`error on makeNotePublic on DAO.ts ${error}`)
            return null
        }
    }


    static async updateUserSettings(userid : any, settings : any) : Promise<any> {
        try {

            await users.updateOne(
                {"userid" : userid},
                { $set: { "settings" : settings } }
            )

            return "User settings updated"

        } catch (error) {
            console.error(`error on updateUserSettings on DAO.ts ${error}`)
            return null
        }
    }


    //!END NOTES    




    //!FILES


    static async CreateFile(userid : any, filetitle : any, filename : any, link : any) : Promise<any> {
        try {
            var lastEditRaw : Date = new Date()
            var fileid : number = this.RNG(99999);

            await files.insertOne(
                {
                    "fileid" : fileid,
                    "userid" : userid,
                    "filetitle" : filetitle,
                    "filename" : filename,
                    "privacy" : "private|private",
                    "link" : link,
                    "sharekey" : "",
                    "lastedit" : lastEditRaw

                }
            )

            return fileid


        } catch (error) {
            console.error(`error on CreateFile on DAO.ts ${error}`)
            return null
        }
    }


    static async ViewFileById(userid: any, fileid : any) : Promise<any> {
        try{

            return await files.findOne({ "userid" : userid, "fileid" : fileid })

        } catch (error) {
            console.error(`error on ViewFileById on DAO.ts ${error}`)
            return null
        }
    }


    static async DeleteFile(userid : any, fileid : any) : Promise<any> {
        try {
            
            await files.deleteOne({ "userid" : userid, "fileid" : fileid })

            return "File deleted"

        } catch (error) {
            console.error(`error on DeleteNote on DAO.ts ${error}`)
            return null
        }
    }


    static async ViewUserFiles(userid : any) : Promise<any> {
        try {

            


            return await files.find({ "userid" : userid})

        } catch (error) {
            console.error(`error on ViewUserFiles on DAO.ts ${error}`)
            return null
        }
    }








}


module.exports = DAO

//movethetext
//files
//notes
//test
//users