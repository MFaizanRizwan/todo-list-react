import admin from 'firebase-admin';
/**
 * Each Object has
 * id: user.uid,
 * email: user.email,
 * role: 'user'
 */
async function getUsers() {
    let users = [];
    let nextPageToken;

    do {
        const result = await admin.auth().listUsers(1000, nextPageToken);
        
        const batch = result.users.map(user => ({
            id: user.uid,
            email: user.email,
            role: 'user' 
        }));
        
        users = users.concat(batch);
        nextPageToken = result.pageToken;
    } while (nextPageToken);

    return users;
}

export { getUsers };
