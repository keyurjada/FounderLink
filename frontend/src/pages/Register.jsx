import React, { useState } from 'react';
import { Height } from "@mui/icons-material";
import { maxHeight, style } from "@mui/system";
import registerimg from "../assets/registerimg.png";
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    role: 'investor', // default match for the solid select tile
    phone: '',
    email: '',
    password: ''
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // 2. Track general changes for standard inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 3. Handle Form Submission to Backend API
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    // Prepare payload combining First & Last name to match your backend model schema
    const payload = {
      name: `${formData.firstName} ${formData.lastName}`.trim(),
      email: formData.email,
      phone: formData.phone,
      role: formData.role,
      password: formData.password
    };

    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', payload);
      
      if (response.data) {
        alert('Registration Successful!');
        // Reset states cleanly on success
        setFormData({ firstName: '', lastName: '', role: 'investor', phone: '', email: '', password: '' });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Try again.');
    }
  };

  // 4. Reset Button Handler
  const handleReset = () => {
    setFormData({ firstName: '', lastName: '', role: 'investor', phone: '', email: '', password: '' });
    setMessage('');
    setError('');
  };

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
                <div className="mb-3">
                  <h1 className="text-dark text-center">Register</h1>
                    <label
                    for="exampleInputEmail1"
                    className="form-label text-dark "
                  >
                    First Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="fname"
                    aria-describedby="emailHelp"
                  />
                    <label
                    for="exampleInputEmail1"
                    className="form-label text-dark "
                  >
                    Last Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="lname"
                    aria-describedby="emailHelp"
                  />
                     <label
                    for="exampleInputEmail1"
                    className="form-label text-dark "
                  >
                    Role
                  </label>
                  <input className="form-control" id="role-choice" list="role" name="role-choice" />
                  <datalist id="role">
                    <option value="investor"/>
                    <option value="coder / developer"/>
                  </datalist>
                     <label
                    for="exampleInputEmail1"
                    className="form-label text-dark "
                  >
                    Mobile No.
                  </label>
                  <input
                    type="tel" maxLength={10}  minLength={10}
                    className="form-control"
                    id="number"
                    aria-describedby="emailHelp"
                  />
                  <label
                    for="exampleInputEmail1"
                    className="form-label text-dark "
                  >
                    Email address
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
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
                    className="form-control"
                    id="exampleInputPassword1"
                  />
                </div>
                <div className="text-center">
                  <button type="submit" className="btn btn-primary w-25 mx-3">
                    Register
                  </button>
                  <input type="reset" name="Clear" className="btn btn-danger w-25 mx-3 " />
                </div>
              </div>
             <div className="col">
                <img src={registerimg} alt="" className="w-100 h-100" />
              </div>
            </div>
          </form>
        </div>
      </section>
  );
};
export default Register;
