import React, { useState } from 'react';
import { useTable, useFilters, usePagination } from 'react-table';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import './tablo.css'; // CSS dosyasını içe aktar

function Table({ data, columns }) {
  const [searchText, setSearchText] = useState('');

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    state: { pageIndex, pageSize },
    setPageSize,
    setFilter,
    gotoPage, // Ekledik
    previousPage, // Ekledik
    nextPage, // Ekledik
    canPreviousPage, // Ekledik
    canNextPage, // Ekledik
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0 },
    },
    useFilters,
    usePagination
  );

  const exportToExcel = () => {
    const workSheet = XLSX.utils.json_to_sheet(data);
    const workBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workBook, workSheet, 'Tablo Verileri');
    const excelBuffer = XLSX.write(workBook, {
      bookType: 'xlsx',
      type: 'array',
    });
    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tablo-verileri.xlsx';
    a.click();
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({ html: '#table' });
    doc.save('tablo-verileri.pdf');
  };

  return (
    <div style={{ marginLeft: '20px', marginRight: '20px' }}>
      <div className="table-controls">
        <button onClick={exportToExcel}>Excel'e Aktar</button>
        <button onClick={exportToPDF}>PDF'e Aktar</button>
        <div className="pagination">
          <span>
            Sayfa{' '}
            <strong>
              {pageIndex + 1} / {Math.ceil(data.length / pageSize)}
            </strong>
          </span>
          <button onClick={() => setPageSize(5)}>5</button>
          <button onClick={() => setPageSize(10)}>10</button>
          <button onClick={() => setPageSize(25)}>25</button>
          <button onClick={() => setPageSize(50)}>50</button>
        </div>
      </div>
      <div className="mb-4 flex gap-x-2">
      <input
        type="text"
        placeholder="Ara..."
        onChange={(e) => {
          const value = e.target.value || undefined;
          setFilter('ad', value); // Gerçek sütun adını kullanın
        }}
      />
       <input
        type="text"
        placeholder="Ara..."
        onChange={(e) => {
          const value = e.target.value || undefined;
          setFilter('tel', value); // Gerçek sütun adını kullanın
        }}
      />
  </div>
      <table id="table" {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="pagination">
        
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          Önceki
        </button>
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          Sonraki
        </button>
    
      </div>
    </div>
  );
}

export default Table;
