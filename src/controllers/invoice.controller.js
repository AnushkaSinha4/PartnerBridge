import { Invoice } from "../models/invoice.model.js";
import { asyncHandler } from "../utils/asynchandler.js";
import { ApiResponse } from "../utils/apiresponse.js";
import { ApiError } from "../utils/apierror.js";
import PDFDocument from "pdfkit";
import { sendEmail } from "../utils/sendEmail.js";

/* CREATE INVOICE */

export const createInvoice = asyncHandler(async (req, res) => {

const {
invoiceNumber,
clientName,
issueDate,
dueDate,
items,
totalAmount
} = req.body;

if (!invoiceNumber || !clientName || !issueDate || !dueDate || !items) {
throw new ApiError(400, "All fields are required");
}

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

const invoices = await Invoice
.find()
.sort({ createdAt: -1 });

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
new ApiResponse(
200,
{ invoice: updatedInvoice },
"Invoice updated successfully"
)
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
/* DOWNLOAD INVOICE PDF */

export const downloadInvoicePdf = asyncHandler(async (req, res) => {

  const { id } = req.params;

  const invoice = await Invoice.findById(id);

  if (!invoice) {
    throw new ApiError(404, "Invoice not found");
  }

  const doc = new PDFDocument({ margin: 50 });

  res.setHeader(
    "Content-Disposition",
    `attachment; filename=invoice-${invoice.invoiceNumber}.pdf`
  );

  res.setHeader("Content-Type", "application/pdf");

  doc.pipe(res);

  doc.fontSize(20).text("Invoice", { align: "center" });

  doc.moveDown();

  doc.fontSize(12).text(`Invoice Number: ${invoice.invoiceNumber}`);
  doc.text(`Client Name: ${invoice.clientName}`);
  doc.text(`Issue Date: ${invoice.issueDate.toDateString()}`);
  doc.text(`Due Date: ${invoice.dueDate.toDateString()}`);

  doc.moveDown();

  doc.fontSize(14).text("Items");

  invoice.items.forEach((item) => {

    doc
      .fontSize(12)
      .text(
        `${item.name}  |  Qty: ${item.quantity}  |  Price: ₹${item.price}`
      );

  });

  doc.moveDown();

  doc.fontSize(16).text(`Total: ₹${invoice.totalAmount}`, {
    align: "right"
  });

  doc.end();

});
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