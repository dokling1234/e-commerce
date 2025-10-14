import React, { useState, useEffect } from "react";
import "../../css/adminsidebar.css";

const AddOrder = () => {
  const [customer, setCustomer] = useState({
    name: "",
    contact: "",
    email: "",
    address: "",
    city: "",
    province: "",
  });

  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [orderDate, setOrderDate] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [status, setStatus] = useState("");
  const [instructions, setInstructions] = useState("");

  // Price list (simulate product options)
  const productOptions = [
    { id: "p1", name: "Albibas Blue - Size 40", price: 300, size: 40 },
    { id: "p2", name: "Albibas Red - Size 38", price: 250, size: 38 },
    { id: "p3", name: "Albibas Green - Size 42", price: 350, size: 42 },
  ];

  // Set initial dates
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setOrderDate(today);
    const delivery = new Date();
    delivery.setDate(delivery.getDate() + 3);
    setDeliveryDate(delivery.toISOString().split("T")[0]);
  }, []);

  // Add product to list
  const addProduct = () => {
    if (!selectedProduct || quantity < 1) {
      alert("Please select a product and enter a valid quantity");
      return;
    }

    const product = productOptions.find((p) => p.id === selectedProduct);
    const newProduct = {
      id: Date.now(),
      ...product,
      quantity,
      total: product.price * quantity,
    };

    setProducts([...products, newProduct]);
    setSelectedProduct("");
    setQuantity(1);
  };

  // Remove product
  const removeProduct = (id) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  // Update quantity
  const updateQuantity = (id, newQuantity) => {
    setProducts(
      products.map((p) =>
        p.id === id
          ? { ...p, quantity: newQuantity, total: p.price * newQuantity }
          : p
      )
    );
  };

  // Totals
  const subtotal = products.reduce((sum, p) => sum + p.total, 0);
  const shipping = 50;
  const total = subtotal + shipping;

  // Handle submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (products.length === 0) {
      alert("Please add at least one product");
      return;
    }
    alert("Order created successfully!");
    // Here you’d send data to backend
    console.log({
      customer,
      products,
      orderDate,
      deliveryDate,
      paymentMethod,
      status,
      instructions,
      subtotal,
      total,
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-center mb-6">Add New Order</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Customer Info */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="font-semibold text-lg mb-4">Customer Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <input
              className="border p-2 rounded"
              placeholder="Customer Name"
              required
              value={customer.name}
              onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
            />
            <input
              className="border p-2 rounded"
              placeholder="Contact Number"
              required
              value={customer.contact}
              onChange={(e) =>
                setCustomer({ ...customer, contact: e.target.value })
              }
            />
            <input
              className="border p-2 rounded"
              placeholder="Email Address"
              value={customer.email}
              onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
            />
            <input
              className="border p-2 rounded"
              placeholder="Delivery Address"
              required
              value={customer.address}
              onChange={(e) =>
                setCustomer({ ...customer, address: e.target.value })
              }
            />
            <input
              className="border p-2 rounded"
              placeholder="City/Municipality"
              required
              value={customer.city}
              onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
            />
            <input
              className="border p-2 rounded"
              placeholder="Province"
              required
              value={customer.province}
              onChange={(e) =>
                setCustomer({ ...customer, province: e.target.value })
              }
            />
          </div>
        </div>

        {/* Product Selection */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="font-semibold text-lg mb-4">Product Selection</h2>
          <div className="grid grid-cols-2 gap-4">
            <select
              className="border p-2 rounded"
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              required
            >
              <option value="">Select a product</option>
              {productOptions.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} - ₱{p.price}
                </option>
              ))}
            </select>
            <input
              type="number"
              className="border p-2 rounded"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              required
            />
          </div>
          <button
            type="button"
            onClick={addProduct}
            className="mt-3 px-4 py-2 bg-blue-500 text-white rounded"
          >
            + Add Product
          </button>

          {/* Product List */}
          <div className="mt-4 space-y-2">
            {products.map((p) => (
              <div
                key={p.id}
                className="flex justify-between items-center border p-2 rounded"
              >
                <div>
                  <p className="font-semibold">{p.name}</p>
                  <p className="text-sm text-gray-500">
                    Size: {p.size} | ₱{p.price}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    className="border w-16 text-center rounded"
                    value={p.quantity}
                    onChange={(e) =>
                      updateQuantity(p.id, Number(e.target.value))
                    }
                  />
                  <span>₱{p.total}</span>
                  <button
                    type="button"
                    onClick={() => removeProduct(p.id)}
                    className="px-2 py-1 bg-red-500 text-white rounded"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Details */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="font-semibold text-lg mb-4">Order Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <input type="date" value={orderDate} readOnly className="border p-2 rounded" />
            <input
              type="date"
              value={deliveryDate}
              onChange={(e) => setDeliveryDate(e.target.value)}
              className="border p-2 rounded"
            />
            <select
              className="border p-2 rounded"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              required
            >
              <option value="">Payment Method</option>
              <option value="cash">Cash on Delivery</option>
              <option value="bank">Bank Transfer</option>
              <option value="gcash">GCash</option>
              <option value="paymaya">PayMaya</option>
            </select>
            <select
              className="border p-2 rounded"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              required
            >
              <option value="">Order Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <textarea
              className="border p-2 rounded col-span-2"
              placeholder="Special Instructions"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
            />
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="font-semibold text-lg mb-4">Order Summary</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>₱{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping Fee:</span>
              <span>₱{shipping.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold border-t pt-2">
              <span>Total Amount:</span>
              <span>₱{total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 justify-center">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="px-4 py-2 border rounded"
          >
            Cancel
          </button>
          <button type="submit" className="px-4 py-2 bg-red-600 text-white rounded">
            Create Order
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddOrder;
