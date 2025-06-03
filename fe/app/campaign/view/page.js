export default function Detail() {
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
              <a href="/home" className="px-4 py-5 hover:text-blue-500 md:ml-7 md:p-0">
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
      <section id="campaign-detail" className="py-30 text-black">
        <div className="container mx-auto px-4">
          <h1 className="text-blue-dark mb-10 text-center text-4xl font-extrabold md:text-left">
            Detail Campaign
          </h1>
          <div className="flex flex-col overflow-hidden rounded-md px-4 py-7 shadow-md md:px-10 md:py-10">
            <a
              href="/home"
              className="group flex items-center transition-all duration-200 hover:font-bold"
            >
              <span className="material-symbols-outlined mr-1 transition-all duration-200 ease-in-out group-hover:-translate-x-3">
                arrow_back
              </span>
              Kembali
            </a>
            <div className="mt-10 flex items-start gap-15">
              <div className="flex w-1/4 flex-col overflow-hidden rounded-lg shadow-md">
                <img src="/donate-bg.jpg" alt="Gambar Obat" className="w-full object-cover" />
              </div>
              <div className="flex w-1/2 flex-col">
                <h2 className="text-bg-dark mb-1 text-2xl font-extrabold text-blue-500">
                  Dukung Teguh Beli Hewan Kurban!
                </h2>
                <h3 className="text-lg">
                  oleh
                  <a href="" className="ml-1 font-bold hover:text-blue-500">
                    Hamba Allah
                  </a>
                </h3>
                <p className="text-sm font-medium">
                  Dibuat pada <span>23 Agustus 2023</span>
                </p>

                <div className="mt-5 flex h-3 w-full overflow-hidden rounded-full border-1 border-blue-500 shadow-md">
                  <div className="w-1/3 bg-blue-500"></div>
                </div>
                <p className="my-1 text-xl font-extrabold text-blue-500">Rp12.530.561</p>
                <p>
                  terkumpul dari <span className="font-bold">Rp20.000.000</span>
                </p>
                <h4 className="text-red mt-3 flex items-center font-bold">
                  <span className="material-symbols-outlined mr-1">timer</span>
                  <p>12 hari lagi</p>
                </h4>
                <p className="mt-5">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis dolorem ab
                  reprehenderit accusantium debitis! Repellat exercitationem hic mollitia ad ipsum
                  vitae aliquid rem quod suscipit velit consectetur placeat rerum inventore, odio
                  tempora adipisci porro quas quibusdam accusantium. Aut quia magnam officia tempora
                  ullam, reprehenderit odit impedit nostrum repellendus, harum veniam facilis?
                  Minima sunt iure corporis beatae illo. Porro voluptas dolores non, vitae sit
                  laudantium. Iusto atque quidem dolorum sunt? Odit tempora hic alias minus libero
                  quaerat aperiam laudantium facere error, commodi deleniti incidunt a, repellendus
                  eligendi recusandae, doloribus deserunt magnam quas provident ratione eos cum
                  suscipit quae? Repellendus, architecto non.
                </p>
                <p>
                  Lorem, ipsum dolor sit amet consectetur adipisicing elit. Deserunt cupiditate at
                  ad, commodi quis nemo obcaecati maxime, illum tempore, quaerat qui harum eligendi
                  voluptas. Minus, vitae. Cumque delectus, voluptatem laboriosam esse est vero iure
                  provident? Consequatur sequi saepe totam nihil officiis debitis numquam nesciunt,
                  hic nisi fuga, rem enim accusantium nam, voluptas perferendis voluptatum fugiat.
                  Perferendis tempora magni alias minus corporis, iusto dolore voluptatibus
                  aspernatur reprehenderit doloribus veritatis distinctio in possimus laudantium
                  temporibus magnam. Qui.
                </p>
              </div>
              <div className="flex w-1/4 flex-col">
                <div className="flex w-full flex-col rounded-lg border-1 border-blue-500 p-7 shadow-md">
                  <h2 className="text-bg-dark text-blue-dark mb-2 text-xl font-extrabold">
                    Yuk, Donasi!
                  </h2>
                  <h3 className="text-md mt-2 font-medium">Masukkan Nominal Donasi</h3>
                  <form action="#" className="mt-3 mb-4 flex">
                    <label
                      htmlFor="donate"
                      className="mr-2 flex items-center text-lg font-bold text-blue-500"
                    >
                      Rp
                    </label>
                    <input
                      type="text"
                      name="donate"
                      id="donate"
                      placeholder="20000"
                      autoFocus
                      className="w-full text-lg font-medium outline-none hover:border-blue-500 focus:border-b-2 focus:border-blue-500"
                    />
                  </form>
                  <a
                    href="#"
                    className="text-md mt-5 rounded-lg bg-blue-500 py-3 text-center font-bold text-white hover:bg-blue-500/90"
                  >
                    Donasi Sekarang!
                  </a>
                </div>
                <div className="mt-5 flex flex-col justify-center rounded-lg border-1 border-green-700 bg-green-100 p-7 shadow-md">
                  <h3 className="mb-2 font-bold text-green-700">Donasi Berhasil!</h3>
                  <p className="text-sm">
                    Terima kasih sudah berdonasi. Lakukanlah banyak kebaikan di hidupmu! Sekecil
                    apapun kebaikan yang kamu lakukan, akan sangat bermanfaat bagi orang lain.
                  </p>
                  <p></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
