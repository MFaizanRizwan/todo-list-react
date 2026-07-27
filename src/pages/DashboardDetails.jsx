import { useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Listing from "../components/Listing";
import "../css/dashboard.css";

function DashboardDetails() {
  useEffect(() => {
    document.title = "TODO App | Dashboard Data Page";
  }, []);

  return (
    <div className="dashboard-page-wrapper">
      <Navbar />
      <main className="hero-section">
        <div className="sidebar-section">
          <h2>Navigation</h2>
          <ul className="sidebar-tabs">
            <li className="sidebar-item">
              <Link to="/dashboard">Analytics Page</Link>
            </li>
            <li className="sidebar-item active">
              <Link to="/dashboard_details">Data Page</Link>
            </li>
          </ul>
        </div>
        <div className="analytics-section" style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          <h1>Data Section</h1>

          <div>
            <h2 className="data-heading" style={{ marginBottom: "1rem" }}>Tasks Data</h2>
            <Listing thunkName="fetchAllTasks" />
          </div>

          <div>
            <h2 className="data-heading" style={{ marginBottom: "1rem" }}>Users Data</h2>
            <Listing thunkName="fetchUsers" />
          </div>
        </div>
      </main>
    </div>
  );
}

export default DashboardDetails;