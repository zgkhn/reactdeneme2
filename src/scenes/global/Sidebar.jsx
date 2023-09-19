import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from '../../contexts/AuthContext';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';


import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../../theme";
import * as MuiIcons from "@mui/icons-material";

import { signInWithEmailAndPassword } from 'firebase/auth';
import { useAuthContext } from '../../hooks/useAuthContext'

import { useDocument, useAllVeri } from '../../hooks/useCollection'


const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);



  return (
    <MenuItem
      active={selected === title}
      style={{
        color: colors.grey[100],
      }}
      onClick={() => setSelected(title)}
      icon={icon}
    >
      <Typography>{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
};
const Sidebar = () => {
  const { user } = useAuthContext();
  const { document, error } = useDocument("user", user.uid);

  const { documents: menuItems, error: errore } = useAllVeri("sidebar");


  console.log("menuItems : ", menuItems)


  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("dashboard");
  // Veri yüklenene kadar yükleme göster
  if (document === null) {
    return <p>Veri yükleniyor...</p>;
  }

  // Hata durumunu ele al
  if (error) {
    return <p>Hata oluştu: {error.message}</p>;
  }
  return (
    <Box
      sx={{
        "& .pro-sidebar-inner": {
          background: `${colors.primary[400]} !important`,
          minHeight: "100vh", // Ensures it fills the viewport height
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
        },
        "& .pro-inner-item:hover": {
          color: "#868dfb !important",

        },
        "& .pro-menu-item.active": {
          color: "#6870fa !important",

        },

      }}
    >
      <ProSidebar collapsed={isCollapsed}   >
        <Menu iconShape="square" >
          {/* LOGO AND MENU ICON */}
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MuiIcons.MenuOutlined /> : undefined}
            style={{
              margin: "10px 0 20px 0",
              color: colors.grey[100],
            }}
          >
            {!isCollapsed && (
              <Box

                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                <Typography variant="h3" color={colors.grey[100]}>


                  Araç Takip

                </Typography>
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MuiIcons.MenuOutlined />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          {!isCollapsed && (
            <Box mb="25px">
              {/* <Box display="flex" justifyContent="center" alignItems="center">
                  <img
                    alt="profile-user"
                    width="100px"
                    height="100px"
                    src={`../../assets/logo192.png`}
                    style={{ cursor: "pointer", borderRadius: "50%" }}
                  />
                </Box> */}
              <Box textAlign="center">
                <Typography
                  variant="h4"
                  color={colors.grey[100]}
                  fontWeight="bold"
                  sx={{ m: "10px 0 0 0" }}
                >
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Avatar
                      alt={user.email}
                      src={document.photoURL}
                      sx={{ width: 70, height: 70 }}
                    />
                  </div>
                  <table border="0" cellSpacing="0" cellPadding="0" height="0">

                  </table>
                  {document.ad}


                </Typography >
                <Typography variant="h5" color={colors.greenAccent[500]} style={{
                  margin: "10px 0 10px 0",


                }}>
                  {/* {error ? (<p>....</p>) : user ? (<p>{user.email}</p>) : (<p>...</p>)} */}
                  {user.email}
                  <br></br>
                  {user.displayName}
                </Typography>
              </Box>
            </Box>
          )}

          <Box paddingLeft={isCollapsed ? undefined : "8%"}>






          {menuItems
  .sort((a, b) => a.sira - b.sira) // sıra numarasına göre sırala
  .map((menuItem) => {
    const SelectedIcon = MuiIcons[menuItem.icon]; // Simgeyi seçin
    return (
      <Item
        key={menuItem.id}
        title={menuItem.title}
        to={menuItem.to}
        icon={SelectedIcon && <SelectedIcon />} // Simgeyi JSX içinde kullanın
        selected={selected}
        setSelected={setSelected}
      />
    );
  })}






          </Box>
          <Box  >

          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;