import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../../css/styles.css";
import { announcementService } from "../../services/announcementService";

const Landing = () => {
  const [navActive, setNavActive] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleMobileNav = () => {
    setNavActive(!navActive);
    document.body.style.overflow = !navActive ? "hidden" : "";
  };

  const closeMobileNav = () => {
    setNavActive(false);
    document.body.style.overflow = "";
  };

  const openModal = (announcement) => {
    setSelectedAnnouncement(announcement);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedAnnouncement(null);
    setIsModalOpen(false);
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

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isModalOpen) {
        closeModal();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isModalOpen]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);

  // Fetch announcements on component mount
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await announcementService.getPublicAnnouncements();
        
        if (result.success) {
          // Filter only active announcements for the landing page
          const activeAnnouncements = result.data.announcements.filter(announcement => announcement.active);
          setAnnouncements(activeAnnouncements);
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError('Failed to fetch announcements');
        console.error('Error fetching announcements:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
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
        <section style={{ maxWidth: '1200px', margin: '60px auto', padding: '0 20px' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              <p style={{ color: '#6b7280' }}>Loading announcements...</p>
            </div>
          ) : error ? (
            <div style={{ textAlign: 'center', padding: '2rem', backgroundColor: '#fee2e2', color: '#dc2626', borderRadius: '12px' }}>
              <p>Error loading announcements: {error}</p>
            </div>
          ) : announcements.length > 0 ? (
            <>
              <h2 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '24px', color: '#111827', textAlign: 'center' }}>
                Latest Announcements
              </h2>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', 
                gap: '20px',
                maxHeight: '600px',
                overflowY: 'auto',
                padding: '4px'
              }}>
                {announcements.slice(0, 6).map((announcement, index) => (
                  <div 
                    key={announcement._id || index}
                    onClick={() => openModal(announcement)}
                    style={{
                      backgroundColor: 'white',
                      borderRadius: '12px',
                      padding: '20px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                      maxHeight: '220px',
                      overflow: 'hidden',
                      position: 'relative',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                    }}
                  >
                    {/* Alert Badge */}
                    <span style={{
                      display: 'inline-block',
                      backgroundColor: announcement.label === 'alert' || announcement.label === 'ALERT' ? '#ef4444' : announcement.label === 'warning' ? '#f59e0b' : '#3b82f6',
                      color: 'white',
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '11px',
                      fontWeight: '700',
                      textTransform: 'uppercase',
                      marginBottom: '12px',
                      letterSpacing: '0.5px'
                    }}>
                      {announcement.label}
                    </span>

                    {/* Title */}
                    <h3 style={{
                      fontSize: '18px',
                      fontWeight: '700',
                      marginBottom: '8px',
                      color: '#1f2937',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {announcement.title}
                    </h3>

                    {/* Body with line-clamp */}
                    <div 
                      style={{
                        fontSize: '14px',
                        color: '#6b7280',
                        lineHeight: '1.6',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        marginBottom: '12px'
                      }}
                      dangerouslySetInnerHTML={{ 
                        __html: announcement.body.replace(/<[^>]*>/g, '').length > 150 
                          ? announcement.body.replace(/<[^>]*>/g, '').substring(0, 150) + '...' 
                          : announcement.body 
                      }}
                    />

                    {/* Date */}
                    <p style={{
                      fontSize: '12px',
                      color: '#9ca3af',
                      marginTop: 'auto',
                      position: 'absolute',
                      bottom: '16px',
                      left: '20px'
                    }}>
                      {new Date(announcement.createdAt).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              <p style={{ color: '#6b7280', fontSize: '16px' }}>No announcements available at the moment.</p>
            </div>
          )}
        </section>

        {/* Announcement Modal */}
        {isModalOpen && selectedAnnouncement && (
          <div 
            className="modal-overlay"
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999,
              padding: '20px',
              animation: 'fadeIn 0.2s ease-in-out'
            }}
            onClick={closeModal}
          >
            <div 
              className="modal-content"
              style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                padding: '32px',
                maxWidth: '700px',
                width: '100%',
                maxHeight: '80vh',
                overflowY: 'auto',
                position: 'relative',
                boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                animation: 'slideUp 0.3s ease-out'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={closeModal}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  background: 'none',
                  border: 'none',
                  fontSize: '28px',
                  cursor: 'pointer',
                  color: '#6b7280',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%',
                  transition: 'background-color 0.2s',
                  lineHeight: '1'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                aria-label="Close modal"
              >
                ×
              </button>

              {/* Badge */}
              <span style={{
                display: 'inline-block',
                backgroundColor: selectedAnnouncement.label === 'alert' || selectedAnnouncement.label === 'ALERT' ? '#ef4444' : selectedAnnouncement.label === 'warning' || selectedAnnouncement.label === 'WARNING' ? '#f59e0b' : '#3b82f6',
                color: 'white',
                padding: '6px 16px',
                borderRadius: '12px',
                fontSize: '13px',
                fontWeight: '700',
                textTransform: 'uppercase',
                marginBottom: '16px',
                letterSpacing: '0.5px'
              }}>
                {selectedAnnouncement.label}
              </span>

              {/* Title */}
              <h2 style={{
                fontSize: '28px',
                fontWeight: '700',
                color: '#1f2937',
                marginBottom: '12px',
                paddingRight: '40px',
                lineHeight: '1.3'
              }}>
                {selectedAnnouncement.title}
              </h2>

              {/* Date */}
              <p style={{
                fontSize: '14px',
                color: '#9ca3af',
                marginBottom: '24px',
                fontWeight: '500'
              }}>
                {new Date(selectedAnnouncement.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>

              {/* Divider */}
              <hr style={{
                border: 'none',
                borderTop: '1px solid #e5e7eb',
                marginBottom: '24px'
              }} />

              {/* Full Body Content */}
              <div 
                style={{
                  fontSize: '16px',
                  lineHeight: '1.7',
                  color: '#374151',
                  wordWrap: 'break-word',
                  overflowWrap: 'break-word'
                }}
                dangerouslySetInnerHTML={{ __html: selectedAnnouncement.body }}
              />
            </div>
          </div>
        )}
      </main>

      <footer className="footer">
        © {new Date().getFullYear()} Segunda Mana. Shop with purpose.
      </footer>
      
      {/* Modal Animations */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .modal-content::-webkit-scrollbar {
          width: 8px;
        }

        .modal-content::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }

        .modal-content::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 10px;
        }

        .modal-content::-webkit-scrollbar-thumb:hover {
          background: #555;
        }

        @media (max-width: 768px) {
          .modal-content {
            padding: 24px !important;
            max-height: 90vh !important;
          }
          
          .modal-content h2 {
            fontSize: 24px !important;
          }
        }
      `}</style>
    </>
  );
};

export default Landing;
