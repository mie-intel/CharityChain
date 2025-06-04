"use client";

import { AuthContext } from "@/components/Contexts/AuthProvider";
import { Navbar } from "@/components/Elements/Navbar";
import { getCampaign, donate, withdraw } from "@/utils/helpers/campaign";
import { createClient } from "@/utils/supabase/client";
import { useContext, useEffect, useState } from "react";

const Modal = ({ isOpen, onClose, campaign, user }) => {
  const [donationAmount, setDonationAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showDonationForm, setShowDonationForm] = useState(false);
  const [showWithdrawForm, setShowWithdrawForm] = useState(false);

  if (!isOpen || !campaign) return null;

  console.log("User Address", user);
  const progressPercentage =
    campaign.target > 0 ? (Number(campaign.currentAmount) / Number(campaign.target)) * 100 : 0;

  // Check if current user is the campaign owner
  const isOwner = user?.address?.toLowerCase() === campaign.organizer?.toLowerCase();
  console.log("Is Owner:", isOwner, "User:", user?.address, "Organizer:", campaign.organizer);

  const handleDonate = async (e) => {
    e.preventDefault();
    if (!donationAmount || Number(donationAmount) <= 0) {
      setMessage("Masukkan jumlah donasi yang valid");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      const userAddress = user.address;
      console.log("User Address m2", userAddress);
      const result = await donate(
        userAddress, // donorUserId (address)
        campaign.id, // campaignId
        Number(donationAmount), // amount
      );

      if (result.status === "success") {
        setMessage("Donasi berhasil! Terima kasih atas kontribusinya.");
        setDonationAmount("");
        setShowDonationForm(false);

        // Refresh campaign data
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        setMessage(result.message || "Donasi gagal");
      }
    } catch (error) {
      console.error("Donation error:", error);
      setMessage("Terjadi kesalahan saat melakukan donasi");
    } finally {
      setIsLoading(false);
    }
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();
    if (!withdrawAmount || Number(withdrawAmount) <= 0) {
      setMessage("Masukkan jumlah withdraw yang valid");
      return;
    }

    if (Number(withdrawAmount) > Number(campaign.currentAmount)) {
      setMessage("Jumlah withdraw tidak boleh melebihi dana yang terkumpul");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      // Import withdraw function from campaign helper

      const result = await withdraw(
        campaign.id, // campaignId
        user.address,
        Number(withdrawAmount), // amount
      );

      if (result.status === "success") {
        setMessage(
          `Withdraw berhasil! Rp ${Number(withdrawAmount).toLocaleString()} telah ditarik.`,
        );
        setWithdrawAmount("");
        setShowWithdrawForm(false); // Refresh campaign data
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        setMessage(result.message || "Withdraw gagal");
      }
    } catch (error) {
      console.error("Withdraw error:", error);
      setMessage("Terjadi kesalahan saat melakukan withdraw");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="bg-opacity-50 fixed inset-0 z-50 bg-black opacity-50" onClick={onClose} />
      <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center">
        <div className="relative mx-4 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white shadow-xl">
          {/* Header */}
          <div className="sticky top-0 flex items-center justify-between border-b bg-white p-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Detail Campaign</h2>
              {isOwner && (
                <p className="text-sm font-medium text-blue-600">
                  Anda adalah pemilik campaign ini
                </p>
              )}
            </div>
            <button onClick={onClose} className="text-2xl text-gray-500 hover:text-gray-700">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Image */}
            <div className="mb-6">
              <img
                src="/donate-bg.jpg"
                alt={campaign.title}
                className="h-64 w-full rounded-lg object-cover"
              />
            </div>

            {/* Title & Organizer */}
            <div className="mb-6">
              <h1 className="mb-2 text-3xl font-bold text-gray-800">{campaign.title}</h1>
              <p className="text-gray-600">
                Oleh: <span className="font-semibold text-blue-600">{campaign.username}</span>
              </p>
              <p className="text-sm text-gray-500">Organizer: {campaign.organizer}</p>
            </div>

            {/* Progress */}
            <div className="mb-6">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-2xl font-bold text-blue-600">
                  Rp {campaign.currentAmount.toLocaleString()}
                </span>
                <span className="text-lg text-gray-600">
                  dari Rp {campaign.target.toLocaleString()}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="mb-2 h-3 w-full rounded-full bg-gray-200">
                <div
                  className="h-3 rounded-full bg-blue-500 transition-all duration-300"
                  style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                ></div>
              </div>

              <div className="flex justify-between text-sm text-gray-600">
                <span>{progressPercentage.toFixed(1)}% tercapai</span>
                <span>
                  Sisa: Rp{" "}
                  {Math.max(0, Number(campaign.target - campaign.currentAmount)).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Timeline */}
            <div className="mb-6 rounded-lg bg-gray-50 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center text-red-600">
                  <span className="material-symbols-outlined mr-2">timer</span>
                  <span className="font-semibold">{campaign.deadline} ms tersisa</span>
                </div>
                <div className="text-sm text-gray-600">
                  Status:{" "}
                  {campaign.isCompleted ? (
                    <span className="font-semibold text-green-600">Selesai</span>
                  ) : (
                    <span className="font-semibold text-blue-600">Aktif</span>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="mb-3 text-xl font-bold">Deskripsi Campaign</h3>
              <p className="leading-relaxed text-gray-700">Bantu bang</p>
            </div>

            {/* Message Display */}
            {message && (
              <div
                className={`mb-4 rounded-lg p-3 ${
                  message.includes("berhasil")
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {message}
              </div>
            )}

            {/* Donation Form - Only for non-owners */}
            {showDonationForm && !isOwner && (
              <div className="mb-6 rounded-lg bg-blue-50 p-4">
                <h4 className="mb-3 text-lg font-semibold">Form Donasi</h4>
                <div className="flex gap-3">
                  <input
                    type="number"
                    placeholder="Masukkan jumlah donasi"
                    value={donationAmount}
                    onChange={(e) => setDonationAmount(e.target.value)}
                    className="flex-1 rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                    disabled={isLoading}
                  />
                  <button
                    onClick={handleDonate}
                    disabled={isLoading}
                    className="rounded-lg bg-green-500 px-6 py-2 text-white hover:bg-green-600 disabled:cursor-not-allowed disabled:bg-gray-400"
                  >
                    {isLoading ? "Proses..." : "Donasi"}
                  </button>
                </div>
                <button
                  onClick={() => setShowDonationForm(false)}
                  className="mt-2 text-sm text-gray-600 hover:text-gray-800"
                >
                  Batal
                </button>
              </div>
            )}

            {/* Withdraw Form - Only for owners */}
            {showWithdrawForm && isOwner && (
              <div className="mb-6 rounded-lg bg-orange-50 p-4">
                <h4 className="mb-3 text-lg font-semibold">Form Withdraw Dana</h4>
                <p className="mb-3 text-sm text-gray-600">
                  Dana tersedia:{" "}
                  <span className="font-bold">Rp {campaign.currentAmount.toLocaleString()}</span>
                </p>
                <div className="flex gap-3">
                  <input
                    type="number"
                    placeholder="Masukkan jumlah withdraw"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    max={campaign.currentAmount}
                    className="flex-1 rounded-lg border border-gray-300 px-3 py-2 focus:border-orange-500 focus:outline-none"
                    disabled={isLoading}
                  />
                  <button
                    onClick={handleWithdraw}
                    disabled={isLoading}
                    className="rounded-lg bg-orange-500 px-6 py-2 text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-gray-400"
                  >
                    {isLoading ? "Proses..." : "Withdraw"}
                  </button>
                </div>
                <button
                  onClick={() => setShowWithdrawForm(false)}
                  className="mt-2 text-sm text-gray-600 hover:text-gray-800"
                >
                  Batal
                </button>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 border-t pt-4">
              {isOwner ? (
                // Owner buttons
                <>
                  {!showWithdrawForm && Number(campaign.currentAmount) > 0 ? (
                    <button
                      onClick={() => setShowWithdrawForm(true)}
                      className="flex-1 rounded-lg bg-orange-500 px-6 py-3 font-semibold text-white transition-colors duration-200 hover:bg-orange-600"
                      disabled={!campaign.isCompleted}
                    >
                      <span className="material-symbols-outlined mr-2">account_balance_wallet</span>
                      {campaign.isCompleted ? "Selesai. Withdraw Dana" : "Campaign Belum Selesai"}
                    </button>
                  ) : !showWithdrawForm && Number(campaign.currentAmount) === 0 ? (
                    <div className="flex-1 rounded-lg bg-gray-300 px-6 py-3 text-center font-semibold text-gray-500">
                      Belum ada dana untuk di-withdraw
                    </div>
                  ) : null}
                </>
              ) : (
                // Non-owner buttons (donation)
                <>
                  {!showDonationForm ? (
                    <button
                      onClick={() => setShowDonationForm(true)}
                      className="flex-1 rounded-lg bg-blue-500 px-6 py-3 font-semibold text-white transition-colors duration-200 hover:bg-blue-600"
                      disabled={campaign.isCompleted}
                    >
                      <span className="material-symbols-outlined mr-2">volunteer_activism</span>
                      {campaign.isCompleted ? "Campaign Selesai" : "Donasi Sekarang"}
                    </button>
                  ) : null}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default function Campaign() {
  const [user, setUser] = useState({ balance: 0 });
  const [data, setData] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { getCurrentUser } = useContext(AuthContext);
  useEffect(() => {
    // Fetch campaign data here
    // Example: setData(fetchedCampaigns);
    const fetch = async () => {
      const supabase = createClient();
      const response = await getCampaign();
      const { data: supabaseData } = await supabase.from("Users").select("*");
      console.log("Supabase Data", supabaseData);
      const responseData = response.map((item) => ({
        ...item,
        username:
          supabaseData.find((user) => user.address === item.organizer)?.username || "Unknown",
      }));

      const currentUser = await getCurrentUser();

      setUser(currentUser);
      setData(responseData);
    };
    fetch();
  }, []);
  const openModal = (campaign) => {
    setSelectedCampaign(campaign);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCampaign(null);
  };
  console.log("Campaign Data", data);

  return (
    <>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined"
      />

      <Navbar />

      <section id="catalogue" className="bg-white py-30 text-black">
        <Modal isOpen={isModalOpen} onClose={closeModal} campaign={selectedCampaign} user={user} />
        <div className="container mx-auto px-4">
          <h1 className="text-blue-dark mb-3 text-center text-4xl font-extrabold md:text-left">
            Campaign Saat Ini
          </h1>
          <p className="mb-10 text-lg">
            Seberapun yang kamu berikan, akan sangat berharga bagi mereka yang membutuhkan!
          </p>
          <div className="flex flex-col overflow-hidden rounded-md px-4 py-7 shadow-md md:px-10 md:py-10">
            <a
              href="/"
              className="group mb-7 flex items-center transition-all duration-200 hover:font-bold"
            >
              <span className="material-symbols-outlined mr-1 transition-all duration-200 ease-in-out group-hover:-translate-x-3">
                arrow_back
              </span>
              Kembali ke Beranda
            </a>
            <div className="mb-10 flex w-full justify-between">
              <form action="#" className="flex">
                <label htmlFor="search" className="flex items-center">
                  <span className="material-symbols-outlined mr-1">search</span>
                </label>
                <input
                  type="text"
                  name="search"
                  id="search"
                  placeholder="Cari..."
                  autoFocus
                  className="outline-none hover:border-blue-500 focus:border-b-2 focus:border-blue-500"
                />
              </form>
              <a
                href="/campaign/create"
                className="hover:text-blue-navy flex cursor-pointer rounded-md bg-blue-500 px-3 py-2 font-medium text-white hover:bg-blue-400"
              >
                <span className="material-symbols-outlined"> add </span>
                <p>Tambah Campaign</p>
              </a>
            </div>
            <div className="flex w-full flex-wrap justify-between gap-10">
              {data.map((item) => {
                return (
                  <button
                    key={item.id}
                    onClick={() => openModal(item)}
                    className="group flex max-w-sm cursor-pointer flex-col overflow-hidden rounded-lg shadow-md transition-all duration-200 hover:bg-blue-50 hover:shadow-lg"
                  >
                    <div className="h-[168px] overflow-hidden">
                      <img
                        src="/donate-bg.jpg"
                        alt="Gambar Obat"
                        className="w-full origin-bottom bg-center object-cover transition-all duration-200 group-hover:scale-110"
                      />
                    </div>
                    <div className="flex flex-col justify-center px-5 pt-8 pb-7 md:px-7">
                      <h2 className="mb-3 text-lg font-bold">{item.title}</h2>
                      <div className="flex flex-col">
                        <h3 className="text-blue-dark text-xl font-extrabold text-blue-500">
                          Rp{item.currentAmount}{" "}
                        </h3>
                        <p>
                          terkumpul dari <span className="font-bold">Rp{item.target}</span>
                        </p>
                      </div>
                      <p className="mt-3 mb-5 text-base font-light">Bantu yak</p>
                      <div className="flex items-center justify-between">
                        <h4 className="text-red flex items-center font-bold">
                          <span className="material-symbols-outlined mr-1">timer</span>
                          <p>{item.deadline} ms</p>
                        </h4>
                        <p className="text-sm font-medium">{item.username}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
