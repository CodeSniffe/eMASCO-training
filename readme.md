# 🛠️ Express.js Backend Setup
This guide helps you set up a basic Express.js backend quickly and cleanly.

## Project Setup
1. Install Dependencies
```
npm install
```
2. Create Placeholder files
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
├── index.js
├── package-lock.json
├── package.json
└── readme.md
└── swagger.yaml
```
> Once the files are created, you should be have a structure should be like this

## Basic Server
1. Now copy the codes below and paste it inside **index.js**
```
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
  console.log(`Server is running on http://localhost:${PORT}`);
});

```

2. Once copied, run the command below in the terminal
```
npm run dev
```

3. Then these logs below should appear in the terminal
```
[nodemon] 3.1.10
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,cjs,json
[nodemon] starting `node index.js`
🚀 Server running at http://localhost:3000
```
4. Once clicked on the link you will see in the browser
```
Hello, Express!
```

## Setting Up Swagger with User API
1. 
