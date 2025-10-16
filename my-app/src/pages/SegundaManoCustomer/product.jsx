import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import "../../css/styles.css"; // new dedicated CSS file

const Product = () => {
  const [navActive, setNavActive] = useState(false);
  const [products, setProducts] = useState([]);
  const { productId } = useParams();

  const toggleMobileNav = () => {
    setNavActive(!navActive);
    document.body.style.overflow = !navActive ? "hidden" : "";
  };

  const closeMobileNav = () => {
    setNavActive(false);
    document.body.style.overflow = "";
  };

  useEffect(() => {
    console.log("Product component mounted");
    const handleResize = () => {
      if (window.innerWidth > 900) {
        closeMobileNav();
      }
    };
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      console.log("Fetching product with ID:", productId);
      try {
        const res = await fetch(
          `http://localhost:5000/api/admin/products/${productId}`
        );
        const data = await res.json();
        setProducts([data]);
        setMainImage(data.images?.[0] || "");
      } catch (err) {
        console.error("Failed to load product", err);
      }
    };

    if (productId) fetchProduct();
  }, [productId]);

  // ✅ Image thumbnails + dynamic main image
  const images = [
    "https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1523381294911-8d3cead13475?q=80&w=800&auto=format&fit=crop",
  ];

  const [mainImage, setMainImage] = useState("");

  const handleThumbnailClick = (img) => {
    setMainImage(img);
  };

  const product = products.length > 0 ? products[0] : null;

  const handleAddToCart = async (product) => {
    try {
      const res = await fetch("http://localhost:5000/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          productId: product._id,
          quantity: 1,
          title: product.title,
          price: product.price,
          image: product.images?.[0] || "",
        }),
      });

      const data = await res.json();
      if (data.success) console.log("Added to cart", data.cart);
    } catch (err) {
      console.error("Error adding to cart", err);
    }
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
          {(product?.images || images).map((img, i) => (
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
          <img
            src={mainImage || product?.images?.[0] || images[0]}
            alt={product?.title || product?.itemName}
          />
        </section>

        {/* Info */}
        <section className="pd-info">
          <h1>{product?.title || product?.itemName || "Product Name"}</h1>
          <p className="pd-desc">
            {product?.description || "No description available."}
          </p>

          <div className="pd-price">₱{product?.price || "0.00"}</div>

          <div className="pd-field">
            <label>Measurements</label>
            <select className="pd-select">
              {product?.sizes?.length
                ? product.sizes.map((size, i) => (
                    <option key={i}>{size}</option>
                  ))
                : ["Small", "Medium", "Large"].map((size) => (
                    <option key={size}>{size}</option>
                  ))}
            </select>
          </div>

          <button className="pd-btn" onClick={() => handleAddToCart(product)}>
            Add to Cart
          </button>

          <div className="pd-meta">
            <div>
              <strong>Category</strong>: {product?.category || "Uncategorized"}
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
