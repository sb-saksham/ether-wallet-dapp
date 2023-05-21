import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import EtherWallet from "./artifacts/contracts/EtherWallet.sol/EtherWallet.json";
import './App.css';

function App() {
  const etherWalletAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const [account, setAccount] = useState('');
  const [balance, setBalance] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [shouldDisable, setShouldDisable] = useState(false);
// Smart contract functions
  const [scBalance, setScBalance] = useState(0);
  const [ethToUseForDeposit, setEthToUseForDeposit] = useState(0);
  const [recieverAddress, setRecieverAddress] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState(0);
  useEffect(() => {
    const getScBalance = async () => {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(
          etherWalletAddress,
          EtherWallet.abi,
          provider
        );
        let balance = await contract.balanceOf();
        balance = ethers.utils.formatEther(balance);
        setScBalance(balance);
      } catch (error) {
        console.log("Error while connecting to Wallet!", error);
      }
    }
    getScBalance();
  }, [])
  //withdraw ether from wallet
  const withdrawFromWallet = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner(account);
      const contract = new ethers.Contract(
        etherWalletAddress,
        EtherWallet.abi,
        signer
      );
      // try { parseFloat(withdrawAmount) }catch(err){console.log("Enter a valid value!")};
      const tx = await contract.withdraw(recieverAddress, ethers.utils.parseEther(withdrawAmount));
      await tx.wait();
      let balance = await contract.balanceOf();
      balance = ethers.utils.formatEther(balance);
      setScBalance(balance);
      balance = await signer.getBalance();
      balance = ethers.utils.formatEther(balance);
      setBalance(balance);
      setWithdrawAmount(0);
      setRecieverAddress("");
    } catch (err) {
      console.log(err);
    }
  }
  // Deposit ether to wallet
  const depositToEtherWalletSc = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner(account);
    const contract = new ethers.Contract(
      etherWalletAddress,
      EtherWallet.abi,
      signer
    );
    const tr = await contract.deposit({
      value: ethers.utils.parseEther(ethToUseForDeposit)
    })
    await tr.wait();
    let balance = await contract.balanceOf();
    balance = ethers.utils.formatEther(balance);
    setScBalance(balance);
    balance = await signer.getBalance();
    balance = ethers.utils.formatEther(balance);
    setBalance(balance);
    setEthToUseForDeposit(0);
  }
  //Metamask handling
  const connectToMetamask = async () => {
    try {
      setShouldDisable(true);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send('eth_requestAccounts', []);
      const signer = provider.getSigner();
      const account = await signer.getAddress();
      let balance = await signer.getBalance();
      balance = ethers.utils.formatEther(balance);
      setAccount(account);
      setBalance(balance);
      setIsActive(true);
      setShouldDisable(false);
    } catch (error) {
      console.log('Error in connecting!');
    }
  }
  const disconnectMetamask = async () => {
    setAccount('');
    setBalance(0);
    setIsActive(false);
  }
  return (
    <div className="App">
      <header className="App-header">
        <h2>ETHer wallet Implementation</h2>
        <h5>Allows User that deploys the contract to withdraw money deposited by anyone to this wallet instance.</h5>
        <h5>Ether Wallet Smart Contract Adddress: {etherWalletAddress}</h5>
        <h5>Ether Wallet Smart Contract Balance: {scBalance}</h5>
        {isActive ? (<>
          <div>
            Connected Account: {account}
            <br/>
            Balance: {balance} ETH
          </div>
          <hr/>
          <Button variant="danger" disabled={!isActive} onClick={disconnectMetamask} >
            Disconnect MetaMask {' '}
            <img src="images/hand.svg" width="50" height="50" alt="" />
          </Button>
          <hr/>
          <h4>Deposit to Wallet</h4>
          <Form className="m-3">
            <Form.Group className="mb-3" controlId="numberInEth">
              <Form.Control type="number" placeholder="Enter amount in ETH" value={ethToUseForDeposit === 0 ? null : ethToUseForDeposit}
                onChange={(e) => setEthToUseForDeposit(e.target.value)}></Form.Control>
            </Form.Group>
            <Button variant="primary" onClick={depositToEtherWalletSc}>
              Deposit to Wallet
            </Button>
          </Form>
          <h4>Withdraw from Wallet (Owner only Operation)</h4>
          <Form className="m-3">
            <Form.Group className="mb-3" controlId="ethAddress">
              <Form.Control type="text" placeholder="Enter receiver address 0x" value={recieverAddress}
                onChange={(e) => setRecieverAddress(e.target.value)}></Form.Control>
            </Form.Group>
            <Form.Group className="mb-3" controlId="withdrawAmount">
              <Form.Control type="number" placeholder="Withdraw Amount in ETH" value={withdrawAmount === 0 ? null : withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}></Form.Control>
            </Form.Group>
            <Button variant="primary" onClick={withdrawFromWallet}>
              Withdraw from Wallet
            </Button>
          </Form>
        </>) :
          (<Button variant="secondary" disabled={shouldDisable} onClick={connectToMetamask} >
            <img src="images/metamask.svg" alt="MetaMask"
              width="50" height="50" />
            Connect To MetaMask
          </Button>)
        }
      </header>
    </div>
  );
}

export default App;
