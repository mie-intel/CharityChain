"use client";

import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../Contexts/AuthProvider";

export const Navbar = () => {
  const [user, setUser] = useState({ balance: 0 });
  const { getCurrentUser, signOut } = useContext(AuthContext);

  useEffect(() => {
    const init = async () => {
      const userData = await getCurrentUser();
      setUser(userData);
    };

    init();
  }, []);

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <nav className="bg-blue-dark/90 border-b-blue-navy fixed top-0 left-0 z-[99999] w-full border-b-1 backdrop-blur-sm">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <div className="flex flex-1/4 flex-col justify-center">
          <a href="/" className="text-blue-500">
            <h1 className="text-2xl font-extrabold">CharityChain</h1>
            <p className="font-bold">Blockchain Based Tech.</p>
          </a>
        </div>

        <div
          className="bg-blue-dark text-peach border-blue-navy absolute top-20 -right-2 z-[9999] hidden w-2/3 flex-col overflow-hidden rounded-bl-xl border-1 transition-all duration-300 md:static md:flex md:w-auto md:flex-3/4 md:flex-row-reverse md:rounded-none md:border-none md:bg-transparent"
          id="nav-menu"
        >
          <div className="flex flex-col items-center md:flex-row md:justify-between">
            <div className="px-4 py-5 hover:text-blue-500 md:ml-7 md:p-0">
              Balance: <span>Rp {user?.balance}</span>
            </div>
            <a href="/home" className="px-4 py-5 hover:text-blue-500 md:ml-7 md:p-0">
              Beranda
            </a>
            <a href="/home/campaign" className="px-4 py-5 hover:text-blue-500 md:ml-7 md:p-0">
              Campaign
            </a>
            <a href="/home/user" className="px-4 py-5 hover:text-blue-500 md:ml-7 md:p-0">
              Akun
            </a>
            {!user ? (
              <>
                {" "}
                <a
                  href="/auth/sign-in"
                  className="px-4 py-5 text-blue-500 hover:scale-105 md:ml-7 md:p-0 md:font-bold"
                >
                  Masuk
                </a>
                <a
                  href="/auth/sign-up"
                  className="px-4 py-5 text-white hover:text-blue-500 md:ml-7 md:rounded-md md:bg-blue-500 md:px-3 md:py-1 md:font-bold md:text-white md:hover:bg-blue-500/90 md:hover:text-white"
                >
                  Daftar
                </a>
              </>
            ) : (
              <button
                type="button"
                onClick={handleLogout}
                className="px-4 py-5 text-blue-500 hover:scale-105 md:ml-7 md:p-0 md:font-bold"
              >
                Keluar
              </button>
            )}
          </div>
        </div>

        <div className="group flex flex-col hover:cursor-pointer md:hidden" id="nav-toggle">
          <span className="nav-toggle origin-top-left transition-all duration-200" />
          <span className="nav-toggle transition-all duration-200" />
          <span className="nav-toggle origin-bottom-left transition-all duration-200" />
        </div>
      </div>
    </nav>
  );
};
