import { useState, useEffect } from "react";
import { auth, storage, db } from "../firebase/config";
import {
  getAuth,
  updatePassword,
  updateProfile,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getFirestore, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { v4 as uuidv4 } from 'uuid';

export const useAddDosya = () => {
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const [eskiPasswordError, setPasswordError] = useState(false);
  const authInstance = getAuth();
  const [profilError, setProfilError] = useState({});
  const addDosya = async (userbilgi, croppedCanvas,gelenIdDeger,userVeri) => {


    setIsPending(true);

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
      if (croppedCanvas) {
        const randomId = uuidv4();
        console.log("userbilgi: ", userbilgi);
        console.log("croppedCanvas: ", croppedCanvas);

        const filePath = `Dosya/${userVeri}/${gelenIdDeger}/${randomId}/${croppedCanvas.path}`;
        const storageRef = ref(storage, filePath);
        await uploadBytes(storageRef, croppedCanvas);
    
        const imgUrl = await getDownloadURL(storageRef);

    
    


        const docRef = doc(db, "user/"+gelenIdDeger+"/dosya", randomId);
        await setDoc(docRef, {
          dosyaURL: imgUrl,
          dosyaP: filePath,
          ...userbilgi
        });
  


  
    
        setError("success2", "RESİM YÜKLENDİ.");
        setIsPending(false);
        // Yüklenen resmin boyutunu küçültmek için burada gerekli işlemi yapabilirsiniz.
        // Örneğin, resmi yeniden boyutlandırabilir veya sıkıştırabilirsiniz.
        // Bu işlemler için birçok farklı JavaScript kütüphanesi bulunmaktadır.
        // Örnek olarak, 'sharp' veya 'imagemin' gibi kütüphaneleri kullanabilirsiniz.
      }
    } catch (error) {
      console.error("Hata oluştu:", error);
      setError("warning3", "Üzgünüz, resim yüklerken bir hata meydana geldi.");
    }
    
    
  };






  

  return { isPending, profilError, addDosya, };
};
