import React from "react";
import ReactDOM from "react-dom";
import { createStore, applyMiddleware, compose } from "redux";
import { Provider } from "react-redux";
import { rootReducer } from "./reducer/index";
import thunk from "redux-thunk";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Maps from "./pages/Maps";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";

import "./styles.css";

const store = createStore(
  rootReducer,
  compose(
    applyMiddleware(thunk),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )
);

const rootElement = document.getElementById("root");

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <Switch>
        <Route exact path="/" component={Maps} />
        <Route path="/signin" component={SignIn} />
        <Route path="/signup" component={SignUp} />
      </Switch>
    </Router>
  </Provider>,
  rootElement
);
