const mysql = require('mysql2');
const express = require('express');
const path = require('path')
const cors = require('cors');
const mongoose = require('mongoose');
const Data = require("./model/data.js")
const User = require("./model/hos.js")


const app = express();
app.use(express.json())
const port = 3000;
app.use(cors());
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'hospitals',
    password:"12345678"
  });

  main().then(()=>{
    console.log("connection successful");
}).catch((err) =>{console.log(err)})



async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/login");
}


app.use(express.static(path.join(__dirname, '/public')));
app.use(express.urlencoded({extended:true}))

app.set("view engine","ejs");
app.set('views',path.join(__dirname,"/views"))

app.listen(port,(req,res)=>{
    console.log("listening on port 3000");
})

app.get("/bed",(req,res)=>{
    res.render("home.ejs")
})





app.post("/pay",(req,res)=>{
    let Username = req.body.name
    let Userage = req.body.age
    let Userphone = req.body.phone
    let Useremail = req.body.email
    let HospitalId = req.body.id
    let symptoms = req.body.symptoms;

    

    if(!Username || !Userage || !Userphone || !Useremail || !HospitalId){
        res.send("enter all the details")
    }
    else{

        User.insertOne({
            name:Username,
            email:Useremail,
            Phone:Userphone,
            id:HospitalId,
            symptoms:symptoms
        })
        res.render("successful.ejs")
    }
   
   
})








app.get("/book",(req,res)=>{
    res.render("form.ejs")
})

app.post("/ambulance",(req,res)=>{
    let place = req.body.ambu
    if(!place){
        res.send("enter the location ..")
    }
    else{
        let q = `select * from delhi_ambulance_info where location = "${place}"`
        connection.query(q,(err,result)=>{
        if(err) throw err;
        let data = result[0];
        res.render("ambuu.ejs",{data})
    })
    }
    
})

app.get("/ambu",(req,res)=>{
    res.render("ambu.ejs")
})


app.post("/info",(req,res)=>{
    let place = req.body.location;
    let beds = req.body.beds;
   
    console.log(beds)
    console.log(place)


   console.log(`location:${place} beds:${beds}`)

    try{
        let q = `select * from Hospital where location ="${place}" `;
      
        connection.query(q,(err,result)=>{
            if(err) throw err;
            let data = result
            res.render("detail.ejs",{data})
          })
    }
    catch(err){
        console.log(err)
    }
    
})


app.post("/emergency",async (req,res)=>{
    let disease = req.body.disease
    let q = `select * from HospitalData where disease_type = "${disease}" `
    connection.query(q,(err,result)=>{
        if(err) throw err;
        let response = result[0];
    res.send(response)
    })
    
})

// adding data to backend
  

app.post("/sign",async (req,res)=>{
    console.log(req.body)
    let name = req.body.name
    let email = req.body.email
    let password = req.body.password

    let data1 = new Data({
        name:`${name}`,
        email:`${email}`,
        password:`${password}`
    })
    await data1.save()
    res.send("welcome")
})

let Lname;
app.post("/login",async (req,res)=>{
    Lname = req.body.Lname
    let Lemail = req.body.Lemail
    let Lpassword = req.body.Lpassword
    
    try {
        let user = await Data.findOne({ name: Lname, email: Lemail, password: Lpassword });
        if (user) {
            res.send("Login Successful");
        } else {
            res.send("User not found");
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("Database error");
    };
    
    
   
   
})


app.get("/user",(req,res)=>{
    res.send(Lname)
})


app.get("/staff",(req,res)=>{
    res.render("StaffLogin.ejs")
})

app.post("/sLogin",async (req,res)=>{
    let hostel_ID = req.body.hospital_id;
    let q = `select * from hospital where id= "${hostel_ID}"`
    connection.query(q, async (err,result)=>{
        if(err) throw err;
        let data = result[0];
        let details = await User.find({id:hostel_ID});
        
        console.log(details)
        res.render("Hos.ejs",{details})
    })
    
})