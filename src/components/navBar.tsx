'use client'

import { Button } from "./ui/button";
import React from "react";
import { wallet as walletSvg, setting } from "@/lib/iconSvgs";
import Image from "next/image";
import dynamic from "next/dynamic";
import {WalletMultiButton} from "@solana/wallet-adapter-react-ui";
import '@solana/wallet-adapter-react-ui/styles.css';
// const WalletMultiButtonDynamic = dynamic(
//   async () =>
//     (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
//   { ssr: false }
// );

export default function NavBar() {
  return (
    <div className="h-80px flex items-center justify-between px-5">
      <div></div>
      <WalletMultiButton className="wallet-button rounded-sm text-lg mr-6 " />
      <div className="inline-flex items-center justify-center">
        {/* <Button>
          <Image src={setting} alt="Wallet" />
        </Button> */}
      </div>
    </div>
  );
}
