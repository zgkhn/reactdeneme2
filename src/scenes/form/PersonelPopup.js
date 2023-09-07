// PersonelPopup.js

import React, { useState } from 'react';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

function PersonelPopup({ open, onClose }) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [licenseRenewalDate, setLicenseRenewalDate] = useState('');
  const [licenseType, setLicenseType] = useState('');
  const [phone, setPhone] = useState('');
  const [profilePhoto, setProfilePhoto] = useState(null); // Profil fotoğrafını dosya olarak saklamak için
  const [description, setDescription] = useState('');
  const [adError, setAdError] = useState(false);
  const [telError, setTelError] = useState(false);
  const [ehliyetError, setEhliyetError] = useState(false);
  const [tarihError, setTarihError] = useState(false);

  const handleClose = () => {
    // Popup'ı kapatmak için onClose callback'ini çağır
    onClose();
  };

  const handleUserDataChange = (field, value) => {
    if (field === 'ad') {
      // Ad alanının doğrulamasını yapın
      const isValidAd = /^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]*$/.test(value);
      setAdError(!isValidAd);
    } else if (field === 'tel') {
      // Telefon numarasının doğrulamasını yapın (örnek olarak 10 haneli bir numara kabul ediliyor)
      const isValidTel = /^\d{10}$/.test(value);
      setTelError(!isValidTel);
    } else if (field === 'ehliyet') {
      // Ehliyet türünün boş olup olmadığını kontrol edin
      const isValidEhliyet = value.trim() !== '';
      setEhliyetError(!isValidEhliyet);
    } else if (field === 'tarih') {
      // Tarihin bugünden önceki bir tarih olup olmadığını kontrol edin
      const selectedDate = new Date(value);
      const today = new Date();
      const isValidTarih = selectedDate >= today;
      setTarihError(!isValidTarih);
    }

    // Değerleri güncelle
    switch (field) {
      case 'ad':
        setName(value);
        break;
      case 'tel':
        setPhone(value);
        break;
      case 'ehliyet':
        setLicenseType(value);
        break;
      case 'tarih':
        setLicenseRenewalDate(value);
        break;
      default:
        break;
    }
  };

  const handleSave = () => {
    // Kullanıcı kaydı işlemlerini burada gerçekleştirin
    // Firebase veya başka bir veritabanı hizmetini kullanabilirsiniz
    // Geçerli alan değerlerini kullanarak kaydı yapın
    // Ayrıca veri doğrulaması yapmayı unutmayın

    // Örnek olarak profil fotoğrafını Firebase Storage'a yüklemek:
    if (profilePhoto) {
      const storageRef = firebase.storage().ref();
      const photoRef = storageRef.child(`profile_photos/${email}`);
      photoRef.put(profilePhoto).then((snapshot) => {
        // Profil fotoğrafı yüklendikten sonra snapshot.downloadURL veya storageRef.getDownloadURL kullanarak URL alabilirsiniz.
        // Bu URL'i veritabanında saklayabilirsiniz.
      });
    }

    // Kullanıcı kaydı başarıyla tamamlandıktan sonra popup'ı kapatın
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Yeni Kullanıcı Ekle</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Yeni bir kullanıcı eklemek için aşağıdaki bilgileri doldurun.
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          label="E-posta"
          type="email"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Adı Soyadı"
          fullWidth
          value={name}
          onChange={(e) => handleUserDataChange('ad', e.target.value)}
          error={adError}
          helperText={adError ? 'Geçersiz ad' : ''}
        />
        <TextField
          margin="dense"
          label="Şifre"
          type="password"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Şifre Doğrulama"
          type="password"
          fullWidth
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Ehliyet Yenileme Tarihi"
          type="date"
          fullWidth
          value={licenseRenewalDate}
          onChange={(e) => handleUserDataChange('tarih', e.target.value)}
          error={tarihError}
          helperText={tarihError ? 'Geçersiz tarih' : ''}
        />
        <TextField
          margin="dense"
          label="Ehliyet Türü"
          fullWidth
          value={licenseType}
          onChange={(e) => handleUserDataChange('ehliyet', e.target.value)}
          error={ehliyetError}
          helperText={ehliyetError ? 'Ehliyet türü boş olamaz' : ''}
        />
        <TextField
          margin="dense"
          label="Telefon"
          fullWidth
          value={phone}
          onChange={(e) => handleUserDataChange('tel', e.target.value)}
          error={telError}
          helperText={telError ? 'Geçersiz telefon numarası' : ''}
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setProfilePhoto(e.target.files[0])}
        />
        <TextField
          margin="dense"
          label="Açıklama"
          fullWidth
          multiline
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>İptal</Button>
        <Button onClick={handleSave} color="primary">
          Kaydet
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default PersonelPopup;
