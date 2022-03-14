
// Required modules
var express = require("express");
var app = express();
var fs = require("fs");
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())

// Homepage route
app.get('/', function (req, res)
{
    res.sendFile(__dirname +'/pages/index.html');
});

// /Guestbook route
app.get("/guestbook", (req, res) => 
{
    let data = require("./data.json");
    //Adding bootstrap to js
    var bootstrap = "<link rel="+'stylesheet'+" href=https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css></link>"
    // Creating table with bootstrap 
    let results ="<header style = 'background-color: rgba(29, 28, 28, 0.89);' >"+
    "<nav style ='display: flex;align-items: center;justify-content: center;'>"+
    "<ul style= 'width: 100%;padding-top: 15px;list-style: none;display: flex;justify-content: space-evenly;align-items: center;flex-wrap: wrap;'>"+
    "<li><a style:'color: white;font-size: 20px;' href='/'>Home</a></li>"+
    "<li><a href='/guestbook'>Guestbook</a></li>"+""+
    "<li><a href='/newmessage'>New Message</a></li>"+""+
    "<li><a href='/ajaxmessage'>New Ajax Message</a></li></nav></header>"+
    bootstrap+"<table class='table' style='width: 100%'> <thead class='thead-dark'>" +
    '<tr><th>Name</th><th>Country</th><th>Date</th><th>Message</th></tr>';
    for (let i = 0; i < data.length; i++) 
	{
      results +=
        '<tr>' +
        '<td>' + data[i].name + '</td>' +
        '<td>' + data[i].country + '</td>' +
        "<td>" + data[i].date + "</td>" +
        '<td>' + data[i].message + '</td>' +
        '</tr>';
    }
    // Send table data
    results += "</table>";
    res.send(results);
  });
// Newmessage route
app.get('/newmessage', function (req, res)
{
    res.sendFile(__dirname +'/pages/message.html');
});
app.post('/newmessage', function (req, res){
    var data = require("./data.json");
    // Required to have message to send
    if (req.body.name == "" || req.body.country == "" || req.body.message == "") 
	{
        req.redirect("/newmessage")
    } else {
        // Send data into JSON file
        data.push({
            "name": req.body.name,
            "country": req.body.country,
            "date": new Date(),
            "message": req.body.message
        });

        var jsonStr = JSON.stringify(data);

        fs.writeFile(__dirname + "/data.json", jsonStr, (err) => 
		{
            if (err) throw err;
            console.log("Data saved!")
        });
        // Redirect route back to questbook
        res.redirect("/guestbook")
    }
});
// Ajax message route
app.get('/ajaxmessage', function (req, res){
    res.sendFile(__dirname +'/pages/ajax.html');
});
// Ajax post 
app.post("/ajaxmessage", function (req, res) 
{
    var data = require("./data.json");
    data.push({
        "name": req.body.name,
        "country": req.body.country,
        "date": new Date(),
        "message": req.body.message
    });
    var jsonStr = JSON.stringify(data);
    fs.writeFileSync(__dirname + "./data.json", jsonStr);
    res.sendFile(__dirname + "./data.json")
})


// Port
const PORT = process.env.PORT || 3000;


  // Create server
app.listen(PORT, () => 
{
    console.log("Example app listening on port " + PORT);
});