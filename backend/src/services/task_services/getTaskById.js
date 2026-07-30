import { db } from "../firebase-admin";

export const getTaskById = async (taskId) => {
    try {
        const taskSnap = await db.collection("tasks").doc(taskId).get();

        if (!taskSnap.exists) {
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