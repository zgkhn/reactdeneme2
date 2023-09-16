import React, { useState } from 'react';
import { TextField, Button, Grid, Typography, Avatar, Box } from '@mui/material';
import { useAuthContext } from '../../hooks/useAuthContext'
import Input from '@mui/material/Input';
import { useDocument, useAllVeri } from '../../hooks/useCollection'
import { useEditProfile } from "../../hooks/useEditFirma";
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
const MyForm = () => {
  const { user } = useAuthContext();
  const { document, error } = useDocument("firmalar", user.displayName);
  const [newUserData, setNewUserData] = useState();
 
  const { profilError, isPending, editProfile,  } = useEditProfile();
  
  const [eksikError, setEksik] = useState(false);


  const [telError, setTelError] = useState(false);
  const [adError, setAdError] = useState(false);


  const [departmanError, setDepartmanError] = useState(false);




  const handleUserDataChange = async (field, value) => {
   
   
    
      setNewUserData((prevData) => ({
        ...prevData,
        [field]: value,
      }));
    

    if (field === 'firmatel') {
      // Telefon numarasının doğrulamasını yapın (örnek olarak 10 haneli bir numara kabul ediliyor)
      const isValidTel = /^\d{10}$/.test(value);
      setTelError(!isValidTel);


    } else if (field === 'firmaadi') {
      // Ad alanının doğrulamasını yapın
      const isValidAd = value.trim() !== '';

      setAdError(!isValidAd);
    } else if (field === 'firmaadres') {
      // Ad alanının doğrulamasını yapın
      const isValidAd = value.trim() !== '';

      setDepartmanError(!isValidAd);
    };

  };






  const handleSubmit = (e) => {

 
    setEksik(false)
    if (!telError && !adError && !departmanError) {
      e.preventDefault();
      editProfile(user, newUserData);

      setNewUserData("");



    } else {
      setEksik(true)

    }

    


  };


  // Veri yüklenene kadar yükleme göster
  if (document === null) {
    return <p>Veri yükleniyor...</p>;
  }

  // Hata durumunu ele al
  if (error) {
    return <p>Hata oluştu: {error.message}</p>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={12}>

        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Firma Adı"
            name="fullName"
            defaultValue={document.firmaadi}
            onChange={(e) => handleUserDataChange('firmaadi', e.target.value)}
            error={adError}
            helperText={adError ? 'Lütfen Firma Adı Girin.' : ''}

          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Telefon Numarası"
            name="phoneNumber"
            onChange={(e) => handleUserDataChange('firmatel', e.target.value)}
            error={telError}
            helperText={telError ? 'Geçersiz Telefon Numarası' : ''}
            defaultValue={document.firmatel}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Firma Kodu"
            name="department"
            defaultValue={user.displayName}
        
            disabled
          />
        </Grid>
     

        <Grid item xs={12} sm={8}>
          <TextField
            fullWidth
            label="Açıklama"
            multiline
            rows={1} // Burada istediğiniz satır sayısını belirleyebilirsiniz
            name="description"
            onChange={(e) => handleUserDataChange('firmaadres', e.target.value)}
            defaultValue={document.firmaadres ? document.firmaadres : ''}
            error={departmanError}
            helperText={departmanError ? 'Lütfen Adres Giriniz' : ''}

          />
        </Grid>

       
        <Grid item xs={12} sm={1} container justifyContent="center" alignItems="center">
  {newUserData ? (
    <Button variant="contained" color="primary" onClick={handleSubmit}>
      Güncelle
    </Button>
  ) : (
    // Else kısmına eklemek istediğiniz JSX'i buraya ekleyebilirsiniz
    // Örnek: <p>Hata mesajı</p>
    // veya <div>Başka bir şey</div>
    null // Eğer bir şey eklemek istemiyorsanız null kullanabilirsiniz
  )}
</Grid>


     



        <Grid item xs={12} sm={3} >

          {eksikError ? (
            <Alert variant="outlined" severity="warning">
              Lütfen eksik kısımları tamamlayınız.
            </Alert>) : ("")}

            
            {Object.keys(profilError).filter((key) => key.startsWith("w")).length > 0 && (
  <Alert variant="outlined" severity="warning">
    {Object.keys(profilError)
      .filter((key) => key.startsWith("w"))
      .map((key) => (
        <div key={key}>* {profilError[key]}</div>
      ))}
  </Alert>
)}



       


  {Object.keys(profilError).filter((key) => key.startsWith("s")).length > 0 && (
<Alert variant="outlined" severity="success">
{Object.keys(profilError)
.filter((key) => key.startsWith("s"))
.map((key) => (
<div key={key}>* {profilError[key]}</div>
))}
</Alert>
)}

</Grid>
      

        
      </Grid>
    </form>
  );
};

export default MyForm;
