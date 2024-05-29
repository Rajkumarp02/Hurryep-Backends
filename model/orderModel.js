const mongoose = require("mongoose")

const orderSchema = new mongoose.Schema({

    orderId: {
        type: String,
        required: true,
      },
    
        name: { type: String, required: true },
        email: { type: String, required: true },
        phone:{type:Number, },
        coursename: { type:String, },
        payment:{type:Number}
})

module.exports = mongoose.model("order",orderSchema)