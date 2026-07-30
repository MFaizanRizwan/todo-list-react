import admin from 'firebase-admin';

async function getUsersCount() {
  let count = 0;
  let nextPageToken;
  
  do {
    const result = await admin.auth().listUsers(1000, nextPageToken);
    count += result.users.length;
    nextPageToken = result.pageToken;
  } while (nextPageToken);

  return count;
}

export { getUsersCount };