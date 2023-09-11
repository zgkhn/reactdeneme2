import React, { useState } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Alert } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { mockDataContacts } from "../../data/mockData";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import { useCollection } from '../../hooks/useallCollection'
import SettingsApplicationsIcon from '@mui/icons-material/SettingsApplications';
import moment from "moment";
import 'moment/locale/tr'
import { switches } from "../../data/switch";
import { auth, db } from "../../firebase/config"; // Firebase yapılandırması
import {doc,updateDoc} from 'firebase/firestore'
import LinearProgress from '@mui/material/LinearProgress';
import Switch from '@mui/material/Switch';


const Contacts = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [telError, setTelError] = useState(false);
  const [adError, setAdError] = useState(false);
  const [ehliyetError, setEhliyetError] = useState(false);
  const [bilgiError, setBilgiError] = useState(false);
  const [tarihError, setTarihError] = useState(false);

  const { isPending, error, documents } = useCollection('suruculer');
  const [newUserData, setNewUserData] = useState({
    ad: "",
    tel: "",
    ehliyet: "",
    bilgi: "",
  });
  const handleUserDataChange = (field, value) => {
    setNewUserData((prevData) => ({
      ...prevData,
      [field]: field === 'e-yenileme-t' ? new Date(value) : value,
    }));




console.log("test değer",newUserData)
    if (field === 'tel') {
      // Telefon numarasının geçerliliğini kontrol etmek için uygun bir yöntem kullanın
      const isValidTel = /^\d{10}$/.test(value); // Örnek geçerlilik kontrolü

      setTelError(!isValidTel);
    }
    if (field === 'e-yenileme-t') {
      // Seçilen tarihin bugünden önceki bir tarih olup olmadığını kontrol etmek için
      const selectedDate = moment(value);
      
      const today = moment();
      const isValidTarih = selectedDate.isSameOrAfter(today, 'day');

      setTarihError(!isValidTarih);
    }
    switch (field) {
      case 'ad':
        const isValidAd = /^[\w\sğüşıöçİĞÜŞÖÇ]{1,30}$/.test(value); // Türkçe karakterler dahil, en fazla 30 karakter
        setAdError(!isValidAd);
        break;
      case 'ehliyet':
        const isValidEhliyet = value.trim() !== ''; // Boş bırakılamaz
        setEhliyetError(!isValidEhliyet);
        break;
      case 'bilgi':
        const isValidBilgi = value.length <= 250; // En fazla 250 karakter
        setBilgiError(!isValidBilgi);
        break;
      default:
        break;
    }





  };
  

  
