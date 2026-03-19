import { useState, useEffect } from "react";
const CreateInvoiceModal = ({ isOpen, onClose, onSave, existingInvoice }) => {
  const [items, setItems] = useState([{ description: "", amount: 0 }]);
  const [formData, setFormData] = useState({
    invoiceNumber: "",
    client: "",
    date: "",
    dueDate: "",
    paymentTerms: "",
    notes: ""
  });

  useEffect(() => {
    if (existingInvoice) {
      setFormData(existingInvoice);
      setItems(existingInvoice.items || []);
    }
  }, [existingInvoice]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const addItem = () => {
    setItems([...items, { description: "", amount: 0 }]);
  };

  const removeItem = (index) => {
    const updated = [...items];
    updated.splice(index, 1);
    setItems(updated);
  };

  const updateItem = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  const subtotal = items.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const tax = subtotal * 0.18;
  const total = subtotal + tax;

  const generateInvoiceNumber = () => {
    return "INV-" + Date.now();
  };

  const handleSubmit = () => {

    const invoiceData = {
      id: existingInvoice?.id || Date.now(),
      ...formData,
      invoiceNumber: formData.invoiceNumber || generateInvoiceNumber(),
      items,
      subtotal,
      tax,
      total,
      status: existingInvoice?.status || "draft"
    };

    onSave(invoiceData);
    onClose();
  };

  if (!isOpen) return null;

  return (

    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">

      <div className="bg-white w-[900px] max-h-[90vh] overflow-y-auto p-6 rounded-xl">

        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-bold">
            {existingInvoice ? "Edit Invoice" : "Create Invoice"}
          </h2>

          <button onClick={onClose} className="text-red-500">
            Close
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">

          <div>
            <label>Invoice Number</label>
            <input
              name="invoiceNumber"
              value={formData.invoiceNumber}
              onChange={handleChange}
              placeholder="Leave blank to auto-generate"
              className="border w-full p-2 rounded"
            />
          </div>

          <div>
            <label>Client</label>
            <input
              name="client"
              value={formData.client}
              onChange={handleChange}
              className="border w-full p-2 rounded"
            />
          </div>

          <div>
            <label>Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="border w-full p-2 rounded"
            />
          </div>

          <div>
            <label>Due Date</label>
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className="border w-full p-2 rounded"
            />
          </div>

        </div>

        <div className="mb-6">

          <div className="flex justify-between mb-2">
            <h3 className="font-semibold">Items</h3>

            <button
              onClick={addItem}
              className="bg-gray-100 px-3 py-1 rounded"
            >
              + Add Item
            </button>
          </div>

          {items.map((item, index) => (

            <div key={index} className="grid grid-cols-3 gap-3 mb-2">

              <input
                placeholder="Description"
                value={item.description}
                onChange={(e) =>
                  updateItem(index, "description", e.target.value)
                }
                className="border p-2 rounded"
              />

              <input
                type="number"
                value={item.amount}
                onChange={(e) =>
                  updateItem(index, "amount", e.target.value)
                }
                className="border p-2 rounded"
              />

              <button
                onClick={() => removeItem(index)}
                className="text-red-500"
              >
                Remove
              </button>

            </div>

          ))}

        </div>

        <div className="bg-gray-50 p-4 rounded mb-6">

          <p>Subtotal: ₹{subtotal.toFixed(2)}</p>
          <p>Tax (18%): ₹{tax.toFixed(2)}</p>

          <h3 className="text-lg font-bold">
            Total: ₹{total.toFixed(2)}
          </h3>

        </div>

        <div className="flex justify-end">

          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-5 py-2 rounded"
          >
            Save Invoice
          </button>

        </div>

      </div>

    </div>
  );
};

export default CreateInvoiceModal;