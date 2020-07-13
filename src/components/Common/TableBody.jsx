import React, { useState, useEffect, useContext } from "react";
import { Media, Button, Badge } from "reactstrap";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MetaTags from "../Modals/MetaTags";
import fileSizeConversion from "../../utils/fileSizeConversion";
import { FileContext } from "../../contexts/FileListContext";
import moment from 'moment';

function TableBody({
  collection,
  getFiles,
  isSelected,
  onCheckboxClick,
  setFolderId,
  setFileCount,
  ...props
}) {
  const { files, selectedFileIds, toggleSelectFile } = useContext(FileContext);  

  if (files.length) {
    return (
      <tbody>
        {files.map((file) => (
          <tr key={file.id} className="file-list-item">
            <th scope="row">
              <Button
                color="link"
                size="sm"
                type="button"
                onClick={() => toggleSelectFile(file.id)}
              >
                <FontAwesomeIcon
                  icon={
                    selectedFileIds.indexOf(file.id) !== -1 ? "check-square" : ["far", "square"]
                  }
                  size="lg"
                />
              </Button>
            </th>
            <td>
              <Media className="align-items-center">
                <Link to={`/admin/folder/${file.id}`}>
                  <FontAwesomeIcon
                    icon={file.kind === "FOLDER" ? "folder-open" : "file-image"}
                    className="mr-2"
                    size="lg"
                  />
                  <span className="mb-0 text-sm">{file.name}</span>
                </Link>
              </Media>
              {file.metaTags && (
                <div className="tags-container mt-2">
                  {file.metaTags.map((tag, i) => (
                    <Badge
                      key={tag + i}
                      className="badge-default mr-2"
                      href="#pablo"
                      pill
                    >
                      {tag}
                    </Badge>
                  ))}
                  <MetaTags
                    buttonLabel="add +"
                    fileId={file.id}
                    getFiles={() => {}}
                  />
                </div>
              )}
            </td>
            <td>{moment(file.created_at).format('YYYY-MM-DD HH:mm:ss')}</td>
            <td>
              {file.kind === "FILE" && fileSizeConversion(file.size, false)}
            </td>
          </tr>
        ))}
      </tbody>
    );
  } else {
    return (
      <tbody>
        <tr className="file-list-item">
          <td colSpan="4" style={{ textAlign: "center" }}>
            <h3>This folder is empty</h3>
            Upload your files here
          </td>
        </tr>
      </tbody>
    );
  }  
}

export default TableBody;
