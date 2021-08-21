const express = require('express')
const fileController = require('./controllers/fileController')
const router = express.Router()

router.route("/upload").post(fileController.UploadFile)
router.route("/download").get(fileController.DownloadFile)
router.route("/id/:id").get(fileController.GetFileById)
router.route("/delete").delete(fileController.DeleteFile)
router.route("/create-share-link").post(fileController.CreateFileShareLink)
router.route("/delete-share-link").delete(fileController.RevokeFileShareLink)
router.route("/view-my-files").get(fileController.ViewMyFiles)
router.route('/view-public-files').get(fileController.ViewPublicFiles)
router.route("/make-file-public").post(fileController.MakeFilePublic)
router.route("/revoke-public-flie").post(fileController.RevokePublicFile)

module.exports = router