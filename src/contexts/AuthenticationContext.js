import React, { useState, useEffect } from "react";
import { useMutation, useLazyQuery } from "@apollo/react-hooks";
import { loader } from "graphql.macro";
import { useHistory } from "react-router-dom";

const loginQuery = loader("../queries/login.graphql");
const registerQuery = loader("../queries/register.graphql");
const userQuery = loader("../queries/getUser.graphql");

const JWT_STORAGE_KEY = "JWT_STORAGE_KEY";

export const AuthenticationContext = React.createContext({
  checkLogin: () => {},
  login: () => {},
  register: () => {},
  user: null,
  isRequestLogin: null,
  isLoginError: null,
  isRequestRegister: null,
  isRegisterError: null,
});

export const AuthenticationContextProvider = ({ children }) => {
  const history = useHistory();
  const [
    loginMutation,
    { loading: isRequestLogin, error: isLoginError },
  ] = useMutation(loginQuery);
  const [
    registerMutation,
    { loading: isRequestRegister, error: isRegisterError },
  ] = useMutation(registerQuery);
  const [getUserQuery, { data: userData }] = useLazyQuery(userQuery);

  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem(JWT_STORAGE_KEY);
    console.log(token, 11);
    if (token) {
      getUserQuery();
    }
  }, []);

  useEffect(() => {
    if (userData) {      
      setUser(userData.profile);
    }
  }, [userData]);

  function checkLogin() {    
    const token = localStorage.getItem(JWT_STORAGE_KEY);
    return !!token;
  }

  async function login({ email, password }) {
    try {
      const result = await loginMutation({
        variables: {
          email,
          password,
        },
      });
      localStorage.setItem(JWT_STORAGE_KEY, result.data.login.token);
      history.push("/");
    } catch (e) {}
  }

  async function register({ name, email, password }) {
    try {
      const result = await registerMutation({
        variables: {
          email,
          password,
          name,
        },
      });
      localStorage.setItem(JWT_STORAGE_KEY, result.data.signup.token);
      history.push("/");
    } catch (e) {}
  }

  function logout() {
    history.push("/auth/login");
    localStorage.removeItem(JWT_STORAGE_KEY);
  }

  const value = {
    login,
    register,
    logout,
    checkLogin,

    user,
    isRequestLogin,
    isLoginError,
    isRequestRegister,
    isRegisterError,
  };

  return (
    <AuthenticationContext.Provider value={value}>
      {children}
    </AuthenticationContext.Provider>
  );
};
