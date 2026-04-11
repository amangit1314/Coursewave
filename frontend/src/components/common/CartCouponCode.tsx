"use client";

import React from "react";

export function CartCouponCode() {
  const [isCouponInputVisible, setIsCouponInputVisible] = React.useState(false);
  const [enteredCode, setEnteredCode] = React.useState("");

  const handleAddCouponClick = () => {
    setIsCouponInputVisible(true);
  };

  const handleCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEnteredCode(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <div
      className={`flex ${
        enteredCode ? "flex-col items-center justify-start" : "flex-row"
      } items-center justify-between border-t border-gray-200 pt-4`}
    >
      {!isCouponInputVisible && (
        <button
          onClick={handleAddCouponClick}
          className="cursor-pointer text-sm font-medium text-blue-500 opacity-50 transition-all duration-100 hover:no-underline hover:opacity-100 dark:opacity-80"
        >
          Add a coupon
        </button>
      )}
      {isCouponInputVisible && (
        <div className="relative flex items-center justify-between">
          <input
            type="text"
            aria-label="Enter Coupon Code"
            placeholder="Enter code here ..."
            value={enteredCode}
            onChange={handleCodeChange}
            className="mt-2 rounded-lg border border-gray-200 py-2 pl-4 pr-8 text-gray-700"
          />
          <button
            type="submit"
            form="coupon-form"
            className="absolute bottom-0 right-0 top-0 mr-4 mt-2 flex items-center justify-center rounded-lg bg-blue-300 px-4 text-xs font-semibold text-blue-500 hover:bg-blue-500 hover:text-white"
          >
            Apply
          </button>
          <form id="coupon-form" onSubmit={handleSubmit} className="hidden" />
        </div>
      )}
      {enteredCode && (
        <p className="mt-2">
          Entered code: <span className="text-blue-500">{enteredCode}</span>
        </p>
      )}
    </div>
  );
}
