import React, { useState } from 'react';
import { TextField, Button, Grid, Typography, Avatar, Box } from '@mui/material';
import { useAuthContext } from '../../hooks/useAuthContext'
import Input from '@mui/material/Input';
import { useDocument,useAllVeri } from '../../hooks/useCollection'
const MyForm = () => {
    const {user} =useAuthContext();
    const { document, error } = useDocument("user", user.uid);


  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    department: '',
    password: '',
    confirmPassword: '',
    profileImage: null,
    description: '',
  });
console.log(formData.profileImage)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      profileImage: file,
    });
  };

  const handleSubmit = () => {
    // Form verilerini gönderme işlemleri burada yapılabilir
    console.log("deneme 1 : ",formData);
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
            onChange={handleChange}
            defaultValue={document.ad}

          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Telefon Numarası"
            name="phoneNumber"
            onChange={handleChange}
            defaultValue={document.tel}

          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Departman"
            name="department"
            onChange={handleChange}
            defaultValue={document.departman}

          />
        </Grid>
        <Grid item xs={12} sm={5}>
          <TextField
            fullWidth
            label="Parola"
            type="password"
            name="password"
            onChange={handleChange}
            
          />
        </Grid>
        <Grid item xs={12} sm={5}>
          <TextField
            fullWidth
            label="Parola Doğrulama"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
        </Grid>



        <Grid item xs={12} sm={2} container justifyContent="center" sx={{ textAlign: "center" }}>
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
      sx={{ marginTop: 2 }}
    >
      Fotoğraf Seç
    </Button>
  </label>
</Grid>



        <Grid item xs={12} sm={10}>
        <TextField
  fullWidth
  label="Açıklama"
  multiline
  rows={5} // Burada istediğiniz satır sayısını belirleyebilirsiniz
  name="description"
  value={formData.description}
  onChange={handleChange}
/>
        </Grid>
       
        <Grid item xs={12} sm={2} container justifyContent="center">
          
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
        
        <Grid item xs={12}>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Güncelle
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default MyForm;
