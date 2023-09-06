import React, { useState } from 'react';
import Tablee from './table';
import { useCollection } from '../../hooks/useallCollection'
import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";

const Form = () => {
  const theme = useTheme();


  const { isPending, error, documents } = useCollection('suruculer');
console.log(documents)
  const columns = [
    {
      Header: 'Adı Soyadı',
      accessor: 'ad', // Gerçek veriye göre bu kısmı güncelleyin
      sortType: 'alphanumeric', // Sıralama türü belirtin (isteğe bağlı)

    },
    {
      Header: 'Kullanıcı Adı',
      accessor: 'tel', // Gerçek veriye göre bu kısmı güncelleyin
      sortType: 'alphanumeric', // Sıralama türü belirtin (isteğe bağlı)

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
            backgroundColor: theme.palette.mode === "dark" ? "#1f2a40" : "#F2F0F0"
          }}

          >
  
      <Tablee data={documents} columns={columns} />
      </Box></Box>
    </div>
  );
};

export default Form;
