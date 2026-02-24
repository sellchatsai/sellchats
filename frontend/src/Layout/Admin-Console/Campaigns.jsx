import "./campaigns.css";
import campaignsBg from "../../image/campaigns.jpg";

const Campaigns = () => {
  return (
    <div
      className="campaigns-wrapper"
      style={{ backgroundImage: `url(${campaignsBg})` }}
    >
      <div className="campaigns-overlay">
        <div className="campaigns-coming-box">
          🚧 Coming Soon
        </div>
      </div>
    </div>
  );
};

export default Campaigns;