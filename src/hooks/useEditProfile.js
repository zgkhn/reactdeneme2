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

  const editProfile = async (userbilgi, newThumbnail, data) => {
    setError(null);
    setIsPending(true);



    try {
      // Kullanıcının şifresini güncelle
      if (data && data.password) {
        const user = authInstance.currentUser;

        try {
          await signInWithEmailAndPassword(authInstance, userbilgi.email, data.eskiPassword);
          // Oturum açma işlemi başarılıysa parolayı güncelle
          await updatePassword(user, data.password);
          console.log("Parola güncellendi.");
        } catch (error) {
          // Oturum açma işlemi başarısız olduysa hata mesajını göster
          setPasswordError(true);
        }
      }
      // Eğer yeni bir thumbnail (resim) gönderildiyse, bunu güncelle
      if (newThumbnail) {
        try {
            console.log("newThumbnail: ", newThumbnail);
            const filePath = `thumbnails/${userbilgi.uid}/${newThumbnail.name}`;
            const storageRef = ref(storage, filePath);
            await uploadBytes(storageRef, newThumbnail);
    
            const imgUrl = await getDownloadURL(storageRef);
    
            const user = auth.currentUser;
            if (user) {
                await updateProfile(user, {
                    photoURL: imgUrl
                });
            }
    
            console.log("Güncelleme işlemi tamamlandı.");
            
            // Yüklenen resmin boyutunu küçültmek için burada gerekli işlemi yapabilirsiniz.
            // Örneğin, resmi yeniden boyutlandırabilir veya sıkıştırabilirsiniz.
            // Bu işlemler için birçok farklı JavaScript kütüphanesi bulunmaktadır.
            // Örnek olarak, 'sharp' veya 'imagemin' gibi kütüphaneleri kullanabilirsiniz.
            
            console.log("Resmin boyutu küçültüldü.");
        } catch (error) {
            console.error("Hata oluştu:", error);
        }
    }
    
      // Firebase Firestore'da kullanıcı verilerini güncelle
      if (data) {
        const docRef = doc(db, "user", userbilgi.uid);

        // Yalnızca data nesnesindeki password harici verileri güncellemek için bir kopya oluşturun
        const updatedData = { ...data };
        delete updatedData.password;
        delete updatedData.eskiPassword;

        await updateDoc(docRef, updatedData);
      }

      setIsPending(false);
      setError(null);
    } catch (error) {
      let errorMessage = "Bir hata oluştu. Lütfen tekrar deneyin."; // Default error message

      if (error.code === "auth/weak-password") {
        errorMessage = "Şifre zayıf, daha güçlü bir şifre deneyin.";
      }

      console.error(error.message);
      setError(errorMessage);
      setIsPending(false);
    }
  };

  return { error, isPending, editProfile, eskiPasswordError };
};
