import React, { useState } from 'react';
import Tablee from './table';
import { useCollection } from '../../hooks/useallCollection'
import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";

const Form = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const { isPending, error, documents } = useCollection('suruculer');
console.log(documents)
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
  
      <Tablee data={documents} columns={columns} />
      </Box></Box>
    </div>
  );
};

export default Form;
