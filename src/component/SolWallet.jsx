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
    <div>
      <button
        onClick={generate}
        className="w-full bg-gray-400 text-white py-2 px-4 rounded-md hover:bg-black transition duration-300 mb-4"
      >
        Add Solana Wallet
      </button>

      {publicKeys.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-2">Your Wallets:</h2>
          <ul className="space-y-2">
            {publicKeys.map((key, idx) => (
              <li key={idx} className="bg-gray-100 p-3 rounded-md text-sm break-all">
                <span className="font-semibold">Wallet {idx + 1}:</span> {key}
              </li>
            ))}
          </ul>
        </div>
      )}

      <ToastContainer position="bottom-right" />
    </div>
  );
};