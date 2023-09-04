import { collection, getDoc, doc, updateDoc } from "firebase/firestore"; // Doğru import yollarını kullanın
import { auth, db } from "./config"; // Doğru import yollarını kullanın

// Belirli bir ID'ye sahip firma kaydını çekmek için fonksiyon
export const getFirmaById = async (id) => {
  const firmaRef = doc(collection(db, "firmalar"), id);

  try {
    const firmaSnapshot = await getDoc(firmaRef);
    if (firmaSnapshot.exists()) {
      return { id: firmaSnapshot.id, ...firmaSnapshot.data() };
    } else {
      throw new Error("Belirtilen ID'ye sahip firma kaydı bulunamadı.");
    }
  } catch (error) {
    throw new Error("Firma verisi çekilirken bir hata oluştu: " + error.message);
  }
};
const handleSaveProfile = async () => {
  try {
    // Güncellenmiş verileri Firestore'a geri kaydetme
    const userDocRef = doc(collection(db, "firmalar"), auth.currentUser.uid);
    await updateDoc(userDocRef, newUserData);
    
    // Diyalog penceresini kapatma
    setOpenProfileDialog(false);
  } catch (error) {
    console.error("Error updating user data:", error);
  }
};