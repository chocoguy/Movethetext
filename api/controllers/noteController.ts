export {}
const DAO = require('../../controller/DAO')


class noteController {

    static async CreateNote(req: any, res: any){
        try{
            
            res.json({
                "message" : "CreateNote success"
            })
        }catch(error){
            console.error(`error on Login on noteController.ts ${error}`)
            res.status(500).json({"error" : "Server error try again later"})
        }
    }

    static async CreateNoteShareLink(req: any, res: any){
        try{
            
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
            
            res.json({
                "message" : "RevokeNoteShareLink success"
            })
        }catch(error){
            console.error(`error on RevokeNoteShareLink on noteController.ts ${error}`)
            res.status(500).json({"error" : "Server error try again later"})
        }
    }

    static async GetNoteById(req: any, res: any){
        try{
            
            res.json({
                "message" : "GetNoteById success"
            })
        }catch(error){
            console.error(`error on GetNoteById on noteController.ts ${error}`)
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