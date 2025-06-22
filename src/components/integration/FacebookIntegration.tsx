import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FacebookPage } from '../../types';
import { Facebook, Trash2, MessageSquare } from 'lucide-react';

const FacebookIntegration: React.FC = () => {
  const [page, setPage] = useState<FacebookPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPageConnection();
  }, []);

  const fetchPageConnection = async () => {
    try {
      const response = await fetch('/api/facebook/page', {
        headers: {
          'Authorization': `Bearer ${user?.id}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        if (data.page) {
          setPage(data.page);
        }
      }
    } catch (error) {
      console.error('Error fetching page connection:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConnectPage = async () => {
    setConnecting(true);
    try {
      // This would typically redirect to Facebook OAuth
      // For demo purposes, we'll simulate the connection
      const response = await fetch('/api/facebook/connect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.id}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPage(data.page);
      }
    } catch (error) {
      console.error('Error connecting page:', error);
    } finally {
      setConnecting(false);
    }
  };

  const handleDeleteIntegration = async () => {
    if (!confirm('Are you sure you want to delete this integration?')) {
      return;
    }

    setDeleting(true);
    try {
      const response = await fetch('/api/facebook/disconnect', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user?.id}`,
        },
      });

      if (response.ok) {
        setPage(null);
      }
    } catch (error) {
      console.error('Error deleting integration:', error);
    } finally {
      setDeleting(false);
    }
  };

  const handleReplyToMessages = () => {
    navigate('/conversations');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        {!page ? (
          <div className="text-center">
            <Facebook className="w-16 h-16 text-blue-600 mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Facebook Page Integration</h1>
            <p className="text-gray-600 mb-8">Connect your Facebook page to start receiving and managing messages</p>
            
            <button
              onClick={handleConnectPage}
              disabled={connecting}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <Facebook className="w-5 h-5 mr-2" />
              {connecting ? 'Connecting...' : 'Connect Page'}
            </button>
          </div>
        ) : (
          <div className="text-center">
            <Facebook className="w-16 h-16 text-blue-600 mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Facebook Page Integration</h1>
            <p className="text-gray-600 mb-6">
              Integrated Page: <span className="font-semibold text-gray-900">{page.name}</span>
            </p>
            
            <div className="space-y-4">
              <button
                onClick={handleDeleteIntegration}
                disabled={deleting}
                className="w-full bg-red-500 text-white py-3 px-6 rounded-lg hover:bg-red-600 focus:ring-4 focus:ring-red-200 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <Trash2 className="w-5 h-5 mr-2" />
                {deleting ? 'Deleting...' : 'Delete Integration'}
              </button>
              
              <button
                onClick={handleReplyToMessages}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all font-medium flex items-center justify-center"
              >
                <MessageSquare className="w-5 h-5 mr-2" />
                Reply To Messages
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FacebookIntegration;