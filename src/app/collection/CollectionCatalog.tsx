"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useStore, Product } from "@/store/useStore";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Heart, ShoppingBag, Eye, X, Star, Check, ChevronRight, SlidersHorizontal } from "lucide-react";
import "./CollectionCatalog.scss";

export default function CollectionCatalog() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Zustand Store
  const products = useStore((state) => state.products);
  const cart = useStore((state) => state.cart);
  const wishlist = useStore((state) => state.wishlist);
  const addToCart = useStore((state) => state.addToCart);
  const toggleWishlist = useStore((state) => state.toggleWishlist);

  // States
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("default");
  
  // Quick View Modal
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedQty, setSelectedQty] = useState<number>(1);
  const [addedToCartSuccess, setAddedToCartSuccess] = useState(false);

  // Parse query params on mount/change
  useEffect(() => {
    const category = searchParams.get("category");
    const sub = searchParams.get("sub");
    const search = searchParams.get("search");
    
    if (category) {
      setSelectedCategory(category);
    } else {
      setSelectedCategory("All");
    }

    if (sub) {
      setActiveSubcategory(sub);
    } else {
      setActiveSubcategory(null);
    }

    if (search) {
      setSearchQuery(search);
    } else {
      setSearchQuery("");
    }
  }, [searchParams]);

  // Handle category tab click
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setActiveSubcategory(null); // Clear subcategory on main category switch
    
    // Update URL params
    const params = new URLSearchParams();
    if (category !== "All") {
      params.set("category", category);
    }
    router.push(`/collection?${params.toString()}`);
  };

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchCategory = selectedCategory === "All" || p.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchSubcategory = !activeSubcategory || p.subcategory.toLowerCase() === activeSubcategory.toLowerCase();
    const matchSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        p.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        p.desc.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchCategory && matchSubcategory && matchSearch;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price-asc") return a.price - b.price;
    if (sortBy === "price-desc") return b.price - a.price;
    if (sortBy === "rating") return b.rating - a.rating;
    return a.id - b.id; // Default / ID sort
  });

  const handleOpenQuickView = (product: Product) => {
    setSelectedProduct(product);
    setSelectedSize(product.sizes[0] || "One Size");
    setSelectedQty(1);
    setAddedToCartSuccess(false);
  };

  const handleAddToCart = () => {
    if (!selectedProduct) return;
    addToCart(selectedProduct, selectedQty, selectedSize);
    setAddedToCartSuccess(true);
    setTimeout(() => {
      setAddedToCartSuccess(false);
      setSelectedProduct(null);
    }, 1500);
  };

  const isFavorited = (productId: number) => wishlist.some((item) => item.id === productId);

  return (
    <section className="catalog-section">
      <div className="catalog-section__container">
        
        {/* Page Editorial Header */}
        <div className="catalog-header">
          <span className="catalog-header__tag">Designs of Dreams</span>
          <h1 className="catalog-header__title">
            {activeSubcategory ? activeSubcategory : `${selectedCategory} Collection`}
          </h1>
          <p className="catalog-header__desc">
            Explore our curated catalog of traditional handlooms, heavy bridal zardozi, and contemporary silhouettes.
          </p>
        </div>

        {/* Filters Controls Panel */}
        <div className="catalog-controls">
          {/* Category Tabs */}
          <div className="catalog-tabs">
            {["All", "Saree", "Kurti", "Blouse", "Dupatta"].map((cat) => (
              <button
                key={cat}
                className={`catalog-tabs__btn ${selectedCategory === cat ? "is-active" : ""}`}
                onClick={() => handleCategoryChange(cat)}
              >
                {cat === "All" ? "All Masterpieces" : `${cat}s`}
              </button>
            ))}
          </div>

          {/* Search and Sort Toolbar */}
          <div className="catalog-toolbar">
            <div className="search-box">
              <Search size={18} className="search-box__icon" />
              <input 
                type="text" 
                placeholder="Search catalog..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-box__input"
              />
            </div>

            <div className="sort-box">
              <SlidersHorizontal size={16} className="sort-box__icon" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-box__select"
              >
                <option value="default">Default Sort</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Active Subcategory Tag Indicator */}
        {activeSubcategory && (
          <div className="subcategory-indicator">
            <span>Filtering by Subcategory: <strong>{activeSubcategory}</strong></span>
            <button 
              onClick={() => {
                setActiveSubcategory(null);
                const params = new URLSearchParams();
                if (selectedCategory !== "All") params.set("category", selectedCategory);
                router.push(`/collection?${params.toString()}`);
              }}
              className="subcategory-indicator__clear"
            >
              Clear Filter <X size={14} />
            </button>
          </div>
        )}

        {/* Products Grid */}
        {sortedProducts.length === 0 ? (
          <div className="catalog-empty text-center">
            <h3>No items found</h3>
            <p>We couldn't find any products matching your active filters. Try resetting search queries or tabs.</p>
            <button 
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
                setActiveSubcategory(null);
                router.push("/collection");
              }}
              className="catalog-empty__btn"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <motion.div 
            className="product-grid"
            layout
          >
            <AnimatePresence mode="popLayout">
              {sortedProducts.map((product) => (
                <motion.div
                  key={product.id}
                  layoutId={`product-${product.id}`}
                  className="product-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                >
                  {/* Image wrapper */}
                  <div className="product-card__image-box" onClick={() => handleOpenQuickView(product)}>
                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      sizes="(max-width: 600px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="product-card__img"
                    />
                    <div className="product-card__overlay" />
                    <span className="product-card__badge">{product.badge}</span>
                    
                    {/* Hover Actions */}
                    <div className="product-card__actions" onClick={(e) => e.stopPropagation()}>
                      <button 
                        className={`action-btn ${isFavorited(product.id) ? "is-active" : ""}`}
                        onClick={() => toggleWishlist(product)}
                        title="Add to Wishlist"
                      >
                        <Heart size={18} fill={isFavorited(product.id) ? "var(--color-primary)" : "none"} />
                      </button>
                      <button 
                        className="action-btn"
                        onClick={() => handleOpenQuickView(product)}
                        title="Quick View Details"
                      >
                        <Eye size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="product-card__info">
                    <span className="product-card__category">{product.subcategory}</span>
                    <h3 className="product-card__title" onClick={() => handleOpenQuickView(product)}>
                      {product.title}
                    </h3>
                    
                    <div className="product-card__meta">
                      <span className="price">₹{product.price.toLocaleString("en-IN")}</span>
                      <div className="rating">
                        <Star size={12} fill="currentColor" />
                        <span>{product.rating}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

      </div>

      {/* QUICK VIEW DETAILS MODAL */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="popup-overlay" onClick={() => setSelectedProduct(null)}>
            <motion.div 
              className="popup-box"
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="popup-box__close" onClick={() => setSelectedProduct(null)}>
                <X size={20} />
              </button>

              <div className="popup-box__grid">
                {/* Visual Half */}
                <div className="popup-box__visual">
                  <Image
                    src={selectedProduct.image}
                    alt={selectedProduct.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    style={{ objectFit: "cover" }}
                  />
                  <div className="popup-box__visual-overlay" />
                  <span className="popup-box__visual-badge">{selectedProduct.badge}</span>
                </div>

                {/* Info Half */}
                <div className="popup-box__info">
                  <span className="popup-box__label">{selectedProduct.subcategory}</span>
                  <h2 className="popup-box__title">{selectedProduct.title}</h2>
                  <div className="popup-box__price-rating">
                    <span className="price">₹{selectedProduct.price.toLocaleString("en-IN")}</span>
                    <div className="rating">
                      <Star size={14} fill="currentColor" className="text-amber-500" />
                      <span>{selectedProduct.rating} / 5.0</span>
                    </div>
                  </div>
                  
                  <div className="popup-box__divider" />
                  <p className="popup-box__desc">{selectedProduct.longDesc}</p>
                  
                  {/* Size Selectors */}
                  <div className="popup-box__option">
                    <span className="option-label">Select Atelier Size</span>
                    <div className="size-selector">
                      {selectedProduct.sizes.map((size) => (
                        <button
                          key={size}
                          className={`size-btn ${selectedSize === size ? "is-active" : ""}`}
                          onClick={() => setSelectedSize(size)}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quantity Selectors */}
                  <div className="popup-box__option">
                    <span className="option-label">Quantity</span>
                    <div className="qty-selector">
                      <button onClick={() => setSelectedQty(Math.max(1, selectedQty - 1))}>-</button>
                      <span>{selectedQty}</span>
                      <button onClick={() => setSelectedQty(selectedQty + 1)}>+</button>
                    </div>
                  </div>

                  {/* CTA Buttons */}
                  <div className="popup-box__ctas">
                    <button 
                      className={`cart-btn ${addedToCartSuccess ? "is-success" : ""}`}
                      onClick={handleAddToCart}
                      disabled={addedToCartSuccess}
                    >
                      {addedToCartSuccess ? (
                        <>
                          Added Successfully <Check size={16} />
                        </>
                      ) : (
                        <>
                          Add to Shopping Bag <ShoppingBag size={16} />
                        </>
                      )}
                    </button>
                    
                    <button 
                      className={`wishlist-btn ${isFavorited(selectedProduct.id) ? "is-active" : ""}`}
                      onClick={() => toggleWishlist(selectedProduct)}
                    >
                      <Heart size={18} fill={isFavorited(selectedProduct.id) ? "var(--color-primary)" : "none"} />
                    </button>
                  </div>

                  <div className="popup-box__meta-details">
                    <div className="meta-row">
                      <span>Fabrics:</span>
                      <strong>{selectedProduct.fabrics.join(", ")}</strong>
                    </div>
                    <div className="meta-row">
                      <span>Heritage Details:</span>
                      <strong>{selectedProduct.features.join(", ")}</strong>
                    </div>
                  </div>

                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
}
