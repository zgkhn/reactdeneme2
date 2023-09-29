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
import 'react-dropzone-uploader/dist/styles.css'
import Dropzone from 'react-dropzone-uploader'

//https://github.com/junkboy0315/react-compare-image/blob/master/README.md
function PersonelPopup({ open, onClose, gelenIdDeger, onChange }) {

  const { profilError, addSurucu, } = useAddSurucu();

  const { errorr, isPendingg, signup, setDegerSingup } = useSignup();
  const fullWidth = true;
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



  // <button onClick={() => handleMaxWidthChange('xs')}>XS</button>
  // <button onClick={() => handleMaxWidthChange('sm')}>SM</button>
  // <button onClick={() => handleMaxWidthChange('md')}>MD</button>
  // <button onClick={() => handleMaxWidthChange('lg')}>LG</button>
  // <button onClick={() => handleMaxWidthChange('xl')}>XL</button>
  const [maxWidth, setMaxWidth] = React.useState('lg');
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { isPending, error, documents } = useCollection('user');
  const [resimEditOpen, setResimEditOpen] = useState(false);



  const handleClose = () => {
    // Popup'ı kapatmak için onClose callback'ini çağır
    onClose();

  };

  




  return (




    <Dialog
      fullWidth={fullWidth}
      maxWidth={maxWidth}
      open={open}
      onClose={handleClose}

    >


      <DialogTitle>jkjjjjjjjjjjjjjjjjjjjjj</DialogTitle>
      <DialogContent>
        <DialogContentText>


        </DialogContentText>
        <Grid container spacing={2}>



          <Grid item xs={12} container alignItems="center" justifyContent="center" align-content="center">
             </Grid>
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

