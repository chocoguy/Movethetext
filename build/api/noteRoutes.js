"use strict";
// const express = require('express')
// const noteController = require('./controllers/noteController');
// const router = express.Router()
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const noteController = require('./controllers/noteController');
router.route("/create").post(noteController.CreateNote);
router.route("/create-note-share-link").post(noteController.CreateNoteShareLink);
router.route("/revoke-note-share-link").post(noteController.RevokeNoteShareLink);
router.route("/id/:id").get(noteController.ViewNoteById);
router.route("/id/:id/sharekey/:sharekey").get(noteController.ViewSharedNote);
router.route("/delete/:id").delete(noteController.DeleteNote);
router.route("/edit/:id").put(noteController.EditNote);
router.route("/my-notes").get(noteController.ViewMyNotes);
router.route("/public-notes").get(noteController.ViewPublicNotes);
router.route("/make-note-public").post(noteController.MakeNotePublic);
router.route("/make-note-private").post(noteController.RevokePublicNote);
router.route("/settings").post(noteController.UpdateSettings);
//router.route("/settings").get(noteController.GetSettings)
//router.route("/request-storage").post(noteController.RequestStorage)
module.exports = router;
