// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  query,
  setDoc,
  limit,
  orderBy,
} from "firebase/firestore";
import {
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  collection,
} from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAJlcaGcEr2zh2qV68fZaE_RMdWN9bVvQA",
  authDomain: "private-project-jonas.firebaseapp.com",
  projectId: "private-project-jonas",
  storageBucket: "private-project-jonas.appspot.com",
  messagingSenderId: "182989186847",
  appId: "1:182989186847:web:5a4ee26b1351241432722a",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const addValue = async (list, value) => {
  // if (value.temperature > main.temperature - 6) {
  // console.log(list, value)
  await setDoc(doc(db, list, value.timestamp.toString()), value);
  // setValue("main", "test", {temperature: value.temperature});
  // }
};

export const setValue = async (collection, key, value) => {
  const ref = doc(db, collection, key);

  // Set the "capital" field of the city 'DC'
  await updateDoc(ref, value);
};

export const getValue = async (collection, key) => {
  const docRef = doc(db, collection, key);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    // console.log("Document data:", docSnap.data());
    return docSnap.data();
  } else {
    // docSnap.data() will be undefined in this case
    // console.log("No such document!");
    return "nope";
  }
};

export const getAll = async (list, size) => {
  const q = query(
    collection(db, list),
    orderBy("timestamp", "desc"),
    limit(size || 75)
  );
  const querySnapshot = await getDocs(q);
  const data = [];
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    // console.log(doc.id, " => ", doc.data());
    data.push(doc.data());
  });
  // Sort by timestamp
  data.sort((a, b) => {
    return a.timestamp - b.timestamp;
  });
  // console.log(data);
  return data;
};

export const getAggregation = async (list, size, frame) => {
  const coll = collection(db, "tempeprature_log");
  const snapshot = await getAggregateFromServer(coll, {
    averagePopulation: average("temperature"),
  });

  console.log("averagePopulation: ", snapshot.data().averagePopulation);

  // const q = query(collection(db, list), orderBy("timestamp", "desc"), limit(size || 75));
  // const querySnapshot = await getDocs(q);
  // const data = [];
  // querySnapshot.forEach((doc) => {
  //   // doc.data() is never undefined for query doc snapshots
  //   // console.log(doc.id, " => ", doc.data());
  //   data.push(doc.data());
  // });
  // // Sort by timestamp
  // data.sort((a, b) => {
  //   return a.timestamp - b.timestamp;
  // });
  // console.log(data);
  // return data;
};
