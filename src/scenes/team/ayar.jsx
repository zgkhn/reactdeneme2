import React, { useState } from 'react';
import { useLogin } from '../../hooks/useLogin';
import { useSignup } from '../../hooks/useSignup';
import { storage } from '../../firebase/config';
import { Button, TextField, Box , Grid , Typography , DialogContentText, DialogTitle, useTheme } from '@mui/material';
import { styled } from '@mui/system';
import logo1 from '../../data/img/logo.png';
import { FormControl, InputLabel, Input, FormHelperText,  } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { tokens } from "../../theme";
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import Guncelleme from './guncelleme';
import { useAuthContext } from '../../hooks/useAuthContext'

import { useDocument,useAllVeri } from '../../hooks/useCollection'

const StyledBox = styled(Box)`

`;

const StyledForm = styled('form')`

`;

const StyledLogo = styled('img')`

`;

const StyledSignUpButton = styled(Button)`

`;
function Ayar({  }) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const {user} =useAuthContext();
  const { document, error } = useDocument("user", user.uid);
  const [selectedFile, setSelectedFile] = useState(null);








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
                {  backgroundColor:colors.primary[400]
                  , borderTopLeftRadius: '10px', borderTopRightRadius: '10px'}}
  

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
        <Table id="table"  border="0" width="90%" cellSpacing="0" cellPadding="0">
          <TableHead  style={ 
{  fontWeight: 'bold',
backgroundColor:colors.primary[450],
color: '#3c9f87',
fontSize: '30px'}    }> 
           
<TableRow >
  
    <TableCell >
    <h2>   Kullanıcı Ayarları</h2>
    </TableCell>
</TableRow>


          </TableHead>
          <TableBody >
 
      <TableRow>
              <TableCell ><Guncelleme/>
              </TableCell>
            
      </TableRow>

</TableBody>

        </Table>
      </TableContainer>
    </div>
 
  </div>  );
}

export default Ayar;
