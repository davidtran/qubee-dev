import React, { useContext, useEffect } from "react";
import FilesHeader from "../components/Common/FilesHeader";
import FilesBody from "../components/Common/FilesBody";
import { Container, Row, Col, Card } from "reactstrap";
import { FileContext } from "../contexts/FileListContext";
import { useRouteMatch } from "react-router-dom";

const Files = () => {
  const { fetchFiles } = useContext(FileContext);  
  useEffect(() => {
    fetchFiles({});
  }, []);
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
