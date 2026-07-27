import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./../components/Navbar";
import TaskChart from "./../components/TaskChart";
import "./../css/style.css";
import { useSelector } from "react-redux";
import Listing from "../components/Listing";

function Home() {
  const navigate = useNavigate();
  const username = localStorage.getItem("authToken");
  const { items: tasks } = useSelector((state) => state.tasks);

  useEffect(() => {
    if (localStorage.getItem("userRole") !== "user" || !username) {
      navigate("/login");
    }
  }, [navigate, username]);

  return (
    <>
      <Navbar />

      <main className="home-main">
        <div style={{ flex: 1 }}>
          <Listing thunkName="fetchUserTasks" username={username} />
        </div>

        <TaskChart tasks={tasks} />
        
      </main>
    </>
  );
}

export default Home;