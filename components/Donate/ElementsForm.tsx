import CustomDonationInput from 'components/Donate/CustomDonationInput';
import PrintObject from 'utils/PrintObject';

import { fetchPostJSON } from 'utils/api-helpers';
import { formatAmountForDisplay } from 'utils/stripe-helpers';
import * as config from 'components/config';

import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { ChangeEventHandler, FormEventHandler, useState } from 'react';

import styles from 'styles/Donate.module.scss';

const ElementsForm = () => {
   const [input, setInput] = useState({
      customDonation: Math.round(config.MAX_AMOUNT / config.AMOUNT_STEP),
      cardholderName: ''
   });
   const [payment, setPayment] = useState({ status: 'initial' });
   const [errorMessage, setErrorMessage] = useState('');
   const stripe = useStripe();
   const elements = useElements();

   const PaymentStatus = ({ status }: { status: string }) => {
      switch (status) {
         case 'processing':
         case 'requires_payment_method':
         case 'requires_confirmation':
            return <h2>Processing...</h2>;
         case 'requires_action':
            return <h2>Authenticating...</h2>;
         case 'succeeded':
            return <h2>Payment Succeeded 🥳</h2>;
         case 'error':
            return (
               <>
                  <h2>Error 😭</h2>
                  <p className={styles.errorMessage}>{errorMessage}</p>
               </>
            );
         default:
            return null;
      }
   };

   const handleInputChange: ChangeEventHandler<HTMLInputElement> = e =>
      setInput({
         ...input,
         [e.currentTarget.name]: e.currentTarget.value
      });

   const handleSubmit: FormEventHandler<HTMLFormElement> = async e => {
      e.preventDefault();
      // Abort if form isn't valid
      if (!e.currentTarget.reportValidity()) return;
      setPayment({ status: 'processing' });

      // Create a PaymentIntent with the specified amount.
      const response = await fetchPostJSON('/api/payment-intents', {
         amount: input.customDonation
      });

      setPayment(response);

      if (response.statusCode === 500) {
         setPayment({ status: 'error' });
         setErrorMessage(response.message);
         return;
      }

      // Get a reference to a mounted CardElement. Elements knows how
      // to find your CardElement because there can only ever be one of
      // each type of element.
      const cardElement = elements!.getElement(CardElement);

      // Use your card Element with other Stripe.js APIs
      const { error, paymentIntent } = await stripe!.confirmCardPayment(response.client_secret, {
         payment_method: {
            card: cardElement!,
            billing_details: { name: input.cardholderName }
         }
      });

      if (error) {
         setPayment({ status: 'error' });
         setErrorMessage(error.message ?? 'An unknown error occurred');
      } else if (paymentIntent) {
         setPayment(paymentIntent);
      }
   };

   return (
      <>
         <form onSubmit={handleSubmit} className=" w-2/3 mx-auto">
            <CustomDonationInput
               className={`${styles.elements} ${styles.FormRow}`}
               name="customDonation"
               value={input.customDonation}
               min={config.MIN_AMOUNT}
               max={config.MAX_AMOUNT}
               step={config.AMOUNT_STEP}
               currency={config.CURRENCY}
               onChange={handleInputChange}
            />
            <StripeTestCards />
            <fieldset className={styles.elements}>
               <legend>Your payment details:</legend>
               <input
                  placeholder="Cardholder name"
                  className={`${styles.elements} ${styles.FormRow}`}
                  type="Text"
                  name="cardholderName"
                  onChange={handleInputChange}
                  required
               />
               <div className={`${styles.elements} ${styles.FormRow}`}>
                  <CardElement
                     options={CARD_OPTIONS}
                     onChange={e => {
                        if (e.error) {
                           setPayment({ status: 'error' });
                           setErrorMessage(e.error.message ?? 'An unknown error occurred');
                        }
                     }}
                  />
               </div>
            </fieldset>
            <button
               className={`${styles.elementsBackground} ${styles.buttonDonate} `}
               type="submit"
               disabled={!['initial', 'succeeded', 'error'].includes(payment.status) || !stripe}
            >
               Donate {formatAmountForDisplay(input.customDonation, config.CURRENCY)}
            </button>
         </form>
         <PaymentStatus status={payment.status} />
         <PrintObject content={payment} />
      </>
   );
};

export default ElementsForm;

const StripeTestCards = () => {
   return (
      <div className={styles.testCardNotice}>
         Use any of the{' '}
         <a href="https://stripe.com/docs/testing#cards" target="_blank" rel="noopener noreferrer">
            Stripe test cards
         </a>{' '}
         for this demo, e.g.{' '}
         <div className={styles.cardNumber}>
            4242<span></span>4242<span></span>4242<span></span>4242
         </div>
         .
      </div>
   );
};

const CARD_OPTIONS = {
   iconStyle: 'solid' as const,
   style: {
      base: {
         iconColor: '#6772e5',
         color: '#6772e5',
         fontWeight: '500',
         fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif',
         fontSize: '16px',
         fontSmoothing: 'antialiased',
         ':-webkit-autofill': {
            color: '#fce883'
         },
         '::placeholder': {
            color: '#6772e5'
         }
      },
      invalid: {
         iconColor: '#ef2961',
         color: '#ef2961'
      }
   }
};