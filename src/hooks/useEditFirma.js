import { useState, useEffect } from "react";
import { auth, storage, db } from "../firebase/config";
import {
  getAuth,
  updatePassword,
  updateProfile,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { setDoc, doc, updateDoc } from "firebase/firestore";

export const useEditProfile = () => {
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const [eskiPasswordError, setPasswordError] = useState(false);
  const authInstance = getAuth();
  const [profilError, setProfilError] = useState({});
  const editProfile = async (userbilgi, data) => {


    setIsPending(true);
    setPasswordError(false);

    for (const prop in profilError) {
      delete profilError[prop];
    }
    const setError = (field, value) => {
      setProfilError((prevProfilError) => ({
        ...prevProfilError,
        [field]: value,
      }));
    };

    try {
      // Firebase Firestore'da kullanıcı verilerini güncelle
      if (data) {
        const docRef = doc(db, "firmalar", userbilgi.displayName);

        // Yalnızca data nesnesindeki password harici verileri güncellemek için bir kopya oluşturun
        const updatedData = { ...data };
      

        await updateDoc(docRef, updatedData);

              setError("success3","Güncellendi.");

      }

    } catch (error) {
      // Üçüncü if bloğunda genel bir hata meydana geldiyse burada işlemler yapabilirsiniz.

      setError("warning3"," Güncelleme gerçekleştirilemedi. ");
    }
    setIsPending(false);
  };






  

  return { profilError, isPending, editProfile, eskiPasswordError };
};
