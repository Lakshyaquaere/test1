const express = require('express');

const app=express();
app.set('view engine','ejs');
app.set('views','html' );

app.get("/",(req,res)=>{
     res.render('test', {error:"error"});
})
 
app.listen(7000,()=>{
    console.log("server is running");
})