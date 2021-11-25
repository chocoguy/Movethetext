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
const Cryptr = require('cryptr');
const authController = require('./authController');
require('dotenv').config();
const cryptr = new Cryptr(process.env.NOTE_SECRET);
//!TODO
// consider moving auth functionality to a reusable function DRY
//trigger new JWT when user updates settings or perhaps store on a cookie
class noteController {
    static CreateNote(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const reqdata = req.body;
                const providedJWT = req.get("Authorization").slice("Bearer ".length);
                const currentUserObj = yield authController.decodeJWT(providedJWT);
                var { error } = currentUserObj;
                if (error) {
                    res.status(401).json({ "error": "session expired, please log in again." });
                    return;
                }
                const encryptedNote = cryptr.encrypt(reqdata.note);
                const encryptedTitle = cryptr.encrypt(reqdata.title);
                const uploadedNote = yield DAO.CreateNote(currentUserObj.userid, encryptedTitle, encryptedNote, "private|private");
                if (!uploadedNote) {
                    res.status(401).json({ "error": "error uploading note, please try again later" });
                    return;
                }
                res.json({
                    "noteid": uploadedNote.toString()
                });
            }
            catch (error) {
                console.error(`error on Login on noteController.ts ${error}`);
                res.status(500).json({ "error": "Server error try again later" });
            }
        });
    }
    static CreateNoteShareLink(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const reqdata = req.body;
                const providedJWT = req.get("Authorization").slice("Bearer ".length);
                const currentUserObj = yield authController.decodeJWT(providedJWT);
                var { error } = currentUserObj;
                if (error) {
                    res.status(401).json({ "error": "session expired, please log in again." });
                    return;
                }
                const ShareLink = yield DAO.CreateNoteShareLink(reqdata.noteid, currentUserObj.userid);
                if (!ShareLink) {
                    res.status(401).json({ "error": "error creating share link please try again later" });
                    return;
                }
                res.json({
                    "sharelink": ShareLink
                });
            }
            catch (error) {
                console.error(`error on CreateNoteShareLink on noteController.ts ${error}`);
                res.status(500).json({ "error": "Server error try again later" });
            }
        });
    }
    static RevokeNoteShareLink(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const reqdata = req.body;
                const providedJWT = req.get("Authorization").slice("Bearer ".length);
                const currentUserObj = yield authController.decodeJWT(providedJWT);
                var { error } = currentUserObj;
                if (error) {
                    res.status(401).json({ "error": "session expired, please log in again." });
                    console.error(error);
                    return;
                }
                const RevokedShareLink = yield DAO.RevokeNoteShareLink(currentUserObj.noteid, currentUserObj.userid);
                if (!RevokedShareLink) {
                    res.status(401).json({ "error": "error revoking share link, please try again later" });
                    return;
                }
                res.json({
                    "message": "ShareLink has been revoked"
                });
            }
            catch (error) {
                console.error(`error on RevokeNoteShareLink on noteController.ts ${error}`);
                res.status(500).json({ "error": "Server error try again later" });
            }
        });
    }
    static ViewNoteById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const reqdata = req.body;
                const currentUserObj = yield authController.CheckUserToken(req.get("Authorization").slice("Bearer ".length));
                if (!currentUserObj) {
                    res.status(401).json({ "error": "session expired, please log in again" });
                    return;
                }
                let noteid = req.params.id;
                const requestedNote = yield DAO.GetNoteById(noteid, currentUserObj.userid, "personal");
                if (!requestedNote) {
                    res.status(401).json({ "error": "error retriveing note, please try again later" });
                    return;
                }
                requestedNote.notetitle = cryptr.decrypt(requestedNote.notetitle);
                requestedNote.note = cryptr.decrypt(requestedNote.note);
                res.json(requestedNote);
            }
            catch (error) {
                console.error(`error on ViewNoteById on noteController.ts ${error}`);
                res.status(500).json({ "error": "Server error try again later" });
            }
        });
    }
    static DeleteNote(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const reqdata = req.body;
                const currentUserObj = yield authController.CheckToken(req.get("Authorization").slice("Bearer ".length));
                if (!currentUserObj) {
                    res.status(401).json({ "error": "session expired, please log in again" });
                    return;
                }
                let noteid = req.params.id;
                const deletedNote = yield DAO.DeleteNote(noteid, currentUserObj.userid);
                if (!deletedNote) {
                    res.status(401).json({ "error": "error deleting note, please try again later" });
                    return;
                }
                res.json({
                    "message": "note has been deleted"
                });
            }
            catch (error) {
                console.error(`error on DeleteNote on noteController.ts ${error}`);
                res.status(500).json({ "error": "Server error try again later" });
            }
        });
    }
    static EditNote(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const reqdata = req.body;
                const currentUserObj = yield authController.CheckToken(req.get("Authorization").slice("Bearer ".length));
                if (!currentUserObj) {
                    res.status(401).json({ "error": "session expired, please log in again" });
                    return;
                }
                let noteid = req.params.id;
                const encryptedNote = cryptr.encrypt(reqdata.note);
                const encryptedTitle = cryptr.ecrypt(reqdata.title);
                const editNote = yield DAO.EditNote(noteid, currentUserObj.userid, encryptedTitle, encryptedNote);
                if (!editNote) {
                    res.status(401).json({ "error": "error editing note, please try again later" });
                    return;
                }
                res.json({
                    "message": "note has been edited"
                });
            }
            catch (error) {
                console.error(`error on EditNote on noteController.ts ${error}`);
                res.status(500).json({ "error": "Server error try again later" });
            }
        });
    }
    static ViewMyNotes(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const reqdata = req.body;
                const decryptedNotesArray = [];
                const currentUserObj = yield authController.CheckToken(req.get("Authorization").slice("Bearer ".length));
                if (!currentUserObj) {
                    res.status(401).json({ "error": "session expired, please log in again" });
                    return;
                }
                const userNotes = yield DAO.viewUserNotes(currentUserObj.userid);
                if (!userNotes) {
                    res.status(401).json({ "error": "error viewing notes, please try again later" });
                    return;
                }
                userNotes.forEach((Note) => {
                    Note.usertitle = cryptr.decrypt(Note.usertitle);
                    Note.notetitle = cryptr.decrypt(Note.notetitle);
                    decryptedNotesArray.push(Note);
                });
                res.json({
                    "notes": decryptedNotesArray
                });
            }
            catch (error) {
                console.error(`error on ViewMyNotes on noteController.js ${error}`);
                res.status(500).json({ "error": "Server error please try again later" });
            }
        });
    }
    static ViewPublicNotes(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const reqdata = req.body;
                const decryptedNotesArray = [];
                const currentUserObj = yield authController.CheckToken(req.get("Authorization").slice("Bearer ".length));
                if (!currentUserObj) {
                    res.status(401).json({ "error": "session expired, please log in again" });
                    return;
                }
                const publicNotes = yield DAO.viewPublicNotes();
                if (!publicNotes) {
                    res.status(401).json({ "error": "error viewing notes, please try again later" });
                    return;
                }
                publicNotes.forEach((PublicNote) => {
                    PublicNote.usertitle = cryptr.decrypt(PublicNote.usertitle);
                    PublicNote.notetitle = cryptr.decrypt(publicNotes.notetitle);
                    decryptedNotesArray.push(PublicNote);
                });
                res.json({
                    "publicnotes": decryptedNotesArray
                });
            }
            catch (error) {
                console.error(`error on ViewPublicNotes on noteController.ts ${error}`);
                res.status(500).json({ "error": "Server error try again later" });
            }
        });
    }
    static MakeNotePublic(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const reqdata = req.body;
                const currentUserObj = yield authController.CheckToken(req.get("Authorization").slice("Bearer ".length));
                if (!currentUserObj) {
                    res.status(401).json({ "error": "session expired, please log in again" });
                    return;
                }
                let noteid = req.params.id;
                const updatedNote = yield DAO.makeNotePublic(noteid, currentUserObj.userid);
                if (!updatedNote) {
                    res.status(401).json({ "error": "error making note public, please try again later" });
                    return;
                }
                res.json({
                    "message": "Note is now public!"
                });
            }
            catch (error) {
                console.error(`error on MakeNotePublic on noteController.ts ${error}`);
                res.status(500).json({ "error": "Server error try again later" });
            }
        });
    }
    static RevokePublicNote(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const reqdata = req.body;
                const currentUserObj = yield authController.CheckToken(req.get("Authorization").slice("Bearer ".length));
                if (!currentUserObj) {
                    res.status(401).json({ "error": "session expired, please log in again" });
                    return;
                }
                let noteid = req.params.id;
                const updatedNote = yield DAO.makeNotePrivate(noteid, currentUserObj.userid);
                if (!updatedNote) {
                    res.status(401).json({ "error": "error making note private, please try again later" });
                    return;
                }
                res.json({
                    "message": "RevokePublicNotes success"
                });
            }
            catch (error) {
                console.error(`error on RevokePublicNotes on noteController.ts ${error}`);
                res.status(500).json({ "error": "Server error try again later" });
            }
        });
    }
    static UpdateSettings(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const reqdata = req.body;
                const currentUserObj = yield authController.CheckToken(req.get("Authorization").slice("Bearer ".length));
                if (!currentUserObj) {
                    res.status(401).json({ "error": "session expired, please log in again" });
                    return;
                }
                const updatedUserSettings = yield DAO.updateUserSettings(currentUserObj.userid, reqdata.newsettings);
                if (!updatedUserSettings) {
                    res.status(401).json({ "error": "error updating user settings, please try again later" });
                    return;
                }
                res.json({
                    "message": "Settings updated"
                });
            }
            catch (error) {
                console.error(`error on UpdateSettings on noteController.ts ${error}`);
                res.status(500).json({ "error": "Server error try again later" });
            }
        });
    }
    static ViewSharedNote(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const reqdata = req.body;
                const currentUserObj = yield authController.CheckUserToken(req.get("Authorization").slice("Bearer ".length));
                if (!currentUserObj) {
                    res.status(401).json({ "error": "session expired, please log in again" });
                    return;
                }
                let noteid = req.params.id;
                let sharekey = req.params.sharekey;
                const requestedNote = yield DAO.GetNoteByShareKey(noteid, sharekey);
                if (!requestedNote) {
                    res.status(401).json({ "error": "error retriving note, please try again later" });
                    return;
                }
                requestedNote.notetitle = yield cryptr.decrypt(requestedNote.notetitle);
                requestedNote.note = yield cryptr.decrypt(requestedNote.note);
                res.json(requestedNote);
            }
            catch (error) {
                console.error(`error on ViewSharedNote on noteController.ts ${error}`);
                res.status(500).json({ "error": "Server error try again later" });
            }
        });
    }
}
module.exports = noteController;
