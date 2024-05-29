const app = require("./app")
const mongoose = require("mongoose")
const path = require("path")
const dotenv = require("dotenv")

dotenv.config({path: path.join(__dirname,'./config/config.env')})

mongoose.connect(process.env.MONGO_URI).then(()=>{
    console.log("mongodb connected")
})



app.listen(process.env.PORT,()=>{
    console.log("Server Started")
})