import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  createPost,
  updatePost,
  deletePost,
  getAdminPosts,
} from "../api";
import { useAuth } from "../context/AuthContext";

const emptyForm = {
  title: "",
  excerpt: "",
  content: "",
  category: "Career",
  image: "",
  readTime: "",
  published: true,
};

function Admin() {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("create");

  useEffect(() => {
    if (user?.role === "admin") {
      fetchAdminPosts();
    }
  }, [user]);

  const fetchAdminPosts = async () => {
    try {
      const data = await getAdminPosts(token);
      setPosts(data);
    } catch (err) {
      console.log("Failed to fetch posts:", err);
    }
  };

  if (!user || user.role !== "admin") {
    return (
      <div style={{ textAlign: "center", padding: "80px 20px" }}>
        <h2>Access Denied</h2>
        <p style={{ opacity: 0.6, marginTop: "12px" }}>
          You must be an admin to view this page.
        </p>
      </div>
    );
  }

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!form.title || !form.excerpt || !form.content || !form.readTime) {
      setError("Please fill in all required fields");
      return;
    }
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      if (editingId) {
        await updatePost(editingId, form, token);
        setSuccess("Post updated successfully!");
      } else {
        await createPost(form, token);
        setSuccess("Post published successfully!");
      }
      setForm(emptyForm);
      setEditingId(null);
      fetchAdminPosts();
    } catch (err) {
      setError("Failed to save post. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (post) => {
    setForm({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      category: post.category,
      image: post.image || "",
      readTime: post.readTime,
      published: post.published,
    });
    setEditingId(post.id);
    setActiveTab("create");
    window.scrollTo(0, 0);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this post permanently?")) return;
    try {
      await deletePost(id, token);
      setPosts((prev) => prev.filter((p) => p.id !== id));
      setSuccess("Post deleted.");
    } catch (err) {
      setError("Failed to delete post.");
    }
  };

  const handleTogglePublish = async (post) => {
    try {
      await updatePost(post.id, { ...post, published: !post.published }, token);
      setPosts((prev) =>
        prev.map((p) =>
          p.id === post.id ? { ...p, published: !p.published } : p
        )
      );
    } catch (err) {
      setError("Failed to update post.");
    }
  };

  const handleCancel = () => {
    setForm(emptyForm);
    setEditingId(null);
    setError("");
    setSuccess("");
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "60px 20px" }}>
      <h1 style={{ fontSize: "2rem", fontWeight: "700", marginBottom: "8px" }}>
        Admin Panel
      </h1>
      <p style={{ opacity: 0.6, marginBottom: "30px" }}>
        Manage your blog posts
      </p>

      {/* TABS */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "40px" }}>
        {["create", "manage"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: "10px 24px",
              borderRadius: "20px",
              border: "2px solid #f6a623",
              background: activeTab === tab ? "#f6a623" : "transparent",
              color: activeTab === tab ? "#ffffff" : "#f6a623",
              fontWeight: "600",
              cursor: "pointer",
              textTransform: "capitalize",
            }}
          >
            {tab === "create"
              ? editingId
                ? "✏️ Edit Post"
                : "✍️ Create Post"
              : `📋 Manage Posts (${posts.length})`}
          </button>
        ))}
      </div>

      {/* FEEDBACK */}
      {error && (
        <p style={{ color: "#ff6b6b", marginBottom: "16px", fontSize: "0.9rem" }}>
          {error}
        </p>
      )}
      {success && (
        <p style={{ color: "#51cf66", marginBottom: "16px", fontSize: "0.9rem" }}>
          {success}
        </p>
      )}

      {/* CREATE / EDIT TAB */}
      {activeTab === "create" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {editingId && (
            <div style={{
              padding: "12px 16px",
              background: "rgba(246,166,35,0.1)",
              borderRadius: "8px",
              borderLeft: "3px solid #f6a623",
              fontSize: "0.9rem",
            }}>
              ✏️ Editing post ID: {editingId}
            </div>
          )}

          <input
            type="text"
            placeholder="Post title *"
            value={form.title}
            onChange={(e) => handleChange("title", e.target.value)}
            style={inputStyle}
          />

          <select
            value={form.category}
            onChange={(e) => handleChange("category", e.target.value)}
            style={{ ...inputStyle, colorScheme: "dark" }}
          >
            <option value="Career">Career</option>
            <option value="React">React</option>
            <option value="JavaScript">JavaScript</option>
            <option value="Full Stack">Full Stack</option>
            <option value="Flutter">Flutter</option>
            <option value="Node.js">Node.js</option>
          </select>

          <input
            type="text"
            placeholder="Excerpt (short summary) *"
            value={form.excerpt}
            onChange={(e) => handleChange("excerpt", e.target.value)}
            style={inputStyle}
          />

          <input
            type="text"
            placeholder="Read time (e.g. 5 min read) *"
            value={form.readTime}
            onChange={(e) => handleChange("readTime", e.target.value)}
            style={inputStyle}
          />

          <input
            type="text"
            placeholder="Image URL (optional)"
            value={form.image}
            onChange={(e) => handleChange("image", e.target.value)}
            style={inputStyle}
          />

          <textarea
            placeholder="Full post content *"
            value={form.content}
            onChange={(e) => handleChange("content", e.target.value)}
            rows={12}
            style={{ ...inputStyle, resize: "vertical", lineHeight: "1.6" }}
          />

          {/* PUBLISHED TOGGLE */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <label style={{ opacity: 0.7, fontSize: "0.95rem" }}>
              Status:
            </label>
            <button
              onClick={() => handleChange("published", !form.published)}
              style={{
                padding: "6px 20px",
                borderRadius: "20px",
                border: `2px solid ${form.published ? "#51cf66" : "#aaa"}`,
                background: form.published
                  ? "rgba(81,207,102,0.1)"
                  : "transparent",
                color: form.published ? "#51cf66" : "#aaa",
                fontWeight: "600",
                cursor: "pointer",
                fontSize: "0.85rem",
              }}
            >
              {form.published ? "✅ Published" : "📝 Draft"}
            </button>
          </div>

          <div style={{ display: "flex", gap: "12px" }}>
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              style={btnStyle}
            >
              {isLoading
                ? "Saving..."
                : editingId
                ? "Update Post"
                : "Publish Post"}
            </button>

            {editingId && (
              <button
                onClick={handleCancel}
                style={{
                  ...btnStyle,
                  background: "transparent",
                  border: "2px solid rgba(255,255,255,0.2)",
                  color: "inherit",
                }}
              >
                Cancel Edit
              </button>
            )}
          </div>
        </div>
      )}

      {/* MANAGE POSTS TAB */}
      {activeTab === "manage" && (
        <div>
          {posts.length === 0 ? (
            <p style={{ opacity: 0.5 }}>No posts yet.</p>
          ) : (
            posts.map((post) => (
              <div
                key={post.id}
                style={{
                  padding: "20px",
                  borderRadius: "12px",
                  background: "rgba(255,255,255,0.05)",
                  marginBottom: "16px",
                  borderLeft: `4px solid ${post.published ? "#51cf66" : "#aaa"}`,
                }}
              >
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  flexWrap: "wrap",
                  gap: "12px",
                }}>
                  <div>
                    <h3 style={{ fontSize: "1rem", marginBottom: "6px" }}>
                      {post.title}
                    </h3>
                    <div style={{
                      display: "flex",
                      gap: "12px",
                      fontSize: "0.8rem",
                      opacity: 0.5,
                    }}>
                      <span>{post.category}</span>
                      <span>{formatDate(post.createdAt)}</span>
                      <span>❤️ {post.likes}</span>
                      <span>💬 {post.commentCount}</span>
                      <span
                        style={{
                          color: post.published ? "#51cf66" : "#aaa",
                          opacity: 1,
                        }}
                      >
                        {post.published ? "Published" : "Draft"}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    <button
                      onClick={() => handleTogglePublish(post)}
                      style={smallBtnStyle("#f6a623")}
                    >
                      {post.published ? "Unpublish" : "Publish"}
                    </button>
                    <button
                      onClick={() => handleEdit(post)}
                      style={smallBtnStyle("#4dabf7")}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(post.id)}
                      style={smallBtnStyle("#ff6b6b")}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

const inputStyle = {
  padding: "12px 16px",
  borderRadius: "8px",
  border: "2px solid rgba(255,255,255,0.1)",
  background: "rgba(255,255,255,0.05)",
  color: "inherit",
  fontSize: "1rem",
  outline: "none",
  fontFamily: "inherit",
  width: "100%",
};

const btnStyle = {
  padding: "12px 24px",
  borderRadius: "8px",
  border: "none",
  background: "#f6a623",
  color: "#ffffff",
  fontSize: "1rem",
  fontWeight: "700",
  cursor: "pointer",
};

const smallBtnStyle = (color) => ({
  padding: "6px 14px",
  borderRadius: "6px",
  border: `2px solid ${color}`,
  background: "transparent",
  color: color,
  fontSize: "0.8rem",
  fontWeight: "600",
  cursor: "pointer",
});

export default Admin;