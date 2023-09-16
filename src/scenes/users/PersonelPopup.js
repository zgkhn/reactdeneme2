// PersonelPopup.js

import React, { useState, useEffect } from 'react';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, useTheme } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import moment from "moment";
import 'moment/locale/tr'
import { auth, db } from "../../firebase/config"; // Firebase yapılandırması
import { doc, updateDoc } from 'firebase/firestore'
import { useCollection } from '../../hooks/useallCollection'
import { switches } from "../../data/switch";
import { useDocument, useAllVeri } from '../../hooks/useCollection'
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import { tokens } from "../../theme";
import { useEditProfile } from "../../hooks/useEditYetki";






function PersonelPopup({ open, onClose, selectedRecordId }) {
  const theme = useTheme();
  const { profilError, isPending, editProfile,  } = useEditProfile();


  const colors = tokens(theme.palette.mode);

  const { document } = useDocument("user", selectedRecordId);

  const [switchList, setSwitchList] = useState([]);

 console.log("switches :", document);
  
  console.log("list :", switchList);

 
  
  useEffect(() => {
    // Verilerinizi burada işleyebilir ve indeterminate durumlarını hesaplayabilirsiniz.
    const processedSwitchList = switches.map((item) => {

      console.log("item :", item);

      // Anahtarın belirli bir belgede bulunup bulunmadığını kontrol edin
      const isInDocument = document && document[item.permissions.value] === true;
  
      // Eğer belgede bulunuyorsa bu anahtarın değeri true, aksi halde false
      const isCheckedInDocument = isInDocument ? true : false;
  
      return {
        ...item,
        documentValue: isCheckedInDocument,
      };
    });
  
    setSwitchList(processedSwitchList);
  }, [switches, document]);








  const [newUserData, setNewUserData] = useState();

  const handleUserDataChange = async (field, value) => {
   
   
    
    setNewUserData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  

};

const handleSave = () => {

  if (newUserData) {
  editProfile(selectedRecordId, newUserData);
  setNewUserData("");
}
  handleClose();
};




  let error = "Some error message"; // Define the error variable
  // Now you can use it
  console.log(error);

  const handleClose = () => {
    // Popup'ı kapatmak için onClose callback'ini çağır
    onClose();
  };



  if (document === null) {
    return <p>Veri yükleniyor...</p>;
  }

  // Hata durumunu ele al

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Kullanıcı Yetkileri</DialogTitle>
      <DialogContent>
        <DialogContentText>
          İşlem Yapılan kullanıcı : {document.ad} 
        </DialogContentText>



        {selectedRecordId !== null && selectedRecordId !== undefined && (
  <List>
    {switches.map((item, index) => (
      <ListItem key={index}>
        <Alert variant="outlined" severity="info" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%' }}>
          <div>
            <div>
              <ListItemText primary={item.name} />
            </div>
            <div>
              {item.permissions && item.permissions.map((permission, permissionIndex) => (
                <div key={permissionIndex} style={{ display: 'flex', alignItems: 'center' }}>
                  
                  
                  
                  <Checkbox
                    defaultChecked={document && document[permission.value] ? true : false}
                    onChange={(e) => handleUserDataChange(permission.value, e.target.checked)}
                    />

                  {permission.name}
                </div>
              ))}
            </div>
          </div>
        </Alert>
      </ListItem>
    ))}
  </List>
)}






      </DialogContent>
      <DialogActions>
        <Button style={{ margin: '0 5px', backgroundColor: colors.primary[450] }} onClick={handleClose}>İptal</Button>
        <Button style={{ margin: '0 5px', backgroundColor: colors.primary[450] }} onClick={handleSave} color="primary">

          Kaydet
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default PersonelPopup;
