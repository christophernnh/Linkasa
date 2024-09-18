// DataService.js
import { onSnapshot, collection } from "firebase/firestore";
import { db } from "../../../firebase/firebase";

class DataService {
  constructor(collectionName) {
    this.collectionName = collectionName;
  }

  fetchData(callback) {
    return onSnapshot(collection(db, this.collectionName), (snapshot) => {
      const data = snapshot.docs.map((doc) => {
        const docData = doc.data();
        return { id: doc.id, ...docData };
      });
      callback(data);
    });
  }
}

export default DataService;
