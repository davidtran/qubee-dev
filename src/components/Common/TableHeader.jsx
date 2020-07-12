import React, { useContext } from 'react';
import { Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FileContext } from '../../contexts/FileListContext';

function TableHeader() {
  const { selectAllFiles, isSeletedAll, sorting, toggleSortDirection } = useContext(FileContext);
  
  function renderSortDirection(attributeName) {
    if (!sorting || sorting.attribute !== attributeName) return null;
    if (sorting.direction === 'ASC') {
      return <FontAwesomeIcon icon="arrow-down" />;
    } else {
      return <FontAwesomeIcon icon="arrow-up" />;
    }
  }

  return (
    <thead className="thead-light">
      <tr className="file-list-item">
        <th scope="col" width="76">          
          <Button color="link" size="sm" onClick={selectAllFiles}>
            <FontAwesomeIcon
              icon={isSeletedAll ? 'check-square' : ['far', 'square']}
              size="lg"
            />
          </Button>
        </th>
        <th
          className="sortable"
          scope="col"
          width="50%"
          onClick={() => toggleSortDirection('name')}
        >
          File Name &nbsp;{renderSortDirection('name')}
        </th>
        <th
          className="sortable"
          scope="col"
          onClick={() => toggleSortDirection('createdDate')}
        >
          Date Added &nbsp;{renderSortDirection('createdDate')}
        </th>
        <th
          className="sortable"
          scope="col"
          onClick={() => toggleSortDirection('size')}
        >
          Size &nbsp;{renderSortDirection('size')}
        </th>
      </tr>
    </thead>
  );
}

export default TableHeader;
