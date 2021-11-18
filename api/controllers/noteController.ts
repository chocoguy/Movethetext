export {}
const DAO = require('../../controller/DAO')
const Cryptr = require('cryptr');
require('dotenv').config()
const cryptr : any = new Cryptr(process.env.NOTE_SECRET)



//!TODO

// consider moving auth functionality to a reusable function DRY
//trigger new JWT when user updates settings or perhaps store on a cookie

class noteController {

    static async CreateNote(req: any, res: any){
        try{

            const reqdata : any = req.body

            const providedJWT = req.get("Authorization").slice("Bearer ".length)

            const currentUserObj = await authController.decodeJWT(providedJWT);
            var { error } = currentUserObj
            if (error){
                res.status(401).json({"error" : "session expired, please log in again."})
                console.error(error);
                return
            }

            const encryptedNote : any = cryptr.encrypt(reqdata.note)
            const encryptedTitle : any = cryptr.ecrypt(reqdata.title)

            const uploadedNote = await DAO.CreateNote(currentUserObj.userid, encryptedTitle, encryptedNote, "private|private")
            if (!uploadedNote) {
                res.status(401).json({ "error" : "error uploading note, please try again later" })
                return
            }



            res.json({
                "noteid" : uploadedNote
            })

        }catch(error){
            console.error(`error on Login on noteController.ts ${error}`)
            res.status(500).json({"error" : "Server error try again later"})
        }
    }

    static async CreateNoteShareLink(req: any, res: any){
        try{

            const reqdata : any = req.body

            const providedJWT = req.get("Authorization").slice("Bearer ".length)

            const currentUserObj = await authController.decodeJWT(providedJWT);
            var { error } = currentUserObj
            if (error){
                res.status(401).json({"error" : "session expired, please log in again."})
                console.error(error);
                return
            }

            const ShareLink = await DAO.CreateNoteShareLink(currentUserObj.noteid, currentUserObj.userid)
            if(!ShareLink) {
                res.status(401).json({ "error" : "error creating share link please try again later" })
                return
            }

            res.json({
                "sharelink" : ShareLink
            })


            
            res.json({
                "message" : "CreateNoteShareLink success"
            })
        }catch(error){
            console.error(`error on CreateNoteShareLink on noteController.ts ${error}`)
            res.status(500).json({"error" : "Server error try again later"})
        }
    }

    static async RevokeNoteShareLink(req: any, res: any){
        try{

            const reqdata : any = req.body

            const providedJWT = req.get("Authorization").slice("Bearer ".length)

            const currentUserObj = await authController.decodeJWT(providedJWT);
            var { error } = currentUserObj
            if(error){
                res.status(401).json({ "error" : "session expired, please log in again." })
                console.error(error)
                return
            }

            const RevokedShareLink = await DAO.RevokeNoteShareLink(currentUserObj.noteid, currentUserObj.userid)
            if(!RevokedShareLink) {
                res.status(401).json({ "error" : "error revoking share link, please try again later" })
                return
            }

            res.json({
                "message" : "ShareLink has been revoked"
            })

        }catch(error){
            console.error(`error on RevokeNoteShareLink on noteController.ts ${error}`)
            res.status(500).json({"error" : "Server error try again later"})
        }
    }

    static async ViewNoteById(req: any, res: any){
        try{

            const reqdata : any = req.body
            const currentUserObj = await authController.CheckToken(req.get("Authorization").slice("Bearer ".length));
            if(!currentUserObj){
                res.status(401).json({ "error" : "session expired, please log in again" })
                return
            }

            let noteid = req.params.id

            const requestedNote = await DAO.GetNoteById(noteid, currentUserObj.userid)
            if(!requestedNote) {
                res.status(401).json({ "error" : "error retriveing note, please try again later" })
                return
            }

            requestedNote.notetitle = cryptr.decrypt(requestedNote.title)
            requestedNote.note = cryptr.decrypt(requestedNote.note)

            res.json(requestedNote)

        }catch(error){
            console.error(`error on ViewNoteById on noteController.ts ${error}`)
            res.status(500).json({"error" : "Server error try again later"})
        }
    }

    static async DeleteNote(req: any, res: any){
        try{

            const reqdata : any = req.body
            const currentUserObj = await authController.CheckToken(req.get("Authorization").slice("Bearer ".length));
            if(!currentUserObj){
                res.status(401).json({ "error" : "session expired, please log in again" })
                return
            }

            let noteid = req.params.id

            const deletedNote = await DAO.DeleteNote(noteid, currentUserObj.userid)
            if(!deletedNote) {
                res.status(401).json({ "error" : "error deleting note, please try again later" })
                return
            }

            res.json({
                "message" : "note has been deleted"
            })
        }catch(error){
            console.error(`error on DeleteNote on noteController.ts ${error}`)
            res.status(500).json({"error" : "Server error try again later"})
        }
    }

