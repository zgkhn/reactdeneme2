
import {useState } from "react";
import {auth,db} from '../firebase/config';
import { signOut } from "firebase/auth";
import {useAuthContext} from './useAuthContext'
import {doc,updateDoc} from 'firebase/firestore'

export const useLogout=()=>{

    const [error,setError]=useState(null)
    const [isPending,setIsPending]=useState(false)
    const {dispatch,user}=useAuthContext();

    const logout=async ()=>{

        setError(null)
        setIsPending(true)

        try {

           

            await signOut(auth)

            dispatch({type:'LOGOUT'})

                setIsPending(false)
                setError(null)
            


            
        } catch (error) {

                console.log(error);
                setError(error.message)
                setIsPending(false)
        }
    }



    return {logout,error,isPending}
}
