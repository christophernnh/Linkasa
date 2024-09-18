// import { getAuth } from "firebase/auth";
import Router from "next/router";
import { useEffect } from "react";
import { auth } from "../firebase/firebase";

export default function Home(){
  const user = auth.currentUser;
  useEffect(() => {
      if(user == null){
          localStorage.clear();
          Router.push('/login')
      }
  }, [user])
  
}