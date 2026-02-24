import "./goals.css";
import goalsBg from "../../image/goals.png";

const Goals = () => {
  return (
    <div
      className="goals-wrapper"
      style={{ backgroundImage: `url(${goalsBg})` }}
    >
      <div className="goals-overlay">
        <div className="goals-coming-box">
          🚧 Coming Soon
        </div>
      </div>
    </div>
  );
};

export default Goals;