    static async EditNote(req: any, res: any){
        try{

            const reqdata : any = req.body
            const currentUserObj = await authController.CheckToken(req.get("Authorization").slice("Bearer ".length));
            if(!currentUserObj){
                res.status(401).json({ "error" : "session expired, please log in again" })
                return
            }
            
            let noteid = req.params.id

            const encryptedNote : any = cryptr.encrypt(reqdata.note)
            const encryptedTitle : any = cryptr.ecrypt(reqdata.title)



            const editNote = await DAO.EditNote(noteid, currentUserObj.userid, encryptedTitle, encryptedNote)
            if(!editNote) {
                res.status(401).json({"error" : "error editing note, please try again later"})
                return
            }

            
            res.json({
                "message" : "note has been edited"
            })

        }catch(error){
            console.error(`error on EditNote on noteController.ts ${error}`)
            res.status(500).json({"error" : "Server error try again later"})
        }
    }

    static async ViewMyNotes(req: any, res: any){
        try{

            const reqdata : any = req.body
            const decryptedNotesArray : any = []
            const currentUserObj = await authController.CheckToken(req.get("Authorization").slice("Bearer ".length));
            if(!currentUserObj){
                res.status(401).json({ "error" : "session expired, please log in again" })
                return
            }

            const userNotes = await DAO.viewUserNotes(currentUserObj.userid)
            if(!userNotes) {
                res.status(401).json({"error" : "error viewing notes, please try again later"})
                return
            }

            userNotes.forEach((Note : any) => {
                Note.usertitle = cryptr.decrypt(Note.usertitle)
                Note.notetitle = cryptr.decrypt(Note.notetitle)
                decryptedNotesArray.push(Note)
            });

            res.json({
                "notes" : decryptedNotesArray
            })


            
        }catch(error){
            console.error(`error on ViewMyNotes on noteController.js ${error}`)
            res.status(500).json({"error" : "Server error please try again later"})
        }
    }

    static async ViewPublicNotes(req: any, res: any){
        try{

            const reqdata : any = req.body
            const decryptedNotesArray : any = []
            const currentUserObj = await authController.CheckToken(req.get("Authorization").slice("Bearer ".length));
            if(!currentUserObj){
                res.status(401).json({ "error" : "session expired, please log in again" })
                return
            }

            const publicNotes = await DAO.viewPublicNotes()
            if(!publicNotes) {
                res.status(401).json({"error" : "error viewing notes, please try again later"})
                return
            }

            publicNotes.forEach((PublicNote : any) => {
                PublicNote.usertitle = cryptr.decrypt(PublicNote.usertitle)
                PublicNote.notetitle = cryptr.decrypt(publicNotes.notetitle)
                decryptedNotesArray.push(PublicNote)
            });

            res.json({
                "publicnotes" : decryptedNotesArray
            
            })

        }catch(error){
            console.error(`error on ViewPublicNotes on noteController.ts ${error}`)
            res.status(500).json({"error" : "Server error try again later"})
        }
    }

    static async MakeNotePublic(req: any, res: any){
        try{

            const reqdata : any = req.body
            const currentUserObj = await authController.CheckToken(req.get("Authorization").slice("Bearer ".length));
            if(!currentUserObj){
                res.status(401).json({ "error" : "session expired, please log in again" })
                return
            }

            let noteid = req.params.id

            const updatedNote = await DAO.makeNotePublic(noteid, currentUserObj.userid)
            if(!updatedNote) {
                res.status(401).json({"error" : "error making note public, please try again later"})
                return
            }
            
            res.json({
                "message" : "Note is now public!"
            })

        }catch(error){
            console.error(`error on MakeNotePublic on noteController.ts ${error}`)
            res.status(500).json({"error" : "Server error try again later"})
        }
    }

    static async RevokePublicNote(req: any, res: any){
        try{

            const reqdata : any = req.body
            const currentUserObj = await authController.CheckToken(req.get("Authorization").slice("Bearer ".length));
            if(!currentUserObj){
                res.status(401).json({ "error" : "session expired, please log in again" })
                return
            }

            let noteid = req.params.id

            const updatedNote = await DAO.makeNotePrivate(noteid, currentUserObj.userid)
            if(!updatedNote) {
                res.status(401).json({"error" : "error making note private, please try again later"})
                return
            }

            
            res.json({
                "message" : "RevokePublicNotes success"
            })
        }catch(error){
            console.error(`error on RevokePublicNotes on noteController.ts ${error}`)
            res.status(500).json({"error" : "Server error try again later"})
        }
    }

    static async UpdateSettings(req: any, res: any){
        try{

            const reqdata : any = req.body
            const currentUserObj = await authController.CheckToken(req.get("Authorization").slice("Bearer ".length));
            if(!currentUserObj){
                res.status(401).json({ "error" : "session expired, please log in again" })
                return
            }


            const updatedUserSettings = await DAO.updateUserSettings(currentUserObj.userid, reqdata.newsettings)
            if(!updatedUserSettings){
                res.status(401).json({"error" : "error updating user settings, please try again later"})
                return
            }

            
            res.json({
                "message" : "Settings updated"
            })

        }catch(error){
            console.error(`error on UpdateSettings on noteController.ts ${error}`)
            res.status(500).json({"error" : "Server error try again later"})
        }
    }



    // static async RequestStorage(req: any, res: any){
    //     try{
            
    //         res.json({
    //             "message" : "RequestStorage success"
    //         })
    //     }catch(error){
    //         console.error(`error on RequestStorage on noteController.ts ${error}`)
    //         res.status(500).json({"error" : "Server error try again later"})
    //     }
    // }

}


module.exports = noteController