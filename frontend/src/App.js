import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import "./App.css";

export default function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
