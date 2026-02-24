import { Link } from "react-router-dom";
import { useEffect } from "react";
import HomeHeader from "../HomeHeader";
import { blogs } from "./blogData";
import "../Blog/BlogPage.css";

export default function BlogPage() {

  useEffect(() => {
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
  }, []);

  return (
    <>
      <HomeHeader />

      <section className="blog-list">
        <div className="container">

          <h2 className="animate fade-down">
            Chatbot Marketing
          </h2>

          <div className="blog-grid">
            {blogs.map((blog, index) => (
              <Link
                to={`/blog/${blog.slug}`}
                key={blog.slug}
                className={`blog-card animate fade-up delay-${index}`}
              >
                <img src={blog.image} alt={blog.title} />
                <span>{blog.category}</span>
                <h3>{blog.title}</h3>
                <p>
                  by {blog.author} • {blog.date}
                </p>
              </Link>
            ))}
          </div>

        </div>
      </section>
    </>
  );
}