const axios = require('axios');
const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});


public_users.get('/', function (req, res) {
    return res.status(200).send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;   // obtenemos el ISBN
    const book = books[isbn];       // buscamos en la "base de datos"

    if (book) {
        return res.status(200).json(book);
    } else {
        return res.status(404).json({ message: "Libro no encontrado" });
    }
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author.toLowerCase();  // autor desde la URL (en minúsculas para comparar)
  let results = [];

  // recorremos todos los libros
  Object.keys(books).forEach((isbn) => {
    if (books[isbn].author.toLowerCase() === author) {
      results.push(books[isbn]);
    }
  });

  if (results.length > 0) {
    return res.status(200).json(results);
  } else {
    return res.status(404).json({ message: "No se encontraron libros de ese autor" });
  }
});

public_users.get('/title/:title', function (req, res) {
  const title = req.params.title.toLowerCase();  // título desde la URL
  let results = [];

  // recorremos todos los libros
  Object.keys(books).forEach((isbn) => {
    if (books[isbn].title.toLowerCase() === title) {
      results.push(books[isbn]);
    }
  });

  if (results.length > 0) {
    return res.status(200).json(results);
  } else {
    return res.status(404).json({ message: "No se encontraron libros con ese título" });
  }
});

public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;  // ISBN desde la URL
  const book = books[isbn];      // buscamos el libro

  if (book) {
    return res.status(200).json(book.reviews);
  } else {
    return res.status(404).json({ message: "Libro no encontrado" });
  }
});

// Tarea 10: Obtener todos los libros usando async/await con Axios
public_users.get("/async/books", async (req, res) => {
  try {
    
    const response = await axios.get("http://localhost:5000/");
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: "Error obteniendo libros", error: error.message });
  }
});

// Tarea 11: Obtener detalles de un libro por ISBN usando async/await con Axios
public_users.get("/async/isbn/:isbn", async (req, res) => {
  const isbn = req.params.isbn;
  try {
    
    const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: "Error obteniendo libro por ISBN", error: error.message });
  }
});

// Tarea 12: Obtener detalles de libros por autor usando async/await con Axios
public_users.get("/async/author/:author", async (req, res) => {
  const author = req.params.author;
  try {
    
    const response = await axios.get(`http://localhost:5000/author/${author}`);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: "Error obteniendo libros por autor", error: error.message });
  }
});




module.exports.general = public_users;
