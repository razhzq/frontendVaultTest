import { Button, Modal, TextInput } from 'flowbite-react';
import {useEffect, useState} from 'react'
import { ethers } from 'ethers';

import { useAtomValue } from 'jotai';
import { usdAtom, walletAtom, vaultAtom } from '../Navbar';



function MainVault() {

    const [vaultBalance, setVaultBalance] = useState(0)
    const [openModal, setOpenModal] = useState(false);
    const [openModalWd, setOpenModalWd] = useState(false);
    const [depositAmount, setDepositAmount] = useState(0);
    const [withdrawAmount, setWithdrawAmount] = useState(0);
    const mockUsdContract = useAtomValue(usdAtom);
    const user = useAtomValue(walletAtom);
    const vault = useAtomValue(vaultAtom);


    const depositVault = async () => {
        setOpenModal(false)
        console.log(depositAmount);
        const convertedAmount = ethers.parseUnits(depositAmount, 18);

        await mockUsdContract.methods.approve("0x20983c12c3D9f25885D9723b1b7c7D576379F930", convertedAmount).send({ from: user })
        .on('transactionHash', async (hash) => {
            await vault.methods.deposit(convertedAmount).send({from : user})
        })
    }

    const withdrawVault = async () => {
        setOpenModalWd(false)
        const convertedAmount = ethers.parseUnits(withdrawAmount, 18);
        await vault.methods.withdraw(convertedAmount).send({from: user});
    }

    const checkVaultBalance = async () => {
        const balance = await mockUsdContract.methods.balanceOf("0x20983c12c3D9f25885D9723b1b7c7D576379F930").call();
        const convertedBalance = ethers.formatUnits(balance, 18);
        setVaultBalance(convertedBalance)
        console.log('vault balance: ', convertedBalance);
    }

    const checkMyBalance = async () => {
       const myBalance =  await vault.methods.getBalance(user).call();
       console.log('myBalance: ', myBalance)
    }

    const mintMock = async() => {
        const amount = ethers.parseUnits("10000", 18);
        await mockUsdContract.methods.mint(amount).send({from: user});
    }

    useEffect(() => {
        if(mockUsdContract) {
            checkVaultBalance();
            checkMyBalance();
        }

    }, [mockUsdContract])

    return (
        <div className=" w-screen flex justify-center items-center">
            <div className=" w-[40%] p-5 border-2 border-red-500 text-black">
                <div className=" w-full h-[50px] flex justify-between border items-center">
                    <span>Vault Balance: </span>
                    <span>{vaultBalance}</span>
                </div>
                <div className=" w-full h-[50px] mt-5 flex justify-between border items-center">
                    <span>My Balance: </span>
                    <span>{vaultBalance}</span>
                </div>
                <div className=" w-full h-[50px] mt-5 flex justify-evenly border items-center">
                    <Button onClick={() => setOpenModal(true)}>Deposit</Button>
                       <Modal show={openModal} onClose={() => setOpenModal(false)}>
                          <Modal.Header>Deposit</Modal.Header>
                           <Modal.Body>
                            <div className="space-y-6">
                                 <TextInput onChange={(e) => setDepositAmount(e.target.value)} type='number' value={depositAmount}  />
                            </div>
                            </Modal.Body>
                           <Modal.Footer>
                              <Button onClick={() => depositVault()}>Confirm</Button>
                           </Modal.Footer>
                        </Modal>
                    <Button onClick={() => setOpenModalWd(true)}>Withdraw</Button>
                    <Modal show={openModalWd} onClose={() => setOpenModalWd(false)}>
                          <Modal.Header>Withdraw</Modal.Header>
                           <Modal.Body>
                            <div className="space-y-6">
                                 <TextInput onChange={(e) => setWithdrawAmount(e.target.value)} type='number' value={withdrawAmount}  />
                            </div>
                            </Modal.Body>
                           <Modal.Footer>
                              <Button onClick={() => withdrawVault()}>Confirm</Button>
                           </Modal.Footer>
                        </Modal>

                    <Button onClick={() => mintMock()}>Mint MockUSD</Button>
                </div>
            </div>
        </div>
    )
}


export default MainVault;