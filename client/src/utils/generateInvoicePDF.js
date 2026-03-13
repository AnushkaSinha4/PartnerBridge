import jsPDF from "jspdf";

export const generateInvoicePDF = (invoice) => {

    const doc = new jsPDF();

    doc.text(`Invoice #${invoice.invoiceNumber}`, 20, 20);
    doc.text(`Client: ${invoice.client}`, 20, 30);
    doc.text(`Total: ₹${invoice.total}`, 20, 40);

    doc.save(`invoice-${invoice.id}.pdf`);
};