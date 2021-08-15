import { NextPage } from 'next';

import { Elements } from '@stripe/react-stripe-js';
import getStripe from 'utils/get-stripejs';

import ElementsForm from 'components/Donate/ElementsForm';
import { useRouter } from 'next/router';

const DonatePage: NextPage = () => {
   const router = useRouter(); //TIP: thats how you access the value
   const { slug } = router.query;
   console.log('🌊 ~ file: [slug].tsx ~ line 12 ~ slug', slug);
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
