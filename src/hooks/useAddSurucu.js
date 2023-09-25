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

export const useAddSurucu = () => {
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const [eskiPasswordError, setPasswordError] = useState(false);
  const authInstance = getAuth();
  const [profilError, setProfilError] = useState({});
  const addSurucu = async (userbilgi, croppedCanvas,arkaResim) => {


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
      // Eğer yeni bir thumbnail (resim) gönderildiyse, bunu güncelle
      if (croppedCanvas) { // croppedCanvas kullanılıyor
        try {
          // Saat ve tarih bilgisini alın
          const timestamp = new Date().toISOString();
          const filePath = `ehliyet/${userbilgi.id}/on/${timestamp}.jpg`; // Dosya adını saat ve tarih ile ayarlayın
          const storageRef = ref(storage, filePath);
          
          // croppedCanvas'ı bir veri URL'sine dönüştürün ve yükleyin
          const imgDataUrl = croppedCanvas.toDataURL("image/jpeg"); // Resmi JPEG formatında alın
          const imgBlob = await fetch(imgDataUrl).then((res) => res.blob());
          await uploadBytes(storageRef, imgBlob);
    
          const imgUrl = await getDownloadURL(storageRef);
    
          const docRef = doc(db, "user", userbilgi.id);
          if (docRef) {
            const updatedData = {
              ehliyetOnFoto: imgUrl
            };
            
            await updateDoc(docRef, updatedData);
    
            setError("success2", "RESİM YÜKLENDİ.");
    
            // Yüklenen resmin boyutunu küçültmek için burada gerekli işlemi yapabilirsiniz.
            // Örneğin, resmi yeniden boyutlandırabilir veya sıkıştırabilirsiniz.
            // Bu işlemler için birçok farklı JavaScript kütüphanesi bulunmaktadır.
            // Örnek olarak, 'sharp' veya 'imagemin' gibi kütüphaneleri kullanabilirsiniz.
          }
        } catch (error) {
          console.error("Hata oluştu:", error);
    
          setError("warning3", "Üzgünüz, resim yüklerken bir hata meydana geldi.");
        }
      }
    } catch (error) {
      // İkinci if bloğunda genel bir hata meydana geldiyse burada işlemler yapabilirsiniz.
    }
    

    try {
      // Eğer yeni bir thumbnail (resim) gönderildiyse, bunu güncelle
      if (arkaResim) { // croppedCanvas kullanılıyor
        try {
          // Saat ve tarih bilgisini alın
          const timestamp = new Date().toISOString();
          const filePath = `ehliyet/${userbilgi.id}/arka/${timestamp}.jpg`; // Dosya adını saat ve tarih ile ayarlayın
          const storageRef = ref(storage, filePath);
          
          // croppedCanvas'ı bir veri URL'sine dönüştürün ve yükleyin
          const imgDataUrl = arkaResim.toDataURL("image/jpeg"); // Resmi JPEG formatında alın
          const imgBlob = await fetch(imgDataUrl).then((res) => res.blob());
          await uploadBytes(storageRef, imgBlob);
    
          const imgUrl = await getDownloadURL(storageRef);
    
          const docRef = doc(db, "user", userbilgi.id);
          if (docRef) {
            const updatedData = {
              ehliyetArkaFoto: imgUrl
            };
            
            await updateDoc(docRef, updatedData);
    
            setError("success2", "RESİM YÜKLENDİ.");
    
            // Yüklenen resmin boyutunu küçültmek için burada gerekli işlemi yapabilirsiniz.
            // Örneğin, resmi yeniden boyutlandırabilir veya sıkıştırabilirsiniz.
            // Bu işlemler için birçok farklı JavaScript kütüphanesi bulunmaktadır.
            // Örnek olarak, 'sharp' veya 'imagemin' gibi kütüphaneleri kullanabilirsiniz.
          }
        } catch (error) {
          console.error("Hata oluştu:", error);
    
          setError("warning3", "Üzgünüz, resim yüklerken bir hata meydana geldi.");
        }
      }
    } catch (error) {
      // İkinci if bloğunda genel bir hata meydana geldiyse burada işlemler yapabilirsiniz.
    }
    


    try {
      // Firebase Firestore'da kullanıcı verilerini güncelle
      if (userbilgi) {
        const docRef = doc(db, "user", userbilgi.id);

        // Yalnızca data nesnesindeki password harici verileri güncellemek için bir kopya oluşturun
        const updatedData = { ...userbilgi };
      

        await updateDoc(docRef, updatedData);

              setError("success3","VERİLER GÜNCELLENDİ");

      }

    } catch (error) {
      // Üçüncü if bloğunda genel bir hata meydana geldiyse burada işlemler yapabilirsiniz.

      setError("warning3","VERİLER GÜNCELLENEMEDİ ");
    }
    setIsPending(false);
  };






  

  return { profilError, addSurucu, };
};
