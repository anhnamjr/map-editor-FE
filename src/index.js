import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import {rootReducer} from './reducer/index'
import thunk from "redux-thunk";

const store = createStore(
    rootReducer,
    compose(
		applyMiddleware(thunk),
        window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
	)
  );

const rootElement = document.getElementById("root");

ReactDOM.render(
    <Provider store={store} >
        <App />
    </Provider>
, rootElement);
