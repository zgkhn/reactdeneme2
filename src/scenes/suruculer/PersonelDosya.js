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
import { auth, db, firebaseTimestamp, storage } from "../../firebase/config"; // Firebase yapılandırması
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { getFirestore, collection, doc, deleteDoc } from "firebase/firestore";
import CardMedia from '@mui/material/CardMedia';

import { useCollection } from '../../hooks/useallCollection'
import { useSignup } from '../../hooks/useSignupNew';
import { tokens } from "../../theme";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';

import { useAddDosya } from "../../hooks/useAddDosya";
import Box from '@mui/material/Box';
import { useDocument, useAllVeri } from '../../hooks/useCollection'
import { useAuthContext } from '../../hooks/useAuthContext'
import DeleteDosya from './deleteDosya';
import { alpha, styled } from '@mui/material/styles';
import ReactCropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import 'react-dropzone-uploader/dist/styles.css'
import Dropzone from 'react-dropzone-uploader'
import ImageIcon from '@mui/icons-material/Image';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import BackupTableIcon from '@mui/icons-material/BackupTable';
import TopicIcon from '@mui/icons-material/Topic';
import Paper from '@mui/material/Paper';
import Fade from '@mui/material/Fade';
import AddIcon from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab';
import { useDropzone } from 'react-dropzone';
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';

