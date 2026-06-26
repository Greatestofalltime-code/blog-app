import { useNavigate } from "react-router-dom";

function PostCard({ post }) {
  const navigate = useNavigate();

  return (
    <div
      className="post-card"
      onClick={() => navigate(`/blog/${post.id}`)}
    >
      <img src={post.image} alt={post.title} />

      <div className="post-card-body">
        <div className="post-meta">
          <span className="category-badge">{post.category}</span>
          <span className="read-time">{post.readTime}</span>
        </div>

        <h3>{post.title}</h3>
        <p>{post.excerpt}</p>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span className="post-date">{post.date}</span>
          <span className="read-more">Read more →</span>
        </div>
      </div>
    </div>
  );
}

export default PostCard;