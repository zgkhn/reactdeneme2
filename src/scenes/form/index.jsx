import React, { useState } from 'react';
import Table from './table';
import { useCollection } from '../../hooks/useallCollection'

const Form = () => {


  const { isPending, error, documents } = useCollection('suruculer');
console.log(documents)
  const columns = [
    {
      Header: 'Başlık 1',
      accessor: 'ad', // Gerçek veriye göre bu kısmı güncelleyin
    },
    {
      Header: 'Başlık 2',
      accessor: 'tel', // Gerçek veriye göre bu kısmı güncelleyin
    },
    {
      Header: 'Başlık 1',
      accessor: 'bilgi', // Gerçek veriye göre bu kısmı güncelleyin
    },
    {
      Header: 'Başlık 2',
      accessor: 'ehliyet', // Gerçek veriye göre bu kısmı güncelleyin
    },{
      Header: 'Başlık 1',
      accessor: 'email', // Gerçek veriye göre bu kısmı güncelleyin
    },
    {
      Header: 'Başlık 2',
      accessor: 'tel412', // Gerçek veriye göre bu kısmı güncelleyin
    },
  ];
  

  return (
    <div>
      <h1>Form</h1>
      <div>
      
       
      </div>
      <h1>Table</h1>
      <Table data={documents} columns={columns} />
    </div>
  );
};

export default Form;
