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
  const editProfile = async (userbilgi, newThumbnail, data, pdata) => {


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
      // Kullanıcının şifresini güncelle
      if (pdata.password) {
        const user = authInstance.currentUser;

        try {
          await signInWithEmailAndPassword(authInstance, userbilgi.email, pdata.eskiPassword);
          // Oturum açma işlemi başarılıysa parolayı güncelle
          await updatePassword(user, pdata.password);

          setError("success1","ŞİFRE DOĞRU");

        } catch (error) {
          // Oturum açma işlemi başarısız olduysa hata mesajını göster
          setPasswordError(true);
          setError("warning3","Eski şifreniz geçersizdir.");
        }
      }
    } catch (error) {
      // İlk if bloğunda genel bir hata meydana geldiyse burada işlemler yapabilirsiniz.
    }

    try {
      // Eğer yeni bir thumbnail (resim) gönderildiyse, bunu güncelle
      if (newThumbnail) {
        try {
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
          setError("success2","RESİM YÜKLENDİ.");

          // Yüklenen resmin boyutunu küçültmek için burada gerekli işlemi yapabilirsiniz.
          // Örneğin, resmi yeniden boyutlandırabilir veya sıkıştırabilirsiniz.
          // Bu işlemler için birçok farklı JavaScript kütüphanesi bulunmaktadır.
          // Örnek olarak, 'sharp' veya 'imagemin' gibi kütüphaneleri kullanabilirsiniz.
        } catch (error) {
          console.error("Hata oluştu:", error);

          setError("warning3","Üzgünüz, resim yüklerken bir hata meydana geldi.");
        }
      }
    } catch (error) {
      // İkinci if bloğunda genel bir hata meydana geldiyse burada işlemler yapabilirsiniz.
    }

    try {
      // Firebase Firestore'da kullanıcı verilerini güncelle
      if (data) {
        const docRef = doc(db, "user", userbilgi.uid);

        // Yalnızca data nesnesindeki password harici verileri güncellemek için bir kopya oluşturun
        const updatedData = { ...data };
      

        await updateDoc(docRef, updatedData);

              setError("success3","VERİLER GÜNCELLENDİ");

      }

    } catch (error) {
      // Üçüncü if bloğunda genel bir hata meydana geldiyse burada işlemler yapabilirsiniz.

      setError("warning3","VERİLER GÜNCELLENEMEDİ ");
    }
    setIsPending(false);
  };






  

  return { profilError, isPending, editProfile, };
};
