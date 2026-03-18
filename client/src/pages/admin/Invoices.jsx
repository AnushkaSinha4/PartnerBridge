import { useEffect, useState } from "react";
import axios from "axios";
import {
  Eye,
  Pencil,
  Download,
  Trash2,
  Mail,
  Clock
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const API = "http://localhost:5000/api/v1/invoice";

const Tooltip = ({ text, children }) => (
  <div className="relative group flex items-center">
    {children}
    <span className="absolute -top-7 left-1/2 -translate-x-1/2
    bg-black text-white text-xs px-2 py-1 rounded
    opacity-0 group-hover:opacity-100 transition">
      {text}
    </span>
  </div>
);

const Invoices = () => {

  const navigate = useNavigate();

  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState(null);

  const token = localStorage.getItem("token");

  /* FETCH */
  const fetchInvoices = async () => {
    try {
      const res = await axios.get(API, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setInvoices(res.data?.data?.invoices || []);
    } catch (err) {
      console.error("Fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  /* DELETE */
  const deleteInvoice = async (id) => {
    if (!window.confirm("Delete invoice?")) return;

    try {
      await axios.delete(`${API}/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      fetchInvoices();
    } catch (err) {
      console.error("Delete error", err);
    }
  };

  /* ACTIONS */

  const previewInvoice = (invoice) => {
    navigate(`/admin/invoices/${invoice._id}`);
  };

  const editInvoice = (invoice) => {
    navigate(`/admin/invoices/edit/${invoice._id}`);
  };

  /* ✅ FIXED PDF DOWNLOAD */
  const downloadInvoice = async (invoice) => {
    try {
      setDownloadingId(invoice._id);

      const res = await axios.get(
        `${API}/${invoice._id}/pdf`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob"
        }
      );

      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `Invoice-${invoice.invoiceNumber}.pdf`;

      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);

    } catch (err) {
      console.error("PDF error", err);
      alert("PDF download failed");
    } finally {
      setDownloadingId(null);
    }
  };

  const emailInvoice = async (invoice) => {
    const email = prompt("Enter client email");
    if (!email) return;

    try {
      await axios.post(
        `${API}/${invoice._id}/email`,
        { email },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Email sent");
    } catch (err) {
      console.error(err);
      alert("Email failed");
    }
  };

  const reminderInvoice = async (invoice) => {
    const email = prompt("Enter client email");
    if (!email) return;

    try {
      await axios.post(
        `${API}/${invoice._id}/reminder`,
        { email },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Reminder sent");
    } catch (err) {
      console.error(err);
      alert("Reminder failed");
    }
  };

  if (loading) {
    return <div className="p-6">Loading invoices...</div>;
  }

  return (
    <div className="p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Invoices</h1>

        <button
          onClick={() => navigate("/admin/create-invoice")}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          + Create Invoice
        </button>
      </div>

      {/* LIST */}
      <div className="space-y-4">

        {invoices.map((invoice) => (

          <div
            key={invoice._id}
            className="bg-white border rounded-lg p-4 flex justify-between items-center"
          >

            <div>
              <h2 className="font-bold">
                #{invoice.invoiceNumber}
              </h2>

              <p className="text-sm text-gray-500">
                {invoice.clientName}
              </p>

              <p className="text-xs text-gray-400">
                Issued {invoice.date?.slice(0, 10)}
              </p>
            </div>

            <div className="flex items-center gap-4">

              <p className="font-bold text-blue-600">
                ₹{invoice.totalAmount || 0}
              </p>

              <Tooltip text="Preview Invoice">
                <Eye size={18} className="cursor-pointer"
                  onClick={() => previewInvoice(invoice)} />
              </Tooltip>

              <Tooltip text="Edit Invoice">
                <Pencil size={18} className="cursor-pointer"
                  onClick={() => editInvoice(invoice)} />
              </Tooltip>

              <Tooltip text="Download PDF">
                <Download
                  size={18}
                  className={`cursor-pointer ${downloadingId === invoice._id ? "opacity-50" : ""}`}
                  onClick={() => downloadInvoice(invoice)}
                />
              </Tooltip>

              <Tooltip text="Email Client">
                <Mail size={18} className="cursor-pointer"
                  onClick={() => emailInvoice(invoice)} />
              </Tooltip>

              <Tooltip text="Send Reminder">
                <Clock size={18} className="cursor-pointer"
                  onClick={() => reminderInvoice(invoice)} />
              </Tooltip>

              <Tooltip text="Delete Invoice">
                <Trash2 size={18} className="cursor-pointer text-red-500"
                  onClick={() => deleteInvoice(invoice._id)} />
              </Tooltip>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
};

export default Invoices;