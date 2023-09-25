// PersonelPopup.js

import React, { useState ,useEffect , useRef } from 'react';
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
import { auth, db ,firebaseTimestamp ,storage, } from "../../firebase/config"; // Firebase yapılandırması
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
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


  const [onResim, setOnResim] = useState('');
  const [arkaResim, setArkaResim] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [licenseRenewalDate, setLicenseRenewalDate] = useState('');
  const currentDate = new Date();
  const [selectedItemId, setSelectedItemId] = useState('');
  const [selectedItem, setSelectedItem] = useState('');
 
  const [onChangeVeri, setOnChangeVeri] = useState('');
  const [resimEditKonum, setResimEditKonum] = useState('');
  const [profilePhotoOn, setProfilePhotoOn] = useState(""); // Profil fotoğrafını dosya olarak saklamak için
  const [profilePhotoArka, setProfilePhotoArka] = useState(""); // Profil fotoğrafını dosya olarak saklamak için

  const [formData, setFormData] = useState('');
  const [profilePhotoOnUrl, setProfilePhotoOnUrl] = useState(null);
  const [profilePhotoArkaUrl, setProfilePhotoArkaUrl] = useState(null);



  const [description, setDescription] = useState('');
  const [adError, setAdError] = useState(false);
  const [telError, setTelError] = useState(false);
  const [ehliyetError, setEhliyetError] = useState(false);
  const [tarihError, setTarihError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [newUserData, setNewUserData] = useState();



 

////////////////////////////////

const handleSubmit = () => {

 
  if ( !telError && !adError ) {

    addSurucu(selectedItem, profilePhotoOn, profilePhotoArka);

  } else {

  }

};
/////////////////////////

  const handleImageUploadArka = (e) => {
    setResimEditKonum("arka")
    setOnChangeVeri(e)
    setResimEditOpen(true)

  };

  const handleResimEditKaydet  = (veriURL, konum,data) => {
  
    setOnChangeVeri("")

    if(konum == "on"){
      setProfilePhotoOnUrl(veriURL);
      setProfilePhotoOn(data);

     }
     if(konum == "arka"){
      setProfilePhotoArkaUrl(veriURL);
      setProfilePhotoArka(data);

     }

  };

  const handleImageUpload = (e) => {
    setResimEditKonum("on")
    setOnChangeVeri(e)
    setResimEditOpen(true)




    // dataURL'i kullanarak veritabanına veya başka bir yere yükleme işlemini gerçekleştirin
  };





  const handleClose = () => {
    // Popup'ı kapatmak için onClose callback'ini çağır
    onClose();
    setSelectedItemId("")
    setProfilePhotoArka("");
    setProfilePhotoOn("");

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

  useEffect(() => {
    if (selectedItem.eyt instanceof firebaseTimestamp) {
      // Firebase Timestamp'i milisaniye cinsinden zaman damgasına dönüştür
      const timestampMillis = selectedItem.eyt.toMillis();

      // Zaman damgasını kullanarak JavaScript tarih nesnesi oluştur
      const jsDate = new Date(timestampMillis);

      // JavaScript tarih nesnesini istediğiniz formatta formatla
      const formattedDate = moment(jsDate).format('YYYY-MM-DD');

      // Formatlanmış tarihi state'e kaydet
      setFormattedDate(formattedDate);
    } else {

      setFormattedDate("");
    }

    console.log("selectedItem.eyt : ",selectedItem.ehliyetOnFoto )
  }, [selectedItem]);


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
console.log("profilePhotoOn",profilePhotoOn)




 useEffect(() => {

  setEmailDefaultValue(selectedItem.email || ''); // Use selectedItem.email if it exists, otherwise use an empty string
  setProfilePhotoOnUrl(null)
  setProfilePhotoArkaUrl(null)
  setProfilePhotoArka("");
  setProfilePhotoOn("");
  setOnChangeVeri("")
if (selectedItem.ehliyetOnFoto){
  const storageRef = ref(storage, selectedItem.ehliyetOnFoto);

  storageRef.getDownloadURL()
  .then((url) => {
    // URL'i kullanabilirsiniz
    console.log('Erişilebilir URL:', url);
    setOnResim(url)
  })
  .catch((error) => {
    console.error('Hata:', error);
  });
}else{
  setOnResim("")
}



if (selectedItem.ehliyetArkaFoto){

  const storageReff = ref(storage, selectedItem.ehliyetArkaFoto);

  storageReff.getDownloadURL()
  .then((url) => {
    // URL'i kullanabilirsiniz
    console.log('Erişilebilir URL:', url);
    setArkaResim(url)
  })
  .catch((error) => {
    console.error('Hata:', error);
  });
}else{
  setArkaResim("")
}


}, [selectedItemId]);








const RedditTextField = styled((props) => (
  <TextField InputProps={{ disableUnderline: true }} {...props} />
))(({ theme }) => ({
  '& .MuiFilledInput-root': {
    overflow: 'hidden',
    borderRadius: 4,
    backgroundColor:'#F3F6F9',
    border: '1px solid',
    borderColor:  '#2D3843',
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
          <ResimEdit  open={resimEditOpen} onClose={() => setResimEditOpen(false)} veri={onChangeVeri} konum={resimEditKonum} onChange={handleResimEditKaydet} />
          Yeni bir Sürücü eklemek için aşağıdaki bilgileri doldurun.
        </DialogContentText>
        <Grid container spacing={2}>
          <Grid item xs={selectedItemId ? (3): (12)}>
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
                    <RedditTextField
                   
                
                      autoFocus
                      margin="dense"
                      label="E-posta"
                      type="email"
                      fullWidth
                      value={selectedItem.email}
                      error={emailError}
                      helperText={emailError ? 'Geçersiz e-posta adresi.' : ''}
                      disabled
                    />
                  </Grid>

                  <Grid item xs={12} md={6} >
                    <TextField
                      margin="dense"
                      label="Adı Soyadı"
                      fullWidth
                      value={selectedItem.ad}
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
      value={formattedDate}
      onChange={(e) => handleUserDataChange('eyt', e.target.value)}
      error={tarihError}
      helperText={tarihError ? 'Geçersiz tarih' : ''}
    />

                  </Grid>
                  <Grid item xs={12} md={6} >
                    <TextField
                      margin="dense"
                      label="Ehliyet Türü"
                      fullWidth
                      value={selectedItem.ebilgi}
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
                      value={selectedItem.tel}

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
                      value={selectedItem.departman}
                      onChange={(e) => handleUserDataChange('departman', e.target.value)}
                      error={adError}
                      helperText={adError ? 'Geçersiz ad' : ''}
                    />
                  </Grid>


                  <Grid item xs={12} md={12} >
                    <TextField
                      margin="dense"
                      label="Adres"
                      fullWidth
                      value={selectedItem.adres}

                      multiline
                      rows={1}
                      onChange={(e) => handleUserDataChange('adres', e.target.value)}
                    />
                  </Grid>


                  <Grid item xs={12} md={12} >
                    <TextField
                      margin="dense"
                      label="Açıklama"
                      fullWidth
                      multiline
                      value={selectedItem.bilgi}
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
              profilePhotoOnUrl) : onResim ? (
                onResim
              ) : (
                on)}
              
            rightImage={profilePhotoArkaUrl ? (
              profilePhotoArkaUrl) : arkaResim ? (
                arkaResim
              ) : (
                on)}
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

        <Button onClick={handleSubmit}  style={{ margin: '0 5px', backgroundColor: colors.primary[400], color: colors.primary[100] }} variant="outlined" component="span">
          Kaydet
        </Button>
      </DialogActions>
    </Dialog>

  );
}

export default PersonelPopup;

