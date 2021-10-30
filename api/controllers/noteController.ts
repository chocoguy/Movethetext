export {}
const DAO = require('../../controller/DAO')
const Cryptr = require('cryptr');
require('dotenv').config()
const cryptr : any = new Cryptr(process.env.NOTE_SECRET)



//!TODO

// consider moving auth functionality to a reusable function DRY


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

            const encryptedNote : any = cryptr.encrypt(req.data.note)
            const encryptedTitle : any = cryptr.ecrypt(req.data.title)

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



            


            res.json({
                "message" : "ViewNoteById success"
            })
        }catch(error){
            console.error(`error on ViewNoteById on noteController.ts ${error}`)
            res.status(500).json({"error" : "Server error try again later"})
        }
    }

    static async DeleteNote(req: any, res: any){
        try{
            
            res.json({
                "message" : "DeleteNote success"
            })
        }catch(error){
            console.error(`error on DeleteNote on noteController.ts ${error}`)
            res.status(500).json({"error" : "Server error try again later"})
        }
    }

    static async EditNote(req: any, res: any){
        try{
            
            res.json({
                "message" : "EditNote success"
            })
        }catch(error){
            console.error(`error on EditNote on noteController.ts ${error}`)
            res.status(500).json({"error" : "Server error try again later"})
        }
    }

    static async ViewMyNotes(req: any, res: any){
        try{

            res.status(200).json({"info" : "Returning notes"})
        }catch(error){
            console.error(`error on ViewMyNotes on noteController.js ${error}`)
            res.status(500).json({"error" : "Server error please try again later"})
        }
    }

    static async ViewPublicNotes(req: any, res: any){
        try{
            
            res.json({
                "message" : "ViewPublicNotes success"
            })
        }catch(error){
            console.error(`error on ViewPublicNotes on noteController.ts ${error}`)
            res.status(500).json({"error" : "Server error try again later"})
        }
    }

    static async MakeNotePublic(req: any, res: any){
        try{
            
            res.json({
                "message" : "MakeNotePublic success"
            })
        }catch(error){
            console.error(`error on MakeNotePublic on noteController.ts ${error}`)
            res.status(500).json({"error" : "Server error try again later"})
        }
    }

    static async RevokePublicNote(req: any, res: any){
        try{
            
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
            
            res.json({
                "message" : "UpdateSettings success"
            })
        }catch(error){
            console.error(`error on UpdateSettings on noteController.ts ${error}`)
            res.status(500).json({"error" : "Server error try again later"})
        }
    }

    static async GetSettings(req: any, res: any){
        try{
            
            res.json({
                "message" : "GetSettings success"
            })
        }catch(error){
            console.error(`error on GetSettings on noteController.ts ${error}`)
            res.status(500).json({"error" : "Server error try again later"})
        }
    }

    static async RequestStorage(req: any, res: any){
        try{
            
            res.json({
                "message" : "RequestStorage success"
            })
        }catch(error){
            console.error(`error on RequestStorage on noteController.ts ${error}`)
            res.status(500).json({"error" : "Server error try again later"})
        }
    }

}


module.exports = noteController