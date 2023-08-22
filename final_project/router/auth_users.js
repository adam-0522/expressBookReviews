const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    const isUserPresent = users.some(obj => Object.values(obj).includes(username));
    return isUserPresent;
      //return username && username.trim().length > 0;
    }

const authenticatedUser = (username,password)=>{ //returns boolean
    const user = users.find(u => u.username === username && u.password === password);
    return !!user;
  }

//only registered users can login
regd_users.post("/login", (req,res) => {
    const {username, password} = req.body;
  
    // check if username and password are provided
    if (!username || !password) {
      return res.status(400).json({message: "Please provide both username and password."});
    }
  
    // check if user is registered
    const user = users.find(u => u.username === username);
    if (!user) {
      return res.status(401).json({message: "Invalid credentials."});
    }
  
    // check if password is correct
    if (user.password !== password) {
      return res.status(401).json({message: "Invalid credentials."});
    }
  
    // generate JWT token
    const accessToken = jwt.sign({ username: user.username }, 'access');
  
    // save token in session
    req.session.accessToken = accessToken;
  
    // return success message with access token
    return res.json({message: "Login successful.", accessToken});
  });

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
