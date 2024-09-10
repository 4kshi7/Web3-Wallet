import React, { useState } from "react";
import { mnemonicToSeed } from "bip39";
import { derivePath } from "ed25519-hd-key";
import nacl from "tweetnacl";
import { Keypair } from "@solana/web3.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { BsEyeSlashFill } from "react-icons/bs";

export const SolWallet = ({ mnemonic }) => {
  const [index, setIndex] = useState(0);
  const [publicKeys, setPublicKeys] = useState([]);
  const [balances, setBalances] = useState({});

  const generate = async () => {
    if (!mnemonic) {
      toast.error("Please create a seed phrase first!");
      return;
    }

    const seed = await mnemonicToSeed(mnemonic);
    const path = `m/44'/501'/${index}'/0'`;
    const derivedSeed = derivePath(path, seed.toString("hex")).key;
    const keypair = Keypair.fromSecretKey(
      nacl.sign.keyPair.fromSeed(derivedSeed).secretKey
    );

    setIndex(index + 1);
    setPublicKeys([...publicKeys, keypair.publicKey.toBase58()]);
  };

  const fetchBalance = async (publicKey) => {
    try {
      const response = await axios.post(
        `https://solana-mainnet.g.alchemy.com/v2/${
          import.meta.env.VITE_ALCHEMY_API
        }`,
        {
          jsonrpc: "2.0",
          id: 1,
          method: "getBalance",
          params: [publicKey],
        }
      );

      const balance = response.data.result.value / 1e9;
      setBalances((prevBalances) => ({
        ...prevBalances,
        [publicKey]: balance,
      }));
    } catch (error) {
      toast.error("Failed to fetch balance!");
      console.error("Error fetching balance:", error);
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
              <li
                key={idx}
                className="bg-gray-100 p-3 rounded-md text-sm break-all"
              >
                <span className="font-semibold">Sol Wallet {idx + 1}:</span> {key}
                <button
                  onClick={() => fetchBalance(key)}
                  className="ml-4 text-blue-600 font-semibold rounded-xl"
                >
                  Show Bal
                </button>
                {balances[key] !== undefined && (
                  <div className="mt-2 text-sm">
                    <span className="font-semibold">Balance:</span>{" "}
                    {balances[key]} SOL
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      <ToastContainer position="bottom-right" />
    </div>
  );
};
