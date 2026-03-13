import { useState } from "react";
import CreateInvoiceModal from "../../components/CreateInvoiceModal";
import PreviewInvoiceModal from "../../components/PreviewInvoiceModal";
import { generateInvoicePDF } from "../../utils/generateInvoicePDF";

const InvoicesPage = () => {

  const [showModal, setShowModal] = useState(false);
  const [invoices, setInvoices] = useState([]);
  const [previewInvoice, setPreviewInvoice] = useState(null);
  const [editingInvoice, setEditingInvoice] = useState(null);

  const handleSaveInvoice = (invoice) => {
    setInvoices([...invoices, invoice]);
  };

  const handleUpdateInvoice = (updatedInvoice) => {

    const updated = invoices.map((inv) =>
      inv.id === updatedInvoice.id ? updatedInvoice : inv
    );

    setInvoices(updated);
    setEditingInvoice(null);
  };

  const handleDelete = (id) => {
    const updated = invoices.filter((inv) => inv.id !== id);
    setInvoices(updated);
  };

  const handleStatusChange = (id, status) => {

    const updated = invoices.map((inv) =>
      inv.id === id ? { ...inv, status } : inv
    );

    setInvoices(updated);
  };

  const handleSendEmail = (invoice) => {
    alert(`Invoice sent to ${invoice.client}`);
  };

  const statusColors = {
    draft: "bg-gray-200",
    sent: "bg-blue-200",
    paid: "bg-green-200",
    overdue: "bg-red-200",
    cancelled: "bg-gray-400"
  };

  return (
    <div className="p-6">

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Invoices</h1>

        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          + Create Invoice
        </button>
      </div>

      <div className="space-y-4">

        {invoices.length === 0 && (
          <p className="text-gray-500">No invoices created yet</p>
        )}

        {invoices.map((invoice) => (

          <div
            key={invoice.id}
            className="bg-white p-4 rounded-lg shadow flex justify-between items-center"
          >

            <div>

              <h3 className="font-semibold">
                {invoice.invoiceNumber}
              </h3>

              <p className="text-sm text-gray-500">
                Client: {invoice.client}
              </p>

              <p className="text-sm text-gray-500">
                Total: ₹{invoice.total}
              </p>

              <span className={`px-2 py-1 rounded text-xs ${statusColors[invoice.status]}`}>
                {invoice.status}
              </span>

            </div>

            <div className="flex gap-2 items-center">

              <select
                value={invoice.status}
                onChange={(e) =>
                  handleStatusChange(invoice.id, e.target.value)
                }
                className="border px-2 py-1 rounded"
              >
                <option value="draft">Draft</option>
                <option value="sent">Sent</option>
                <option value="paid">Paid</option>
                <option value="overdue">Overdue</option>
                <option value="cancelled">Cancelled</option>
              </select>

              <button
                onClick={() => setPreviewInvoice(invoice)}
                className="bg-gray-200 px-3 py-1 rounded"
              >
                Preview
              </button>

              <button
                onClick={() => setEditingInvoice(invoice)}
                className="bg-yellow-400 px-3 py-1 rounded"
              >
                Edit
              </button>

              <button
                onClick={() => generateInvoicePDF(invoice)}
                className="bg-green-500 text-white px-3 py-1 rounded"
              >
                PDF
              </button>

              <button
                onClick={() => handleSendEmail(invoice)}
                className="bg-blue-500 text-white px-3 py-1 rounded"
              >
                Email
              </button>

              <button
                onClick={() => handleDelete(invoice.id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Delete
              </button>

            </div>

          </div>

        ))}

      </div>

      <CreateInvoiceModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSaveInvoice}
      />

      <CreateInvoiceModal
        isOpen={editingInvoice}
        onClose={() => setEditingInvoice(null)}
        onSave={handleUpdateInvoice}
        existingInvoice={editingInvoice}
      />

      <PreviewInvoiceModal
        invoice={previewInvoice}
        onClose={() => setPreviewInvoice(null)}
      />

    </div>
  );
};

export default InvoicesPage;