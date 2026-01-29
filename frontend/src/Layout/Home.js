import { useState } from "react";
import { useEffect, useRef } from "react";
import axios from "axios";
import HomeHeader from "./HomeHeader";
import "./Home.css";
import "../index.css";
import useScrollAnimation from "../hooks/useScrollAnimation";
import chatUI from "../image/home-main-image.svg";
import chatbotIcon from "../image/b-image-03.svg";
import googleIcon from "../image/google.png";
import companiesDesktop from "../image/companies-desktop.png";
import companiesMobile from "../image/companies-mobile.png";
import integrationsCard from "../image/integrations-card.png";
import integrationsRow from "../image/integrations-row.png";
import knowledgeImage from "../image/chat-upload.png";
import customizationImage from "../image/feature-customization.png";
import firstMessageImage from "../image/feature-first-message.png";
import conversationImage from "../image/feature-conversations.png";
import languageImage from "../image/feature-language.png";
import iconLaunch from "../image/Group 33.png";
import iconLanguage from "../image/Group 34.png";
import iconInbox from "../image/Group 35.png";
import iconFree from "../image/Group 36.png";
import review01 from "../image/review-01.png";
import review02 from "../image/review-02.png";
import review03 from "../image/review-03.png";
import review04 from "../image/review-04.png";
import review05 from "../image/review-05.png";
import badge20k from "../image/badge-20k.png";
import starIcon from "../image/Vector.png";
import arrowDownIcon from "../image/arrow-down-sign-to-navigate.png";
import shopIcon from "../image/Group.png";
import calendarIcon from "../image/Group (1).png";
import chatIcon from "../image/LiveChat-Logo-Orange-White-Stacked 1.png";
import headsetIcon from "../image/Stacked_RGB_Green 1.png";
import headsetIcon1 from "../image/zendesk_logo_icon_147198 1.png";
import botIcon from "../image/logo-animation.svg";
import checkIcon from "../image/right-arrow.png";





/* REVIEWS DATA */
const reviews = [
  {
    title: "Excellent Support & Reliable App",
    text: "“Great app great customer service always there to help when you have questions or issues to solve. Highly recommend.”",
    name: "Linaa Marcel",
    date: "@linaa7894 · Jun 2026",
    avatar: review01,
  },
  {
    title: "Top-Notch Customer Service",
    text: "“Absolutely recommend for the level of reporting and customer service provided when I had some troubles re-installing the app again.”",
    name: "Rahul Mehta",
    date: "@rahulm · May 2023",
    avatar: review02,
  },
  {
    title: "Fast, Smooth & Bug-Free",
    text: "“Easy for using, works fast no any bugs at all. Strong recommend for online e-commerce business! Really increase conversion rate!”",
    name: "Emily Carter",
    date: "@emilyc · Apr 2022",
    avatar: review03,
  },
  {
    title: "All-in-One Sales Booster",
    text: "“The app is great!!! I can literally close sales on the go and handle Instagram and other channels all from ONE PLACE! It’s super reliable, easy to use, and really helps boost my conversions!”",
    name: "Daniel Wong",
    date: "@danw · Mar 2025",
    avatar: review04,
  },
  {
    title: "A Game-Changer for E-commerce",
    text: "“Integrating SellChats into our e-commerce website has been one of the best decisions we’ve made.”",
    name: "Sophia Lee",
    date: "@sophial · Feb 2024",
    avatar: review05,
  },
];

const googleLogin = async () => {
  try {
    const res = await axios.get("http://localhost:4000/api/auth/google");
    window.location.href = res.data.url; // 🔥 direct Google login
  } catch (err) {
    console.error("Google login failed", err);
  }
};

