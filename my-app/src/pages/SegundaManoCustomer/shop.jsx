import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "../../css/styles.css";  

const Shop = () => {
  useEffect(() => {
    const mobileNavToggle = document.querySelector(".mobile-nav-toggle");
    const mainNav = document.querySelector(".main-nav");
    const mobileNavOverlay = document.querySelector(".mobile-nav-overlay");
    const mobileNavClose = document.querySelector(".mobile-nav-close");

    const shopSidebar = document.querySelector(".shop-sidebar");
    const sidebarClose = document.querySelector(".sidebar-close");
    const filterToggle = document.querySelector(".filter-toggle");

    function toggleMobileNav() {
      mainNav?.classList.toggle("active");
      mobileNavOverlay?.classList.toggle("active");
      mobileNavToggle?.classList.toggle("active");
      document.body.style.overflow = mainNav?.classList.contains("active")
        ? "hidden"
        : "";
    }

    function closeMobileNav() {
      mainNav?.classList.remove("active");
      mobileNavOverlay?.classList.remove("active");
      mobileNavToggle?.classList.remove("active");
      document.body.style.overflow = "";
    }

    function openSidebar() {
      shopSidebar?.classList.add("active");
    }

    function closeSidebar() {
      shopSidebar?.classList.remove("active");
    }

    // Listeners
    mobileNavToggle?.addEventListener("click", toggleMobileNav);
    mobileNavOverlay?.addEventListener("click", closeMobileNav);
    mobileNavClose?.addEventListener("click", closeMobileNav);
    sidebarClose?.addEventListener("click", closeSidebar);
    filterToggle?.addEventListener("click", openSidebar);

    const resizeHandler = () => {
      if (window.innerWidth > 900) {
        closeMobileNav();
        shopSidebar?.classList.remove("active");
      }
    };
    window.addEventListener("resize", resizeHandler);

    // Cleanup
    return () => {
      mobileNavToggle?.removeEventListener("click", toggleMobileNav);
      mobileNavOverlay?.removeEventListener("click", closeMobileNav);
      mobileNavClose?.removeEventListener("click", closeMobileNav);
      sidebarClose?.removeEventListener("click", closeSidebar);
      filterToggle?.removeEventListener("click", openSidebar);
      window.removeEventListener("resize", resizeHandler);
    };
  }, []);

  return (
    <>
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
          <nav className="main-nav">
            <Link to="/landing">Home</Link>
            <Link to="/shop" className="active">
              Shop
            </Link>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact Us</Link>
            <button className="mobile-nav-close" aria-label="Close navigation">
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
          <button className="mobile-nav-toggle" aria-label="Toggle navigation">
            ☰
          </button>
        </div>
      </header>

      {/* Mobile Navigation Overlay */}
      <div className="mobile-nav-overlay"></div>

      {/* Shop Wrapper */}
      <main className="shop-wrapper">
        <div className="shop-container">
          {/* Sidebar */}
          <aside className="shop-sidebar">
            <button className="sidebar-close" aria-label="Close sidebar">
              ✕
            </button>
            <div className="filter-block">
              <div className="filter-title">Categories</div>
              <ul className="filter-list">
                <li>
                  <a href="#">Furniture</a>
                </li>
                <li className="is-active">
                  <a href="#">Clothes</a>
                </li>
                <li>
                  <a href="#">Gadgets & Phones</a>
                </li>
                <li>
                  <a href="#">Bags</a>
                </li>
                <li>
                  <a href="#">Toys</a>
                </li>
                <li>
                  <a href="#">Dining</a>
                </li>
                <li>
                  <a href="#">Outdoor</a>
                </li>
              </ul>
            </div>

            <div className="filter-block">
              <div className="filter-title">Price</div>
              <p className="filter-note">
                Share your budget with us — we’ll surprise you with items that
                support a scholar.
              </p>
              <div className="price-inputs">
                <input type="text" placeholder="₱ min" />
                <span>–</span>
                <input type="text" placeholder="₱ max" />
              </div>
              <ul className="filter-list small">
                <li>
                  <label>
                    <input type="checkbox" defaultChecked /> ₱0 – ₱100.00
                  </label>
                </li>
                <li>
                  <label>
                    <input type="checkbox" /> ₱100.00 – ₱199.99
                  </label>
                </li>
                <li>
                  <label>
                    <input type="checkbox" /> ₱200.00 – ₱299.99
                  </label>
                </li>
                <li>
                  <label>
                    <input type="checkbox" /> ₱300.00 – ₱399.99
                  </label>
                </li>
                <li>
                  <label>
                    <input type="checkbox" /> ₱400.00+
                  </label>
                </li>
              </ul>
            </div>
          </aside>

          {/* Main Content */}
          <section className="shop-main">
            <h1 className="shop-title">Clothes</h1>
            <button className="filter-toggle">Filter</button>

            <div className="shop-grid">
              {[
                "https://images.unsplash.com/photo-1514996937319-344454492b37?q=80&w=800&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1523381294911-8d3cead13475?q=80&w=800&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?q=80&w=800&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=800&auto=format&fit=crop",
              ].map((src, i) => (
                <article className="p-card" key={i}>
                  <Link to="/product" className="p-add">
                    Add to cart
                  </Link>
                  <Link to="/product" className="p-link">
                    <figure className="p-thumb">
                      <img src={src} alt="Half Zip Sweater" />
                    </figure>
                    <div className="p-info">
                      <div className="p-name">Half Zip Sweater</div>
                      <div className="p-variant">Navy Blue</div>
                      <div className="p-price">₱200.00</div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </section>
        </div>
      </main>

      <footer className="footer">
        © 2025 Segunda Mana. Shop with purpose.
      </footer>
    </>
  );
};

export default Shop;