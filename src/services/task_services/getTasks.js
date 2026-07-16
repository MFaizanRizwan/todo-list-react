import { collection, doc, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export const getTasks = async () => {
    try {
        const snapshot = await getDocs(collection(db, "tasks"));

        return snapshot.docs.map(doc => ({
            firestoreId: doc.id,
            ...doc.data()
        }));
    }
    catch (error) {
        console.error("Error fetching user tasks:", error);
        throw error;
    }
}; 

