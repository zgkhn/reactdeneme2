// PersonelPopup.js

import React, { useState } from 'react';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, useTheme } from '@mui/material';

import moment from "moment";
import 'moment/locale/tr'
import { auth, db } from "../../firebase/config"; // Firebase yapılandırması
import { doc, updateDoc } from 'firebase/firestore'
import { useCollection } from '../../hooks/useallCollection'
import { useSignup } from '../../hooks/useSignupNew';

import { tokens } from "../../theme";

function PersonelPopup({ open, onClose }) {
  const {errorr,isPendingg,signup,setDegerSingup} = useSignup();

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { isPending, error, documents } = useCollection('user');




  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [licenseRenewalDate, setLicenseRenewalDate] = useState('');
  const currentDate = new Date();

  const [licenseType, setLicenseType] = useState('');
  const [phone, setPhone] = useState('');
  const [profilePhoto, setProfilePhoto] = useState(null); // Profil fotoğrafını dosya olarak saklamak için
  const [description, setDescription] = useState('');
  const [adError, setAdError] = useState(false);
  const [telError, setTelError] = useState(false);
  const [ehliyetError, setEhliyetError] = useState(false);
  const [tarihError, setTarihError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [newUserData, setNewUserData] = useState();

  const handleClose = () => {
    // Popup'ı kapatmak için onClose callback'ini çağır
    onClose();
  };

  const handleUserDataChange = (field, value) => {

    setNewUserData((prevData) => ({
      ...prevData,
      [field]: value,
    }));


    if (field === 'ad') {
      // Ad alanının doğrulamasını yapın
      const isValidAd = /^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]{1,30}$/.test(value);

      setAdError(!isValidAd);
    } else if (field === 'tel') {
      // Telefon numarasının doğrulamasını yapın (örnek olarak 10 haneli bir numara kabul ediliyor)
      const isValidTel = /^\d{10}$/.test(value);
      setTelError(!isValidTel);

    } else if (field === 'email') {
      // E-posta adresi doğrulamasını yapın
      const isValidEmail = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(value);

      if (!isValidEmail) {
        setEmailError(true);
      } else {
        // E-posta adresi doğru ise, suruculer tablosundaki verileri kontrol et
        const isEmailInSuruculer = documents.some((id) => id === value);

        if (isEmailInSuruculer) {
          // E-posta adresi suruculer tablosunda bulunuyor
          setEmailError(true);
        } else {
          // E-posta adresi suruculer tablosunda bulunmuyor
          setEmailError(false);
        }
      }

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

  };

  const oneDayAgo = new Date(currentDate);
  oneDayAgo.setDate(currentDate.getDate() - 1);
  const handleSave = () => {



    // if (!emailError && !passwordError && !pdError && !kodError && !telError && !adError && selectedFile) {
    //   // Hata yoksa (tüm error değerleri false ise) ve selectedFile boş değilse, bu kodu çalıştır
      signup(newUserData.email, newUserData.password, newUserData, profilePhoto);
    // }




    // if (profilePhoto) {
    //   const storageRef = firebase.storage().ref();
    //   const photoRef = storageRef.child(`profile_photos/${email}`);
    //   photoRef.put(profilePhoto).then((snapshot) => {
    //     // Profil fotoğrafı yüklendikten sonra snapshot.downloadURL veya storageRef.getDownloadURL kullanarak URL alabilirsiniz.
    //     // Bu URL'i veritabanında saklayabilirsiniz.
    //   });
    // }


    handleClose(); {

    }


  };
  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Yeni Sürücü Ekle</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Yeni bir Sürücü eklemek için aşağıdaki bilgileri doldurun.
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          label="E-posta"
          type="email"
          fullWidth
          onChange={(e) => handleUserDataChange('email', e.target.value)}

          error={emailError}
          helperText={emailError ? 'Geçersiz e-posta adresi.' : ''}
        />
        <TextField
          margin="dense"
          label="Adı Soyadı"
          fullWidth
          onChange={(e) => handleUserDataChange('ad', e.target.value)}
          error={adError}
          helperText={adError ? 'Geçersiz ad' : ''}
        />
        <TextField
          margin="dense"
          label="Şifre"
          type="password"
          fullWidth
          onChange={(e) => handleUserDataChange('password', e.target.value)}
        />
        <TextField
          margin="dense"
          label="Şifre Doğrulama"
          type="password"
          fullWidth
          onChange={(e) => setPasswordConfirm(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Ehliyet Yenileme Tarihi"
          type="date"
          fullWidth
          defaultValue={moment(oneDayAgo).format("YYYY-MM-DD")}

          onChange={(e) => handleUserDataChange('tarih', e.target.value)}
          error={tarihError}
          helperText={tarihError ? 'Geçersiz tarih' : ''}
        />
        <TextField
          margin="dense"
          label="Ehliyet Türü"
          fullWidth
          onChange={(e) => handleUserDataChange('ehliyet', e.target.value)}
          error={ehliyetError}
          helperText={ehliyetError ? 'Ehliyet türü boş olamaz' : ''}
        />
        <TextField
          margin="dense"
          label="Telefon"
          fullWidth
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
          onChange={(e) => handleUserDataChange('bilgi', e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button style={{ margin: '0 5px', backgroundColor: colors.primary[450] }} onClick={handleClose}>İptal</Button>
        <Button style={{ margin: '0 5px', backgroundColor: colors.primary[450] }} onClick={handleSave} color="primary">
          Kaydet
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default PersonelPopup;
