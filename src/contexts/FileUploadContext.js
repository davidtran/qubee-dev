import React, { useState, useContext } from 'react';
import Promise from 'bluebird';
import { loader } from "graphql.macro";
import { useMutation, useApolloClient } from '@apollo/react-hooks';
import { FileContext } from './FileListContext';
const uploadFileQuery = loader('../queries/uploadFile.graphql');
const getUploadProgressQuery = loader('../queries/getUploadProgress.graphql');

export const FileUploadContext = React.createContext({
  statuses: {},
  uploadFile: () => {},
})

export const FileUploadContextProvider = ({ children }) => {
  const { refresh } = useContext(FileContext);
  const [uploadFileStatuses, setUploadFileStatuses] = useState({});
  const [uploadFileMutation] = useMutation(uploadFileQuery);
  const client = useApolloClient();
  const CHUNK_SIZE = 300000; // 1MB

  async function uploadFile(file, folderId) {
    const reader = new FileReader();
    const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
    const fileId = folderId + '-' + file.name;
    let chunkCount = 1;

    console.log(file.size);

    function getNextChunk() {
      return new Promise((resolve, reject) => {
        const length = totalChunks === 1 ? file.size : CHUNK_SIZE;
        const start = length * (chunkCount - 1);

        reader.onload = () => {
          const chunk = new Blob([reader.result]);
          chunk.name = file.name;
          resolve(chunk);
        };
        if (chunkCount === totalChunks) {
          reader.readAsArrayBuffer(file.slice(start));
        } else {
          reader.readAsArrayBuffer(file.slice(start, start + length));
        }

      });
    }


    function sendChunk() {
      return getNextChunk()
        .then(chunk => {
          return uploadFileMutation({ variables: {
            file: chunk,
            filename: file.name,
            folderId: folderId,
            totalChunks,
            chunkNumber: chunkCount
          }})
        })
        .then(() => {
          if (chunkCount < totalChunks) {
            const progress = Math.round(chunkCount / totalChunks * 100);
            setFileStatus({ filename: file.name, progress, isUploading: true, error: false, success: false });
            chunkCount++;
            sendChunk();
          } else {
            refresh();
            setFileStatus({ filename: file.name, progress: 100, isUploading: false, error: false, success: true });
          }
        })
        .catch((e) => {
          console.log(e);
          setFileStatus({ filename: file.name, isUploading: false, error: true, success: false });
        });
    }

    try {
      setFileStatus({ filename: file.name, progress: 0, isUploading: true, error: false, success: false });
      const uploadProgress = await client.query({
        query: getUploadProgressQuery,
        variables: {
          folderId,
          filename: file.name,
        }
      });

      if (uploadProgress.data.getUploadProgress.isResumable) {
        chunkCount = uploadProgress.data.getUploadProgress.lastChunkNumber + 1;
      }
      sendChunk();
    } catch (e) {
      console.log(e);
    }
  }


  function setFileStatus({ filename, progress, isUploading, error, success }) {
    setUploadFileStatuses({
      ...uploadFileStatuses,
      [filename]: {
        progress,
        isUploading,
        error,
        success
      }
    });
  }

  const value = {
    statuses: uploadFileStatuses,
    uploadFile,
  }

  return (
    <FileUploadContext.Provider value={value}>{children}</FileUploadContext.Provider>
  );
}