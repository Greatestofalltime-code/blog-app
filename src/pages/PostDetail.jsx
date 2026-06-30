import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  getPost,
  likePost,
  addComment,
  likeComment,
  deleteComment,
} from "../api";
import { useAuth } from "../context/AuthContext";

function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();

  const [post, setPost] = useState(null);
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [replyText, setReplyText] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [commentLoading, setCommentLoading] = useState(false);
  const [shareMsg, setShareMsg] = useState("");
  const [error, setError] = useState(null);

  // Fetch post data
  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchData = async () => {
      try {
        const postData = await getPost(id);
        setPost(postData);
        setLikes(postData.likes);
      } catch (err) {
        setError("Failed to load post.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Check localStorage for post like state
  useEffect(() => {
    const likedPosts = JSON.parse(
      localStorage.getItem("likedPosts") || "[]"
    );
    setLiked(likedPosts.includes(parseInt(id)));
  }, [id]);

  // POST LIKE / UNLIKE
  const handleLike = async () => {
    const likedPosts = JSON.parse(
      localStorage.getItem("likedPosts") || "[]"
    );
    const action = liked ? "unlike" : "like";

    try {
      const data = await likePost(id, action);
      setLikes(data.likes);
      setLiked(!liked);

      if (action === "like") {
        localStorage.setItem(
          "likedPosts",
          JSON.stringify([...likedPosts, parseInt(id)])
        );
      } else {
        localStorage.setItem(
          "likedPosts",
          JSON.stringify(likedPosts.filter((p) => p !== parseInt(id)))
        );
      }
    } catch (err) {
      console.log("Like failed:", err);
    }
  };

  // SHARE
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setShareMsg("🔗 Link copied to clipboard!");
        setTimeout(() => setShareMsg(""), 3000);
      }
    } catch (err) {
      console.log("Share failed:", err);
    }
  };

  // ADD COMMENT
  const handleComment = async () => {
    if (!commentText.trim()) return;
    setCommentLoading(true);
    try {
      const newComment = await addComment(id, commentText, token);
      setPost((prev) => ({
        ...prev,
        comments: [
          ...prev.comments,
          { ...newComment, replies: [], likedBy: [] },
        ],
      }));
      setCommentText("");
    } catch (err) {
      alert("Failed to post comment.");
    } finally {
      setCommentLoading(false);
    }
  };

  // ADD REPLY
  const handleReply = async (parentId) => {
    if (!replyText.trim()) return;
    setCommentLoading(true);
    try {
      const newReply = await addComment(id, replyText, token, parentId);
      setPost((prev) => ({
        ...prev,
        comments: prev.comments.map((c) =>
          c.id === parentId
            ? {
                ...c,
                replies: [
                  ...c.replies,
                  { ...newReply, likedBy: [] },
                ],
              }
            : c
        ),
      }));
      setReplyText("");
      setReplyingTo(null);
    } catch (err) {
      alert("Failed to post reply.");
    } finally {
      setCommentLoading(false);
    }
  };

  // COMMENT LIKE / UNLIKE
  const handleLikeComment = async (commentId, isReply, parentId) => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      const data = await likeComment(commentId, token);

      setPost((prev) => ({
        ...prev,
        comments: prev.comments.map((c) => {
          // Top-level comment
          if (!isReply && c.id === commentId) {
            return {
              ...c,
              likes: data.likes,
              likedBy: data.liked
                ? [...(c.likedBy || []), { userId: user.id }]
                : (c.likedBy || []).filter((l) => l.userId !== user.id),
            };
          }
          // Reply
          if (isReply && c.id === parentId) {
            return {
              ...c,
              replies: c.replies.map((r) =>
                r.id === commentId
                  ? {
                      ...r,
                      likes: data.likes,
                      likedBy: data.liked
                        ? [...(r.likedBy || []), { userId: user.id }]
                        : (r.likedBy || []).filter(
                            (l) => l.userId !== user.id
                          ),
                    }
                  : r
              ),
            };
          }
          return c;
        }),
      }));
    } catch (err) {
      console.log("Like comment failed:", err);
    }
  };

  // DELETE COMMENT OR REPLY
  const handleDeleteComment = async (commentId, isReply, parentId) => {
    if (!window.confirm("Delete this comment?")) return;
    try {
      await deleteComment(commentId, token);
      setPost((prev) => ({
        ...prev,
        comments: isReply
          ? prev.comments.map((c) =>
              c.id === parentId
                ? {
                    ...c,
                    replies: c.replies.filter((r) => r.id !== commentId),
                  }
                : c
            )
          : prev.comments.filter((c) => c.id !== commentId),
      }));
    } catch (err) {
      alert("Failed to delete comment.");
    }
  };

  // HELPERS
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const isCommentLiked = (comment) => {
    if (!user) return false;
    return (comment.likedBy || []).some((l) => l.userId === user.id);
  };

  const canDelete = (comment) => {
    if (!user) return false;
    return user.role === "admin" || comment.userId === user.id;
  };

  // LOADING / ERROR STATES
  if (isLoading) {
    return (
      <div style={{ textAlign: "center", padding: "80px", opacity: 0.5 }}>
        Loading post...
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="post-detail">
        <button className="back-btn" onClick={() => navigate("/")}>
          ← Back to Home
        </button>
        <h2>{error || "Post not found"}</h2>
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
      {post.image && <img src={post.image} alt={post.title} />}

      {/* POST HEADER */}
      <div className="post-header">
        <span className="category-badge">{post.category}</span>
        <h1>{post.title}</h1>

        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "12px",
          flexWrap: "wrap",
          gap: "12px",
        }}>
          <div style={{
            display: "flex",
            gap: "16px",
            opacity: 0.5,
            fontSize: "0.9rem",
          }}>
            <span>{formatDate(post.createdAt)}</span>
            <span>{post.readTime}</span>
            <span>By {post.author?.name}</span>
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            {/* LIKE / UNLIKE POST */}
            <button
              onClick={handleLike}
              style={{
                background: liked ? "#e94560" : "none",
                border: "2px solid #e94560",
                color: liked ? "#ffffff" : "#e94560",
                padding: "6px 16px",
                borderRadius: "20px",
                fontSize: "0.85rem",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.3s",
              }}
            >
              {liked ? "❤️ Unlike" : "🤍 Like"} {likes}
            </button>

            {/* SHARE */}
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
              }}
            >
              🔗 Share
            </button>
          </div>
        </div>

        {shareMsg && (
          <p style={{
            color: "#f6a623",
            fontSize: "0.85rem",
            marginTop: "8px",
            textAlign: "right",
          }}>
            {shareMsg}
          </p>
        )}
      </div>

      {/* POST CONTENT */}
      <div className="post-content">{post.content}</div>

      {/* COMMENTS SECTION */}
      <div style={{ marginTop: "60px" }}>
        <h3 style={{
          fontSize: "1.4rem",
          marginBottom: "30px",
          color: "#f6a623",
          borderLeft: "4px solid #f6a623",
          paddingLeft: "12px",
        }}>
          💬 {post.comments?.length || 0} Comments
        </h3>

        {/* COMMENT LIST */}
        {post.comments?.length === 0 ? (
          <p style={{ opacity: 0.5, fontStyle: "italic", marginBottom: "30px" }}>
            No comments yet. Be the first to comment.
          </p>
        ) : (
          <div style={{ marginBottom: "40px" }}>
            {post.comments?.map((comment) => (
              <div key={comment.id} style={{ marginBottom: "20px" }}>

                {/* TOP LEVEL COMMENT */}
                <div style={{
                  padding: "20px",
                  borderRadius: "10px",
                  background: "rgba(255,255,255,0.05)",
                  borderLeft: "3px solid #f6a623",
                }}>
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "8px",
                    flexWrap: "wrap",
                    gap: "8px",
                  }}>
                    <strong style={{ color: "#f6a623" }}>
                      {comment.name}
                    </strong>
                    <span style={{ fontSize: "0.8rem", opacity: 0.5 }}>
                      {formatDate(comment.createdAt)}
                    </span>
                  </div>

                  <p style={{
                    opacity: 0.85,
                    lineHeight: "1.6",
                    marginBottom: "12px",
                  }}>
                    {comment.text}
                  </p>

                  {/* COMMENT ACTIONS */}
                  <div style={{
                    display: "flex",
                    gap: "12px",
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}>
                    {/* LIKE COMMENT */}
                    <button
                      onClick={() =>
                        handleLikeComment(comment.id, false, null)
                      }
                      style={{
                        ...actionBtnStyle,
                        color: isCommentLiked(comment)
                          ? "#e94560"
                          : "inherit",
                      }}
                    >
                      {isCommentLiked(comment) ? "❤️" : "🤍"}{" "}
                      {comment.likes}
                    </button>

                    {/* REPLY */}
                    {user && (
                      <button
                        onClick={() =>
                          setReplyingTo(
                            replyingTo === comment.id ? null : comment.id
                          )
                        }
                        style={actionBtnStyle}
                      >
                        💬 Reply
                      </button>
                    )}

                    {/* DELETE */}
                    {canDelete(comment) && (
                      <button
                        onClick={() =>
                          handleDeleteComment(comment.id, false, null)
                        }
                        style={{ ...actionBtnStyle, color: "#ff6b6b" }}
                      >
                        🗑️ Delete
                      </button>
                    )}
                  </div>

                  {/* REPLY INPUT */}
                  {replyingTo === comment.id && (
                    <div style={{ marginTop: "16px" }}>
                      <textarea
                        placeholder={`Reply to ${comment.name}...`}
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        rows={3}
                        style={textareaStyle}
                      />
                      <div style={{
                        display: "flex",
                        gap: "10px",
                        marginTop: "8px",
                      }}>
                        <button
                          onClick={() => handleReply(comment.id)}
                          disabled={commentLoading}
                          style={submitBtnStyle}
                        >
                          {commentLoading ? "Posting..." : "Post Reply"}
                        </button>
                        <button
                          onClick={() => setReplyingTo(null)}
                          style={{
                            ...submitBtnStyle,
                            background: "transparent",
                            border: "2px solid rgba(255,255,255,0.2)",
                            color: "inherit",
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* REPLIES */}
                {comment.replies?.length > 0 && (
                  <div style={{ marginLeft: "30px", marginTop: "10px" }}>
                    {comment.replies.map((reply) => (
                      <div
                        key={reply.id}
                        style={{
                          padding: "16px 20px",
                          borderRadius: "10px",
                          background: "rgba(255,255,255,0.03)",
                          borderLeft: "3px solid rgba(246,166,35,0.4)",
                          marginBottom: "10px",
                        }}
                      >
                        <div style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: "8px",
                          flexWrap: "wrap",
                          gap: "8px",
                        }}>
                          <strong style={{
                            color: "#f6a623",
                            fontSize: "0.9rem",
                          }}>
                            ↳ {reply.name}
                          </strong>
                          <span style={{
                            fontSize: "0.75rem",
                            opacity: 0.5,
                          }}>
                            {formatDate(reply.createdAt)}
                          </span>
                        </div>

                        <p style={{
                          opacity: 0.8,
                          lineHeight: "1.6",
                          fontSize: "0.95rem",
                          marginBottom: "10px",
                        }}>
                          {reply.text}
                        </p>

                        <div style={{ display: "flex", gap: "12px" }}>
                          {/* LIKE REPLY */}
                          <button
                            onClick={() =>
                              handleLikeComment(reply.id, true, comment.id)
                            }
                            style={{
                              ...actionBtnStyle,
                              color: isCommentLiked(reply)
                                ? "#e94560"
                                : "inherit",
                            }}
                          >
                            {isCommentLiked(reply) ? "❤️" : "🤍"}{" "}
                            {reply.likes}
                          </button>

                          {/* DELETE REPLY */}
                          {canDelete(reply) && (
                            <button
                              onClick={() =>
                                handleDeleteComment(
                                  reply.id,
                                  true,
                                  comment.id
                                )
                              }
                              style={{
                                ...actionBtnStyle,
                                color: "#ff6b6b",
                              }}
                            >
                              🗑️ Delete
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ADD COMMENT */}
        {user ? (
          <div style={{
            background: "rgba(255,255,255,0.05)",
            borderRadius: "12px",
            padding: "24px",
          }}>
            <h4 style={{ marginBottom: "16px", opacity: 0.8 }}>
              Leave a comment as {user.name}
            </h4>
            <textarea
              placeholder="Write your comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              rows={4}
              style={textareaStyle}
            />
            <button
              onClick={handleComment}
              disabled={commentLoading}
              style={{ ...submitBtnStyle, marginTop: "12px" }}
            >
              {commentLoading ? "Posting..." : "Post Comment"}
            </button>
          </div>
        ) : (
          <div style={{
            background: "rgba(255,255,255,0.05)",
            borderRadius: "12px",
            padding: "24px",
            textAlign: "center",
          }}>
            <p style={{ opacity: 0.7, marginBottom: "16px" }}>
              You must be logged in to leave a comment.
            </p>
            <button
              onClick={() => navigate("/login")}
              style={submitBtnStyle}
            >
              Login to Comment
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const actionBtnStyle = {
  background: "none",
  border: "none",
  color: "inherit",
  opacity: 0.7,
  cursor: "pointer",
  fontSize: "0.85rem",
  padding: "4px 8px",
  borderRadius: "6px",
  transition: "opacity 0.2s",
};

const textareaStyle = {
  width: "100%",
  padding: "12px 16px",
  borderRadius: "8px",
  border: "2px solid rgba(255,255,255,0.1)",
  background: "rgba(255,255,255,0.05)",
  color: "inherit",
  fontSize: "0.95rem",
  resize: "vertical",
  outline: "none",
  fontFamily: "inherit",
};

const submitBtnStyle = {
  background: "#f6a623",
  color: "#ffffff",
  border: "none",
  padding: "10px 24px",
  borderRadius: "20px",
  fontWeight: "600",
  cursor: "pointer",
  fontSize: "0.95rem",
};

export default PostDetail;