import { motion } from "framer-motion";
import {
  ChefHat,
  Mail,
  Phone,
  MapPin,
  Instagram,
  Youtube,
  Facebook,
  Heart,
} from "lucide-react";

const footerLinks = {
  Explore: ["Home", "All Recipes", "Top Rated", "New Arrivals", "By Cuisine"],
  Services: [
    "AI Nutrition Advisor",
    "Chef Portal",
    "Restaurant Manager",
    "Meal Planner",
  ],
  Company: ["About Us", "Blog", "Careers", "Contact"],
};

const socials = [
  { icon: Instagram, label: "Instagram" },
  { icon: Youtube, label: "YouTube" },
  { icon: Facebook, label: "Facebook" },
];

export default function Footer() {
  return (
    <footer
      style={{
        background:
          "linear-gradient(160deg, #0f172a 0%, #1e3a8a 50%, #0f172a 100%)",
        color: "#ffffff",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap"
        rel="stylesheet"
      />

      {/* Decorative blobs */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "20%",
          width: 400,
          height: 400,
          background: "rgba(59,130,246,0.08)",
          borderRadius: "50%",
          filter: "blur(80px)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          right: "15%",
          width: 320,
          height: 320,
          background: "rgba(99,102,241,0.07)",
          borderRadius: "50%",
          filter: "blur(80px)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "64px 32px 32px",
          position: "relative",
        }}
      >
        {/* Top Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 1fr",
            gap: 48,
            marginBottom: 48,
          }}
          className="mc-footer-grid"
        >
          {/* Brand column */}
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 12,
                  background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 16px rgba(59,130,246,0.4)",
                }}
              >
                <ChefHat size={22} color="#ffffff" />
              </div>
              <span
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 22,
                  fontWeight: 800,
                  color: "#ffffff",
                }}
              >
                <span style={{ color: "#93c5fd" }}>Moon</span>Cooking
              </span>
            </div>

            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 14,
                color: "#94a3b8",
                lineHeight: 1.7,
                marginBottom: 24,
                maxWidth: 280,
              }}
            >
              Discover chef-crafted recipes, get AI nutrition advice, and build
              healthy eating habits — all in one beautiful place.
            </p>

            {/* Contact */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
                marginBottom: 24,
              }}
            >
              {[
                { icon: Mail, text: "hello@mooncooking.com" },
                { icon: Phone, text: "+1 (800) 123-4567" },
                { icon: MapPin, text: "San Francisco, CA 94103" },
              ].map(({ icon: Icon, text }) => (
                <div
                  key={text}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 13,
                    color: "#94a3b8",
                  }}
                >
                  <Icon size={14} color="#60a5fa" />
                  {text}
                </div>
              ))}
            </div>

            {/* Social */}
            <div style={{ display: "flex", gap: 10 }}>
              {socials.map(({ icon: Icon, label }) => (
                <motion.button
                  key={label}
                  whileHover={{ scale: 1.12, y: -2 }}
                  aria-label={label}
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 10,
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                >
                  <Icon size={16} color="#93c5fd" />
                </motion.button>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 11,
                  fontWeight: 600,
                  color: "#ffffff",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  marginBottom: 16,
                }}
              >
                {category}
              </h4>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 10 }}
              >
                {links.map((link) => (
                  <a
                    key={link}
                    href="#"
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 14,
                      color: "#94a3b8",
                      textDecoration: "none",
                      transition: "color 0.2s",
                    }}
                    onMouseEnter={(e) => (e.target.style.color = "#93c5fd")}
                    onMouseLeave={(e) => (e.target.style.color = "#94a3b8")}
                  >
                    {link}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 20,
            padding: "24px 28px",
            marginBottom: 40,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 24,
            flexWrap: "wrap",
          }}
        >
          <div>
            <p
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 17,
                fontWeight: 700,
                color: "#ffffff",
                marginBottom: 4,
              }}
            >
              Stay in the loop
            </p>
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 13,
                color: "#94a3b8",
              }}
            >
              Weekly recipe highlights and nutrition tips, straight to your
              inbox.
            </p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              type="email"
              placeholder="your@email.com"
              style={{
                padding: "10px 16px",
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: 12,
                color: "#ffffff",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 14,
                outline: "none",
                width: 220,
              }}
            />
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              style={{
                padding: "10px 20px",
                background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                border: "none",
                borderRadius: 12,
                color: "#ffffff",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                whiteSpace: "nowrap",
                boxShadow: "0 4px 16px rgba(37,99,235,0.4)",
              }}
            >
              Subscribe
            </motion.button>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: 24,
            borderTop: "1px solid rgba(255,255,255,0.08)",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 13,
              color: "#64748b",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            © {new Date().getFullYear()} MoonCooking. Made with
            <Heart size={12} color="#f87171" fill="#f87171" />
            for food lovers worldwide.
          </p>
          <div style={{ display: "flex", gap: 24 }}>
            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map(
              (item) => (
                <a
                  key={item}
                  href="#"
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 13,
                    color: "#64748b",
                    textDecoration: "none",
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) => (e.target.style.color = "#93c5fd")}
                  onMouseLeave={(e) => (e.target.style.color = "#64748b")}
                >
                  {item}
                </a>
              ),
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .mc-footer-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 540px) {
          .mc-footer-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  );
}
