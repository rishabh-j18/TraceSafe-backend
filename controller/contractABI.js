const contractABI = [
    {
      inputs: [],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint256",
          name: "reportId",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "string",
          name: "fullName",
          type: "string",
        },
        {
          indexed: false,
          internalType: "string",
          name: "lastSeenDate",
          type: "string",
        },
        {
          indexed: false,
          internalType: "string",
          name: "lastSeenLocation",
          type: "string",
        },
        {
          indexed: false,
          internalType: "string",
          name: "photoUrl",
          type: "string",
        },
        {
          indexed: true,
          internalType: "address",
          name: "reporter",
          type: "address",
        },
      ],
      name: "NewReport",
      type: "event",
    },
    {
      inputs: [],
      name: "getTotalReports",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_reportId",
          type: "uint256",
        },
      ],
      name: "getReport",
      outputs: [
        {
          internalType: "string",
          name: "fullName",
          type: "string",
        },
        {
          internalType: "string",
          name: "lastSeenDate",
          type: "string",
        },
        {
          internalType: "string",
          name: "lastSeenLocation",
          type: "string",
        },
        {
          internalType: "string",
          name: "photoUrl",
          type: "string",
        },
        {
          internalType: "address",
          name: "reporter",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "string",
          name: "_fullName",
          type: "string",
        },
        {
          internalType: "string",
          name: "_lastSeenDate",
          type: "string",
        },
        {
          internalType: "string",
          name: "_lastSeenLocation",
          type: "string",
        },
        {
          internalType: "string",
          name: "_photoUrl",
          type: "string",
        },
      ],
      name: "submitReport",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      name: "reports",
      outputs: [
        {
          internalType: "string",
          name: "fullName",
          type: "string",
        },
        {
          internalType: "string",
          name: "lastSeenDate",
          type: "string",
        },
        {
          internalType: "string",
          name: "lastSeenLocation",
          type: "string",
        },
        {
          internalType: "string",
          name: "photoUrl",
          type: "string",
        },
        {
          internalType: "address",
          name: "reporter",
          type: "address",
        },
        {
          internalType: "bool",
          name: "exists",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "reportCount",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
  ];

  module.exports=contractABI;