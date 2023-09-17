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
import UserTable  from './table';


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
  if (dokuman.firmakod === user.displayName && dokuman.id !== user.uid ) {
    // Eşleşen öğeyi eşleşenDokumanlar dizisine ekle


    eşleşenDokumanlar.push(dokuman);



  }
  console.log("sdsdsd :",dokuman);

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
      accessor: 'photoURL', // Gerçek veriye göre bu kısmı güncelleyin
      avatar:true,
      sm: 0.5, // İlgili sütunun genişliği
      align: 'center',


     },{
      Header: 'Adı Soyadı',
      accessor: 'ad', // Gerçek veriye göre bu kısmı güncelleyin
      sortType: 'alphanumeric', // Sıralama türü belirtin (isteğe bağlı)
     ara:true,
     sm: 2 ,// İlgili sütunun genişliği
     siralama :true

    },
   
    {
      Header: 'Email',
      accessor: 'email', // Gerçek veriye göre bu kısmı güncelleyin
      sortType: 'alphanumeric', // Sıralama türü belirtin (isteğe bağlı)
      ara:true,
      sm: 2 ,// İlgili sütunun genişliği
      siralama :true

    },
    {
      Header: 'Telefon',
      accessor: 'tel', // Gerçek veriye göre bu kısmı güncelleyin
      sortType: 'alphanumeric', // Sıralama türü belirtin (isteğe bağlı)
      ara:true,
      sm: 2 ,// İlgili sütunun genişliği
      siralama :true

    },
    {
      Header: 'Departman',
      accessor: 'departman', // Gerçek veriye göre bu kısmı güncelleyin
      sortType: 'alphanumeric', // Sıralama türü belirtin (isteğe bağlı)
      ara:true,
      sm: 2, // İlgili sütunun genişliği
      siralama :true

    },  {
      Header: 'Açıklama',
      accessor: 'bilgi', // Gerçek veriye göre bu kısmı güncelleyin
      sortType: 'alphanumeric', // Sıralama türü belirtin (isteğe bağlı)
      ara:true,
      sm: 6 ,// İlgili sütunun genişliği
      bilgi:true
    }, {
      Header: 'Yetkiler',
      accessor: 'Yetki', // Gerçek veriye göre bu kısmı güncelleyin
      sm: 0.5, // İlgili sütunun genişliği
      align: 'center',
      ayar:true
     }
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

                    <Tab
  label="Firma Ayarları"
  value="2"
  style={{
    fontWeight: 'bold',
    backgroundColor: colors.primary[450],
    color: '#3c9f87',
    fontSize: '13px',
    position: 'relative',
    overflow: 'hidden',
    display: document.master ? 'block' : 'none', // Gösterme koşulu
  }}
/> 
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
                  <TabPanel value="1"><ProfilEdit gelenid={user.uid} /></TabPanel>
                  <TabPanel value="2"><FirmaEdit /></TabPanel>
                  <TabPanel value="3"><UserTable  data={eşleşenDokumanlar} columns={columns}/></TabPanel>
               
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
