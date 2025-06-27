import React from 'react';
import { Link } from 'react-router-dom';

const OrderCard = ({ order }) => {
  return (
    <div className="border rounded-lg p-4 shadow hover:shadow-lg transition">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-semibold">Order ID: {order.id}</h3>
          <p className="text-sm text-gray-600">Date: {new Date(order.orderDate).toLocaleString()}</p>
          <p className="text-sm text-gray-600">Status: <span className="font-semibold">{order.status}</span></p>
          <p className="text-sm text-gray-600">Total: ₹{order.totalAmount}</p>
        </div>
        <Link to={`/order/${order.id}`} className="text-green-600 underline hover:text-green-800">
          View Details
        </Link>
      </div>
    </div>
  );
};

export default OrderCard;
