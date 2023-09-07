import { createContext, useEffect, useReducer } from "react";
import { auth } from '../firebase/config';
import { onAuthStateChanged, signOut } from 'firebase/auth';

export const AuthContext = createContext();

export const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, user: action.payload };
    case 'LOGOUT':
      return { ...state, user: null, authIsReady: false };
    case 'AUTH_IS_READY':
      return { ...state, user: action.payload, authIsReady: true };
    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    authIsReady: false,
  });

  useEffect(() => {
    let timeoutId;

    const startLogoutTimer = () => {
      timeoutId = setTimeout(() => {
        // 5 dakika boyunca çevrimdışı kalındığında oturumu kapat
        signOut(auth)
          .then(() => {
            dispatch({ type: 'LOGOUT' });
          })
          .catch((error) => {
            console.error('Oturumu kapatma hatası:', error);
          });
      }, 60 * 60 * 1000); // 5 dakika (5 * 60 * 1000 milisaniye)
    };

    const stopLogoutTimer = () => {
      // Süreleyiciyi temizle
      clearTimeout(timeoutId);
    };

    const unsub = onAuthStateChanged(auth, (user) => {
      dispatch({ type: 'AUTH_IS_READY', payload: user });
      if (user) {
        startLogoutTimer();
      } else {
        stopLogoutTimer();
      }
    });

    // Komponent unmount edildiğinde süreleyiciyi temizle
    return () => {
      unsub();
      stopLogoutTimer();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
