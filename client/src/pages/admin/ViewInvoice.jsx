import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const API = "http://localhost:5000/api/v1/invoice";

const ViewInvoice = () => {

const { id } = useParams();
const [invoice, setInvoice] = useState(null);
const invoiceRef = useRef();

const token = localStorage.getItem("token");

const fetchInvoice = async () => {

```
try {

  const res = await axios.get(API + "/" + id, {
    headers: {
      Authorization: "Bearer " + token
    }
  });

  setInvoice(res.data.data.invoice);

} catch (error) {

  console.log("Error fetching invoice:", error);

}
```

};

useEffect(() => {
fetchInvoice();
}, []);

/* PRINT */

const printInvoice = () => {

```
window.print();
```

};

/* DOWNLOAD PDF */

const downloadPDF = async () => {

```
const element = invoiceRef.current;

const canvas = await html2canvas(element);

const imgData = canvas.toDataURL("image/png");

const pdf = new jsPDF("p","mm","a4");

const pageWidth = pdf.internal.pageSize.getWidth();
const imgHeight = (canvas.height * pageWidth) / canvas.width;

pdf.addImage(imgData, "PNG", 0, 0, pageWidth, imgHeight);

pdf.save("invoice-" + invoice.invoiceNumber + ".pdf");
```

};

if (!invoice) {
return <div className="p-6">Loading...</div>;
}

return (

```
<div className="bg-gray-100 min-h-screen p-10">

  {/* ACTION BUTTONS */}

  <div className="max-w-4xl mx-auto flex justify-end gap-4 mb-6">

    <button
      onClick={printInvoice}
      className="bg-gray-700 text-white px-4 py-2 rounded"
    >
      Print
    </button>

    <button
      onClick={downloadPDF}
      className="bg-blue-600 text-white px-4 py-2 rounded"
    >
      Download PDF
    </button>

  </div>


  {/* INVOICE */}

  <div
    ref={invoiceRef}
    className="max-w-4xl mx-auto bg-white p-10 shadow rounded"
  >

    {/* COMPANY HEADER */}

    <div className="flex justify-between mb-10">

      <div>

        <h1 className="text-3xl font-bold">
          My Company Pvt Ltd
        </h1>

        <p className="text-gray-500">
          Delhi, India
        </p>

        <p className="text-gray-500">
          support@company.com
        </p>

      </div>

      <div className="text-right">

        <h2 className="text-2xl font-bold">
          INVOICE
        </h2>

        <p className="text-gray-500">
          #{invoice.invoiceNumber}
        </p>

      </div>

    </div>


    {/* CLIENT SECTION */}

    <div className="mb-8">

      <h3 className="font-semibold mb-2">
        Bill To
      </h3>

      <p className="text-lg">
        {invoice.clientName}
      </p>

      <p className="text-gray-500 text-sm">
        Issue Date: {invoice.issueDate?.slice(0,10)}
      </p>

      <p className="text-gray-500 text-sm">
        Due Date: {invoice.dueDate?.slice(0,10)}
      </p>

    </div>


    {/* ITEMS TABLE */}

    <table className="w-full border">

      <thead className="bg-gray-100">

        <tr>

          <th className="border p-3 text-left">
            Item
          </th>

          <th className="border p-3 text-center">
            Quantity
          </th>

          <th className="border p-3 text-right">
            Price
          </th>

          <th className="border p-3 text-right">
            Total
          </th>

        </tr>

      </thead>

      <tbody>

        {invoice.items.map((item, index) => (

          <tr key={index}>

            <td className="border p-3">
              {item.name}
            </td>

            <td className="border p-3 text-center">
              {item.quantity}
            </td>

            <td className="border p-3 text-right">
              ₹{item.price}
            </td>

            <td className="border p-3 text-right">
              ₹{item.quantity * item.price}
            </td>

          </tr>

        ))}

      </tbody>

    </table>


    {/* TOTAL SECTION */}

    <div className="flex justify-end mt-8">

      <div className="text-right">

        <h2 className="text-xl font-bold">
          Total: ₹{invoice.totalAmount}
        </h2>

      </div>

    </div>

  </div>

</div>
```

);

};

export default ViewInvoice;
