export {}
const DAO = require('../../controller/DAO')
const genRandomKey = require('../genRandomKey')
const fs = require("fs")
const bcrypt = require('bcrypt')
const saltRounds : number = 10;
const jwt = require('jsonwebtoken');
require('dotenv').config()


//!TODO

// Consistent naming
// proper error handling and messages
// proper message relaying
// implement azure





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

    static async comparePassword(providedPassword : string, DBPassword : string) {
        return await bcrypt.compare(providedPassword, DBPassword)
    }

    static async encodeJWT(username : string, settings : string, storage : string, notekey : string, userid: string) {
        return jwt.sign({
            exp: Math.floor(Date.now() / 1000) + 60 * 60 * 4,
            data: {username, settings, storage, notekey, userid}
        }, process.env.JWT_SECRET)
    }

    static async decodeJWT(providedJWT : string) {
        return jwt.verify(providedJWT, process.env.JWT_SECRET, (error : any, res : any) => {
            if(error)
            {
                return {error}
            }
            return {"username" : res.username, "settings" : res.settings, "storage" : res.storage, "notekey" : res.notekey, "userid" : res.userid}
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
                console.error('Error Signup on authController.ts insertToDB')
                res.status(400).json({"error" : insertToDB})
                return
            }


            const currentDBUser = await DAO.GetUser(requser.username)
            
            if (!currentDBUser) {
                console.error('Error on SignUp on authController.ts currentDBUser')
                res.status(500).json({'error' : 'Server error try again later'})
            }

            const authToken = await this.encodeJWT(requser.username, requser.settings, requser.storage, requser.notekey, requser.userid);

            res.json({
                "auth_token": authToken,
                "username" : requser.username,
                "settings" : requser.settings,
                "storage" : requser.storage,
                "userid" : requser.userid
            })


        }catch(error){
            console.error(`error on SignUp on authController.ts ${error}`)
            res.status(500).json({'error' : 'Server error try again later'})
        }

    }


    static async Login(req: any, res: any) {
        try{

            const requser : any = req.body;
            
            if (!requser.password || typeof requser.password !== "string") {
                res.status(400).json({ "error" : "Bad password format, string expected!" })
                return
            }

            const currentUser = await DAO.GetUser(requser.username)
            if (!currentUser) {
                res.status(401).json({ "error" : "Wrong Creds!" })
                return
            }

            if(!(await this.comparePassword(requser.password, currentUser.password))) {
                res.status(401).json({ "error" : "Wrong Creds!" })
                return
            }

            const authToken = await this.encodeJWT(currentUser.username, currentUser.settings, currentUser.storage, currentUser.notekey, currentUser.userid)

            const tryLogin = await DAO.Login(requser.userid, authToken)
            if (!tryLogin.success) {
                res.status(500).json({ "error" : "Error when logging in, try again LATER" })
                console.error(`Error on Login on authcontroller.ts ${tryLogin.errror}`)
                return
            }

            res.json({ "auth_token" : authToken })

        }catch(error){
            console.error(`error on Login on authController.ts ${error}`)
            res.status(500).json({"error" : "Server error try again later"})
        }
    }


    static async Logout(req: any, res: any) {
        try{

            const providedJWT = req.get("Authorization").slice("Bearer ".length)

            const currentUserObj = await this.decodeJWT(providedJWT);
            var { error } = currentUserObj
            if(error){
                res.status(401).json({ "message" : "Unauthorized. Try logging in again" })
                console.error(error)
                return
            }

            const tryLogout = await DAO.LogoutUser(currentUserObj.userid)
            if (tryLogout !== "success") {
                res.status(500).json({ "error" : "Error when loggin out, try again LATER!!!" })
                console.error(error)
                return
            }

            res.json({
                "message" : "Logout successful. come back soon!"
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

            const reqdata : any = req.body

            const providedJWT = req.get("Authorization").slice("Bearer ".length)

            const currentUserObj = await this.decodeJWT(providedJWT)
            var { error } = currentUserObj
            if(error){
                res.status(401).json({ "message" : "Unauthorized. Try logging in again" })
                console.error(error)
                return
            }

            if (!reqdata.oldpassword || typeof reqdata.oldpassword !== "string") {
                res.status(400).json({ "error" : "Bad password format, string expected!" })
                return
            }

            const currentUser = await DAO.GetUser(currentUserObj.username)
            if (!currentUser) {
                res.status(401).json({ "error" : "Wrong Creds!" })
                return
            }

            if(!await this.comparePassword(reqdata.oldpassword, currentUser.password)){
                res.status(401).json({ "error" : "Wrong Creds!" })
                return
            }

            const NewPassword = this.HashPassword(reqdata.newpassword)

            const updatePassword = DAO.UpdatePassword(currentUser.userid, NewPassword) 
            if(updatePassword !== "success"){
                res.status(500).json({ "error" : "Server error try again later" })
                console.error(updatePassword)
                return
            }

            const tryLogout = await DAO.LogoutUser(currentUserObj.userid)
            if (tryLogout !== "success") {
                res.status(500).json({ "error" : "Error when loggin out, try again LATER!!!" })
                console.error(error)
                return
            }

            res.json({
                "message" : "password change success, please log in with your new password"
            })







            res.json({
                "message" : "Password has been changed. Please login with your new password!"
            })

        }catch(error){
            console.error(`error on ChangePassword on authController.ts ${error}`)
            res.status(500).json({"error" : "Server error try again later"})
        }
    }

    static async DeleteAccount(req: any , res: any) {
        try{
            
            const reqdata : any = req.body

            const providedJWT = req.get("Authorization").slice("Bearer ".length)

            const User = await this.decodeJWT(providedJWT)
            var { error } = User
            if(error) {
                res.status(401).json({"message" : "Unauthorized try logging in again."})
                console.error(error)
                return
            }

            if (!reqdata.password || typeof reqdata.password !== "string") {
                res.status(400).json({ "error" : "Bad password format, string expected!" })
                return
            }

            const DBUser = await DAO.GetUser(User.username)
            if(!DBUser){
                res.status(401).json({ "error" : "Wrong creds!" })
                console.log(DBUser)
                return
            }

            if(!await this.comparePassword(reqdata.password, DBUser.password)){
                res.status(401).json({ "error" : "Wrong Creds!" })
                return
            }


            const DeleteUser = await DAO.DeleteUser(User.userid)
            if(DeleteUser !== "success"){
                res.status(401).json({ "error" : "Unabl to delete account please try again later." })
                return
            }

            //TODO Add functionality to delete azure binaries


            res.json({
                "message" : "Account and related notes/files has been deleted. Thank you for using MoveTheText :) "
            })

        }catch(error){
            console.error(`error on DeleteAccount on authController.ts ${error}`)
            res.status(500).json({"error" : "Server error try again later"})
        }
    }


    //? Not sure if route is needed TBD 

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