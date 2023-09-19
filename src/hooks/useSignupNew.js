import { useState } from "react";
import { auth, storage, db } from '../firebase/config';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { setDoc, doc } from 'firebase/firestore';

export const useSignup = () => {
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);

  const signup = async (email, password, userName, thumbnail) => {
    setError(null);
    setIsPending(true);








    try {
      // createUserWithEmailAndPassword ile kullanıcı oluştur
      const responseNew = await 
      getAuth()
      .createUser({
        email: email,
        password: password,
      })





     

      // Giriş yapmadan kullanıcı bilgilerini güncelle
      await updateProfile(responseNew.userRecord, {
        displayName: userName.kod,
        photoURL: imgUrl,
      });

      const filePath = `thumbnails/${responseNew.userRecord.uid}/${thumbnail.name}`;
      const storageRef = ref(storage, filePath);
      await uploadBytes(storageRef, thumbnail);

      const imgUrl = await getDownloadURL(storageRef);

      // Firestore'da kullanıcı bilgilerini kaydet
      const docRef = doc(db, 'user', responseNew.userRecord.uid);
      await setDoc(docRef, {
        master: false,
        ad: userName.ad,
        tel: userName.tel,
        email: email,
        photoURL: imgUrl,
      });

      setIsPending(false);
      setError(null);
    } catch (error) {
      let errorMessage = 'Bir hata oluştu. Lütfen tekrar deneyin.'; // Varsayılan hata mesajı

      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Bu e-posta adresi zaten kullanılıyor.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Geçersiz e-posta adresi.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Şifre zayıf, daha güçlü bir şifre deneyin.';
      }

      console.error(error.message);
      setError(errorMessage);
      setIsPending(false);
    }
  };

  return { error, isPending, signup };
};
