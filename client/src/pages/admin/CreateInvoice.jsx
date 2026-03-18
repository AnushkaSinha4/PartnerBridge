import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:5000/api/v1";

const CreateInvoice = () => {

  const token = localStorage.getItem("token");

  const [clients, setClients] = useState([]);

  const [form, setForm] = useState({
    invoiceNumber: "",
    clientName: "",
    date: "",
    dueDate: "",
    paymentTerms: "",
    notes: "",
    taxEnabled: false,
    taxType: "Intra-State",
    discountType: "Fixed",
    discountValue: 0,
    items: [{ description: "", amount: "" }]
  });

  /* FETCH CLIENTS */
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await axios.get(`${API}/invoice`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const invoices = res.data?.data?.invoices || [];
        const uniqueClients = [...new Set(invoices.map(i => i.clientName))];

        setClients(uniqueClients);
      } catch (err) {
        console.log("Client fetch error", err);
      }
    };

    fetchClients();
  }, []);

  /* HANDLE CHANGE */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ITEMS */
  const handleItemChange = (index, field, value) => {
    const updated = [...form.items];
    updated[index][field] = value;
    setForm({ ...form, items: updated });
  };

  const addItem = () => {
    setForm({
      ...form,
      items: [...form.items, { description: "", amount: "" }]
    });
  };

  /* CALCULATIONS */
  const subtotal = form.items.reduce(
    (acc, item) => acc + Number(item.amount || 0),
    0
  );

  let discount = form.discountType === "Fixed"
    ? Number(form.discountValue || 0)
    : (subtotal * Number(form.discountValue || 0)) / 100;

  const taxableAmount = subtotal - discount;
  const tax = form.taxEnabled ? (taxableAmount * 18) / 100 : 0;
  const total = taxableAmount + tax;

  /* ✅ FINAL SAVE FUNCTION */
  const saveInvoice = async () => {
    try {

      // 🔴 validation
      if (!form.clientName || !form.date || !form.dueDate) {
        alert("Please fill all required fields ❗");
        return;
      }

      const validItems = form.items
        .filter(item => item.description && item.amount)
        .map(item => ({
          name: item.description,
          price: Number(item.amount),
          quantity: 1
        }));

      if (validItems.length === 0) {
        alert("Please add at least one item ❗");
        return;
      }

      await axios.post(
        `${API}/invoice`,
        {
          invoiceNumber: form.invoiceNumber,
          clientName: form.clientName,
          issueDate: form.date,
          dueDate: form.dueDate,
          items: validItems,
          subtotal,
          discount,
          tax,
          totalAmount: total,
          paymentTerms: form.paymentTerms,
          notes: form.notes,
          taxEnabled: form.taxEnabled
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      alert("Invoice Saved ✅");

      // reset form
      setForm({
        invoiceNumber: "",
        clientName: "",
        date: "",
        dueDate: "",
        paymentTerms: "",
        notes: "",
        taxEnabled: false,
        taxType: "Intra-State",
        discountType: "Fixed",
        discountValue: 0,
        items: [{ description: "", amount: "" }]
      });

    } catch (err) {
      console.log("ERROR 👉", err.response?.data || err);
      alert("Error saving invoice ❌");
    }
  };

  return (

    <div className="p-8 max-w-4xl mx-auto bg-white shadow rounded-lg">

      <h2 className="text-2xl font-semibold mb-6">Create Invoice</h2>

      {/* Invoice Number */}
      <label className="block mb-1">Invoice Number</label>
      <input
        type="text"
        name="invoiceNumber"
        value={form.invoiceNumber}
        onChange={handleChange}
        className="border p-2 w-full mb-4"
        placeholder="Leave blank for auto generation"
      />

      {/* Client */}
      <label className="block mb-1">Client</label>
      <select
        name="clientName"
        value={form.clientName}
        onChange={handleChange}
        className="border p-2 w-full mb-4"
      >
        <option value="">Select Client</option>
        {clients.map((c, i) => (
          <option key={i}>{c}</option>
        ))}
      </select>

      {/* Dates */}
      <div className="flex gap-4 mb-4">
        <div className="flex-1">
          <label>Date</label>
          <input type="date" name="date" onChange={handleChange} className="border p-2 w-full" />
        </div>

        <div className="flex-1">
          <label>Due Date</label>
          <input type="date" name="dueDate" onChange={handleChange} className="border p-2 w-full" />
        </div>
      </div>

      {/* ITEMS */}
      <h3 className="mb-2 font-medium">Items</h3>

      {form.items.map((item, index) => (
        <div key={index} className="flex gap-2 mb-2">
          <input
            placeholder="Description"
            className="border p-2 flex-1"
            onChange={(e) =>
              handleItemChange(index, "description", e.target.value)
            }
          />
          <input
            type="number"
            placeholder="Amount"
            className="border p-2 w-32"
            onChange={(e) =>
              handleItemChange(index, "amount", e.target.value)
            }
          />
        </div>
      ))}

      <button onClick={addItem} className="text-blue-600 mb-4">
        + Add Item
      </button>

      {/* TAX + SUMMARY */}
      <div className="grid grid-cols-2 gap-6 bg-gray-50 p-4 rounded mb-4">

        <div>
          <h3 className="mb-2 font-medium">Tax & Discount</h3>

          <div className="flex items-center gap-2 mb-3">
            <input
              type="checkbox"
              checked={form.taxEnabled}
              onChange={(e) =>
                setForm({ ...form, taxEnabled: e.target.checked })
              }
            />
            Enable GST
          </div>

          <select
            value={form.taxType}
            onChange={(e) =>
              setForm({ ...form, taxType: e.target.value })
            }
            className="border p-2 w-full mb-2"
          >
            <option>Intra-State(CGST+SGST)</option>
            <option>Inter-State(IGST)</option>
          </select>

          <select
            value={form.discountType}
            onChange={(e) =>
              setForm({ ...form, discountType: e.target.value })
            }
            className="border p-2 w-full mb-2"
          >
            <option value="Fixed">Fixed Amount</option>
            <option value="Percentage">Percentage</option>
          </select>

          <input
            type="number"
            value={form.discountValue}
            onChange={(e) =>
              setForm({ ...form, discountValue: e.target.value })
            }
            className="border p-2 w-full"
            placeholder="Discount Value"
          />
        </div>

        <div className="bg-white p-4 rounded border">
          <h3 className="mb-2 font-medium">Summary</h3>

          <p>Subtotal: ₹{subtotal.toFixed(2)}</p>
          <p>Discount: -₹{discount.toFixed(2)}</p>
          <p>Tax: ₹{tax.toFixed(2)}</p>

          <hr className="my-2" />

          <p className="font-bold text-blue-600">
            Total: ₹{total.toFixed(2)}
          </p>
        </div>

      </div>

      {/* Payment */}
      <label>Payment Terms</label>
      <input
        name="paymentTerms"
        onChange={handleChange}
        className="border p-2 w-full mb-4"
      />

      {/* Notes */}
      <label>Notes</label>
      <textarea
        name="notes"
        onChange={handleChange}
        className="border p-2 w-full mb-4"
      />

      {/* SAVE BUTTON */}
      <button
        onClick={saveInvoice}
        className="bg-blue-600 text-white px-6 py-2 rounded"
      >
        Save Invoice
      </button>

    </div>
  );
};

export default CreateInvoice;