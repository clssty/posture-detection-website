import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.tsx";
import PostureCheck from "./pages/PostureCheck";
import CorrectBodyPosture from "./pages/CorrectBodyPosture.tsx";
import ImpactOfBadPosture from "./pages/ImpactOfBadPosture.tsx";
import IdealPostureAngel from "./pages/IdealPostureAngel";
import GuideForPostureCheck from "./pages/GuideForPostureCheck";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/posture-check" element={<PostureCheck />} />
        <Route path="/correct-body-posture" element={<CorrectBodyPosture />} />
        <Route path="/impact-of-bad-posture" element={<ImpactOfBadPosture />} />
        <Route path="/ideal-posture-angel" element={<IdealPostureAngel />} />
        <Route path="/guide-for-posture-check" element={<GuideForPostureCheck />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;