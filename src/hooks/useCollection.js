import { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { doc, onSnapshot , collection, getDocs } from 'firebase/firestore';

export const useDocument = (koleksiyon, id) => {
    const [document, setDocument] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const docRef = doc(db, koleksiyon, id);

        // Firestore belgesinin anlık güncellemelerini izle
        const unsubscribe = onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists()) {
                setDocument({ ...docSnap.data(), id: docSnap.id });
                setError(null);
            } else {
                setError("Belge bulunamadı");
            }
        }, (err) => {
            console.error(err);
            setError("Verilere erişilemedi");
        });

        return () => {
            // Temizleme işlemi: dinleme işlemi sonlandırılır
            unsubscribe();
        };
    }, [koleksiyon, id]);

    return { document, error };
};


export const useAllVeri = (koleksiyon) => {
    const [documents, setDocuments] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const koleksiyonRef = collection(db, koleksiyon);

        // onSnapshot ile koleksiyon değişikliklerini dinle
        const unsubscribe = onSnapshot(koleksiyonRef, (koleksiyonSnap) => {
            const koleksiyonData = koleksiyonSnap.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
            }));
            setDocuments(koleksiyonData);
            setError(null);
        }, (error) => {
            console.error(error);
            setError("Verilere erişilemedi");
        });

        // Temizlik fonksiyonunu döndürün
        return () => {
            // Abonelikten çıkın (componentWillUnmount mantığı)
            unsubscribe();
        };
    }, [koleksiyon]);


    return { documents, error };
};
