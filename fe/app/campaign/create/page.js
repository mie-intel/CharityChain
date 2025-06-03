export default function Create() {
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
      <section id="add-campaign" className="py-30 text-black">
        <div className="container mx-auto px-4">
          <h1 className="text-blue-dark mb-10 text-center text-4xl font-extrabold md:text-left">
            Tambah Campaign Baru
          </h1>
          <div className="mb-5 flex flex-col rounded-lg border-1 border-green-700 bg-green-100 px-10 py-7 shadow-md">
            <h2 className="font-medium text-green-700">Campaign Berhasil Ditambahkan!</h2>
          </div>
          <div className="flex flex-col overflow-hidden rounded-md px-10 py-10 shadow-md md:px-10 md:py-10">
            <a
              href="/campaign"
              className="group mb-7 flex items-center transition-all duration-200 hover:font-bold"
            >
              <span className="material-symbols-outlined mr-1 transition-all duration-200 ease-in-out group-hover:-translate-x-3">
                arrow_back
              </span>
              Kembali ke Campaign
            </a>
            <h2 className="mb-7 text-lg font-bold">Masukkan Data Campaign</h2>
            <form action="">
              <div className="mb-7 flex flex-col justify-between">
                <label htmlFor="name" className="after:text-red font-medium after:content-['*']">
                  Nama Campaign
                </label>
                <input
                  type="name"
                  name="name"
                  id="name"
                  placeholder="Dukung Pengamen Itu Agar Tidak Putus Sekolah"
                  required
                  className="border-b-1 py-1.5 outline-none hover:border-blue-500 focus:border-b-2 focus:border-blue-500"
                />
              </div>
              <div className="flex">
                <div className="flex flex-col justify-between">
                  <label
                    htmlFor="target"
                    className="after:text-red font-medium after:content-['*']"
                  >
                    Nominal Target Donasi Campaign
                  </label>
                  <div className="flex items-center">
                    <p className="mr-2 font-bold text-blue-500">ETH</p>
                    <input
                      type="text"
                      name="target"
                      id="target"
                      placeholder="200"
                      required
                      className="border-b-1 py-1.5 outline-none hover:border-blue-500 focus:border-b-2 focus:border-blue-500"
                    />
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
                    <input
                      type="text"
                      name="target"
                      id="target"
                      placeholder="50"
                      required
                      className="border-b-1 py-1.5 outline-none hover:border-blue-500 focus:border-b-2 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
