const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ListingSchema = new Schema(
    {
        title:{
            type:String,
            required:true,
        },
        description:{
            type:String
        },
        image:{
          url:String,
          filename:String,
        },
        price:{
            type:Number,
            required:true,
        },
    }
);

//creating a model from above schema

const Listing = mongoose.model("Listing", ListingSchema);

module.exports = Listing;
