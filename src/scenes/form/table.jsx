import React, { useState } from 'react';
import { useTable, useFilters, usePagination, useSortBy } from 'react-table';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import './tablo.css'; // CSS dosyasını içe aktar
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import PostAddIcon from '@mui/icons-material/PostAdd';
import SearchIcon from '@mui/icons-material/Search';
import { Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';






function Tablee({ data, columns }) {
  const [searchText, setSearchText] = useState('');


  const filteredData = React.useMemo(() => {
    return data.filter((row) => {
      return columns.some((column) => {
        const cellValue = String(row[column.accessor]).toLowerCase();
        return cellValue.includes(searchText.toLowerCase());
      });
    });
  }, [data, searchText, columns]);
  const {
  headerGroups,
  getTableProps,
  getTableBodyProps,
  page,
  prepareRow,
    state: { pageIndex, pageSize, sortBy }, // sortBy'ı kullanmak için state'e ekleyin
    setPageSize,
    gotoPage,
    previousPage,
    nextPage,
    canPreviousPage,
    canNextPage,
  } = useTable(
    {
      columns,
      data: filteredData,
      initialState: { pageIndex: 0 },
    },
    useFilters, // useFilters'ı ilk olarak ekleyin
    useSortBy, // useSortBy'ı sonra ekleyin
    usePagination
  );
  
  const exportToExcel = () => {
    // Yalnızca belirli sütunları içeren yeni bir veri oluşturun
    const filteredDataForExport = filteredData.map(item => {
      const rowData = {};
      columns.forEach(column => {
        rowData[column.Header] = item[column.accessor];
      });
      return rowData;
    });
  
    const workSheet = XLSX.utils.json_to_sheet(filteredDataForExport); // Filtrelenmiş verileri kullanarak sayfa oluştur
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
    const doc = new jsPDF({
      orientation: 'landscape', // Sayfayı yan çevir
    });
  
    doc.autoTable({
      html: '#table',
      margin: { top: 10 }, // Tabloyu sayfanın üst kısmına yakın bir konumda başlat
      tableWidth: 'auto', // Tabloyu sayfaya otomatik olarak sığdır
      theme: 'grid', // İstediğiniz tema seçeneğini kullanabilirsiniz
    });
  
    doc.save('tablo-verileri.pdf');
  };
console.log(page)

  return (
    <div>
    <div align="center">
      <TableContainer>
        <Table border="0" width="90%" cellspacing="0" cellpadding="0">
          <TableBody>
            <TableRow>
              <TableCell>
                <TextField
                  type="text"
                  size="small"
                  placeholder="Ara..."
                  value={searchText}
                  onChange={(e) => {
                    setSearchText(e.target.value);
                  }}
                  InputProps={{
                    endAdornment: (
                      <SearchIcon />
                    ),
                  }}
                />
              </TableCell>
             
              <TableCell>
                <Button  variant="contained" size="small" onClick={exportToExcel} startIcon={<PostAddIcon />}>asd</Button>
                <Button  variant="contained" size="small" onClick={exportToPDF} startIcon={<PictureAsPdfIcon />}>asdas</Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </div>
    <div align="center">
      <TableContainer>
        <Table id="table" {...getTableProps()} border="0" width="90%" cellspacing="0" cellpadding="0">
          <TableHead>
            {headerGroups.map((headerGroup) => (
              <TableRow {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <TableCell {...column.getHeaderProps(column.getSortByToggleProps())}>
                    {column.render('Header')}
                    {column.isSorted ? (column.isSortedDesc ? ' &#128317;' : ' &#128316;') : ''}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody {...getTableBodyProps()}>
            {page.map((row) => {
              prepareRow(row);
              return (
                <TableRow {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return <TableCell {...cell.getCellProps()}>{cell.render('Cell')}</TableCell>;
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
    <div align="center">
      <Button  variant="contained" size="small" onClick={() => previousPage()} disabled={!canPreviousPage}>
        Önceki
      </Button>
      <Button  variant="contained" size="small" onClick={() => nextPage()} disabled={!canNextPage}>
        Sonraki
      </Button>
      <span>
                  Sayfa{' '}
                  <strong>
                    {pageIndex + 1} / {Math.ceil(filteredData.length / pageSize)}
                  </strong>
                </span>
                <Button  variant="contained" size="small" onClick={() => setPageSize(5)}>5</Button>
                <Button  variant="contained" size="small" onClick={() => setPageSize(10)}>10</Button>
                <Button  variant="contained" size="small" onClick={() => setPageSize(25)}>25</Button>
                <Button  variant="contained" size="small" onClick={() => setPageSize(50)}>50</Button>
    </div>
  </div>
  );
}

export default Tablee;
