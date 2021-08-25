"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const DAO = require('../../controller/DAO');
const genRandomKey = require('../genRandomKey');
const fs = require("fs");
const bcrypt = require('bcrypt');
const saltRounds = 10;
require('dotenv').config();
class authController {
    static HashPassword(plainTextPass) {
        return __awaiter(this, void 0, void 0, function* () {
            bcrypt.genSalt(saltRounds, function (err, salt) {
                bcrypt.hash(plainTextPass, salt, function (err, hash) {
                    return hash;
                });
            });
        });
    }
    static SignUp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let useridd = 0;
                const requser = req.body;
                requser.settings = "true|false";
                requser.storage = "500MB";
                requser.notekey = genRandomKey(10);
                let CounterPath = process.env.USER_COUNTER_PATH;
                fs.readFile(CounterPath, function (err, data) {
                    useridd = parseInt(data.toString());
                    if (err) {
                        console.log(`Error ${err}`);
                    }
                });
                fs.writeFile(CounterPath, useridd.toString(), function (err) {
                    if (err) {
                        console.log(`Error ds ${err}`);
                    }
                });
                requser.userid = useridd;
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
                    "message": `idee `
                });
            }
            catch (error) {
                console.error(`error on SignUp on authController.js ${error}`);
                res.status(500).json({ 'error': 'Server error try again later' });
            }
        });
    }
    static Login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    static Logout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    static Authorize(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    static ChangePassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    static DeleteAccount(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    static GetProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
}
module.exports = authController;
