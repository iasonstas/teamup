import { NextPage } from 'next';

import { Elements } from '@stripe/react-stripe-js';
import getStripe from 'utils/get-stripejs';

import ElementsForm from 'components/Donate/ElementsForm';

const DonatePage: NextPage = () => {
   return (
      <div className="container flex-col items-center">
         <h1 className="text-center">Donate to your selected project 💖</h1>
         <Elements stripe={getStripe()}>
            <ElementsForm />
         </Elements>
      </div>
   );
};

export default DonatePage;
