import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import Nav from "../shared_components/nav";
import axios from 'axios';
import SessionData from "../types/SessionData";
import { cookies } from 'next/headers';
import React from 'react';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
	const cooki = await cookies();
	console.log(`we are running ssr !! cookie is: ${(cooki.get('session')?.value) ? "present" : "not present"}`);
    const result = await axios.get('http://localhost:3000/api/auth/verify-session', {
		headers: {
		Cookie: `session=${cooki.get('session')?.value}`
		}
	});
	const userData = result.data as SessionData;

	if (result.status !== 200)
	{
		console.log("error decoding user's session");
	}

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
		<Nav session={userData} />
          {children}
      </body>
    </html>
  );
}