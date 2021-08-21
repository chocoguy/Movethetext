const DAO = require('../../controller/DAO')


class noteController {

    static async CreateNote(req, res){

    }

    static async CreateNoteShareLink(req, res){

    }

    static async RevokeNoteShareLink(req, res){

    }

    static async GetNoteById(req, res){

    }

    static async DeleteNote(req, res){

    }

    static async EditNote(req, res){

    }

    static async ViewMyNotes(req, res){
        try{

            res.status(200).json({"info" : "Returning notes"})
        }catch(error){
            console.error(`error on ViewMyNotes on noteController.js ${error}`)
            res.status(500).json({"error" : "Server error please try again later"})
        }
    }

    static async ViewPublicNotes(req, res){

    }

    static async MakeNotePublic(req, res){

    }

    static async RevokePublicNote(req, res){

    }

    static async UpdateSettings(req, res){

    }

    static async GetSettings(req, res){

    }

    static async RequestStorage(req, res){

    }

}


module.exports = noteController