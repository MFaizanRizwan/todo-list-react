import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

export const getTaskById = async (taskId) => {
    try {
        const taskRef = doc(db, "tasks", taskId);
        const taskSnap = await getDoc(taskRef);

        if (!taskSnap.exists()) {
            return null;
        }

        return {
            id: taskSnap.id,
            ...taskSnap.data(),
        };
    } catch (error) {
        console.error("Error fetching task:", error);
        throw error;
    }
};