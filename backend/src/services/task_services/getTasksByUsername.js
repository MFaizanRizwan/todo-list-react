import { db } from "../firebase-admin";

export const getTasksByUsername = async (username) => {
    try {
        const querySnapshot = await db.collection("tasks").where("author", "==", username).get();

        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error("Error fetching user tasks:", error);
        throw error;
    }
};