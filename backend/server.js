import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";

const app = express();
const port = process.env.PORT || 4000;

// Trust proxy when behind a platform load balancer (Render/Vercel)
app.set("trust proxy", 1);

// CORS config - allow your Vercel front-end and localhost for dev
const allowedOrigins = [
  "https://ecommerce-three-gray-53.vercel.app",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "https://ecommerce-5dzc.onrender.com",
  "https://ecommerce-h792.vercel.app",
  "http://localhost:5174",
  "http://localhost:5173"
];

const corsOptions = {
  origin: function (origin, callback) {
    // allow requests with no origin (like curl, Postman, mobile apps, or server-to-server)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    } else {
      return callback(new Error("CORS origin not allowed"), false);
    }
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Token"],
  credentials: true,
  optionsSuccessStatus: 204
};

// Apply CORS before routes; explicitly handle preflight
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(express.json());

// API endpoints
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

app.get("/", (req, res) => {
  res.send("API working");
});

// Start only after DB and Cloudinary connect
async function startServer() {
  try {
    await connectDB();           // ensure these throw on failure so we don't start the server
    await connectCloudinary();

    const server = app.listen(port, () => {
      console.log(`Server started on PORT: ${port}`);
    });

    // Graceful shutdown for platform signals
    process.on("SIGTERM", () => {
      console.info("SIGTERM received: closing HTTP server");
      server.close(() => {
        console.log("HTTP server closed");
        process.exit(0);
      });
    });

  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1); // ensure the host notices the failure (so you see logs)
  }
}

startServer();

// Global process-level error logging
process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection at:", reason);
});
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception thrown:", err);
  process.exit(1);
});

export default app;
