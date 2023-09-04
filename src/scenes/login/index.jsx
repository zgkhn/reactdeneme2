import React, { useState } from 'react';
import { useLogin } from '../../hooks/useLogin';
import { TextField, Button, Typography, Box, CircularProgress } from '@mui/material';
import { styled } from '@mui/system';

const StyledBox = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #0f1924;
`;

const StyledForm = styled('form')`
  background-color: #212121;
  padding: 20px;
  border-radius: 8px;
  width: 300px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { error, isPending, login } = useLogin();

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email, password);
  };

  return (
    <StyledBox>
      <StyledForm onSubmit={handleSubmit}>
        <Typography variant="h4" component="h2" sx={{ color: '#fff' }}>
          Giriş Sayfası
        </Typography>
        <TextField
          label="E-posta"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          variant="filled"
        />
        <TextField
          label="Parola"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          variant="filled"
        />
        {!isPending ? (
          <Button variant="contained" color="primary" type="submit">
            Giriş Yap
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
      </StyledForm>
    </StyledBox>
  );
};

export default Login;
