import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../../css/styles.css"; // new dedicated CSS file

const Product = () => {
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

  // ✅ Image thumbnails + dynamic main image
  const images = [
    "https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1523381294911-8d3cead13475?q=80&w=800&auto=format&fit=crop",
  ];

  const [mainImage, setMainImage] = useState(
    "https://images.unsplash.com/photo-1514996937319-344454492b37?q=80&w=1200&auto=format&fit=crop"
  );

  const handleThumbnailClick = (img) => {
    setMainImage(img);
  };

  return (
    <div>
      {/* ✅ Header */}
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
            <Link to="/landing">Home</Link>
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

      <div
        className={`mobile-nav-overlay ${navActive ? "active" : ""}`}
        onClick={closeMobileNav}
      ></div>

      {/* ✅ Product Section */}
      <main className="pd-wrap">
        {/* Thumbnails */}
        <aside className="pd-thumbs">
          {images.map((img, i) => (
            <img
              key={i}
              src={img}
              alt={`thumb-${i}`}
              onClick={() => handleThumbnailClick(img)}
              className={mainImage === img ? "active-thumb" : ""}
            />
          ))}
        </aside>

        {/* Main Image */}
        <section className="pd-main">
          <img src={mainImage} alt="Half-Zip Stripped Sweater" />
        </section>

        {/* Info */}
        <section className="pd-info">
          <h1>Half-Zip Stripped Sweater</h1>
          <p className="pd-desc">
            A classic layering piece with a modern twist. This half-zip sweater
            features a timeless striped design, soft knit fabric, and a
            versatile zip-up collar for adjustable comfort. Finished with ribbed
            cuffs and hem for a snug fit, it’s perfect for both casual days and
            smart-casual looks.
          </p>

          <div className="pd-price">₱200.00</div>

          <div className="pd-field">
            <label>Measurements</label>
            <select className="pd-select">
              <option>Small</option>
              <option>Medium</option>
              <option>Large</option>
            </select>
          </div>

          <button className="pd-btn">Add to Cart</button>

          <div className="pd-meta">
            <div>
              <strong>Category</strong>: Clothing
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        © {new Date().getFullYear()} Segunda Mana. Shop with purpose.
      </footer>
    </div>
  );
};

export default Product;
