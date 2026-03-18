import { Invoice } from "../models/invoice.model.js";
import { asyncHandler } from "../utils/asynchandler.js";
import { ApiResponse } from "../utils/apiresponse.js";
import { ApiError } from "../utils/apierror.js";
import PDFDocument from "pdfkit";
import { sendEmail } from "../utils/sendEmail.js";

/* CREATE INVOICE */

export const createInvoice = asyncHandler(async (req, res) => {

  let {
    invoiceNumber,
    clientName,
    issueDate,
    dueDate,
    items,
    totalAmount
  } = req.body;

  if (!clientName || !issueDate || !dueDate || !items || items.length === 0) {
    throw new ApiError(400, "All fields are required except invoice number");
  }

  // AUTO GENERATE (SAFE VERSION)
  if (!invoiceNumber || invoiceNumber.trim() === "") {

    const lastInvoice = await Invoice.findOne().sort({ createdAt: -1 });

    let nextNumber = 1;

    if (lastInvoice && lastInvoice.invoiceNumber) {

      let lastNum;

      //  HANDLE BOTH CASES
      if (typeof lastInvoice.invoiceNumber === "string") {
        lastNum = parseInt(lastInvoice.invoiceNumber.replace("INV-", ""));
      } else {
        lastNum = lastInvoice.invoiceNumber;
      }

      nextNumber = lastNum + 1;
    }

    invoiceNumber = `INV-${String(nextNumber).padStart(3, "0")}`;
  }

  // duplicate check
  const existingInvoice = await Invoice.findOne({ invoiceNumber });

  if (existingInvoice) {
    throw new ApiError(400, "Invoice number already exists");
  }

  const invoice = await Invoice.create({
    invoiceNumber,
    clientName,
    issueDate,
    dueDate,
    items,
    totalAmount,
    createdBy: req.user._id
  });

  return res.status(201).json(
    new ApiResponse(201, { invoice }, "Invoice created successfully")
  );
});
 

  
   

  
    

/* GET ALL INVOICES */
export const getAllInvoices = asyncHandler(async (req, res) => {

  const invoices = await Invoice.find().sort({ createdAt: -1 });

  return res.status(200).json(
    new ApiResponse(200, { invoices }, "Invoices fetched successfully")
  );
});

/* GET SINGLE INVOICE */
export const getInvoiceById = asyncHandler(async (req, res) => {

  const { id } = req.params;

  const invoice = await Invoice.findById(id);

  if (!invoice) {
    throw new ApiError(404, "Invoice not found");
  }

  return res.status(200).json(
    new ApiResponse(200, { invoice }, "Invoice fetched successfully")
  );
});

/* UPDATE INVOICE */
export const updateInvoice = asyncHandler(async (req, res) => {

  const { id } = req.params;

  const invoice = await Invoice.findById(id);

  if (!invoice) {
    throw new ApiError(404, "Invoice not found");
  }

  const updatedInvoice = await Invoice.findByIdAndUpdate(
    id,
    req.body,
    { new: true, runValidators: true }
  );

  return res.status(200).json(
    new ApiResponse(200, { invoice: updatedInvoice }, "Invoice updated successfully")
  );
});

/* DELETE INVOICE */
export const deleteInvoice = asyncHandler(async (req, res) => {

  const { id } = req.params;

  const invoice = await Invoice.findById(id);

  if (!invoice) {
    throw new ApiError(404, "Invoice not found");
  }

  await invoice.deleteOne();

  return res.status(200).json(
    new ApiResponse(200, {}, "Invoice deleted successfully")
  );
});


/* ==================  DOWNLOAD PDF (UPDATED DESIGN) ================== */

