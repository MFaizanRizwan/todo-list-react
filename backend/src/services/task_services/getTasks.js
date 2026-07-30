import { db } from "../firebase-admin";

export const getTasks = async () => {
    try {
        const snapshot = await db.collection("tasks").get();

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

