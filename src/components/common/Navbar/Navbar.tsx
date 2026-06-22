"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import {
  Search,
  User,
  Heart,
  ShoppingBag,
  ChevronRight,
  ChevronLeft,
  Mail,
  Phone,
  X,
  Menu,
  Home,
  Info,
  Layers,
  PhoneCall,
  LogIn,
  Gift,
} from "lucide-react";
import { useStore } from "@/store/useStore";

// ── DATA STRUCTURE ───────────────────────────────────────────────────────────
const taglines = [
  "Elegant Ethnic Wear for Every You",
  "Free Shipping on All Orders Above ₹1999",
  "Handcrafted with Love in India",
  "New Festive Collection Out Now!"
];

const mobileNavLinks = (cartCount: number, wishlistCount: number, userLoggedIn: boolean) => [
  { name: "Home", href: "/", icon: <Home size={20} /> },
  { name: "About Us", href: "/about", icon: <Info size={20} /> },
  { name: "Collection", href: "/collection", icon: <Layers size={20} />, hasDrillDown: true },
  { name: "Contact Us", href: "/contact", icon: <PhoneCall size={20} /> },
  { name: "Search", href: "#", icon: <Search size={20} /> },
  { name: "Cart", href: "/cart", icon: <ShoppingBag size={20} />, count: cartCount },
  { name: "Wishlist", href: "/wishlist", icon: <Heart size={20} />, count: wishlistCount },
  { name: userLoggedIn ? "My Account" : "Login / Register", href: "/login", icon: <User size={20} /> },
];

const megaMenuData: any = {
  Kurti: {
    title: "Kurti",
    image: "/mobile/kurti.jpg",
    description: "Stylish Kurtis for Every Occasion",
    sections: [
      {
        id: "categories",
        title: "Kurti Categories",
        links: ["Anarkali Kurti", "A-Line Kurti", "Straight Kurti", "Short Kurti", "Long Kurti", "Party Wear Kurti", "Printed Kurti", "Embroidered Kurti"],
        viewAll: "View All Kurtis"
      },
      {
        id: "fabrics",
        title: "Kurti Fabrics",
        links: ["Cotton", "Rayon", "Silk", "Georgette", "Chiffon", "Linen", "Khadi", "Crepe"],
        viewAll: "View All Fabrics"
      },
      {
        id: "designs",
        title: "Kurti Designs",
        links: ["Embroidered", "Printed", "Plain", "Floral", "Mirror Work", "Aari Work", "Handwork", "Block Print"],
        viewAll: "View All Designs"
      }
    ]
  },
  Saree: {
    title: "Saree",
    image: "/mobile/saree.jpg",
    description: "Elegant Sarees for Every You",
    sections: [
      { id: "types", title: "Saree Types", links: ["Banarasi", "Silk", "Chiffon", "Net", "Cotton"], viewAll: "View All" }
    ]
  },
  Blouse: {
    title: "Blouse",
    image: "/mobile/blouse.jpg",
    description: "Trendy Blouses in Latest Designs",
    sections: [
      { id: "styles", title: "Blouse Styles", links: ["Ready Made", "Custom", "Designer"], viewAll: "View All" }
    ]
  },
  Dupatta: {
    title: "Dupatta",
    image: "/mobile/dupatta.jpg",
    description: "Beautiful Dupattas to Complete Your Look",
    sections: [
      { id: "styles", title: "Styles", links: ["Heavy", "Light", "Floral"], viewAll: "View All" }
    ]
  }
};

