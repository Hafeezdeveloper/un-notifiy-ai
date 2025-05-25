import React from 'react';
import { FiCheckCircle, FiXCircle } from 'react-icons/fi';

const BsVerifired = (props: any) => {
  const { condition } = props;

  return (
    <span
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold 
        ${condition
          ? 'text-green-700 bg-green-100 border border-green-400'
          : 'text-red-700 bg-red-100 border border-red-400'
        }`}
    >
      {condition ? (
        <>
          Verified
          <FiCheckCircle className="text-green-600 text-sm" />
        </>
      ) : (
        <>
          Unverified
          <FiXCircle className="text-red-600 text-sm" />
        </>
      )}
    </span>
  );
};

export default BsVerifired;
