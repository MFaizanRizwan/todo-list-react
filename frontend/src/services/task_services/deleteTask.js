import { doc, collection, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";

async function deleteTask(taskId) {
    try {
        const taskDocRef = doc(db, "tasks", taskId);
        await deleteDoc(taskDocRef);
        return true;
    } catch (error) {
        console.error("Error deleting task:", error);
        throw error;
    }
}

export { deleteTask };