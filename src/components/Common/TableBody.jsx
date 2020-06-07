import React, { Component } from "react";
import Tags from "./Tags";
import fileSizeConversion from "../../utils/fileSizeConversion";
import { Media } from "reactstrap";
import { Link } from "react-router-dom";

class TableBody extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checkboxes: new Map(),
    };
  }

  // checkAll = () => {
  //   this.state.data.forEach((item) => {
  //     item.checked = true;
  //     item.items.forEach((child) => (child.checked = true));
  //   });
  //   this.forceUpdate();
  // };

  // uncheckAll = () => {
  //   this.state.data.forEach((item) => {
  //     item.checked = false;
  //     item.items.forEach((child) => (child.checked = false));
  //   });
  //   this.forceUpdate();
  // };

  handleChange = (e) => {
    const item = e.target.id;
    const isChecked = e.target.checked;
    this.setState((prevState) => ({
      checkboxes: prevState.checkboxes.set(item, isChecked),
    }));
    // let checkboxMap = this.state.checkboxes;

    // console.log(checkboxMap);
  };

  /**
   * Look into array filter: (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter)
   * and array includes: (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes)
   */

  findInMap = (map) => {
    for (let v of map.values()) {
      console.log(v);

      if (v === true) {
        return true;
      }
    }
    return false;
  };

  render() {
    const { files, folders, getFiles, isChecked } = this.props;

    // for (let checkbox of this.state.checkboxes.values()) {
    //   console.log(checkbox);
    // }

    return (
      <tbody>
        {folders.map((folder) => (
          <tr
            key={folder._id}
            className={this.state.isSelected ? "selected" : ""}
          >
            <th scope="row">
              <div className="custom-control custom-checkbox mb-4">
                <input
                  className="custom-control-input"
                  id={folder._id}
                  type="checkbox"
                  checked={!!this.state.checkboxes.get(folder._id)}
                  onChange={this.handleChange}
                />
                <label
                  className="custom-control-label"
                  htmlFor={folder._id}
                ></label>
              </div>
            </th>
            <td>
              <Media className="align-items-center">
                <Link to={`/admin/folder/${folder._id}`}>
                  <i className="fas fa-folder-open mr-2" />
                  <span className="mb-0 text-sm">{folder.name}</span>
                </Link>
              </Media>
            </td>
            <td>{folder.dateAdded}</td>
            <td></td>
          </tr>
        ))}
        {files.map((file, i) => (
          <tr
            key={file._id}
            className={this.state.isSelected ? "selected" : ""}
          >
            <th scope="row">
              <div className="custom-control custom-checkbox mb-4">
                <input
                  className="custom-control-input"
                  id={file._id}
                  value={file._id}
                  type="checkbox"
                  checked={!!this.state.checkboxes.get(file._id)}
                  onChange={this.handleChange}
                />
                <label
                  className="custom-control-label"
                  htmlFor={file._id}
                ></label>
              </div>
            </th>
            <td>
              <Media className="align-items-center mb-2">
                <Link to={`/admin/folder/${file.path}`}>
                  <i className="fas fa-file-image mr-2" />
                  <span className="mb-0 text-sm">{file.name}</span>
                </Link>
              </Media>
              <Tags file={file} getFiles={getFiles} />
            </td>
            <td>{file.dateAdded}</td>
            <td>{fileSizeConversion(file.size, true)}</td>
          </tr>
        ))}
      </tbody>
    );
  }
}

export default TableBody;
