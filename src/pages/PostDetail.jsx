import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import posts from "../data/posts";

function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [shareMsg, setShareMsg] = useState("");

  const post = posts.find((p) => p.id === parseInt(id));

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const handleShare = async () => {
    const shareData = {
      title: post.title,
      text: post.excerpt,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        // Native share sheet on mobile
        await navigator.share(shareData);
      } else {
        // Fallback — copy to clipboard on desktop
        await navigator.clipboard.writeText(window.location.href);
        setShareMsg("🔗 Link copied to clipboard!");
        setTimeout(() => setShareMsg(""), 3000);
      }
    } catch (error) {
      console.log("Share failed:", error);
    }
  };

  if (!post) {
    return (
      <div className="post-detail">
        <button className="back-btn" onClick={() => navigate("/")}>
          ← Back to Home
        </button>
        <h2>Post not found</h2>
      </div>
    );
  }

  return (
    <div className="post-detail">
      {/* BACK BUTTON */}
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>

      {/* POST IMAGE */}
      <img src={post.image} alt={post.title} />

      {/* POST HEADER */}
      <div className="post-header">
        <span className="category-badge">{post.category}</span>
        <h1>{post.title}</h1>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "12px"
        }}>
          <div style={{ display: "flex", gap: "16px", opacity: 0.5, fontSize: "0.9rem" }}>
            <span>{post.date}</span>
            <span>{post.readTime}</span>
          </div>

          {/* SHARE BUTTON */}
          <button
            onClick={handleShare}
            style={{
              background: "none",
              border: "2px solid #f6a623",
              color: "#f6a623",
              padding: "6px 16px",
              borderRadius: "20px",
              fontSize: "0.85rem",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.3s",
            }}
          >
            🔗 Share
          </button>
        </div>

        {/* SHARE CONFIRMATION MESSAGE */}
        {shareMsg && (
          <p style={{
            color: "#f6a623",
            fontSize: "0.85rem",
            marginTop: "8px",
            textAlign: "right"
          }}>
            {shareMsg}
          </p>
        )}
      </div>

      {/* POST CONTENT */}
      <div className="post-content">
        {post.content}
      </div>
    </div>
  );
}

export default PostDetail;