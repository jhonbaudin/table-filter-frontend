import "./App.css";
import Header from "./containers/Header.js";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import TaskList from "./containers/TaskList.js";
import TaskDetail from "./containers/TaskDetail.js";
import 'semantic-ui-css/semantic.min.css'

function App() {
  return <div className="App">
    <Router>
      <Header />
      <Switch>
        <Route path="/" exact component={TaskList}></Route>
        <Route path="/task/:taskId" exact component={TaskDetail}></Route>
        <Route> 404 not found!</Route>
      </Switch>
    </Router>
  </div>;
}

export default App;
