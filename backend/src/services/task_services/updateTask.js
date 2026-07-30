import { db } from "../firebase-admin";

async function updateTask(targetId, taskData) {
    try {
        await db.collection("tasks").doc(targetId).update(taskData);
        return true;
    } catch (error) {
        console.error("Error updating task:", error);
        return false;
    }
}

export { updateTask };