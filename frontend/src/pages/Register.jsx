import { useState } from "react";
import API from "../services/api";

export default function Register() {
  const [form, setForm] = useState({
    user_type: "user"
  });

  const handleRegister = async () => {
    await API.post("/auth/register/", form);
    alert("Registered!");
  };

  return (
    <div>
      <h2>Register</h2>
      <input placeholder="Username" onChange={e => setForm({...form, username: e.target.value})} />
      <input placeholder="Email" onChange={e => setForm({...form, email: e.target.value})} />
      <input type="password" onChange={e => setForm({...form, password: e.target.value})} />

      <select onChange={e => setForm({...form, user_type: e.target.value})}>
        <option value="user">User</option>
        <option value="theater">Theater</option>
      </select>

      <button onClick={handleRegister}>Register</button>
    </div>
  );
}