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
const DAO = require('../../controller/DAO');
const authController = require('./authController');
//const { BlobServiceClient } = require("@azure/storage-blob");
const containername = "move-the-text-files";
//const multer = require("multer");
//const inMemoryStorage = multer.memoryStorage();
//const uploadStrategy = multer({ storage : inMemoryStorage }).single('binary');
//const getStream = require('into-stream');
//const ONE_MEGABYTE = 1024 * 1024;
//const uploadOptions = { bufferSize : 4 * ONE_MEGABYTE, maxBuffers: 20 };
//!-----------------------------------------------------------------------------------
//!-----------------------------------------------------------------------------------
//!---------------------------READ----------------------------------------------------
//!-----------------------------------------------------------------------------------
//!-----------------------------------------------------------------------------------
//Files TBD Not in working state for now
//will be implemented after initial backend debuging and testing is complete
//Stage files locally and upload to cloudinary
//debugging and testing for file routes will occur after implementation
//!-----------------------------------------------------------------------------------
//!-----------------------------------------------------------------------------------
//!-------------------------------------READ------------------------------------------
//!-----------------------------------------------------------------------------------
//!-----------------------------------------------------------------------------------
require('dotenv').config();
class fileController {
    //?
    //? --Auth--
    //?
    static generateBlobName(originalName) {
        const identifier = Math.random().toString().replace(/0\./, '');
        return `${identifier}-${originalName}`;
    }
    static UploadFile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const reqdata = req.body;
                const currentUserObj = yield authController.CheckToken(req.get("Authorization").slice("Bearer ".length));
                if (!currentUserObj) {
                    res.status(401).json({ "error": "session expired, please log in again" });
                    return;
                }
                //? Azure method
                //originalname
                // const connectionString = process.env.AZURE_BLOB_CONNECTION_STRING
                // const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString)
                const bloob = this.generateBlobName(req.file.originalName);
                // const stream = getStream(req.file.buffer)
                // const containerClient = blobServiceClient.getContainerClient(containername);
                // const blockBlobClient = containerClient.getBlockBlobClient(bloob)
                // await blockBlobClient.uploadStream(stream,
                //     uploadOptions.bufferSize, uploadOptions.maxBuffers,
                //     { blobHTTPHeaders: { blobContentType : "image/jpg" } });
                //? Cloudinary method
                const currentFile = yield DAO.CreateFile(currentUserObj.userid, reqdata.filetitle, bloob, `https://decahex.blob.core.windows.net/move-the-text-files/${bloob}.${reqdata.extension}`);
                if (!currentFile) {
                    res.status(401).json({ "error": "error retriving file, please try again later" });
                    return;
                }
                res.json({
                    "message": "UploadFile success"
                });
            }
            catch (error) {
                console.error(`error on UploadFile on fileController.ts ${error}`);
                res.status(500).json({ "error": "Server error try again later" });
            }
        });
    }
    // static async DownloadFile(req: any, res: any){
    //     try{
    //         res.json({
    //             "message" : "DownloadFile success"
    //         })
    //     }catch(error){
    //         console.error(`error on DownloadFile on fileController.ts ${error}`)
    //         res.status(500).json({"error" : "Server error try again later"})
    //     }
    // }
    // static async CreateFileShareLink(req: any, res: any){
    //     try{
    //         res.json({
    //             "message" : "CreateFileShareLink success"
    //         })
    //     }catch(error){
    //         console.error(`error on CreateFileShareLink on fileController.ts ${error}`)
    //         res.status(500).json({"error" : "Server error try again later"})
    //     }
    // }
    // static async RevokeFileShareLink(req: any, res: any){
    //     try{
    //         res.json({
    //             "message" : "RevokeFileShareLink success"
    //         })
    //     }catch(error){
    //         console.error(`error on revokeFileShareLink on fileController.ts ${error}`)
    //         res.status(500).json({"error" : "Server error try again later"})
    //     }
    // }
    static GetFileById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const reqdata = req.body;
                const currentUserObj = yield authController.CheckToken(req.get("Authorization").slice("Bearer ".length));
                if (!currentUserObj) {
                    res.status(401).json({ "error": "session expired, please log in again" });
                    return;
                }
                let fileid = req.params.id;
                const currentFile = yield DAO.ViewFileById(currentUserObj.userid, fileid);
                if (!currentFile) {
                    res.status(401).json({ "error": "error retriving file, please try again later" });
                    return;
                }
                res.json(currentFile);
            }
            catch (error) {
                console.error(`error on GetFileById on fileController.ts ${error}`);
                res.status(500).json({ "error": "Server error try again later" });
            }
        });
    }
    static DeleteFile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const reqdata = req.body;
                const currentUserObj = yield authController.CheckToken(req.get("Authorization").slice("Bearer ".length));
                if (!currentUserObj) {
                    res.status(401).json({ "error": "session expired, please log in again" });
                    return;
                }
                let fileid = req.params.id;
                const deletedFile = yield DAO.DeleteFile(currentUserObj.userid, fileid);
                if (!deletedFile) {
                    res.status(401).json({ "error": "error deleting file, please try again later" });
                    return;
                }
                res.json({
                    "message": "file deleted"
                });
            }
            catch (error) {
                console.error(`error on DeleteFile on fileController.ts ${error}`);
                res.status(500).json({ "error": "Server error try again later" });
            }
        });
    }
    static ViewMyFiles(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const reqdata = req.body;
                const filesArray = [];
                const currentUserObj = yield authController.CheckToken(req.get("Authorization").slice("Bearer ".length));
                if (!currentUserObj) {
                    res.status(401).json({ "error": "session expired, please log in again" });
                    return;
                }
                const userFiles = yield DAO.ViewUserFiles(currentUserObj.userid);
                if (!userFiles) {
                    res.status(401).json({ "error": "error Viewing files, please try again later" });
                    return;
                }
                userFiles.forEach((File) => {
                    filesArray.push(File);
                });
                res.json({
                    "files": filesArray
                });
            }
            catch (error) {
                console.error(`error on ViewMyFiles on fileController.ts ${error}`);
                res.status(500).json({ "error": "Server error try again later" });
            }
        });
    }
}
module.exports = fileController;
