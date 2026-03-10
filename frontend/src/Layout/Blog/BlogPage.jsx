import { useEffect, useState } from "react";
import axios from "axios";
import { Helmet } from "react-helmet-async";
import HomeHeader from "../HomeHeader";
import "../Blog/BlogPage.css";

export default function BlogPage() {

  const [blogs, setBlogs] = useState([]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);

    const day = date.getDate();
    const month = date.toLocaleString("en-US", { month: "long" });
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
  };

  const loadBlogs = async () => {
    try {

      const res = await axios.get("https://api.sellchats.com/api/blog");

      console.log(res.data); // check console

      setBlogs(res.data);

    } catch (err) {
      console.log("Blog fetch error:", err);
    }
  };

  useEffect(() => {

    loadBlogs();

    const elements = document.querySelectorAll(".animate");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-active");
          }
        });
      },
      { threshold: 0.15 }
    );

    elements.forEach((el) => observer.observe(el));
     return () => observer.disconnect();

  }, []);

    const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Sell Chats Blog",
    url: "https://sellchats.com/blog",
    description:
      "Read Sell Chats blogs about AI chatbots, real estate chatbots, ecommerce chatbots, coaching chatbots, and business automation.",
    publisher: {
      "@type": "Organization",
      name: "Sell Chats",
      url: "https://sellchats.com/"
    }
  };

  return (
    <>
       <Helmet>
    <title>AI Chatbot Blog for Business Growth, Sales & Automation | Sell Chats</title>
        <meta
  name="description"
  content="Explore Sell Chats blogs on AI chatbots, real estate chatbots, ecommerce automation, coaching chatbots, lead generation, sales growth, and smart business support."
/>

        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://sellchats.com/blog" />

        <script type="application/ld+json">
          {JSON.stringify(blogSchema)}
        </script>
      </Helmet>
      <HomeHeader />

      <section className="blog-list">
        <div className="container">

          <h1 className="animate fade-down">
            Chatbot Marketing
          </h1>

          <div className="blog-grid">

            {blogs.map((blog, index) => (

              <a
                href={blog.link}
                target="_blank"
                rel="noopener noreferrer"
                key={blog._id}
                className={`blog-card animate fade-up delay-${index}`}
              >

                <img
                  src={`https://api.sellchats.com/uploads/blogs/${blog.image}`}
                  alt={blog.title}
                />

                <span>{blog.label}</span>

                <h2>{blog.title}</h2>

                <p>
                  by {blog.author} • {formatDate(blog.date)}
                </p>

              </a>

            ))}

          </div>

        </div>
      </section>
    </>
  );
}
