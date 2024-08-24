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
    <>
      <button onClick={createSeedPhrase}>Create Seed Phrase</button>
      <p>{mnemonic}</p>
      <div>
        <SolWallet mnemonic={mnemonic} />
      </div>
    </>
  );
}

export default App;
