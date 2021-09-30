const express=require('express');
const router=express.Router();
const multer=require('multer');
const path=require('path');
const fileupload=require('../models/fileModel.js');
const fs=require('fs');

let storage=multer.diskStorage({
    destination:'./public/uploads/images/',
    filename:(req,file,cb)=>{
        cb(null,file.originalname);
    }
});

function checkFileType(file,cb){
    const fileTypes=/jpeg|jpg|png|gif/;
    const extname=fileTypes.test(path.extname(file.originalname).toLowerCase());
    if(extname)
    {
        return cb(null,true);
    }
    else{
        cb('error:Please Images Only');
    }
}

let upload=multer({
    storage:storage,
    fileFilter:(req,file,cb)=>{
        checkFileType(file,cb);
    }
})

router.post('/uploadSingle',upload.single('file'),(req,res,next)=>{
    const file=req.file;
    if(!file)
    {
        return console.log("please upload file");
    }
    
    let url=file.path.replace('public','');
    fileupload.findOne({filepath:url})
        .then(img=>{
            if(img)
            {
                console.log('File already Exists');
                return  res.render('uploadFile');
            }
            fileupload.create({filepath:url})
                .then(img=>{
                    if(img)
                    {
                        console.log('File Inserter into database Successfully');
                    }
                    return res.render('index');
                })
        })
        .catch(err=>{
            return console.log(err);
        })
});

router.get('/',(req,res)=>{
    fileupload.find({})
        .then(img=>{
            return res.render('index',{image:img});
        })
        .catch(err=>{
            console.log(err);
        })
});
router.get('/uploadfile',(req,res)=>{
    res.render('uploadfile');
});
router.get('/delete',(req,res)=>{
    let id=req.query.id;
    fileupload.findOne({_id:id})
        .then(img=>{
            if(img)
            {
                fs.unlink(__dirname+'/public/'+img.filepath,async err=>{
                    if(err)
                    {
                        return console.log(err);
                    }
                    await fileupload.remove({_id:id});
                    
                })
            }
        })
        .catch(err=>{
            console.log(err);
        })
    res.redirect('/');
});

router.post('/uploadMultiple',upload.array('file'),(req,res)=>{
    let file=req.files;
    if(!file)
    {
        return console.log('Please select file');
    }
    file.forEach(files=>{
        let url=files.path.replace('public','');
        fileupload.findOne({filepath:url})
            .then(async img=>{
                if(img) return console.log('Duplicate File');
                await fileupload.create({filepath:url});

            })
            .catch(err=>{
                return console.log(err);
            })
    })
    res.redirect('/');
})

module.exports=router;