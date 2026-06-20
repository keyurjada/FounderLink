import React from "react";
import { Email, Height } from "@mui/icons-material";
import { maxHeight, style } from "@mui/system";
import loginimg from "../assets/loginimg.png";
import axios from "axios";

const Login = () => {

  return (
    <section>
      <div className="d-flex justify-content-center align-items-center vh-100">
        {/* col one  */}

        <form
          className="p-4 shadow-lg rounded bg-white hover:shadow"
          style={{ width: "100%", maxWidth: "800px" }}
        >
          <div className="row row-col-2">
            <div className="col">
              <img src={loginimg} alt="" className="w-100 h-100" />
            </div>
            <div className="col">
              <div className="mb-3">
                <h1 className="text-dark text-center">Login</h1>
                <label
                  for="exampleInputEmail1"
                  className="form-label text-dark "
                >
                  Email address
                </label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  id="exampleInputEmail1"
                  aria-describedby="emailHelp"
                />
              </div>
              <div className="mb-3">
                <label
                  for="exampleInputPassword1"
                  className="form-label text-dark"
                >
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  id="exampleInputPassword1"
                />
              </div>
              <div className="text-center">
                <button type="submit" className="btn btn-primary w-25 mx-3">
                  Login
                </button>
              <input type="reset" name="Clear" className="btn btn-danger w-25 mx-3 " />

              </div>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Login;
