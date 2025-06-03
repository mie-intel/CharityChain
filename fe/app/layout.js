// import { fontVariables } from "@/utils/helpers/font";
import React, { Suspense } from "react";
import "@/styles/globals.css";
import { AuthProvider } from "@/components/Contexts/AuthProvider";
import PropTypes from "prop-types";
import { Loading } from "@/components/Elements";
import ClientProviderWrapper from "@/components/Elements/ClientWrapper";

export const metadata = {
  title: "CharityChain",
  description:
    "CharityChain is a platform that connects donors with charitable organizations, making it easy to support causes you care about.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className="antialiased" suppressHydrationWarning>
        <Suspense
          fallback={
            <Loading className={"fixed h-screen w-screen bg-[url('/bg-comp.webp')] bg-cover"} />
          }
        >
          <ClientProviderWrapper>{children}</ClientProviderWrapper>
        </Suspense>
      </body>
    </html>
  );
}

RootLayout.propTypes = {
  children: PropTypes.node.isRequired,
};
