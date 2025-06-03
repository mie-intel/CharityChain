export default function Detail() {
  return (
    <>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined"
      />
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
                <h2 className="text-bg-dark mb-2 text-2xl font-extrabold text-blue-500">
                  Dukung Teguh Beli Hewan Kurban!
                </h2>
                <h3 className="text-md">
                  oleh
                  <a href="" className="ml-1 font-bold hover:text-blue-500">
                    Hamba Allah
                  </a>
                </h3>
                <div className="mt-5 flex h-3 w-full overflow-hidden rounded-full border-1 border-blue-500 shadow-md">
                  <div className="w-1/3 bg-blue-500"></div>
                </div>
                <p className="my-1 text-xl font-extrabold text-blue-500">Rp12.530.561</p>
                <p>
                  terkumpul dari <span className="font-bold">Rp20.000.000</span>
                </p>
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
              <div className="flex w-1/4 flex-col rounded-lg border-1 border-blue-500 p-7 shadow-md">
                <h2 className="text-bg-dark text-blue-dark mb-4 text-xl font-extrabold">
                  Yuk, Donasi!
                </h2>
                <h3 className="mb-3 text-lg font-bold">Ringkasan Transaksi</h3>
                <div class="flex justify-between">
                  <p>Donasi untuk teguh</p>
                  <p className="font-bold">x2</p>
                </div>
                <a
                  href="#"
                  className="text-md mt-5 rounded-lg bg-blue-500 py-3 text-center font-bold text-white hover:bg-blue-500/90"
                >
                  Donasi Sekarang!
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
