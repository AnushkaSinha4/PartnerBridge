import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

/* ================= CORS CONFIG ================= */

const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
    "http://localhost:5176"
];

app.use(
    cors({
        origin: function(origin, callback) {

            if (!origin) return callback(null, true);

            if (
                allowedOrigins.includes(origin) ||
                origin === process.env.FRONTEND_URL
            ) {
                return callback(null, true);
            }

            return callback(new Error("Not allowed by CORS"));
        },
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

/* ================= MIDDLEWARES ================= */

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(express.static("public"));
app.use(cookieParser());

/* ================= ROUTES ================= */

import authRoutes from "./routes/auth.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import projectRoutes from "./routes/project.routes.js";

import taskRoutes from "./routes/task.routes.js";
import userRoutes from "./routes/user.routes.js";
import employeeRoutes from "./routes/employee.routes.js";
import partnerRoutes from "./routes/partner.routes.js";

/* NEW INVOICE ROUTE */
import invoiceRoutes from "./routes/invoice.routes.js";

/* NEW LEAD ROUTE */
import leadRoutes from "./routes/lead.routes.js";

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/projects", projectRoutes);
app.use("/api/v1/tasks", taskRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/employee", employeeRoutes);
app.use("/api/v1/partners", partnerRoutes);

/* ⭐ INVOICE API */
app.use("/api/v1/invoice", invoiceRoutes);
/* ⭐ LEAD API */
app.use("/api/v1/leads", leadRoutes);

/* ================= HEALTH CHECK ================= */

app.get("/health", (req, res) => {
    res.status(200).json({
        status: "OK",
        message: "Partner Bridge API is running",
        timestamp: new Date().toISOString(),
    });
});

/* ================= 404 HANDLER ================= */

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.method} ${req.url} not found`,
    });
});

/* ================= ERROR HANDLER ================= */

app.use((err, req, res, next) => {

    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    console.error(`❌ Error: ${message}`, {
        stack: err.stack,
        path: req.path,
        method: req.method,
        body: req.body,
        query: req.query,
    });

    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
        errors: err.errors || [],
        ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });

});

export { app };