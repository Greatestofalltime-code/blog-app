const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// POSTS
export const getPosts = async (search = "", category = "") => {
  const params = new URLSearchParams();
  if (search) params.append("search", search);
  if (category && category !== "All") params.append("category", category);

  const response = await fetch(`${BASE_URL}/posts?${params}`);
  if (!response.ok) throw new Error("Failed to fetch posts");
  return response.json();
};

export const getPost = async (id) => {
  const response = await fetch(`${BASE_URL}/posts/${id}`);
  if (!response.ok) throw new Error("Failed to fetch post");
  return response.json();
};

export const likePost = async (id, action) => {
  const response = await fetch(`${BASE_URL}/posts/${id}/like`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action }),
  });
  if (!response.ok) throw new Error("Failed to like post");
  return response.json();
};

export const getAdminPosts = async (token) => {
  const response = await fetch(`${BASE_URL}/posts/admin/all`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Failed to fetch admin posts");
  return response.json();
};

export const createPost = async (postData, token) => {
  const response = await fetch(`${BASE_URL}/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(postData),
  });
  if (!response.ok) throw new Error("Failed to create post");
  return response.json();
};

export const updatePost = async (id, postData, token) => {
  const response = await fetch(`${BASE_URL}/posts/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(postData),
  });
  if (!response.ok) throw new Error("Failed to update post");
  return response.json();
};

export const deletePost = async (id, token) => {
  const response = await fetch(`${BASE_URL}/posts/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Failed to delete post");
  return response.json();
};

// COMMENTS
export const getComments = async (postId) => {
  const response = await fetch(`${BASE_URL}/comments/${postId}`);
  if (!response.ok) throw new Error("Failed to fetch comments");
  return response.json();
};

export const addComment = async (postId, text, token, parentId = null) => {
  const response = await fetch(`${BASE_URL}/comments/${postId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ text, parentId }),
  });
  if (!response.ok) throw new Error("Failed to add comment");
  return response.json();
};

export const likeComment = async (id, token) => {
  const response = await fetch(`${BASE_URL}/comments/like/${id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error("Failed to like comment");
  return response.json();
};

export const deleteComment = async (id, token) => {
  const response = await fetch(`${BASE_URL}/comments/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Failed to delete comment");
  return response.json();
};

// AUTH
export const register = async (name, email, password) => {
  const response = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }
  return response.json();
};

export const login = async (email, password) => {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }
  return response.json();
};