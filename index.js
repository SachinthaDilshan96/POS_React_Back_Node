const express =require("express");
const mongoose = require("mongoose");
const cors = require('cors')

require("dotenv").config();

const bodyParser = require("body-parser");
const port = process.env["SERVER_PORT "]|3000;
const app = express();

const userRoute = require("./routes/UserRoute")
const customerRoute = require("./routes/CustomerRoute")
const productRoute = require("./routes/ProductsRoute")
const orderRoute = require("./routes/OrderRoutes")

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
app.use(cors())

try{
    mongoose.connect("mongodb://127.0.0.1:27017/possystem");
    app.listen(port,()=>{
        console.log(`server started an running on port ${port}`);
    })
}catch (e){
    console.log(e);
}

app.get("/test-api",(req,resp)=>{
    return resp.json({"message":"server works"})
})

app.use("/api/v1/users",userRoute);
app.use("/api/v1/customer",customerRoute);
app.use("/api/v1/products",productRoute);
app.use("/api/v1/orders",orderRoute);
