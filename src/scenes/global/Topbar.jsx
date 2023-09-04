import React, { useContext, useState } from "react";
import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  useTheme,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Button,
  Snackbar,
} from "@mui/material";
import { ColorModeContext, tokens } from "../../theme";
import InputBase from "@mui/material/InputBase";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchIcon from "@mui/icons-material/Search";
import { auth, db } from "../../firebase/config";
import { getFirmaById } from "../../firebase/veri";
import { collection, doc, updateDoc } from "firebase/firestore";
import { AuthContext } from '../../contexts/AuthContext';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuthContext } from '../../contexts/AuthContext';
import { useLogout } from '../../hooks/useLogout'

const Topbar = () => {

  const { logout, isPending } = useLogout()
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const authContext = useContext(AuthContext);
  const userEmail = authContext.girisKullanici ? authContext.girisKullanici.email : null;

  const [personMenuAnchor, setPersonMenuAnchor] = useState(null);
  const [settingsMenuAnchor, setSettingsMenuAnchor] = useState(null);
  const [notificationsMenuAnchor, setNotificationsMenuAnchor] = useState(null);
  const [openProfileDialog, setOpenProfileDialog] = useState(false);
  const [userData, setUserData] = useState(null);
  const [newUserData, setNewUserData] = useState({
    ad: "",
    firma: "",
    adres: "",
    tel: "",
  });

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleUserDataChange = (field, value) => {
    setNewUserData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleCloseProfileDialog = () => {
    setOpenProfileDialog(false);
  };

  const openPersonMenu = (event) => {
    setPersonMenuAnchor(event.currentTarget);
  };

  const closePersonMenu = () => {
    setPersonMenuAnchor(null);
  };

  const openSettingsMenu = (event) => {
    setSettingsMenuAnchor(event.currentTarget);
  };

  const closeSettingsMenu = () => {
    setSettingsMenuAnchor(null);
  };

  const openNotificationsMenu = (event) => {
    setNotificationsMenuAnchor(event.currentTarget);
  };

  const closeNotificationsMenu = () => {
    setNotificationsMenuAnchor(null);
  };

  const handleProfileEdit = async () => {
    try {
      const userData = await getFirmaById(auth.currentUser.uid);
      setUserData(userData);
      setNewUserData(userData);
      setOpenProfileDialog(true);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
    closePersonMenu();
  };

  const handleSaveProfile = async () => {
    if (newUserData.ad.trim() === "" || newUserData.ad.length > 30) {
      setSnackbarMessage("Adı boş bırakamazsınız ve en fazla 30 karakter olmalıdır.");
      setSnackbarOpen(true);
      return;
    }

    if (newUserData.adres.length > 100) {
      setSnackbarMessage("Adres en fazla 100 karakter olmalıdır.");
      setSnackbarOpen(true);
      return;
    }

    if (!/^\d+$/.test(newUserData.tel)) {
      setSnackbarMessage("Telefon numarası sadece sayılardan oluşmalıdır.");
      setSnackbarOpen(true);
      return;
    }

    try {
      const userDocRef = doc(collection(db, "suruculer"), auth.currentUser.uid);
      await updateDoc(userDocRef, newUserData);

      authContext.updateFirmaData(newUserData);

      setOpenProfileDialog(false);
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };

  const handleSignOut = () => {
    auth.signOut();
    closePersonMenu();
  };

  return (
    <Box display="flex" justifyContent="space-between" p={2}>
      {/* SEARCH BAR */}
      <Box display="flex" backgroundColor={colors.primary[400]} borderRadius="3px">
        <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Search" />
        <IconButton type="button" sx={{ p: 1 }}>
          <SearchIcon />
        </IconButton>
      </Box>

      {/* ICONS */}
      <Box display="flex">
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            <DarkModeOutlinedIcon />
          ) : (
            <LightModeOutlinedIcon />
          )}
        </IconButton>
        <IconButton onClick={openNotificationsMenu}>
          <NotificationsOutlinedIcon />
        </IconButton>
        <IconButton onClick={openSettingsMenu}>
          <SettingsOutlinedIcon />
        </IconButton>
        <IconButton onClick={handleProfileEdit}>
          <PersonOutlinedIcon />
        </IconButton>
        <IconButton onClick={logout}>
          <LogoutIcon />
        </IconButton>
      </Box>

      {/* Person Menu */}
      <Menu
        anchorEl={personMenuAnchor}
        open={Boolean(personMenuAnchor)}
        onClose={closePersonMenu}
      >
        <MenuItem onClick={handleProfileEdit}>Profil</MenuItem>
        <MenuItem onClick={handleSignOut}>Çıkış Yap</MenuItem>
      </Menu>

      {/* Settings Menu */}
      <Menu
        anchorEl={settingsMenuAnchor}
        open={Boolean(settingsMenuAnchor)}
        onClose={closeSettingsMenu}
      >
        <MenuItem onClick={closeSettingsMenu}>Genel</MenuItem>
        <MenuItem onClick={closeSettingsMenu}>Gizlilik</MenuItem>
      </Menu>

      {/* Notifications Menu */}
      <Menu
        anchorEl={notificationsMenuAnchor}
        open={Boolean(notificationsMenuAnchor)}
        onClose={closeNotificationsMenu}
      >
        <MenuItem onClick={closeNotificationsMenu}>Bildirim 1</MenuItem>
        <MenuItem onClick={closeNotificationsMenu}>Bildirim 2</MenuItem>
      </Menu>

      {/* Profile Edit Dialog */}
      <Dialog open={openProfileDialog} onClose={handleCloseProfileDialog}>
        <DialogTitle>Profil Düzenle</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Profil bilgilerinizi düzenleyebilirsiniz.
          </DialogContentText>
          <TextField
            margin="dense"
            label="Ad"
            fullWidth
            value={newUserData.ad}
            onChange={(e) => handleUserDataChange("ad", e.target.value)}
          />
          <TextField
            margin="dense"
            label="Firma"
            fullWidth
            value={newUserData.firma}
            onChange={(e) => handleUserDataChange("firma", e.target.value)}
          />
          <TextField
            margin="dense"
            label="Adres"
            fullWidth
            value={newUserData.adres}
            onChange={(e) => handleUserDataChange("adres", e.target.value)}
            inputProps={{ maxLength: 100 }}
          />
          <TextField
            margin="dense"
            label="Telefon"
            fullWidth
            value={newUserData.tel}
            onChange={(e) => handleUserDataChange("tel", e.target.value)}
            inputProps={{ maxLength: 10 }}
          />
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" color="error" onClick={handleCloseProfileDialog}>İptal</Button>
          <Button variant="contained" color="success" onClick={handleSaveProfile}>Kaydet</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </Box>
  );
};

export default Topbar;
