import React, { useState } from 'react';
import { useLogin } from '../../hooks/useLogin';
import { Button, TextField, Box , Grid , Typography , DialogContentText, DialogTitle, useTheme } from '@mui/material';
import { styled } from '@mui/system';
import logo from '../../data/img/logo.png';


import { useCollection } from '../../hooks/useallCollection'

const StyledBox = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #223e5d;
`;

const StyledForm = styled('form')`
  background-color: #0F1B29;
  padding: 50px;
  border-radius: 9px;
  width: 500px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const StyledLogo = styled('img')`
  width: 100px;
  height: 100px;
  margin-right: 20px;
`;

const StyledSignUpButton = styled(Button)`
  background-color: #007bff;
  color: #fff;

  &:hover {
    background-color: #0056b3;
  }
`;

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [kod, setkod] = useState('');

  const { documents } = useCollection('firmalar');
  const [isRegistering, setIsRegistering] = useState(false); // Add state for registration mode
  const { error, isPending, login } = useLogin();



  const [kodError, setkodError] = useState(false);
  const [telError, setTelError] = useState(false);
  const [adError, setAdError] = useState(false);


  const handleUserDataChange = async (field, value) => {
    if (field === 'kod') {
      // Ad alanının doğrulamasını yapın
      const isValidAd = /^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]*$/.test(value);
      setkodError(!isValidAd);
      if (isValidAd) {
        // Veritabanından firmalar koleksiyonunu çekin
       

        // Kayıt içerisinde aynı isimle başka bir firma var mı kontrol edin
        const isDuplicateKod = documents.some((firma) => firma.id === value);

        if (isDuplicateKod) {
          // Aynı kodla başka bir firma bulundu, hata mesajını ayarlayın
          setkodError(false);
        } else {
          // Aynı kodla başka bir firma bulunmadı, hata mesajını temizleyin
          setkodError(true);

        }
      }
    } else if (field === 'tel') {
      // Telefon numarasının doğrulamasını yapın (örnek olarak 10 haneli bir numara kabul ediliyor)
      const isValidTel = /^\d{10}$/.test(value);
      setTelError(!isValidTel);
    } else if (field === 'ad') {
      // Ad alanının doğrulamasını yapın
      const isValidAd = /^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]{1,30}$/.test(value);

      setAdError(!isValidAd);
    };
  };
  







  const handleSubmit = (e) => {
    e.preventDefault();
    if (isRegistering) {
      // Handle registration here
      // You can send a request to your registration API endpoint
    } else {
      login(email, password);
    }
  };

  const toggleMode = () => {
    setIsRegistering(!isRegistering); // Toggle between login and registration mode
  };

  return (
    <StyledBox style={{
      position: 'absolute',
      top: '50%',
      left: '0',
      right: '0',
      transform: 'translateY(-50%)',
      textAlign: 'center',
    }}>
      <Grid style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Grid >
          <StyledLogo
            src={logo}
            alt="Logo"
            style={{
              width: '702px',
              height: '359px',
            }}
          />        </Grid>
        <Grid style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <StyledForm onSubmit={handleSubmit}>
            <Typography variant="h4" component="h2" sx={{ color: '#fff' }}>
              {isRegistering ? 'Kayıt Ol' : 'Giriş Sayfası'}
            </Typography>
            {isRegistering && (
              <div sx={{
                '& .MuiTextField-root': { m: 1, width: '25ch' },
              }}>
                {/* Add registration form fields here */}
                <TextField
                          id="outlined-required"

                  label="Ad Soyad"
                  required
                  variant="filled"
                  fullWidth // Bileşeni yatayda tam ekran genişliğinde yapar
                  margin="normal" // Normal boşluk (diğer seçenekler: "dense", "none")
                  onChange={(e) => handleUserDataChange('ad', e.target.value)}
                  error={adError}
                  helperText={adError ? 'Lütfen adınızı ve soyadınızı girin.' : ''}
                />

                <TextField
                  label="Tel"
                  required
                  variant="filled"
                  fullWidth
                  margin="normal"
                  onChange={(e) => handleUserDataChange('tel', e.target.value)}
                  error={telError}
                  helperText={telError ? 'Geçersiz telefon numarası' : ''}
                />


                <TextField 
                label="Firma Kodu" 
                required fullWidth
                margin="normal" 
                variant="filled"
                onChange={(e) => handleUserDataChange('kod', e.target.value)}
                error={kodError}
                helperText={kodError ? 'Lütfen Firma Kodunu Doğru Giriniz' : ''}
                />



                <TextField label="Departman" required fullWidth
                  margin="normal" variant="filled"
                />
              </div>
            )}
            <TextField
              label="E-posta"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              variant="filled"
              margin="normal"
            />
            <TextField
              label="Parola"
              type="password"
              required
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              variant="filled"
            />
            {!isPending ? (
              <Button variant="contained" color="neutral" type="submit">
                {isRegistering ? 'Kayıt Ol' : 'Giriş Yap'}
              </Button>
            ) : (
              <Button variant="contained" disabled>
                <CircularProgress size={24} color="inherit" />
              </Button>
            )}
            {error && (
              <Typography variant="body2" sx={{ color: '#f44336' }}>
                {error}
              </Typography>
            )}
            <Grid container justifyContent="center" sx={{ marginTop: '20px' }}>
              <StyledSignUpButton variant="contained" onClick={toggleMode}>
                {isRegistering ? 'Giriş Yap' : 'Kayıt Ol'}
              </StyledSignUpButton>
            </Grid>
          </StyledForm>
        </Grid>
      </Grid>

    </StyledBox>
  );
};

export default Login;
