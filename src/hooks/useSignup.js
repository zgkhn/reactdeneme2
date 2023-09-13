
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
    const signup=async (email,password,userName,thumbnail)=>{
        setError(null)
        setIsPending(true)

        try {

            const response=await createUserWithEmailAndPassword(auth,email,password)
            console.log(response.user);

            if(!response){
                throw new Error('Üyelik işlemi gerçekleşemedi')
            }
            const filePath=`thumbnails/${response.user.uid}/${thumbnail.name}`
            const storageRef = ref(storage,filePath);
            await uploadBytes(storageRef,thumbnail);
            
            const imgUrl=await getDownloadURL(storageRef)
    
            updateProfile(response.user,{
                displayName:userName.kod,
                photoURL:imgUrl,


            })
            
            const docRef=doc(db,'user',response.user.uid)
            await setDoc(docRef,{
                master:false,
                departman:userName.departman,
                ad:userName.ad,
                firmakod:userName.kod,
                tel:userName.tel,
                email:email

            })

        

            dispatch({type:'LOGIN',payload:response.user})


                setIsPending(false)
                setError(null)
            
            } catch (error) {
                let errorMessage = 'Bir hata oluştu. Lütfen tekrar deneyin.'; // Default error message
            
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


    }


   

    return {error,isPending,signup,setDegerSingup}

}