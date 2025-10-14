import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Truck, Store, Wallet, HandCoins } from "lucide-react";
import "../../css/styles.css";

export default function Checkout() {
  const [navActive, setNavActive] = useState(false);
  const [orderType, setOrderType] = useState("delivery");
  const [paymentMode, setPaymentMode] = useState("gcash");

  // Contact + Address fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [voucher, setVoucher] = useState("");
  const [discount, setDiscount] = useState(0);

  const navigate = useNavigate();

  const toggleMobileNav = () => {
    setNavActive((prev) => !prev);
    document.body.style.overflow = !navActive ? "hidden" : "";
  };

  const closeMobileNav = () => {
    setNavActive(false);
    document.body.style.overflow = "";
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 900) closeMobileNav();
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Hardcoded subtotal for now
  const subtotal = 600;
  const total = subtotal - discount;

  // Apply voucher
  const applyVoucher = () => {
    if (voucher.trim().toUpperCase() === "DISCOUNT50") {
      setDiscount(50);
    } else {
      setDiscount(0);
      alert("Invalid voucher code");
    }
  };

  // Handle Place Order
  const handlePlaceOrder = () => {
    const orderDetails = {
      code: "INF_223",
      date: new Date().toLocaleDateString(),
      subtotal,
      discount,
      total,
      type: orderType === "delivery" ? "Delivery" : "Pick up",
      address:
        orderType === "delivery"
          ? `${street}, ${city}, ${state}, ${zip}`
          : null,
      customer: { firstName, lastName, phone, email },
      paymentMode,
    };

    localStorage.setItem("orderDetails", JSON.stringify(orderDetails));
    navigate("/thankyou");
  };

  const [referenceNumber, setReferenceNumber] = useState("");
  const [receiptFile, setReceiptFile] = useState(null);

  const handleReceiptUpload = (e) => {
    setReceiptFile(e.target.files[0]);
  };

  return (
    <div>
      {/* Header */}
      <header className="site-header">
        <div className="container header-grid">
          <div className="brand">
            <span className="brand__mark"></span>
            <span className="brand__text">
              Segunda
              <br />
              Mana
            </span>
          </div>

          <nav className={`main-nav ${navActive ? "active" : ""}`}>
            <Link to="/">Home</Link>
            <Link to="/shop">Shop</Link>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact Us</Link>
            <button
              className="mobile-nav-close"
              aria-label="Close navigation"
              onClick={closeMobileNav}
            >
              ✕
            </button>
          </nav>

          <div className="header-tools">
            <div className="search">
              <input placeholder="What are you looking for?" />
              <span className="icon icon-search" aria-hidden="true"></span>
            </div>
            <Link to="/mycart" aria-label="My Cart">
              <span className="icon icon-cart" aria-hidden="true"></span>
            </Link>
          </div>

          <button
            className={`mobile-nav-toggle ${navActive ? "active" : ""}`}
            aria-label="Toggle navigation"
            onClick={toggleMobileNav}
          >
            ☰
          </button>
        </div>
      </header>

      {/* Mobile Navigation Overlay */}
      <div
        className={`mobile-nav-overlay ${navActive ? "active" : ""}`}
        onClick={closeMobileNav}
      ></div>

      {/* Checkout Content */}
      <main className="checkout-wrapper">
        <div className="container">
          <h1 className="checkout-title">Check Out</h1>

          <div className="checkout-grid">
            {/* Checkout Form */}
            <div className="checkout-form">
              {/* Pick Order Type */}
              <section className="checkout-section">
                <h3>Pick Order Type</h3>
                <div className="option-group horizontal-options">
                  <label
                    className={`option-card ${
                      orderType === "delivery" ? "active" : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="orderType"
                      value="delivery"
                      checked={orderType === "delivery"}
                      onChange={() => setOrderType("delivery")}
                    />
                    <div className="option-content">
                      <Truck size={28} />
                      <span>Delivery</span>
                    </div>
                  </label>

                  <label
                    className={`option-card ${
                      orderType === "pickup" ? "active" : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="orderType"
                      value="pickup"
                      checked={orderType === "pickup"}
                      onChange={() => setOrderType("pickup")}
                    />
                    <div className="option-content">
                      <Store size={28} />
                      <span>Pick up</span>
                    </div>
                  </label>
                </div>
              </section>

              {/* Contact Information */}
              <section className="checkout-section">
                <h3>Contact Information</h3>
                <div className="checkout-field">
                  <label>FIRST NAME</label>
                  <input
                    type="text"
                    placeholder="First name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div className="checkout-field">
                  <label>LAST NAME</label>
                  <input
                    type="text"
                    placeholder="Last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
                <div className="checkout-field">
                  <label>PHONE NUMBER</label>
                  <input
                    type="tel"
                    placeholder="Phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div className="checkout-field">
                  <label>EMAIL ADDRESS</label>
                  <input
                    type="email"
                    placeholder="Your Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </section>

              {/* Address (only if Delivery) */}
              {orderType === "delivery" && (
                <section className="checkout-section">
                  <h3>Address</h3>
                  <div className="checkout-field">
                    <label>STREET ADDRESS *</label>
                    <input
                      type="text"
                      placeholder="Street Address"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                    />
                  </div>
                  <div className="checkout-field">
                    <label>TOWN / CITY *</label>
                    <input
                      type="text"
                      placeholder="Town / City"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    />
                  </div>
                  <div className="checkout-field">
                    <label>STATE</label>
                    <input
                      type="text"
                      placeholder="State"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                    />
                  </div>
                  <div className="checkout-field">
                    <label>ZIP CODE</label>
                    <input
                      type="text"
                      placeholder="Zip Code"
                      value={zip}
                      onChange={(e) => setZip(e.target.value)}
                    />
                  </div>
                </section>
              )}

              {/* Payment Method */}
              <section className="checkout-section">
                <h3>Payment Method</h3>
                <div className="option-group horizontal-options">
                  <label
                    className={`option-card ${
                      paymentMode === "gcash" ? "active" : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMode"
                      value="gcash"
                      checked={paymentMode === "gcash"}
                      onChange={() => setPaymentMode("gcash")}
                    />
                    <div className="option-content">
                      <Wallet size={28} />
                      <span>GCash</span>
                    </div>
                  </label>

                  <label
                    className={`option-card ${
                      paymentMode === "cash" ? "active" : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMode"
                      value="cash"
                      checked={paymentMode === "cash"}
                      onChange={() => setPaymentMode("cash")}
                    />
                    <div className="option-content">
                      <HandCoins size={28} />
                      <span>Cash</span>
                    </div>
                  </label>
                </div>

                {/* Conditional render for GCash */}
                {paymentMode === "gcash" && (
                  <div className="gcash-section">
                    <div className="checkout-qr">
                      <img
                        src="https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=InstaPay&bgcolor=ffffff&color=000000"
                        alt="InstaPay QR Code"
                      />
                      <p className="qr-text">
                        Scan this QR using your GCash app
                      </p>
                    </div>

                    <div className="checkout-field">
                      <label>Reference Number</label>
                      <input
                        type="text"
                        placeholder="Enter reference number"
                        value={referenceNumber}
                        onChange={(e) => setReferenceNumber(e.target.value)}
                      />
                    </div>

                    <div className="checkout-field">
                      <label>Upload Receipt</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleReceiptUpload}
                      />
                    </div>
                  </div>
                )}

                {/* Conditional render for Cash */}
                {paymentMode === "cash" && (
                  <p className="cash-note">
                    You will pay <b>cash</b> upon delivery or pickup.
                  </p>
                )}
              </section>
            </div>

            {/* Order Summary */}
            <aside className="checkout-order">
              <h3>Order summary</h3>

              <div className="checkout-item">
                <img
                  src="https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=96&q=80"
                  alt="Pleated Skirt"
                />
                <div className="checkout-item-info">
                  <div className="checkout-item-name">Pleated Skirt</div>
                  <div className="checkout-item-variant">Color: Gray</div>
                </div>
                <div className="checkout-item-price">₱200.00</div>
              </div>

              <div className="checkout-item">
                <img
                  src="https://images.unsplash.com/photo-1514996937319-344454492b37?auto=format&fit=crop&w=96&q=80"
                  alt="Long Sleeve Polo"
                />
                <div className="checkout-item-info">
                  <div className="checkout-item-name">Long Sleeve Polo</div>
                  <div className="checkout-item-variant">Color: Blue</div>
                </div>
                <div className="checkout-item-price">₱200.00</div>
              </div>

              <div className="checkout-item">
                <img src="https://picsum.photos/seed/dress/96/96" alt="Dress" />
                <div className="checkout-item-info">
                  <div className="checkout-item-name">Dress</div>
                  <div className="checkout-item-variant">Color: Brown</div>
                </div>
                <div className="checkout-item-price">₱200.00</div>
              </div>

              {/* Voucher Code */}
              <div className="checkout-field">
                <label>Voucher Code</label>
                <div className="voucher-inline">
                  <input
                    type="text"
                    placeholder="Enter voucher"
                    value={voucher}
                    onChange={(e) => setVoucher(e.target.value)}
                  />
                  <button className="voucher-btn" onClick={applyVoucher}>
                    Apply
                  </button>
                </div>
              </div>

              <div className="checkout-summary">
                <span>Subtotal</span>
                <span>₱{subtotal}.00</span>
              </div>
              {discount > 0 && (
                <div className="checkout-summary">
                  <span>Discount</span>
                  <span>-₱{discount}.00</span>
                </div>
              )}
              <div className="checkout-summary total">
                <span>Total</span>
                <span>₱{total}.00</span>
              </div>

              <button
                className="checkout-place-order"
                onClick={handlePlaceOrder}
              >
                Place Order
              </button>
            </aside>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        © {new Date().getFullYear()} Segunda Mana. Shop with purpose.
      </footer>
    </div>
  );
}
