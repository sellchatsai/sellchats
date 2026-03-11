import { Link } from "react-router-dom";
import { FaGlobe } from "react-icons/fa";
import "./Footer.css";

export default function Footer() {
    return (
        <footer className="noupe-footer">

            <div className="noupe-footer-top">
                <ul className="noupe-links">
                    <li><Link to="/terms">Terms & Conditions</Link></li>
                    <span>|</span>
                    <li><Link to="/privacy">Privacy Policy</Link></li>
                    <span>|</span>
                    <li><Link to="/about">About Us</Link></li>
                    <span>|</span>
                    <li><Link to="/contact-support">Contact Us</Link></li>
                    <span>|</span>
                    <li><Link to="/pricing">Pricing</Link></li>
                    <span>|</span>
                </ul>

                <div className="noupe-lang">
                    <FaGlobe />
                    <span>English</span>
                </div>
            </div>

           <p className="noupe-desc">
  SellChats provides enterprise-grade AI chatbot APIs that help businesses deploy intelligent,
  multi-language conversational assistants on their websites. Our platform allows companies to
  automate customer support, capture leads, and engage visitors through real-time conversations.
  <br /><br />
  With automatic knowledge ingestion and fast integration, businesses can launch powerful AI
  chatbots without training data, coding, or infrastructure management. From real estate
  inquiries to ecommerce support and service-based businesses, SellChats helps teams automate
  conversations and scale customer engagement effortlessly.
</p>

            <div className="noupe-footer-bottom">
                SellChats © 2026 · All rights reserved
            </div>

        </footer>
    );
}
