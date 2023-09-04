import React, { useState } from 'react';
import { Box, FormControlLabel, FormGroup, Switch } from "@mui/material";
import moment from "moment"; // Don't forget to import moment
import 'react-phone-input-2/lib/style.css';
import PhoneInput from 'react-phone-input-2';
import { switches } from "../data/switch"; 
import { styled } from '@mui/system'; // Import the styled utility from Material-UI
import CloseIcon from '@mui/icons-material/Close';

// Define a styled component for the popup container
const PopupContainer = styled('div')({
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  zIndex: 1000,
  background: '#fff',
  boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)',
  padding: '20px',
  borderRadius: '8px',
  minWidth: '300px',
});

const Popup = ({ rowData, handleClose }) => {
  const [selectedSwitch, setSelectedSwitch] = useState(false);
  const [ehliyetYenilemeTarihi, setEhliyetYenilemeTarihi] = useState(
    moment().format("YYYY-MM-DD")
  );

  const handleSwitchChange = (event) => {
    setSelectedSwitch(event.target.checked);
  };

  const handleEhliyetYenilemeTarihiChange = (event) => {
    const newDate = event.target.value;
    if (moment(newDate).isValid() && moment(newDate).isAfter(moment())) {
      setEhliyetYenilemeTarihi(newDate);
    }
  };

  return (
    <PopupContainer>
      <CloseIcon onClick={handleClose} style={{ position: 'absolute', top: '10px', right: '10px', cursor: 'pointer' }} />
      <div>
        {/* ... (popup content) */}
      </div>
    </PopupContainer>
  );
};

export default Popup;
