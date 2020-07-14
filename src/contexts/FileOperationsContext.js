import React, { useContext, useState } from "react";
import { useMutation, useLazyQuery } from "@apollo/react-hooks";
import { loader } from "graphql.macro";
import { FileContext } from "./FileListContext";

const renameFileQuery = loader("../queries/renameFile.graphql");
const deleteFilesQuery = loader("../queries/deleteFiles.graphql");
const renameFolderQuery = loader("../queries/renameFolder.graphql");
const deleteFoldersQuery = loader("../queries/deleteFolders.graphql");

export const FileOperationsContext = React.createContext({
  renameFileAndFolder: () => {},  
  deleteFileAndFolder: () => {},
  isRenamePending: false,
  isRenameError: null,
  isDeletePending: false,
  isDeleteError: null,
});

export const FileOperationsContextProvider = ({ children }) => {
  const { getSelectedFiles, deselectFiles, refresh } = useContext(FileContext);
  const [renameFileMutation] = useMutation(renameFileQuery);
  const [renameFolderMutation] = useMutation(renameFolderQuery);
  const [deleteFilesMutation] = useMutation(deleteFilesQuery);
  const [deleteFoldersMutation] = useMutation(deleteFoldersQuery);

  const [isRenamePending, setIsRenamePending] = useState(false);
  const [isRenameError, setIsRenameError] = useState(null);
  const [isDeletePending, setIsDeletePending] = useState(false);
  const [isDeleteError, setIsDeleteError] = useState(null);

  async function renameFileAndFolder(name) {
    const files = getSelectedFiles();
    if (files.length === 0) return;
    const file = files[0];

    setIsRenamePending(true);
    setIsRenameError(null);
    try {
      if (file.kind === 'FILE') {
        await renameFileMutation({
          variables: {
            fileId: file.id,
            fileName: name,
          },
        });
      } else {
        await renameFolderMutation({
          variables: {
            folderId: file.id,
            folderName: name,
          }
        });
      }
      setIsRenamePending(false);
      deselectFiles();
      refresh();
    } catch (e) {
      setIsRenameError(e);
      setIsRenamePending(false);
    }
  }


  async function deleteFileAndFolder() {
    const files = getSelectedFiles();
    const deleteFileIds = files
      .filter((file) => file.kind === "FILE")
      .map((file) => file.id);
    const deleteFolderIds = files
      .filter((file) => file.kind === "FOLDER")
      .map((file) => file.id);
    
    const pms = [];
    if (deleteFileIds.length > 0) {
      pms.push(deleteFilesMutation({ variables: { files: deleteFileIds } }));      
    }
    if (deleteFolderIds.length > 0) {
      pms.push(deleteFoldersMutation({ variables: { folderId: deleteFolderIds[0] }}))
    }

    setIsDeletePending(true);
    setIsDeleteError(null);

    try {
      await Promise.all(pms);
      deselectFiles();
      refresh();
      setIsDeletePending(false);
    } catch (e) {
      console.log(e);
      setIsDeletePending(false);
      setIsDeleteError(e);
    }
  }

  const value = {
    renameFileAndFolder,
    deleteFileAndFolder,
    isRenamePending,
    isRenameError,
    isDeletePending,
    isDeleteError,
  };


  return (
    <FileOperationsContext.Provider value={value}>
      {children}
    </FileOperationsContext.Provider>
  );
};
