import React, { useState, useEffect, useRef } from 'react';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, useTheme, Grid } from '@mui/material';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import moment from "moment";
import 'moment/locale/tr'
import { auth, db } from "../../firebase/config"; // Firebase yapılandırması
import { doc, updateDoc } from 'firebase/firestore'
import { useCollection } from '../../hooks/useallCollection'
import { useSignup } from '../../hooks/useSignupNew';
import { tokens } from "../../theme";
import on from '../../data/img/ehliyeton.png';
import arka from '../../data/img/ehliyetarka.png';
import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';
import { useDocument, useAllVeri } from '../../hooks/useCollection'
import { useAuthContext } from '../../hooks/useAuthContext'
import ReactCropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import ReactCompareImage from 'react-compare-image';
import InfoOutlined from '@mui/icons-material/InfoOutlined';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';

function DeleteDosya({ open, onClose, veri ,onChange}) {
  const onay = true; // Default image source

  const handleClickOpen = () => {
    onClose();
  };
  const handleClickOnay = () => {
    onChange(onay,veri);
    onClose();
  };
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const handleClose = () => {
    onClose();
  };

  return (
    <div>
  
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Dosyay Silme İşlemi"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Dosya Adı : {veri.dosyaAdi}  <br />
            Dosya Açıklama: {veri.dosyaAciklama}<br />
            
            <Alert variant="outlined" severity="warning">
        Dosyayı silmek istediğinize emin misiniz? Bu işlem geri alınamaz!
</Alert>
            
            
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button  style={{ margin: '0 5px', backgroundColor: colors.primary[400], color: colors.primary[100] }} onClick={handleClose}>İptal</Button>
          <Button  style={{ margin: '0 5px', backgroundColor: colors.primary[400], color: colors.primary[100] }} onClick={handleClickOnay} autoFocus>
            Sil
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
export default DeleteDosya;
