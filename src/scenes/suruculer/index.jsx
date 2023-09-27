import React, { useState } from 'react';
import Tablee from './table';
import { useCollection } from '../../hooks/useallCollection'
import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { useAuthContext } from '../../hooks/useAuthContext'
import moment from "moment";
import 'moment/locale/tr'
const Form = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const { user } = useAuthContext();

  const { isPending, error, documents } = useCollection('user');



  const filteredDocuments = documents
  .filter(doc => doc.firmakod === user.displayName && doc.surucu === true)
  .map(doc => {
    // doc.eyt (Timestamp) değerini moment.js ile belirli bir tarih formatında biçimlendirin
    const formattedEyt = moment(doc.eyt.toDate()).format('DD-MM-YYYY'); // Varsayılan format YYYY-MM-DD'dir, istediğiniz formatı değiştirebilirsiniz.

    // doc nesnesini klonlayın ve 'eyt' alanını biçimlendirilmiş değerle güncelleyin
    return {
      ...doc,
      eyt: formattedEyt,
    };
  });

  



console.log("fff",filteredDocuments)
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

  },{
    Header: 'Telefon',
      accessor: 'tel', // Gerçek veriye göre bu kısmı güncelleyin
      sortType: 'alphanumeric', // Sıralama türü belirtin (isteğe bağlı)
      ara:true,
      sm: 2 ,// İlgili sütunun genişliği
      siralama :true

  },
  {
 
    Header: 'Ehliyet Yenileme Tarihi',
    accessor: 'eyt', // Gerçek veriye göre bu kısmı güncelleyin
    sortType: 'alphanumeric', // Sıralama türü belirtin (isteğe bağlı)
    ara:true,
    eyt:true,
    sm: 2, // İlgili sütunun genişliği
    siralama :true

  },
  {
    Header: 'Belge Türü',
    accessor: 'ebilgi', // Gerçek veriye göre bu kısmı güncelleyin
    sortType: 'alphanumeric', // Sıralama türü belirtin (isteğe bağlı)
    ara:true,
    sm: 2, // İlgili sütunun genişliği
    siralama :true
  },
  {
    Header: 'Departman',
      accessor: 'departman', // Gerçek veriye göre bu kısmı güncelleyin
      sortType: 'alphanumeric', // Sıralama türü belirtin (isteğe bağlı)
      ara:true,
      sm: 2, // İlgili sütunun genişliği
      siralama :true

  },
  {
    Header: 'Açıklama',
    accessor: 'bilgi', // Gerçek veriye göre bu kısmı güncelleyin
    sortType: 'alphanumeric', // Sıralama türü belirtin (isteğe bağlı)
    ara:true,
    sm: 6 ,// İlgili sütunun genişliği
    bilgi:true
  },
  {
    Header: 'Yetkiler',
    accessor: 'Yetki', // Gerçek veriye göre bu kısmı güncelleyin
    sm: 0.5, // İlgili sütunun genişliği
    align: 'center',
    ayar:true
   }
];


  return (
    <div>
      <h1>Form</h1>
      <Box
    style={{
      padding: theme.palette.mode === "dark" ? "0 30px" : "0 30px"
    }}
      >
      <Box
           style={{
            borderTopLeftRadius: '10px',
            borderTopRightRadius: '10px',
            justifyContent: theme.palette.mode === "dark" ? "space-between" : "space-between",
            alignItems: "center",
            backgroundColor:colors.primary[400]          }}

          >
  
      <Tablee data={filteredDocuments} columns={columns} />
      </Box></Box>
    </div>
  );
};

export default Form;
