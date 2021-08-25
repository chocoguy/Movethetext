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
class noteController {
    static CreateNote(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    static CreateNoteShareLink(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    static RevokeNoteShareLink(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    static GetNoteById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    static DeleteNote(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    static EditNote(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    static ViewMyNotes(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                res.status(200).json({ "info": "Returning notes" });
            }
            catch (error) {
                console.error(`error on ViewMyNotes on noteController.js ${error}`);
                res.status(500).json({ "error": "Server error please try again later" });
            }
        });
    }
    static ViewPublicNotes(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    static MakeNotePublic(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    static RevokePublicNote(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    static UpdateSettings(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    static GetSettings(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    static RequestStorage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
}
module.exports = noteController;
