const order = require("../model/orderModel")
const Razorpay = require("razorpay")
const crypto = require("crypto")
var instance = new Razorpay({ key_id: 'rzp_test_DqcYOTDOsAyoiv', key_secret: 'dODJWxZSRBzjm5h7BXa3Etwk' })
const {google} =require("googleapis")
const fs = require("fs");
//  const credentials = require("../credentials.json")

const keyFile = fs.readFileSync("valiant-vault-417214-ca5deb3686b3.p12");
exports.createOrder = async(req,res)=>{

        const { name, email, phone, coursename } = req.body;
    
        var options = {
            amount: 50000, // amount in the smallest currency unit, e.g. cents in INR
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

// exports.paymentVerification = async(req,res)=>{

//     const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
//     req.body;

//   const body = razorpay_order_id + "|" + razorpay_payment_id;

//   const expectedSignature = crypto
//     .createHmac("sha256", process.env.RAZORPAY_APT_SECRET)
//     .update(body.toString())
//     .digest("hex");

//   const isAuthentic = expectedSignature === razorpay_signature;

//   if (isAuthentic) {
//     // Database comes here   
//     res.redirect(
//       `http://localhost:3000/paymentsuccess?reference=${razorpay_payment_id}`
//     );

// }
// }

exports.handleWebHook = async(req,res)=>{
    console.log("hooks")

    const signature = req.get('X-Razorpay-Signature');
    if (!verifySignature(req.body, signature)) {
        return res.status(400).send('Invalid signature');
    }


    const orderDetails = req.body.payload.order.entity
  

    if (req.body.event === 'order.paid') {
      
        const Details = {
            name: orderDetails.notes.name,
            email: orderDetails.notes.email,
            phone: orderDetails.notes.phone,
            coursename: orderDetails.notes.coursename,
            payment: orderDetails.amount_paid/100,
            orderId:orderDetails.id
        } 
        

       const newUser = await order.create(Details)

       await handleGooglesheet(Details)
       console.log(newUser)
    }



    res.json({ status: 'success' });
};


function verifySignature(payload, signature) {
    const secret = 'Admin123'; 
    const hmac = crypto.createHmac('sha256', secret);
    const generatedSignature = hmac.update(JSON.stringify(payload)).digest('hex');
    return generatedSignature === signature;
}
async function handleGooglesheet(Details){

    const auth =new google.auth.GoogleAuth(
        {
            credentials: {
                client_email: "hurryeptech@valiant-vault-417214.iam.gserviceaccount.com",
                private_key: keyFile,
              },
            
            scopes: "https://www.googleapis.com/auth/spreadsheets"
        },
    
    )
    const client = await auth.getClient()
        
    const googleSheets = google.sheets({ version: "v4", auth: client });
    
    const spreadsheetId = '11EcIzyQBXsCogHxqF0-Y0ckTDxsShs2SLeKOUxdof6Q' ;
    
    const metaData = await googleSheets.spreadsheets.get({
      auth,
      spreadsheetId,
    });
    
    const edited =   await googleSheets.spreadsheets.values.append({
      auth,
      spreadsheetId,
      range: "Sheet1!A:F",
      valueInputOption: "USER_ENTERED",
      resource: {
        values: [[Details.name, Details.email,Details.phone,Details.coursename,Details.payment,Details.orderId]],
      },
    
    });


}

exports.getOrder = async(req,res)=>{

    const {orderId} = req.params

    const orderDetails = await order.findOne({orderId: orderId})

  
    if(!orderDetails)
        {
            return res.status(400).send('Invalid Order_id');
        }
        console.log("Hello Inners")
        res.json({
            Success:true,
            orderDetails
        })
}

