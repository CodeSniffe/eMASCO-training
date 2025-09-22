# 🚀 Express.js Backend Setup Guide

Welcome! 👋  
This guide walks you step-by-step to set up a **basic Express.js backend** with authentication, users, books, and Swagger API docs.

---

## 🛠️ Project Setup

1. Install dependencies:

```bash
npm install
```

2. Create placeholder files & folders so your project looks like this:

```
├── controllers
│   └── authController.js
│   └── bookController.js
│   └── userController.js
├── middleware
│   └── auth.js
├── node_modules
├── routes
│   └── auth.js
│   └── books.js
│   └── users.js
├── .gitignore
├── index.js
├── package-lock.json
├── package.json
└── readme.md
└── swagger.yaml
```

👉 Once you see the `node_modules` folder created, you’re ready to roll.

---

## 🌍 Basic Server

1. Open **index.js** and paste this code:

```js
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('Hello, Express!');
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
```

2. Start your server with:

```bash
npm run dev
```

3. If successful, you’ll see logs like this:

```
[nodemon] 3.1.10
[nodemon] starting `node index.js`
🚀 Server running at http://localhost:3000
```

4. Open [http://localhost:3000](http://localhost:3000) → you should see:

```
Hello, Express!
```

🎉 Congrats! Your Express server is alive.

---

## 📚 Setting Up Swagger

Swagger gives you a nice UI to **test APIs directly from the browser**.

1. Install dependencies:

```bash
npm install swagger-ui-express yamljs
```

2. Update **index.js**:

```js
const express = require("express");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");

const app = express();
const PORT = 3000;

const swaggerDocument = YAML.load("./swagger.yaml");

// Middleware
app.use(express.json());

// Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`📚 Swagger docs at http://localhost:${PORT}/api-docs`);
});
```

3. Run again:

```bash
npm run dev
```

4. Visit [http://localhost:3000/api-docs](http://localhost:3000/api-docs) → you’ll see an **empty Swagger UI** (we’ll add routes next).

---

## 👤 User Routes

1. Create **routes/users.js**:

```js
const express = require('express');
const router = express.Router();
const {
  getUsers,
  getUserById,
  createUser,
  deleteUser
} = require('../controllers/userController');

router.get('/', getUsers);
router.get('/:id', getUserById);
router.post('/', createUser);
router.delete('/:id', deleteUser);

module.exports = router;
```

2. Create **controllers/userController.js** with mock DB:

```js
// Mock DB
let users = [
  {
    id: 1,
    name: "Alice",
    email: "alice@example.com",
    role: "admin",
    isActive: true,
    hobbies: ["reading", "hiking"],
    address: {
      street: "123 Main St",
      city: "Springfield",
      zip: "12345",
    },
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    name: "Bob",
    email: "bob@example.com",
    role: "user",
    isActive: false,
    hobbies: ["gaming", "traveling"],
    address: {
      street: "456 Elm St",
      city: "Shelbyville",
      zip: "67890",
    },
    createdAt: new Date().toISOString(),
  },
];

exports.getUsers = (req, res) => {
  const { limit } = req.query;
  const result = limit ? users.slice(0, Number(limit)) : users;
  res.json(result);
};

exports.getUserById = (req, res) => {
  const id = Number(req.params.id);
  const user = users.find((u) => u.id === id);
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json(user);
};

