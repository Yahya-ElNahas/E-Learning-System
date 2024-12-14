"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

const Register = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [role, setRole] = useState<string>("student"); // Default role: student
  const [error, setError] = useState<string>("");
  const router = useRouter();
  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
  
    try {
      const response = await fetch("http://localhost:3000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password, role }),
      });
  
      const data = await response.json(); // Capture backend response
      console.log("Backend Response:", data);
  
      if (!response.ok) {
        throw new Error(data.message || "Registration failed. Please try again.");
      }
  
      router.push("/otp-verification");
    } catch (err) {
      console.error("Error:", err);
      setError((err as Error).message);
    }
  };
  
  return (
    <div>
      <h1>Register</h1>
      <form onSubmit={handleRegister}>
        <div>
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Role</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="student">Student</option>
            <option value="instructor">Instructor</option>
          </select>
        </div>
        <button type="submit">Register</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
};

export default Register;
