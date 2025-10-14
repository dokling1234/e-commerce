import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../../css/styles.css";  


const MyCart = () => {
  const [navActive, setNavActive] = useState(false);

  const toggleMobileNav = () => {
    setNavActive(!navActive);
    document.body.style.overflow = !navActive ? "hidden" : "";
  };

  const closeMobileNav = () => {
    setNavActive(false);
    document.body.style.overflow = "";
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 900) {
        closeMobileNav();
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Example cart items
  const cartItems = [
    {
      name: "Pleated Skirt",
      color: "Gray",
      price: 200,
      img: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=480&q=80",
    },
    {
      name: "Long Sleeve Polo",
      color: "Blue",
      price: 200,
      img: "https://images.unsplash.com/photo-1514996937319-344454492b37?auto=format&fit=crop&w=480&q=80",
    },
    {
      name: "Dress",
      color: "Brown",
      price: 200,
      img: "https://picsum.photos/seed/dress/480/480",
    },
  ];

  // Suggested items
  const suggestions = [
    {
      name: "Flowy Dress",
      color: "Blue",
      price: 200,
      img: "https://images.unsplash.com/photo-1523381294911-8d3cead13475?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Cardigan",
      color: "Black",
      price: 200,
      img: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80",
    },
  ];

  // Calculate totals
  const subtotal = cartItems.reduce((acc, item) => acc + item.price, 0);

  return (
    <>
      {/* Header */}
      <header className="site-header" role="banner">
        <div className="container header-grid">
          <div className="brand">
            <span className="brand__mark"></span>
            <span className="brand__text">
              Segunda<br />Mana
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
              <input
                placeholder="What are you looking for?"
                aria-label="Search products"
              />
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
            <span aria-hidden="true">☰</span>
          </button>
        </div>
      </header>

      {/* Mobile Nav Overlay */}
      <div
        className={`mobile-nav-overlay ${navActive ? "active" : ""}`}
        onClick={closeMobileNav}
      ></div>

      {/* Cart Content */}
      <main className="cart-wrapper">
        <div className="container cart-grid">
          {/* Cart Main */}
          <div className="cart-main">
            <h1 className="cart-title">My Cart</h1>

            <div className="cart-table">
              <div className="cart-head">
                <div>Product</div>
                <div>Price</div>
                <div>Subtotal</div>
                <div></div>
              </div>

              {cartItems.map((item, i) => (
                <div className="cart-row" key={i}>
                  <div className="c-item">
                    <img src={item.img} alt={item.name} />
                    <div className="c-info">
                      <div className="c-name">{item.name}</div>
                      <div className="c-variant">Color: {item.color}</div>
                    </div>
                  </div>
                  <div className="c-price">₱{item.price.toFixed(2)}</div>
                  <div className="c-subtotal">₱{item.price.toFixed(2)}</div>
                  <button className="c-remove" aria-label="Remove">
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Cart Summary */}
          <aside className="cart-summary">
            <div className="summary-card">
              <div className="summary-title">Cart</div>
              <div className="summary-row">
                <span>Subtotal</span>
                <span><strong>₱{subtotal.toFixed(2)}</strong></span>
              </div>
              <div className="summary-row total">
                <span>Total</span>
                <span><strong>₱{subtotal.toFixed(2)}</strong></span>
              </div>
              <Link to="/checkout" className="summary-checkout">
                Proceed to checkout
              </Link>
            </div>
          </aside>
        </div>

        {/* Suggestions */}
        <section className="container cart-suggest">
          <h2 className="section-title" style={{ textAlign: "left" }}>
            You might also like:
          </h2>
          <div className="shop-grid">
            {suggestions.map((s, i) => (
              <Link className="p-link" to="#" key={i}>
                <article className="p-card">
                  <div className="p-thumb">
                    <img src={s.img} alt={s.name} />
                  </div>
                  <div className="p-info">
                    <div className="p-name">{s.name}</div>
                    <div className="p-variant">{s.color}</div>
                    <div className="p-price">₱{s.price.toFixed(2)}</div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <footer className="footer">
        © {new Date().getFullYear()} Segunda Mana. Shop with purpose.
      </footer>
    </>
  );
};

export default MyCart;
