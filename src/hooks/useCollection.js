import { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { doc, getDoc } from 'firebase/firestore';

export const useDocument = (koleksiyon, id) => {
    const [document, setDocument] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const docRef = doc(db, koleksiyon, id);

        const getDocument = async () => {
            try {
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setDocument({ ...docSnap.data(), id: docSnap.id });
                    setError(null);
                } else {
                    setError("Belge bulunamadı");
                }
            } catch (error) {
                console.error(error);
                setError("Verilere erişilemedi");
            }
        };

        getDocument();

        return () => {
            // Cleanup işlemleri burada yapılabilir.
        };
    }, [koleksiyon, id]);

    return { document, error };
};
