import { useEffect, useState } from "react";
import axios from "axios";
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
  
  return (
    <>
      <HomeHeader />

      <section className="blog-list">
        <div className="container">
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
