import React from "react";
import TableHeader from "./TableHeader";
import TableBody from "./TableBody";
import { Table } from "reactstrap";

export default function ListView() {
  return (
    <div>
      <Table
        className="align-items-center table-flush"
        hover
        responsive
        size="sm"
      >
        <TableHeader />
        <TableBody />
      </Table>
    </div>
  );
}
