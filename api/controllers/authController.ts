export {}
const DAO = require('../../controller/DAO')
const genRandomKey = require('../genRandomKey')
const fs = require("fs")
const bcrypt = require('bcrypt')
const saltRounds : number = 10;
require('dotenv').config()




class authController{


    static async HashPassword(plainTextPass : string){
        bcrypt.genSalt(saltRounds, function(err : any , salt : any){
            bcrypt.hash(plainTextPass, salt, function(err : any, hash : string){
                return hash
            })
        })
    }

    static async GetUserId(){
        let useridd : number = 0;
        let CounterPath = process.env.USER_COUNTER_PATH
      fs.readFile(CounterPath, function (err : any, data : any){
            console.log(`Data ${data}`)
            useridd = parseInt(data.toString())
            console.log(`ReadFile useridd ${useridd}`)
            useridd = useridd + 1 
            
            console.log(`useridd ${useridd}`)
           fs.writeFile(CounterPath, useridd.toString(), function(err : any){
                
                if(err){
                    console.log(`Error ds ${err}`)
                }
            })
            if(err){
                console.log(`Error ${err}`)
            }
            
        })
    }

    static async SignUp(req : any, res : any) {

        try{
            await authController.GetUserId()
            let CounterPath = process.env.USER_COUNTER_PATH
            var data = fs.readFileSync(CounterPath, 'utf-8');

            console.log(` idee ${data}`)
          
           
            const requser : any  = req.body
            
            requser.settings = "true|false"
            requser.storage = "500MB"
            requser.notekey = genRandomKey(10)
            requser.userid = data

            const userInfo : any = {
                ...requser,
                password: await authController.HashPassword(requser.password)
            }
             

            const insertToDB = await DAO.AddUser(userInfo)

            if (insertToDB !== 'success'){
                console.error('Error while signing up')
                res.status(400).json({"error" : insertToDB})
                return
            }

            res.json({
                "messsage" : requser.userid,
                "message2" : requser.storage,
                "message3" : "Success"
            })


        }catch(error){
            console.error(`error on SignUp on authController.ts ${error}`)
            res.status(500).json({'error' : 'Server error try again later'})
        }

    }


    static async Login(req: any, res: any) {
        try{
            
            res.json({
                "message" : "Login success"
            })
        }catch(error){
            console.error(`error on Login on authController.ts ${error}`)
            res.status(500).json({"error" : "Server error try again later"})
        }
    }


    static async Logout(req: any, res: any) {
        try{

            res.json({
                "message" : "Logout success"
            })

        }catch(error){
            console.error(`error on Logout on authController.ts ${error}`)
            res.status(500).json({"error" : "Server error try again later"})
        }
    }


    static async Authorize(req: any, res: any) {
        try{

            res.json({
                "message" : "Authorize success"
            })

        }catch(error){
            console.error(`error on Authorize on authController.ts ${error}`)
            res.status(500).json({"error" : "Server error try again later"})
        }
    }


    static async ChangePassword(req: any, res: any) {
        try{

            res.json({
                "message" : "changePass success"
            })

        }catch(error){
            console.error(`error on ChangePassword on authController.ts ${error}`)
            res.status(500).json({"error" : "Server error try again later"})
        }
    }

    static async DeleteAccount(req: any , res: any) {
        try{

            res.json({
                "message" : "DeleteAccount success"
            })

        }catch(error){
            console.error(`error on DeleteAccount on authController.ts ${error}`)
            res.status(500).json({"error" : "Server error try again later"})
        }
    }

    static async GetProfile(req: any, res: any){
        try{

            res.json({
                "message" : "GetProfile success"
            })
        }catch(error){
            console.error(`error on GetProfile on authController.ts ${error}`)
            res.status(500).json({"error" : "Server error try again later"})
        }
    }

    




}

module.exports = authController