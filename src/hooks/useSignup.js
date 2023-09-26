
import { useState,useEffect } from "react"
import {auth,storage,db} from '../firebase/config'
import {createUserWithEmailAndPassword,updateProfile } from 'firebase/auth'
import {useAuthContext} from './useAuthContext'
import { ref,uploadBytes,getDownloadURL   } from "firebase/storage";
import {setDoc,doc} from 'firebase/firestore'

export const useSignup=()=>{

    const [error,setError]=useState(null)
    const [isPending,setIsPending]=useState(false)
    const {dispatch}=useAuthContext();
    const setDegerSingup= () =>{
        setError(null)
 

    }
    const signup = async (email, password, userName, thumbnail) => {
        setError(null);
        setIsPending(true);
      
        try {
          const response = await createUserWithEmailAndPassword(auth, email, password);
          console.log(response.user);
      
          if (!response) {
            throw new Error('Üyelik işlemi gerçekleşemedi');
          }
      
          // Upload thumbnail and update profile
          const filePath = `thumbnails/${response.user.uid}/${thumbnail.name}`;
          const storageRef = ref(storage, filePath);
          await uploadBytes(storageRef, thumbnail);
          const imgUrl = await getDownloadURL(storageRef);
          await updateProfile(response.user, {
            displayName: userName.kod,
            photoURL: imgUrl,
          });
      
          // Create user document in Firestore
          const docRef = doc(db, 'user', response.user.uid);
          await setDoc(docRef, {
            master: false,
            departman: userName.departman,
            ad: userName.ad,
            firmakod: userName.kod,
            tel: userName.tel,
            email: email,
            photoURL: imgUrl,
          });
      
          dispatch({ type: 'LOGIN', payload: response.user });
      
          setIsPending(false);
          setError(null);
        } catch (error) {
          // Handle Firebase authentication errors
          let errorMessage = 'Bir hata oluştu. Lütfen tekrar deneyin.';
          if (error.code === 'auth/email-already-in-use') {
            errorMessage = 'Bu e-posta adresi zaten kullanılıyor. Lütfen farklı bir e-posta adresi kullanın.';
          } else if (error.code === 'auth/invalid-email') {
            errorMessage = 'Geçersiz e-posta adresi. Lütfen geçerli bir e-posta adresi girin.';
          } else if (error.code === 'auth/weak-password') {
            errorMessage = 'Şifre zayıf. Lütfen daha güçlü bir şifre kullanın.';
          }
      
          console.error(error.message);
          setError(errorMessage);
          setIsPending(false);
        }
      };
      


   

    return {error,isPending,signup,setDegerSingup}

}