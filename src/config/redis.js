const { createClient }=require("redis");


const clint=createClient({url:"redis://localhost:6379"});


clint.on("err",(err)=>{
    console.error({message:err.message})
})
module.exports=clint