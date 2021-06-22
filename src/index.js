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
import { PrivateRoute } from "./components/PrivateRoute";

const middleware = [];
middleware.push(applyMiddleware(thunk));
if (process.env.REACT_APP_NODE_ENV === "development")
  middleware.push(window?.__REDUX_DEVTOOLS_EXTENSION__());
const store = createStore(rootReducer, compose(...middleware));

const rootElement = document.getElementById("root");

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <Switch>
        <Route path="/signin" component={SignIn} />
        <Route path="/signup" component={SignUp} />
        <PrivateRoute>
          <Route exact path="/" component={Maps} />
        </PrivateRoute>
      </Switch>
    </Router>
  </Provider>,
  rootElement
);
