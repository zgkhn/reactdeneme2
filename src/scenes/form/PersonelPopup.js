import React, { useState } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Alert } from "@mui/material";
import moment from "moment";
import 'moment/locale/tr'
function PopupForm() {

  const [openDialog, setOpenDialog] = useState(false);


  const handleCloseDialog = () => {
    setSelectedRow(null);
    setOpenDialog(false);
  };
  const open = () => {
    setOpenDialog(true);
  };
  const handleSave = async () => {
   
  };

  return (

<Dialog open={openDialog} onClose={handleCloseDialog}>
  <DialogTitle>Kullanıcı Bilgilerini Düzenle</DialogTitle>
  <DialogContent style={{ width: '700px' }}>
    <div style={{ marginBottom: '16px' }} />

    <TextField
      style={{ marginBottom: '20px' }}
      label="Kullanıcı Adı"
      fullWidth
      onChange={(e) => handleUserDataChange('kullaniciAdi', e.target.value)}
    />

    <TextField
      style={{ marginBottom: '20px' }}
      label="Adı Soyadı"
      fullWidth
      onChange={(e) => handleUserDataChange('adSoyad', e.target.value)}
    />

    <TextField
      style={{ marginBottom: '20px' }}
      label="Şifre"
      type="password"
      fullWidth
      onChange={(e) => handleUserDataChange('sifre', e.target.value)}
    />

    <TextField
      style={{ marginBottom: '20px' }}
      label="Telefon"
      fullWidth
      onChange={(e) => handleUserDataChange('telefon', e.target.value)}
    />

    <TextField
      style={{ marginBottom: '20px' }}
      label="Email"
      fullWidth
      onChange={(e) => handleUserDataChange('email', e.target.value)}
    />

    <TextField
      style={{ marginBottom: '20px' }}
      label="Ehliyet Yenileme Tarihi"
      type="date"
      fullWidth
      onChange={(e) => handleUserDataChange('ehliyetYenilemeTarihi', e.target.value)}
    />

    <TextField
      style={{ marginBottom: '20px' }}
      label="Ehliyet Türü"
      fullWidth
      onChange={(e) => handleUserDataChange('ehliyetTuru', e.target.value)}
    />

    <TextField
      style={{ marginBottom: '20px' }}
      label="Açıklama"
      multiline
      fullWidth
      rows={4}
      onChange={(e) => handleUserDataChange('aciklama', e.target.value)}
    />
  </DialogContent>
  <DialogActions>
    <Button onClick={handleSave} variant="contained" color="primary">
      Kaydet
    </Button>
    <Button onClick={handleCloseDialog} variant="outlined" color="secondary">
      İptal
    </Button>
  </DialogActions>
</Dialog>

  );
}

export default PopupForm;
