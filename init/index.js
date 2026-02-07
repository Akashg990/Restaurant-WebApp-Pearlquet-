const mongoose = require("mongoose");
const Intdata = require("./data.js");
const listing = require("../models/listing.js");

// this file is just to add data into database


const Mongo = "mongodb://127.0.0.1:27017/Pearlquet";

main().then(()=>
{
     console.log("connected db");
}   
).catch(err=>
{
    console.log(err);
}
);


async function main()
{
    await mongoose.connect(Mongo);
}

const initDB = async ()=>
{
    await listing.deleteMany({});
    await listing.insertMany(Intdata.data);
    console.log("data stored");
};

initDB();