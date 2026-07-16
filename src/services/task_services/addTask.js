import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";

export const addTask = async (taskData) => {
    try {
        const docRef = await addDoc(tasksCollection, taskData);
        return docRef.id;
    } catch (error) {
        console.error("Error adding task:", error);
        throw error;
    }
};
