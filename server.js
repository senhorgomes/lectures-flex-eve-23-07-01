const express = require('express');
const morgan = require('morgan');
const methodOverride = require('method-override');
const app = express();
// const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const PORT = 3000;


app.set("view engine", "ejs");
// Middleware
// app.use(bodyParser.urlencoded({extended:true}));
app.use(express.urlencoded({extended:true}));
app.use(morgan('dev'));
// app.use(cookieParser());
app.use(cookieSession({
    name: "user_id",
    keys: ["supersecretKey", "anotherSuperSecretKet","df1718d9-9064-436d-bf71-f52fc9b7ee48"],
    maxAge: 30 * 1000 //Cookie will expire in 24 hours
}))
// Get information we use => GET
// Create information we use => POST
// Delete information we use => DELETE
// Update replace all of the information we use => PUT
// Update a part of the informaiton => PATCH

app.use(methodOverride('_method'))
const userDatabase = {
    abc: {
        id: "abc",
        email: "pikachu@pokemon.com",
        password: bcrypt.hashSync("pikapika",saltRounds)
    },
    def:{
        id: "def",
        email: "zinetsu@demonslayer.com",
        password: bcrypt.hashSync("thunderbreathing",saltRounds)
    },
    ghi: {
        id: "ghi",
        email: "pinkpanther@pinkpanther.com",
        password: bcrypt.hashSync("ilovepink",saltRounds)
    },
    jkl:{
        id: "jkl",
        email: "caduceusclay@criticalrole.com",
        password: bcrypt.hashSync("helpitsagain",saltRounds)
    }
}

app.get("/", (req, res) => {
    // res.send("Hello!")
    // const cookieID = req.cookies.user_id
    const cookieID = req.session.user_id
    let templateVars = {}
    // if the user is logged in, set the templateVars to the user object
    if(userDatabase[cookieID]){
        templateVars.user = userDatabase[cookieID];
    // Else, set the user object to null to trigger else statement in index.ejs
    } else {
        templateVars.user = null
    }
    console.log(cookieID)
    res.render("index", templateVars);
});

// Login route
app.get("/login", (req, res) => {
    res.render("login");
})

// Login post route
// app.post("/put", (req, res) => {
app.post("/login", (req, res) => {
    console.log(req.body)
    const inputtedEmail = req.body.email;
    const inputtedPassword = req.body.password;
    for(let id in userDatabase){
        if(userDatabase[id].email === inputtedEmail){
            // if(userDatabase[id].password === inputtedPassword)
            if(bcrypt.compareSync(inputtedPassword, userDatabase[id].password)){
                console.log("success", userDatabase[id])
                // After a user logs in, set their id as a cookie
                // res.cookie("user_id", userDatabase[id].id)
                req.session.user_id = userDatabase[id].id;
                res.redirect("/")
                return;
            }
        }
    }
    res.status(404).send("You have entered an incorrect email and/or password");
})
// Logout route
app.post("/logout", (req, res) => {
    // res.clearCookie("user_id");
    req.session = null;
    res.redirect("/")
})
app.listen(PORT, ()=>{
    console.log("Your server is running! YAY!")
});