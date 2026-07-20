import { collection, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

async function updateTask(targetId, taskData) {
    try {
        const taskDocRef = doc(db, "tasks", targetId);
        await updateDoc(taskDocRef, taskData);
        return true;
    } catch (error) {
        console.error("Error updating task:", error);
        return false;
    }
}

export { updateTask };