const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderSchema = new Schema(
    {
        title:{
            type:String,
            required:true,
        },
        quant:
        {
            type:Number,
            default:1,
            set : (v)=> v ? 1 : v
        },
        price:{
            type:Number,
            required:true,
        },
    }
);

//creating a model from above schema

const Orders = mongoose.model("Orders", OrderSchema);

module.exports = Orders;
