
import {useState } from "react";
import {auth,db} from '../firebase/config';
import { signInWithEmailAndPassword } from "firebase/auth";
import {useAuthContext} from './useAuthContext'
import {doc,updateDoc} from 'firebase/firestore'

export const useLogin=()=>{

    const [error,setError]=useState(null)
    const [isPending,setIsPending]=useState(false)
    const {dispatch}=useAuthContext();



    const login=async (email,password)=>{

        setError(null)
        setIsPending(true)

        try {

            const res=await signInWithEmailAndPassword(auth,email,password)
            const {uid}=res.user;
            await updateDoc(doc(db,'suruculer',uid),{
                online:true
            }) 
        
            dispatch({type:'LOGIN',payload:res.user})

                setIsPending(false)
                setError(null)
            


            
            } catch (error) {
                console.error(error);
                setIsPending(false);
    
                // Firebase hata kodlarına göre özel hata mesajları oluşturun
                switch (error.code) {
                    case "auth/user-not-found":
                        setError("Kullanıcı bulunamadı. Lütfen geçerli bir e-posta adresi ve şifre girin.");
                        break;
                    case "auth/wrong-password":
                        setError("Yanlış şifre. Lütfen doğru şifreyi girin.");
                        break;
                    case "auth/invalid-email":
                        setError("Geçersiz e-posta adresi. Lütfen geçerli bir e-posta adresi girin.");
                        break;
                    default:
                        setError("Giriş yapılamadı. Lütfen daha sonra tekrar deneyin.");
                        break;
                }
            }
    }

const setDeger=async ()=>{

        setError(null)

    }

    return {login,error,isPending,setDeger}
}
