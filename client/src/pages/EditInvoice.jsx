import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const API = "http://localhost:5000/api/v1/invoice";

const EditInvoice = () => {

const { id } = useParams();
const navigate = useNavigate();

const [form,setForm] = useState({
invoiceNumber:"",
clientName:"",
issueDate:"",
dueDate:"",
items:[{name:"",quantity:1,price:0}]
});

const token = localStorage.getItem("token");

/* FETCH SINGLE INVOICE */

const fetchInvoice = async () => {

try{

const res = await axios.get(`${API}/${id}`,{
headers:{Authorization:`Bearer ${token}`}
});

const data = res.data.data.invoice;

setForm({
invoiceNumber:data.invoiceNumber,
clientName:data.clientName,
issueDate:data.issueDate?.slice(0,10),
dueDate:data.dueDate?.slice(0,10),
items:data.items
});

}catch(err){

console.log(err);

}

};

useEffect(()=>{

fetchInvoice();

},[]);

/* HANDLE ITEM */

const handleItemChange = (index,field,value)=>{

const updated=[...form.items];
updated[index][field]=value;

setForm({...form,items:updated});

};

/* ADD ITEM */

const addItem=()=>{

setForm({
...form,
items:[...form.items,{name:"",quantity:1,price:0}]
});

};

/* TOTAL */

const total=form.items.reduce(
(sum,item)=>sum+item.quantity*item.price,
0
);

/* UPDATE */

const updateInvoice=async()=>{

try{

await axios.patch(
`${API}/${id}`,
{
...form,
totalAmount:total
},
{
headers:{Authorization:`Bearer ${token}`}
}
);

alert("Invoice updated");

navigate("/admin/invoices");

}catch(err){

console.log(err);

}

};

return(

<div className="p-6 max-w-xl mx-auto">

<h1 className="text-2xl font-semibold mb-6">
Edit Invoice
</h1>

<input
type="number"
className="border p-2 w-full mb-2"
value={form.invoiceNumber}
onChange={(e)=>setForm({...form,invoiceNumber:e.target.value})}
/>

<input
className="border p-2 w-full mb-2"
value={form.clientName}
onChange={(e)=>setForm({...form,clientName:e.target.value})}
/>

<input
type="date"
className="border p-2 w-full mb-2"
value={form.issueDate}
onChange={(e)=>setForm({...form,issueDate:e.target.value})}
/>

<input
type="date"
className="border p-2 w-full mb-4"
value={form.dueDate}
onChange={(e)=>setForm({...form,dueDate:e.target.value})}
/>

{form.items.map((item,index)=>(

<div key={index} className="flex gap-2 mb-2">

<input
className="border p-2 flex-1"
value={item.name}
onChange={(e)=>handleItemChange(index,"name",e.target.value)}
/>

<input
type="number"
className="border p-2 w-20"
value={item.quantity}
onChange={(e)=>handleItemChange(index,"quantity",Number(e.target.value))}
/>

<input
type="number"
className="border p-2 w-24"
value={item.price}
onChange={(e)=>handleItemChange(index,"price",Number(e.target.value))}
/>

</div>

))}

<button
onClick={addItem}
className="text-blue-600 mb-4"

>

* Add Item

  </button>

<p className="font-bold mb-4">
Total ₹{total}
</p>

<button
onClick={updateInvoice}
className="bg-blue-600 text-white px-4 py-2 rounded"

>

Update Invoice </button>

</div>

);

};

export default EditInvoice;
