"use client";

import { useContext, useState, useEffect } from "react";
import { Loading } from "@/components/Elements";
import { AuthContext } from "@/components/Contexts/AuthProvider";

export default function User() {
  const { getCurrentUser } = useContext(AuthContext);
  const [currentUser, setCurrentUser] = useState(null);
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const user = await getCurrentUser();
      if (user.status === "success") {
        setCurrentUser(user);
      } else {
        console.error("Error fetching current user:", user.error);
      }
    };
    fetchCurrentUser();
  }, []);
  if (!currentUser) {
    return <Loading className={"fixed h-screen w-screen bg-[url('/bg-comp.webp')] bg-cover"} />;
  }
  return (
    <>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined"
      />
      <section id="user" className="py-30 text-black">
        <div className="container mx-auto px-4">
          <h1 className="text-blue-dark mb-10 text-center text-4xl font-extrabold md:text-left">
            Detail Akun
          </h1>
          <div className="flex flex-col overflow-hidden rounded-md px-10 py-10 shadow-md md:px-10 md:py-10">
            <div className="mb-10 flex justify-between">
              <a
                href="/home"
                className="group flex items-center transition-all duration-200 hover:font-bold"
              >
                <span className="material-symbols-outlined mr-1 transition-all duration-200 ease-in-out group-hover:-translate-x-3">
                  arrow_back
                </span>
                Kembali
              </a>
            </div>
            <div className="flex">
              <div className="flex h-[128px] w-[128px] items-center justify-center overflow-hidden rounded-full shadow-lg">
                <img
                  src="/anies-senyum.jpeg"
                  alt="Gambar Obat"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex-flex-col ml-[64px]">
                <h2 className="mb-5 text-2xl font-extrabold">{currentUser?.username}</h2>
                <div className="mb-4 flex items-center text-lg">
                  <span className="material-symbols-outlined">attach_money</span>
                  <p className="mr-2 font-bold">Saldo:</p>
                  <span className="font-extrabold text-blue-500">ETH {currentUser?.balance}</span>
                </div>
                <div className="mb-3 flex flex-col">
                  <h3>Address</h3>
                  <p className="font-medium">{currentUser?.address ? currentUser?.address : "-"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
