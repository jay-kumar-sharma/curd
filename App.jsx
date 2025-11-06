import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  // state holding list of expense objects fetched from backend
  const [expenses, setExpenses] = useState([]);

  // state holding the form inputs (controlled form)
  const [form, setForm] = useState({
    amount: "",
    category: "",
    description: "",
    date: ""
  });

  // state holding the id of the expense currently being edited.
  // null means "create mode"
  const [editId, setEditId] = useState(null);

  // useEffect with empty deps runs once on mount -> fetch initial data
  useEffect(() => {
    fetchExpenses();
  }, []);

  // Fetch all expenses from backend GET /api/expenses
  async function fetchExpenses() {
    const res = await axios.get("http://localhost:5000/api/expenses");
    // assumes backend responds with an array: [{ id, amount, category, description, date }, ...]
    setExpenses(res.data);
  }

  // Handles form submit for both Create and Update
  async function submit(e) {
    e.preventDefault(); // stop form from reloading the page

    if (editId) {
      // UPDATE: send PUT to /api/expenses/:id with form data
      await axios.put(`http://localhost:5000/api/expenses/${editId}`, form);
      setEditId(null); // leave edit mode
    } else {
      // CREATE: send POST to /api/expenses with form data
      await axios.post("http://localhost:5000/api/expenses", form);
    }

    // reset form fields after save
    setForm({ amount: "", category: "", description: "", date: "" });

    // refresh list from server
    fetchExpenses();
  }

  // DELETE an expense by id
  async function remove(id) {
    await axios.delete(`http://localhost:5000/api/expenses/${id}`);
    fetchExpenses();
  }

  // Load an expense into the form for editing
  function edit(exp) {
    setForm({
      amount: exp.amount,
      category: exp.category,
      description: exp.description,
      // If backend stored the date in ISO (e.g. "2025-11-06T00:00:00.000Z"),
      // .split("T")[0] extracts YYYY-MM-DD for the date input control.
      date: exp.date.split("T")[0],
    });
    // set the id we are editing so submit() will call PUT
    setEditId(exp.id);
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Expense Manager</h1>

      <form onSubmit={submit}>
        <input
          required
          placeholder="Amount"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
        /><br />
        <input
          required
          placeholder="Category"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        /><br />
        <input
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        /><br />
        <input
          type="date"
          required
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
        /><br />
        <button type="submit">
          {editId ? "Update Expense" : "Add Expense"}
        </button>
      </form>

      <ul>
        {expenses.map((exp) => (
          <li key={exp.id}>
            {exp.date} — {exp.category} — ₹{exp.amount} — {exp.description}
            <button onClick={() => edit(exp)} style={{ marginLeft: 10 }}>
              Edit
            </button>
            <button onClick={() => remove(exp.id)} style={{ marginLeft: 10 }}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
