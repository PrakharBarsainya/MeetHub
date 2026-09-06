import { useNavigate } from "react-router-dom";

export default function Navbar() {

  const navigate = useNavigate();
  return (
    <div className="Navbar">
      <div className="container">
        <div className="col navheader">
          <h2>Meet Hub Call</h2>
        </div>
        <div className="col navlink">
            <p onClick={() => navigate("/kjhgfgh")}>Join as guest</p>
            <p onClick={() => navigate("/auth")}>Register</p>
            <div role="button">
                <p style={{color:"#FF9839"}} onClick={() => navigate("/auth")}>Login</p>
            </div>
        </div>
      </div>
    </div>
  );
}
