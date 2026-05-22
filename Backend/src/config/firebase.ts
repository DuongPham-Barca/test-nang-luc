import admin from "firebase-admin";
import serviceAccount from "../..//firsebase.json";


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

const db = admin.firestore();

export { db };