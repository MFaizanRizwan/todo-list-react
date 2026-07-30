import { db } from "../firebase-admin";

async function addTask(taskData) {
    const taskRef = await db.collection("tasks").add(taskData);
    return taskRef.id;
}

export { addTask };