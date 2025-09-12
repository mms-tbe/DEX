import Select from "react-select";
import React, { useState, useEffect, useMemo } from "react";
import { useMoralis, useNativeBalance } from "@moralisweb3/react";
import { useERC20Balance } from "../../hooks/useERC20Balance";

export default function SelectAsset({ setAsset }) {
  const { data: balance, nativeToken, error, isLoading } = useNativeBalance();
  const { assets } = useERC20Balance();
  const assetOptions = [
    {
      value: "eth",
      label: (
        <div>
          <img
            src="https://cryptologos.cc/logos/ethereum-eth-logo.png"
            height="20px"
            width="20px"
          />
          ETH
        </div>
      ),
    },
    {
      value: "eth",
      label: "BTC",
    },
  ];

  console.log(balance);

  return <Select placeholder="Select asset" options={assetOptions} />;
}
