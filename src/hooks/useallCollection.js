import { useEffect, useState, useRef } from "react";
import { db } from "../firebase/config";
import { collection, onSnapshot, query, where, orderBy } from 'firebase/firestore'
import moment from 'moment';

export const useCollection = (collectionName, _q, _ob) => {
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState(null);
  const [documents, setDocuments] = useState([]);

  const q = useRef(_q).current;
  const ob = useRef(_ob).current;

  useEffect(() => {
    let ref = collection(db, collectionName);

    if (q) {
      ref = query(ref, where(...q));
    }

    if (ob) {
      ref = query(ref, orderBy(...ob));
    }

    const unsub = onSnapshot(ref, (snap) => {
      const dizi = [];
      snap.docs.forEach(doc => {
        const data = doc.data();
        const formattedDate = moment(data["e-yenileme-t"].toDate()).format('YYYY-MM-DD'); // Tarihi düzenle

        dizi.push({
          ...data,
          id: doc.id,
          email: data.email,
          tarih: formattedDate // Düzenlenmiş tarihi diziye ekle


        });
      });

      setDocuments(dizi);
      setError(null);
      setIsPending(false);
    }, (error) => {
      console.log(error.message);
      setError('Verilere Erişilemedi');
      setIsPending(false);
    });

    return () => unsub();
  }, [collectionName, q, ob]);

  return { isPending, error, documents };
};
