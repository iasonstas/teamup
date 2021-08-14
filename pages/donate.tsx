import { NextPage } from 'next';

import { Elements } from '@stripe/react-stripe-js';
import getStripe from 'utils/get-stripejs';

import ElementsForm from 'components/Donate/ElementsForm';

const DonatePage: NextPage = () => {
   return (
      <div className="page-container">
         <h1>Donate with Elements</h1>
         <p>Donate to our project 💖</p>
         <Elements stripe={getStripe()}>
            <ElementsForm />
         </Elements>
      </div>
   );
};

export default DonatePage;
