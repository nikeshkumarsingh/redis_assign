const app=require("./index");
const connect=require("./config/db");

app.listen(1234,async function(req,res){
    try{
        await connect()
        console.log("listening 1234")
    }
    catch(err){
        console.log(err.message);
    }

});

