const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  const { username, password } = req.body

  if (!username || !password) res.status(404).json({ message: "Invalid request!" });
  if (!isValid(username)) res.status(404).json({ message: "Username not valid!" });

  users.push({
    username,
    password
  })

  //Write your code here
  return res.status(201).json({ message: "Successfully register" });
});

function getBooksWithPromise() {
  axios.get('http://localhost:5000/')
    .then(response => {
      return response.data
    })
    .catch(error => {
        console.error("Error fetching books:", error);
    });
}

function getBookWithPromise(isbn) {
  axios.get(`http://localhost:5000/isbn/${isbn}`)
    .then(response => {
      return response.data
    })
    .catch(error => {
        console.error("Error fetching books:", error);
    });
}

function getBookWithPromise(isbn) {
  axios.get(`http://localhost:5000/isbn/${isbn}`)
    .then(response => {
      return response.data
    })
    .catch(error => {
        console.error("Error fetching books:", error);
    });
}

function getBookByAuthorWithPromise(author) {
  axios.get(`http://localhost:5000/author/${author}`)
    .then(response => {
      return response.data
    })
    .catch(error => {
        console.error("Error fetching books:", error);
    });
}

function getBookByTitleWithPromise(title) {
  axios.get(`http://localhost:5000/title/${title}`)
    .then(response => {
      return response.data
    })
    .catch(error => {
        console.error("Error fetching books:", error);
    });
}


// Get the book list available in the shop
public_users.get('/', function (req, res) {
  const _books = JSON.stringify(books);
  return res.send(_books)
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn; // Get ISBN from request parameters
  const book = books[isbn]; // Retrieve book details

  if (book) {
    res.json(book); // Send book details as JSON response
  } else {
    res.status(404).json({ message: "Book not found" }); // Handle case where book is not found
  }
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const authorName = req.params.author; // Get author from request parameters
  const matchingBooks = Object.values(books).filter(book => book.author === authorName); // Filter books by author

  if (matchingBooks.length > 0) {
    res.json(matchingBooks); // Return matching books
  } else {
    res.status(404).json({ message: "No books found by this author" }); // Return error if no books found
  }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title; // Get title from request parameters
  const matchingBooks = Object.values(books).filter(book => book.title === title); // Filter books by author

  if (matchingBooks.length > 0) {
    res.json(matchingBooks); // Return matching books
  } else {
    res.status(404).json({ message: "No books found by this title" }); // Return error if no books found
  }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn; // Get ISBN from request parameters
  const book = books[isbn]; // Retrieve book details

  if (book) {
    res.json({ reviews: book["reviews"] }); // Send book details as JSON response
  } else {
    res.status(404).json({ message: "Book not found" }); // Handle case where book is not found
  }
});

module.exports.general = public_users;
