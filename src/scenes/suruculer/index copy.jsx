import React, { useState } from 'react';
import Tablee from './table';
import { useCollection } from '../../hooks/useallCollection'
import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { useAuthContext } from '../../hooks/useAuthContext'

const Form = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { user } = useAuthContext();

  const { isPending, error, documents } = useCollection('user');



const filteredDocuments = documents.filter(doc => {
  return doc.firmakod === user.displayName && doc.surucu === true;
});



console.log(":::::::::::",filteredDocuments) 
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
      Header: 'Email',
      accessor: 'email', // Gerçek veriye göre bu kısmı güncelleyin
      siralama:false ,
      ara:true

    },{
      Header: 'Telefon',
      accessor: 'tel', // Gerçek veriye göre bu kısmı güncelleyin
      sortType: 'alphanumeric', // Sıralama türü belirtin (isteğe bağlı)

    },
    {
      Header: 'Ehliyet Yenileme Tarihi',
      accessor: 'eyt', // Gerçek veriye göre bu kısmı güncelleyin
      sortType: 'alphanumeric', // Sıralama türü belirtin (isteğe bağlı)

    },
    {
      Header: 'Belge Türü',
      accessor: 'ebilgi', // Gerçek veriye göre bu kısmı güncelleyin
      sortType: 'alphanumeric', // Sıralama türü belirtin (isteğe bağlı)

    },
    {
      Header: 'Departman',
      accessor: 'departman', // Gerçek veriye göre bu kısmı güncelleyin
      sortType: 'alphanumeric', // Sıralama türü belirtin (isteğe bağlı)

    },
  ];

  // if (filteredDocuments === null) {
  //   return <p>Veri yükleniyor...</p>;
  // }
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
