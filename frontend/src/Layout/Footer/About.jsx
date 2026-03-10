import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
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

        <Helmet>
         <title>About Sell Chats | AI Chatbot for Business Support & Growth</title>
         <meta name="description" content="About Sell Chats page" />
         <meta name="robots" content="index, follow" />
         <link rel="canonical" href="https://sellchats.com/about" />
         </Helmet>
            <HomeHeader />

            <section className="about-page">
                <div className="about-container">
                    <div className="about-badge">
                        {displayText}
                        <span className="cursor">|</span>
                    </div>

                    <h1 className="fade-up">About Us</h1>

                    <p className="about-desc fade-up delay-1">
                        <strong>SellChats</strong> is an AI-powered conversational platform built to
                        help businesses automate customer support and engagement effortlessly.
                        <br /><br />
                        Our intelligent, multi-language chat solutions instantly learn from your
                        website content and respond to visitors in real time — just like a trained
                        support agent.
                        <br /><br />
                        Trusted by growing teams worldwide, <strong>SellChats</strong> enables faster,
                        smarter, and scalable conversations without any code, setup, or technical
                        complexity.
                    </p>
                </div>
            </section>

       
        </>
    );
}
