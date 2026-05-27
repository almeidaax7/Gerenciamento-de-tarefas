import express from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes";
import categoryRoutes from "./routes/categoryRoutes";
import projectRoutes from "./routes/projectRoutes";

dotenv.config();

const app = express();
app.use(express.json());

app.use("/users", userRoutes);
app.use("/categories", categoryRoutes);
app.use("/projects", projectRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;