const pg = require('pg');
const http = require('http');
var fomat = require('pg-format');
const { format } = require('path');
const { appendFile } = require('fs');


const pool = new pg.Pool({
    user:'postgres',
    password :'lakshya9685',
    host:'localhost',
    port:'5432',
    database:'trial',
} );

// pool.connect((err)=>{
//     if(err) throw err;
//     console.log("connected");
// })
 
     
pool.connect((err)=>{
    if(err) throw err;
    var dataToInsert= 
    [
      {id:'1',name:'ladasda',address:'adadas'},
      {id:'2',name:'dadada',address:'aaffef'},
      {id:'3',name:'lakkshya',address:'jabalpur'},
    ];
      
     function insert(dataToInsert){
     
      //   const {name,address}=dataToInsert;

      //   const values = dataToInsert.map((customer) => [customer.name, customer.address]);

       dataToInsert.forEach(element => {
         // [element.name,element.address];
         // console.log(element.name,element.address);
         const values= [element.id,element.name,element.address];
         
         const q = (`INSERT INTO customers2 (id,name,address) VALUES ($1,$2,$3)`);
         // const {name,address}=values;
          

         pool.query(q,values,(err)=>{
            if(err) throw err;
           
         })
       
      });
     }
     insert(dataToInsert);
})

pool.connect((err)=>{
   if(err) throw err;

    var q= `SELECT * FROM customers2`;
    pool.query(q,(err,result)=>{
      if(err) throw err;
      // console.log(`DATA DELETED`);
      console.log(result.rows);
    })
})
