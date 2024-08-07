import "./App.css";
import Edit from "./pages/Edit/Edit";
import Home from "./pages/Home/Home";
import "bootstrap/dist/css/bootstrap.min.css";
import Profile from "./pages/Profile/Profile";
import Header from "./components/Header/Header";
import { Routes, Route } from "react-router-dom";
import Register from "./pages/Register/Register";

function App() {
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/edit/:id" element={<Edit />} />
        <Route path="/userprofile/:id" element={<Profile />} />
      </Routes>
    </div>
  );
}

export default App;
