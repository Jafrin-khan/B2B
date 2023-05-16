const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const ejs = require("ejs");
const https = require("https");
const mongoose = require('mongoose');

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
//this line is used so that we can use styles and images present locally in our system in server
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/b2bDB", {useNewUrlParser: true});

const buyerSellerSchema = {
  title: String,
  content: String
};

const buyerSeller = mongoose.model("buyerSeller", buyerSellerSchema);

app.get("/",function(req,res){
  res.sendFile(__dirname + "/index.html");
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  const buyer_Seller = new buyerSeller({
    title: req.body.postTitle,
    content: req.body.postBody
  });
  
  buyer_Seller.save();
});

app.post("/register",function(req,res){
  //https://mailchimp.com/developer/release-notes/full-name-added-member-responses/
 //https://mailchimp.com/developer/marketing/api/campaign-content/
  //https://mailchimp.com/developer/marketing/docs/merge-fields/#create-a-merge-field
  var firstName = req.body.username;
  /*var hsCode = req.body.text;*/
  var email = req.body.email;
  //merge field waali documentation se variable uthaay hai
  var data = {
    members:[
      { email_address : email,
              status: "subscribed",
              merge_fields:{
                FNAME: firstName,

              }
            }]
};
    const jsonData = JSON.stringify(data);
    const url = "https://us6.api.mailchimp.com/3.0/lists/31d63d7403" //last wala part url ka mera user Id hai
    const options = {
      method: "POST",
    }

    //now our data is ready hence we'll make request; refer https documentation
       const request = https.request(url , options , function(response){

          if(response.statusCode == 200){
              res.sendFile(__dirname + "/success.html");
          }
          else{
              res.sendFile(__dirname + "/failure.html");
            }
           response.on("data",function(data){
             console.log(JSON.parse(data));
           });
       });
       request.write(jsonData);
       request.end();
   });

app.get("/buyers",function(req,res){
  res.render("buyers");
});

app.get("/member",function(req,res){
  res.render("member");
});

app.get("/watcher",function(req,res){
  res.render("watcher");
});

app.get("/login",function(req,res){
  res.render("login");
});

app.listen(3000,function(){
  console.log("server is running successfully");
});
