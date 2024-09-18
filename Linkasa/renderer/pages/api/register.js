import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBr7DOs8o-NSVIu9OBE5y5rqe1IrnocIuw",
  authDomain: "linkasa-6d8e6.firebaseapp.com",
  projectId: "linkasa-6d8e6",
  storageBucket: "linkasa-6d8e6.appspot.com",
  messagingSenderId: "860039317869",
  appId: "1:860039317869:web:009dd50db7abb6c395f264"
};

const firebaseApp = initializeApp(firebaseConfig);
const firebaseAuth = getAuth(firebaseApp);
const firebaseFirestore = getFirestore(firebaseApp);

export default async function handler(req, res) {
  const { name, email, password, role } = req.body;

  try {
    const userCredential = await createUserWithEmailAndPassword(
      firebaseAuth,
      email,
      password
    );

    // Save additional user data to Firestore
    await setDoc(doc(firebaseFirestore, "users", userCredential.user.uid), {
      userName: name,
      userRole: role,
      userEmail: email,
    });

    res.status(200).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error creating user:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
