import { createSlice } from '@reduxjs/toolkit';

// Mock data for demonstration
// const mockOrders = [
//   {
//     id: 1,
//     date: '2024-09-15',
//     status: 'delivered',
//     total: 299.99,
//     products: [
//       { id: 101, name: 'Wireless Headphones', price: 199.99, quantity: 1 },
//       { id: 102, name: 'Phone Case', price: 29.99, quantity: 2 },
//       { id: 103, name: 'Screen Protector', price: 19.99, quantity: 2 }
//     ]
//   },
//   {
//     id: 2,
//     date: '2024-09-18',
//     status: 'pending',
//     total: 599.98,
//     products: [
//       { id: 104, name: 'Bluetooth Speaker', price: 149.99, quantity: 1 },
//       { id: 105, name: 'Wireless Mouse', price: 79.99, quantity: 1 },
//       { id: 106, name: 'Keyboard', price: 189.99, quantity: 1 },
//       { id: 107, name: 'USB Cable', price: 19.99, quantity: 9 }
//     ]
//   },
//   {
//     id: 3,
//     date: '2024-09-20',
//     status: 'shipped',
//     total: 89.97,
//     products: [
//       { id: 108, name: 'Phone Charger', price: 24.99, quantity: 1 },
//       { id: 109, name: 'Power Bank', price: 64.98, quantity: 1 }
//     ]
//   },
//   {
//     id: 4,
//     date: '2024-09-21',
//     status: 'pending',
//     total: 149.99,
//     products: [
//       { id: 110, name: 'Laptop Stand', price: 79.99, quantity: 1 },
//       { id: 111, name: 'Webcam', price: 69.99, quantity: 1 }
//     ]
//   }
// ];

const initialState = {
  orders: [],
  selectedOrder: null,
  loading: false,
  error: null
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    // Set selected order for viewing details
    selectOrder: (state, action) => {
      state.selectedOrder = state.orders.find(order => order.id === action.payload);
    },
    
    // Clear selected order
    clearSelectedOrder: (state) => {
      state.selectedOrder = null;
    },
    
    // Cancel a pending order
    cancelOrder: (state, action) => {
      const orderId = action.payload;
      const orderIndex = state.orders.findIndex(order => order.id === orderId);
      
      if (orderIndex !== -1 && state.orders[orderIndex].status === 'pending') {
        state.orders[orderIndex].status = 'cancelled';
        
        // If this was the selected order, update it too
        if (state.selectedOrder && state.selectedOrder.id === orderId) {
          state.selectedOrder.status = 'cancelled';
        }
      }
    },
    
    // Set loading state
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    
    // Set error state
    setError: (state, action) => {
      state.error = action.payload;
    },
    
    // Clear error
    clearError: (state) => {
      state.error = null;
    },
    
    // Add new order (for future use)
    addOrder: (state, action) => {
      state.orders.unshift(action.payload);
    },
    
    // Update order status (for future use)
    updateOrderStatus: (state, action) => {
      const { orderId, status } = action.payload;
      const orderIndex = state.orders.findIndex(order => order.id === orderId);
      
      if (orderIndex !== -1) {
        state.orders[orderIndex].status = status;
        
        if (state.selectedOrder && state.selectedOrder.id === orderId) {
          state.selectedOrder.status = status;
        }
      }
    }
  }
});

export const {
  selectOrder,
  clearSelectedOrder,
  cancelOrder,
  setLoading,
  setError,
  clearError,
  addOrder,
  updateOrderStatus
} = ordersSlice.actions;

// Selectors
export const selectAllOrders = (state) => state.orders.orders;
export const selectSelectedOrder = (state) => state.orders.selectedOrder;
export const selectOrdersLoading = (state) => state.orders.loading;
export const selectOrdersError = (state) => state.orders.error;

// Get orders by status
export const selectOrdersByStatus = (state, status) => 
  state.orders.orders.filter(order => order.status === status);

// Get pending orders count
export const selectPendingOrdersCount = (state) =>
  state.orders.orders.filter(order => order.status === 'pending').length;

export default ordersSlice.reducer;

