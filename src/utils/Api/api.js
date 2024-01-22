import Web3 from "web3";

let isItConnected = false;

const networks = {
  goerli: {
    chainId: "0x5",
    chainName: "Goerli test network",
    nativeCurrency: {
      name: "Goerli",
      symbol: "GoreliETH",
      decimals: 18,
    },
    rpcUrls: ["https://goerli.infura.io/v3/4f837ff6daa44f6aa9c39bfa87e9ca1f"],
    blockExplorerUrls: ["https://goerli.etherscan.io"],
  },
};

const changeNetwork = async ({ networkName }) => {
  try {
    if (!window.ethereum) throw new Error("No crypto wallet found");
    await window.ethereum.request({
      method: "wallet_addEthereumChain",
      params: [
        {
          ...networks[networkName],
        },
      ],
    });
  } catch (err) {
    console.log("Error adding network: ", err);
  }
};

const handleNetworkSwitch = async (networkName) => {
  await changeNetwork({ networkName });
};

let accounts;

const getAccounts = async () => {
  const web3 = window.web3;
  try {
    accounts = await web3.eth.getAccounts();
    return accounts;
  } catch (error) {
    console.log("Error while fetching accounts: ", error);
    return null;
  }
};

export const disconnectWallet = async () => {
  await window.ethereum.request({
    method: "wallet_requestPermissions",
    params: [{ eth_accounts: {} }],
  });
  console.log("disconnect");
};

export const loadWeb3 = async () => {
  try {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
      const netId = await window.web3.eth.getChainId();

      switch (netId.toString()) {
        case "5":
          isItConnected = true;
          break;
        default:
          await handleNetworkSwitch("goerli");
          isItConnected = false;
      }

      if (isItConnected) {
        let accounts = await getAccounts();
        return accounts[0];
      } else {
        return "Wrong Network";
      }
    } else {
      return "No Wallet";
    }
  } catch (error) {
    return "No Wallet";
  }
};