const Navbar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === "/";
  const [isScrolled, setIsScrolled] = useState(false);
  const [taglineIndex, setTaglineIndex] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMegaOpen, setIsMegaOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<keyof typeof megaMenuData>("Kurti");
  const [mounted, setMounted] = useState(false);

  // Search overlay states
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [navSearchQuery, setNavSearchQuery] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!navSearchQuery.trim()) return;
    setIsSearchOpen(false);
    router.push(`/collection?search=${encodeURIComponent(navSearchQuery.trim())}`);
  };

  const handleSuggestionClick = (tag: string) => {
    setIsSearchOpen(false);
    setNavSearchQuery(tag);
    router.push(`/collection?search=${encodeURIComponent(tag)}`);
  };

  // Store connection
  const cart = useStore((state) => state.cart);
  const wishlist = useStore((state) => state.wishlist);
  const user = useStore((state) => state.user);

  // Drill-down State: ['main', 'Collection', 'Kurti', 'Kurti Categories']
  const [viewStack, setViewStack] = useState<any[]>(['main']);
  const currentView = viewStack[viewStack.length - 1];

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    const interval = setInterval(() => setTaglineIndex((p) => (p + 1) % taglines.length), 4000);
    return () => { window.removeEventListener("scroll", handleScroll); clearInterval(interval); };
  }, []);

  if (pathname === "/login") return null;

  const pushView = (view: any) => setViewStack([...viewStack, view]);
  const popView = () => setViewStack(viewStack.slice(0, -1));
  const closeMenu = () => { setIsMobileMenuOpen(false); setViewStack(['main']); };

  const shouldBeSolid = !isHome || isScrolled;

  const cartCount = mounted ? cart.reduce((acc, item) => acc + item.quantity, 0) : 0;
  const wishlistCount = mounted ? wishlist.length : 0;
  const userLoggedIn = mounted ? !!user?.isLoggedIn : false;

  return (
    <header className={`navbar-wrapper ${shouldBeSolid ? "is-scrolled" : ""}`}>
      {/* ── TOP BAR (Hidden on Mobile) ────────────────────────────────────── */}
      <div className="navbar-top">
        <div className="navbar-top__container">
          <div className="navbar-top__left">
            <Mail size={14} className="navbar-top__icon" />
            <a href="mailto:hello@sareestyle.com">hello@sareestyle.com</a>
          </div>
          <div className="navbar-top__center">
            <span className="navbar-top__line" />
            <span className="navbar-top__dot" />
            <div className="navbar-top__slider">
              <AnimatePresence mode="wait">
                <motion.p key={taglineIndex} initial={{ y: 15, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -15, opacity: 0 }} transition={{ duration: 0.5 }}>
                  {taglines[taglineIndex]}
                </motion.p>
              </AnimatePresence>
            </div>
            <span className="navbar-top__dot" />
            <span className="navbar-top__line" />
          </div>
          <div className="navbar-top__right">
            <Phone size={14} className="navbar-top__icon" />
            <a href="tel:+919876543210">+91 98765 43210</a>
          </div>
        </div>
      </div>

      {/* ── MAIN NAVBAR ─────────────────────────────────────────────────────── */}
      <div className="navbar-main">
        <div className="navbar-main__container">
          {/* Brand Logo Box */}
          <Link href="/" className="navbar-brand">
            <div className="navbar-brand__logo-img">
              <img src="/logo.png" alt="Logo" />
            </div>
            <div className="navbar-brand__text">
              <h1 className="navbar-brand__title">DESIGNS OF DREAMS</h1>
              <p className="navbar-brand__tagline">Grace in Every Drape</p>
            </div>
          </Link>

          {/* Desktop Nav (Hidden on Mobile) */}
          <nav className="navbar-nav desktop-only">
            <ul className="navbar-nav__list">
              <li className="navbar-nav__item"><Link href="/" className="navbar-nav__link">Home</Link></li>
              <li className="navbar-nav__item"><Link href="/about" className="navbar-nav__link">About</Link></li>
              {/* MEGA MENU ITEM */}
              <li
                className="navbar-nav__item has-mega"
                onMouseEnter={() => setIsMegaOpen(true)}
                onMouseLeave={() => setIsMegaOpen(false)}
              >
                <div
                  className="navbar-nav__link"
                  style={{ cursor: 'pointer' }}
                  onClick={() => setIsMegaOpen(!isMegaOpen)}
                >
                  Collection <ChevronRight size={14} style={{ transform: isMegaOpen ? 'rotate(-90deg)' : 'rotate(90deg)', transition: 'transform 0.3s' }} />
                </div>

                <AnimatePresence>
                  {isMegaOpen && (
                    <motion.div
                      className="mega-menu"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <div className="mega-menu__container" onClick={(e) => e.stopPropagation()}>
                        {/* Sidebar Tabs */}
                        <div className="mega-menu__sidebar">
                          {Object.keys(megaMenuData).map((key) => (
                            <button
                              key={key}
                              className={`mega-menu__tab ${activeTab === key ? "is-active" : ""}`}
                              onMouseEnter={() => setActiveTab(key as any)}
                            >
                              {key}
                              <ChevronRight size={16} />
                            </button>
                          ))}
                        </div>

                        {/* Content Grid */}
                        <div className="mega-menu__content">
                          <div className="mega-menu__grid">
                            {megaMenuData[activeTab].sections.map((section: any) => (
                              <div key={section.id} className="mega-menu__column">
                                <div className="mega-menu__icon-circle">
                                  <Layers size={24} />
                                </div>
                                <h4 className="mega-menu__column-title">{section.title}</h4>
                                <ul className="mega-menu__links">
                                  {section.links.map((link: string) => (
                                    <li key={link}>
                                      <Link href={`/collection?category=${activeTab as string}&sub=${encodeURIComponent(link)}`} className="mega-menu__link" onClick={() => setIsMegaOpen(false)}>
                                        {link}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                                <Link href={`/collection?category=${activeTab as string}`} className="mega-menu__view-all" onClick={() => setIsMegaOpen(false)}>
                                  {section.viewAll} <ChevronRight size={14} />
                                </Link>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
              <li className="navbar-nav__item"><Link href="/contact" className="navbar-nav__link">Contact</Link></li>
            </ul>
          </nav>

          {/* Icons & Hamburger */}
          <div className="navbar-actions">
            <button
              className="navbar-actions__btn desktop-only"
              onClick={() => setIsSearchOpen(true)}
              aria-label="Open Search"
            >
              <Search size={22} />
            </button>
            <Link href="/cart" className="navbar-actions__btn navbar-actions__btn--badge">
              <ShoppingBag size={22} />
              {cartCount > 0 && <span className="navbar-actions__count">{cartCount}</span>}
            </Link>
            <Link href="/wishlist" className="navbar-actions__btn navbar-actions__btn--badge desktop-only">
              <Heart size={22} />
              {wishlistCount > 0 && <span className="navbar-actions__count">{wishlistCount}</span>}
            </Link>
            <Link href="/login" className="navbar-actions__btn desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <User size={22} />
              {userLoggedIn && <span style={{ fontSize: '11px', fontFamily: 'var(--font-poppins)', fontWeight: 600, color: 'var(--color-primary)' }}>{user?.name.split(" ")[0]}</span>}
            </Link>
            <button className="navbar-actions__btn mobile-hamburger" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu size={28} />
            </button>
          </div>
        </div>
      </div>

      {/* ── MOBILE DRILL-DOWN DRAWER ────────────────────────────────────────── */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div className="mobile-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeMenu} />
            <motion.div className="mobile-drawer" initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }}>

              {/* HEADER (DYNAMIC) */}
              <div className={`mobile-drawer__header ${currentView === 'main' ? 'is-black' : ''}`}>
                {currentView !== 'main' && (
                  <button className="mobile-drawer__back" onClick={popView}><ChevronLeft size={24} /></button>
                )}

                {currentView === 'main' ? (
                  <div className="mobile-drawer__brand">
                    <img src="/logo.png" alt="Logo" className="mobile-drawer__logo" />
                    <div className="mobile-drawer__brand-text">
                      <span className="title">DESIGNS OF DREAMS</span>
                      <p>Grace in Every Drape</p>
                    </div>
                  </div>
                ) : (
                  <span className="mobile-drawer__title">{typeof currentView === 'string' ? currentView : currentView.title}</span>
                )}

                <button className="mobile-drawer__close" onClick={closeMenu}><X size={24} /></button>
              </div>

              {/* CONTENT AREA */}
              <div className="mobile-drawer__content">
                <AnimatePresence mode="popLayout">
                  {currentView === 'main' && (
                    <motion.div key="main" initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="mobile-view">
                      <ul className="mobile-list">
                        {mobileNavLinks(cartCount, wishlistCount, userLoggedIn).map((link) => (
                          <li key={link.name}>
                            <Link
                              href={link.href}
                              className="mobile-list__item"
                              onClick={(e) => {
                                if (link.hasDrillDown) {
                                  e.preventDefault();
                                  pushView('Collection');
                                } else if (link.name === "Search") {
                                  e.preventDefault();
                                  closeMenu();
                                  setIsSearchOpen(true);
                                } else {
                                  closeMenu();
                                }
                              }}
                            >
                              <div className="item-left">
                                <span className="item-icon">{link.icon}</span>
                                <span className="item-text">{link.name}</span>
                              </div>
                              {link.hasDrillDown && <ChevronRight size={18} className="item-arrow" />}
                              {link.count !== undefined && link.count > 0 && <span className="item-badge">{link.count}</span>}
                            </Link>
                          </li>
                        ))}
                      </ul>
                      <div className="mobile-drawer__promo">
                        <div className="promo-box">
                          <Gift className="promo-icon" />
                          <div className="promo-text">
                            <p>Get 10% OFF on your first order!</p>
                            <span>Use Code: <strong>SAREESTYLE10</strong></span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {currentView === 'Collection' && (
                    <motion.div key="collection" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 20, opacity: 0 }} className="mobile-view">
                      <ul className="mobile-category-list">
                        {Object.keys(megaMenuData).map((key) => (
                          <li key={key}>
                            <button className="category-card" onClick={() => { setActiveTab(key as any); pushView(megaMenuData[key]); }}>
                              <div className="category-img"><img src={`https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=100&q=80`} alt={key} /></div>
                              <div className="category-info">
                                <h3>{megaMenuData[key].title}</h3>
                                <p>{megaMenuData[key].description}</p>
                              </div>
                              <ChevronRight size={18} />
                            </button>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}

                  {/* Category View (e.g. Kurti) */}
                  {typeof currentView === 'object' && currentView.sections && !currentView.links && (
                    <motion.div key="category" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 20, opacity: 0 }} className="mobile-view">
                      <ul className="mobile-sub-list">
                        {currentView.sections.map((section: any) => (
                          <li key={section.id}>
                            <button className="mobile-list__item" onClick={() => pushView(section)}>
                              <div className="item-left">
                                <div className="item-circle-icon"><Layers size={18} /></div>
                                <span className="item-text">{section.title}</span>
                              </div>
                              <ChevronRight size={18} className="item-arrow" />
                            </button>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}

                  {/* Section View (e.g. Kurti Categories) */}
                  {typeof currentView === 'object' && currentView.links && (
                    <motion.div key="section" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 20, opacity: 0 }} className="mobile-view">
                      <ul className="mobile-drill-list">
                        {currentView.links.map((link: string) => (
                          <li key={link}>
                            <Link href={`/collection?category=${activeTab as string}&sub=${encodeURIComponent(link)}`} className="mobile-drill-item" onClick={closeMenu}>
                              {link} <ChevronRight size={16} />
                            </Link>
                          </li>
                        ))}
                      </ul>
                      <Link href={`/collection?category=${activeTab as string}`} className="view-all-mobile" onClick={closeMenu}>
                        {currentView.viewAll} <ChevronRight size={14} />
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── SEARCH OVERLAY ─────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            className="navbar-search-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <button
              className="navbar-search-overlay__close"
              onClick={() => setIsSearchOpen(false)}
              aria-label="Close search"
            >
              <X size={32} />
            </button>

            <motion.div
              className="navbar-search-overlay__content"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ duration: 0.4, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="navbar-search-overlay__subtitle">Discover Our Masterpieces</span>
              <h2 className="navbar-search-overlay__title">What are you looking for?</h2>

              <form onSubmit={handleSearchSubmit} className="navbar-search-overlay__form">
                <div className="navbar-search-overlay__input-wrapper">
                  <input
                    type="text"
                    placeholder="Search for sarees, kurtis, blouses..."
                    value={navSearchQuery}
                    onChange={(e) => setNavSearchQuery(e.target.value)}
                    className="navbar-search-overlay__input"
                    autoFocus
                  />
                  <button type="submit" className="navbar-search-overlay__submit-btn">
                    <Search size={28} />
                  </button>
                </div>
              </form>

              <div className="navbar-search-overlay__suggestions">
                <p>Trending Searches:</p>
                <div className="suggestion-tags">
                  {["Banarasi", "Kurti", "Blouse", "Dupatta", "Anarkali", "Silk Saree"].map((tag) => (
                    <button
                      key={tag}
                      onClick={() => handleSuggestionClick(tag)}
                      className="suggestion-tag"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
