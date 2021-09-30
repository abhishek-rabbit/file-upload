const express=require('express');
const path=require('path');
const multer=require('multer');
const mongoose=require('mongoose');
const dotenv=require('dotenv');
const fileRouter=require('./routes/fileRoute.js');
dotenv.config({path:'./config.env'});

const app=express();
app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');
app.use(express.static('public'));
mongoose.connect(process.env.DATABASE_LOCAL);



app.use(fileRouter);
app.listen(process.env.PORT,()=>{
    console.log("Server Started at"+process.env.PORT);
});