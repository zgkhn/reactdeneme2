import React, { useState, useEffect ,useContext  } from "react";
import { AuthContext } from '../../contexts/AuthContext';
import { getFirmaById } from "../../firebase/veri";


import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../../theme";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import PieChartOutlineOutlinedIcon from "@mui/icons-material/PieChartOutlineOutlined";
import TimelineOutlinedIcon from "@mui/icons-material/TimelineOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import TimeToLeaveIcon from '@mui/icons-material/TimeToLeave';
import DepartureBoardOutlinedIcon from '@mui/icons-material/DepartureBoardOutlined';
import AirlineSeatReclineNormalOutlinedIcon from '@mui/icons-material/AirlineSeatReclineNormalOutlined';
import MedicalServicesOutlinedIcon from '@mui/icons-material/MedicalServicesOutlined';
import SpatialAudioOutlinedIcon from '@mui/icons-material/SpatialAudioOutlined';
import GppGoodOutlinedIcon from '@mui/icons-material/GppGoodOutlined';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useAuthContext } from '../../hooks/useAuthContext'

import { useDocument } from '../../hooks/useCollection'


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
  const {user} =useAuthContext();
  //const { document, error } = useDocument("suruculer", user.uid);


    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [selected, setSelected] = useState("dashboard");

    return (
      <Box
        sx={{
          "& .pro-sidebar-inner": {
            background: `${colors.primary[400]} !important`,
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
        <ProSidebar collapsed={isCollapsed}>
          <Menu iconShape="square">
            {/* LOGO AND MENU ICON */}
            <MenuItem
              onClick={() => setIsCollapsed(!isCollapsed)}
              icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
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
                    <MenuOutlinedIcon />
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







           </Typography>
                  <Typography variant="h5" color={colors.greenAccent[500]}>
                  {/* {error ? (<p>....</p>) : user ? (<p>{user.email}</p>) : (<p>...</p>)} */}

          </Typography>
                </Box>
              </Box>
            )}

            <Box paddingLeft={isCollapsed ? undefined : "8%"}>
              <Item
                title="Ana Sayfa"
                to="/"
                icon={<HomeOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />


              <Item
                title="Araçlar"
                to="/team"
                icon={<TimeToLeaveIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title="Kiralama Bilgileri"
                to="/contacts"
                icon={<DepartureBoardOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title="Sürücüler"
                to="/Suruculer"
                icon={<AirlineSeatReclineNormalOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />


              <Item
                title="Servis"
                to="/form"
                icon={<MedicalServicesOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title="Talepler"
                to="/calendar"
                icon={<SpatialAudioOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title="Sigorta"
                to="/faq"
                icon={<GppGoodOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />


              <Item
                title="Bar Chart"
                to="/bar"
                icon={<BarChartOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title="Pie Chart"
                to="/pie"
                icon={<PieChartOutlineOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title="Line Chart"
                to="/line"
                icon={<TimelineOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title="Geography Chart"
                to="/geography"
                icon={<MapOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
            </Box>
          </Menu>
        </ProSidebar>
      </Box>
    );
  };

  export default Sidebar;