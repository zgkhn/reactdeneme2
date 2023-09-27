import React, { useState, useEffect } from 'react';
import { useTable, useFilters, usePagination, useSortBy } from 'react-table';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import './tablo.css'; // CSS dosyasını içe aktar
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import PostAddIcon from '@mui/icons-material/PostAdd';
import SearchIcon from '@mui/icons-material/Search';
import { Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { ThemeProvider } from '@mui/material/styles';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { tokens } from "../../theme";
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import PersonelPopup from './PersonelPopup';
import { useAuthContext } from '../../hooks/useAuthContext'
import moment from "moment";
import 'moment/locale/tr'
import { useDocument, useAllVeri } from '../../hooks/useCollection'

import HttpsIcon from '@mui/icons-material/Https';
import IconButton from '@mui/material/IconButton';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';

function Tablee({ data, columns }) {
  const [openDialog, setOpenDialog] = useState(false);
  const { user } = useAuthContext();
  const { document: yetki, error } = useDocument("user", user.uid);

  const [veri, setVeri] = useState("");

  const personelAdd = (veri) => {

    setOpenDialog(true);
    setVeri(veri)


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
  
    const table = doc.lastAutoTable;
  
    // Iterate through columns and skip those with pdf: false
    for (let i = 0; i < table.columns.length; i++) {
      if (columns[i].pdf === false) {
        table.columns[i].minWidth = 0;
        table.columns[i].width = 0;
      }
    }
  
    doc.save('Sürücü-Listesi.pdf');
  };
  
  
  
  
  

  const dialogElement = document.querySelector('.custom-popup');

  if (dialogElement) {
    dialogElement.style.width = '80xp'; /* Sayfayı yatayda %80 doldurmak için */

  }
  // Hata durumunu ele al
  if (error) {
    return <p>Hata oluştu: {error.message}</p>;
  }
  if (yetki) {
    if (yetki.master === true || yetki.SuruculerOkuma === true) {


      return (

        <div>
          <PersonelPopup open={openDialog} onClose={() => { setOpenDialog(false); }} gelenIdDeger={veri} />

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
                          { backgroundColor: colors.primary[450], textAlign: 'left' }) : (
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


                      {yetki.master === true || yetki.SuruculerYazma === true ? (
                        <Button style={{ margin: '0 5px', backgroundColor: colors.primary[450] }} variant="contained" size="small" onClick={() => personelAdd(false)} startIcon={<PersonAddAlt1Icon />}></Button>
                      ) : (null)}

                      <Button style={{ margin: '0 5px', backgroundColor: colors.primary[450] }} variant="contained" size="small" onClick={exportToExcel} startIcon={<PostAddIcon />}></Button>
                      <Button style={{ margin: '0 5px', backgroundColor: colors.primary[450] }} variant="contained" size="small" onClick={exportToPDF} startIcon={<PictureAsPdfIcon />}></Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </div>

          <div align="center">
            <TableContainer>
              <Table id="table" {...getTableProps()} border="0" width="90%" cellSpacing="0" cellPadding="0">
                <TableHead style={
                  {
                    fontWeight: 'bold',
                    backgroundColor: colors.primary[450],
                    color: '#3c9f87',
                    fontSize: '30px'
                  }}>
                  {headerGroups.map((headerGroup) => (

                    <TableRow {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers.map((column) => (
                        <TableCell {...column.getHeaderProps(column.siralama ? column.getSortByToggleProps() : {})}>
                          <span style={{ fontSize: '14px' }}>{column.render('Header')}</span>
                          {column.siralama && ( // Sadece sıralama etkinse iconları göster
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
                      ))}
                    </TableRow>


                  ))}
                </TableHead>
                <TableBody {...getTableBodyProps()}       >
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


                                  <IconButton onClick={() => personelAdd(row.original.id)}>
                                    <SettingsSuggestIcon />
                                  </IconButton>
                                </div>
                              </TableCell>
                            );
                          } else if (cell.column.eyt) {
                            // Örnek tarih değeri ve bugünkü tarih
                            const gelenTarih = new Date(cell.render('Cell'));
                            const bugun = new Date();
                          
                            // Tarihleri belirli bir formatla alın
                            const gelenTarihStr = gelenTarih.toLocaleDateString();
                            const bugunStr = bugun.toLocaleDateString();
                          
                            let cellIcerik = cell.render('Cell');
                            console.log("tarih1", cell.render('Cell').value);
                            console.log("tarih2", bugunStr); // Bu bugün tarihinin string formatını gösterir
                          
                            // Gün farkını hesapla
                            const gunFarki = Math.floor((gelenTarih - bugun) / (1000 * 60 * 60 * 24));
                          
                            // Hücreyi oluştur
                          
                            // Gün farkına göre metin rengini ayarla
                            if (gunFarki < 30) {
                              cellIcerik = (
                                <span style={{ color: 'red' }}>
                                  {cellIcerik} 
                                  {/* ({gunFarki} gün kaldı) */}
                                </span>
                              );
                            } else {
                              cellIcerik = (
                                <span>
                                  {cellIcerik}
                                   {/* ({gunFarki} gün kaldı) */}
                                </span>
                              );
                            }
                          
                            return (
                              <TableCell {...cell.getCellProps()} style={{ textAlign: cell.column.align || 'left' }}>
                                {cellIcerik}
                              </TableCell>
                            );
                          } else {
                            return (
                              <TableCell {...cell.getCellProps()} style={{ textAlign: cell.column.align || 'left' }}>
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
            <p>&nbsp;</p>    </div>
        </div>
      );
    } else {
      return <p>Veri yükleniyor...</p>;
    }
  }
}

export default Tablee;
