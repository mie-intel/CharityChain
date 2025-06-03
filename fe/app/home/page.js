export default function Home() {
  return (
    <>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined"
      />
      <nav className="bg-blue-dark/90 border-b-blue-navy fixed top-0 left-0 z-[99999] w-full border-b-1 backdrop-blur-sm">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <div className="flex flex-1/4 flex-col justify-center">
            <a href="#hero" className="text-blue-500">
              <h1 className="text-2xl font-extrabold">CharityChain</h1>
              <p className="font-bold">Blockchain Based Tech.</p>
            </a>
          </div>

          <div
            className="bg-blue-dark text-peach border-blue-navy absolute top-20 -right-2 z-[9999] hidden w-2/3 flex-col overflow-hidden rounded-bl-xl border-1 transition-all duration-300 md:static md:flex md:w-auto md:flex-3/4 md:flex-row-reverse md:rounded-none md:border-none md:bg-transparent"
            id="nav-menu"
          >
            <div className="flex flex-col items-center md:flex-row md:justify-between">
              <a href="" className="px-4 py-5 hover:text-blue-500 md:ml-7 md:p-0">
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

      <section id="catalogue" className="py-30 text-black">
        <div className="container mx-auto px-4">
          <h1 className="text-blue-dark mb-3 text-center text-4xl font-extrabold md:text-left">
            Campaign Saat Ini
          </h1>
          <p className="mb-10 text-lg">
            Seberapun yang kamu berikan, akan sangat berharga bagi mereka yang membutuhkan!
          </p>
          <div className="flex flex-col overflow-hidden rounded-md px-4 py-7 shadow-md md:px-10 md:py-10">
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
              <div className="hover:text-blue-navy flex cursor-pointer rounded-md bg-blue-500 px-3 py-2 font-medium text-white">
                <span className="material-symbols-outlined"> add </span>
                <p>Tambah Campaign</p>
              </div>
            </div>
            <div className="flex w-full flex-wrap justify-between gap-10">
              <a
                href="/home/view"
                className="flex max-w-sm cursor-pointer flex-col overflow-hidden rounded-lg shadow-md transition-all duration-200 hover:scale-101 hover:bg-blue-50 hover:shadow-lg"
              >
                <img
                  src="/donate-bg.jpg"
                  alt="Gambar Obat"
                  className="h-1/3 w-full bg-center object-cover"
                />
                <div className="flex flex-col justify-center px-5 py-4 md:px-7">
                  <h2 className="mb-3 text-lg font-bold">Dukung Teguh Beli Hewan Kurban!</h2>
                  <div className="flex flex-col">
                    <h3 className="text-blue-dark text-xl font-extrabold text-blue-500">
                      Rp12.657.909
                    </h3>
                    <p>
                      terkumpul dari <span className="font-bold">Rp20.000.000</span>
                    </p>
                  </div>
                  <p className="mt-3 mb-5 text-base font-light">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. In aut eligendi
                    quibusdam temporibus mollitia, itaque nisi repellendus quae consectetur optio?
                  </p>
                  <div className="flex justify-between">
                    <h4 className="text-red flex items-center font-bold">
                      <span className="material-symbols-outlined mr-1">timer</span>
                      <p>12 hari</p>
                    </h4>
                    <p className="text-sm font-medium">Hamba Allah</p>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
