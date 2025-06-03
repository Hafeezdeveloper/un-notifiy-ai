import React from 'react';
import { FiCheckCircle, FiXCircle } from "react-icons/fi";
import BsVerifired from './BsVerifired';
import moment from 'moment';

const BsTable = (props: any) => {
  let { data, headers } = props

  const getValueByPath = (obj: any, path: string): any => {
    return path.split('.').reduce((acc, part) => acc?.[part], obj);
  };

  return (
    <div className="overflow-x-auto  rounded-lg border border-gray-200">
      <table className="min-w-full bg-white text-sm text-left">
        <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
          <tr>
            {headers && headers?.map((head: any, idx: any) => (
              <th key={idx} className="px-6 py-3 font-semibold tracking-wider">
                {head.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="text-gray-700">
          {data && data.length > 0 && data?.map((x: any, i: any) => {
            return (
              <tr key={i} className="hover:bg-gray-50 transition-colors">
                {headers && headers?.map((key: any, index: any) => {
                  const value = getValueByPath(x, key.key);
                  return (
                    <td key={index} className="px-6 py-4">
                    {key.displayField ? (
                      key.displayField(x)
                    ) : key.key === 'isVerified' ? (
                      <BsVerifired condition={value} icon={true} />
                    ) : key.key === 'status' && value === 'pending' || value === 'declined'  ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold text-red-700 bg-red-100 border border-red-400 ">
                        {value}
                      </span>
                    ) : key.key === 'status' && value === 'approved' ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold text-green-700 bg-green-100 border border-green-400">
                        {value}
                      </span>
                    ) : (
                      key.key == "createdAt" ? moment(value).format('MMM Do YY'): value
                    )}
                  </td>
                  
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div >
  );
};

export default BsTable;
