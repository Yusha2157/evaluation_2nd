import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api"; // Change if needed

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState("");
  const [editingGoal, setEditingGoal] = useState(null);
  const [updatedText, setUpdatedText] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.token;

  useEffect(() => {
    if (token) {
      fetchGoals();
    }
  }, [token]);

  const fetchGoals = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/goals`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGoals(res.data);
    } catch (err) {
      console.error("Error fetching goals", err);
    }
  };

  const createGoal = async () => {
    if (!newGoal) return;
    try {
      const res = await axios.post(
        `${API_BASE_URL}/goals`,
        { text: newGoal },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setGoals([...goals, res.data]);
      setNewGoal("");
    } catch (err) {
      console.error("Error creating goal", err);
    }
  };

  const updateGoal = async (goalId) => {
    if (!updatedText) return;
    try {
      await axios.put(
        `${API_BASE_URL}/goals/${goalId}`,
        { text: updatedText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setGoals(goals.map((goal) => (goal._id === goalId ? { ...goal, text: updatedText } : goal)));
      setEditingGoal(null);
      setUpdatedText("");
    } catch (err) {
      console.error("Error updating goal", err);
    }
  };

  const deleteGoal = async (goalId) => {
    try {
      await axios.delete(`${API_BASE_URL}/goals/${goalId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGoals(goals.filter((goal) => goal._id !== goalId));
    } catch (err) {
      console.error("Error deleting goal", err);
    }
  };

  return (
    <div>
      <h2>Goals</h2>
      <input
        type="text"
        placeholder="Enter new goal"
        value={newGoal}
        onChange={(e) => setNewGoal(e.target.value)}
      />
      <button onClick={createGoal}>Add Goal</button>

      <ul>
        {goals.map((goal) => (
          <li key={goal._id}>
            {editingGoal === goal._id ? (
              <>
                <input
                  type="text"
                  value={updatedText}
                  onChange={(e) => setUpdatedText(e.target.value)}
                />
                <button onClick={() => updateGoal(goal._id)}>Save</button>
                <button onClick={() => setEditingGoal(null)}>Cancel</button>
              </>
            ) : (
              <>
                {goal.text}
                <button onClick={() => setEditingGoal(goal._id)}>Edit</button>
                <button onClick={() => deleteGoal(goal._id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Goals;

