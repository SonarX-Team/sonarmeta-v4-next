import "../globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "声呐元 - 链上IP天使孵化与授权",
  description: "Generated by create next app",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex justify-center items-center relative h-screen bg-[url('/auth-bg.jpeg')] bg-cover bg-no-repeat">
          <div className="absolute w-full h-full bg-zinc-900/75 z-10" />

          <main className="flex relative w-[768px] bg-dark-2 rounded-2xl z-20 md:m-0 mx-3">{children}</main>
        </div>
      </body>
    </html>
  );
}