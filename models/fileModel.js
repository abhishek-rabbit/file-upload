const mongoose=require('mongoose');

const fileuploaddb=new mongoose.Schema({
    filepath:String
});

module.exports=mongoose.model('filepath',fileuploaddb);