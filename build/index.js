"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const DAO = require('./controller/DAO');
const app = express_1.default();
require('dotenv').config();
app.use(cors_1.default());
app.use(express_1.default.json());
const PORT = process.env.PORT || 5000;
app.use("/api/v/notes", require("./api/noteRoutes"));
app.use("/api/v/files", require("./api/fileRoutes"));
app.use("/api/v/auth", require("./api/authRoutes"));
DAO.InitDB();
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
