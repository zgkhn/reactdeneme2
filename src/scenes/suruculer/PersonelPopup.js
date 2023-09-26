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
import { auth, db, firebaseTimestamp, storage, } from "../../firebase/config"; // Firebase yapılandırması
import { getStorage, getDownloadURL, ref } from 'firebase/storage';
import { useCollection } from '../../hooks/useallCollection'
import { useSignup } from '../../hooks/useSignupNew';
import { tokens } from "../../theme";
import ReactCompareImage from 'react-compare-image';
import on from '../../data/img/ehliyeton.jpg';
import arka from '../../data/img/ehliyetarka.jpg';
import { useAddSurucu } from "../../hooks/useAddSurucu";
import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';
import { useDocument, useAllVeri } from '../../hooks/useCollection'
import { useAuthContext } from '../../hooks/useAuthContext'
import ResimEdit from './ResimEdit';
import { alpha, styled } from '@mui/material/styles';
import ReactCropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';


//https://github.com/junkboy0315/react-compare-image/blob/master/README.md
function PersonelPopup({ open, onClose }) {

  const { profilError, addSurucu, } = useAddSurucu();

  const { errorr, isPendingg, signup, setDegerSingup } = useSignup();
  const fullWidth = false;
  const { user } = useAuthContext();
  const CssTextField = styled(TextField)({
    '& label.Mui-focused': {
      color: '#A0AAB4',
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: '#B2BAC2',
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: '#E0E3E7',
      },
      '&:hover fieldset': {
        borderColor: '#B2BAC2',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#6F7E8C',
      },
    },
  });

  const [maxWidth, setMaxWidth] = React.useState('xl');
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { isPending, error, documents } = useCollection('user');
  const [resimEditOpen, setResimEditOpen] = useState(false);
  const [formattedDate, setFormattedDate] = useState('');
  const [departmanError, setDepartmanError] = useState('');
  const currentDate = new Date();
  const [selectedItemId, setSelectedItemId] = useState('');
  const [selectedItem, setSelectedItem] = useState('');
  const [onChangeVeri, setOnChangeVeri] = useState('');
  const [resimEditKonum, setResimEditKonum] = useState('');
  const [profilePhotoOn, setProfilePhotoOn] = useState(""); // Profil fotoğrafını dosya olarak saklamak için
  const [profilePhotoArka, setProfilePhotoArka] = useState(""); // Profil fotoğrafını dosya olarak saklamak için
  const [profilePhotoOnUrl, setProfilePhotoOnUrl] = useState(null);
  const [profilePhotoArkaUrl, setProfilePhotoArkaUrl] = useState(null);
  const [adError, setAdError] = useState(false);
  const [telError, setTelError] = useState(false);
  const [ehliyetError, setEhliyetError] = useState(false);
  const [tarihError, setTarihError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [newUserData, setNewUserData] = useState();

  const IOSSwitch = styled((props) => (
    <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
  ))(({ theme }) => ({
    width: 42,
    height: 26,
    padding: 0,
    '& .MuiSwitch-switchBase': {
      padding: 0,
      margin: 2,
      transitionDuration: '300ms',
      '&.Mui-checked': {
        transform: 'translateX(16px)',
        color: '#fff',
        '& + .MuiSwitch-track': {
          backgroundColor: theme.palette.mode === 'dark' ? '#2ECA45' : '#65C466',
          opacity: 1,
          border: 0,
        },
        '&.Mui-disabled + .MuiSwitch-track': {
          opacity: 0.5,
        },
      },
      '&.Mui-focusVisible .MuiSwitch-thumb': {
        color: '#33cf4d',
        border: '6px solid #fff',
      },
      '&.Mui-disabled .MuiSwitch-thumb': {
        color:
          theme.palette.mode === 'light'
            ? theme.palette.grey[100]
            : theme.palette.grey[600],
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: theme.palette.mode === 'light' ? 0.7 : 0.3,
      },
    },
    '& .MuiSwitch-thumb': {
      boxSizing: 'border-box',
      width: 22,
      height: 22,
    },
    '& .MuiSwitch-track': {
      borderRadius: 26 / 2,
      backgroundColor: theme.palette.mode === 'light' ? '#E9E9EA' : '#202124',
      opacity: 1,
      transition: theme.transitions.create(['background-color'], {
        duration: 500,
      }),
    },
  }));

  const handleSubmit = () => {
    if (!telError && !adError && !tarihError && !ehliyetError && !departmanError && selectedItem.ad && selectedItem.tel && selectedItem.eyt && selectedItem.ebilgi && selectedItem.departman) {
      addSurucu(selectedItem, profilePhotoOn, profilePhotoArka);
    } else {
      if (!selectedItem.ad) {
        setAdError(true)
      }
      if (!selectedItem.tel) {
        setTelError(true)
      }
      if (!selectedItem.eyt) {
        setTarihError(true)
      }
      if (!selectedItem.ebilgi) {
        setEhliyetError(true)
      }
      if (!selectedItem.departman) {
        setDepartmanError(true)
      }
    }
  };
  const handleImageUploadArka = (e) => {
    setResimEditKonum("arka")
    setOnChangeVeri(e)
    setResimEditOpen(true)
  };
  const handleResimEditKaydet = (veriURL, konum, data, yenile) => {
    setOnChangeVeri("")
    if (konum == "on") {
      setProfilePhotoOnUrl(veriURL);
      setProfilePhotoOn(data);
    }
    if (konum == "arka") {
      setProfilePhotoArkaUrl(veriURL);
      setProfilePhotoArka(data);
    }
    if (yenile == true) {
      setOnChangeVeri("")
    }
  };

  const handleImageUpload = (e) => {
    setResimEditKonum("on")
    setOnChangeVeri(e)
    setResimEditOpen(true)
  };
  const handleClose = () => {
    // Popup'ı kapatmak için onClose callback'ini çağır
    onClose();
    setSelectedItemId("")
    setSelectedItem("")
    setProfilePhotoArka("");
    setProfilePhotoOn("");
    setOnChangeVeri("");
  };
  const handleUserDataChange = (field, value) => {
    if (field === 'eyt') {
      // Eğer değiştirilen alan 'eyt' ise, değeri Firestore Timestamp nesnesine dönüştür
      const eytTimestamp = firebaseTimestamp.fromDate(new Date(value)); // value bir tarih dizesi olmalı
      setSelectedItem((prevData) => ({
        ...prevData,
        [field]: eytTimestamp,
      }));
    } else {
      // Diğer alanlar için doğrudan değeri kaydet
      setSelectedItem((prevData) => ({
        ...prevData,
        [field]: value,
      }));
    }
    if (field === 'ad') {
      // Ad alanının doğrulamasını yapın
      const isValidAd = /^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]{1,30}$/.test(value);
      setAdError(!isValidAd);
    } else if (field === 'tel') {
      // Telefon numarasının doğrulamasını yapın (örnek olarak 10 haneli bir numara kabul ediliyor)
      const isValidTel = /^\d{10}$/.test(value);
      setTelError(!isValidTel);
    } else if (field === 'ebilgi') {
      // Ehliyet türünün boş olup olmadığını kontrol edin
      const isValidEhliyet = value.trim() !== '';
      setEhliyetError(!isValidEhliyet);
    } else if (field === 'departman') {
      // Ehliyet türünün boş olup olmadığını kontrol edin
      const isValidDepartman = value.trim() !== '';
      setDepartmanError(!isValidDepartman);
    } else if (field === 'eyt') {
      // Tarihin bugünden önceki bir tarih olup olmadığını kontrol edin
      const selectedDate = new Date(value);
      const today = new Date();
      const isValidTarih = selectedDate >= today;
      setTarihError(!isValidTarih);
    }
  };
  const pageWidth = window.innerWidth * 0.8;
  const oneDayAgo = new Date(currentDate);
  oneDayAgo.setDate(currentDate.getDate() - 1);

  useEffect(() => {
    if (selectedItem.eyt instanceof firebaseTimestamp) {
      // Firebase Timestamp'i milisaniye cinsinden zaman damgasına dönüştür
      const timestampMillis = selectedItem.eyt.toMillis();
      // Zaman damgasını kullanarak JavaScript tarih nesnesi oluştur
      const jsDate = new Date(timestampMillis);
      // JavaScript tari nesnesini istediğiniz formatta formatla
      const formattedDate = moment(jsDate).format('YYYY-MM-DD');

      // Formatlanmış tarihi state'e kaydet
      setFormattedDate(formattedDate);
    } else {

      setFormattedDate("");
    }

  }, [selectedItem]);


  // Filtreleme işlemi
  const filteredDocuments = documents.filter((documents) => {
    return documents.firmakod === user.displayName ;
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
            {/* {"Departman : "}{documents.firmakod} */}
          </React.Fragment>
        }
      />
    </ListItem>
  ));





  // Tıklanan öğenin ID'sini güncelleyen işlev
  const handleItemClick = (itemId) => {

    setSelectedItemId(itemId);
    setSelectedItem("")

    const selectedItem = filteredDocuments.find((item) => item.id === itemId);

    setSelectedItem(selectedItem)

  };


  const [emailDefaultValue, setEmailDefaultValue] = useState('');




  useEffect(() => {

    setEmailDefaultValue(selectedItem.email || ''); // Use selectedItem.email if it exists, otherwise use an empty string
    setProfilePhotoOnUrl(null)
    setProfilePhotoArkaUrl(null)
    setProfilePhotoArka("");
    setProfilePhotoOn("");
    setOnChangeVeri("")





  }, [selectedItemId]);








  const RedditTextField = styled((props) => (
    <TextField {...props} />
  ))(({ theme }) => ({
    '& .MuiFilledInput-root': {
      overflow: 'hidden',
      borderRadius: 4,
      backgroundColor: '#F3F6F9',
      border: '1px solid',
      borderColor: '#2D3843',
      transition: theme.transitions.create([
        'border-color',
        'background-color',
        'box-shadow',
      ]),
      '&:hover': {
        backgroundColor: 'transparent',
      },
      '&.Mui-focused': {
        backgroundColor: 'transparent',
        boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 2px`,
        borderColor: theme.palette.primary.main,
      },
    },
  }));

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
          <ResimEdit open={resimEditOpen} onClose={() => setResimEditOpen(false)} veri={onChangeVeri} konum={resimEditKonum} onChange={handleResimEditKaydet} />
          Yeni bir Sürücü eklemek için aşağıdaki bilgileri doldurun.
        </DialogContentText>
        <Grid container spacing={2}>
          <Grid item xs={selectedItemId ? (3) : (12)}>
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
                <Grid container spacing={1}>

                  <Grid item xs={12} md={6} container alignItems="center" justifyContent="center" align-content="center">
                    <Grid item xs={12} md={3} container alignItems="center" justifyContent="center" align-content="center">

                    </Grid>
                    <Grid item xs={12} md={2} container alignItems="center" justifyContent="center" align-content="center">
                      <FormControlLabel
                       control={<IOSSwitch checked={selectedItem.surucu || false} onChange={(e) => handleUserDataChange('surucu', e.target.checked)} />}

                      />
                    </Grid>
                    <Grid item xs={12} md={6} container alignItems="center" justifyContent="center" align-content="center">
                      Sürücü Olarak Onayla.

                    </Grid>
                    <Grid item xs={12} md={1} container alignItems="center" justifyContent="center" align-content="center">

                    </Grid>
                  </Grid>
                  {/* <Grid item xs={12} md={4} >
                    <RedditTextField


                      autoFocus
                      margin="dense"
                      label="E-posta"
                      type="email"
                      fullWidth
                      value={selectedItem.email}
                      disabled
                    />
                  </Grid> */}

                  <Grid item xs={12} md={6} >
                    <TextField
                      margin="dense"
                      label="Adı Soyadı"
                      fullWidth
                      value={selectedItem.ad ? (selectedItem.ad) : ("")}

                      onChange={(e) => handleUserDataChange('ad', e.target.value)}
                      error={adError}
                      helperText={adError ? 'Geçersiz İsim Girdiniz' : ''}
                    />
                  </Grid>

                  <Grid item xs={12} md={6} >
                    <TextField
                      margin="dense"
                      label="Ehliyet Yenileme Tarihi"
                      type="date"
                      fullWidth
                      size="small"
                      value={formattedDate ? (formattedDate) : ("00/00/0000")}
                      onChange={(e) => handleUserDataChange('eyt', e.target.value)}
                      error={tarihError}
                      helperText={tarihError ? 'Geçersiz tarih' : ''}
                    />

                  </Grid>
                  <Grid item xs={12} md={6} >
                    <TextField
                      margin="dense"
                      label="Ehliyet Türü"
                      size="small"
                      fullWidth
                      value={selectedItem.ebilgi ? (selectedItem.ebilgi) : ("")}
                      onChange={(e) => handleUserDataChange('ebilgi', e.target.value)}
                      error={ehliyetError}
                      helperText={ehliyetError ? 'Ehliyet türü boş olamaz' : ''}
                    />
                  </Grid>


                  <Grid item xs={12} md={6} >
                    <TextField
                      margin="dense"
                      label="Telefon"
                      fullWidth
                      size="small"
                      value={selectedItem.tel ? (selectedItem.tel) : ("")}
                      onChange={(e) => handleUserDataChange('tel', e.target.value)}
                      error={telError}
                      helperText={telError ? 'Geçersiz telefon numarası' : ''}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}  >
                    <TextField
                      margin="dense"
                      label="Departman"
                      size="small"
                      fullWidth
                      value={selectedItem.departman ? (selectedItem.departman) : ("")}
                      onChange={(e) => handleUserDataChange('departman', e.target.value)}
                      error={departmanError}
                      helperText={departmanError ? 'Lütfen bu alanı boş bırakmayınız.' : ''}
                    />
                  </Grid>


                  <Grid item xs={12} md={12} >
                    <TextField
                      margin="dense"
                      size="small"
                      label="Adres"
                      fullWidth
                      value={selectedItem.adres ? (selectedItem.adres) : ("")}
                      multiline
                      rows={1}
                      onChange={(e) => handleUserDataChange('adres', e.target.value)}
                    />
                  </Grid>


                  <Grid item xs={12} md={12} >
                    <TextField
                      margin="dense"
                      label="Açıklama"
                      size="small"
                      fullWidth
                      multiline
                      value={selectedItem.bilgi ? (selectedItem.bilgi) : ("")}
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

                        <ReactCompareImage
                          leftImage={profilePhotoOnUrl ? (
                            profilePhotoOnUrl) : selectedItem.ehliyetOnFoto ? (
                              selectedItem.ehliyetOnFoto
                            ) : (
                            on)}
                          rightImage={profilePhotoArkaUrl ? (
                            profilePhotoArkaUrl) : selectedItem.ehliyetArkaFoto ? (
                              selectedItem.ehliyetArkaFoto
                            ) : (
                            arka)}
                          sliderLineColor={colors.primary[400]}
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
                        onChange={handleImageUpload}
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
                        onChange={handleImageUploadArka}

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
        <Button onClick={handleClose} style={{ margin: '0 5px', backgroundColor: colors.primary[400], color: colors.primary[100] }} variant="outlined" component="span">
          İptal</Button>

        <Button onClick={handleSubmit} style={{ margin: '0 5px', backgroundColor: colors.primary[400], color: colors.primary[100] }} variant="outlined" component="span">
          Kaydet
        </Button>
      </DialogActions>
    </Dialog>

  );
}

export default PersonelPopup;

