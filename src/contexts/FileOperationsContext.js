import React, { useContext, useState, useEffect } from "react";
import { useMutation, useLazyQuery } from "@apollo/react-hooks";
import { loader } from "graphql.macro";
import { FileContext } from "./FileListContext";

const filesQuery = loader("../queries/files.graphql");
const renameFileQuery = loader("../queries/renameFile.graphql");
const deleteFilesQuery = loader("../queries/deleteFiles.graphql");
const renameFolderQuery = loader("../queries/renameFolder.graphql");
const deleteFoldersQuery = loader("../queries/deleteFolders.graphql");
const moveFileQuery = loader("../queries/moveFile.graphql");

export const FileOperationsContext = React.createContext({
  renameFileAndFolder: () => {},
  deleteFileAndFolder: () => {},
  moveFile: () => {},
  isRenamePending: false,
  isRenameError: null,
  isDeletePending: false,
  isDeleteError: null,
  folders: [],
  selectedFolderId: null,
  selectFolder: () => {},
  fetchFolders: () => {},
});

export const FileOperationsContextProvider = ({ children }) => {
  const { getSelectedFiles, deselectFiles, refresh } = useContext(FileContext);
  const [renameFileMutation] = useMutation(renameFileQuery);
  const [renameFolderMutation] = useMutation(renameFolderQuery);
  const [deleteFilesMutation] = useMutation(deleteFilesQuery);
  const [deleteFoldersMutation] = useMutation(deleteFoldersQuery);
  const [moveFileMutation] = useMutation(moveFileQuery);

  const [isRenamePending, setIsRenamePending] = useState(false);
  const [isRenameError, setIsRenameError] = useState(null);
  const [isDeletePending, setIsDeletePending] = useState(false);
  const [isDeleteError, setIsDeleteError] = useState(null);
  const [isMovePending, setIsMovePending] = useState(false);
  const [isMoveError, setIsMoveError] = useState(null);

  const [folders, setFolders] = useState([]);
  const [selectedFolderId, setSelectedFolderId] = useState(null);
  const [fetchFolderQuery, { data: folderData }] = useLazyQuery(filesQuery);

  useEffect(() => {
    if (folderData) {
      setFolders(folderData.getFiles.folders);
    }
  }, [folderData]);

  function selectFolder(folderId) {
    fetchFolderQuery({ variables: { folderId } });
    setSelectedFolderId(folderId);
  }

  function fetchFolders() {
    fetchFolderQuery({ variables: { folderId: null } });
    setSelectedFolderId(null);
  }

  async function moveFile() {
    const files = getSelectedFiles();
    const fileIds = files
      .filter((file) => file.kind === "FILE")
      .map((file) => file.id);
    console.log(selectedFolderId, files);
    if (fileIds.length === 0) return;
    setIsMovePending(true);
    setIsMoveError(true);

    try {
      await moveFileMutation({
        variables: { folderId: selectedFolderId, files: fileIds },
      });
      setIsMovePending(false);
      setSelectedFolderId(null);
      deselectFiles();
      refresh();
    } catch (e) {
      setIsMoveError(true);
      setIsMovePending(false);
    }
  }

  async function renameFileAndFolder(name) {
    const files = getSelectedFiles();
    if (files.length === 0) return;
    const file = files[0];

    setIsRenamePending(true);
    setIsRenameError(null);
    try {
      if (file.kind === "FILE") {
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
          },
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
      pms.push(
        deleteFoldersMutation({ variables: { folderIds: deleteFolderIds } })
      );
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
    moveFile,
    isMovePending,
    isMoveError,
    isRenamePending,
    isRenameError,
    isDeletePending,
    isDeleteError,
    selectFolder,
    folders,
    selectedFolderId,
    setSelectedFolderId,
    fetchFolders,
  };

  return (
    <FileOperationsContext.Provider value={value}>
      {children}
    </FileOperationsContext.Provider>
  );
};
