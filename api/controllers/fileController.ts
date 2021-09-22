const DAO = require('../../controller/DAO')


class fileController{

    //?
    //? --Auth--
    //?


    static async UploadFile(req: any, res: any){
        try{
            
            res.json({
                "message" : "UploadFile success"
            })
        }catch(error){
            console.error(`error on UploadFile on fileController.ts ${error}`)
            res.status(500).json({"error" : "Server error try again later"})
        }
    }

    static async DownloadFile(req: any, res: any){
        try{
            
            res.json({
                "message" : "DownloadFile success"
            })
        }catch(error){
            console.error(`error on DownloadFile on fileController.ts ${error}`)
            res.status(500).json({"error" : "Server error try again later"})
        }
    }

    static async CreateFileShareLink(req: any, res: any){
        try{
            
            res.json({
                "message" : "CreateFileShareLink success"
            })
        }catch(error){
            console.error(`error on CreateFileShareLink on fileController.ts ${error}`)
            res.status(500).json({"error" : "Server error try again later"})
        }
    }

    static async RevokeFileShareLink(req: any, res: any){
        try{
            
            res.json({
                "message" : "RevokeFileShareLink success"
            })
        }catch(error){
            console.error(`error on revokeFileShareLink on fileController.ts ${error}`)
            res.status(500).json({"error" : "Server error try again later"})
        }
    }

    static async GetFileById(req: any, res: any){
        try{
            
            res.json({
                "message" : "GetFileById success"
            })
        }catch(error){
            console.error(`error on GetFileById on fileController.ts ${error}`)
            res.status(500).json({"error" : "Server error try again later"})
        }
    }

    static async DeleteFile(req: any, res: any){
        try{
            
            res.json({
                "message" : "DeleteFile success"
            })
        }catch(error){
            console.error(`error on DeleteFile on fileController.ts ${error}`)
            res.status(500).json({"error" : "Server error try again later"})
        }
    }

    static async ViewMyFiles(req: any, res: any){ 
        try{
            
            res.json({
                "message" : "ViewMyFiles success"
            })
        }catch(error){
            console.error(`error on ViewMyFiles on fileController.ts ${error}`)
            res.status(500).json({"error" : "Server error try again later"})
        }
    }

    static async ViewPublicFiles(req: any, res: any){
        try{
            
            res.json({
                "message" : "ViewPublicFiles success"
            })
        }catch(error){
            console.error(`error on ViewPublicFiles on fileController.ts ${error}`)
            res.status(500).json({"error" : "Server error try again later"})
        }
    }

    static async MakeFilePublic(req: any, res: any){
        try{
            
            res.json({
                "message" : "MakeFilePublic success"
            })
        }catch(error){
            console.error(`error on MakeFilePublic on fileController.ts ${error}`)
            res.status(500).json({"error" : "Server error try again later"})
        }
    }

    static async RevokePublicFile(req: any, res: any){
        try{
            
            res.json({
                "message" : "RevokePublicFile success"
            })
        }catch(error){
            console.error(`error on RevokePublicFile on fileController.ts ${error}`)
            res.status(500).json({"error" : "Server error try again later"})
        }
    }




}


module.exports = fileController