import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";

export const addTask = async (task) => {
  const docRef = await addDoc(collection(db, "tasks"), task);
  return docRef.id;
};