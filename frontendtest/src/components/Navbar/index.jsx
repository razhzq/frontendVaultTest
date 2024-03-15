'use client';

import { useState } from "react";
import { Button, Navbar } from 'flowbite-react';
import Web3 from 'web3';
import {atom, useAtom, useAtomValue} from 'jotai'

import MockUSD from '../../contracts/MockUSD.json';
const MockUSDAddress = '0x2d7385029a42FAd328569D47F528a10CB7c7c108'

import VaultABI from '../../contracts/Vault.json';
const VaultAddress = '0x20983c12c3D9f25885D9723b1b7c7D576379F930'

export const usdAtom = atom({});
export const vaultAtom = atom({});
export const walletAtom = atom("")


const chainIdTestnet = 84532;

function NavbarComp() {

    const [wallet, setWallet] = useAtom(walletAtom)
    const [mockUSD, setMockUSD] = useAtom(usdAtom);
    const [vaultCont, setVaultCont] = useAtom(vaultAtom);

    const handleConnectWallet = async () => {
        if (window.ethereum) {

          let provider = window.ethereum;

          if (window.ethereum.networkVersion !== chainIdTestnet) {
            try {
              await window.ethereum.request({
                method: "wallet_switchEthereumChain",
                params: [{ chainId: web3.utils.toHex(chainIdTestnet) }],
              });
            } catch (err) {
              if (err.code === 4902) {
                await window.ethereum.request({
                  method: "wallet_addEthereumChain",
                  params: [
                    {
                      chainName: "Base Sepolia",
                      chainId: web3.utils.toHex(chainIdTestnet),
                      nativeCurrency: {
                        name: "ETH",
                        decimals: 18,
                        symbol: "ETH",
                      },
                      rpcUrls: ["https://canto-testnet.plexnode.wtf"],
                    },
                  ],
                });
              }
            }
    
            await window.ethereum
              .request({ method: "eth_requestAccounts" })
              .then((accounts) => {
                setWallet(accounts[0]);
              });

            const web3 = new Web3(provider);
            const mockUsdContract = new web3.eth.Contract(MockUSD.abi, MockUSDAddress);
            setMockUSD(mockUsdContract);
            const vaultContract = new web3.eth.Contract(VaultABI.abi, VaultAddress);
            setVaultCont(vaultContract)

          } else {
            await window.ethereum
              .request({ method: "eth_requestAccounts" })
              .then((accounts) => {
                setWallet(accounts[0]);
              });
          }
        } else {
          window.alert("No web3 wallet detected. Please Install metamask!");
        }
      };


    return (
     <Navbar fluid rounded>
      <Navbar.Brand href="https://flowbite-react.com">
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">Vault</span>
      </Navbar.Brand>
      <div className="flex md:order-2">
        <Button onClick={handleConnectWallet}>
            {/* Connect Wallet */}
          {wallet
            ? `${wallet.substring(0, 3)}...${wallet.substring(
                wallet.length - 3
              )}`
            : "Connect Wallet"}
        </Button>
        <Navbar.Toggle />
      </div>
    </Navbar>
    )
}


export default NavbarComp;