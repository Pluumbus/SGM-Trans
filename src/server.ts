import express, { NextFunction, Request, Response } from "express";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import notificationRoutes from "./routes/notificationRoutes";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Notification API",
      version: "1.0.0",
      description: "API for sending and scheduling notifications",
    },
  },
  apis: ["./src/**/*.ts", "./dist/**/*.js"],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

app.use("/", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api", notificationRoutes);
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: "Internal Server Error" });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
