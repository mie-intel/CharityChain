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
      <section id="hero" className="bg-blue-dark min-h-screen pt-50 pb-20">
        <div className="container mx-auto h-full px-4">
          <div className="flex h-full flex-wrap items-center justify-between">
            <div className="w-full text-center lg:w-1/2 lg:text-left">
              <h1 className="text-orange mb-3 pb-2 text-3xl font-extrabold md:mb-10 md:text-5xl xl:text-7xl">
                Yuk, Berbagi Kebaikan Bersama CharityChain!
              </h1>
              <p className="text-peach mb-8 text-base font-normal md:mb-12 md:text-lg">
                <a href="#hero" className="text-orange mr-1 text-xl font-bold">
                  CharityChain
                </a>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iure accusamus corporis
                temporibus enim pariatur cumque cum, tempore quisquam eveniet provident hic expedita
                aliquid aspernatur at aperiam ex repellat facilis fugiat esse sed similique aut
                voluptatum minus saepe!
              </p>
              <a
                href="/campaign"
                className="hover:bg-orange/80 rounded-full bg-blue-500 px-7 py-3 text-base font-semibold text-white transition duration-200 active:opacity-80"
              >
                Cek Campaign
              </a>
            </div>
            <div className="mt-10 w-full lg:mt-0 lg:w-1/2">
              <img src="/hero.png" alt="Medicine" className="mx-auto max-w-full" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
