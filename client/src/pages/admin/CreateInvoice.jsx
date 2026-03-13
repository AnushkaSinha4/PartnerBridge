import { useState } from "react";
import axios from "axios";

const API = "http://localhost:5000/api/v1";

const CreateInvoice = () => {

  const [client, setClient] = useState("");
  const [date, setDate] = useState("");
  const [dueDate, setDueDate] = useState("");

  const [items, setItems] = useState([
    { description: "", amount: "" }
  ]);

  const addItem = () => {
    setItems([...items, { description: "", amount: "" }]);
  };

  const handleChange = (index, field, value) => {

    const updated = [...items];
    updated[index][field] = value;

    setItems(updated);
  };

  const createInvoice = async () => {

    const res = await axios.post(`${API}/invoice/create`, {
      invoiceNumber: "INV-" + Date.now(),
      client,
      date,
      dueDate,
      items
    });

    alert("Invoice Created");

  };

  return (

    <div>

      <h2>Create Invoice</h2>

      <input
        placeholder="Client"
        onChange={(e) => setClient(e.target.value)}
      />

      <input
        type="date"
        onChange={(e) => setDate(e.target.value)}
      />

      <input
        type="date"
        onChange={(e) => setDueDate(e.target.value)}
      />

      <h3>Items</h3>

      {items.map((item, index) => (

        <div key={index}>

          <input
            placeholder="Description"
            onChange={(e) =>
              handleChange(index, "description", e.target.value)
            }
          />

          <input
            placeholder="Amount"
            type="number"
            onChange={(e) =>
              handleChange(index, "amount", e.target.value)
            }
          />

        </div>

      ))}

      <button onClick={addItem}>
        Add Item
      </button>

      <br />

      <button onClick={createInvoice}>
        Save Invoice
      </button>

    </div>

  );

};

export default CreateInvoice;