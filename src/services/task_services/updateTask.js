import { collection, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

export const updatetask = async (targetkId, taskData) => {
    try {
        const taskDocRef = doc(db, "tasks", targetkId);
        await updateDoc(taskDocRef, taskData);
        return true;
    } catch (error) {
        console.error("Error updating task:", error);
        return false;
    }
};