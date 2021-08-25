export {}
const DAO = require('../../controller/DAO')


class noteController {

    static async CreateNote(req: any, res: any){

    }

    static async CreateNoteShareLink(req: any, res: any){

    }

    static async RevokeNoteShareLink(req: any, res: any){

    }

    static async GetNoteById(req: any, res: any){

    }

    static async DeleteNote(req: any, res: any){

    }

    static async EditNote(req: any, res: any){

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

    }

    static async MakeNotePublic(req: any, res: any){

    }

    static async RevokePublicNote(req: any, res: any){

    }

    static async UpdateSettings(req: any, res: any){

    }

    static async GetSettings(req: any, res: any){

    }

    static async RequestStorage(req: any, res: any){

    }

}


module.exports = noteController