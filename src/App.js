import React, { useState, useContext, useEffect } from 'react';
import { Box } from "@mui/material";
import Team from "./scenes/team";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import { Routes, Route, Navigate } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import Contacts from "./scenes/contacts";
import Suruculer from "./scenes/suruculer";
import Form from "./scenes/form";
import Calendar from "./scenes/calendar";
import FAQ from "./scenes/faq";
import Bar from "./scenes/bar";
import Pie from "./scenes/Pie";
import Line from "./scenes/line";
import Geography from "./scenes/geography";
import Main from "./scenes/main";
import Login from './scenes/login'; // useLogin yerine Login olarak değiştirin
import { AuthContext } from "./contexts/AuthContext";
import LinearProgress from '@mui/material/LinearProgress';
const styles = {
  containerr: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#1f2a40',
    padding: '0 25%',
  },
};
function Loading() {
  return (
    <div style={styles.containerr}>
    <Box sx={{ width: '100%' }}>
      <LinearProgress />
    </Box>
  </div>
  );
}

function App() {
  const { user, authIsReady } = useContext(AuthContext); // Değişiklik 1: 'girisKullanici' değişkenini 'user' olarak güncellendi
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  const [loading, setLoading] = useState(true);
console.log(user)
  useEffect(() => {
    if (authIsReady) { // Değişiklik 2: Kullanıcı oturumu durumu hazır olduğunda kontrol yapılacak
      setLoading(false);
    }
  }, [authIsReady]); // Değişiklik 3: authIsReady bağımlılığı eklendi

  if (loading) {
    return <Loading />;
  }

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <main className="content" style={{ display: "flex" }}>
            {user && <Sidebar isSidebar={isSidebar} />} {/* Değişiklik 4: 'girisKullanici' 'user' olarak güncellendi */}
            <Box flexGrow={1}>
              {user && <Topbar setIsSidebar={setIsSidebar} />} {/* Değişiklik 5: 'girisKullanici' 'user' olarak güncellendi */}
              
              <Routes>
              <Route path="/" element={ user ? <Dashboard /> : <Navigate to="/login" />}/>
<Route path="/login" element={ !user ? <Login /> : <Navigate to="/" />}/>

                {user && ( // Kullanıcı giriş yapmışsa aşağıdaki rotaları göster
                  <>
                    <Route path="/team" element={<Team />} />
                    <Route path="/contacts" element={<Contacts />} />
                    <Route path="/Suruculer" element={<Suruculer />} />
                    <Route path="/form" element={<Form />} />
                    <Route path="/calendar" element={<Calendar />} />
                    <Route path="/faq" element={<FAQ />} />
                    <Route path="/bar" element={<Bar />} />
                    <Route path="/pie" element={<Pie />} />
                    <Route path="/line" element={<Line />} />
                    <Route path="/geography" element={<Geography />} />
                  </>
                )}
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </Box>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
