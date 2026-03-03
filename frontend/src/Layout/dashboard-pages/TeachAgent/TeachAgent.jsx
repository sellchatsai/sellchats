import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import "./TeachAgent.css";
import "../train-page.css";
import BotAvatar from "../../../image/Ellipse 90.png";
import aiIcon from "../../../image/TEACH YOUR AGENT.svg";
import { FiArrowLeft } from "react-icons/fi";
import { useOutletContext, useNavigate } from "react-router-dom";

const TeachAgent = ({ user }) => {
  const apiBase = "http://localhost:4000";
  const userId = user?.id || user?._id;

  const { setSidebarOpen } = useOutletContext();
  const navigate = useNavigate();


  /* ======================
     REFS
  ====================== */
  const typingIntervalRef = useRef(null);
  const bottomRef = useRef(null);

  /* ======================
     STATES
  ====================== */
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTypewriting, setIsTypewriting] = useState(false);

  /* LEAD STATES */
  const [showLeadForm, setShowLeadForm] = useState(true);
  const [leadName, setLeadName] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [leadId, setLeadId] = useState(null);

  const [checkingWebsite, setCheckingWebsite] = useState(true);

  const [labels, setLabels] = useState([]);
  const [welcomeDone, setWelcomeDone] = useState(false);

  useEffect(() => {
    if (!userId) return;

    axios
      .get(`${apiBase}/api/qa/labels/${userId}`)
      .then((res) => setLabels(res.data || []))
      .catch(() => setLabels([]));
  }, [userId]);


  /* ======================
     WEBSITE CHECK
  ====================== */
  useEffect(() => {
    const checkWebsite = async () => {
      try {
        const res = await axios.get(`${apiBase}/api/chatbot/${userId}`);
        const site = res.data?.settings?.website;

        if (!site) {
          alert("❌ Please upload a website first");
          navigate("/dashboard/knowledge");
          return;
        }
      } catch (err) {
        console.error(err);
      } finally {
        setCheckingWebsite(false);
      }
    };

    if (userId) checkWebsite();
  }, [userId, navigate]);

  /* ======================
     CLEANUP
  ====================== */
  useEffect(() => {
    return () => clearInterval(typingIntervalRef.current);
  }, []);

  /* ======================
     TYPEWRITER
  ====================== */
  const typeWriterEffect = (fullText, messageIndex) => {
    let index = 0;
    setIsTypewriting(true);

    clearInterval(typingIntervalRef.current);

    typingIntervalRef.current = setInterval(() => {
      index++;

      setMessages((prev) => {
        const updated = [...prev];
        if (!updated[messageIndex]) return prev;

        updated[messageIndex] = {
          ...updated[messageIndex],
          text: fullText.slice(0, index),
        };

        return updated;
      });

      if (index >= fullText.length) {
        clearInterval(typingIntervalRef.current);
        setIsTypewriting(false);
      }
    }, 30);
  };

  /* ======================
     GREETING (MUST BE ABOVE useEffect)
  ====================== */
  const startGreeting = useCallback((name) => {
    const msg = `Hi ${name} 👋 I'm your assistant!`;

    setMessages([{ sender: "bot", text: "" }]);

    setTimeout(() => {
      typeWriterEffect(msg, 0);
    }, 200);

    setWelcomeDone(true);
  }, []);

  /* ======================
     LOAD LEAD FROM LOCAL
  ====================== */
  useEffect(() => {
    const storedLeadId = localStorage.getItem("teachAgentLeadId");
    const storedLeadName = localStorage.getItem("teachAgentLeadName");

    if (storedLeadId && storedLeadName) {
      setLeadId(storedLeadId);
      setShowLeadForm(false);
      startGreeting(storedLeadName);
    } else {
      const msg = "Hi there 👋 I'm your assistant!";

      setMessages([{ sender: "bot", text: "" }]);

      setTimeout(() => {
        typeWriterEffect(msg, 0);
      }, 200);

      setWelcomeDone(true);
    }
  }, [startGreeting]);

  /* ======================
     AUTO SCROLL
  ====================== */
  useEffect(() => {
    const el = bottomRef.current;
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  /* ======================
     SEND MESSAGE
  ====================== */
  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = input.trim();
    setInput("");

    // 1️⃣ Add user message + typing placeholder
    setMessages((prev) => [
      ...prev,
      { sender: "user", text: userMsg },
      { sender: "bot", typing: true },
    ]);


    try {
      const res = await axios.post(`${apiBase}/api/chatbot/chat`, {
        userId,
        leadId,
        question: userMsg,
      });

      const botReply = res.data?.answer || "No reply";

      // 2️⃣ Replace last typing message
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          sender: "bot",
          text: botReply,
        };
        return updated;
      });

    } catch {
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          sender: "bot",
          text: "⚠ API Error",
        };
        return updated;
      });
    }

  };

  const validateEmail = (email) => {
    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

    return emailRegex.test(email);
  };

  if (checkingWebsite) {
    return <div className="loader-center">Checking setup...</div>;
  }

  /* ======================
     RENDER
  ====================== */
  return (
    <div className="teach-chat-container">
      <div className="teach-header">
        <div className="persona-header">
          <button className="back-btn" onClick={() => setSidebarOpen(true)}>
            <FiArrowLeft />
          </button>

          <div className="persona-icon">
            <img src={aiIcon} alt="AI" />
          </div>

          <div>
            <h2>TEACH YOUR AGENT</h2>
            <p>Prepare your Agent by simply talking</p>
          </div>
        </div>
      </div>

      <div className="chat-wrapper">
        <div className="chat-area">
          {/* ===== WELCOME MESSAGE ONLY ===== */}
          {messages.slice(0, 1).map((m, i) => (
            <div key={i} className="chat-row">
              {m.sender === "bot" && (
                <img src={BotAvatar} className="msg-avatar" alt="bot" />
              )}
              <div className={`msg-bubble ${m.sender}-msg`}>
                {m.text}
              </div>
            </div>
          ))}


          {/* ===== LABELS ALWAYS BELOW WELCOME ===== */}
          {welcomeDone && labels.length > 0 && (
            <div className="chatbot-labels">
              {labels.map((item, i) => (
                <button
                  key={i}
                  className={`label-chip ${showLeadForm ? "disabled" : ""}`}
                  disabled={showLeadForm}
                  onClick={() => {
                    if (showLeadForm || isTypewriting) return;

                    setMessages((prev) => [
                      ...prev,
                      { sender: "user", text: item.question || item.label },
                      { sender: "bot", text: item.answer },
                    ]);
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}

          {/* ===== REST OF CONVERSATION ===== */}
          {messages.slice(1).map((m, i) => (
            <div key={i} className="chat-row">
              {m.sender === "bot" && (
                <img src={BotAvatar} className="msg-avatar" alt="bot" />
              )}
              <div className={`msg-bubble ${m.sender}-msg`}>
                {m.typing ? (
                  <div className="typing-dots">
                    <span></span><span></span><span></span>
                  </div>
                ) : (
                  m.text
                )}
              </div>
            </div>
          ))}

          {showLeadForm && (
            <div className="chat-row">
              <img src={BotAvatar} className="msg-avatar" alt="bot" />

              <div className="lead-chat-bubble-teach">
                <p>Let's chat! Fill in a few details to get started.</p>

                <input
                  placeholder="Name"
                  value={leadName}
                  onChange={(e) => setLeadName(e.target.value)}
                />

                <input
                  placeholder="Email"
                  value={leadEmail}
                  onChange={(e) => setLeadEmail(e.target.value)}
                />

                <button
                  className="lead-start-btn"
                  onClick={async () => {
                    if (!leadName.trim()) {
                      alert("Please enter your name");
                      return;
                    }

                    if (!validateEmail(leadEmail)) {
                      alert("Please enter valid email address");
                      return;
                    }

                    const res = await axios.post(
                      `${apiBase}/api/chatbot/register-lead`,
                      {
                        userId,
                        name: leadName,
                        email: leadEmail,
                      }
                    );

                    const id = res.data.chatUserId;

                    localStorage.setItem("teachAgentLeadId", id);
                    localStorage.setItem("teachAgentLeadName", leadName);

                    setLeadId(id);
                    setShowLeadForm(false);

                    setMessages((prev) => [
                      ...prev,
                      {
                        sender: "bot",
                        text: `Thank you ${leadName}! How can I help you today?`,
                      },
                    ]);

                    setWelcomeDone(true);
                  }}
                >
                  Start the chat
                </button>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {!showLeadForm && (
          <div className="input-area">
            <input
              className="chat-input"
              value={input}
              placeholder="Type here"
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button className="send-mic-btn" onClick={sendMessage}>
              ➤
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeachAgent;
