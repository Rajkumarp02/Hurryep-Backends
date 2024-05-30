const app = require("./app")
const path = require("path")
const dotenv = require("dotenv")

dotenv.config({path: path.join(__dirname,'./config/config.env')})


app.listen(process.env.PORT,()=>{
    console.log("Server Started")
})