import React, { useState } from "react";
import axios from "axios";
const Ideaform = () => {
  const [vals, setVals] = useState({
     startuptitle: "",
      category: "",
      equity: "",
      description: "",
      teamsize: "",
  });

  const handleInputChange = (e) => {
    setVals({
      ...vals,
      [e.target.name]: e.target.value,
    });
  };

  const handleFormSubmit = async (e) => {
  e.preventDefault();

  try {
    const token = localStorage.getItem("auth_token");

    const response = await axios.post(
      "http://localhost:5001/api/idea/create",
      vals,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    alert(response.data.message);
    handleClear();
  } catch (error) {
    console.log(error);
    alert(error.response?.data?.message || "Something went wrong");
  }
};
  const handleClear = () => {
    setVals({
      startuptitle: "",
      category: "",
      equity: "",
      description: "",
      teamsize: "",
    });
  };

  return (
    <section
      style={{
        backgroundColor: "#030706",
        backgroundImage: `
          radial-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
          radial-gradient(circle at 0% 0%, rgba(16, 185, 129, 0.15) 0%, rgba(6, 182, 212, 0.1) 30%, transparent 60%),
          radial-gradient(circle at 100% 100%, rgba(245, 158, 11, 0.15) 0%, rgba(217, 119, 6, 0.08) 30%, transparent 60%),
          radial-gradient(circle at 50% 20%, rgba(99, 102, 241, 0.08) 0%, transparent 50%)
        `,
        backgroundSize: "32px 32px, 100% 100%, 100% 100%, 100% 100%",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px 10px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "920px",
          background: "rgba(255,255,255,0.02)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: "20px",
          padding: "40px",
        }}
      >
        <form onSubmit={handleFormSubmit}>
          <h2
            className="text-center mb-4"
            style={{ color: "#fff", fontWeight: "bold" }}
          >
            StartUp<span style={{ color: "#10b981" }}>Form</span>
          </h2>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label text-light">Startup Title </label>
              <input
                type="text"
                className="form-control"
                name="startuptitle"
                value={vals.startuptitle}
                onChange={handleInputChange}
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label text-light">Category Name</label>
              <input
                type="text"
                className="form-control"
                name="category"
                value={vals.category}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label text-light">Equity Offered</label>
           <input
                type="text"
                className="form-control"
                name="equity"
                value={vals.equity}
                onChange={handleInputChange}
              />
          </div>

          <div className="mb-3">
            <label className="form-label text-light">Description</label>
            <textarea
              className="form-control"
              name="description"
              value={vals.description}
              onChange={handleInputChange}></textarea>
           
          </div>
          <div className="mb-3">
            <label className="form-label text-light">Team Size</label>
            <input
              type="number"
              className="form-control"
              name="teamsize"
              value={vals.teamsize}
              onChange={handleInputChange}
            />
          </div>


          <div className="d-flex justify-content-center gap-3">
            <button className="btn btn-success" type="submit">
              Upload
            </button>

            <button
              className="btn btn-secondary"
              type="button"
              onClick={handleClear}
            >
              Clear
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Ideaform;