function FAQAccordion() {
  const [activeId, setActiveId] = useState(null);

  const leftFaqs = [
    {
      id: "l1",
      q: "Can I test ChatBot for free?",
      a: "Yes, you can try ChatBot for free with limited features."
    },
    {
      id: "l2",
      q: "Are technical skills required?",
      a: "No, anyone can set it up easily."
    },
    {
      id: "l3",
      q: "Can ChatBot be integrated with LiveChat?",
      a: "Yes, ChatBot integrates smoothly with LiveChat tools."
    },
    {
      id: "l4",
      q: "What is a chatbot?",
      a: "A chatbot is software that chats with users automatically."
    }
  ];

  const rightFaqs = [
    {
      id: "r1",
      q: "Does installing ChatBot require coding?",
      a: "No coding is required. Just copy-paste the script."
    },
    {
      id: "r2",
      q: "What is a generative AI chatbot?",
      a: "It uses AI models to generate smart replies."
    },
    {
      id: "r3",
      q: "Can one chatbot work on multiple channels?",
      a: "Yes, one bot can serve website, WhatsApp and more."
    },
    {
      id: "r4",
      q: "How does a generative AI chatbot work?",
      a: "It learns from data and responds intelligently."
    }
  ];

  const toggleFAQ = (id) => {
    setActiveId(activeId === id ? null : id);
  };



  return (
    <div className="faq-grid">
      {/* LEFT COLUMN */}
      <div className="faq-col">
        {leftFaqs.map((item) => (
          <FAQItem
            key={item.id}
            item={item}
            isOpen={activeId === item.id}
            onClick={() => toggleFAQ(item.id)}
          />
        ))}
      </div>

      {/* RIGHT COLUMN */}
      <div className="faq-col">
        {rightFaqs.map((item) => (
          <FAQItem
            key={item.id}
            item={item}
            isOpen={activeId === item.id}
            onClick={() => toggleFAQ(item.id)}
          />
        ))}
      </div>
    </div>
  );
}

const handleGoogleSignup = async () => {
  try {
    const res = await axios.get("http://localhost:4000/api/auth/google");
    window.location.href = res.data.url; // 🔥 direct Google login
  } catch (err) {
    console.error("Google signup failed", err);
  }
};


function FAQItem({ item, isOpen, onClick }) {
  return (
    <div className={`faq-item ${isOpen ? "open" : ""}`}>
      <button className="faq-question" onClick={onClick}>
        {item.q}
        <span className="faq-arrow">
          <img src={arrowDownIcon} alt="arrow" />
        </span>
      </button>


      <div
        className="faq-answer-wrapper"
        style={{
          maxHeight: isOpen ? "200px" : "0",
          transition: "max-height 0.4s ease"
        }}

      >
        <div className="faq-answer">{item.a}</div>
      </div>
    </div>
  );
}

const CHAT_STEPS = [
  {
    type: "user",
    text: "Hi! What can I order from here?"
  },
  {
    type: "bot",
    text: "Hello! 🍕 This pizzeria offers a variety of pizzas, pastas, salads, and desserts. You can order for delivery, takeaway, or dine in."
  },
  {
    type: "user",
    text: "That sounds great! Do you have vegetarian options?"
  },
  {
    type: "bot",
    text: "Yes, absolutely! 🥦 We offer vegetarian pizzas, pastas with seasonal veggies, and fresh salads."
  },
  {
    type: "user",
    text: "Nice! What's your most popular pizza?"
  },
  {
    type: "bot",
    text: "Our best-seller is the Margherita Pizza 🍅🧀 — simple, fresh, and delicious."
  }
];

