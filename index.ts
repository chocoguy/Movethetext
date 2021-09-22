import express from 'express'
import cors from 'cors'
const DAO = require('./controller/DAO')


const app = express();
require('dotenv').config()
app.use(cors())
app.use(express.json())


const PORT = process.env.PORT || 5000

app.use("/api/v/notes", require("./api/noteRoutes"))
app.use("/api/v/files", require("./api/fileRoutes"))
app.use("/api/v/auth", require("./api/authRoutes"))


//detaching DB for now
//DAO.InitDB()
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

