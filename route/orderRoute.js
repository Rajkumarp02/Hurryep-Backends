const express = require("express")
const app = require("../app")
const bodyParser = require("body-parser")
const router = express.Router()

const {createOrder, handleWebHook, getOrder} = require("../controller/orderController")

router.route("/order").post(express.json(),createOrder)
router.route("/handleWebhook").post(bodyParser.json(),handleWebHook)
router.route("/getOrder/:orderId").get(express.json(),getOrder)

module.exports = router