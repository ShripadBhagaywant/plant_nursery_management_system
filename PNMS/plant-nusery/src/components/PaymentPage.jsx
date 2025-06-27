import React, { useEffect, useState } from 'react';
import axiosInstance from '../services/axiosInstance';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import { CreditCard, CurrencyInr, Truck, CheckSquare } from '@phosphor-icons/react';

const PaymentPage = ({ orderId, totalAmount }) => {
  const navigate = useNavigate();
  const [amount, setAmount] = useState(totalAmount || 0);
  const [sameAddress, setSameAddress] = useState(true);

  useEffect(() => {
    const fetchAmount = async () => {
      try {
        const { data } = await axiosInstance.post('/payments/create', { orderId });
        setAmount(data.amount);
      } catch (err) {
        toast.error("❌ Couldn't fetch order amount.");
      }
    };

    if (!totalAmount) fetchAmount();
  }, [orderId, totalAmount]);

  const handlePayment = async () => {
    try {
      const { data } = await axiosInstance.post('/payments/create', { orderId });

      const options = {
        key: 'rzp_test_MyelMPYVPd88rI',
        amount: data.amount * 100,
        currency: 'INR',
        name: 'Plant Nursery',
        description: 'Order Payment',
        order_id: data.razorpayOrderId,
        handler: async function (response) {
          const verificationPayload = {
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          };

          const verifyRes = await axiosInstance.post('/payments/verify', verificationPayload);
          toast.success(verifyRes.data.message || '✅ Payment successful!');
          navigate(`/order/${orderId}`);
        },
        prefill: {
          name: 'Customer',
          email: 'customer@example.com',
          contact: '9999999999',
        },
        theme: {
          color: '#16a34a',
        },
      };

      const razor = new window.Razorpay(options);
      razor.open();
    } catch (error) {
      toast.error('❌ Payment failed');
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen font-poppins">
      <Navbar />

      <div className="pt-24 pb-12 px-4 max-w-xl mx-auto">
        <div className="bg-white shadow-2xl rounded-2xl p-8 space-y-6 border border-gray-100">
          <div className="flex items-center gap-3 text-green-700 font-bold text-2xl">
            <CreditCard size={28} />
            <h2>Payment Summary</h2>
          </div>

          <div className="flex items-center justify-between text-lg text-gray-800 border-b pb-4">
            <div className="flex items-center gap-2">
              <CurrencyInr size={22} className="text-green-500" />
              <span className="font-medium">Amount:</span>
            </div>
            <span className="text-green-700 font-bold text-xl">₹{amount}</span>
          </div>

          <div className="bg-green-50 rounded-md p-4 flex items-center gap-3 text-green-700 text-sm">
            <Truck size={20} />
            Your order will be delivered within <strong>7 days</strong>.
          </div>

          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={sameAddress}
              onChange={(e) => setSameAddress(e.target.checked)}
              className="accent-green-600"
            />
            My billing and shipping address are the same
          </label>

          <button
            onClick={handlePayment}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-lg font-semibold text-lg flex justify-center items-center gap-2 shadow-sm transition"
          >
            <CreditCard size={20} /> Pay Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
