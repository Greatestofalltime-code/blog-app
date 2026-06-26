import { useState } from "react";
import PostCard from "../components/PostCard";
import posts from "../data/posts";

const categories = ["All", "Career", "React", "JavaScript", "Full Stack"];

function Home() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredPosts =
    activeCategory === "All"
      ? posts
      : posts.filter((post) => post.category === activeCategory);

  return (
    <div>
      {/* HERO */}
      <div className="hero">
        <h1>
          Thoughts on <span>Software Engineering</span>
        </h1>
        <p>
          A developer blog documenting the journey from IT Project Manager
          to Full Stack Software Engineer.
        </p>
      </div>

      {/* CATEGORY FILTERS */}
      <div className="filters">
        {categories.map((category) => (
          <button
            key={category}
            className={`filter-btn ${activeCategory === category ? "active" : ""}`}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* POSTS GRID */}
      <div className="posts-grid">
        {filteredPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}

export default Home;