// firebase-setup.js
import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc, updateDoc, onSnapshot, arrayUnion } from "firebase/firestore";

export const firebaseConfig = {
  apiKey: "AIzaSyCCS8gPi8AviBNsIhLj8vyZfkA6ucergtY",
  authDomain: "film-takip-uygulamasi-7262e.firebaseapp.com",
  projectId: "film-takip-uygulamasi-7262e",
  storageBucket: "film-takip-uygulamasi-7262e.firebasestorage.app",
  messagingSenderId: "696428460167",
  appId: "1:696428460167:web:a81bb18a70cdaa1d4ba022",
  measurementId: "G-XFMBZYBPM2"
};

export const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export function listeOlustur(kullaniciAdi) {
  return setDoc(doc(db, "listeler", kullaniciAdi), { filmler: [] }, { merge: true });
}

export function filmeEkle(kullaniciAdi, film) {
  const docRef = doc(db, "listeler", kullaniciAdi);
  return updateDoc(docRef, {
    filmler: arrayUnion(film)
  });
}

export function listeGetir(kullaniciAdi, callback) {
  const docRef = doc(db, "listeler", kullaniciAdi);
  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data().filmler);
    }
  });
}
