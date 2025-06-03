export default function Campaign() {
  return (
    <>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined"
      />
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
              href="/home"
              className="group mb-7 flex items-center transition-all duration-200 hover:font-bold"
            >
              <span className="material-symbols-outlined mr-1 transition-all duration-200 ease-in-out group-hover:-translate-x-3">
                arrow_back
              </span>
              Kembali
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
