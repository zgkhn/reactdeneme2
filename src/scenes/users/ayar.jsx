import React, {useEffect, useState } from 'react';

import { Button, useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { db } from '../../firebase/config'; // Firebase Firestore bağlantısı
import { collection, query, where, getDocs } from 'firebase/firestore';


import { styled } from '@mui/system';

import { tokens } from "../../theme";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import ProfilEdit from './profilEdit';
import FirmaEdit from './firmaEdit';


import { useAuthContext } from '../../hooks/useAuthContext'

import { useDocument, useAllVeri } from '../../hooks/useCollection'

const StyledBox = styled(Box)`

`;

const StyledForm = styled('form')`

`;

const StyledLogo = styled('img')`

`;

const StyledSignUpButton = styled(Button)`

`;
function Ayar({ }) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
const { user } = useAuthContext();

const { document, error } = useDocument("user", user.uid);
//////////////////////////////////////////////////////////////////////////////////////////
const { documents, error: errorr } = useAllVeri("user");

// Eşleşen öğeleri saklamak için boş bir dizi oluştur
const eşleşenDokumanlar = [];

// documents dizisini dönerek firmakod ile user.displayName karşılaştırması yap
documents.forEach(dokuman => {
  if (dokuman.firmakod === user.displayName) {
    // Eşleşen öğeyi eşleşenDokumanlar dizisine ekle



    eşleşenDokumanlar.push(dokuman);
  }
});

// eşleşenDokumanlar dizisinde eşleşen öğeleri bulabilirsiniz
console.log("eşleşenler :",eşleşenDokumanlar);



////////////////////////////////////////////////////////////////////////////////////////
  const [value, setValue] = React.useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };


  const columns = [
    {
      Header: '',
      accessor: 'avatar', // Gerçek veriye göre bu kısmı güncelleyin
      avatar:true,

     },{
      Header: 'Adı Soyadı',
      accessor: 'ad', // Gerçek veriye göre bu kısmı güncelleyin
      sortType: 'alphanumeric', // Sıralama türü belirtin (isteğe bağlı)
     ara:true
    },
    {
      Header: 'Kullanıcı Adı',
      accessor: 'tel', // Gerçek veriye göre bu kısmı güncelleyin
      siralama:false ,
      ara:true


    },
    {
      Header: 'Ehliyet Yenileme Tarihi',
      accessor: 'bilgi', // Gerçek veriye göre bu kısmı güncelleyin
      sortType: 'alphanumeric', // Sıralama türü belirtin (isteğe bağlı)

    },
    {
      Header: 'Belge Türü',
      accessor: 'ehliyet', // Gerçek veriye göre bu kısmı güncelleyin
      sortType: 'alphanumeric', // Sıralama türü belirtin (isteğe bağlı)

    },{
      Header: 'Email',
      accessor: 'email', // Gerçek veriye göre bu kısmı güncelleyin
      sortType: 'alphanumeric', // Sıralama türü belirtin (isteğe bağlı)

    },
    {
      Header: 'Telefon',
      accessor: 'tel412', // Gerçek veriye göre bu kısmı güncelleyin
      sortType: 'alphanumeric', // Sıralama türü belirtin (isteğe bağlı)

    },
  ];



  // Veri yüklenene kadar yükleme göster
  if (document === null) {
    return <p>Veri yükleniyor...</p>;
  }

  // Hata durumunu ele al
  if (error) {
    return <p>Hata oluştu: {error.message}</p>;
  }
  return (

    <div>


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
                <TableCell style={{ textAlign: 'right' }}> {/* Düğmeleri sağa yaslar */}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      <div align="center">
        <TableContainer>
          <Table id="table" border="0" width="90%" cellSpacing="0" cellPadding="0">
           
          <TabContext value={value}>

            <TableHead style={
              {
                fontWeight: 'bold',
                backgroundColor: colors.primary[450],
                color: '#3c9f87',
                fontSize: '30px',
                position: 'relative',
                overflow: 'hidden',
              }}>


              <TableRow >

                <TableCell >
                 
                  <TabList onChange={handleChange} aria-label="lab API tabs example">
                    <Tab label="Profil Ayarları" value="1" style={{fontWeight: 'bold',backgroundColor: colors.primary[450],color: '#3c9f87',fontSize: '13px',position: 'relative',overflow: 'hidden',}} />
                    <Tab label="Firma Ayarları" value="2" style={{fontWeight: 'bold',backgroundColor: colors.primary[450],color: '#3c9f87',fontSize: '13px',position: 'relative',overflow: 'hidden',}} />
<Tab
  label="Kullanıcı Ayarları"
  value="3"
  style={{
    fontWeight: 'bold',
    backgroundColor: colors.primary[450],
    color: '#3c9f87',
    fontSize: '13px',
    position: 'relative',
    overflow: 'hidden',
    display: document.master ? 'block' : 'none', // Gösterme koşulu
  }}
/>                  </TabList>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody >
              <TableRow>
                <TableCell >
                  <TabPanel value="1"><ProfilEdit /></TabPanel>
                  <TabPanel value="2"><FirmaEdit /></TabPanel>
                  {/* <TabPanel value="3"><UserTable  data={documents} columns={columns}/></TabPanel> */}
               
                </TableCell>

              </TableRow>

            </TableBody>
            </TabContext>

          </Table>
        </TableContainer>
      </div>

    </div>);
}

export default Ayar;
