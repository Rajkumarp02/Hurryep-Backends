const express = require("express")
const app = require("../app")
const bodyParser = require("body-parser")
const router = express.Router()

const {createOrder} = require("../controller/orderController")

router.route("/order").post(express.json(),createOrder)



module.exports = router