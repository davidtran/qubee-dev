import React, { useContext } from "react";
import FileCard from "./FileCard/FileCard";
import { FileContext } from "../../contexts/FileListContext";

export default function GalleryView() {
  const { files, selectedFileIds, toggleSelectFile } = useContext(FileContext);
  let galleryView;

  if (files.length) {
    galleryView = (
      //   <div className="d-flex justify-content-start px-3 pb-5 flex-wrap">
      <div className="gallery-grid">
        {/* <Row xs="1" sm="2" md="4"> */}
        {files.map((file) => {
          return (
            <FileCard
              file={file}
              isSelected={selectedFileIds.indexOf(file.id) >= 0}
              onCheckboxClick={toggleSelectFile}
              key={file.id}
            />
          );
        })}
        {/* </Row> */}
      </div>
    );
  } else {
    galleryView = (
      <div className="text-center p-2" style={{ fontSize: "0.8125rem" }}>
        <h3>This folder is empty</h3>
        Upload your files here
      </div>
    );
  }
  return galleryView;
}
