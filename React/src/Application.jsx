import { Link } from "react-router-dom";

const Application = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  const logout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <div>
      <nav>
        <h1>Goal Tracker</h1>
        <ul>
          {user ? (
            <>
              <li>
                <Link to="/goals">Goals</Link>
              </li>
              <li>
                <Link to="/me">UserPage</Link>
              </li>
              <li>
                <button onClick={logout}>Logout</button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="/register">Register</Link>
              </li>
            </>
          )}
        </ul>
      </nav>
      <h2>Welcome to the Goal Tracker App</h2>
      {user ? <p>Manage your goals efficiently!</p> : <p>Please log in to continue.</p>}
    </div>
  );
};

export default Application;
