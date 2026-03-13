import express from "express";

import {
  createInvoice,
  getAllInvoices,
  getInvoiceById,
  updateInvoice,
  deleteInvoice,
  downloadInvoicePdf,
  emailInvoice,
  sendReminder
} from "../controllers/invoice.controller.js";

import { verifyJWT } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/rbac.middleware.js";

const router = express.Router();

/* AUTH */
router.use(verifyJWT);

/* GET ALL INVOICES */
router.get("/", authorize("admin", "super_admin"), getAllInvoices);

/* GET SINGLE INVOICE */
router.get("/:id", authorize("admin", "super_admin"), getInvoiceById);

/* CREATE INVOICE */
router.post("/", authorize("admin", "super_admin"), createInvoice);

/* UPDATE INVOICE */
router.patch("/:id", authorize("admin", "super_admin"), updateInvoice);

/* DELETE INVOICE */
router.delete("/:id", authorize("admin", "super_admin"), deleteInvoice);

/* DOWNLOAD PDF */
router.get("/:id/pdf", authorize("admin", "super_admin"), downloadInvoicePdf);

/* EMAIL CLIENT */
router.post("/:id/email", authorize("admin", "super_admin"), emailInvoice);

/* SEND REMINDER */
router.post("/:id/reminder", authorize("admin", "super_admin"), sendReminder);

export default router;