export default function Home() {


  const hasStartedRef = useRef(false);
  const [messages, setMessages] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);

  const [typingUser, setTypingUser] = useState("");
  const [isBotTyping, setIsBotTyping] = useState(false);

  const chatBodyRef = useRef(null);
  const bottomRef = useRef(null);



  // const navigate = useNavigate();

  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;

    const elements = document.querySelectorAll(".animate");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
            observer.unobserve(entry.target); // ✅ one-time animation
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -80px 0px"
      }
    );

    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);


  useEffect(() => {

    // 🛑 React 18 StrictMode double-run fix
    if (hasStartedRef.current && currentStep === 0) return;
    hasStartedRef.current = true;

    if (currentStep >= CHAT_STEPS.length) return;

    const step = CHAT_STEPS[currentStep];

    const runStep = async () => {

      /* ======================
         USER MESSAGE (TYPING)
      ====================== */
      if (step.type === "user") {

        let i = 0;
        setTypingUser("");

        await new Promise((resolve) => {
          const interval = setInterval(() => {
            setTypingUser((prev) => prev + step.text[i]);
            i++;

            if (i === step.text.length) {
              clearInterval(interval);
              resolve();
            }
          }, 35); // typing speed
        });

        // Add final user message
        setMessages((prev) => [...prev, step]);
        setTypingUser("");

        // wait animation complete
        await new Promise((r) => setTimeout(r, 500));

        // keep only last user message
        setMessages((prev) => prev.slice(-1));

        setCurrentStep((s) => s + 1);
      }

      /* ======================
         BOT MESSAGE
      ====================== */
      if (step.type === "bot") {

        setIsBotTyping(true);

        // thinking dots delay
        await new Promise((r) => setTimeout(r, 900));

        setIsBotTyping(false);

        // show bot answer
        setMessages((prev) => [...prev, step]);

        // wait slide-in animation
        await new Promise((r) => setTimeout(r, 600));

        // keep only user + bot
        setMessages((prev) => prev.slice(-2));

        setCurrentStep((s) => s + 1);
      }
    };

    runStep();

  }, [currentStep]);




  useEffect(() => {
    if (!bottomRef.current) return;

    bottomRef.current.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, typingUser, isBotTyping]);




  const toolItems = [
    { text: "Show products", icon: shopIcon },
    { text: "Create meeting", icon: calendarIcon },
    { text: "Transfer to live agent", icon: chatIcon },
    { text: "Create support ticket", icon: headsetIcon },
    { text: "Create support ticket", icon: headsetIcon1 },
  ];


  const [toolIndex, setToolIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setToolIndex((prev) => (prev + 1) % toolItems.length);
    }, 3200);

    return () => clearInterval(interval);
  }, [toolItems.length]);




  const sliderRef = useRef(null);

  const isPaused = useRef(false);

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    let rafId;

    const speed = window.innerWidth < 768 ? 0.22 : 0.7;

    const animate = () => {
      if (!isPaused.current) {
        slider.scrollLeft += speed;

        // 🔁 infinite loop
        if (slider.scrollLeft >= slider.scrollWidth / 2) {
          slider.scrollLeft = 0;
        }
      }
      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(rafId);
  }, []);


  useScrollAnimation();

  return (
    <>
      <HomeHeader />

      {/* HERO SECTION */}
      <section className="hero">
        <div className="container hero-inner animate-group animate">

          {/* LEFT CONTENT */}
          <div className="hero-left fade-left">
            <h1>
              AI Chatbot for <br /> your site
            </h1>

            <p>
              SellChats AI Chatbot instantly learns from your <br />
              website and uses that knowledge to<br />
              answer visitor questions — automatically.
            </p>

            <div className="hero-buttons">
              <button className="btn-google" onClick={googleLogin}>
                <img src={googleIcon} alt="Google" className="btn-icon" />
                Sign Up with Google →
              </button>
            </div>

            <div className="btn-buttom">
              <small>It’s free. No credit card required.</small>
            </div>
          </div>

          {/* RIGHT IMAGE */}
          {/* RIGHT IMAGE */}
          <div className="hero-right fade-right">
            <div className="hero-image-wrapper">

              {/* BACKGROUND IMAGE */}
              <img
                src={chatUI}
                alt="AI Chat UI"
                className="hero-image"
              />


              {/* CHATBOT */}
              <div className="hero-chatbot">
                <div className="hero-chatbot-header">
                  <img src={chatbotIcon} alt="AI" />
                  <span>AI Assistant</span>
                </div>

                <div className="hero-chatbot-body" ref={chatBodyRef}>
                  {/* RENDERED MESSAGES */}
                  {messages.map((msg, i) => (
                    <div key={i} className={`chat-msg ${msg.type}`}>
                      {msg.text}
                      {msg.type === "bot" && (
                        <div className="chat-label">Noupe AI Answered</div>
                      )}
                    </div>
                  ))}

                  {/* USER TYPING */}
                  {typingUser && (
                    <div className="chat-msg user typing">
                      {typingUser}
                      <span className="cursor">|</span>
                    </div>
                  )}

                  {/* BOT THINKING */}
                  {isBotTyping && (
                    <div className="chat-msg bot thinking">
                      <span className="dot"></span>
                      <span className="dot"></span>
                      <span className="dot"></span>
                    </div>
                  )}

                  <div ref={bottomRef} />
                </div>
              </div>

            </div>
          </div>


        </div>
      </section>




      {/* TRUSTED COMPANIES SECTION */}
      <section className="companies">
        <div className="container companies-inner animate animate-group-companies">

          <p className="companies-text">
            Empowering thousands of companies.{" "}
            <span>Join them</span>
          </p>

          {/* DESKTOP IMAGE */}
          <img
            src={companiesDesktop}
            alt="Trusted companies"
            className="companies-image desktop-only"
          />

          {/* MOBILE IMAGE */}
          <img
            src={companiesMobile}
            alt="Trusted companies"
            className="companies-image mobile-only"
          />

        </div>
      </section>


      {/* =========================
    FEATURES SECTION
========================= */}
      <section className="features">
        <div className="container">

          {/* HEADER */}
          <div className="features-header animate fade-up">
            <h2>
              <span>Key features that </span>power<span> your business</span>
            </h2>
            <p>
              SellChats is packed with customer service–ready features designed to reduce support workload
              while improving customer experience.
            </p>
          </div>

          {/* 1 */}
          <div className="feature-row">
            <div className="feature-media animate">
              <img src={integrationsCard} alt="Integrations" />
            </div>

            <div className="feature-content animate delay-1">
              <img src={integrationsRow} alt="Integrations" className="feature-icons" />
              <h3>Instant setup, no coding required</h3>
              <p>
                Grab your embed code and drop it into
                your site. That's all SellChats needs to get to
                work.
              </p>
            </div>
          </div>

          {/* 2 */}
          <div className="feature-row reverse">
            <div className="feature-media animate">
              <img src={knowledgeImage} alt="Knowledge Base" />
            </div>

            <div className="feature-content animate delay-1">
              <h3>Knowledge Base</h3>
              <p>
                Train SellChats with your own content. Add
                documents and Q&A so your SellChats can
                answer with your knowledge.
              </p>
            </div>
          </div>

          {/* 3 */}
          <div className="feature-row">
            <div className="feature-media animate">
              <img src={customizationImage} alt="Customization Options" />
            </div>

            <div className="feature-content animate delay-1">
              <h3>Customization Options</h3>
              <p>
                Make See fit your site. Adjust size,
                alignment, color and avatar for a seamless
                look.
              </p>
            </div>
          </div>

          {/* 4 */}
          <div className="feature-row reverse">
            <div className="feature-media animate">
              <img src={firstMessageImage} alt="First Message" />
            </div>

            <div className="feature-content animate delay-1">
              <h3>Knowledge Base</h3>
              <p>
                Train ChatBot with your own content. Add
                documents and Q&A so your SellChats can
                answer with your knowledge.
              </p>
            </div>
          </div>

          {/* 5 */}
          <div className="feature-row">
            <div className="feature-media animate">
              <img src={conversationImage} alt="Get conversations" />
            </div>

            <div className="feature-content animate delay-1">
              <h3>Get conversations</h3>
              <p>
                Every conversation is sent to your inbox in
                real time. See what customers ask and
                follow up fast.
              </p>
            </div>
          </div>

          {/* 6 */}
          <div className="feature-row reverse">
            <div className="feature-media animate">
              <img src={languageImage} alt="Multi-language support" />
            </div>

            <div className="feature-content animate delay-1">
              <h3>Multi-language support</h3>
              <p>
                SellChats detects each visitor's language
                and answers automatically.
              </p>
            </div>
          </div>

        </div>
      </section>





      {/* WHY WILL LOVE CHATBOT */}
      <section className="why-love">
        <div className="container">

          <div className="why-header animate fade-up">
            <h2>Why will love SellChats</h2>
            <p>
              SellChats is the easiest way to deliver automated customer support using AI. Just enter
              your website URL, and SellChats builds a chatbot that understands your business.
            </p>
          </div>

          <div className="why-list">

            <div className="why-pill animate fade-left left">
              <div className="why-icon">
                <img src={iconLaunch} alt="Launch fast" />
              </div>
              <span className="why-icon-text">Launches in minutes — no code, no training</span>
            </div>

            <div className="why-pill animate fade-right right">
              <span className="why-icon-text">Works in every language, on any website</span>
              <div className="why-icon">
                <img src={iconLanguage} alt="Languages" />
              </div>
            </div>

            <div className="why-pill animate fade-left left">
              <div className="why-icon">
                <img src={iconInbox} alt="Inbox" />
              </div>
              <span className="why-icon-text">Sends conversations directly to your inbox</span>
            </div>

            <div className="why-pill animate fade-right right">
              <span className="why-icon-text">100% free </span>
              <div className="why-icon">
                <img src={iconFree} alt="Free" />
              </div>
            </div>

          </div>
        </div>
      </section>



      {/* =========================
    TESTIMONIALS SECTION
========================= */}
      <section className="testimonials">
        <div className="">

          {/* HEADER */}
          <div className="container testimonials-header animate fade-up">
            <h2>Join our AI-delighted customers</h2>

            <div className="testimonials-meta">
              <div className="rating">
                <div className="stars-row-up">
                  {[...Array(5)].map((_, i) => (
                    <img key={i} src={starIcon} alt="Rating star" />
                  ))}
                </div>
                <span>
                  4.8 out of 5 based on<br />743 reviews
                </span>
              </div>

              <div className="customers">
                <div className="avatars">
                  <img src={review01} alt="Customer" />
                  <img src={review02} alt="Customer" />
                  <img src={review03} alt="Customer" />
                  <img src={badge20k} alt="20K+" />
                </div>
                <span>17,060+ customers</span>
              </div>
            </div>
          </div>

          {/* SLIDER */}
          <div
            className="testimonial-slider"
            ref={sliderRef}

            /* Desktop */
            onMouseEnter={() => (isPaused.current = true)}
            onMouseLeave={() => (isPaused.current = false)}

            /* Mobile */
            onTouchStart={() => (isPaused.current = true)}
            onTouchEnd={() => (isPaused.current = false)}

            /* Trackpad / wheel */
            onWheel={() => (isPaused.current = true)}
          >


            <div className="testimonial-track">
              {/* LEFT SPACER */}
              <div className="testimonial-spacer" />

              {[...reviews, ...reviews].map((r, i) => (
                <div className="testimonial-card" key={i}>
                  <div className="stars-row">
                    {[...Array(5)].map((_, j) => (
                      <img key={j} src={starIcon} alt="Star" />
                    ))}
                  </div>

                  <h4 className="testimonial-title">{r.title}</h4>
                  <p className="testimonial-des">{r.text}</p>

                  <div className="author">
                    <img src={r.avatar} alt={r.name} />
                    <div className="author-info">
                      <strong>{r.name}</strong>
                      <span>{r.date}</span>
                    </div>
                  </div>
                </div>
              ))}

              {/* RIGHT SPACER */}
              <div className="testimonial-spacer" />
            </div>

          </div>

        </div>
      </section>



      {/* CTA TRIAL SECTION */}
      <section className="cta-trial">
        <div className="container">

          <h2 className="cta-title animate fade-up">
            Get a free SellChats trial  <br />
            and become one of them
          </h2>

          <div className="cta-form animate fade-up delay-1">
            <input
              type="email"
              placeholder="Enter your business email"
            />
            <button onClick={handleGoogleSignup}>
              Sign Up free
            </button>

          </div>

          <div className="cta-points animate fade-up delay-2">
            <span className="cta-point">
              <img src={checkIcon} alt="check" />
              Free 14-day trial
            </span>

            <span className="cta-point">
              <img src={checkIcon} alt="check" />
              No credit card required
            </span>
          </div>


        </div>
      </section>


      {/* ========        FAQ SECTION  ========== */}
      <section className="faq-section">
        <div className="container">
          <h2 className="faq-title animate fade-up">
            Frequently Asked Questions
          </h2>

          <FAQAccordion />
        </div>
      </section>


      <section className="tools-section">
        <h2 className="guarantee-title animate fade-up tools-label">
          Tools
        </h2>
        <div className="container tools-inner">

          {/* LEFT */}
          <div className="tools-left">

            <h2>
              Get more value from <br />
              your favorite tools
            </h2>

            <p>
              Enhance your AI chatbot with more features,
              workflows, and automations through plug-and-play integrations.
            </p>

            <button className="tools-btn">
              See all integrations
            </button>
          </div>

          {/* RIGHT */}
          <div className="tools-right">

            {/* FIXED BOT ICON */}
            <div className="bot-icon">
              <img src={botIcon} alt="Bot" />
            </div>

            {/* DOTTED CONNECTOR */}
            <div className="bot-connector" />

            {[0, 1, 2, 3, 4].map((pos) => {
              const item =
                toolItems[
                (toolIndex + pos - 2 + toolItems.length) % toolItems.length
                ];

              const isCenter = pos === 2;

              return (
                <div
                  key={pos}
                  className={`tool-box b${pos + 1} ${isCenter ? "active" : ""}`}
                >
                  <img src={item.icon} alt={item.text} className="tool-icon" />
                  <span className="tool-text">{item.text}</span>
                </div>
              );
            })}
          </div>


        </div>
      </section>

    </>
  );
}




