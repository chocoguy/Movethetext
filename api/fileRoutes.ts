//const express = require('express')
import express from 'express'
const multer = require("multer");
const inMemoryStorage = multer.memoryStorage();
const uploadStrategy = multer({ storage : inMemoryStorage }).single('binary');
const fileController = require('./controllers/fileController')
const router = express.Router()

router.route("/upload").post(fileController.UploadFile, uploadStrategy)
//router.route("/download").get(fileController.DownloadFile)
router.route("/id/:id").get(fileController.GetFileById)
router.route("/delete/:id").delete(fileController.DeleteFile)
//router.route("/create-share-link").post(fileController.CreateFileShareLink)
//router.route("/delete-share-link").delete(fileController.RevokeFileShareLink)
router.route("/view-my-files").get(fileController.ViewMyFiles)
//router.route('/view-public-files').get(fileController.ViewPublicFiles)
//router.route("/make-file-public").post(fileController.MakeFilePublic)
//router.route("/revoke-public-flie").post(fileController.RevokePublicFile)

module.exports = router