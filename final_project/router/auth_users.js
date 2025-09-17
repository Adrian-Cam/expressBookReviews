const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");

const regd_users = express.Router();

// Aquí se guardarán los usuarios registrados
let users = [];

// Función para verificar si el usuario ya existe
const isValid = (username) => {
  return users.some(user => user.username === username);
};

// Función para verificar credenciales de usuario
const authenticatedUser = (username, password) => {
  return users.some(user => user.username === username && user.password === password);
};

// =========================
// Tarea 6: Registrar nuevo usuario
// =========================
regd_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  // Verificar si mandaron usuario y contraseña
  if (!username || !password) {
    return res.status(400).json({ message: "Nombre de usuario y contraseña son requeridos" });
  }

  // Verificar si el usuario ya existe
  if (isValid(username)) {
    return res.status(409).json({ message: "El usuario ya existe" });
  }

  // Guardar nuevo usuario
  users.push({ username, password });
  return res.status(200).json({ message: "Usuario registrado con éxito" });
});

// =========================
// Tarea 7: Login (aún no implementado)
// =========================
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Nombre de usuario y contraseña son requeridos" });
  }

  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Usuario o contraseña incorrectos" });
  }

  // Crear token JWT
  const token = jwt.sign({ username: username }, "clave_secreta", { expiresIn: "1h" });

  return res.status(200).json({ message: "Login exitoso", token: token });
});


// =========================
// Tarea 8: Agregar reseña (aún no implementado)
// =========================
// Tarea 8: Agregar o modificar reseña de un libro
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review;   // la reseña viene por query string
    const username = req.user.username; // viene del middleware JWT

    // Validar que exista el libro
    if (!books[isbn]) {
        return res.status(404).json({ message: "Libro no encontrado" });
    }

    // Validar que se haya enviado una reseña
    if (!review) {
        return res.status(400).json({ message: "Debe proporcionar una reseña" });
    }

    // Agregar o modificar la reseña
    books[isbn].reviews[username] = review;

    return res.status(200).json({
        message: "Reseña agregada/modificada con éxito",
        reviews: books[isbn].reviews
    });
});

// Tarea 9: Eliminar reseña de un libro
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.user.username; // usuario tomado del token

  if (!isbn || !books[isbn]) {
    return res.status(404).json({ message: "Libro no encontrado" });
  }

  if (books[isbn].reviews && books[isbn].reviews[username]) {
    delete books[isbn].reviews[username]; // elimina la reseña del usuario
    return res.status(200).json({
      message: "Reseña eliminada con éxito",
      reviews: books[isbn].reviews
    });
  } else {
    return res.status(404).json({ message: "No hay reseña tuya para este libro" });
  }
});



module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
