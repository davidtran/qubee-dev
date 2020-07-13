import React, { useContext, useEffect } from "react";
import FilesHeader from "../components/Common/FilesHeader";
import FilesBody from "../components/Common/FilesBody";
import { Container, Row, Col, Card } from "reactstrap";
import { FileContext } from "../contexts/FileListContext";
import { useRouteMatch, useLocation } from "react-router-dom";
import queryString from 'query-string';

const Files = () => {
  const { fetchFiles } = useContext(FileContext);  
  const location = useLocation();
  const match = useRouteMatch();  
  const query = queryString.parse(location.search);
  ;
  useEffect(() => {
    fetchFiles({ 
      folderId: match.params.folderId, 
      keyword: query.query 
    });
  }, [match.params.folderId, query.query]);

  return (
    <>
      <Container className="pt-7" fluid>
        <Row className="">
          <Col className="mb-5 mb-xl-0" xl="12">
            <Card className="shadow file-manager">
              <FilesHeader createFolderButton={true} />
              <FilesBody />
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Files;
