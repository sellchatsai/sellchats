import { useState, useEffect } from "react";
import HomeHeader from "./HomeHeader";
import arrowDownIcon from "../image/arrow-down-sign-to-navigate.png";
import "./FAQPage.css";

const leftFaqs = [
  { id: "l1", q: "Can I test ChatBot for free?", a: "Yes, you can try ChatBot for free with limited features." },
  { id: "l2", q: "Are technical skills required?", a: "No, anyone can set it up easily without any coding." },
  { id: "l3", q: "Can ChatBot be integrated with LiveChat?", a: "Yes, ChatBot integrates smoothly with LiveChat tools." },
  { id: "l4", q: "What is a chatbot?", a: "A chatbot is software that chats with users automatically." }
];

const rightFaqs = [
  { id: "r1", q: "Does installing ChatBot require coding?", a: "No coding is required. Just copy-paste the script." },
  { id: "r2", q: "What is a generative AI chatbot?", a: "It uses AI models to generate smart replies." },
  { id: "r3", q: "Can one chatbot work on multiple channels?", a: "Yes, one bot can serve website, WhatsApp and more." },
  { id: "r4", q: "How does a generative AI chatbot work?", a: "It learns from your content and responds intelligently." }
];

function FAQItem({ item, isOpen, onClick }) {
  return (
    <div className={`faq-item fade-up ${isOpen ? "open" : ""}`}>
      <button className="faq-question" onClick={onClick}>
        {item.q}
        <span className="faq-arrow">
          <img src={arrowDownIcon} alt="arrow" />
        </span>
      </button>

      <div
        className="faq-answer-wrapper"
        style={{ maxHeight: isOpen ? "160px" : "0px" }}
      >
        <div className="faq-answer">{item.a}</div>
      </div>
    </div>
  );
}

export default function FAQPage() {
  const [activeId, setActiveId] = useState(null);

  // Scroll animation
  useEffect(() => {
    const items = document.querySelectorAll(".fade-up");

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
          }
        });
      },
      { threshold: 0.15 }
    );

    items.forEach(item => observer.observe(item));

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <HomeHeader />

      <section className="faq-section-page">
        <div className="container">
          <h1 className="faq-title fade-up">
            Frequently Asked Questions
          </h1>

          <div className="faq-grid">
            <div className="faq-col">
              {leftFaqs.map(item => (
                <FAQItem
                  key={item.id}
                  item={item}
                  isOpen={activeId === item.id}
                  onClick={() =>
                    setActiveId(activeId === item.id ? null : item.id)
                  }
                />
              ))}
            </div>

            <div className="faq-col">
              {rightFaqs.map(item => (
                <FAQItem
                  key={item.id}
                  item={item}
                  isOpen={activeId === item.id}
                  onClick={() =>
                    setActiveId(activeId === item.id ? null : item.id)
                  }
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
