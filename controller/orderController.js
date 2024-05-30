const Razorpay = require("razorpay")
const crypto = require("crypto")

exports.createOrder = async(req,res)=>{

    var instance = new Razorpay({ key_id: process.env.key_id, key_secret: process.env.key_secret })

        const { name, email, phone, coursename } = req.body;
    
        var options = {
            amount: 50000/10, 
            currency: "INR",
            receipt: "receipt#1",
            notes: {
                name: name,
                email: email,
                phone: phone,
                coursename: coursename
            }
        };
    
        try {
            const orderDetails = await instance.orders.create(options);
     
            res.json({
                orderDetails
            })
        }

catch (error) {
    console.error(error);
    res.status(500).send("Failed to create order");
}
    }



