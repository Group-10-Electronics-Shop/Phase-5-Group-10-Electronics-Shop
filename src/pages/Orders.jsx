import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Package, Clock, Truck, CheckCircle, XCircle, Calendar, DollarSign, ChevronRight, X } from 'lucide-react';
import {
  selectAllOrders,
  selectSelectedOrder,
  selectOrder,
  clearSelectedOrder,
  cancelOrder
} from '../features/orders/orderSlice';

const OrderHistoryPage = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectAllOrders);
  const selectedOrder = useSelector(selectSelectedOrder);
  const [filterStatus, setFilterStatus] = React.useState('all');

  const getStatusIcon = (status) => {
    switch(status) {
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'shipped':
        return <Truck className="w-5 h-5 text-blue-500" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Package className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      delivered: 'bg-green-100 text-green-700',
      shipped: 'bg-blue-100 text-blue-700',
      pending: 'bg-yellow-100 text-yellow-700',
      cancelled: 'bg-red-100 text-red-700'
    };
    
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${styles[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const handleCancelOrder = (orderId) => {
    dispatch(cancelOrder(orderId));
  };

  const handleSelectOrder = (orderId) => {
    dispatch(selectOrder(orderId));
  };

  const handleCloseModal = () => {
    dispatch(clearSelectedOrder());
  };

  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === filterStatus);

  const orderCounts = {
    all: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order History</h1>
          <p className="text-gray-600">Track and manage your orders</p>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6 p-2 flex gap-2 overflow-x-auto">
          {['all', 'pending', 'shipped', 'delivered', 'cancelled'].map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
                filterStatus === status
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)} ({orderCounts[status]})
            </button>
          ))}
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders found</h3>
              <p className="text-gray-600">You don't have any {filterStatus !== 'all' ? filterStatus : ''} orders yet.</p>
            </div>
          ) : (
            filteredOrders.map(order => (
              <div key={order.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3">
                      {getStatusIcon(order.status)}
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-lg font-semibold text-gray-900">Order #{order.id}</h3>
                          {getStatusBadge(order.status)}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(order.date).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </span>
                          <span className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            ${order.total.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleSelectOrder(order.id)}
                      className="flex items-center gap-1 text-blue-500 hover:text-blue-600 font-medium text-sm"
                    >
                      View Details
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Products Preview */}
                  <div className="border-t pt-4">
                    <p className="text-sm text-gray-600 mb-2">
                      {order.products.length} item{order.products.length !== 1 ? 's' : ''}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {order.products.slice(0, 3).map(product => (
                        <span key={product.id} className="text-sm bg-gray-100 px-3 py-1 rounded-md text-gray-700">
                          {product.name}
                        </span>
                      ))}
                      {order.products.length > 3 && (
                        <span className="text-sm bg-gray-100 px-3 py-1 rounded-md text-gray-700">
                          +{order.products.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Cancel Button for Pending Orders */}
                  {order.status === 'pending' && (
                    <div className="border-t mt-4 pt-4">
                      <button
                        onClick={() => handleCancelOrder(order.id)}
                        className="px-4 py-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors text-sm font-medium"
                      >
                        Cancel Order
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              {/* Order Info */}
              <div className="mb-6 pb-6 border-b">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Order #{selectedOrder.id}</h3>
                    <p className="text-gray-600 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {new Date(selectedOrder.date).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                  {getStatusBadge(selectedOrder.status)}
                </div>
              </div>

              {/* Products */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-4">Order Items</h4>
                <div className="space-y-3">
                  {selectedOrder.products.map(product => (
                    <div key={product.id} className="flex justify-between items-start p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{product.name}</p>
                        <p className="text-sm text-gray-600">Quantity: {product.quantity}</p>
                      </div>
                      <p className="font-semibold text-gray-900">${(product.price * product.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Total */}
              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span className="text-gray-900">Total</span>
                  <span className="text-gray-900">${selectedOrder.total.toFixed(2)}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                {selectedOrder.status === 'pending' && (
                  <button
                    onClick={() => {
                      handleCancelOrder(selectedOrder.id);
                    }}
                    className="flex-1 px-4 py-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium"
                  >
                    Cancel Order
                  </button>
                )}
                <button
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderHistoryPage;


// function Orders() {
//   return (
//     <div>
//       <h2 className="text-xl font-bold mb-4">My Orders</h2>
//       <p>List of user orders will be displayed here.</p>
//     </div>
//   );
// }

// export default Orders;
