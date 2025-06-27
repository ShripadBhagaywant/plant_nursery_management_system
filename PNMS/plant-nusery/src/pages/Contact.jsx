import React, { useState} from 'react';
import { Phone, EnvelopeSimple, MapPin, Plant } from '@phosphor-icons/react';
import { sendContactMessage } from '../services/contactService';
import Navbar from '../components/Navbar';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ContactPage = () => {
  const [formData, setFormData] = useState({ subject: '', message: '' });

  const navigate = useNavigate();
  
  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await sendContactMessage(formData);
      toast.success("✅ Message sent successfully!");
      setFormData({ subject: '', message: '' });
    } catch (error) {
      toast.error("❌ Something went wrong. or login now");
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-24 px-4 sm:px-8 md:px-20 bg-white">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-semibold text-center text-green-500 mb-12 font-poppins">
            Contact Us..
          </h1>

          <div className="flex flex-col md:flex-row gap-8 items-start font-poppins">
            {/* Contact Info */}
            <div className="w-full md:w-1/2 space-y-6">
              {[{
                icon: <Phone size={24} />,
                text: '+91 98765 43210'
              }, {
                icon: <EnvelopeSimple size={24} />,
                text: 'PlantCare@email.com'
              }, {
                icon: <MapPin size={24} />,
                text: 'Green Street, Eco City, India'
              }, {
                icon: <Plant size={24} />,
                text: 'Join our community',
                button: 'Join Us'
              }].map(({ icon, text, button }, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-3 border rounded-xl shadow-lg bg-white hover:shadow-xl transition cursor-pointer"
                >
                  <div className="p-2 rounded-full border border-green-500 text-gray-700 hover:shadow-lg">
                    {icon}
                  </div>
                  <span className="text-md text-gray-600">{text}</span>
                  {button && (
                    <button
                     onClick={() => navigate("/kyc")}
                        className="ml-auto bg-green-500 text-white py-1 px-4 rounded-xl hover:bg-red-600 transition"
                      >
                      {button}  
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Contact Form */}
            <div className="w-full md:w-1/2 hover:shadow-xl transition cursor-pointer">
              <form
                onSubmit={handleSubmit}
                className="space-y-6 border rounded-2xl shadow-xl p-6 bg-white"
              >
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-2xl font-poppins shadow
                      focus:outline-none focus:ring-0 focus:border-gray-400 hover:shadow-xl transition cursor-pointer"
                    required
                    placeholder="Enter your subject"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="5"
                    className="w-full px-4 py-2 border border-gray-300 rounded-2xl font-poppins shadow
                      focus:outline-none focus:ring-0 focus:border-gray-400 hover:shadow-xl transition cursor-pointer"
                    required
                    placeholder="Write your message..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-green-500 hover:bg-red-500 text-white py-2 rounded-xl font-medium transition"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactPage;
