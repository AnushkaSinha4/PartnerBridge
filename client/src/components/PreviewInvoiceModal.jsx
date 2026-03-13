const PreviewInvoiceModal = ({ invoice, onClose }) => {

  if (!invoice) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">

      <div className="bg-white w-[700px] p-6 rounded-xl">

        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-bold">Invoice Preview</h2>

          <button onClick={onClose} className="text-red-500">
            Close
          </button>
        </div>

        <div className="space-y-2">

          <p><strong>Invoice Number:</strong> {invoice.invoiceNumber}</p>
          <p><strong>Client:</strong> {invoice.client}</p>
          <p><strong>Date:</strong> {invoice.date}</p>
          <p><strong>Due Date:</strong> {invoice.dueDate}</p>

          <h3 className="font-semibold mt-4">Items</h3>

          {invoice.items.map((item, i) => (
            <div key={i} className="flex justify-between border-b py-1">
              <span>{item.description}</span>
              <span>₹{item.amount}</span>
            </div>
          ))}

          <div className="mt-4">
            <p>Subtotal: ₹{invoice.subtotal}</p>
            <p>Tax: ₹{invoice.tax}</p>

            <h3 className="text-lg font-bold">
              Total: ₹{invoice.total}
            </h3>
          </div>

        </div>

      </div>

    </div>
  );
};

export default PreviewInvoiceModal;