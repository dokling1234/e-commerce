import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../../css/styles.css";

const Landing = () => {
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

  // Reusable product list
  const products = [
    {
      name: "Half Zip Sweater",
      color: "Navy Blue",
      price: "₱200.00",
      img: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=900&auto=format&fit=crop",
    },
    {
      name: "Long Sleeve Polo",
      color: "Blue",
      price: "₱200.00",
      img: "https://images.unsplash.com/photo-1514996937319-344454492b37?q=80&w=900&auto=format&fit=crop",
    },
    {
      name: "Dress",
      color: "Brown",
      price: "₱200.00",
      img: "https://images.unsplash.com/photo-1523381294911-8d3cead13475?q=80&w=900&auto=format&fit=crop",
    },
  ];

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
            <Link to="/" className="active">
              Home
            </Link>
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

      {/* Overlay */}
      <div
        className={`mobile-nav-overlay ${navActive ? "active" : ""}`}
        onClick={closeMobileNav}
      ></div>

      <main>
        {/* Hero Section */}
        <section className="hero">
          <div className="container">
            <div className="hero__banner">
              <img
                src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1800&auto=format&fit=crop"
                alt="Charity shop banner showing clothes and accessories"
              />
              <h1 className="hero__title">
                Shop with Heart. Give with Purpose.
              </h1>
              <p className="hero__subtitle">
                Segunda Mana turns donations into hope, shop today and be part
                of our mission.
              </p>
            </div>
          </div>
        </section>

        {/* Intro Section */}
        <section className="intro container">
          <div className="intro__title-wrap">
            <h2 className="intro__title">
              Segunda
              <br />
              Mana
            </h2>
          </div>
          <div className="intro__copy-wrap">
            <hr className="intro__rule" />
            <p className="intro__copy">
              Where every purchase makes an impact. By buying quality pre-loved
              items, you’re not just getting great finds — you’re helping send
              underprivileged youth to school, support struggling families, and
              build a more sustainable, compassionate community.
            </p>
          </div>
        </section>

        {/* Metrics Section */}
        <section className="metrics">
          <div className="container">
            <div className="metrics__header">
              <h2 className="metrics__title">BY THE NUMBERS</h2>
              <p className="metrics__subtitle">54 Segunda Mana Stores</p>
            </div>
            <div className="metrics__grid">
              <div className="metric-card">
                <div className="metric-card__content">
                  <div className="metric-card__value">40</div>
                  <div className="metric-card__label">Charity Outlets</div>
                </div>
              </div>
              <div className="metric-card">
                <div className="metric-card__content">
                  <div className="metric-card__value">10</div>
                  <div className="metric-card__label">Parish Kiosks</div>
                </div>
              </div>
              <div className="metric-card">
                <div className="metric-card__content">
                  <div className="metric-card__value">4</div>
                  <div className="metric-card__label">Long-Term Bazaars</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section className="product-landing container">
          <h3 className="product-landing-title">Our Products:</h3>
          <div className="product-landing-grid">
            {products.map((p, i) => (
              <Link
                to="/product"
                state={{ product: p }}
                key={i}
                className="product-landing-card"
              >
                <img src={p.img} alt={`${p.name} in ${p.color}`} />
                <div className="product-landing-card__body">
                  <p className="product-landing-card__name">
                    {p.name}
                    <br />
                    {p.color}
                  </p>
                  <div className="product-landing-card__price">{p.price}</div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Announcement Section */}
        <section className="announcement container">
          <div className="announcement__box">
            <img
              src="https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=800&auto=format&fit=crop"
              alt="Donation policy announcement poster"
              className="announcement__img"
            />
            <div>
              <span className="badge">ANNOUNCEMENT</span>
              <p className="announce__title">
                Important Announcement for Our Valued Segunda Mana Donors
              </p>
              <p className="announce__text">
                Starting September 1, 2025: Segunda Mana Charity Outlets will NO
                LONGER ACCEPT in-kind donations (such as clothes, shoes,
                household items, etc.).
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        © {new Date().getFullYear()} Segunda Mana. Shop with purpose.
      </footer>
    </>
  );
};

export default Landing;
