// PersonelPopup.js

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






function ResimEdit({ open, onClose, veri, konum, onChange }) {

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const handleClose = () => {
    // Popup'ı kapatmak için onClose callback'ini çağır
    onClose();
  };

  const defaultSrc = ''; // Default image source
  const [image, setImage] = useState(defaultSrc);
  const [cropData, setCropData] = useState('#');
  const cropperRef = useRef(null);
  const [veriURL, setDataURL] = useState('');




  
  const aspectRatio = 16 / 9; // Örneğin, 16:9 en-boy oranı

  if (veri) {
    veri.preventDefault();
    let files;
    if (veri.dataTransfer) {
      files = veri.dataTransfer.files;
    } else if (veri.target) {
      files = veri.target.files;
    }

    // Dosya türünü kontrol et
    if (files && files[0]) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif']; // İzin verilen dosya türleri
      if (allowedTypes.includes(files[0].type)) {
        const reader = new FileReader();
        reader.onload = () => {
          setImage(reader.result);
        };
        reader.readAsDataURL(files[0]);
      } else {
        alert('Lütfen bir resim dosyası seçin (JPEG, PNG veya GIF)');
      }
    }
  };



  const getCropData = () => {
    if (cropperRef.current && cropperRef.current.cropper) {
      const croppedCanvas = cropperRef.current.cropper.getCroppedCanvas();
      if (croppedCanvas) {
        // Kırpılan resmin URL'sini al
        const dataURL = croppedCanvas.toDataURL();
        setDataURL(dataURL);
        const data = JSON.stringify({ imageData: croppedCanvas.toDataURL() });

        // onChange işlevini çağırarak veriURL ve konum bilgilerini üst düzey bileşene iletebilirsiniz
        onChange(dataURL, konum,croppedCanvas);
      }
    }

    // Popup'ı kapatmak için gerekli kodlar
    handleClose();
  };

  return (

    <Dialog
      open={open}
      onClose={handleClose}
    >

      <DialogTitle>Ehliyet Resmi Yükleme Alanı</DialogTitle>
      <DialogContent>
        <DialogContentText>
        Lütfen Ehliyetin {konum === "on" ? "Ön" : "Arka"} Kısmını Seçerek Kaydet Butonuna Basınız        </DialogContentText>
        <Grid container spacing={2}>
        <Grid item xs={12}  >

        </Grid>
        <Grid item xs={12}  >
          <ReactCropper
            aspectRatio={aspectRatio}
            ref={cropperRef}
            src={image}
            style={{ width: '100%' }}
          // Diğer özelleştirmeleri buraya ekleyebilirsiniz
          />     </Grid>

          </Grid>

      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} style={{ margin: '0 5px', backgroundColor: colors.primary[400], color: colors.primary[100] }} variant="outlined" component="span">
          İptal</Button>

        <Button onClick={getCropData} style={{ margin: '0 5px', backgroundColor: colors.primary[400], color: colors.primary[100] }} variant="outlined" component="span">
          Kaydet
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ResimEdit;
