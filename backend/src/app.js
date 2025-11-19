const express = require("express")

const app = express()
const cors = require("cors")
const morgan = require("morgan")
const ApiError = require("./utils/ApiError")
const ErrorHandling = require("./middlewares/ErrorHandler")

app.use(cors())
app.use(morgan("dev"))
app.use(express.json({limit:'10mb'}))
app.use(express.urlencoded({extended:false}))

// Add test route BEFORE your main routes
app.get('/test', (req, res) => {
  res.json({ message: 'Server is working!', timestamp: new Date() });
});

app.use("/api/v1", require("./routes"))

app.use("*", (req, res, next) => {
    next(new ApiError(404, "Page not found"));
});

app.use(ErrorHandling)
module.exports = app