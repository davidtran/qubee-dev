import React, { useContext } from "react";
import { AuthenticationContext } from "../contexts/AuthenticationContext";
import { Redirect, Route } from "react-router";

const PrivateRoute = ({ render, ...rest }) => {
  const { checkLogin } = useContext(AuthenticationContext);
  return (
    <Route
      {...rest}
      render={(props) =>
        checkLogin() ? (
          render(props)
        ) : (
          <Redirect
            to={{ pathname: "/auth/login", state: { from: props.location } }}
          />
        )
      }
    />
  );
};

export default PrivateRoute;
