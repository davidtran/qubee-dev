import React from "react";
import MetaTags from "../Modals/MetaTags";
import { Badge } from "reactstrap";

function Tags({ file }) {
  return (
    <div className="tags-container">
      {file.tags.map((tag, i) => (
        <Badge
          key={tag + i}
          className="mr-2"
          color="primary"
          pill
          href="#pablo"
        >
          {tag}
        </Badge>
      ))}
      <MetaTags buttonLabel="add +" fileId={file.id} />
    </div>
  );
}

export default Tags;
