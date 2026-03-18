import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const API = "http://localhost:5000/api/v1/invoice";

const ViewInvoice = () => {

  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);
  const invoiceRef = useRef();

  const token = localStorage.getItem("token");

  // FETCH INVOICE
  const fetchInvoice = async () => {
    try {
      const res = await axios.get(
        `${API}/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setInvoice(res.data.data.invoice);

    } catch (err) {
      console.log(err);
      alert("Failed to load invoice");
    }
  };

  useEffect(() => {
    fetchInvoice();
  }, []);

  // ✅ DOWNLOAD PDF (BACKEND METHOD - BEST)
  const downloadPDF = async () => {

    try {

      const res = await axios.get(
        `${API}/${id}/pdf`,
        {
          responseType: "blob",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const url = window.URL.createObjectURL(new Blob([res.data]));

      const link = document.createElement("a");

      link.href = url;
      link.setAttribute("download", `invoice-${id}.pdf`);

      document.body.appendChild(link);

      link.click();

    } catch (err) {
      console.log(err);
      alert("PDF download failed");
    }

  };

  if (!invoice) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      {/* BUTTON */}
      <div className="flex justify-end mb-4">
        <button
          onClick={downloadPDF}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Download PDF
        </button>
      </div>

      {/* INVOICE UI */}
      <div
        ref={invoiceRef}
        className="bg-white p-8 rounded shadow max-w-3xl mx-auto"
      >

        {/* HEADER */}
        <div className="flex justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold"> Invoice</h1>
            <p className="text-gray-500">Partner Bridge</p>
          </div>

          <div className="text-right">
            <p><strong>Invoice #:</strong> {invoice.invoiceNumber}</p>
            <p><strong>Issue:</strong> {invoice.issueDate?.slice(0,10)}</p>
            <p><strong>Due:</strong> {invoice.dueDate?.slice(0,10)}</p>
          </div>
        </div>

        {/* CLIENT */}
        <div className="mb-6">
          <h2 className="font-semibold">Bill To:</h2>
          <p>{invoice.clientName}</p>
        </div>

        {/* TABLE */}
        <table className="w-full border">

          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 border">Item</th>
              <th className="p-2 border">Qty</th>
              <th className="p-2 border">Price</th>
              <th className="p-2 border">Total</th>
            </tr>
          </thead>

          <tbody>
            {invoice.items.map((item, i) => (
              <tr key={i}>
                <td className="p-2 border">{item.name}</td>
                <td className="p-2 border">{item.quantity}</td>
                <td className="p-2 border">₹{item.price}</td>
                <td className="p-2 border">
                  ₹{item.quantity * item.price}
                </td>
              </tr>
            ))}
          </tbody>

        </table>

        {/* TOTAL */}
        <div className="text-right mt-6">
          <h2 className="text-xl font-bold">
            Total: ₹{invoice.totalAmount}
          </h2>
        </div>

        {/* PRINT BUTTON */}
        <div className="text-right mt-6">
          <button
            onClick={() => window.print()}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Print
          </button>
        </div>

      </div>

    </div>
  );
};

export default ViewInvoice;