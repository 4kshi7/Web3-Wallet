import { useState } from "react";
import { generateMnemonic } from "bip39";
import { SolWallet } from "./component/SolWallet";

function App() {
  const [mnemonic, setMnemonic] = useState("");

  const createSeedPhrase = async function () {
    const mn = await generateMnemonic();
    setMnemonic(mn);
  };

  return (
    <div className="min-h-screen px-4 bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-bold mb-6 text-center">Web3 Wallet</h1>
        <button
          onClick={createSeedPhrase}
          className="w-full bg-gray-400 text-white py-2 px-4 rounded-md hover:bg-black transition duration-300 mb-4"
        >
          Create Seed Phrase
        </button>
        {mnemonic && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Your Seed Phrase:</h2>
            <p className="bg-gray-100 p-3 rounded-md text-sm break-words">{mnemonic}</p>
          </div>
        )}
        <SolWallet mnemonic={mnemonic} />
      </div>
    </div>
  );
}

export default App;