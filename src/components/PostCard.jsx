import { useNavigate } from "react-router-dom";

function PostCard({ post }) {
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div
      className="post-card"
      onClick={() => navigate(`/blog/${post.id}`)}
    >
      {post.image && <img src={post.image} alt={post.title} />}

      <div className="post-card-body">
        <div className="post-meta">
          <span className="category-badge">{post.category}</span>
          <span className="read-time">{post.readTime}</span>
        </div>

        <h3>{post.title}</h3>
        <p>{post.excerpt}</p>

        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <span className="post-date">{formatDate(post.createdAt)}</span>
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <span style={{ fontSize: "0.8rem", opacity: 0.5 }}>
              ❤️ {post.likes}
            </span>
            <span style={{ fontSize: "0.8rem", opacity: 0.5 }}>
              💬 {post.commentCount}
            </span>
            <span className="read-more">Read more →</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostCard;