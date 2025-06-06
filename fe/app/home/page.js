import { Navbar } from "@/components/Elements/Navbar";

export default function Home() {
  return (
    <>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined"
      />
      <Navbar />
      <section id="hero" className="bg-blue-dark min-h-screen pt-50 pb-20">
        <div className="container mx-auto h-full px-4">
          <div className="flex h-full flex-wrap items-center justify-between">
            <div className="w-full text-center lg:w-1/2 lg:text-left">
              <h1 className="mb-3 pb-2 text-3xl font-extrabold md:mb-10 md:text-5xl xl:text-7xl">
                Yuk, Berbagi Kebaikan Bersama <span className="text-blue-500">CharityChain</span>!
              </h1>
              <p className="text-peach mb-8 text-base font-normal md:mb-12 md:text-lg">
                <a href="/home/" className="mr-1 text-xl font-bold">
                  CharityChain
                </a>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iure accusamus corporis
                temporibus enim pariatur cumque cum, tempore quisquam eveniet provident hic expedita
                aliquid aspernatur at aperiam ex repellat facilis fugiat esse sed similique aut
                voluptatum minus saepe!
              </p>
              <a
                href="/home/campaign"
                className="rounded-full bg-blue-500 px-7 py-3 text-base font-semibold text-white transition duration-200 hover:bg-blue-400 active:opacity-80"
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
