import { Router, Switch, Route, Redirect } from "react-router-dom";
import Login from "./pages/Login";
import Layout from "./pages/Layout";
import history from "utils/history";

function App() {
  return (
    <Router history={history}>
      <div className="App">
        {/* <Link to="/login">登录</Link>
        <Link to="/home">首页</Link> */}
        <Switch>
          <Redirect exact from="/" to={'/home'} />
          <Route path="/login" component={Login}></Route>
          <Route path="/home" component={Layout}></Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
