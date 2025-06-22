import React from 'react';
import { Customer } from '../../types';
import { Mail, User, Calendar, Phone } from 'lucide-react';

interface CustomerProfileProps {
  customer: Customer | null;
}

const CustomerProfile: React.FC<CustomerProfileProps> = ({ customer }) => {
  if (!customer) {
    return (
      <div className="w-80 bg-white border-l border-gray-200 p-6">
        <div className="text-center text-gray-500">
          <User className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>Select a conversation to view customer details</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="text-center">
          <img
            src={customer.profilePicture || `https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&fit=crop&crop=face`}
            alt={customer.name}
            className="w-20 h-20 rounded-full object-cover mx-auto mb-4"
          />
          <h3 className="text-lg font-semibold text-gray-900">{customer.name}</h3>
          <div className="flex items-center justify-center mt-2">
            <div className="w-2 h-2 bg-gray-400 rounded-full mr-2"></div>
            <span className="text-sm text-gray-500">Offline</span>
          </div>
        </div>
        
        <div className="flex space-x-2 mt-6">
          <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
            <Phone className="w-4 h-4 mr-2" />
            Call
          </button>
          <button className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center">
            <User className="w-4 h-4 mr-2" />
            Profile
          </button>
        </div>
      </div>

      <div className="flex-1 p-6">
        <h4 className="text-sm font-semibold text-gray-900 mb-4">Customer details</h4>
        
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-700">Email</p>
              <p className="text-sm text-gray-900">{customer.email || 'Not provided'}</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <User className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-700">First Name</p>
              <p className="text-sm text-gray-900">{customer.firstName || customer.name.split(' ')[0]}</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <User className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-700">Last Name</p>
              <p className="text-sm text-gray-900">{customer.lastName || customer.name.split(' ').slice(1).join(' ')}</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-700">Customer since</p>
              <p className="text-sm text-gray-900">Jan 2024</p>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            View more details
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerProfile;