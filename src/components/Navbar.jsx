"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, Menu, X, ShoppingBag, User, LogOut, AlertCircle } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useCart } from "@/context/CartContext";

export function Navbar() {
  const pathname = usePathname();
  const { totalItems, storeStatus } = useCart();
  const { user, logout } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Apply global padding to body when the banner is visible to prevent overlap
  useEffect(() => {
    const hiddenNavPages = ['/cart', '/checkout', '/order-success', '/login', '/signup'];
    const isNavHidden = hiddenNavPages.some(p => pathname?.startsWith(p)) || pathname?.startsWith('/product');
    
    if (mounted && storeStatus && !storeStatus.isOpen && !isNavHidden) {
      document.body.style.paddingTop = '40px';
    } else {
      document.body.style.paddingTop = '0px';
    }
    return () => { document.body.style.paddingTop = '0px'; };
  }, [mounted, storeStatus, pathname]);

  useEffect(() => {
    setMounted(true);
    setScrolled(window.scrollY > 20);
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Menu", href: "/menu" },
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  // Do not render Navbar on product and order-success pages
  if (pathname?.startsWith("/product") || pathname === "/order-success") {
    return null;
  }

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    setMobileOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 w-full ${mounted ? "transition-[background-color,box-shadow] duration-300" : ""} bg-white shadow-[0_4px_20px_rgb(0,0,0,0.08)] ${scrolled ? "" : "lg:bg-transparent lg:shadow-none"} ${pathname === '/profile' ? 'lg:hidden' : ''}`}
    >
      {/* Global Store Closed Banner */}
      {mounted && storeStatus && !storeStatus.isOpen && (
        <div className="w-full bg-[#E53E3E] text-white text-center py-2.5 px-4 text-xs md:text-sm font-bold shadow-sm z-50 flex items-center justify-center gap-2 tracking-wide" style={{ fontFamily: "var(--font-outfit)" }}>
          <AlertCircle className="w-4 h-4" />
          <span>{storeStatus.message}</span>
        </div>
      )}
      <div
        className={`container ${mounted ? "transition-[padding] duration-300 ease-out" : ""} py-0 ${scrolled ? "" : "lg:py-4"}`}
      >
        <div
          className={`flex items-center justify-between ${mounted ? "transition-[background-color,border-color,box-shadow,padding,border-radius] duration-300 ease-out" : ""} h-20 px-4 border border-transparent bg-transparent shadow-none ${scrolled ? "lg:px-0" : "lg:px-8 lg:bg-white/95 lg:shadow-[0_8px_30px_rgba(22,163,74,0.1)] lg:rounded-2xl lg:border-[#16A34A]/20"}`}
        >
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 shrink-0 lg:ml-12 xl:ml-16"
          >
            <img
              src="/logo.jpeg"
              alt="Lalbaug Roti House"
              className="h-14 md:h-16 w-auto object-contain rounded-2xl shadow-sm border border-[#EAE5D9] hover:scale-105 transition-transform duration-500"
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
                    isActive
                      ? "text-[#16A34A] bg-[#16A34A]/10"
                      : "text-[#114D3C] hover:bg-[#F2ECE4] hover:text-[#16A34A]"
                  }`}
                  style={{ fontFamily: "var(--font-outfit)" }}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-4 relative">
            
            {/* Cart */}
            <Link
              href="/cart"
              className="relative hidden lg:flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-sm text-[#114D3C] border border-[#EAE5D9] hover:border-[#16A34A] hover:text-[#16A34A] hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
            >
              <ShoppingCart className="w-5 h-5" />
              {mounted && totalItems > 0 && (
                <span
                  className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#E53E3E] shadow-sm text-[11px] font-bold text-white border-2 border-white"
                  style={{ fontFamily: "var(--font-outfit)" }}
                >
                  {totalItems > 9 ? "9+" : totalItems}
                </span>
              )}
            </Link>

            {/* User Profile / Login (Desktop) */}
            <div className="hidden lg:block relative min-w-[90px] h-[38px]" ref={dropdownRef}>
              {mounted ? (
                user ? (
                  <div className="relative">
                    <button 
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#EAE5D9] hover:border-[#16A34A] transition-colors bg-white shadow-sm h-[38px]"
                    >
                      <div className="w-6 h-6 rounded-full bg-[#16A34A] text-white flex items-center justify-center font-bold text-xs uppercase">
                        {user.name.charAt(0)}
                      </div>
                      <span className="text-sm font-bold text-[#114D3C] max-w-[100px] truncate" style={{ fontFamily: "var(--font-outfit)" }}>
                        {user.name.split(' ')[0]}
                      </span>
                    </button>

                    {/* Dropdown Menu */}
                    {dropdownOpen && (
                      <div className="absolute right-0 mt-3 w-48 bg-white border border-[#EAE5D9] rounded-2xl shadow-xl py-2 z-50">
                        <div className="px-4 py-3 border-b border-[#EAE5D9] mb-2">
                          <p className="text-sm font-bold text-[#114D3C] truncate">{user.name}</p>
                          <p className="text-xs text-[#73706A] truncate">{user.phone}</p>
                        </div>
                        <Link 
                          href="/profile"
                          onClick={() => setDropdownOpen(false)}
                          className="w-full text-left px-4 py-2 text-sm text-[#114D3C] hover:bg-[#FAF8F5] flex items-center gap-2 transition-colors font-bold"
                          style={{ fontFamily: "var(--font-outfit)" }}
                        >
                          <User className="w-4 h-4" /> My Profile
                        </Link>
                        <button 
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors font-bold mt-1"
                          style={{ fontFamily: "var(--font-outfit)" }}
                        >
                          <LogOut className="w-4 h-4" /> Logout
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href="/login"
                    className="flex items-center justify-center gap-2 text-[#114D3C] text-sm font-bold px-4 h-[38px] rounded-full hover:bg-[#FAF8F5] border border-transparent hover:border-[#EAE5D9] transition-all w-[90px]"
                    style={{ fontFamily: "var(--font-outfit)" }}
                  >
                    <User className="w-4 h-4" /> Login
                  </Link>
                )
              ) : (
                <div className="w-[90px] h-[38px]"></div>
              )}
            </div>

            {/* Hamburger - mobile */}
            <button
              className="lg:hidden flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-sm text-[#114D3C] border border-[#EAE5D9] hover:bg-[#FAF8F5] transition-colors"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Backdrop */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]" onClick={() => setMobileOpen(false)}></div>
      )}

      {/* Mobile Menu Drawer */}
      <div className={`lg:hidden fixed top-0 right-0 h-full w-[85%] max-w-sm bg-white shadow-2xl z-[70] transform transition-transform duration-300 ease-out flex flex-col ${mobileOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 flex items-center justify-start border-b border-[#EAE5D9]">
          <button onClick={() => setMobileOpen(false)} className="p-2 bg-[#FAF8F5] rounded-full text-[#1A4D2E] border border-[#EAE5D9]">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 flex flex-col gap-3 overflow-y-auto flex-1">
          {/* Nav Links */}
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`p-4 rounded-2xl text-base font-bold transition-colors ${
                pathname === link.href
                  ? "text-white bg-[#114D3C]"
                  : "text-[#2C3E35] hover:bg-[#FAF8F5]"
              }`}
              style={{ fontFamily: "var(--font-outfit)" }}
            >
              {link.name}
            </Link>
          ))}

          {/* Profile Link (Simple Option) */}
          {mounted && user && (
            <Link
              href="/profile"
              onClick={() => setMobileOpen(false)}
              className={`p-4 rounded-2xl text-base font-bold transition-colors ${
                pathname === "/profile"
                  ? "text-white bg-[#114D3C]"
                  : "text-[#2C3E35] hover:bg-[#FAF8F5]"
              }`}
              style={{ fontFamily: "var(--font-outfit)" }}
            >
              Profile
            </Link>
          )}

          {/* Mobile Cart Link */}
          <Link
            href="/cart"
            onClick={() => setMobileOpen(false)}
            className="p-4 rounded-2xl text-base font-bold text-[#114D3C] bg-[#FAF5E9] hover:bg-[#F2ECE4] border border-[#E8E1D5] flex items-center justify-between mb-2 mt-2 transition-colors"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-[#8B5E3C]" /> Cart
            </div>
            {mounted && totalItems > 0 && (
              <span className="bg-[#16A34A] text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                {totalItems} items
              </span>
            )}
          </Link>

          {/* User Info Mobile (Moved to Bottom) */}
          {mounted && user ? (
            <Link href="/profile" onClick={() => setMobileOpen(false)} className="p-4 bg-[#FAF8F5] rounded-2xl mt-2 border border-[#EAE5D9] flex items-center justify-between transition-colors hover:bg-[#F2ECE4]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#16A34A] text-white flex items-center justify-center font-bold text-lg uppercase">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-[#114D3C]">{user.name}</p>
                  <p className="text-xs text-[#73706A]">{user.phone}</p>
                </div>
              </div>
              <button onClick={(e) => { e.preventDefault(); handleLogout(); }} className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors">
                <LogOut className="w-5 h-5" />
              </button>
            </Link>
          ) : (
            mounted && !user && (
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="p-4 rounded-2xl text-base font-bold text-[#114D3C] hover:bg-[#FAF8F5] border border-[#EAE5D9] flex items-center gap-2 mt-2"
                style={{ fontFamily: "var(--font-outfit)" }}
              >
                <User className="w-5 h-5" /> Login / Sign Up
              </Link>
            )
          )}
        </div>
      </div>
    </header>
  );
}
