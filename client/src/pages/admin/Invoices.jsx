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
{text} </span>

</div>
);

const Invoices = () => {

const navigate = useNavigate();

const [invoices, setInvoices] = useState([]);
const [loading, setLoading] = useState(true);
const [showModal, setShowModal] = useState(false);

const [form, setForm] = useState({
invoiceNumber: "",
clientName: "",
issueDate: "",
dueDate: "",
items: [{ name: "", quantity: 1, price: 0 }]
});

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

/* ADD ITEM */

const addItem = () => {

setForm({
...form,
items: [...form.items, { name: "", quantity: 1, price: 0 }]
});

};

/* HANDLE ITEM */

const handleItemChange = (index, field, value) => {

const updated = [...form.items];
updated[index][field] = value;

setForm({ ...form, items: updated });

};

/* TOTAL */

const total = form.items.reduce(
(sum, item) => sum + item.quantity * item.price,
0
);

/* CREATE */

const createInvoice = async () => {

try {

await axios.post(
API,
{
...form,
invoiceNumber: form.invoiceNumber,
totalAmount: total
},
{
headers: { Authorization: `Bearer ${token}` }
}
);

setShowModal(false);

setForm({
invoiceNumber: "",
clientName: "",
issueDate: "",
dueDate: "",
items: [{ name: "", quantity: 1, price: 0 }]
});

fetchInvoices();

} catch (err) {

console.error("Create error:", err.response?.data || err);

}

};

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

/* ICON ACTIONS */

const previewInvoice = (invoice) => {
navigate(`/admin/invoices/${invoice._id}`);
};

const editInvoice = (invoice) => {
navigate(`/admin/invoices/edit/${invoice._id}`);
};

const downloadInvoice = async (invoice) => {

  try {

    const res = await axios.get(
      `${API}/${invoice._id}/pdf`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        },
        responseType: "blob"
      }
    );

    const url = window.URL.createObjectURL(new Blob([res.data]));

    const link = document.createElement("a");

    link.href = url;
    link.setAttribute(
      "download",
      `invoice-${invoice.invoiceNumber}.pdf`
    );

    document.body.appendChild(link);

    link.click();

    link.remove();

  } catch (err) {

    console.error("PDF download error", err);

  }

};

const emailInvoice = (invoice) => {
alert(`Email sent to ${invoice.clientName}`);
};

const reminderInvoice = (invoice) => {
alert(`Reminder sent for invoice #${invoice.invoiceNumber}`);
};

if (loading) {
return <div className="p-6">Loading invoices...</div>;
}

return (

<div className="p-6">

<div className="flex justify-between items-center mb-6">

<h1 className="text-2xl font-semibold">Invoices</h1>

<button
onClick={() => setShowModal(true)}
className="bg-blue-600 text-white px-4 py-2 rounded-lg"

>

* Create Invoice

  </button>

</div>

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
Issued {invoice.issueDate?.slice(0, 10)}
</p>

</div>

<div className="flex items-center gap-4">

<p className="font-bold text-blue-600">
₹{invoice.totalAmount}
</p>

<Tooltip text="Preview Invoice">
<Eye
size={18}
className="cursor-pointer"
onClick={() => previewInvoice(invoice)}
/>
</Tooltip>

<Tooltip text="Edit Invoice">
<Pencil
size={18}
className="cursor-pointer"
onClick={() => editInvoice(invoice)}
/>
</Tooltip>

<Tooltip text="Download PDF">
<Download
size={18}
className="cursor-pointer"
onClick={() => downloadInvoice(invoice)}
/>
</Tooltip>

<Tooltip text="Email Client">
<Mail
size={18}
className="cursor-pointer"
onClick={() => emailInvoice(invoice)}
/>
</Tooltip>

<Tooltip text="Send Reminder">
<Clock
size={18}
className="cursor-pointer"
onClick={() => reminderInvoice(invoice)}
/>
</Tooltip>

<Tooltip text="Delete Invoice">
<Trash2
size={18}
className="cursor-pointer text-red-500"
onClick={() => deleteInvoice(invoice._id)}
/>
</Tooltip>

</div>

</div>

))}

</div>

{/* CREATE MODAL */}

{showModal && (

<div className="fixed inset-0 bg-black/40 flex items-center justify-center">

<div className="bg-white p-6 rounded-lg w-[500px]">

<h2 className="text-xl font-semibold mb-4">
Create Invoice
</h2>

<input
type="number"
placeholder="Invoice Number"
className="border p-2 w-full mb-2"
value={form.invoiceNumber}
onChange={(e) =>
setForm({ ...form, invoiceNumber: e.target.value })
}
/>

<input
placeholder="Client Name"
className="border p-2 w-full mb-2"
value={form.clientName}
onChange={(e) =>
setForm({ ...form, clientName: e.target.value })
}
/>

<input
type="date"
className="border p-2 w-full mb-2"
value={form.issueDate}
onChange={(e) =>
setForm({ ...form, issueDate: e.target.value })
}
/>

<input
type="date"
className="border p-2 w-full mb-4"
value={form.dueDate}
onChange={(e) =>
setForm({ ...form, dueDate: e.target.value })
}
/>

{form.items.map((item, index) => (

<div key={index} className="flex gap-2 mb-2">

<input
placeholder="Item"
className="border p-2 flex-1"
value={item.name}
onChange={(e) =>
handleItemChange(index, "name", e.target.value)
}
/>

<input
type="number"
placeholder="Qty"
className="border p-2 w-20"
value={item.quantity}
onChange={(e) =>
handleItemChange(index, "quantity", Number(e.target.value))
}
/>

<input
type="number"
placeholder="Price"
className="border p-2 w-24"
value={item.price}
onChange={(e) =>
handleItemChange(index, "price", Number(e.target.value))
}
/>

</div>

))}

<button
onClick={addItem}
className="text-blue-600 text-sm mb-4"

>

* Add Item

  </button>

<p className="font-bold mb-4">
Total ₹{total}
</p>

<div className="flex justify-end gap-2">

<button
onClick={() => setShowModal(false)}
className="border px-4 py-2 rounded"

>

Cancel </button>

<button
onClick={createInvoice}
className="bg-blue-600 text-white px-4 py-2 rounded"

>

Save </button>

</div>

</div>

</div>

)}

</div>

);

};
const handleEmail = async (id) => {

  const email = prompt("Enter client email");

  if(!email) return;

  await axios.post(
    `http://localhost:5000/api/v1/invoice/${id}/email`,
    { email },
    { headers:{ Authorization:`Bearer ${token}` } }
  );

  alert("Email sent");

};
const handleReminder = async (id) => {

  const email = prompt("Enter client email");

  if(!email) return;

  await axios.post(
    `http://localhost:5000/api/v1/invoice/${id}/reminder`,
    { email },
    { headers:{ Authorization:`Bearer ${token}` } }
  );

  alert("Reminder sent");

};
const handleDelete = async (id) => {

  const confirmDelete = window.confirm("Delete this invoice?");

  if(!confirmDelete) return;

  await axios.delete(
    `http://localhost:5000/api/v1/invoice/${id}`,
    { headers:{ Authorization:`Bearer ${token}` } }
  );

  alert("Invoice deleted");

  fetchInvoices();

};

export default Invoices;
