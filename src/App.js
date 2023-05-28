import { ConnectButton } from "@rainbow-me/rainbowkit";
import {
  useContractWrite,
  useContractRead,
  useAccount,
  usePrepareContractWrite
} from 'wagmi';

import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
// import Modal from "bootstrap/Modal";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import EtherWallet from "./artifacts/contracts/EtherWallet.sol/EtherWallet.json";

function App() {
  const etherWalletAddress = "0x28892DD79c562A9e9A5242B9f9b478C1CF8d8d23";
  
  // Smart contract functions
  const [scBalance, setScBalance] = useState(0);
  const [ethToUseForDeposit, setEthToUseForDeposit] = useState(0);
  const [contOwner, setContOwner] = useState('');
  const [updBalance, setUpdateBalance] = useState(0);
  const [recieverAddress, setRecieverAddress] = useState("0x0000000000000000000000000000000000000000");
  const [withdrawAmount, setWithdrawAmount] = useState(0);
  const { address: signer } = useAccount();
  //Contract balance and owner
  const { data: owner, error: ownerFetchError } = useContractRead({
    address: etherWalletAddress,
    abi: EtherWallet.abi,
    functionName: "owner",
    watch: true,
  });
  const { data: contractBalance, error: balanceFetchError } = useContractRead({
    address: etherWalletAddress,
    abi: EtherWallet.abi,
    functionName: "balanceOf",
    watch: true,
  });
  useEffect(() => {
    if (owner) {
      setContOwner(owner);
    }
  }, [owner]);
  useEffect(() => {
    if (contractBalance) {
      setScBalance(ethers.utils.formatEther(contractBalance));
    }
  }, [contractBalance, updBalance]);
  //Deposit functionality
  const { config: depositConfig } = usePrepareContractWrite({
    address: etherWalletAddress,
    abi: EtherWallet.abi,
    functionName: "deposit",
    value: ethers.utils.parseEther(ethToUseForDeposit.toString()).toBigInt(),
  });
  const { data: depositData,
    isLoading: depositIsLoading,
    isSuccess: depositIsSuccess,
    write: depositWrite, error: depositWriteError } = useContractWrite(depositConfig);
  //Withdraw Functionality
  const { config: withdrawConfig } = usePrepareContractWrite({
    address: etherWalletAddress,
    abi: EtherWallet.abi,
    functionName: "withdraw",
    args: [recieverAddress, ethers.utils.parseEther(withdrawAmount.toString()).toBigInt()]
  });
  const { data: withdrawData,
    isLoading: withdrawIsLoading,
    isSuccess: withdrawIsSuccess,
    write: withdrawWrite, error: withdrawWriteError } = useContractWrite(withdrawConfig);
  
  return (
    <div className="container container-flex p-4 m-5 text-center">
      <h3>Ether Wallet Smart Dapp</h3>
      <h5>Contract Deployed by(Owner): { contOwner }</h5>
      <h5>ETHer Wallet Smart Contract Address: {etherWalletAddress}</h5>
      <h5>ETHer Wallet Smart Contract Balance: {balanceFetchError ? 0 : scBalance}</h5>
      {balanceFetchError ? <>balanceFetchError.message</> : null}
      <Card>
        <Card.Body className="mx-auto"><ConnectButton /></Card.Body>
      </Card>
      <Card>
        <Card.Body>
          <Card.Title>Deposit to ETHer Wallet Smart Contract</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">Only Owners{"(contract deployers)"} can withdraw Deposited Amount</Card.Subtitle>
          <Form>
            <Form.Group controlId="numberInEth" className="mb-3" >
              <Form.Control type="text" className="m-3" width={"50%"} placeholder="Deposit Amount in ETH"
                onChange={(e) => { setEthToUseForDeposit(e.target.value) }}
              />
              {depositWriteError ? 
                <Form.Control.Feedback type="invalid">{ depositWriteError.message}</Form.Control.Feedback> : null
              }
              <Button disabled={!depositWrite || depositIsLoading || depositWriteError}
                onClick={() => {
                  // console.log(ethToUseForDeposit, ethers.utils.parseEther(ethToUseForDeposit))
                  depositWrite?.();
                  setUpdateBalance(1);
                }}
              >
                Deposit</Button>
                {depositIsLoading && <div>Check Wallet</div>}
                {depositIsSuccess && <div>Transaction: {JSON.stringify(depositData)}</div>}
            </Form.Group>
          </Form>
        </Card.Body>
      </Card>
      <Card>
        <Card.Body>
          <Card.Title>Withdraw from ETHer Wallet Smart Contract</Card.Title>
          <Card.Subtitle>Owner Only functionality</Card.Subtitle>
          <hr/>
          <Form disabled={signer != contOwner}>
            <Form.Group controlId="recieverAddress" className="mb-3" >
              <Form.Label>Reciever Address</Form.Label>
              <Form.Control type="text" className="m-3" isValid={withdrawWriteError} placeholder="Reciever Address '0x...'"
                onChange={(e) => { setRecieverAddress(e.target.value) }}
              />
              {withdrawWriteError ? 
                <Form.Control.Feedback type="invalid">{withdrawWriteError.message}</Form.Control.Feedback> : null
              }
            </Form.Group>
            <Form.Group controlId="withInEth" className="mb-3" >
              <Form.Label>Withdraw Amount</Form.Label>
              <Form.Control type="text" isValid={withdrawWriteError} className="m-3" placeholder="WIthdraw amount in ETH"
                onChange={(e) => { setWithdrawAmount(e.target.value) }}
                />
            </Form.Group>
              <Button disabled={!withdrawWrite || withdrawIsLoading || withdrawWriteError}
                onClick={() => {
                  withdrawWrite?.();
                  setUpdateBalance(1);
                }}
              >
                Withdraw</Button>
                {withdrawIsLoading && <div>Check Wallet...</div>}
                {withdrawIsSuccess && <div>Transaction: {JSON.stringify(depositData)}</div>}
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}

export default App;