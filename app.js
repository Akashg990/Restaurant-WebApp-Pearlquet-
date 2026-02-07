if(process.env.NODE_ENV != 'production')
{
require('dotenv').config();
}


const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = 8080;
const listing = require("./models/listing");
const orders = require("./models/order");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const multer = require('multer');
const {storage} = require("./Cloudconfig.js");
const upload = multer({storage});
const dburl = process.env.MONGO_ATLAS;
//api

main().then(()=>
{
    console.log("connected to DB");
}).catch(err=>

{
   console.log(err);
}
)


async function main()
{
    await mongoose.connect(dburl);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));
app.engine("ejs",ejsMate);



app.get("/",async (req, res)=>
{
   const list = await listing.find({});

   res.render("listings/index",{list});
})


app.get("/search", async (req,res)=>
{
    const data = req.query.query;
    
    if(!data)
    {
        return res.redirect("/");
    }
   let list = await listing.find(
    {
        '$or':[
            {title:{$regex :  `.*${data}.*`,  $options: 'i' }},
            {description:{$regex: `.*${data}.*`, $options: 'i'}},
            
            
        ]

    }

   )
   if(list.length==0)
   {
      
    
    return   res.redirect('/');
   }
   res.render('listings/index.ejs',{list});
});




app.get("/items/new", (req,res)=>
{
    res.render("listings/create");
})

app.post("/additems",upload.single('item[image]'), async(req,res)=>
{
 let url = req.file.path;
 let filename = req.file.filename;
 
 const info = new listing(req.body.item);
 info.image = {url , filename};

 await info.save();

 res.redirect('/');

    
})

app.post("/cartitems/:id", async(req,res)=>
{ 
    let {id} = req.params;

    const newitem = await listing.findById(id);

    const neworder = new orders({title:newitem.title, price:newitem.price});
    await neworder.save();

    res.redirect('/');
})


app.get("/items/:id", async (req,res)=>
{
    let {id} = req.params;
    const info = await listing.findById(id);
    res.render("listings/show", {info});
})



app.get("/items/:id/edit", async(req,res)=>
{
    let {id} = req.params;
    const info = await listing.findById(id);
    res.render("listings/edit", {info});
} )


app.get("/cart", async(req,res)=>
{
    const list = await orders.find({});

    res.render("listings/cart",{list});


    
})



app.put("/items/:id",upload.single('item[image]'), async(req,res)=>
{
    let {id} = req.params;
    let updatedItem = await listing.findByIdAndUpdate(id , {...req.body.item});

    if(typeof req.file !== "undefined")
    {
        let url = req.file.path;
        let filename = req.file.filename;

        updatedItem.image = {url , filename};
        await updatedItem.save();
    }
    res.redirect(`/items/${id}`);

})

app.delete("/items/:id", async(req,res)=>
{
    let {id} = req.params;
    await listing.findByIdAndDelete(id);
    res.redirect("/");
})

app.delete("/order/:id", async(req,res)=>
{
    let {id} = req.params;
    await orders.findByIdAndDelete(id);
    res.redirect("/cart");
})



app.listen(port, ()=>
{
    console.log("Server is live");
})