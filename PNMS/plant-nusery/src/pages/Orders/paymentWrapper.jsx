// src/pages/Orders/PaymentWrapper.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { orderService } from '../../services/orderService';
import { toast } from 'sonner';
import PaymentPage from '../../components/PaymentPage';

const PaymentWrapper = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [totalAmount, setTotalAmount] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderAmount = async () => {
      try {
        const response = await orderService.getOrderById(orderId);
        if (response?.data?.status === 'PAID') {
          toast.info('🟢 Order already paid.');
          navigate(`/order/${orderId}`);
        } else {
          setTotalAmount(response.data.totalAmount);
        }
      } catch (error) {
        toast.error('❌ Failed to fetch order.');
        navigate('/orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderAmount();
  }, [orderId, navigate]);

  if (loading) {
    return <div className="p-6 text-center font-poppins text-green-600">Loading payment info <span className='animate-pulse'>🔃</span></div>;
  }

  return <PaymentPage orderId={orderId} totalAmount={totalAmount} />;
};

export default PaymentWrapper;
