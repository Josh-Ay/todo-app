// Requiring the node modules to be used and declaring port number for local usage
const express = require("express");
const mongoose = require("mongoose");
const port = 3000;


// Connecting to the database
mongoose.connect('mongodb://localhost:27017/todo-FM-DB',);


// Configuring the express app
const app = express();
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));
app.set("view engine", "ejs");


// Creating the mongoose schema that defines the structure of the collection(s) to be used in the database
const itemsSchema = new mongoose.Schema({
    item: String
});

// Creating 2 collections: One for 'todos' and Another for 'completed todos'
const Item = mongoose.model("Item", itemsSchema);
const DoneItems = mongoose.model("DoneItem", itemsSchema);


app.route("/")
.get( (req, res) =>{    // load all the todos found in the DB
    Item.find({}, function (err, listFound) {
        if (err) {
            console.log(err);
        } else {
            DoneItems.find({}, function (err, doneItems) {
                if (err) {
                    console.log(err);
                } else {
                    const noOfItemsLeft = listFound.length;
                    res.render(
                        "list", 
                        {
                            foundItems: listFound, itemsLeft: noOfItemsLeft, doneItems: doneItems
                        }
                    );
                }
            });
        }
    });
})

.post( (req, res)=>{    // add a new todo
    const itemToSave = req.body.todoItem;
    const newItem = new Item({item: itemToSave});
    newItem.save();

    res.redirect("/");
});

//  get active todos
app.get("/active", (req, res)=>{
    Item.find({}, function (err, activeItemsList) {
        if (err) {
            console.log(err);
        }else{
            const itemsLeft = activeItemsList.length;
            res.render("list", {foundItems:activeItemsList, itemsLeft: itemsLeft});
        }
    })
});

//  get completed todos
app.get("/completed", (req, res)=>{
    DoneItems.find({}, function (err, doneItemsList) {
        if (err) {
            console.log(err);
        } else {
            const itemsDone = doneItemsList.length;
            res.render("list", {doneItems:doneItemsList, itemsLeft:itemsDone});
        }
    })
});

//  delete all completed todos and redirect to current page
app.get("/delete/all", (req, res)=>{
    const currentPage = req.headers.referer;
    DoneItems.deleteMany({}, (err) => {
        if (err) {
            console.log(err);
        }else{
            res.redirect(currentPage);
        }
    });
});

//  delete an active todo and add to completed todos list
app.post("/delete", (req, res)=>{
    const itemToSave = req.body.completedItem;
    const itemId = req.body.passedId;

    Item.findByIdAndDelete({_id: itemId}, function (err) {
        if (!err) {
            const newDoneItem = new DoneItems({item: itemToSave});
            newDoneItem.save();

            res.redirect("/");
        }
    });
});

// uncheck completed todo
app.post("/uncheck", (req, res)=>{
    const itemToUncheck = req.body.completedItem;
    const itemId = req.body.passedId;
    const currentPage = req.headers.referer;

    DoneItems.findByIdAndDelete({_id: itemId}, function (err) {
        if (!err) {
            const newTodo = new Item({item: itemToUncheck});
            newTodo.save();

            res.redirect(currentPage);
        }
        
    })
});

//  remove todo from list
app.post("/remove", (req, res)=>{
    const itemId = req.body.passedId;
    const listToQuery = req.body.listName;
    const currentPage = req.headers.referer;

    if (listToQuery === "doneList") {
        DoneItems.findByIdAndDelete({_id: itemId}, function (err) {
           if (!err) {
               res.redirect(currentPage);
           } 
        });
    } else {
        Item.findByIdAndDelete({_id: itemId}, function (err) {
            if (!err) {
                res.redirect(currentPage);
            }
        });
    }
});

// Server listening for connections on the specified ports  (heroku server and local)
app.listen(process.env.PORT || port, () =>{
    console.log("Server up and running on port "+port);
});