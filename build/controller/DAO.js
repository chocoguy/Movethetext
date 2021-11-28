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
let sessions;
let movethetextDb;
const client = new MongoClient(process.env.URI);
//!TODO
// Figure out proper data types and implement over application
// Implement check user method to double check JWT's making app more secure
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
                sessions = db.collection("sessions");
                console.log("DB Connected");
            }
            catch (error) {
                console.error(`Error InitDB ${error}`);
            }
        });
    }
    static RNG(maxint) {
        return Math.floor(Math.random() * maxint);
    }
    static AlphaRNG() {
        return (Math.random() + 1).toString(36).substring(3);
    }
    //? TryCatch template
    // try{
    // }catch(error){
    //     console.error(`error on CheckToken on DAO.ts ${error}`)
    //     return "Server transaction error please try again later"
    // }
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
    //! ---------AUTH--------- 
    static AddUser(userInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield users.insertOne({ username: userInfo.username, password: userInfo.password, settings: userInfo.settings, storage: userInfo.storage, notekey: userInfo.notekey, userid: userInfo.userid });
                return "success";
            }
            catch (error) {
                if (String(error).startsWith("MongoError: E11000 duplicate key error")) {
                    return "A user with the given username already exists.";
                }
                console.error(`error on AddUser on DAO.ts ${error}`);
                return null;
            }
        });
    }
    static GetUser(username) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield users.findOne({ "username": username });
            }
            catch (error) {
                console.error(`error on GetUser on DAO.ts ${error}`);
                return null;
            }
        });
    }
    static LoginUser(userid, JWT) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                var checkLoginUser = yield sessions.findOne({ "userid": userid });
                if (checkLoginUser == null) {
                    yield sessions.insertOne({ "userid": userid, "JWT": JWT });
                }
                else {
                    yield sessions.deleteOne({ "userid": userid });
                    yield sessions.insertOne({ "userid": userid, "JWT": JWT });
                }
                return "success";
            }
            catch (error) {
                console.error(`Error on LoginUser on DAO.ts ${error}`);
                return null;
            }
        });
    }
    static LogoutUser(userid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield sessions.deleteOne({ "userid": userid });
                return "success";
            }
            catch (error) {
                console.error(`Error on LogoutUser on DAO.ts ${error}`);
                return null;
            }
        });
    }
    static CheckToken(JWT) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield sessions.findOne({ "JWT": JWT });
            }
            catch (error) {
                console.error(`error on CheckToken on DAO.ts ${error}`);
                return null;
            }
        });
    }
    static UpdatePassword(userid, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield users.updateOne({ "userid": userid }, { $set: { "password": newPassword } }, { upsert: true });
                return "success";
            }
            catch (error) {
                console.error(`error on UpdatePassword on DAO.ts ${error}`);
                return null;
            }
        });
    }
    static DeleteUser(userid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield users.deleteOne({ "userid": userid });
                yield notes.deleteMany({ "userid": userid });
                yield files.deleteMany({ "userid": userid });
                yield sessions.deleteMany({ "userid": userid });
                return "success";
            }
            catch (error) {
                console.error(`error on DeleteUser on DAO.ts ${error}`);
                return null;
            }
        });
    }
    //!END AUTH
    //!NOTES
    static CreateNote(userid, encryptedtitle, encryptedNote, privacy) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                var lastEditRaw = new Date();
                var noteid = this.RNG(999999999);
                yield notes.insertOne({
                    "noteid": noteid.toString(),
                    "userid": userid,
                    "notetitle": encryptedtitle,
                    "note": encryptedNote,
                    "privacy": privacy,
                    "sharekey": "",
                    "lastedit": lastEditRaw
                });
                return noteid;
            }
            catch (error) {
                console.error(`error on CreateNote on DAO.ts ${error}`);
                return null;
            }
        });
    }
    static CreateNoteShareLink(noteid, userid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                var shareKey = this.AlphaRNG();
                yield notes.updateOne({ "noteid": noteid, "userid": userid }, { $set: { "sharekey": shareKey, "privacy": "private|link" } });
                return `Share Link: http://localhost:5000/note/id/${noteid}/sharekey/${shareKey}`;
            }
            catch (error) {
                console.error(`error on CreateNoteShareLink on DAO.ts ${error}`);
                return null;
            }
        });
    }
    static RevokeNoteShareLink(noteid, userid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield notes.updateOne({ "noteid": noteid, "userid": userid }, { $set: { "sharekey": "", "privacy": "private|private" } });
                return "link revoked";
            }
            catch (error) {
                console.error(`error on RevokeNoteShareLink on DAO.ts ${error}`);
                return null;
            }
        });
    }
    static GetNoteById(noteid, userid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                //FOR notetype
                // personal == retrive personal note, check userid and noteid
                //public == retrive public note, check noteid and permissions
                var tryPrivateNote = yield notes.findOne({ "userid": userid, "noteid": noteid });
                if (!tryPrivateNote) {
                    return yield notes.findOne({ "noteid": noteid, "privacy": "private|public" });
                }
                else {
                    return tryPrivateNote;
                }
            }
            catch (error) {
                console.error(`error on GetnoteById on DAO.ts ${error}`);
                return null;
            }
        });
    }
    static GetNoteBySharekey(noteid, sharekey) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield notes.findOne({ "noteid": noteid, "sharekey": sharekey, "privacy": "private|link" });
            }
            catch (error) {
                console.error(`error on GetNoteByShareKey on DAO.ts ${error}`);
                return null;
            }
        });
    }
    static DeleteNote(noteid, userid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield notes.deleteOne({ "userid": userid, "noteid": noteid });
                return "Note removed";
            }
            catch (error) {
                console.error(`errror on DeleteNote on DAO.ts ${error}`);
                return null;
            }
        });
    }
    static EditNote(noteid, userid, encryptedtitle, encryptedNote) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                var lastEditRaw = new Date();
                yield notes.updateOne({ "noteid": noteid, "userid": userid }, { $set: { "note": encryptedNote, "notetitle": encryptedtitle, "lastedit": lastEditRaw } });
                return "Note Modified";
            }
            catch (error) {
                console.error(`error on EditNote on DAO.ts ${error}`);
                return null;
            }
        });
    }
    static viewUserNotes(userid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let currentNotes = yield notes.find({ "userid": userid });
                const notesList = yield currentNotes.toArray();
                return { notesList };
            }
            catch (error) {
                console.error(`error on viewUserNotes on DAO.ts ${error}`);
                return null;
            }
        });
    }
    static viewPublicNotes() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                //return await notes.find({ "privacy" : "private|public" })
                let currentNotes = yield notes.find({ "privacy": "private|public" });
                const notesList = yield currentNotes.toArray();
                return { notesList };
            }
            catch (error) {
                console.error(`error on viewPublicNotes on DAO.ts ${error}`);
                return null;
            }
        });
    }
    static makeNotePublic(noteid, userid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                var lastEditRaw = new Date();
                yield notes.updateOne({ "noteid": noteid, "userid": userid }, { $set: { "privacy": "private|public", "lastedit": lastEditRaw } });
                return "Note updated";
            }
            catch (error) {
                console.error(`error on makeNotePublic on DAO.ts ${error}`);
                return null;
            }
        });
    }
    static makeNotePrivate(noteid, userid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                var lastEditRaw = new Date();
                yield notes.updateOne({ "noteid": noteid, "userid": userid }, { $set: { "privacy": "private|private", "lastedit": lastEditRaw } });
                return "Note updated";
            }
            catch (error) {
                console.error(`error on makeNotePublic on DAO.ts ${error}`);
                return null;
            }
        });
    }
    static updateUserSettings(userid, settings) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield users.updateOne({ "userid": userid }, { $set: { "settings": settings } });
                return "User settings updated";
            }
            catch (error) {
                console.error(`error on updateUserSettings on DAO.ts ${error}`);
                return null;
            }
        });
    }
    //!END NOTES    
    //!FILES
    static CreateFile(userid, filetitle, filename, link) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                var lastEditRaw = new Date();
                var fileid = this.RNG(99999);
                yield files.insertOne({
                    "fileid": fileid,
                    "userid": userid,
                    "filetitle": filetitle,
                    "filename": filename,
                    "privacy": "private|private",
                    "link": link,
                    "sharekey": "",
                    "lastedit": lastEditRaw
                });
                return fileid;
            }
            catch (error) {
                console.error(`error on CreateFile on DAO.ts ${error}`);
                return null;
            }
        });
    }
    static ViewFileById(userid, fileid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield files.findOne({ "userid": userid, "fileid": fileid });
            }
            catch (error) {
                console.error(`error on ViewFileById on DAO.ts ${error}`);
                return null;
            }
        });
    }
    static DeleteFile(userid, fileid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield files.deleteOne({ "userid": userid, "fileid": fileid });
                return "File deleted";
            }
            catch (error) {
                console.error(`error on DeleteNote on DAO.ts ${error}`);
                return null;
            }
        });
    }
    static ViewUserFiles(userid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield files.find({ "userid": userid });
            }
            catch (error) {
                console.error(`error on ViewUserFiles on DAO.ts ${error}`);
                return null;
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
