const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = []; // {username, password}

const isValid = (username) => { //returns boolean
  if (users.find(it => it.username === username)) return false
  else return true
}

const authenticatedUser = (username, password) => { //returns boolean
  // write code to check if username and password match the one we have in records.
  const user = users.find(it => it.username === username);
  if (!user || user.password !== password) return false;
  else return true
}

// only registered users can login
regd_users.post("/login", (req, res) => {
  // Write your code here
  const { username, password } = req.body;

  if (!username || !password) res.status(400).json({ message: "Invalid request!" });
  if(!authenticatedUser(username, password)) res.status(404).json({ message: "User not found!" });

  // Generate JWT access token
  let accessToken = jwt.sign({
    username: username
  }, 'access', { expiresIn: 60 * 60 });

  // Store access token in session
  req.session.username = username;

  req.session.authorization = {
    accessToken
  }

  return res.status(200).json({ message: "User successfully logged in"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  // Write your code here
  const { isbn } = req.params
  const review = req.query.review;  // Extract review from query parameter
  const username = req.session.username;  // Get logged-in user

  const book = books[isbn];
  if (!book) return res.status(404).json({ message: "Book not found" });

   // If the book has no reviews, initialize the reviews object
   if (!books[isbn].reviews) {
      books[isbn].reviews = {};
  }

  // Add or update review
  books[isbn].reviews[username] = review;

  res.json({ message: "Review posted successfully", reviews: books[isbn].reviews });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  // Write your code here
  const { isbn } = req.params
  const review = req.query.review;  // Extract review from query parameter
  const username = req.session.username;  // Get logged-in user

  const book = books[isbn];
  if (!book) return res.status(404).json({ message: "Book not found" });

   // If the book has no reviews, initialize the reviews object
   if (!books[isbn].reviews) {
      books[isbn].reviews = {};
  }

  books[isbn].reviews[username] = {};

  res.json({ message: "Review deleted successfully", reviews: books[isbn].reviews });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
