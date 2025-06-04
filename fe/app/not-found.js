import Link from "next/link";

// export default function NotFound() {
//   return (
//     <div className="font-eudoxus-bold flex h-full w-full flex-col items-center justify-center text-center text-9xl text-white drop-shadow-[0_0_20px_rgba(0,0,0,0.5)] md:text-[200px] xl:text-[400px]">
//       <h1>404</h1>
//       <p className="text-lg drop-shadow-[0_0_20px_rgba(0,0,0,0.5)] max-xl:leading-snug md:text-3xl xl:text-[30px]">
//         Halaman Tidak Ditemukan! <br className="xl:hidden" />
//         <span className="text-[#F5C45E] duration-500 hover:text-white">
//           <Link href="/dashboard" className="drop-shadow-[0_0_20px_rgba(0,0,0,0.5)]">
//             Kembali ke Dashboard
//           </Link>
//         </span>
//       </p>
//     </div>
//   );
// }

export default function NotFound() {
  return (
    <section id="not-found" className="flex min-h-screen w-full items-center justify-center">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-9xl font-extrabold">404</h1>
        <p className="my-5 text-2xl font-medium">Halaman Tidak Ditemukan!</p>
        <a
          href="/home"
          className="rounded-lg py-3 text-center text-lg font-bold text-blue-400 hover:text-blue-500"
        >
          Kembali ke Beranda
        </a>
      </div>
    </section>
  );
}
