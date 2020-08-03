import React, { useEffect } from 'react';
import { useSortBy, useTable, UseTableOptions } from 'react-table';

type TableProps = {
  columns: UseTableOptions<any>['columns'];
  data: UseTableOptions<any>['data'];
  hiddenColumns: string[];
};

const Table = ({ columns, data, hiddenColumns }: TableProps) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    setHiddenColumns,
  } = useTable({ columns, data }, useSortBy);

  useEffect(() => setHiddenColumns(hiddenColumns), [
    setHiddenColumns,
    hiddenColumns,
  ]);

  return (
    <table {...getTableProps()}>
      <thead>
        {headerGroups.map((headerGroup) => (
          // Key provided by getHeaderGroupProps()
          // eslint-disable-next-line react/jsx-key
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              // Key provided by getHeaderProps()
              // eslint-disable-next-line react/jsx-key
              <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                {column.render('Header')}
                <span>
                  {column.isSorted ? (column.isSortedDesc ? ' ↓' : ' ↑') : '  '}
                </span>
              </th>
            ))}
          </tr>
        ))}
      </thead>

      <tbody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row);

          return (
            // Key provided by getRowProps()
            // eslint-disable-next-line react/jsx-key
            <tr {...row.getRowProps()}>
              {row.cells.map((cell) => {
                // Key provided by getCellProps()
                // eslint-disable-next-line react/jsx-key
                return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default Table;
