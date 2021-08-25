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
const { MongoClient } = require('mongodb');
require('dotenv').config();
let testya = "da";
let files;
let notes;
let test;
let users;
let movethetextDb;
const client = new MongoClient(process.env.URI);
class DAO {
    static InitDB() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield client.connect();
                const db = client.db(process.env.DB_NAME);
                files = db.collection("files");
                notes = db.collection("notes");
                test = db.collection("test");
                users = db.collection("users");
                console.log("DB Connected");
            }
            catch (error) {
                console.error(`Error InitDB ${error}`);
            }
        });
    }
    static injectDB(client) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // movethetextDb = await conn.db(process.env.DB_NAME)
                // users = client
                //  test = dbTest
                // notes = dbNotes
                // files = dbFiles
                // let db = client.db(process.env.DB_NAME)
                // files = db.collection('files')
                // notes = db.collection('notes')
                // test = db.collection('test')
                // users = db.collection('users')
            }
            catch (error) {
                console.error(`No DB connection ${error}`);
            }
        });
    }
    static AddUser(userInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield users.insertOne({ username: userInfo.username, password: userInfo.password, settings: userInfo.settings, storage: userInfo.storage, notekey: userInfo.notekey, userid: userInfo.userid });
                return "success";
            }
            catch (error) {
                if (String(error).startsWith("MongoError: E11000 duplicate key error")) {
                    return { error: "A user with the given username already exists." };
                }
                console.error(`error on AddUser on DAO.js ${error}`);
                return error;
            }
        });
    }
}
module.exports = DAO;
//movethetext
//files
//notes
//test
//users
