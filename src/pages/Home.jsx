import { useState, useEffect } from "react";
import PostCard from "../components/PostCard";
import { getPosts } from "../api";

const categories = ["All", "Career", "React", "JavaScript", "Full Stack"];

function Home() {
  const [posts, setPosts] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const data = await getPosts(search, activeCategory);
        setPosts(data);
      } catch (err) {
        setError("Failed to load posts. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [search, activeCategory]);

  const handleSearch = () => {
    setSearch(searchInput);
  };

  const handleClearSearch = () => {
    setSearchInput("");
    setSearch("");
  };

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

        {/* SEARCH BAR */}
        <div style={{
          display: "flex",
          gap: "10px",
          justifyContent: "center",
          marginTop: "24px",
          flexWrap: "wrap",
        }}>
          <input
            type="text"
            placeholder="Search posts..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            style={{
              padding: "10px 20px",
              borderRadius: "25px",
              border: "2px solid rgba(255,255,255,0.2)",
              background: "rgba(255,255,255,0.1)",
              color: "#ffffff",
              fontSize: "0.95rem",
              width: "280px",
              outline: "none",
            }}
          />
          <button
            onClick={handleSearch}
            style={{
              padding: "10px 24px",
              borderRadius: "25px",
              border: "none",
              background: "#f6a623",
              color: "#ffffff",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Search
          </button>
          {search && (
            <button
              onClick={handleClearSearch}
              style={{
                padding: "10px 24px",
                borderRadius: "25px",
                border: "2px solid rgba(255,255,255,0.3)",
                background: "transparent",
                color: "#ffffff",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              Clear
            </button>
          )}
        </div>

        {search && (
          <p style={{
            marginTop: "12px",
            opacity: 0.6,
            fontSize: "0.9rem"
          }}>
            Showing results for "{search}"
          </p>
        )}
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

      {/* POSTS */}
      {isLoading && (
        <p style={{ textAlign: "center", opacity: 0.5, padding: "40px" }}>
          Loading posts...
        </p>
      )}

      {error && (
        <p style={{ textAlign: "center", color: "#ff6b6b", padding: "40px" }}>
          {error}
        </p>
      )}

      {!isLoading && !error && posts.length === 0 && (
        <p style={{ textAlign: "center", opacity: 0.5, padding: "40px" }}>
          No posts found.
        </p>
      )}

      {!isLoading && !error && posts.length > 0 && (
        <div className="posts-grid">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;