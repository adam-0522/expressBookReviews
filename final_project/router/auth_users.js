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
    const username = req.body.username;
    const password = req.body.password;
  
    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }
  
    if (authenticatedUser(username,password)) {
      let accessToken = jwt.sign({
        data: password
      }, 'access', { expiresIn: 120 * 60 });
  
      req.session.authorization = {
        accessToken,username
    }
    return res.status(200).send("User successfully logged in");
    } else {
      return res.status(208).json({message: "Invalid Login. Check username and password"});
    }
  });

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const username = req.session.username;
    const isbn = req.params.isbn;
    const review = req.query.review;
    console.log(username);
    if (!review) {
      return res.status(400).json({message: "Please provide a review"});
    }
    if (!books[isbn]) {
      return res.status(404).json({message: "Book not found"});
    }
    if (!books[isbn].reviews) {
      books[isbn].reviews = {};
    }
    if (books[isbn].reviews[username]) {
      books[isbn].reviews[username] = review;
      return res.json({message: "Review modified successfully"});
    }
    books[isbn].reviews[username] = review;
    return res.json({message: "Review added successfully"});
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.username;
    //const user = req.body.username;
    console.log(isbn);
    console.log(username)
  
    // if (!username) {
    //   return res.status(401).json({message: "Unauthorized"});
    // }
  
    // if (!isValid(username)) {
    //   return res.status(401).json({message: "Invalid username"});
    // }
  
    // if (!books[isbn]) {
    //   return res.status(400).json({message: "Invalid ISBN"});
    // }
  
    // if (!books[isbn].reviews[username]) {
    //   return res.status(400).json({message: "Review not found for the given ISBN and username"});
    // }
  
    delete books[isbn].reviews[username];
    return res.status(200).json({message: "Review deleted successfully"});
});
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
