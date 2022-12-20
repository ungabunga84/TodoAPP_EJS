const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const ejs = require('ejs');
require('dotenv').config();
const app = express();


app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));

let today = new Date();
let options = {
  day: "numeric",
  month: "long"
};

let day = today.toLocaleDateString("en-EU", options)
let name = process.env.name;
let password = process.env.password;
mongoose.set('strictQuery', false);
mongoose.connect("mongodb+srv://" + name + ":" + password + "@cluster0.gn02jxi.mongodb.net/ToDoSingleListDB");

const itemsSchema = {
  name: {type: String,
  required: true}
};

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
  name: "Welcome to your todolist!"
});
const item2 = new Item({
  name: "Push + to add a new item"
});
const item3 = new Item({
  name: "<-- Hit this to delete an item"
});
const defaultItems = [item1, item2, item3];

app.get('/', function(req, res) {

  Item.find({}, function(err, foundItems) {
    if (foundItems.length === 0) {
      Item.insertMany(defaultItems, function(err) {
        if (err) {
          console.log(err);
        } else {
          console.log(foundItems);
        }
      });
      res.redirect("/");
    } else {
      res.render("list", {
        listTitle: day,
        newListItems: foundItems,
        });
    }
  });
});

app.post("/", function(req, res) {
  const item = new Item({
    name: req.body.newItem
  });
    item.save(function(err){});
    res.redirect("/");
});

app.post("/delete", function(req, res){
    Item.deleteOne({_id: req.body.checkbox}, function(err){})
    res.redirect("/");
  });


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
