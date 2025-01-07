import React, { useState, useEffect } from "react";
import axios from "axios";

const BlogForm = () => {
  const [formData, setFormData] = useState({
    image: null,
    title: "",
    subtitle: "",
    description: "",
  });
  const [blogs, setBlogs] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false); // For loading state

  const API_URL = "https://blog-haven-production.up.railway.app/blog";

  // Fetch blogs on component mount
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get(API_URL);
        setBlogs(response.data);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };
    fetchBlogs();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); // Activate loading state

    const data = new FormData();
    data.append("image", formData.image);
    data.append("title", formData.title);
    data.append("subtitle", formData.subtitle);
    data.append("description", formData.description);

    try {
      const response = await axios.post(API_URL, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const newBlog = {
        ...formData,
        image: URL.createObjectURL(formData.image),
        id: response.data.id,
      };

      setBlogs([newBlog, ...blogs]);
      setFormData({
        image: null,
        title: "",
        subtitle: "",
        description: "",
      });
    } catch (error) {
      console.error("Error creating blog:", error);
      alert("Failed to create blog. Please try again.");
    } finally {
      setIsSubmitting(false); // Reset loading state
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setBlogs(blogs.filter((blog) => blog.id !== id));
    } catch (error) {
      console.error("Error deleting blog:", error);
      alert("Failed to delete blog. Please try again.");
    }
  };

  return (
    <div className="first-container">
      <h1
        style={{ fontStyle: "italic", fontWeight: "500", fontSize: "1.5rem" }}
      >
        BlogHaven
      </h1>

      <div
        style={{
          backgroundColor: "white",
          borderRadius: "8px",
          border: "1px solid white",
          padding: "1rem",
          width: "100%",
          maxWidth: "800px",
          margin: "2rem auto",
        }}
        className="second-container"
      >
        <div
          style={{
            border: "1px solid lightgray",
            borderRadius: "6px",
            padding: "1.5rem",
          }}
        >
          <form onSubmit={handleSubmit}>
            {["image", "title", "subtitle", "description"].map((field) => (
              <div key={field} style={{ marginBottom: "1rem" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontWeight: 500,
                    textAlign: "left",
                    fontSize: "0.75rem",
                  }}
                >
                  {field.charAt(0).toUpperCase() + field.slice(1)}{" "}
                  <span style={{ color: "red" }}>*</span>
                </label>
                {field === "image" ? (
                  <div>
                    <label
                      htmlFor="file-upload"
                      style={{
                        display: "block",
                        padding: "0.5rem",
                        backgroundColor: "rgb(240, 240, 240)",
                        border: "1px solid rgb(240, 240, 240)",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      Click to upload
                    </label>
                    <input
                      id="file-upload"
                      type="file"
                      name="image"
                      onChange={handleChange}
                      style={{ display: "none" }}
                      required
                    />
                    {formData.image && (
                      <img
                        src={URL.createObjectURL(formData.image)}
                        alt="Selected"
                        style={{
                          maxWidth: "30%",
                          display: "block",
                          marginTop: "1rem",
                        }}
                      />
                    )}
                  </div>
                ) : field === "description" ? (
                  <textarea
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    style={{
                      width: "100%",
                      padding: "0.5rem",
                      backgroundColor: "rgb(240, 240, 240)",
                      border: "1px solid rgb(240, 240, 240)",
                      borderRadius: "4px",
                      height: "5rem",
                      fontSize: "16px",
                    }}
                    required
                  ></textarea>
                ) : (
                  <input
                    type="text"
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    style={{
                      width: "100%",
                      padding: "0.5rem",
                      backgroundColor: "rgb(240, 240, 240)",
                      border: "1px solid rgb(240, 240, 240)",
                      borderRadius: "4px",
                      fontSize: "16px",
                    }}
                    required
                  />
                )}
              </div>
            ))}
            <div className="button">
              <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <div className="spinner"></div> Please wait...
                  </div>
                ) : (
                  "Submit"
                )}
              </button>
            </div>
          </form>
        </div>

        {blogs.length > 0 && (
          <div style={{ marginTop: "2rem" }}>
            {blogs.map((blog) => (
              <div
                key={blog.id}
                style={{
                  border: "1px solid rgb(240, 240, 240)",
                  padding: "1rem",
                  marginTop: "1rem",
                  borderRadius: "4px",
                }}
              >
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      border: "1px solid rgb(229, 229, 229)",
                      borderRadius: "4px",
                      marginTop: "1rem",
                      paddingTop: "1rem",
                    }}
                  >
                    <img
                      src={blog.image}
                      alt={blog.title}
                      style={{ maxWidth: "30%" }}
                    />
                  </div>
                  <div>
                    <button
                      onClick={() => handleDelete(blog.id)}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "red",
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div>
                  <h5>{blog.title}</h5>
                  <small>{blog.subtitle}</small>
                  <p>{blog.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogForm;
