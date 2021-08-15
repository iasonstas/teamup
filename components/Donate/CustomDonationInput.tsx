import React from 'react';
import { formatAmountForDisplay } from 'utils/stripe-helpers';

type Props = {
   name: string;
   value: number;
   min: number;
   max: number;
   currency: string;
   step: number;
   onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
   className?: string;
};

const CustomDonationInput = ({ name, value, min, max, currency, step, onChange, className }: Props) => (
   <label>
      Custom donation amount ({formatAmountForDisplay(min, currency)}-{formatAmountForDisplay(max, currency)}
      ):
      {/* <div className="flex"> */}
      <div className="flex-col">
         <input
            className={className}
            type="number"
            name={name}
            value={value}
            min={min}
            max={max}
            step={step}
            onChange={onChange}
         ></input>
         <input
            type="range"
            name={name}
            value={value}
            min={min}
            max={max}
            step={step}
            onChange={onChange}
         ></input>
      </div>
      {/* <div className="flex justify-around w-6/12">
         <button value={5}>5</button>
         <button value={20}>20</button>
         <button value={5}>50</button>
      </div> */}
      {/* </div> */}
   </label>
);

export default CustomDonationInput;
