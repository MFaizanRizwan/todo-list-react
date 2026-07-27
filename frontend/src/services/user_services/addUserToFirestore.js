import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

/**
 * Creates or updates the user document in the `users` Firestore collection.
 * Only stores email and role — never the password.
 *
 * @param {string} uid  - Firebase Auth UID (used as the document ID)
 * @param {string} email - User's email address
 * @param {string} role  - "user" or "admin"
 */
async function addUserToFirestore(uid, email, role) {
    const userRef = doc(db, "users", uid);
    const existing = await getDoc(userRef);

    if (!existing.exists()) {
        await setDoc(userRef, { email, role });
    }
}

export { addUserToFirestore };
