import { ethers } from 'ethers'
import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useState } from 'react'
import toast from "react-hot-toast"
import { useSigner } from 'wagmi'

const TEST_ERC20R_ADDRESS = "0x0f97e328cd9e2b842ada1a94545c32c121be2fe1";
const TEST_ERC20R_ABI = [
  {
    inputs: [
      { internalType: "string", name: "_name", type: "string" },
      { internalType: "string", name: "_symbol", type: "string" },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "timePeriod",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "timeLimit",
        type: "uint256",
      },
    ],
    name: "RecurringApproval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "from", type: "address" },
      { indexed: true, internalType: "address", name: "to", type: "address" },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [],
    name: "DOMAIN_SEPARATOR",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "", type: "address" },
      { internalType: "address", name: "", type: "address" },
    ],
    name: "allowance",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_amount", type: "uint256" }],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "nonces",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "owner", type: "address" },
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "value", type: "uint256" },
      { internalType: "uint256", name: "deadline", type: "uint256" },
      { internalType: "uint8", name: "v", type: "uint8" },
      { internalType: "bytes32", name: "r", type: "bytes32" },
      { internalType: "bytes32", name: "s", type: "bytes32" },
    ],
    name: "permit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "", type: "address" },
      { internalType: "address", name: "", type: "address" },
    ],
    name: "recurringAllowance",
    outputs: [
      { internalType: "uint256", name: "allowedAmount", type: "uint256" },
      { internalType: "uint256", name: "timePeriod", type: "uint256" },
      { internalType: "uint256", name: "timeLimit", type: "uint256" },
      { internalType: "uint256", name: "nextInterval", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
      { internalType: "uint256", name: "timePeriod", type: "uint256" },
      { internalType: "uint256", name: "timeLimit", type: "uint256" },
    ],
    name: "recurringApprove",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "transfer",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "from", type: "address" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "transferFrom",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "from", type: "address" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "transferFromRecurring",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const Home: NextPage = () => {
  const [number, setNumber] = useState(0)
  const [singlePrice, setSinglePrice] = useState(300)
  const [months, setMonths] = useState(6)
  const { data: signer } = useSigner()
  
  const setEMI = async () => {
    const toastId = toast.loading(
      `Buying Product 1 for $${singlePrice * number} on an EMI $${
        (singlePrice * number) / months
      } for ${months}`
    );

    try {
      // @ts-ignore
      const contract = new ethers.Contract(TEST_ERC20R_ADDRESS, TEST_ERC20R_ABI, signer)

      const tx = await contract.recurringApprove(
        ethers.constants.AddressZero,
        ethers.utils.parseEther((singlePrice * number).toString()),
        2678400,
        2678400 * months
      );

      console.log(tx)

      toast.success("Successfully bought Product 1 on EMI", {
        id: toastId,
      });
    } catch (e) {
      toast.error("Something wrong in transaction", {
        id: toastId
      })
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <Head>
        <title>ERC20R Demo</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex bg-gradient-to-b from-sky-600 via-gray-300 to-white text-black w-full h-screen flex-1 items-center justify-center px-20">
        <div className="w-full h-screen flex flex-col space-y-3 justify-center items-start">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/640px-Image_created_with_a_mobile_phone.png"
            alt=""
            className="w-56 rounded-md"
          />
          <div className="w-full h-fit flex flex-col space-y-2 justify-center items-start">
            <h1 className="text-3xl font-bold text-cal">Product Name</h1>
            <p className="text-matter w-1/2">
              A product description is the marketing copy that explains what a
              product is and why it's worth purchasing. The purpose of a product
              description is to supply customers with important information
              about the features and benefits of the product so they're
              compelled to buy.19-May-2020
            </p>
          </div>
          <div className="flex justify-center items-center text-matter font-bold space-x-3">
            <p>Price: {singlePrice} USDC</p>
          </div>
          <div className="flex justify-center items-center text-matter font-bold space-x-3">
            <p>Quantity: </p>
            <div className="text-matter font-bold px-3 py-2 border flex justify-start items-center space-x-8">
              <p
                onClick={() => setNumber((val) => (val > 0 ? val - 1 : val))}
                className="cursor-pointer select-none"
              >
                -
              </p>
              <p>{number}</p>
              <p
                onClick={() => setNumber((val) => val + 1)}
                className="cursor-pointer  select-none"
              >
                +
              </p>
            </div>
          </div>
        </div>
        <div className="w-full h-screen flex flex-col space-y-3 justify-center items-end">
          <div className="w-full h-fit flex flex-col space-y-2 justify-center items-end text-right">
            <h1 className="text-3xl font-bold text-cal">Order Summary</h1>
            <p className="text-matter w-1/2">
              Product Name x {number} ={" "}
              <span className="font-bold">{singlePrice * number}$</span>
            </p>
            <p className="text-matter w-1/2">
              EMI -{" "}
              <span className="font-bold">
                {(singlePrice * number) / months}$
              </span>{" "}
              Per Month
            </p>
            <div className="flex justify-center items-center text-matter font-bold space-x-3">
              <p>Months: </p>
              <div className="text-matter font-bold px-3 py-2 flex justify-start items-center space-x-8">
                <p
                  onClick={() => setMonths((val) => (val > 0 ? val - 1 : val))}
                  className="cursor-pointer select-none"
                >
                  -
                </p>
                <p>{months}</p>
                <p
                  onClick={() => setMonths((val) => val + 1)}
                  className="cursor-pointer  select-none"
                >
                  +
                </p>
              </div>
            </div>
            {number > 0 && (
              <div
                onClick={() => setEMI()}
                className="py-3 px-2 font-bold text-matter bg-emerald-600 rounded-md text-white cursor-pointer"
              >
                Buy on EMI
              </div>
            )}
            {number <= 0 && (
              <div
                className="py-3 px-2 font-bold text-matter bg-emerald-600/30 cursor-not-allowed rounded-md text-white cursor-pointer"
              >
                Buy on EMI
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Home
