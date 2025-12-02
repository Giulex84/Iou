import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBRVPegtzpLGN6fCuEt733q0HO6epMZJI",
  authDomain: "iou-ledger-pro.firebaseapp.com",
  projectId: "iou-ledger-pro",
  storageBucket: "iou-ledger-pro.firebasestorage.app",
  messagingSenderId: "825802608152",
  appId: "1:825802608152:web:10c18634f3ff7e2268c84d"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
export const db = getFirestore(app);
