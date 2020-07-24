import React, { useContext } from "react";
import CreateFolder from "../Modals/CreateFolder";
import { Row, CardHeader } from "reactstrap";
import { Button } from "reactstrap";
import { FileContext } from "../../contexts/FileListContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function FilesHeader({
  createFolderButton,
}) {
  const { files, view, toggleView } = useContext(FileContext);
  let listClassname =
    view === "list" ? "mr-2 px-3 bg-gradient-cyan" : "mr-2 px-3";
  let galleryClassname =
    view === "list" ? "mr-2 px-3" : "mr-2 px-3 bg-gradient-cyan";
  let listColor = view === "list" ? "white" : "black";
  let galleryColor = view === "list" ? "black" : "white";

  return (
    <CardHeader className="border-0">
      <Row className="align-items-center">
        <div className="col">
          <h3 className="my-2">All {files.length}</h3>
        </div>
        <div className="col d-flex align-items-center justify-content-end">
          <Button
            color="secondary"
            type="button"
            className={listClassname}
            onClick={() => toggleView("list")}
            style={{ border: "none" }}
          >
            <FontAwesomeIcon icon="th-list" size="lg" color={listColor} />
          </Button>
          <Button
            color="secondary"
            type="button"
            className={galleryClassname}
            onClick={() => toggleView("gallery")}
            style={{ border: "none" }}
          >
            <FontAwesomeIcon icon="th" size="lg" color={galleryColor} />
          </Button>
          {createFolderButton && (
            <CreateFolder
              buttonLabel="Create new folder"
              modalClassName="modal-dialog"
            />
          )}
        </div>
      </Row>
    </CardHeader>
  );
}

export default FilesHeader;
