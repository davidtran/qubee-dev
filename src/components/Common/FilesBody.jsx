import React, { useContext } from "react";
import GalleryView from "./GalleryView";
import ListView from "./ListView";
import { FileContext } from "../../contexts/FileListContext";

function FilesBody() {
  const { view } = useContext(FileContext);
  return <>{view === "list" ? <ListView /> : <GalleryView />}</>;
}

export default FilesBody;