exports.createUser = (req, res) => {
  const { name, email, role, isActive, hobbies, address } = req.body;
  if (!name || !email || !role) {
    return res
      .status(400)
      .json({ error: "name, email, and role are required" });
  }

  const newUser = {
    id: Date.now(),
    name,
    email,
    role,
    isActive: isActive ?? true,
    hobbies: hobbies || [],
    address: address || {},
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  res.status(201).json(newUser);
};

exports.deleteUser = (req, res) => {
  const id = Number(req.params.id);
  users = users.filter((u) => u.id !== id);
  res.status(204).send();
};
```

3. Hook into **index.js**:

```js
const userRoutes = require("./routes/users");
app.use("/api/users", userRoutes);
```

4. Add Swagger schema in **swagger.yaml** (see full file at the end).

Now you can test **Users API** directly from Swagger 🎉

---

## 🔐 Authentication Setup

We’ll use **JWT tokens** for secure APIs.

### Step 1: Middleware

Create **middleware/auth.js**:

```js
const jwt = require("jsonwebtoken");

const SECRET_KEY = "wasd666()*8^";

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) return res.status(401).json({ message: "Access token missing" });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err)
      return res.status(403).json({ message: "Invalid or expired token" });

    req.user = user;
    next();
  });
};

module.exports = authenticateToken;
```

### Step 2: Auth Controller

Create **controllers/authController.js**:

```js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const SECRET_KEY = 'wasd666()*8^';

const mockUser = {
  id: 'user1',
  username: 'admin',
  passwordHash: bcrypt.hashSync('password123', 10), // Pre-hashed password
};

exports.login = (req, res) => {
  const { username, password } = req.body;

  if (username !== mockUser.username || !bcrypt.compareSync(password, mockUser.passwordHash)) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }

  const token = jwt.sign({ id: mockUser.id, username: mockUser.username }, SECRET_KEY, {
    expiresIn: '1h',
  });

  res.json({ token });
};
```

### Step 3: Auth Route

Create **routes/auth.js**:

```js
const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');

router.post('/', AuthController.login);

module.exports = router;
```

Hook it into **index.js**:

```js
const authRoutes = require("./routes/auth");
app.use("/login", authRoutes);
```

Now you can log in with:

```
POST /login
{
  "username": "admin",
  "password": "password123"
}
```

It returns a **JWT token** you’ll use for books.

---

## 📚 Books API (Protected)

1. Create **controllers/bookController.js**:

```js
const books = [
  { id: "12345", title: "The Great Gatsby", author: "F. Scott Fitzgerald", publishedYear: 1925 },
  { id: "67890", title: "1984", author: "George Orwell", publishedYear: 1949 },
];

exports.getBookById = (req, res) => {
  const bookId = req.params.id;
  const book = books.find((b) => b.id === bookId);
  if (!book) return res.status(404).json({ message: "Book not found" });
  res.json(book);
};

exports.listBooks = (req, res) => {
  res.json(books);
};

exports.addBook = (req, res) => {
  const { title, author, publishedYear } = req.body;
  if (!title || !author || !publishedYear) {
    return res.status(400).json({ error: "Title, author and published year are required" });
  }
  const newBook = {
    id: Math.random().toString(),
    title,
    author,
    publishedYear,
  };
  books.push(newBook);
  res.status(201).json(newBook);
};
```

2. Create **routes/books.js**:

```js
const express = require("express");
const router = express.Router();

const BookController = require("../controllers/bookController");
const token = require("../middleware/auth");

router.get("/:id", token, BookController.getBookById);
router.post("/", token, BookController.addBook);
router.get("/", token, BookController.listBooks);

module.exports = router;
```

3. Hook it into **index.js**:

```js
const bookRoutes = require("./routes/books");
app.use("/api/books", bookRoutes);
```

✅ Books API is now protected — you must log in and use your JWT token.

---

## 📘 Swagger Docs

Update **swagger.yaml** with full schemas (see the provided complete version in original guide).  
It covers:

- 🔑 `/login` → authentication
- 👤 `/api/users` → user CRUD
- 📚 `/api/books` → book CRUD (JWT required)

Then restart your server:

```bash
npm run dev
```

---

## 🎯 Final Step

1. Login: `POST /login` with `{ "username": "admin", "password": "password123" }`  
2. Copy the returned JWT token.  
3. Go to Swagger → Authorize → paste the token as `Bearer <your_token>`  
4. Try out Books API!

🎉 You now have a fully working Express backend with Swagger docs.

---
