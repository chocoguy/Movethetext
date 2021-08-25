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

    static async SignUp(req : any, res : any) {

        try{
            let useridd : number = 0;
            const requser : any  = req.body
            
            requser.settings = "true|false"
            requser.storage = "500MB"
            requser.notekey = genRandomKey(10)

            let CounterPath = process.env.USER_COUNTER_PATH
            fs.readFile(CounterPath, function (err : any, data : any){
                useridd = parseInt(data.toString())
                if(err){
                    console.log(`Error ${err}`)
                }
            })


            fs.writeFile(CounterPath, useridd.toString(), function(err : any){
                if(err){
                    console.log(`Error ds ${err}`)
                }
            })



             requser.userid = useridd


            // const userInfo = {
            //     ...requser,
            //     password: await this.HashPassword
            // }
    
            // const insertToDB = await DAO.AddUser(userInfo)

            // if (insertToDB !== 'success'){
            //     console.error('Error while signing up')
            //     res.status(400).json({"error" : "error while signing up"})
            //     return
            // }

            res.json({
                "message" : `idee `
            })


        }catch(error){
            console.error(`error on SignUp on authController.js ${error}`)
            res.status(500).json({'error' : 'Server error try again later'})
        }

    }


    static async Login(req: any, res: any) {

    }


    static async Logout(req: any, res: any) {

    }


    static async Authorize(req: any, res: any) {

    }


    static async ChangePassword(req: any, res: any) {

    }

    static async DeleteAccount(req: any , res: any) {

    }

    static async GetProfile(req: any, res: any){

    }

    




}

module.exports = authController