import "../App.css";
import Navbar from "./Body/Navbar";
import {Link} from 'react-router-dom';

export default function LandingPage() {
  return (
  <div className="LandingPageContainer">
    <Navbar/>
    <div className="landingMainContainer">
        <div style={{color:"white"}}>
            <h1> <span style={{color:"#FF9839"}}> Connect</span> with your loved Once</h1>
            <p>Cover a distance by MeetHub Video Call</p>
            <div role="button">
                <Link to={"/auth"}>Get Started</Link>
              
            </div>
          
        </div>
        
        <div>
          <img src="../public/mobile.png" alt="Mobile Photo" />
        </div>
    </div>

  </div>)
}
