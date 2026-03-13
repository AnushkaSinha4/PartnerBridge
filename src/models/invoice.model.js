import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  }
});

const invoiceSchema = new mongoose.Schema(
{
  invoiceNumber: {
    type: Number,
    required: true,
    unique: true
  },

  clientName: {
    type: String,
    required: true
  },

  issueDate: {
    type: Date,
    required: true
  },

  dueDate: {
    type: Date,
    required: true
  },

  status: {
    type: String,
    enum: ["draft", "sent", "paid"],
    default: "draft"
  },

  items: [itemSchema],

  totalAmount: {
    type: Number,
    required: true
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }

},
{ timestamps: true }
);

export const Invoice = mongoose.model("Invoice", invoiceSchema);