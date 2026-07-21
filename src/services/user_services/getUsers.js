import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

/**
 * Each object contains: id, email, role
 */
async function getUsers() {
    const snapshot = await getDocs(collection(db, "users"));
    const users = [];
    snapshot.forEach((doc) => {
        users.push({ id: doc.id, ...doc.data() });
    });
    return users;
}

export { getUsers };
