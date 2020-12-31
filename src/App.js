import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import Layout from "./components/Layout";
import Feed from "./pages/Feed";
import Map from "./pages/Map";
import "./tailwind.output.css";

function App() {
  return (
    <Router>
      <Layout>
        <Switch>
          <Route exact path="/feed">
            <Feed />
          </Route>
          <Route exact path="/map">
            <Map />
          </Route>
          <Route exact path="/">
            <Redirect to="/feed" />
          </Route>
        </Switch>
      </Layout>
    </Router>
  );
}

export default App;
