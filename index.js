const express = require("express");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");

const userRoutes = require("./routes/users");
const bookRoutes = require("./routes/books");
const authRoutes = require("./routes/auth");

const app = express();
const PORT = 3000;

const swaggerDocument = YAML.load("./swagger.yaml");

// Middleware
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/books", bookRoutes);
app.use("/login", authRoutes);

// Serve Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`📚 Swagger docs at http://localhost:${PORT}/api-docs`);
});
