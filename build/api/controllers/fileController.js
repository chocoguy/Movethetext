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
class fileController {
    //?
    //? --Auth--
    //?
    static UploadFile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    static DownloadFile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    static CreateFileShareLink(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    static RevokeFileShareLink(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    static GetFileById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    static DeleteFile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    static ViewMyFiles(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    static ViewPublicFiles(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    static MakeFilePublic(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    static RevokePublicFile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
}
module.exports = fileController;
