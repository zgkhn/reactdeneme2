// PersonelPopup.js

import React, { useState ,useEffect } from 'react';
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
import ReactCompareImage from 'react-compare-image';
import on from '../../data/img/ehliyeton.png';
import arka from '../../data/img/ehliyetarka.png';
import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';
import { useDocument, useAllVeri } from '../../hooks/useCollection'
import { useAuthContext } from '../../hooks/useAuthContext'

function PersonelPopup({ open, onClose }) {
  const { errorr, isPendingg, signup, setDegerSingup } = useSignup();
  const fullWidth = false;
  const { user } = useAuthContext();


  const [maxWidth, setMaxWidth] = React.useState('xl');
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { isPending, error, documents } = useCollection('user');

  const dialogElement = document.querySelector('.dialogElement');

  if (dialogElement) {
    dialogElement.style.width = '100%'; /* Sayfayı yatayda %80 doldurmak için */
    dialogElement.style.maxWidth = 'none'; /* "maxWidth" sınırlamasını kaldır */
    dialogElement.style.margin = '0 auto'; /* Dikey hizalamayı merkeze al */
    dialogElement.style.padding = '0 10%'; /* Sağdan ve soldan %10'lık boşluk bırakmak için */
  }



  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [licenseRenewalDate, setLicenseRenewalDate] = useState('');
  const currentDate = new Date();
  const [selectedItemId, setSelectedItemId] = useState('');
  const [selectedItem, setSelectedItem] = useState('');

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
    setSelectedItemId("")
  };
  console.log("deneme", selectedItemId)
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
  const pageWidth = window.innerWidth * 0.8;

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


  // Filtreleme işlemi
  const filteredDocuments = documents.filter((documents) => {
    return documents.firmakod === "armsan" && documents.surucu !== true;
  });

  const filteredListItems = filteredDocuments.map((documents) => (
    <ListItem
      button
      alignItems="flex-start"
      key={documents.ad}
      onClick={() => handleItemClick(documents.id)}
      style={{
        backgroundColor: selectedItemId === documents.id ? colors.primary[450] : colors.primary[400], // Arka plan rengini kontrol et
      }}
    >
      <ListItemAvatar>
        <Avatar alt={documents.ad} src={documents.photoURL} />
      </ListItemAvatar>
      <ListItemText
        primary={documents.ad}
        secondary={
          <React.Fragment>
            <Typography
              sx={{ display: 'inline' }}
              component="span"
              variant="body2"
              color="text.primary"
            >
              {documents.email}
            </Typography>
            {"Departman : "}{documents.departman}
          </React.Fragment>
        }
      />
    </ListItem>
  ));





  // Tıklanan öğenin ID'sini güncelleyen işlev
  const handleItemClick = (itemId) => {

    setSelectedItemId(itemId);

    const selectedItem = filteredDocuments.find((item) => item.id === itemId);

    setSelectedItem(selectedItem)

  };


 const [emailDefaultValue, setEmailDefaultValue] = useState('');
 console.log("log : ",selectedItem )
 console.log("log1 : ",emailDefaultValue )

 useEffect(() => {

  setEmailDefaultValue(selectedItem || ''); // Use selectedItem.email if it exists, otherwise use an empty string


}, [selectedItemId]);

  return (


    <Dialog
      fullWidth={fullWidth}
      maxWidth={maxWidth}
      open={open}
      onClose={handleClose}
    >
      <DialogTitle>Yeni Sürücü Ekle</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Yeni bir Sürücü eklemek için aşağıdaki bilgileri doldurun.
        </DialogContentText>
        <Grid container spacing={2}>
          <Grid item >
            <div style={{
              width: '100%',
              height: '100%',
              bgcolor: colors.primary[400],
              position: 'relative',
              overflow: 'auto',
              maxHeight: '70vh'
            }}>

              <List sx={{ width: '100%', height: '100%', bgcolor: colors.primary[400], }}>


                {filteredListItems}



              </List>
            </div>

          </Grid>
          {selectedItemId ? (
            <>
            
              <Grid item xs={5} >
                <Grid container spacing={2}>

                  <Grid item xs={12} md={6} >
                    <TextField
                      autoFocus
                      margin="dense"
                      label="E-posta"
                      type="email"
                      fullWidth
                      defaultValue={emailDefaultValue.email}
                      onChange={(e) => handleUserDataChange('email', e.target.value)}
                      error={emailError}
                      helperText={emailError ? 'Geçersiz e-posta adresi.' : ''}
                    />
                  </Grid>

                  <Grid item xs={12} md={6} >
                    <TextField
                      margin="dense"
                      label="Adı Soyadı"
                      fullWidth
                      onChange={(e) => handleUserDataChange('ad', e.target.value)}
                      error={adError}
                      helperText={adError ? 'Geçersiz ad' : ''}
                    />
                  </Grid>

                  <Grid item xs={12} md={6} >
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
                  </Grid>
                  <Grid item xs={12} md={6} >
                    <TextField
                      margin="dense"
                      label="Ehliyet Türü"
                      fullWidth
                      onChange={(e) => handleUserDataChange('ehliyet', e.target.value)}
                      error={ehliyetError}
                      helperText={ehliyetError ? 'Ehliyet türü boş olamaz' : ''}
                    />
                  </Grid>


                  <Grid item xs={12} md={6} >
                    <TextField
                      margin="dense"
                      label="Telefon"
                      fullWidth
                      onChange={(e) => handleUserDataChange('tel', e.target.value)}
                      error={telError}
                      helperText={telError ? 'Geçersiz telefon numarası' : ''}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}  >
                    <TextField
                      margin="dense"
                      label="Departman"
                      fullWidth
                      onChange={(e) => handleUserDataChange('ad', e.target.value)}
                      error={adError}
                      helperText={adError ? 'Geçersiz ad' : ''}
                    />
                  </Grid>


                  <Grid item xs={12} md={12} >
                    <TextField
                      margin="dense"
                      label="Açıklama"
                      fullWidth
                      multiline
                      rows={2}
                      onChange={(e) => handleUserDataChange('bilgi', e.target.value)}
                    />
                  </Grid>


                  <Grid item xs={12} md={12} >
                    <TextField
                      margin="dense"
                      label="Açıklama"
                      fullWidth
                      multiline
                      rows={2}
                      onChange={(e) => handleUserDataChange('bilgi', e.target.value)}
                    />
                  </Grid>

                </Grid>
              </Grid>
              <Grid item xs={4} >
                <Grid container spacing={0}>







                  <Grid item xs={12} md={12} >

                    <Grid container spacing={5}>
                      <Grid item xs={12} md={12} >

                        <ReactCompareImage leftImage={on} rightImage={arka} hover
                        />


                      </Grid>


                    </Grid>


                  </Grid>

                  <Grid container spacing={4}>
                    <Grid item xs={12} md={12}>

                    </Grid>
                    <Grid item xs={12} md={6}>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setProfilePhoto(e.target.files[0])}
                        style={{ display: 'none' }}
                        id="profile-photo-input-1"
                      />
                      <label htmlFor="profile-photo-input-1">
                        <Button style={{ margin: '0 5px', backgroundColor: colors.primary[400], color: colors.primary[100] }} variant="outlined" component="span">
                          Ehliyet Ön Yüzü
                        </Button>
                      </label>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setProfilePhoto(e.target.files[1])}
                        style={{ display: 'none' }}
                        id="profile-photo-input-2"
                      />
                      <label htmlFor="profile-photo-input-2">
                        <Button style={{ margin: '0 5px', backgroundColor: colors.primary[400], color: colors.primary[100] }} variant="outlined" component="span">
                          Ehliyet Arka Yüzü
                        </Button>
                      </label>
                    </Grid>
                  </Grid>







                </Grid>
              </Grid>
            </>) : (


            ""

          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button style={{ margin: '0 5px', backgroundColor: colors.primary[400], color: colors.primary[100] }} variant="outlined" component="span">
          İptal</Button>

        <Button style={{ margin: '0 5px', backgroundColor: colors.primary[400], color: colors.primary[100] }} variant="outlined" component="span">
          Kaydet
        </Button>
      </DialogActions>
    </Dialog>

  );
}

export default PersonelPopup;
