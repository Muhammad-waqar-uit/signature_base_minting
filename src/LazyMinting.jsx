import React, { useState } from "react";
import Web3 from "web3";

const SIGNING_DOMAIN_NAME = "Voucher-Domain";
const SIGNING_DOMAIN_VERSION = "1";
const chainId = 80002;
const contractAddress = "0xa131AD247055FD2e2aA8b156A11bdEc81b9eAD95"; // Put the address here from remix

const LazyMinting = () => {
  const [voucher, setVoucher] = useState(null);

  const createVoucher = async (web3, account, tokenId, uri, buyer) => {
    const domain = {
      name: SIGNING_DOMAIN_NAME,
      version: SIGNING_DOMAIN_VERSION,
      verifyingContract: contractAddress,
      chainId,
    };

    const voucher = { tokenId, uri, buyer };
    const types = {
      LazyNFTVoucher: [
        { name: "tokenId", type: "uint256" },
        { name: "uri", type: "string" },
        { name: "buyer", type: "address" },
      ],
    };

    const typedData = JSON.stringify({
      domain,
      message: voucher,
      primaryType: "LazyNFTVoucher",
      types: {
        EIP712Domain: [
          { name: "name", type: "string" },
          { name: "version", type: "string" },
          { name: "chainId", type: "uint256" },
          { name: "verifyingContract", type: "address" },
        ],
        LazyNFTVoucher: [
          { name: "tokenId", type: "uint256" },
          { name: "uri", type: "string" },
          { name: "buyer", type: "address" },
        ],
      },
    });

    const signature = await web3.currentProvider.send("eth_signTypedData_v4", [
      account,
      typedData,
    ]);
    return {
      ...voucher,
      signature: signature.result,
    };
  };

  const handleSign = async () => {
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const accounts = await web3.eth.getAccounts();
      const voucher = await createVoucher(
        web3,
        accounts[0],
        5,
        "uri",
        accounts[0]
      );
      setVoucher(voucher);
    } else {
      alert("MetaMask is not installed");
    }
  };

  return (
    <div>
      <button onClick={handleSign}>Sign Voucher with MetaMask</button>
      {voucher && (
        <div>
          <h3>Voucher</h3>
          <pre>{JSON.stringify(voucher, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default LazyMinting;
