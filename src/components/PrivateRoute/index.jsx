import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../../actions/user";
import jwt from "jsonwebtoken";
import { doAxiosRequestIntercept } from "../../config/requestInterceptor";

export const PrivateRoute = (props) => {
  const history = useHistory();
  const dispatch = useDispatch();
  doAxiosRequestIntercept();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      history.push("/signin");
    } else {
      const decodeToken = jwt.decode(token);
      if (decodeToken.exp < Date.now() / 1000) {
        localStorage.removeItem("token")
        history.push("/signin");
      } else {
        // set user to store
        dispatch(setUser(decodeToken.user));
      }
    }
  }, [history, dispatch]);

  return <>{props.children}</>;
};
