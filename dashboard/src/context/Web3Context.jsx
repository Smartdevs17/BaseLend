import React, { createContext, useContext, useState, useEffect } from "react";
import { ethers } from "ethers";

const Web3Context = createContext();

export const Web3Provider = ({ children }) => {
    const [account, setAccount] = useState(null);
    const [contracts, setContracts] = useState({});
    const [provider, setProvider] = useState(null);

    const connectWallet = async () => {
        if (window.ethereum) {
            try {
                const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
                setAccount(accounts[0]);
                const _provider = new ethers.BrowserProvider(window.ethereum);
                const signer = await _provider.getSigner();
                setProvider(_provider);

                // Placeholder for contract initialization
                // const baseLend = new ethers.Contract(ADDRESS, ABI, signer);
                // setContracts({ BaseLend: baseLend });

                console.log("Connected:", accounts[0]);
            } catch (err) {
                console.error("Connection failed", err);
            }
        } else {
            alert("Please install MetaMask!");
        }
    };

    useEffect(() => {
        if (window.ethereum) {
            window.ethereum.on("accountsChanged", (accounts) => {
                setAccount(accounts[0] || null);
            });
        }
    }, []);

    return (
        <Web3Context.Provider value={{ account, contracts, provider, connectWallet }}>
            {children}
        </Web3Context.Provider>
    );
};

export const useWeb3 = () => useContext(Web3Context);
