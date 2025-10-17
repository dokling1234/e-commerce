import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../../css/styles.css";

const MyCart = () => {
  const [navActive, setNavActive] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

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
  const fetchCart = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/cart/get", {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setCartItems(data.cart);
      } else {
        setCartItems([]);
      }
    } catch (err) {
      console.error("Failed to fetch cart", err);
    }
  };

 const fetchSuggestions = async () => {
  try {
    const res = await fetch("http://localhost:5000/api/admin/products/random?limit=3", {
      credentials: "include",
    });
    const data = await res.json();
    console.log("Random products response:", data);
    
    if (Array.isArray(data) && data.length > 0) {
      setSuggestions(data.slice(0, 3)); // ensure only 3
    } else {
      // Fallback: fetch all products and pick 3 random ones
      console.log("No random products found, fetching all products as fallback");
      const allRes = await fetch("http://localhost:5000/api/admin/products/customer", {
        credentials: "include",
      });
      const allData = await allRes.json();
      console.log("All products response:", allData);
      
      if (Array.isArray(allData) && allData.length > 0) {
        // Filter products with quantity > 0 and pick 3 random ones
        const availableProducts = allData.filter(p => p.quantity > 0);
        const shuffled = [...availableProducts].sort(() => 0.5 - Math.random());
        setSuggestions(shuffled.slice(0, 3));
      }
    }
  } catch (err) {
    console.error("Failed to fetch suggestions", err);
  }
};


  useEffect(() => {
    fetchCart();
    fetchSuggestions();
  }, []);
  const subtotal = cartItems.reduce(
    (acc, item) => acc + (item.price || 0) * item.quantity,
    0
  );
 


  const handleRemoveFromCart = async (productId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/cart/remove`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ productId }),
      });

      const data = await res.json();
      if (data.success) {
        setCartItems(data.cart);
      }
    } catch (err) {
      console.error("Failed to remove item", err);
    }
  };

  // Calculate totals

  return (
    <>
      {/* Header */}
      <header className="site-header" role="banner">
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
                <div>Quantity</div>
                <div>Subtotal</div>
                <div> </div>
              </div>

              {cartItems.map((item, i) => (
                
                <div className="cart-row" key={i}>
                  <div className="c-item">
                    <img
                      src={
                        item.image ||
                        (item.images && item.images[0]) ||
                        "https://via.placeholder.com/80"
                      }
                      alt={item.title || "Product"}
                    />
                    <div className="c-info">
                      <div className="c-name">{item.title || item.name}</div>
                      {item.color && (
                        <div className="c-variant">Color: {item.color}</div>
                      )}
                    </div>
                  </div>
                  <div className="c-price">₱{item.price || item.price}</div>
                  <div className="c-qty">{item.quantity || 1}</div>
                  <div className="c-subtotal">
                    ₱{(item.unitPrice || item.price) * (item.quantity || 1)}
                  </div>
                  <button
                    className="c-remove"
                    aria-label="Remove"
                    onClick={() => handleRemoveFromCart(item.productId)} // or item._id
                  >
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
                <span>
                  <strong>₱{subtotal.toFixed(2)}</strong>
                </span>
              </div>
              <div className="summary-row total">
                <span>Total</span>
                <span>
                  <strong>₱{subtotal.toFixed(2)}</strong>
                </span>
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
            {suggestions.map((product, i) => (
              <article className="p-card" key={i}>
                <Link to={`/product/${product._id}`} className="p-add">
                  Add to cart
                </Link>
                <Link to={`/product/${product._id}`} className="p-link">
                  <figure className="p-thumb">
                    <img
                      src={product.images?.[0] || ""}
                      alt={product.itemName}
                    />
                  </figure>
                  <div className="p-info">
                    <div className="p-name">{product.itemName}</div>
                    {product.size && <div className="p-variant">{product.size}</div>}
                    <div className="p-quantity">Qty: {product.quantity}</div>
                    <div className="p-price">₱{product.price}</div>
                  </div>
                </Link>
              </article>
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
