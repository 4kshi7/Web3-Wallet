import React, { useState } from "react";
import { mnemonicToSeed } from "bip39";
import { derivePath } from "ed25519-hd-key";
import nacl from "tweetnacl";
import { Keypair } from "@solana/web3.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const SolWallet = ({ mnemonic }) => {
  const [index, setIndex] = useState(0);
  const [publicKeys, setPublicKeys] = useState([]);

  const generate = async () => {
    if (!mnemonic) {
      toast.error("Please create a seed phrase first!");
      return;
    } else {
      const seed = await mnemonicToSeed(mnemonic);
      const path = `m/44'/501'/${index}'/0'`;
      const derivedSeed = derivePath(path, seed.toString("hex")).key;
      const keypair = Keypair.fromSecretKey(
        nacl.sign.keyPair.fromSeed(derivedSeed).secretKey
      );
      setIndex(index + 1);
      setPublicKeys([...publicKeys, keypair.publicKey.toBase58()]);
    }
  };

  return (
    <>
      <button onClick={generate}>Add Solana Wallet</button>

      {publicKeys.map((key, idx) => (
        <div key={idx}>
          Wallet {idx} - {key}
        </div>
      ))}

      <ToastContainer />
    </>
  );
};
