require("dotenv").config()
const express = require("express")
const app = express()
const cors = require("cors")
const xss = require("xss-clean")
const rateLimiter = require("express-rate-limit")
const helmet = require("helmet")
const cookieParser = require("cookie-parser")
const refresh = require("./middleware/refresh")
const mongoose = require("mongoose")
const connectDB = require("./db/dbconn")
const verifyjwt = require("./middleware/verifyjwt")
require("express-async-errors")
const notFound = require("./middleware/notFound")
const errorHandler = require("./error/errorhandler")

connectDB()
app.use(cookieParser())

const PORT = process.env.PORT || 3500

app.set('trust proxy', 1)

app.use(rateLimiter(
  {
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
}
))
app.use(cors())
app.use(xss())
app.use(helmet())

app.use(express.static("./public"))
app.use(express.json())
app.use("/user", require("./routes/user"))
app.use("/refresh", require("./routes/refresh"))

app.use(verifyjwt)
app.use("/jobs", require("./routes/jobs"))

app.use(notFound)
app.use(errorHandler)

mongoose.connection.once("open", () => {
  console.log("Connected to Database")
  app.listen(PORT, () => console.log(`Server started at port ${PORT}`))
})

