"use client";

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";

export default function User() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const init = async () => {
      const supabase = await createClient();
      const { data: response } = await supabase.from("Users").select("*");
      setData(response);
    };

    init();
  }, []);

  return (
    <>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined"
      />
      <nav className="bg-blue-dark/90 border-b-blue-navy fixed top-0 left-0 z-[99999] w-full border-b-1 backdrop-blur-sm">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <div className="flex flex-1/4 flex-col justify-center">
            <a href="/" className="text-blue-500">
              <h1 className="text-2xl font-extrabold">CharityChain</h1>
              <p className="font-bold">Blockchain Based Tech.</p>
            </a>
          </div>
          {data.map((item) => {
            return (
              
            );
          })}
          <div
            className="bg-blue-dark text-peach border-blue-navy absolute top-20 -right-2 z-[9999] hidden w-2/3 flex-col overflow-hidden rounded-bl-xl border-1 transition-all duration-300 md:static md:flex md:w-auto md:flex-3/4 md:flex-row-reverse md:rounded-none md:border-none md:bg-transparent"
            id="nav-menu"
          >
            <div className="flex flex-col items-center md:flex-row md:justify-between">
              <a href="/" className="px-4 py-5 hover:text-blue-500 md:ml-7 md:p-0">
                Beranda
              </a>
              <a href="/campaign" className="px-4 py-5 hover:text-blue-500 md:ml-7 md:p-0">
                Campaign
              </a>
              <a href="/user" className="px-4 py-5 hover:text-blue-500 md:ml-7 md:p-0">
                Akun
              </a>
              <a
                href="/sign-in"
                className="px-4 py-5 text-blue-500 hover:scale-105 md:ml-7 md:p-0 md:font-bold"
              >
                Masuk
              </a>
              <a
                href="/sign-up"
                className="px-4 py-5 text-white hover:text-blue-500 md:ml-7 md:rounded-md md:bg-blue-500 md:px-3 md:py-1 md:font-bold md:text-white md:hover:bg-blue-500/90 md:hover:text-white"
              >
                Daftar
              </a>
            </div>
          </div>

          <div className="group flex flex-col hover:cursor-pointer md:hidden" id="nav-toggle">
            <span className="nav-toggle origin-top-left transition-all duration-200"></span>
            <span className="nav-toggle transition-all duration-200"></span>
            <span className="nav-toggle origin-bottom-left transition-all duration-200"></span>
          </div>
        </div>
      </nav>
      <section id="user" className="py-30 text-black">
        <div className="container mx-auto px-4">
          <h1 className="text-blue-dark mb-10 text-center text-4xl font-extrabold md:text-left">
            Detail Akun
          </h1>
          <div className="flex flex-col overflow-hidden rounded-md px-10 py-10 shadow-md md:px-10 md:py-10">
            <div className="flex">
              <div className="flex h-[128px] w-[128px] items-center justify-center overflow-hidden rounded-full shadow-lg">
                <img
                  src="/anies-senyum.jpeg"
                  alt="Gambar Obat"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex-flex-col ml-[64px]">
                <h2 className="mb-5 text-2xl font-extrabold">Garbharata Adji Tegoeh</h2>
                <div className="mb-5 flex items-center">
                  <p className="text-xl font-extrabold text-blue-500">ETH 20</p>
                  <a
                    href=""
                    className="ml-4 flex items-center rounded-md bg-blue-500 px-2 py-1 text-sm font-medium text-white hover:bg-blue-400"
                  >
                    <span className="material-symbols-outlined mr-1">arrow_upward</span>
                    <p>Top Up</p>
                  </a>
                </div>
                <div className="mb-3 flex flex-col">
                  <h3>Address</h3>
                  <p className="font-medium">DSHD73B32DBSUPL</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
