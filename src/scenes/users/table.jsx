import React, { useState  } from 'react';
import { useTable, useFilters, usePagination, useSortBy } from 'react-table';

import './tablo.css'; // CSS dosyasını içe aktar

import SearchIcon from '@mui/icons-material/Search';
import { Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { tokens } from "../../theme";
import Avatar from '@mui/material/Avatar';
import PersonelPopup from './PersonelPopup';
import MyForm from './profilEditextra';


import HttpsIcon from '@mui/icons-material/Https';
import IconButton from '@mui/material/IconButton';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';

function Tablee({ data, columns }) {



  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRecordId, setSelectedRecordId] = useState(null);


  const [openDialog1, setOpenDialog1] = useState(false);
  const [selectedRecordId1, setSelectedRecordId1] = useState(null);

  const handlePopupOpen = (recordId) => {
    setSelectedRecordId(recordId);
    setOpenDialog(true);
  };

  const handlePopupClose = () => {
    setSelectedRecordId(null);
    setOpenDialog(false);
  };

  const handlePopupOpen1 = (recordId) => {
    setSelectedRecordId1(recordId);
    setOpenDialog1(true);
  };

  const handlePopupClose1 = () => {
    setSelectedRecordId1(null);
    setOpenDialog1(false);
  };

  




  const [searchText, setSearchText] = useState('');

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const filteredData = React.useMemo(() => {
    return data.filter((row) => {
      return columns.some((column) => {
        const cellValue = String(row[column.accessor]).toLowerCase();
        return column.ara && cellValue.includes(searchText.toLowerCase());
      });
    }, [data, searchText, columns]);
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



  
  return (

    <div>
      {selectedRecordId !== null && selectedRecordId !== undefined && (
      <PersonelPopup open={openDialog} onClose={handlePopupClose} selectedRecordId={selectedRecordId} />
      )}
      {selectedRecordId1 !== null && selectedRecordId1 !== undefined && (
      <MyForm open={openDialog1} onClose={handlePopupClose1} id={selectedRecordId1} />
      )}


      <div align="center">
        <TableContainer


          style={
            {
              backgroundColor: colors.primary[400]
              , borderTopLeftRadius: '10px', borderTopRightRadius: '10px'
            }}


        >
          <Table border="0" width="90%" cellSpacing="0" cellPadding="0">
            <TableBody>
              <TableRow>
                <TableCell>
                  <TextField
                    type="text"
                    size="small"


                    style={theme.palette.mode === "dark" ? (
                      { backgroundColor: '#1F2A40', textAlign: 'left' }) : (
                      { backgroundColor: '#F2F0F0', textAlign: 'left' }
                    )}


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

                <TableCell style={{ textAlign: 'right' }}> {/* Düğmeleri sağa yaslar */}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      <div align="center">
      <TableContainer>
  <Table id="table" {...getTableProps()} border="0" width="90%" cellSpacing="0" cellPadding="0">
    <TableHead style={{
      fontWeight: 'bold',
      backgroundColor: colors.primary[450],
      color: '#3c9f87',
      fontSize: '30px',
    }}>
      {headerGroups.map((headerGroup) => (
        <TableRow {...headerGroup.getHeaderGroupProps()}>
          {headerGroup.headers.map((column, columnIndex) => (
            <React.Fragment key={columnIndex}>
              <TableCell
                {...column.getHeaderProps(column.siralama ? column.getSortByToggleProps() : {})}
                style={{
                  width: `${column.sm * 90}px`,
                  textAlign: column.align || 'left',
                 
                }}
              >
                <span style={{ fontSize: '14px' }}>{column.render('Header')}</span>
                {column.siralama && (
                  column.isSorted ? (
                    column.isSortedDesc ? (
                      <KeyboardArrowUpIcon fontSize="small" />
                    ) : (
                      <KeyboardArrowDownIcon fontSize="small" />
                    )
                  ) : (
                    <>
                      <KeyboardArrowUpIcon fontSize="small" />
                      <KeyboardArrowDownIcon fontSize="small" />
                    </>
                  )
                )}
              </TableCell>
            </React.Fragment>
          ))}
        </TableRow>
      ))}
    </TableHead>
    <TableBody {...getTableBodyProps()}>
      {page.map((row) => {
        prepareRow(row);
        return (
          <TableRow {...row.getRowProps()}>
            {row.cells.map((cell, cellIndex) => {
              if (cell.column.avatar) {
                return (
                  <TableCell {...cell.getCellProps()} style={{ textAlign: cell.column.align || 'left' }}>
                    <Avatar src={cell.value} sx={{ width: 27, height: 27 }} />
                  </TableCell>
                );
              } else if (cell.column.ayar) {
                return (
                  <TableCell {...cell.getCellProps()} style={{ textAlign: cell.column.align || 'left' }}>
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                      <IconButton onClick={() => handlePopupOpen(row.original.id)}>
                        <HttpsIcon />
                      </IconButton>
                      <IconButton onClick={() => handlePopupOpen1(row.original.id)}>
                        <SettingsSuggestIcon  />
                      </IconButton>
                    </div>
                  </TableCell>
                );
              } else {
                return (
                  <TableCell {...cell.getCellProps()} style={{ textAlign: cell.column.align || 'left'  }}>
                    {cell.render('Cell')}
                  </TableCell>
                );
              }
            })}
          </TableRow>
        );
      })}
    </TableBody>
  </Table>
</TableContainer>


      </div>
      <div style={{
        textAlign: 'center',
        marginTop: 30,
      }} >
        <Button style={{ margin: '0 5px', backgroundColor: colors.primary[450] }} variant="contained" size="small" onClick={() => previousPage()} disabled={!canPreviousPage}>
          Önceki
        </Button>
        <span>
          Sayfa {' '}
          <strong>
            {pageIndex + 1} / {Math.ceil(filteredData.length / pageSize)}
          </strong>
        </span>
        <Button style={{ margin: '0 5px', backgroundColor: colors.primary[450] }} variant="contained" size="small" onClick={() => nextPage()} disabled={!canNextPage}>
          Sonraki
        </Button>


        <Button style={{ margin: '0 5px', backgroundColor: colors.primary[450] }} variant="contained" size="small" onClick={() => setPageSize(25)}>10</Button>
        <Button style={{ margin: '0 5px', backgroundColor: colors.primary[450] }} variant="contained" size="small" onClick={() => setPageSize(50)}>25</Button>
        <Button style={{ margin: '0 5px', backgroundColor: colors.primary[450] }} variant="contained" size="small" onClick={() => setPageSize(100)}>50</Button>
      </div>
      <div >
        <p>&nbsp;</p>   
        
        
      
        
        
        
        
        
          </div>
    </div>
  );
}

export default Tablee;
