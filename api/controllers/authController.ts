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
// implement cloudinary
//completly logout on logout and change password
//add JWT check to every route. if JWT absent completly logout and redirect to login page






class authController{


    static async Sleep(time : any){
        return new Promise((resolve) => setTimeout(resolve, time))
    }



    static async CheckUserToken(providedJWT : any){
        const CurrentObj = await this.decodeJWT(providedJWT);
        var { error } = CurrentObj
        if(error){
            console.error(error)
            return
        }
        return CurrentObj;
    } 


     static async HashPassword(plainTextPass : string){
      let hash =  await bcrypt.hash(plainTextPass, saltRounds)
      return hash
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
            return {"username" : res.data.username, "settings" : res.data.settings, "storage" : res.data.storage, "notekey" : res.data.notekey, "userid" : res.data.userid}
        })
    }

    static async SignUp(req : any, res : any) {

        try{

            const requser : any  = req.body


            const doesUserExist = await DAO.GetUser(requser.username)
            if(doesUserExist){
                res.status(400).json({"error" : "username already taken! Please choose another username"})
                return
            }

            await authController.GetUserId()
            let CounterPath = process.env.USER_COUNTER_PATH
            var data = fs.readFileSync(CounterPath, 'utf-8');

            console.log(` ID ${data}`)
          
           
           
            
            requser.settings = "true|false"
            requser.storage = "500MB"
            requser.notekey = genRandomKey(10)
            requser.userid = data


            const userInfo : any = {
                ...requser,
                password: await authController.HashPassword(requser.password)
            }
             
            const insertToDB = await DAO.AddUser(userInfo)

            if (!insertToDB){
                console.error('Error Signup on authController.ts insertToDB')
                res.status(500).json({"error" : "Internal server error, please try again later"})
                return
            }


            const currentDBUser = await DAO.GetUser(requser.username)
            
            if (!currentDBUser) {
                console.error('Error on SignUp on authController.ts currentDBUser')
                res.status(500).json({'error' : 'Server error try again later'})
            }

            const authToken = await authController.encodeJWT(requser.username, requser.settings, requser.storage, requser.notekey, requser.userid);

            const tryLogin = await DAO.LoginUser(requser.userid, authToken)
            if (!tryLogin) {
                res.status(500).json({ "error" : "Error when logging in please try again later" })
                console.error(`Error on Login on authcontroller.ts`)
                return
            }


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

            if(!(await authController.comparePassword(requser.password, currentUser.password))) {
                res.status(401).json({ "error" : "Wrong Creds!" })
                return
            }

            const authToken = await authController.encodeJWT(currentUser.username, currentUser.settings, currentUser.storage, currentUser.notekey, currentUser.userid)

            const tryLogin = await DAO.LoginUser(currentUser.userid, authToken)
            if (!tryLogin) {
                res.status(500).json({ "error" : "Error when logging in, try again LATER" })
                console.error(`Error on Login on authcontroller.ts `)
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

            const currentUserObj = await authController.decodeJWT(providedJWT);
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

            const providedJWT = req.get("Authorization").slice("Bearer ".length)

            const currentUserObj = await authController.decodeJWT(providedJWT);
            var { error } = currentUserObj
            if(error){
                res.status(401).json({ "message" : "Unauthorized. Try logging in again" })
                return false
            }

            const checkJWT = await DAO.CheckToken(providedJWT)
            if(!checkJWT){
                res.status(401).json({"error" : "Session expired!, please try log in again"})
                return false
            }


            res.json({
                "message" : "Authorized"
            })

            return true

        }catch(error){
            console.error(`error on Authorize on authController.ts ${error}`)
            res.status(500).json({"error" : "Server error try again later"})
        }
    }


    static async ChangePassword(req: any, res: any) {
        try{

            const reqdata : any = req.body

            const providedJWT = req.get("Authorization").slice("Bearer ".length)

            const currentUserObj = await authController.decodeJWT(providedJWT)
            var { error } = currentUserObj
            if(error){
                res.status(401).json({ "message" : "Unauthorized. Try logging in again" })
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


            if(!(await authController.comparePassword(reqdata.oldpassword, currentUser.password))) {
                res.status(401).json({ "error" : "Wrong Creds!" })
                return
            }

           const NewPassword = await authController.HashPassword(reqdata.password)

           const updatePassword = await DAO.UpdatePassword(currentUser.userid, NewPassword) 
            if(!updatePassword){
                res.status(500).json({ "error" : "Server error try again later" })
                return
            }

            const tryLogout = await DAO.LogoutUser(currentUserObj.userid)
            if (!tryLogout) {
                res.status(500).json({ "error" : "Error when logging out, try again later" })
                return
            }

            res.json({
                "message" : "password change success, please log in with your new password"
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

            const currentUserObj = await authController.decodeJWT(providedJWT)
            var { error } = currentUserObj
            if(error){
                res.status(401).json({ "message" : "Unauthorized. Try logging in again" })
                return
            }

            if (!reqdata.password || typeof reqdata.password !== "string") {
                res.status(400).json({ "error" : "Bad password format, string expected!" })
                return
            }

            const currentUser = await DAO.GetUser(currentUserObj.username)
            if (!currentUser) {
                res.status(401).json({ "error" : "Wrong Creds!" })
                return
            }


            if(!(await authController.comparePassword(reqdata.password, currentUser.password))) {
                res.status(401).json({ "error" : "Wrong Creds!" })
                return
            }


            const DeleteUser = await DAO.DeleteUser(currentUserObj.userid)
            if(!DeleteUser){
                res.status(401).json({ "error" : "Unable to delete account please try again later." })
                return
            }

            //TODO Add functionality to delete azure/cloudinary binaries


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