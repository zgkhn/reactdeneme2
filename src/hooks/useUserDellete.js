import { useState ,useEffect } from "react";
import { auth, db } from "../firebase/config";

export const useUserDelete = () => {
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);

  const deleteUser = async (userUID) => {
    setIsPending(true);
    setError(null);
    console.log("log : ", userUID);

    try {
      // Authentication verilerini sil
      await auth.deleteUser(userUID);
      console.log("Authentication verileri silindi.");
  
      // Firestore'da kullanıcı verilerini sil
      await db.collection("users").doc(userUID).delete();
      console.log("User verileri silindi.");
  
      setIsPending(false);
    } catch (error) {
      console.error("Veriler silinirken bir hata oluştu:", error.message);
      setError("Kullanıcı silinirken bir hata oluştu.");
      setIsPending(false);
    }
  };

  return { isPending, deleteUser, error };
};
