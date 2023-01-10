const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const mailchimp = require("@mailchimp/mailchimp_marketing");

const app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static(__dirname));

mailchimp.setConfig({
  apiKey: "8597bfee4614554fa5b0d106f1c727a5-us21",
  server: "us21",
});


app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", (req, res) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;

  const listID = "e52dd1362f";

  async function addMember() {
    const response = await mailchimp.lists.addListMember(listID, {
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName,
      }
    }).then(
      (value) => {
        console.log("Successfully added contact as an audience member.");
        res.sendFile(__dirname + "/success.html");
      },
      (reason) => {
        res.sendFile(__dirname + "/failure.html");
      },
    );
  }
  addMember();
});

app.post("/failure", (req, res) => {
  res.redirect("/");
});


app.listen(process.env.PORT || 3000, function() {
  console.log("I am so depressed.  Brain the size of a planet, but here I am starting your server on port 3000.  Shut up Aditya!!");
});
