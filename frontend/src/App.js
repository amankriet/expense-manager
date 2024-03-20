import { useState, useEffect } from "react";
import axios from "axios";
import SignUp from "./pages/Register.js";
import "./App.css";

function App() {
  // const [data, setData] = useState();

  // const getData = async () => {
  //   await axios
  //     .get("http://localhost:3001/api/v1/users/")
  //     .then((res) => {
  //       console.log(res);
  //       setData(res.data);
  //     })
  //     .catch((err) => console.log(err.toString()))
  //     .finally(() => console.log(data));
  // };

  // useEffect(() => {
  //   getData();
  // }, []);

  return <SignUp />;
}

export default App;
