//dependencies
require('dotenv').config(); 
const pg= require('pg');
const express = require('express');
const exp = require('constants');
const bodyParser = require('body-parser');
const cors = require('cors');
const validator = require('validator'); 
 const path = require('path')
const multer = require('multer');
const jwt = require('jsonwebtoken');
const { error } = require('console');
const { options } = require('nodemon/lib/config');
const bycrypt = require ('bcrypt')


//file storing and naming
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname+"/images"));
    },
    filename: function (req, file, cb) {
        const date = new Date(); 
        cb(null,date.getDate()+`_`+date.getHours()+`_`+file.originalname);
    }
  
  })
const upload = multer({ storage })


const apiURL = process.env.API_URL || 'http://localhost:8000';  

const app = express();  
app.use(cors());
app.use(express.json());
app.set('views','html' );
app.use(express.static(path.join(__dirname, 'style')));

app.set('view engine' , 'ejs');
    
app.use(bodyParser.raw());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const port = process.env.PORT || 8000;

// return false;
//Connect to postgres
const pool= new pg.Pool({
    user: `${process.env.USER}`,
    password: `${process.env.PASSWORD}` ,
    host:  'localhost',
    port:'5432',
    database: 'trial',

})

//routes
app.get("/",async(req,res)=>{ 
    try{ await res.render('HOME'); }
    catch(err){
        throw err;
    }
    
})

app.get("/login",async(req,res)=>{
    try{ res.render('login')
}catch(err){}
    
})
app.get("/registration",async(req,res)=>{

    try{
         res.render('registration');}

catch(err){}    
})
app.get('/login1',(req,res)=>{
    res.render('postlogin');

})
//GENERATE TOKEN
app.get('/login/generate',(req,res)=>{
  const jwtsecretkey = process.env.JWT_SECRET_KEY;
  const payload ={
      username:req.body.username
  }
  
  const options={
    expiresIn:'1m'};
  const token= jwt.sign(payload,jwtsecretkey,options);
  //
console.log(token);
 res.send(token);
 
})

//route for jwt verification
app.get('/login/verify', async(req,res)=>{

 try{
  const tokenheaderkey =process.env.TOKEN_HEADER_KEY;
  const jwtsecretkey =  process.env.JWT_SECRET_KEY;
  

  const token =req.header("auth-token");
  
  jwt.verify(token,jwtsecretkey, function(err, decoded) {
    if (err) {
        console.log(err);
        res.send(err);
    }
    else {
   
        console.log("Token verifified successfully");
        res.send("successfully verified")
    }
});
}catch(err){}
})


app.post('/registration',upload.array('image'), async (req,res)=>{
    
    
try{   
    
    var username= req.body.username;
    var password =req.body.password;
    var address = req.body.address;
    var email =req.body.email;
    var gender=req.body.gender;
    // var hashedpassword =  bcrypt.hash(password, 10);
    console.log(req.body);
   //file vlidation
   const arr = req.files;
   const valid= validator.isEmail(email);
    arr.forEach(item=>{
        const ext = item.mimetype;
        console.log(ext);
       
        if(ext!=='image/jpeg'){ 
         console.log("enter valid images")
        res.render('registration',{error:"Enter valid image"})
      //email vlidation
        if(valid==0){
            res.redirect("http://localhost:8000/registration.ejs?email-fail=true"); 
                }
    }
     else{
            const values=[username,password,email,gender];
            const query = `INSERT INTO login (username,password,email,gender) VALUES ($1,$2,$3,$4)`;
            pool.query(query,values,(err)=>{
                if(err) throw err; 
                console.log('registred');     
                 })
             }
    })
   

    res.redirect("http://localhost:8000/registration.ejs?success=true"); 
    }    
    catch(err){}
})  
app.post('/login' ,async(req,res)=>{
    try{
        const user =[req.body.username,req.body.password];
        
        const q= `SELECT * FROM login WHERE username= ($1) AND password= ($2); `;
             pool.query(q,user,(err,result)=>{
           if(err) {
            console.log(err);
           };
          if(result.rowCount=== 0){
                res.render('login',{result:"wrong password"});
          }
          else{
            // res.render('postlogin');
            res.redirect("http://localhost:8000/login/generate");
           }
        });
}
catch(err){}
});

app.listen(8000,()=>{
    console.log(`server is running on port${port}`);
})
