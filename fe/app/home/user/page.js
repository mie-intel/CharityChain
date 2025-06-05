"use client";

import { useContext, useState, useEffect } from "react";
import { Loading } from "@/components/Elements";
import { AuthContext } from "@/components/Contexts/AuthProvider";
import { Navbar } from "@/components/Elements/Navbar";

export default function User() {
  const { getCurrentUser, topUpBalance } = useContext(AuthContext); // Add topUpBalance
  const [currentUser, setCurrentUser] = useState(null);
  const [topUpAmount, setTopUpAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
  const handleTopUp = async () => {
    if (!topUpAmount || parseFloat(topUpAmount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    setIsLoading(true);
    try {
      // Call topUpBalance from AuthContext
      const response = await topUpBalance(parseFloat(topUpAmount));

      if (response.status === "success") {
        // Update current user balance with the new balance from contract
        setCurrentUser((prev) => ({
          ...prev,
          balance: response.newBalance,
        }));

        setTopUpAmount("");
        alert(`Top-up successful! New balance: ${response.newBalance}`);
      } else {
        throw new Error(response.error || "Top-up failed");
      }
    } catch (error) {
      console.error("Top-up error:", error);
      alert(`Top-up failed: ${error.message || "Please try again."}`);
    } finally {
      setIsLoading(false);
      window.location.reload(); // Refresh the page to reflect the new balance
    }
  };

  if (!currentUser) {
    return <Loading className={"fixed h-screen w-screen bg-[url('/bg-comp.webp')] bg-cover"} />;
  }

  return (
    <>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined"
      />
      <Navbar />
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
                  src="/anies-senyum2.png"
                  alt="Gambar Obat"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex-flex-col ml-[64px]">
                <h2 className="mb-5 text-2xl font-extrabold">{currentUser?.username}</h2>
                <div className="mb-4 flex items-center text-lg">
                  <p className="mr-2 font-bold">Saldo:</p>
                  <span className="font-extrabold text-blue-500">Rp {currentUser?.balance}</span>
                </div>
                <div className="mb-3 flex flex-col">
                  <h3>Address</h3>
                  <p className="font-medium">{currentUser?.address ? currentUser?.address : "-"}</p>
                </div>

                {/* Top-up Section */}
                <div className="mt-6 flex flex-col">
                  <h3 className="mb-3 text-lg font-bold">Top Up Saldo</h3>
                  <div className="flex gap-3">
                    <input
                      type="number"
                      value={topUpAmount}
                      onChange={(e) => setTopUpAmount(e.target.value)}
                      placeholder="Masukkan jumlah"
                      className="flex-1 rounded border border-gray-300 px-3 py-2"
                      min="0"
                      step="0.01"
                    />
                    <button
                      onClick={handleTopUp}
                      disabled={isLoading}
                      className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:opacity-50"
                    >
                      {isLoading ? "Loading..." : "Top Up"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
