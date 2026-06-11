"use client";
import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation";
import { Phone, MapPin, Mail, ChevronRight, Send } from "lucide-react"
import axios from "axios"

const FacebookIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
)

const InstagramIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
)

export function Footer() {
  const pathname = usePathname();
  const [settings, setSettings] = useState(null)

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/settings`, { validateStatus: () => true })
        const data = res.data
        if (data.success && data.data) {
          setSettings(data.data)
        }
      } catch (err) {
        console.error("Failed to fetch settings", err)
      }
    }
    fetchSettings()
  }, [])

  if (pathname === '/order-success') return null;

  return (
    <footer className="bg-[#0B382B] text-white/80 border-t-4 border-[#C19B6C] relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#114D3C] rounded-full blur-3xl opacity-50"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#C19B6C]/10 rounded-full blur-3xl opacity-50"></div>
      </div>

      <div className="container py-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">

          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="mb-8 inline-block">
              <img src="/logo.jpeg" alt="Lalbaug Roti House" className="h-16 md:h-20 w-auto object-contain rounded-2xl shadow-sm border border-[#EAE5D9]" />
            </div>
            <p className="text-sm leading-relaxed mb-8 pr-4 text-white/70 font-medium" style={{ fontFamily: "var(--font-outfit)" }}>
              {settings?.footerDescription || 'Fresh handmade rotis, bhakari, thepla and traditional food delivered daily in Mumbai with love and care.'}
            </p>
            <div className="flex items-center gap-4">
              <a href={settings?.instagramUrl || '#'} target="_blank" rel="noopener noreferrer" className="w-11 h-11 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white hover:bg-[#C19B6C] hover:border-[#C19B6C] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(193,155,108,0.3)]" aria-label="Instagram">
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a href={settings?.facebookUrl || '#'} target="_blank" rel="noopener noreferrer" className="w-11 h-11 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white hover:bg-[#C19B6C] hover:border-[#C19B6C] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(193,155,108,0.3)]" aria-label="Facebook">
                <FacebookIcon className="w-4 h-4" />
              </a>
              <a href={`https://wa.me/${settings?.whatsappNumber || '919920688099'}`} target="_blank" rel="noopener noreferrer" className="w-11 h-11 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white hover:bg-[#C19B6C] hover:border-[#C19B6C] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(193,155,108,0.3)]" aria-label="WhatsApp">
                <Phone className="w-4 h-4 fill-current" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-8 flex items-center gap-2" style={{ fontFamily: "var(--font-outfit)" }}>
              <span className="w-4 h-[2px] bg-[#C19B6C]"></span> Explore
            </h4>
            <ul className="space-y-4">
              {[
                { name: "Home", href: "/" },
                { name: "Our Menu", href: "/menu" },
                { name: "About Us", href: "/about" },
                { name: "Contact", href: "/contact" },
              ].map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-white/70 text-sm hover:text-white transition-all flex items-center group overflow-hidden w-fit" style={{ fontFamily: "var(--font-outfit)" }}>
                    <ChevronRight className="w-4 h-4 text-[#C19B6C] opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300 ease-out" />
                    <span className="transition-all duration-300 ease-out group-hover:translate-x-1 font-medium">{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Menu */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-8 flex items-center gap-2" style={{ fontFamily: "var(--font-outfit)" }}>
              <span className="w-4 h-[2px] bg-[#C19B6C]"></span> Bestsellers
            </h4>
            <ul className="space-y-4">
              {[
                { name: "Soft Phulka Roti", href: "/menu?cat=Roti" },
                { name: "Jowar Bhakari", href: "/menu?cat=Bhakari" },
                { name: "Methi Thepla", href: "/menu?cat=Thepla" },
                { name: "Daily Combo Meals", href: "/menu?cat=Daily Combo" },
                { name: "Puran Poli", href: "/menu?cat=Special Roti" },
              ].map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-white/70 text-sm hover:text-white transition-all flex items-center group overflow-hidden w-fit" style={{ fontFamily: "var(--font-outfit)" }}>
                    <ChevronRight className="w-4 h-4 text-[#C19B6C] opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300 ease-out" />
                    <span className="transition-all duration-300 ease-out group-hover:translate-x-1 font-medium">{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-8 flex items-center gap-2" style={{ fontFamily: "var(--font-outfit)" }}>
              <span className="w-4 h-[2px] bg-[#C19B6C]"></span> Contact Us
            </h4>
            <ul className="space-y-5 text-sm mb-8" style={{ fontFamily: "var(--font-outfit)" }}>
              <li className="flex gap-4 items-start group">
                <div className="w-8 h-8 rounded-full bg-[#C19B6C]/10 flex items-center justify-center shrink-0 group-hover:bg-[#C19B6C] transition-colors duration-300">
                  <MapPin className="w-4 h-4 text-[#C19B6C] group-hover:text-white transition-colors duration-300" />
                </div>
                <span className="leading-relaxed text-white/70 group-hover:text-white transition-colors whitespace-pre-line">
                  {settings?.restaurantAddress || 'Shop No 17/45, HY, Ganesh Nagar,\nLal Baug, Mumbai - 400012'}
                </span>
              </li>
              <li className="flex gap-4 items-start group">
                <div className="w-8 h-8 rounded-full bg-[#C19B6C]/10 flex items-center justify-center shrink-0 group-hover:bg-[#C19B6C] transition-colors duration-300">
                  <Phone className="w-4 h-4 text-[#C19B6C] group-hover:text-white transition-colors duration-300" />
                </div>
                <span className="leading-relaxed text-white/70 group-hover:text-white transition-colors">
                  {settings?.restaurantPhone ? `+91 ${settings.restaurantPhone}` : '+91 93246 88099'} / {settings?.whatsappNumber ? `+${settings.whatsappNumber}` : '+91 99206 88099'}<br />
                  <span className="text-[#C19B6C] text-xs font-medium">Mon-Sun, {settings?.serviceStartTime || '10:00'} - {settings?.serviceEndTime || '22:00'}</span>
                </span>
              </li>
              <li className="flex gap-4 items-start group">
                <div className="w-8 h-8 rounded-full bg-[#C19B6C]/10 flex items-center justify-center shrink-0 group-hover:bg-[#C19B6C] transition-colors duration-300">
                  <Mail className="w-4 h-4 text-[#C19B6C] group-hover:text-white transition-colors duration-300" />
                </div>
                <span className="leading-relaxed text-white/70 group-hover:text-white transition-colors">{settings?.restaurantEmail || 'lalbaugrotihouse@gmail.com'}</span>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 bg-[#082A20] relative z-10">
        <div className="container py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/50 text-xs font-medium" style={{ fontFamily: "var(--font-outfit)" }}>
            © {new Date().getFullYear()} Lalbaug Roti House. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-6 text-white/70 text-xs font-bold tracking-[0.2em] uppercase" style={{ fontFamily: "var(--font-outfit)" }}>
            <span className="hover:text-[#C19B6C] transition-colors cursor-default">Pure Veg</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#C19B6C] hidden sm:block"></span>
            <span className="hover:text-[#C19B6C] transition-colors cursor-default">Made Fresh Daily</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#C19B6C] hidden sm:block"></span>
            <span className="hover:text-[#C19B6C] transition-colors cursor-default">Mumbai</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
