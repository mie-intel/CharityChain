"use client";

import { Navbar } from "@/components/Elements/Navbar";
import { createCampaign } from "@/utils/helpers/campaign";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "@/components/Contexts/AuthProvider";

export default function Create() {
  const [loading, setLoading] = useState(true);
  const titleRef = useRef(null);
  const targetRef = useRef(null);
  const durationRef = useRef(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const { getCurrentUser } = useContext(AuthContext);
  useEffect(() => {
    setLoading(false);
  }, []);

  const handleSubmit = async (e) => {
    console.log("handleSubmit called");
    e.preventDefault();
    if (!titleRef.current || !targetRef.current || !durationRef.current) {
      setError("Semua field harus diisi!");
      return;
    }
    const title = titleRef.current.value;
    const target = targetRef.current.value;
    const duration = durationRef.current.value;

    console.log("Data", {
      title,
      target,
      duration,
    });

    if (!title || !target || !duration) {
      setError("Semua field harus diisi!");
      return;
    }

    const userData = await getCurrentUser();
    const response = await createCampaign(title, target, userData.address, duration);
    if (response.status === "error") {
      setError(response.message);
      setSuccess(null);
      window.location.reload();
      return;
    } else {
      setSuccess(response.message);
      setError(null);
      titleRef.current.value = "";
      targetRef.current.value = "";
      durationRef.current.value = "";
      window.location.reload();
    }
  };
  return (
    <>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined"
      />
      <Navbar />
      <section id="add-campaign" className="py-30 text-black">
        <div className="container mx-auto px-4">
          <h1 className="text-blue-dark mb-10 text-center text-4xl font-extrabold md:text-left">
            Tambah Campaign Baru
          </h1>
          {success && (
            <div className="mb-5 flex flex-col rounded-lg border-1 border-green-700 bg-green-100 px-10 py-7 shadow-md">
              <h2 className="font-medium text-green-700">{success}</h2>
            </div>
          )}
          {error && (
            <div className="mb-5 flex flex-col rounded-lg border-1 border-red-700 bg-red-100 px-10 py-7 shadow-md">
              <h2 className="font-medium text-red-700">{error}</h2>
            </div>
          )}

          <div className="flex flex-col overflow-hidden rounded-md px-10 py-10 shadow-md md:px-10 md:py-10">
            <a
              href="/home/campaign"
              className="group mb-7 flex items-center transition-all duration-200 hover:font-bold"
            >
              <span className="material-symbols-outlined mr-1 transition-all duration-200 ease-in-out group-hover:-translate-x-3">
                arrow_back
              </span>
              Kembali ke Campaign
            </a>
            <h2 className="mb-7 text-lg font-bold">Masukkan Data Campaign</h2>
            <form onSubmit={handleSubmit}>
              <div className="flex">
                <div className="flex w-1/2 flex-col justify-between">
                  <label
                    htmlFor="target"
                    className="after:text-red font-medium after:content-['*']"
                  >
                    Judul Campaign
                  </label>
                  <div className="flex items-center">
                    {!loading && (
                      <input
                        ref={titleRef}
                        type="text"
                        name="title"
                        id="title"
                        placeholder="Dukung Pengamen Itu Agar Tidak Putus Sekolah!"
                        required
                        className="w-full border-b-1 py-1.5 outline-none hover:border-blue-500 focus:border-b-2 focus:border-blue-500"
                      />
                    )}
                  </div>
                </div>
                <div className="ml-7 flex flex-col justify-between">
                  <label
                    htmlFor="target"
                    className="after:text-red font-medium after:content-['*']"
                  >
                    Nominal Target Donasi Campaign
                  </label>
                  <div className="flex items-center">
                    <p className="mr-2 font-bold text-blue-500">Rp</p>
                    {!loading && (
                      <input
                        type="number"
                        name="target"
                        ref={targetRef}
                        id="target"
                        placeholder="200"
                        required
                        className="border-b-1 py-1.5 outline-none hover:border-blue-500 focus:border-b-2 focus:border-blue-500"
                      />
                    )}
                  </div>
                </div>
                <div className="ml-7 flex flex-col justify-between">
                  <label
                    htmlFor="target"
                    className="after:text-red font-medium after:content-['*']"
                  >
                    Durasi Campaign
                  </label>
                  <div className="flex items-center">
                    {!loading && (
                      <input
                        ref={durationRef}
                        type="text"
                        name="duration"
                        id="duration"
                        placeholder="50"
                        required
                        className="border-b-1 py-1.5 outline-none hover:border-blue-500 focus:border-b-2 focus:border-blue-500"
                      />
                    )}
                  </div>
                </div>
              </div>
              <button
                type="submit"
                className="mt-7 flex cursor-pointer items-center rounded-md bg-blue-500 px-3 py-1.5 font-medium text-white hover:bg-blue-400"
              >
                <span className="material-symbols-outlined"> add </span>
                Tambah Campaign
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
