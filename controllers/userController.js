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
  const targetUser = users.find((u) => u.id === id);

  if (!targetUser) {
    return res.status(404).json({ error: "User not found" });
  }

  users = users.filter((u) => u.id !== id);
  res.status(200).json({ message: `${targetUser.name} has been successfully deleted.` });
};
