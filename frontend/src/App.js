import SignUp from "./pages/Signup.js";
import "./App.css";
import {Navigate, Route, Routes} from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";

function App() {
    const user = null;
    return (
        <Routes>
            <Route path={"/login"} element={<Login/>}/>
            <Route path={"/signup"} element={<SignUp/>}/>
            {user && <Route path={"/"} element={<Home/>}/>}
            <Route path="*" element={<Navigate to="/login"/>}/>
        </Routes>
    )
}

export default App;
