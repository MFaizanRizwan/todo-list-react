import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";

const tasksCollection = collection(db, "tasks");

export const getTasksByUser = async (username) => {
    try {
        const q = query(tasksCollection, where("author", "==", username));
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error("Error fetching user tasks:", error);
        throw error;
    }
};