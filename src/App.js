import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import RedirectHandler from "./pages/RedirectHandler";
import "./App.css";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/:code" element={<RedirectHandler />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