//console.log("telefon durumu :",document.row.parent.id)

  const [selectedRow, setSelectedRow] = useState({
    tel: '', 
    ad: '',
    ehliyet: '',
    bilgi: ''
  });
  console.log("selectedRow : ",selectedRow)
  const [openDialog, setOpenDialog] = useState(false);

  const handleCloseDialog = () => {
    setSelectedRow(null);
    setOpenDialog(false);
  };

  const handleEditClick = (row) => {


    handleUserDataChange("ad", row.ad)
    handleUserDataChange("tel", row.tel)
    handleUserDataChange("ehliyet", row.ehliyet)
    handleUserDataChange("bilgi", row.bilgi)
    setSelectedRow(row);
    setOpenDialog(true);
  };





  const handleSave = async () => {
   
   
    if (!adError && !ehliyetError && !bilgiError && !telError && !tarihError) { // Tüm hatalar kontrol ediliyor
   
   
    try {
      // Firestore'a erişim sağlayan bir referans alın (örneğin 'suruculer' koleksiyonu için)
      const docRef = doc(db, 'suruculer', selectedRow.id);
      
      // Veriyi güncelle
      await updateDoc(docRef, newUserData);
      
      // Başarılı bir şekilde güncellendiğini kullanıcıya bildirin
      handleCloseDialog();
    } catch (error) {
      // Hata durumunda kullanıcıya hata mesajı verin
      console.error('Veri güncelleme hatası:', error);
    }

  } else {
    console.log('Hatalı girişler var, güncelleme yapılamaz.');
  }

  };
 



  const columns = [
    // {
    //   field: "online",
    //   headerName: "Online",
    //   flex: 0.3,
    //   renderCell: (params) => {
    //     const isOnline = params.value === true;

    //     return (
    //       <div style={{ display: "flex", alignItems: "center" }}>
    //         <div
    //           style={{
    //             width: "10px",
    //             height: "10px",
    //             borderRadius: "50%",
    //             backgroundColor: isOnline ? "green" : "red",
    //             marginRight: "5px",
    //           }}
    //         ></div>
    //         {isOnline ? "Online" : "Offline"}
    //       </div>
    //     );
    //   },


    // },

    { field: "email", headerName: "Email", flex: 0.8 },
    { field: "ad", headerName: "Adı Soyadı", flex: 0.8 },
    { field: "tel", headerName: "Telefon", flex: 0.5 },
    { field: "ehliyet", headerName: "Belge Türü", flex: 0.3 },


    {
      field: "formattedDate",
      headerName: "E.Yenileme Tarihi",
      flex: 0.5,
      renderCell: (params) => {
        const timestamp = params.row["e-yenileme-t"]; // Firestore'dan gelen Timestamp nesnesi
        console.log("params : " ,params.row)
        if (timestamp) {
          const date = timestamp.toDate(); // Timestamp nesnesini Date nesnesine çevir
          const formattedDate = moment(date).format("DD-MM-YYYY"); // Date nesnesini moment ile formatla
          return <span>{formattedDate}</span>;
        } else {
          return "";
        }
      }
    },


    { field: "bilgi", headerName: "Açıklama", flex: 1.3 },
    {
      field: "actions",
      headerName: "İşlem",
      flex: 0.1,
      renderCell: (params) => (
        <SettingsApplicationsIcon
          onClick={() => handleEditClick(params.row)}


          style={{ cursor: "pointer" }}
        />
      ),
    },


  ];




  return (


    <div >



      <Box m="50px">
        <Header
          title="Sürücü Listesi"
          subtitle="List of Contacts for Future Reference"
        />
        <Box
          m="20px 0 0 0"
          height="75vh"
          sx={{
            "& .MuiDataGrid-root": {
              border: "none",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: "none",
            },
            "& .no-border-bottom": {
              borderBottom: "none !important",
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: colors.blueAccent[700],
              borderBottom: "none",
            },
            "& .MuiDataGrid-virtualScroller": {
              backgroundColor: colors.primary[400],
            },
            "& .MuiDataGrid-footerContainer": {
              borderTop: "none",
              backgroundColor: colors.blueAccent[700],
            },
            "& .MuiCheckbox-root": {
              color: `${colors.greenAccent[100]} !important`,
            },
            "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
              color: `${colors.grey[100]} !important`,
            },
          }}
        >



          {documents === null ? (
            // Eğer documents null ise yükleme sayfasını göster
<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
  <LinearProgress />
</div>          ) : (
            // Eğer documents null değilse, DataGrid'i göster
            <DataGrid
              rows={documents}
              columns={columns}
              components={{ Toolbar: GridToolbar }}
            />

          )}
        </Box>
      </Box>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Ayarları Düzenle</DialogTitle>
        <DialogContent style={{ width: '700xp' }}>

          <div style={{ marginBottom: '16px' }} />

          <TextField
            style={{ marginBottom: '20px' }}
            label="Email"
            defaultValue={selectedRow?.email}
            disabled
            fullWidth
          />

          <TextField
            style={{ marginBottom: '20px' }}
            label="Adı Soyadı"
            defaultValue={selectedRow?.ad}
            fullWidth
        onChange={(e) => handleUserDataChange('ad', e.target.value)}
        error={adError}
        helperText={adError ? 'Geçerli bir ad giriniz (en fazla 30 karakter).' : ''}
      />
        

          {selectedRow && (
            <TextField
              style={{ marginBottom: '20px' }}
              label="Telefon"
              defaultValue={selectedRow.tel}
              fullWidth
              onChange={(e) => handleUserDataChange('tel', e.target.value)}
              error={telError}
              helperText={telError ? 'Hatalı giriş.' : ''}
            />
          )}
          <TextField
            style={{ marginBottom: '20px' }}
            label="Belge Türü"
            defaultValue={selectedRow?.ehliyet}
            fullWidth
            required
            onChange={(e) => handleUserDataChange('ehliyet', e.target.value)}
            error={ehliyetError}
            helperText={ehliyetError ? 'Ehliyet alanı boş bırakılamaz.' : ''}
    
          />

          {/* <TextField
    style={{ marginBottom: '20px' }} 
    label="Ehliyet Yenileme Tarihi"
    defaultValue={selectedRow ? moment(selectedRow.tarih).format("YYYY-MM-DD") : ""}
    type="date"
    fullWidth
    required
    onChange={(e) => handleUserDataChange("tarih", e.target.value)}

  />  */}

          <TextField
            style={{ marginBottom: '20px' }}
            label="Ehliyet Yenileme Tarihi"
            type="date"
            defaultValue={selectedRow ? moment(selectedRow.tarih).format("YYYY-MM-DD") : ""}
            fullWidth
            onChange={(e) => handleUserDataChange('e-yenileme-t', e.target.value)}
            error={tarihError}
            helperText={tarihError ? 'Geçerli bir tarih giriniz.' : ''}
          />





          <TextField
            style={{ marginBottom: '20px' }}
            label="Açıklama"
            defaultValue={selectedRow?.bilgi}
            multiline
            fullWidth
            
            rows={4}
            onChange={(e) => handleUserDataChange('bilgi', e.target.value)}
            error={bilgiError}
            helperText={bilgiError ? 'Bilgi en fazla 250 karakter olmalıdır.' : ''}
    
          />

          <div style={{ marginBottom: '16px' }} />

          {switches.map((item) => {
 
  return (
    <div key={item.value}>
      <Switch
        {...item} // Switch bileşenine diğer props'ları aktarıyoruz

        defaultChecked={selectedRow?.[item.value]} // selectedRow.ehliyet ile item.value'i karşılaştırıyoruz
        onChange={(e) => handleUserDataChange(item.value, e.target.checked)}

        size="small"
      />
      {item.name}
    </div>
  );
})}

<div style={{ marginBottom: '16px' }} />


{!adError && !ehliyetError && !bilgiError && !telError && !tarihError ? (
  // Tüm hatalar kontrol ediliyor
  <DialogContent>
    {/* Your content here */}
  </DialogContent>
) : (
  <Alert severity="warning"> Lütfen Bilgileri Eksiksiz Giriniz! </Alert>
)}

        

        </DialogContent>
        <DialogActions>
          <Button onClick={handleSave} variant="contained" color="success">
            Kaydet
          </Button>
          <Button onClick={handleCloseDialog} variant="outlined" color="error">
            İptal
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );

};

export default Contacts;