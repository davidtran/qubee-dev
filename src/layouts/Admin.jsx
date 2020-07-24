import React, { useContext, useEffect } from "react";
import { Route, Switch, Redirect, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { Container } from "reactstrap";
import AdminNavbar from "../components/Navbars/AdminNavbar";
import AdminFooter from "../components/Footers/AdminFooter";
import Sidebar from "../components/Sidebar/Sidebar";
import SearchResults from "../views/SearchResults";
import Files from "../views/Files";
import routes from "../routes.js";
import { FileContext } from "../contexts/FileListContext";
import ActionBarHeader from "../components/Headers/ActionBarHeader";

const Admin = (props) => {
  const location = useLocation();
  const { fetchFiles, selectedFileIds } = useContext(FileContext);

  useEffect(() => {
    document.body.classList.add("bg-default");
    return () => document.body.classList.remove("bg-default");
  }, []);

  function getBrandText(path) {
    for (let i = 0; i < routes.length; i++) {
      if (
        location.pathname.indexOf(
          routes[i].layout + routes[i].path
        ) !== -1
      ) {
        return routes[i].name;
      }
    }
    return "Brand";
  };

  function getRoutes(routes) {
    return routes.map((prop, key) => {
      if (prop.layout === "/admin") {
        return (
          <Route
            path={prop.layout + prop.path}
            component={prop.component}
            key={key}
          />
        );
      } else {
        return null;
      }
    });
  };

  let actionBarHeader = selectedFileIds.length > 0 && (
    <ActionBarHeader />
  );

  return (
    <>
      <ToastContainer draggable={false} position="bottom-left" />
      {actionBarHeader}
      <Sidebar
        {...props}
        routes={routes}
        logo={{
          innerLink: "/admin/index",
          imgSrc: require("../assets/img/brand/qubee_logo.png"),
          imgAlt: "...",
        }}
        getFiles={fetchFiles}
        getFolderId={"folderId"}
      />
      <div className="main-content">
        <AdminNavbar
          {...props}
          brandText={getBrandText(location.pathname)}
        />
        <Switch>
          <Route
            path="/admin/folder/:folderId"
            component={Files}
          />
          <Route
            path="/admin/files"
            component={Files}
          />
          {getRoutes(routes)}
          <Redirect from="*" to="/admin/files" />
        </Switch>
        <Container fluid>
          <AdminFooter />
        </Container>
      </div>
    </>
  );
}

export default Admin;
