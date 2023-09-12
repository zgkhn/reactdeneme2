import React, { useState } from 'react';
import { TextField, Button, Grid, Typography, Avatar, Box } from '@mui/material';
import { useAuthContext } from '../../hooks/useAuthContext'
import Input from '@mui/material/Input';
import { useDocument,useAllVeri } from '../../hooks/useCollection'
import { useEditProfile } from "../../hooks/useEditProfile";
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
const MyForm = () => {
    const {user} =useAuthContext();
    const { document, error } = useDocument("user", user.uid);
    const [newUserData, setNewUserData] = useState();
    const [formData, setFormData] = useState('');
    const [password, setPassword] = useState('');
    const { editProfile, errorr, isPending ,eskiPasswordError } = useEditProfile();

    const [pd, setPd] = useState('');
    const [isRegistering, setIsRegistering] = useState(false); // Add state for registration mode
    const [passwordError, setPasswordError] = useState(false);

    const [pdError, setPdError] = useState(false);
    const [telError, setTelError] = useState(false);
    const [adError, setAdError] = useState(false);
  

    const [departmanError, setDepartmanError] = useState(false);
    const handleUserDataChange = async (field, value) => {
  
      setNewUserData((prevData) => ({
        ...prevData,
        [field]: value,
  
      }));
  




      
   
       if (field === 'tel') {
        // Telefon numarasının doğrulamasını yapın (örnek olarak 10 haneli bir numara kabul ediliyor)
        const isValidTel = /^\d{10}$/.test(value);
        setTelError(!isValidTel);
  
  
  
      } else if (field === 'password') {
        // Telefon numarasının doğrulamasını yapın (örnek olarak 10 haneli bir numara kabul ediliyor)
        const isValidPassword = value.length >= 6;      
        const isPd = pd === value;
        setPdError(!isPd);
  
  
        setPasswordError(!isValidPassword);
        
  
  
      } else if (field === 'ad') {
        // Ad alanının doğrulamasını yapın
        const isValidAd = /^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]{1,30}$/.test(value);
  
        setAdError(!isValidAd);
      }else if (field === 'departman') {
        // Ad alanının doğrulamasını yapın
        const isValidAd = /^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]{1,30}$/.test(value);
  
        setDepartmanError(!isValidAd);
      };
      
    };
  
    const handleUserDataChange1 = async (field, value) => {

  
    if (field === 'pd') {
      const isPasswordMatch = value === newUserData.password;
      setPd(value)
      // Parola geçerli değilse veya girdi parola ile uyuşmuyorsa hata göster
      setPdError(!isPasswordMatch);
    };

  };


  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      profileImage: file,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    editProfile(user,formData.profileImage,newUserData);
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
            label="Ad Soyad"
            name="fullName"
            defaultValue={document.ad}
            onChange={(e) => handleUserDataChange('ad', e.target.value)}
            error={adError}
            helperText={adError ? 'Lütfen adınızı ve soyadınızı girin.' : ''}

          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Telefon Numarası"
            name="phoneNumber"
            onChange={(e) => handleUserDataChange('tel', e.target.value)}
            error={telError}
            helperText={telError ? 'Geçersiz telefon numarası' : ''} 
            defaultValue={document.tel}

          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Departman"
            name="department"
            defaultValue={document.departman}
            onChange={(e) => handleUserDataChange('departman', e.target.value)}
            error={departmanError}
            helperText={departmanError ? 'Lütfen Departman Giriniz' : ''}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Eski Parola"
            type="password"
            name="password"
            error={eskiPasswordError}
            helperText={eskiPasswordError ? 'Hatalı Parola' : ''}
            onChange={(e) => {
              handleUserDataChange('eskiPassword', e.target.value);
            }}            
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Yeni Parola"
            type="password"
            name="password"
            error={passwordError}
            helperText={passwordError ? 'Geçersiz Parola Adresi' : ''}
            onChange={(e) => {
              handleUserDataChange('password', e.target.value);
              setPassword(e.target.value);
            }}            
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Parola Doğrulama"
            type="password"
            name="confirmPassword"
            onChange={(e) => handleUserDataChange1('pd', e.target.value)}
            error={pdError}
            helperText={pdError ? 'Lütfen Parolayı Doğru Giriniz' : ''}          />
        </Grid>



       



        <Grid item xs={12} sm={10}>
        <TextField
  fullWidth
  label="Açıklama"
  multiline
  rows={5} // Burada istediğiniz satır sayısını belirleyebilirsiniz
  name="description"
  onChange={(e) => handleUserDataChange('bilgi', e.target.value)}
  defaultValue={document.bilgi ? document.bilgi : ''}

/>
        </Grid>
       
        <Grid item xs={12} sm={2} container justifyContent="center">
        <input
    type="file"
    accept="image/*"
    onChange={handleImageUpload}
    style={{ display: "none" }}
    id="image-upload"
  />
  <label htmlFor="image-upload">
    <Button
      variant="contained"
      color="primary"
      component="span"
    >
      Fotoğraf Seç
    </Button>
  </label>
        {formData.profileImage ? (
  <Avatar
    alt="Profil Fotoğrafı"
    src={URL.createObjectURL(formData.profileImage)}
    sx={{ width: 100, height: 100, marginTop: 2 }}
  />
) : (
  <Avatar
    alt="Profil Fotoğrafı"
    src={user.photoURL}
    sx={{ width: 100, height: 100, marginTop: 2 }}
  />
)}

        </Grid>
       
        <Grid item xs={12} sm={2} container justifyContent="center" alignItems="center">

          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Güncelle
          </Button>
        </Grid>
        
        <Grid item xs={12} sm={4} >
        <Alert variant="outlined" severity="success">
        This is a success alert — check it out!
      </Alert>
        </Grid>
    
        <Grid item xs={12} sm={6} >
  
        </Grid>
    
        <Grid item xs={12} >
  
        </Grid>
        
      </Grid>
    </form>
  );
};

export default MyForm;
