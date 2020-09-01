import React from "react";
// import ReactDOM from "react-dom";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Navbar from "./components/navbar.component";
// import ExercisesList from "./components/exercises-list.component";
// import EditExercise from "./components/edit-exercise.component";
// import CreateExercise from "./components/create-exercise.component";
import CreateUser from "./components/create-user.component";

// function Moff(props) {
//   return (
//     <a
//       href="https://www.youtube.com/watch?v=suu4hdD3qd4"
//       target="_blank"
//       rel="noopener noreferrer"
//     >
//       <button>Get Moffed</button>
//     </a>
//   );
// }

function App() {
  //   render() {
  //     let message;
  //     if (this.state.clicks >= 69) {
  //       message = "Nice.";
  //     } else if (this.state.clicks >= 420) {
  //       message = "Go outside or something holy shit.";
  //     } else {
  //       message = "";
  //     }

  //   return (
  //     <div className="clicker">
  //       <h2>Counter</h2>
  //       <button
  //         onClick={() => }
  //       >
  //         Click me!
  //       </button>
  //       {/* <p>Clicks: {this.state.clicks}</p> */}
  //       <p>{"message"}</p>
  //     </div>
  //   );
  return (
    <Router>
      <div className="container">
        <Navbar />
        <br />
        {/* <Route path="/" exact component={ExercisesList} />
        <Route path="/edit/:id" component={EditExercise} />
        <Route path="/create" component={CreateExercise} /> */}
        <Route path="/user" component={CreateUser} />
      </div>
    </Router>
  );
}

export default App;
