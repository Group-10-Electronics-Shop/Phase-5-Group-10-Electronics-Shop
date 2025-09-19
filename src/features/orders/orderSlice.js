import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  list: [],
  browsingHistory: [], // New state for browsing history
  trackingInfo: {}, // New state for tracking info
  loading : false, // New state for loading status
  error: null, // New state for error handling
  filters: { status: 'all', dateRange: 'all', paymentmethod: 'all' }, // New state for order filters
  statistics: { totalOrders: 0, totalSpent: 0, averageOrderValue: 0 } // New state for order statistics

};

// const initialState = { list: []

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    // Core order management - keeping your original structure
    placeOrder: (state, action) => {
      const newOrder = {
        id: `ORD-${Date.now()}`,
        orderNumber: `#${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        items: action.payload.items,
        total: action.payload.total,
        status: 'pending',
        paymentMethod: action.payload.paymentMethod,
        shippingAddress: action.payload.shippingAddress,
        customerInfo: action.payload.customerInfo,
        date: new Date().toISOString(),
        timeline: [{
          status: 'pending',
          timestamp: new Date().toISOString(),
          description: 'Order placed successfully'
        }]
      };
      state.list.push(newOrder);
      // Update statistics
      state.statistics.totalOrders += 1;
      state.statistics.totalSpent += newOrder.total;
      state.statistics.averageOrderValue = state.statistics.totalSpent / state.statistics.totalOrders;
    },
    updateOrderStatus: (state, action) => {
      const { orderId, status, description } = action.payload;
      const order = state.list.find(order => order.id === orderId);
      
      if (order) {
        order.status = status;
        order.updatedAt = new Date().toISOString();
        
        // Update timeline
        order.timeline.push({
          status,
          timestamp: new Date().toISOString(),
          description: description || `Order status updated to ${status}`});
      }
    },

    cancelOrder: (state, action) => {
      const orderId = action.payload;
      const order = state.list.find(order => order.id === orderId);
      
      if (order && ['pending', 'processing'].includes(order.status)) {
        order.status = 'cancelled';
        order.updatedAt = new Date().toISOString();
        
        order.timeline.push({
          status: 'cancelled',
          timestamp: new Date().toISOString(),
          description: 'Order cancelled by customer'
        });

        // Update statistics
        state.statistics.totalOrders -= 1;
        state.statistics.totalSpent -= order.total;
        if (state.statistics.totalOrders > 0) {
          state.statistics.averageOrderValue = state.statistics.totalSpent / state.statistics.totalOrders;
        } else {
          state.statistics.averageOrderValue = 0;
        }
      }
    },

    addToBrowsingHistory: (state, action) => {
      const { productId, productName, category, price, image, timestamp } = action.payload;
      
      // Remove existing entry if it exists
      state.browsingHistory = state.browsingHistory.filter(item => item.productId !== productId);
      
      // Add to beginning of array
      state.browsingHistory.unshift({
        id: Date.now(),
        productId,
        productName,
        category,
        price,
        image,
        timestamp: timestamp || new Date().toISOString(),
        viewCount: 1
      });
      
      // Keep only last 50 items
      if (state.browsingHistory.length > 50) {
        state.browsingHistory = state.browsingHistory.slice(0, 50);
      }
    },

    clearBrowsingHistory: (state) => {
      state.browsingHistory = [];
    },
      // Tracking Information
    updateTrackingInfo: (state, action) => {
      const { orderId, trackingData } = action.payload;
      state.trackingInfo[orderId] = {
        ...state.trackingInfo[orderId],
        ...trackingData,
        lastUpdated: new Date().toISOString()
      };
    },
    // Filters
    setOrderFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },

    clearOrderFilters: (state) => {
      state.filters = {
        status: 'all',
        dateRange: 'all',
        paymentMethod: 'all'
      };
    },

    // Loading and Error States
    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    clearError: (state) => {
      state.error = null;
    },
     // Utility actions
    markOrderAsDelivered: (state, action) => {
      const { orderId } = action.payload;
      const order = state.list.find(order => order.id === orderId);
      
      if (order) {
        order.status = 'delivered';
        order.deliveredAt = new Date().toISOString();
        
        order.timeline.push({
          status: 'delivered',
          timestamp: new Date().toISOString(),
          description: 'Order successfully delivered'
        });
      }
    },

    // Clear all data (for logout)
    clearOrderData: (state) => {
      return initialState;
    }
  }
});

// Selectors - working with the 'list' structure
export const selectAllOrders = (state) => state.orders.list;

export const selectOrderById = (state, orderId) => 
  state.orders.list.find(order => order.id === orderId);

export const selectOrdersByStatus = (state, status) => 
  state.orders.list.filter(order => order.status === status);

export const selectRecentOrders = (state, limit = 5) => 
  state.orders.list.slice(0, limit);

export const selectBrowsingHistory = (state) => state.orders.browsingHistory;

export const selectRecentlyViewed = (state, limit = 10) => 
  state.orders.browsingHistory.slice(0, limit);

export const selectOrderFilters = (state) => state.orders.filters;

export const selectOrderStatistics = (state) => state.orders.statistics;

export const selectTrackingInfo = (state, orderId) => 
  state.orders.trackingInfo[orderId];

// Filtered orders selector
export const selectFilteredOrders = (state) => {
  const { list, filters } = state.orders;
  let filteredOrders = [...list];

  // Filter by status
  if (filters.status !== 'all') {
    filteredOrders = filteredOrders.filter(order => order.status === filters.status);
  }

  // Filter by payment method
  if (filters.paymentMethod !== 'all') {
    filteredOrders = filteredOrders.filter(order => order.paymentMethod === filters.paymentMethod);
  }

  // Filter by date range
  if (filters.dateRange !== 'all') {
    const now = new Date();
    let startDate;
    
    switch (filters.dateRange) {
      case 'last7days':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'last30days':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case 'last3months':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case 'lastyear':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(0);
    }
    
    filteredOrders = filteredOrders.filter(order => 
      new Date(order.date) >= startDate
    );
  }

  return filteredOrders;
};
// Export actions and reducer
export const {
  updateOrderStatus,
  cancelOrder,
  addToBrowsingHistory,
  clearBrowsingHistory,
  updateTrackingInfo,
  setOrderFilters,
  clearOrderFilters,
  setLoading,
  setError,
  clearError,
  markOrderAsDelivered,
  clearOrderData
} = orderSlice.actions;

// Helper functions
const getMostOrderedCategory = (orders) => {
  const categoryCount = {};
  
  orders.forEach(order => {
    order.items.forEach(item => {
      const category = item.category || 'Unknown';
      categoryCount[category] = (categoryCount[category] || 0) + item.quantity;
    });
  });
  
  return Object.entries(categoryCount).reduce((a, b) => 
    categoryCount[a[0]] > categoryCount[b[0]] ? a : b, ['Unknown', 0]
  )[0];
};

const calculateOrderTrend = (orders) => {
  const last30Days = orders.filter(order => {
    const orderDate = new Date(order.createdAt);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return orderDate >= thirtyDaysAgo;
  });
  
  const previousMonth = orders.filter(order => {
    const orderDate = new Date(order.createdAt);
    const sixtyDaysAgo = new Date();
    const thirtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return orderDate >= sixtyDaysAgo && orderDate < thirtyDaysAgo;
  });
  
  const currentMonthCount = last30Days.length;
  const previousMonthCount = previousMonth.length;
  
  if (previousMonthCount === 0) return currentMonthCount > 0 ? 100 : 0;
  
  return ((currentMonthCount - previousMonthCount) / previousMonthCount) * 100;
};

export const selectPaginatedOrders = (state) => {
  const filteredOrders = selectFilteredOrders(state);
  const { currentPage, itemsPerPage } = state.orders.pagination;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  
  return {
    orders: filteredOrders.slice(startIndex, endIndex),
    totalOrders: filteredOrders.length,
    totalPages: Math.ceil(filteredOrders.length / itemsPerPage),
    currentPage,
    hasNextPage: endIndex < filteredOrders.length,
    hasPreviousPage: currentPage > 1
  };
};

export const selectOrdersByDateRange = (state, startDate, endDate) => {
  return state.orders.orders.filter(order => {
    const orderDate = new Date(order.createdAt);
    return orderDate >= new Date(startDate) && orderDate <= new Date(endDate);
  });
};

export const selectOrdersByCustomer = (state, customerEmail) => {
  return state.orders.orders.filter(order => 
    order.customerInfo.email === customerEmail
  );
};

export const selectTopProducts = (state, limit = 5) => {
  const productCounts = {};
  
  state.orders.orders.forEach(order => {
    if (order.status !== 'cancelled') {
      order.items.forEach(item => {
        const key = `${item.id}-${item.name}`;
        if (!productCounts[key]) {
          productCounts[key] = {
            ...item,
            totalOrdered: 0,
            revenue: 0
          };
        }
        productCounts[key].totalOrdered += item.quantity;
        productCounts[key].revenue += item.price * item.quantity;
      });
    }
  });
  
  return Object.values(productCounts)
    .sort((a, b) => b.totalOrdered - a.totalOrdered)
    .slice(0, limit);
};

// Export actions and reducer
export const {

 
  removeBrowsingHistoryItem,

  setPagination,
  setCurrentPage,

  reorderItems,

  bulkUpdateOrders,
  updateOrderStatistics,

  exportOrderData,
  addOrderNote
} = orderSlice.actions;



export const { placeOrder } = orderSlice.actions;
export default orderSlice.reducer;
