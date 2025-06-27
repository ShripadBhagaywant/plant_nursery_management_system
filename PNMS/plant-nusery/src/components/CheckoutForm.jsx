import React, { useState } from 'react';
import { Gift, Phone, MapPin, IdentificationCard  , AddressBook ,
   City,
   Mailbox,
   Bank,
  Flag
} from "@phosphor-icons/react";

const CheckoutForm = ({ onSubmit, initialValues = {} }) => {
  const [form, setForm] = useState({
    recipientName: initialValues.recipientName || '',
    phoneNumber: initialValues.phoneNumber || '',
    shippingAddress: initialValues.shippingAddress || '',
    city: initialValues.city || '',
    state: initialValues.state || '',
    zipCode: initialValues.zipCode || '',
    country: initialValues.country || 'India',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-md space-y-5 hover:shadow-lg transition-shadow cursor-pointer">
      <h3 className="text-lg font-bold text-green-500 flex items-center gap-2">
        <AddressBook  size={24} />
        Shipping Details
      </h3>

      {/* Recipient Name */}
      <FormInput
        label="Full Name"
        name="recipientName"
        value={form.recipientName}
        onChange={handleChange}
        icon={<IdentificationCard  size={18} />}
      />

      {/* Phone Number */}
      <FormInput
        label="Phone Number"
        name="phoneNumber"
        value={form.phoneNumber}
        onChange={handleChange}
        icon={<Phone size={18} />}
      />

      {/* Shipping Address */}
      <FormInput
        label="Shipping Address"
        name="shippingAddress"
        value={form.shippingAddress}
        onChange={handleChange}
        icon={<MapPin size={18} />}
      />

      {/* City */}
      <FormInput
        label="City"
        name="city"
        value={form.city}
        onChange={handleChange}
        icon={<City  size={18} />}
      />

      {/* State */}
      <FormInput
        label="State"
        name="state"
        value={form.state}
        onChange={handleChange}
        icon={<Bank size={18} />}
      />

      {/* ZIP Code */}
      <FormInput
        label="ZIP Code"
        name="zipCode"
        value={form.zipCode}
        onChange={handleChange}
        icon={<Mailbox size={18} />}
      />

      {/* Country */}
      <FormInput
        label="Country"
        name="country"
        value={form.country}
        onChange={handleChange}
        icon={<Flag size={18} />}
      />

      <button
        type="submit"
        className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-full font-semibold shadow-md flex items-center justify-center gap-2"
      >
        <Gift size={20} />
         Place Order
      </button>
    </form>
  );
};

const FormInput = ({ label, icon, name, value, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {icon && <span className="inline-flex items-center gap-1">{icon} {label}</span>}
      {!icon && label}
    </label>
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      required
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 transition"
    />
  </div>
);

export default CheckoutForm;
