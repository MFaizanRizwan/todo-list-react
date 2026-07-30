import { db } from "../firebase-admin";

async function deleteTask(taskId) {
    try {
        await db.collection("tasks").doc(taskId).delete();
        return true;
    } catch (error) {
        console.error("Error deleting task:", error);
        throw error;
    }
}

export { deleteTask };