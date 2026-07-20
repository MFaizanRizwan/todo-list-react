import { collection, doc, getDocs } from "firebase/firestore";
import { db } from "../firebase";

const tasksCollection = collection(db, "tasks");

export const getTasks = async () => {
    try {
        const snapshot = await getDocs(tasksCollection);

        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    }
    catch (error) {
        console.error("Error fetching user tasks:", error);
        throw error;
    }
}; 

