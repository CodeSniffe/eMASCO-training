const express = require("express");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");

const app = express();
const PORT = 3000;

const swaggerDocument = YAML.load("./swagger.yaml");

// Middleware
app.use(express.json());

// Serve Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
const userRoutes = require("./routes/users");
app.use("/api/users", userRoutes);
const authRoutes = require("./routes/auth");
app.use("/login", authRoutes);
const bookRoutes = require("./routes/books");
app.use("/api/books", bookRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`📚 Swagger docs at http://localhost:${PORT}/api-docs`);
});