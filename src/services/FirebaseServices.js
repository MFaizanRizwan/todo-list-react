import { db } from "./firebase";
import {
    collection,
    addDoc,
    getDocs,
    doc,
    updateDoc,
    deleteDoc,
    query,
    where
} from "firebase/firestore";

// Reference to your 'tasks' collection
const tasksCollection = collection(db, "tasks");

/**
 * ➕ CREATE: Adds a new task to Firestore
 * @param {Object} taskData - The complete task object from your form
 */
export const addTask = async (taskData) => {
    try {
        // Firestore generates a unique hash string ID automatically
        const docRef = await addDoc(tasksCollection, taskData);
        return docRef.id;
    } catch (error) {
        console.error("Error adding task:", error);
        throw error;
    }
};

/**
 * 🔍 READ: Fetches all tasks matching a specific author's username
 * @param {string} username - The unique username string (your 'author' field)
 */
export const getTasksByUser = async (username) => {
    try {
        const q = query(tasksCollection, where("author", "==", username));
        const querySnapshot = await getDocs(q);

        // Maps Firestore documents back into your exact array format
        return querySnapshot.docs.map(doc => ({
            firestoreId: doc.id, // Keeping tracking of Firestore's internal ID
            ...doc.data()
        }));
    } catch (error) {
        console.error("Error fetching user tasks:", error);
        throw error;
    }
};

/**
 * ✏️ UPDATE: Overwrites or updates a specific task's data
 * @param {string} targetId - The unique Firestore Document ID (docRef.id)
 * @param {Object} updatedFields - The fields you want to update (e.g., { taskProgress: "100" })
 */
export const updateTask = async (targetId, updatedFields) => {
    try {
        const taskDocRef = doc(db, "tasks", targetId);
        await updateDoc(taskDocRef, updatedFields);
        return true;
    } catch (error) {
        console.error("Error updating task:", error);
        throw error;
    }
};

/**
 * ❌ DELETE: Removes a task completely from the database
 * @param {string} taskId - The unique Firestore Document ID to delete
 */
export const deleteTask = async (taskId) => {
    try {
        const taskDocRef = doc(db, "tasks", taskId);
        await deleteDoc(taskDocRef);
        return true;
    } catch (error) {
        console.error("Error deleting task:", error);
        throw error;
    }
};
