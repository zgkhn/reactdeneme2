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
import PersonelDosya from './PersonelDosya';
import { useAuthContext } from '../../hooks/useAuthContext'
import moment from "moment";
import 'moment/locale/tr'
import { useDocument, useAllVeri } from '../../hooks/useCollection'
import FolderCopyIcon from '@mui/icons-material/FolderCopy';
import { Tooltip } from 'react-tooltip';

import HttpsIcon from '@mui/icons-material/Https';
import IconButton from '@mui/material/IconButton';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';

function Tablee({ data, columns }) {
  const [openDialog, setOpenDialog] = useState(false);
  const { user } = useAuthContext();
  const { document: yetki, error } = useDocument("user", user.uid);
  const [openDialogEdit, setOpenDialogEdit] = useState(false);

  const [veri, setVeri] = useState("");
  const [veri1, setVeri1] = useState("");

  const personelAdd = (veri) => {

    setOpenDialog(true);
    setVeri(veri)


  };
  const personelEdit = (veri) => {

    setOpenDialogEdit(true);
    setVeri1(veri)


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

  function replaceTurkishCharacters(text) {
    const replacements = {
      'ş': '\u015F', // Ş
      'Ş': '\u015E', // ş
      'ı': '\u0131', // ı
      'İ': '\u0130', // İ
      'ğ': '\u011F', // ğ
      'Ğ': '\u011E', // Ğ
      'ü': '\u00FC', // ü
      'Ü': '\u00DC', // Ü
      'ö': '\u00F6', // ö
      'Ö': '\u00D6', // Ö
      'ç': '\u00E7', // ç
      'Ç': '\u00C7', // Ç
    };

    return text.replace(/[şŞıİğĞüÜöÖçÇ]/g, (match) => replacements[match]);
  }
  const exportToPDF = () => {
    const doc = new jsPDF({
      orientation: 'landscape', // Sayfayı yan çevir
    });

    const table = document.getElementById('table');

    // Türkçe karakterleri düzelt
    const correctedTable = table.cloneNode(true);
    correctedTable.querySelectorAll('td').forEach((cell) => {
      if (cell.textContent) {
        cell.textContent = replaceTurkishCharacters(cell.textContent);
      }
    });

    doc.autoTable({
      html: correctedTable,
      margin: { top: 10 }, // Tabloyu sayfanın üst kısmına yakın bir konumda başlat
      tableWidth: 'auto', // Tabloyu sayfaya otomatik olarak sığdır
      theme: 'grid', // İstediğiniz tema seçeneğini kullanabilirsiniz
    });

    doc.save('tablo-verileri.pdf');
  };


  const dialogElement = document.querySelector('.custom-popup');

  if (dialogElement) {
    dialogElement.style.width = '800xp';
    //Sayfayı yatayda %80 doldurmak için 

  }
  if (error) {
    return <p>Hata oluştu: {error.message}</p>;
  }
  if (yetki) {
    if (yetki.master === true || yetki.SuruculerOkuma === true) {


      return (

        <div>
          <PersonelPopup open={openDialog} onClose={() => { setOpenDialog(false); }} gelenIdDeger={veri} />
          <PersonelDosya open={openDialogEdit} onClose={() => { setOpenDialogEdit(false); }} gelenIdDeger={veri1} />

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

                    <TableCell style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                        {yetki.master === true || yetki.SuruculerYazma === true ? (
                          <Button style={{ margin: '0 5px', backgroundColor: colors.primary[450] }} variant="contained" size="small" onClick={() => personelAdd(false)} startIcon={<PersonAddAlt1Icon />}></Button>
                        ) : (null)}

                        <Button style={{ margin: '0 5px', backgroundColor: colors.primary[450] }} variant="contained" size="small" onClick={exportToExcel} startIcon={<PostAddIcon />}></Button>
                        <Button style={{ margin: '0 5px', backgroundColor: colors.primary[450] }} variant="contained" size="small" onClick={exportToPDF} startIcon={<PictureAsPdfIcon />}></Button>
                      </div>
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
                          <span style={{ fontSize: '14px', display: 'flex', alignItems: 'center' }}>
                            {column.render('Header')}
                            {column.siralama && ( // Sadece sıralama etkinse iconları göster
                              <>
                                {column.isSorted ? (
                                  column.isSortedDesc ? (
                                    <KeyboardArrowUpIcon fontSize="small" />
                                  ) : (
                                    <KeyboardArrowDownIcon fontSize="small" />
                                  )
                                ) : (
                                  <>
                                    <UnfoldMoreIcon fontSize="small" />
                                  </>
                                )}
                              </>
                            )}

                          </span>

                        </TableCell>
                      ))}
                    </TableRow>


                  ))}
                </TableHead>
                <TableBody {...getTableBodyProps()}       >
                  {page.map((row) => {
                    prepareRow(row);
                    return (
                      <TableRow
                        {...row.getRowProps()}
                        onMouseEnter={() => {
                          row.getRowProps().style = { backgroundColor: colors.primary[100] };
                        }}
                        onMouseLeave={() => {
                          row.getRowProps().style = { backgroundColor: colors.primary[400] };
                        }}
                      >
                        {row.cells.map((cell, cellIndex) => {
                        if (cell.column.avatar) {
                          return (
                            <TableCell {...cell.getCellProps()} style={{ textAlign: cell.column.align || 'left' }}>
                              <Avatar src={cell.value} sx={{ width: 27, height: 27 }} />
                            </TableCell>
                          );
                        } else if (cell.column.ayar) {
                          return (
                            <TableCell {...cell.getCellProps()} data-tooltip-id={cell.value} style={{ textAlign: cell.column.align || 'left' }}>
                              <div style={{ display: 'flex', flexDirection: 'row' }}>

                                <IconButton onClick={() => personelEdit(row.original.id)}>
                                  <FolderCopyIcon />
                                </IconButton>

                                <IconButton onClick={() => personelAdd(row.original.id)}>
                                  <SettingsSuggestIcon />
                                </IconButton>
                              </div>      <Tooltip

                                id={cell.value}
                                content={cell.render('Cell')}
                              />
                            </TableCell>
                          );
                        } else if (cell.column.eyt) {


                          const gelenTarih = moment(cell.value, "DD-MM-YYYY");
                          const bugun = new Date();

                      
                          const gunFarki = Math.floor((gelenTarih - bugun) / (1000 * 60 * 60 * 24));

                          let cellIcerik = null;
                          if (gunFarki < 30) {
                            cellIcerik = (
                              <span style={{ color: 'red' }}>
                                {cell.value} ( {gunFarki} gün kaldı )
                              </span>
                            );
                          } else {
                            cellIcerik = (
                              <span>
                                {cell.value}  ( {gunFarki} gün kaldı )
                              </span>
                            );
                          }
                          return (
                            <TableCell {...cell.getCellProps()} style={{ textAlign: cell.column.align || 'left' }}>
                              {cellIcerik}
                            </TableCell>
                          );
                        } else if (cell.column.popover) {
                          return (
                            <TableCell {...cell.getCellProps()} data-tooltip-delay-show={500} data-tooltip-id={cell.row.id} style={{ textAlign: cell.column.align || 'left' }}>

                              {cell.value ? <> {cell.value.length > 130 ? cell.value.substring(0, 130) + "..." : cell.render('Cell')}</> : cell.render('Cell')}
                              <Tooltip
                                id={cell.row.id}
                                content={cell.render('Cell')}
                                style={{
                                  backgroundColor: colors.primary[450],
                                  width: '400px',
                                  fontSize: '14px'

                                }}
                              />
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
       
        </div>
      );
    } else {
      return <p>Veri yükleniyor...</p>;
    }
  }
}

export default Tablee;
