"use client";

export default function InvoiceView({ invoice, vendor, items, color }: any) {
  return (
    <>
      <style jsx global>{`
        @media print {
          body { margin: 0; padding: 0; }
          .no-print { display: none !important; }
        }
      `}</style>
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="no-print mb-4 flex justify-end gap-3">
            <button
              onClick={() => window.print()}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download PDF
            </button>
            <button
              onClick={() => window.close()}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
          </div>
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="text-white p-8 text-center" style={{ background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)` }}>
              <h1 className="text-3xl font-bold">Invoice</h1>
              <p className="text-xl mt-2">{invoice.invoiceNumber}</p>
            </div>

            <div className="p-8">
              <div className="flex justify-between mb-8">
                <div>
                  <h2 className="text-lg font-semibold mb-2" style={{ color }}>From:</h2>
                  <p className="font-semibold">{vendor?.businessName}</p>
                  <p className="text-gray-600">{vendor?.location}</p>
                </div>
                <div className="text-right">
                  <h2 className="text-lg font-semibold mb-2" style={{ color }}>To:</h2>
                  <p className="font-semibold">{invoice.clientName}</p>
                  <p className="text-gray-600">{invoice.clientEmail}</p>
                  {invoice.clientPhone && <p className="text-gray-600">{invoice.clientPhone}</p>}
                  {invoice.clientAddress && <p className="text-gray-600">{invoice.clientAddress}</p>}
                </div>
              </div>

              <div className="bg-[#fdf8f4] p-6 rounded-lg mb-8">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="font-semibold">Invoice Date:</span>
                    <span className="ml-2">{new Date(invoice.issueDate).toLocaleDateString()}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold">Due Date:</span>
                    <span className="ml-2" style={{ color, fontWeight: 600 }}>{new Date(invoice.dueDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <table className="w-full mb-8">
                <thead className="text-white" style={{ backgroundColor: color }}>
                  <tr>
                    <th className="px-4 py-3 text-left">Description</th>
                    <th className="px-4 py-3 text-center w-20">Qty</th>
                    <th className="px-4 py-3 text-right w-32">Unit Price</th>
                    <th className="px-4 py-3 text-right w-32">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item: any, index: number) => (
                    <tr key={index} className="border-b">
                      <td className="px-4 py-3">{item.description}</td>
                      <td className="px-4 py-3 text-center">{item.quantity}</td>
                      <td className="px-4 py-3 text-right">{item.unitPrice.toLocaleString()} RWF</td>
                      <td className="px-4 py-3 text-right font-semibold">{(item.quantity * item.unitPrice).toLocaleString()} RWF</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex justify-end mb-8">
                <div className="w-80">
                  <div className="flex justify-between py-2">
                    <span>Subtotal:</span>
                    <span className="font-semibold">{invoice.subtotal.toLocaleString()} RWF</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span>Tax (18%):</span>
                    <span className="font-semibold">{invoice.taxAmount.toLocaleString()} RWF</span>
                  </div>
                  {invoice.discount > 0 && (
                    <div className="flex justify-between py-2 text-green-600">
                      <span>Discount:</span>
                      <span className="font-semibold">-{invoice.discount.toLocaleString()} RWF</span>
                    </div>
                  )}
                  <div className="flex justify-between py-3 text-lg font-bold" style={{ borderTop: `2px solid ${color}` }}>
                    <span>Total:</span>
                    <span style={{ color }}>{invoice.total.toLocaleString()} RWF</span>
                  </div>
                </div>
              </div>

              {invoice.notes && (
                <div className="bg-gray-50 p-6 rounded-lg mb-6">
                  <h3 className="font-semibold mb-2" style={{ color }}>Notes:</h3>
                  <p className="text-gray-600">{invoice.notes}</p>
                </div>
              )}

              {invoice.terms && (
                <div className="bg-yellow-50 p-6 rounded-lg mb-6">
                  <h3 className="font-semibold text-yellow-900 mb-2">Payment Terms:</h3>
                  <p className="text-yellow-800">{invoice.terms}</p>
                </div>
              )}
            </div>

            <div className="bg-gray-50 p-6 text-center text-gray-500 text-sm">
              <p>Thank you for your business!</p>
              <p className="mt-2">© {new Date().getFullYear()} {vendor?.businessName}. Powered by Andiza.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