export const downloadInvoicePdf = asyncHandler(async (req, res) => {

  const { id } = req.params;

  const invoice = await Invoice.findById(id);

  if (!invoice) {
    throw new ApiError(404, "Invoice not found");
  }

  const doc = new PDFDocument({ margin: 40 });

  res.setHeader(
    "Content-Disposition",
    `attachment; filename=invoice-${invoice.invoiceNumber}.pdf`
  );
  res.setHeader("Content-Type", "application/pdf");

  doc.pipe(res);

  /* HEADER */
  doc.fontSize(16).fillColor("black").text("Partner Bridge", 50, 40);
  doc.fontSize(26).fillColor("#4f46e5").text("INVOICE", 400, 40);

  /* BILL TO */
  doc.fillColor("#4f46e5").fontSize(10).text("BILL TO", 50, 110);
  doc.moveTo(50, 125).lineTo(250, 125).stroke("#4f46e5");

  doc.fillColor("black")
    .text(invoice.clientName, 50, 135);

  /* DETAILS */
  doc.fillColor("#4f46e5").text("INVOICE DETAILS", 320, 110);
  doc.moveTo(320, 125).lineTo(520, 125).stroke("#4f46e5");

  doc.fillColor("black")
    .text(`Invoice #: ${invoice.invoiceNumber}`, 320, 135)
    .text(`Date: ${new Date(invoice.issueDate).toLocaleDateString()}`, 320, 150)
    .text(`Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}`, 320, 165);

  /* ================= TABLE ================= */
  const tableTop = 220;

  doc.rect(50, tableTop, 500, 25).fill("#4f46e5");

  doc.fillColor("white")
    .text("ITEM DESCRIPTION", 60, tableTop + 7)
    .text("RATE", 350, tableTop + 7)
    .text("AMOUNT", 450, tableTop + 7);

  let y = tableTop + 35;

  invoice.items.forEach((item) => {

    const rate = Number(item.price || item.rate || item.amount);
    const amount = rate * (item.quantity || 1);

    doc.fillColor("black")
      .text(item.name || item.description, 60, y)
      .text(rate.toFixed(2), 350, y)
      .text(amount.toFixed(2), 450, y);

    y += 20;
  });

  /* ================= CALCULATION ================= */

  const subtotal = invoice.items.reduce((sum, item) => {
    const rate = Number(item.price || item.rate || item.amount);
    const qty = item.quantity || 1;
    return sum + (rate * qty);
  }, 0);

  const cgst = invoice.enableGST ? subtotal * 0.09 : 0;
  const sgst = invoice.enableGST ? subtotal * 0.09 : 0;

  const total = subtotal + cgst + sgst;

  let calcY = y + 20;

  // LEFT SIDE LABELS
  doc.fillColor("black")
    .text("Subtotal:", 300, calcY)
    .text("CGST:", 300, calcY + 20)
    .text("SGST:", 300, calcY + 40);

  // RIGHT SIDE VALUES
  doc.text(subtotal.toFixed(2), 450, calcY)
    .text(cgst.toFixed(2), 450, calcY + 20)
    .text(sgst.toFixed(2), 450, calcY + 40);

  /* TOTAL */
  doc.fillColor("#4f46e5")
    .text("Total:", 300, calcY + 70)
    .text(total.toFixed(2), 450, calcY + 70);

  /* TERMS */
  doc.rect(50, calcY + 110, 500, 60).fill("#f3f4f6");

  doc.fillColor("black")
    .text(
      "Payment should be completed on or before the due date.",
      60,
      calcY + 130
    );

  doc.end();
});


/* EMAIL */
export const emailInvoice = asyncHandler(async (req,res)=>{

  const { id } = req.params;

  const invoice = await Invoice.findById(id);

  if(!invoice){
    throw new ApiError(404,"Invoice not found");
  }

  await sendEmail(
    req.body.email,
    "Invoice from Company",
    `Your invoice #${invoice.invoiceNumber} is ready.
Total: ₹${invoice.totalAmount}`
  );

  res.status(200).json(
    new ApiResponse(200,{}, "Email sent")
  );

});


/* REMINDER */
export const sendReminder = asyncHandler(async (req,res)=>{

  const { id } = req.params;

  const invoice = await Invoice.findById(id);

  if(!invoice){
    throw new ApiError(404,"Invoice not found");
  }

  await sendEmail(
    req.body.email,
    "Invoice Reminder",
    `Reminder:
Invoice #${invoice.invoiceNumber} payment is pending.
Total: ₹${invoice.totalAmount}`
  );

  res.status(200).json(
    new ApiResponse(200,{}, "Reminder sent")
  );

});