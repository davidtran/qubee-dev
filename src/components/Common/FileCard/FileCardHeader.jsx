import React from "react";
import { Button, CardHeader } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function FileCardHeader({ file, isSelected, onCheckboxClick }) {
  return (
    <CardHeader
      tag="h3"
      className="file-card-header px-3 py-3"
      style={{ backgroundColor: isSelected && "#f7fafc" }}
    >
      {" "}
      <Button
        color="link"
        size="sm"
        type="button"
        onClick={() => onCheckboxClick(file.id)}
      >
        <FontAwesomeIcon
          icon={isSelected ? "check-square" : ["far", "square"]}
          size="lg"
        />
      </Button>
      <Button
        className="float-right"
        color="link"
        size="sm"
        type="button"
        // onClick={() => onEllipsisClick(file)}
      >
        <FontAwesomeIcon icon="ellipsis-v" size="lg" />
      </Button>
    </CardHeader>
  );
}
