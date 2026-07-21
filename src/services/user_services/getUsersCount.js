import { collection, getCountFromServer } from "firebase/firestore";
import { db } from "../firebase";

async function getUsersCount() {
    const usersCollection = collection(db, "users");
    const snapshot = await getCountFromServer(usersCollection);
    return snapshot.data().count;
}

export { getUsersCount };
