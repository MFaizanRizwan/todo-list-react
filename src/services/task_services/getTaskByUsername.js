import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export const getTasksByUser = async (username) => {
    try {
        const q = query(tasksCollection, where("author", "==", username));
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map(doc => ({
            firestoreId: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error("Error fetching user tasks:", error);
        throw error;
    }
};