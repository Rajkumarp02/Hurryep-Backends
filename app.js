const express = require("express")
const app = express()
const cors = require("cors")




app.use(cors())
app.use(
    cors({
      origin:"*",
    })
  );
  app.use((_req, res, next) => {
    res.header('Access-Control-Allow-Origin' , '*');
    res.header('Access-Control-Allow-Headers', '*');
  
    next();
  });
const order = require("./route/orderRoute")
app.use("/api/v1",order)
app.get("/gets",()=>{
  console.log("Hello")
})
module.exports = app