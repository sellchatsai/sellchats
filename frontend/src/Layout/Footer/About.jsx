import { useEffect, useState } from "react";
import HomeHeader from "../HomeHeader";
import "./About.css";

export default function About() {
    const text =
        "SellChats is proudly developed by SellChats, trusted by millions of users worldwide.";
    const [displayText, setDisplayText] = useState("");
    const [index, setIndex] = useState(0);

    // Typing animation
    useEffect(() => {
        if (index < text.length) {
            const timer = setTimeout(() => {
                setDisplayText((prev) => prev + text[index]);
                setIndex(index + 1);
            }, 25);
            return () => clearTimeout(timer);
        }
    }, [index, text]);
    
    const aboutSchema = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: "About Sell Chats",
  url: "https://sellchats.com/about",
  description:
    "Learn about Sell Chats, an AI-powered chatbot platform that helps businesses automate customer support, engagement, and lead conversations.",
  mainEntity: {
    "@type": "Organization",
    name: "Sell Chats",
    url: "https://sellchats.com/",
    description:
      "Sell Chats is an AI-powered conversational platform built to help businesses automate customer support, engagement, and lead generation."
  }
};

    return (
        <>
            <HomeHeader />

            <section className="about-page">
                <div className="about-container">
                    <div className="about-badge">
                        {displayText}
                        <span className="cursor">|</span>
                    </div>

                    <h1 className="fade-up">About Us</h1>

                   <p className="about-desc fade-up delay-1">
  <strong>SellChats</strong> is an AI-powered chatbot platform built to help businesses automate customer support, lead generation, and website engagement with smart real-time conversations.
  <br /><br />
  Our intelligent, multi-language chat solutions learn from your website content and instantly respond to visitors like a trained virtual assistant — helping businesses save time, improve response speed, and increase conversions.
  <br /><br />
  Whether you run a <strong>real estate business</strong>, <strong>ecommerce store</strong>, <strong>coaching business</strong>, or service-based company, <strong>SellChats</strong> helps you manage customer queries, capture leads, and scale support without coding, complex setup, or technical hassle.
</p>
                </div>
            </section>

       
        </>
    );
}