//https://github.com/junkboy0315/react-compare-image/blob/master/README.md
function PersonelPopup({ open, onClose, gelenIdDeger, onChange }) {

  const { isPending: loading, profilError, addDosya, } = useAddDosya();

  const { errorr, isPendingg, signup, setDegerSingup } = useSignup();
  const fullWidth = true;
  const { user } = useAuthContext();
  const storage = getStorage();

  const [formattedDate, setFormattedDate] = useState('');
  const [fileError, setFileError] = useState(false);
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
  const [veriDeger, setVeriDeger] = useState("");
  const [newUserData, setNewUserData] = useState();
  const [geciciDeger, setGeciciDeger] = useState('bos');

  useEffect(() => {
    if (gelenIdDeger) {
      setGeciciDeger(gelenIdDeger);
    }
  }, [gelenIdDeger]); //



  const { isPending, error, documents } = useCollection('user/' + geciciDeger + '/dosya');
  const { document, error: userError } = useDocument("user", geciciDeger);



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


  const [deleteOpen, setDeleteOpen] = React.useState(false);

  const handleClickOpenDelete = () => {
    setDeleteOpen(true);
  };

  const handleCloseDelete = () => {
    setDeleteOpen(false);
  };


  // <button onClick={() => handleMaxWidthChange('xs')}>XS</button>
  // <button onClick={() => handleMaxWidthChange('sm')}>SM</button>
  // <button onClick={() => handleMaxWidthChange('md')}>MD</button>
  // <button onClick={() => handleMaxWidthChange('lg')}>LG</button>
  // <button onClick={() => handleMaxWidthChange('xl')}>XL</button>
  const [maxWidth, setMaxWidth] = React.useState('xs');
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);



  const [dosyaList, setDocuments] = useState([]);
  const [userVeri, setDocument] = useState([]);
  const { getRootProps, acceptedFiles } = useDropzone();


  const files = acceptedFiles.map(file => (
    <li key={file.path}>
      {file.path} - {(file.size / 1024).toFixed(2)} KB
    </li>
  ));

  const resetContent = () => {
    acceptedFiles.length = 0;
    setChecked((prev) => false);
    setEhliyetError(false);
    setAdError(false);
    setTarihError(false);
    setFileError(false);

  };




  useEffect(() => {

    if (selectedItem.dyt) {

      if (selectedItem.dyt instanceof firebaseTimestamp) {
        // Firebase Timestamp'i milisaniye cinsinden zaman damgasına dönüştür
        const timestampMillis = selectedItem.dyt.toMillis();
        // Zaman damgasını kullanarak JavaScript tarih nesnesi oluştur
        const jsDate = new Date(timestampMillis);
        // JavaScript tari nesnesini istediğiniz formatta formatla
        const formattedDate = moment(jsDate).format('YYYY-MM-DD');

        // Formatlanmış tarihi state'e kaydet
        setFormattedDate(formattedDate);
      } else {

        setFormattedDate("");
      }
    }

  }, [selectedItem]);

  // const downloadFile = async (fileURL, fileName) => {

  //   const fileRef = ref(storage, fileURL);

  //   getDownloadURL(fileRef)
  //     .then((url) => {
  //       // URL'i kullanarak dosyayı indirin veya görüntüleyin
  //       window.open(url, '_blank');
  //     })
  //     .catch((error) => {
  //       console.error("Dosya indirme hatası:", error);
  //     });


  // };
  const downloadFile = async (fileURL, fileName) => {
    // Firebase Storage'daki dosyayı işaret eden bir referans oluşturun
    const fileRef = ref(storage, fileURL);
  
    try {
      // Dosyanın indirme URL'sini alın
      const url = await getDownloadURL(fileRef);
  
      // URL'i yeni bir tarayıcı sekmesinde açın
      window.open(url, '_blank');
    } catch (error) {
      console.error("Dosya indirme hatası:", error);
    }
  };
  const handleClose = () => {
    // Popup'ı kapatmak için onClose callback'ini çağır
    onClose();
    setSelectedItemId("")
    setSelectedItem("")
    setEhliyetError(false);
    setAdError(false);
    setTarihError(false);
    setMaxWidth("xs")
    resetContent();
    setFormattedDate("");

  };



  const handleSubmit = () => {   
    
    if  (selectedItem.uyari == true && !selectedItem.dyt ) {
      setTarihError(true);
    }
    else if (!adError && !tarihError && !ehliyetError && selectedItem.dosyaAciklama && selectedItem.dosyaAdi && acceptedFiles.length > 0) {

        addDosya(selectedItem, acceptedFiles[0], gelenIdDeger, userVeri.firmakod);
        // setSelectedItemId("");
        setSelectedItem("");
        resetContent();
        setFormattedDate("");

        // setMaxWidth("xs")
     
     

        handleUserDataChange("dosyaTarihi", new Date())
      
    } else {
      if (!selectedItem.dosyaAdi) {
        setAdError(true)
      }
      if (!selectedItem.dosyaAdi) {
        setEhliyetError(true)
      }

      if (!acceptedFiles.length > 0) {
        setFileError(true)
      }
    }
  };

  useEffect(() => {


    setDocuments(documents);



  }, [documents]);

  useEffect(() => {


    setDocument(document);


  }, [document]);
  useEffect(() => {


    handleUserDataChange("id", geciciDeger);


  }, [geciciDeger]);

  const handleUserDataChange = (field, value) => {
    if (field === 'dyt') {
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
    if (field === 'dosyaAdi') {
      // Ad alanının doğrulamasını yapın
      const isValidAd = value.trim() !== '';
      setAdError(!isValidAd);
    } else if (field === 'dosyaAciklama') {
      // Ehliyet türünün boş olup olmadığını kontrol edin
      const isValidEhliyet = value.trim() !== '';
      setEhliyetError(!isValidEhliyet);
    } else if (field === 'dyt') {
      // Tarihin bugünden önceki bir tarih olup olmadığını kontrol edin
      const selectedDate = new Date(value);
      const today = new Date();
      const isValidTarih = selectedDate >= today;
      setTarihError(!isValidTarih);
    }
  };

  const DeleteDosyaOnay = async (onay, veri) => {



    if (selectedItem && onay) {
      try {
        const documentRef = doc(db, `user/${userVeri.id}/dosya`, selectedItemId);
        await deleteDoc(documentRef);
        setSelectedItemId("");
        setSelectedItem("")
        setMaxWidth("xs")
      } catch (error) {
        console.error('Doküman silinirken bir hata oluştu:', error);
      }
    }
  

  };  
  
  function getFileExtension(url) {
    return url.split('.').pop().toLowerCase();
  }
  const handleItemClick = (itemId) => {

    setSelectedItemId(itemId);
    setSelectedItem("")
    setMaxWidth("md")
    const selectedItem = dosyaList.find((item) => item.id === itemId);
    resetContent();
    setSelectedItem(selectedItem)

  };
  const resimUzantilari = ['jpg', 'jpeg', 'png', 'gif', 'bmp'];


  const filteredListItems = dosyaList.length > 0 ? (
    dosyaList.map((dosyaList) => (
      <ListItem
        key={dosyaList.id}
        button
        alignItems="flex-start"
        onClick={() => handleItemClick(dosyaList.id)}
        style={{
          backgroundColor: selectedItemId === dosyaList.id ? colors.primary[450] : colors.primary[400],
        }}
      >



{resimUzantilari.includes(dosyaList.dosyaP.split('.').pop().toLowerCase()) ? (
  <ImageIcon sx={{ fontSize: 40 }} />
) : dosyaList.dosyaP.endsWith(".pdf") ? (
  <PictureAsPdfIcon sx={{ fontSize: 40 }} />
  ) : dosyaList.dosyaP.endsWith(".xls") || dosyaList.dosyaP.endsWith(".xlsx") ? (
    <BackupTableIcon sx={{ fontSize: 40 }} />
) : (
  <TopicIcon sx={{ fontSize: 40 }} />
)}



       
        <Divider variant="middle" />
        <ListItemText
          primary={dosyaList.dosyaAdi}
          secondary={
            <React.Fragment>
              <Typography
                sx={{ display: 'inline' }}
                component="span"
                variant="body2"
                color="text.primary"
              >
                {"Yüklenme Tarihi : "}{moment(dosyaList.dosyaTarihi.toMillis()).format("DD-MM-YYYY")}
              </Typography>
            </React.Fragment>
          }
        />

      </ListItem>
    ))
  ) : (
    <ListItem>
      <ListItemText primary="Dosya bulunamadı" />
    </ListItem>
  );

  const bull = (
    <Box
      component="span"
      sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
    >
      •
    </Box>
  );
  const [checked, setChecked] = React.useState(false);
  const handleChange = () => {
    setChecked((prev) => !prev);
    handleUserDataChange("uyari", !checked)
  };
  const handleChangeAdd = () => {
    setSelectedItemId("new");
    setSelectedItem("")
    setMaxWidth("md")
    setSelectedItem("")
    handleUserDataChange("dosyaTarihi", new Date())
    resetContent();
  };
  console.log("tüm veri : ", selectedItem)
  return (

    <Dialog
      fullWidth={fullWidth}
      maxWidth={maxWidth}
      open={open}
      onClose={handleClose}
    >
      <DialogTitle>

        <DeleteDosya open={deleteOpen} onClose={() => setDeleteOpen(false)} veri={selectedItem} onChange={DeleteDosyaOnay} />


        <ListItem>
          <ListItemAvatar>
            <Avatar alt="Profile Picture" src={userVeri ? userVeri.photoURL : null} />
          </ListItemAvatar>
          <ListItemText
            primary={userVeri ? userVeri.ad : null}
            secondary={userVeri ? userVeri.email : null}
          />
        </ListItem>


      </DialogTitle>
      <DialogContent>
        <DialogContentText>
        </DialogContentText>
        <Grid container spacing={2}>
          <Grid item xs={selectedItemId ? 6 : 12} sx={{ bgcolor: colors.primary[400] }}>
            <div style={{
              width: '100%',
              height: '100%',
              bgcolor: colors.primary[400],
              position: 'relative',
              overflow: 'auto',
              maxHeight: '48vh'
            }}>
              <List sx={{ width: '100%', height: '100%', bgcolor: colors.primary[400] }}>
                {filteredListItems}

              </List>

            </div>

          </Grid>

          {selectedItemId ? (
            <>

              <Grid item xs={(6)} >
                <Grid container spacing={1}>

                  <Box sx={{
                    minWidth: "100%", bgcolor: colors.primary[400],
                  }}>
                    <Card variant="outlined">

                      <React.Fragment>
                        <CardContent>
                          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>

                            {selectedItemId === "new" ? moment(new Date()).format("DD-MM-YYYY") :

                              "Yüklenme Tarihi :  " + moment(selectedItem.dosyaTarihi.toMillis()).format("DD-MM-YYYY")

                            }


                          </Typography>
                          {selectedItemId === "new" ? "" : 
                          
                          resimUzantilari.includes(selectedItem.dosyaP.split('.').pop().toLowerCase())  ? 
                          <>
                          <CardMedia
        component="img"
        alt="green iguana"
        height="140"
        image={selectedItem.dosyaURL}
      />
</>
:""
}


                          <Typography variant="h5" component="div">
                            {selectedItemId === "new" ?



                              <TextField
                                margin="dense"
                                label="Dosya Adı"
                                fullWidth
                                size="small"
                                value={selectedItem.dosyaAdi ? (selectedItem.dosyaAdi) : ("")}
                                onChange={(e) => handleUserDataChange('dosyaAdi', e.target.value)}
                                error={adError}
                                helperText={adError ? 'Geçersiz İsim Girdiniz' : ''}
                                color="secondary"

                              />

                              :
<>
                             Dosya Adı :  {selectedItem.dosyaAdi}
</>
                            }

                          </Typography>
                          <Typography variant="body2">

                            {selectedItemId === "new" ?

                              <TextField
                                margin="dense"
                                label="Açıklama"
                                size="small"
                                fullWidth
                                multiline
                                value={selectedItem.dosyaAciklama ? (selectedItem.dosyaAciklama) : ("")}

                                error={ehliyetError}
                                helperText={ehliyetError ? 'Lütfen Dosya İle İlğili Bir Açıklama Girin . ' : ''}

                                rows={2}
                                onChange={(e) => handleUserDataChange('dosyaAciklama', e.target.value)}
                                color="secondary"

                              />
                              :
<>
<br />
                             Dosya Açıklaması :  {selectedItem.dosyaAciklama}
</>
                      

                            }



                          </Typography>
                          <Typography sx={{ mb: 1.5 }} color="text.secondary">



                            {selectedItemId === "new" ?

                              <>
                                <FormControlLabel
                                  control={<Switch checked={selectedItem.uyari} onChange={handleChange} />}
                                  label="Hatırlatma veya Yenileme Tarihi ?"
                                />
                                <Fade in={selectedItem.uyari}>

                                  <TextField
                                    margin="dense"
                                    label="Hatırlatma veya Yenileme Tarihi "
                                    type="date"
                                    fullWidth
                                    size="small"
                                    value={formattedDate ? (formattedDate) : ("00/00/0000")}
                                    onChange={(e) => handleUserDataChange('dyt', e.target.value)}
                                    error={tarihError}
                                    helperText={tarihError ? 'Geçersiz tarih' : ''}
                                    focused
                                    color="secondary"
                                  />



                                </Fade>
                              </>
                              :
                              <>

                                {selectedItem.uyari ? moment(selectedItem.dyt.toMillis()).format("DD-MM-YYYY") : ""}

                              </>
                            }



                          </Typography>
                          <Typography sx={{ mb: 1.5 }} color="text.secondary">



                            {selectedItemId === "new" ?

                              <>
                                <section className="container" >
                                  <div {...getRootProps({ className: 'dropzone' })} style={{
                                    padding: '20px', border: fileError ? '1px dashed red' : '1px dashed gray'
                                  }}>
                                    <p>Sürükle Bırak Veya Tıkla.</p>
                                  </div>
                                  <aside >
                                    <h4>{files.length > 0 ? "Dosya" : ""}</h4>
                                    <ul>{files ? files : ""}</ul>
                                  </aside>
                                </section>
                              </>
                              :

                              null
                            }



                          </Typography>

                        </CardContent>
                        <CardActions>
                          <Button onClick={handleClickOpenDelete} style={{ margin: '0 5px', backgroundColor: colors.primary[400], color: colors.primary[100] }}>Sil</Button>


                          <Button onClick={() => downloadFile(selectedItem.dosyaP, selectedItem.dosyaAdi)} style={{ margin: '0 5px', backgroundColor: colors.primary[400], color: colors.primary[100] }}>İndir</Button>
                        </CardActions>
                      </React.Fragment>

                    </Card>
                  </Box>


                </Grid>
              </Grid>


            </>) : (
            null
          )}

        </Grid>

      </DialogContent>
      <DialogActions>
        {selectedItemId !== "new" ? (

          <>
            <Fab color="grid" aria-label="add"
              onClick={handleChangeAdd}
              sx={{}}
              style={{
                float: "right",
                marginRight: "10px",
                marginBottom: "10px"
              }}>
              <AddIcon />
            </Fab>

          </>) : null}

        {selectedItemId == "new" ? (

          <>


            <Button onClick={handleClose} style={{ margin: '0 5px', backgroundColor: colors.primary[400], color: colors.primary[100] }} variant="outlined" component="span">
              İptal</Button>

            {/* <Button onClick={handleSubmit} style={{ margin: '0 5px', backgroundColor: colors.primary[400], color: colors.primary[100] }} variant="outlined" component="span">
              Kaydet
            </Button> */}
            <LoadingButton
              color="secondary"
              onClick={handleSubmit}
              loading={loading}
              loadingPosition="start"
              startIcon={<SaveIcon />}
              variant="contained"
            >
              <span>Save</span>
            </LoadingButton>


          </>) : null}
      </DialogActions>
    </Dialog>

  );
}

export default PersonelPopup;

