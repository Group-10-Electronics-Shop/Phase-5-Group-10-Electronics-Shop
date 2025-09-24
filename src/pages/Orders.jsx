import React, { useState } from 'react';

const OrderManagement = ({ orders = [], onCancelOrder }) => {
  const [ordersState, setOrdersState] = useState(orders);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'text-green-600 bg-green-100';
      case 'shipped': return 'text-blue-600 bg-blue-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const handleViewDetails = (orderId) => {
    const order = ordersState.find(order => order.id === orderId);
    setSelectedOrder(order);
    setShowDetails(true);
  };

  const handleCloseDetails = () => {
    setSelectedOrder(null);
    setShowDetails(false);
  };

  const handleCancelOrder = (orderId) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      setOrdersState(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId ? { ...order, status: 'cancelled' } : order
        )
      );
      
      // Update selectedOrder if it's the one being cancelled
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(prevOrder => ({ ...prevOrder, status: 'cancelled' }));
      }
      
      // Call external cancel handler if provided
      if (onCancelOrder) {
        onCancelOrder(orderId);
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>
      
      {/* Orders List */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        {ordersState.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto h-12 w-12 text-gray-400 text-4xl">📦</div>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No orders found</h3>
            <p className="mt-1 text-gray-500">You haven't placed any orders yet.</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {ordersState.map((order) => (
              <li key={order.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <span className="text-2xl">📦</span>
                      </div>
                      <div>
                        <p className="text-lg font-medium text-gray-900">
                          Order #{order.id}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <span className="mr-1">📅</span>
                            {formatDate(order.date)}
                          </div>
                          <div className="flex items-center">
                            <span className="mr-1">💰</span>
                            ${order.total.toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                    
                    <button
                      onClick={() => handleViewDetails(order.id)}
                      className="px-3 py-1 text-sm bg-blue-100 text-blue-600 hover:bg-blue-200 rounded"
                      title="View Details"
                    >
                      👁️ View
                    </button>
                    
                    {order.status === 'pending' && (
                      <button
                        onClick={() => handleCancelOrder(order.id)}
                        className="px-3 py-1 text-sm bg-red-100 text-red-600 hover:bg-red-200 rounded"
                        title="Cancel Order"
                      >
                        ❌ Cancel
                      </button>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Order Details Modal */}
      {showDetails && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                Order #{selectedOrder.id} Details
              </h2>
              <button
                onClick={handleCloseDetails}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
              >
                ✕ Close
              </button>
            </div>
            
            <div className="p-6">
              {/* Order Info */}
              <div className="mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Order Date</label>
                    <p className="mt-1 text-lg text-gray-900">{formatDate(selectedOrder.date)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Status</label>
                    <span className={`inline-block mt-1 px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(selectedOrder.status)}`}>
                      {selectedOrder.status}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Total Amount</label>
                    <p className="mt-1 text-lg font-bold text-gray-900">${selectedOrder.total.toFixed(2)}</p>
                  </div>
                </div>
              </div>
              
              {/* Products List */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Order Items</h3>
                <ul className="divide-y divide-gray-200 border border-gray-200 rounded-lg">
                  {selectedOrder.products.map((product) => (
                    <li key={product.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="text-base font-medium text-gray-900">{product.name}</h4>
                          <p className="text-sm text-gray-500">Quantity: {product.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-base font-medium text-gray-900">
                            ${(product.price * product.quantity).toFixed(2)}
                          </p>
                          <p className="text-sm text-gray-500">
                            ${product.price.toFixed(2)} each
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Action Buttons */}
              {selectedOrder.status === 'pending' && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => {
                      handleCancelOrder(selectedOrder.id);
                      handleCloseDetails();
                    }}
                    className="w-full bg-red-600 text-white py-3 px-4 rounded-md hover:bg-red-700 font-medium"
                  >
                    Cancel Order
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;


// function Orders() {
//   return (
//     <div>
//       <h2 className="text-xl font-bold mb-4">My Orders</h2>
//       <p>List of user orders will be displayed here.</p>
//     </div>
//   );
// }

// export default Orders;
