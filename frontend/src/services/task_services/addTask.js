import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase";

const tasksCollection = collection(db, "tasks");

async function addTask(taskData) {
    const docRef = await addDoc(tasksCollection, taskData);
    return docRef.id;
}

export { addTask };