"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useStore, CartItem } from "@/store/useStore";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, ShoppingBag, ArrowLeft, ShieldCheck, CheckCircle, CreditCard, Landmark, Truck, X } from "lucide-react";
import "./Cart.scss";

export default function CartPage() {
  const [mounted, setMounted] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState("");

  // Form fields
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");

  // Zustand Store
  const cart = useStore((state) => state.cart);
  const updateQuantity = useStore((state) => state.updateQuantity);
  const removeFromCart = useStore((state) => state.removeFromCart);
  const clearCart = useStore((state) => state.clearCart);
  const user = useStore((state) => state.user);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Price Calculations
  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const tax = Math.round(subtotal * 0.05); // 5% GST
  const shipping = subtotal > 1999 || subtotal === 0 ? 0 : 150;
  const grandTotal = subtotal + tax + shipping;

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Generate Random Order ID
    const randomId = "DOD-" + Math.floor(100000 + Math.random() * 900000);
    setOrderId(randomId);
    
    setTimeout(() => {
      setOrderComplete(true);
      setCheckingOut(false);
      clearCart();
    }, 1200);
  };

  return (
    <main className="relative pt-[120px] pb-[100px] bg-white min-h-screen">
      {/* Decorative background jali */}
      <div 
        className="absolute inset-0 opacity-5 pointer-events-none" 
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='40' cy='40' r='38' fill='none' stroke='%23000000' stroke-width='0.5'/%3E%3C/svg%3E\")" }} 
      />

      <div className="cart-container">
        <AnimatePresence mode="wait">
          
          {orderComplete ? (
            // SUCCESS CHECKOUT PANEL
            <motion.div 
              key="success-order"
              className="checkout-success text-center"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="success-icon-wrapper">
                <CheckCircle size={48} className="text-emerald-500" />
              </div>
              <h2 className="success-title">Order Placed Successfully</h2>
              <p className="success-subtitle">Order ID: <strong>{orderId}</strong></p>
              
              <div className="success-card">
                <h4>Thank You for Booking Heritage</h4>
                <p>A confirmation SMS and email have been sent to your registered address. Our atelier courier partner will contact you shortly to coordinate the delivery of your handloom masterpiece.</p>
                <div className="delivery-badge">
                  <Truck size={16} />
                  <span>Estimated Delivery: 4-6 business days</span>
                </div>
              </div>

              <Link href="/collection" className="back-catalog-btn">
                <ArrowLeft size={16} />
                Continue Exploring
              </Link>
            </motion.div>
          ) : cart.length === 0 ? (
            // EMPTY CART STATE
            <motion.div 
              key="empty-cart"
              className="cart-empty text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="empty-icon-wrapper">
                <ShoppingBag size={48} />
              </div>
              <h2>Your Shopping Bag is Empty</h2>
              <p>You haven't added any designer wear to your bag yet. Drape yourself in heritage with our handloom catalog.</p>
              <Link href="/collection" className="empty-cta-btn">
                Browse Master Catalog
              </Link>
            </motion.div>
          ) : (
            // FULL CART LIST & SUMMARY
            <motion.div 
              key="cart-content"
              className="cart-grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Left Column: Items List */}
              <div className="cart-items-column">
                <div className="column-header">
                  <h3>Shopping Bag ({cart.length})</h3>
                  <Link href="/collection" className="back-link">
                    <ArrowLeft size={14} />
                    Back to Catalog
                  </Link>
                </div>

                <div className="items-list">
                  {cart.map((item) => (
                    <div key={`${item.product.id}-${item.size}`} className="cart-item-card">
                      <div className="cart-item-card__img-wrapper">
                        <Image 
                          src={item.product.image} 
                          alt={item.product.title} 
                          fill
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                      
                      <div className="cart-item-card__details">
                        <span className="category">{item.product.subcategory}</span>
                        <h4 className="title">{item.product.title}</h4>
                        <span className="size">Size: <strong>{item.size}</strong></span>
                        <span className="price-unit">₹{item.product.price.toLocaleString("en-IN")} each</span>
                      </div>

                      {/* Quantity Controls */}
                      <div className="cart-item-card__qty">
                        <button onClick={() => updateQuantity(item.product.id, item.size, item.quantity - 1)}>-</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.product.id, item.size, item.quantity + 1)}>+</button>
                      </div>

                      <div className="cart-item-card__total-price">
                        <span>₹{(item.product.price * item.quantity).toLocaleString("en-IN")}</span>
                      </div>

                      <button 
                        className="cart-item-card__remove"
                        onClick={() => removeFromCart(item.product.id, item.size)}
                        title="Remove Item"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Checkout Summary */}
              <div className="cart-summary-column">
                <div className="summary-card">
                  <h3>Order Summary</h3>
                  <div className="divider" />
                  
                  <div className="summary-row">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString("en-IN")}</span>
                  </div>

                  <div className="summary-row">
                    <span>GST (5%)</span>
                    <span>₹{tax.toLocaleString("en-IN")}</span>
                  </div>

                  <div className="summary-row">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? "FREE" : `₹${shipping}`}</span>
                  </div>

                  {shipping > 0 && (
                    <p className="shipping-alert">
                      Add <strong>₹{(2000 - subtotal).toLocaleString("en-IN")}</strong> more to get free shipping!
                    </p>
                  )}

                  <div className="divider" />

                  <div className="summary-row summary-row--total">
                    <span>Grand Total</span>
                    <span>₹{grandTotal.toLocaleString("en-IN")}</span>
                  </div>

                  {/* Checkout Button */}
                  <button 
                    className="checkout-trigger-btn"
                    onClick={() => setCheckingOut(true)}
                  >
                    Proceed to Checkout
                  </button>

                  <div className="summary-trust">
                    <ShieldCheck size={16} />
                    <span>Safe & Secured Checkout</span>
                  </div>
                </div>
              </div>

            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* CHECKOUT DRAWER MODAL */}
      <AnimatePresence>
        {checkingOut && (
          <div className="checkout-overlay" onClick={() => setCheckingOut(false)}>
            <motion.div 
              className="checkout-box"
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="checkout-box__header">
                <h3>Atelier Delivery Form</h3>
                <button className="close-btn" onClick={() => setCheckingOut(false)}>
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleCheckoutSubmit} className="checkout-form">
                <div className="checkout-form__group">
                  <label>Shipping Address</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="Street Address, Apartment, Suite"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>

                <div className="checkout-form__row">
                  <div className="checkout-form__group">
                    <label>City</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="e.g. Varanasi"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    />
                  </div>
                  <div className="checkout-form__group">
                    <label>Pincode</label>
                    <input 
                      type="text" 
                      required 
                      pattern="[0-9]{6}"
                      placeholder="e.g. 221001"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                    />
                  </div>
                </div>

                <div className="checkout-form__group">
                  <label>Select Payment Mode</label>
                  <div className="payment-options">
                    <label className={`payment-option ${paymentMethod === "COD" ? "is-selected" : ""}`}>
                      <input 
                        type="radio" 
                        name="payment" 
                        value="COD"
                        checked={paymentMethod === "COD"}
                        onChange={() => setPaymentMethod("COD")}
                      />
                      <div className="option-inner">
                        <Truck size={18} />
                        <span>Cash On Delivery</span>
                      </div>
                    </label>

                    <label className={`payment-option ${paymentMethod === "UPI" ? "is-selected" : ""}`}>
                      <input 
                        type="radio" 
                        name="payment" 
                        value="UPI"
                        checked={paymentMethod === "UPI"}
                        onChange={() => setPaymentMethod("UPI")}
                      />
                      <div className="option-inner">
                        <Landmark size={18} />
                        <span>UPI Payment</span>
                      </div>
                    </label>

                    <label className={`payment-option ${paymentMethod === "CARD" ? "is-selected" : ""}`}>
                      <input 
                        type="radio" 
                        name="payment" 
                        value="CARD"
                        checked={paymentMethod === "CARD"}
                        onChange={() => setPaymentMethod("CARD")}
                      />
                      <div className="option-inner">
                        <CreditCard size={18} />
                        <span>Credit / Debit Card</span>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="order-sum-box">
                  <div className="sum-row">
                    <span>Payable Total:</span>
                    <strong>₹{grandTotal.toLocaleString("en-IN")}</strong>
                  </div>
                  {user?.isLoggedIn && (
                    <span className="user-badge">Booking as: {user.name} ({user.email})</span>
                  )}
                </div>

                <button type="submit" className="submit-order-btn">
                  Place Order Masterpiece
                </button>
              </form>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </main>
  );
}
