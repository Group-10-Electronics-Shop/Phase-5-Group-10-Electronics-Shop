import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async fetch simulation
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async () => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(initialProducts), 500);
    });
  }
);

const initialProducts = [
  // Phones
  { id: 1, name: "Samsung Galaxy S23", description: "Latest Samsung smartphone", price: 120000, category: "Phones", tags: ["flash", "bestselling"], image: "https://images.unsplash.com/photo-1661961111125-cb79c8ef02c6?auto=format&fit=crop&w=500&q=60" },
  { id: 2, name: "iPhone 14", description: "Apple flagship smartphone", price: 140000, category: "Phones", tags: ["new", "bestselling"], image: "https://images.unsplash.com/photo-1632046785481-2d8d58e7f9a7?auto=format&fit=crop&w=500&q=60" },
  { id: 3, name: "Tecno Camon 20", description: "Affordable Android smartphone", price: 32000, category: "Phones", tags: ["new"], image: "https://images.unsplash.com/photo-1670467392771-f2bcd87d292d?auto=format&fit=crop&w=500&q=60" },
  { id: 4, name: "Infinix Zero 6", description: "Stylish smartphone with powerful battery", price: 28000, category: "Phones", tags: ["flash"], image: "https://images.unsplash.com/photo-1627599252885-7a1a03f99f36?auto=format&fit=crop&w=500&q=60" },

  // Televisions
  { id: 5, name: "LG 55'' Smart LED TV", description: "High-definition smart TV", price: 95000, category: "Televisions", tags: ["flash"], image: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=500&q=60" },
  { id: 6, name: "Samsung 50'' QLED TV", description: "Vivid display QLED TV", price: 110000, category: "Televisions", tags: ["bestselling"], image: "https://images.unsplash.com/photo-1596187425270-09c65d48a7f7?auto=format&fit=crop&w=500&q=60" },
  { id: 7, name: "Sony Bravia 43'' Smart TV", description: "Compact 4K Smart TV", price: 68000, category: "Televisions", tags: ["new"], image: "https://images.unsplash.com/photo-1581923542792-5eb3a8731d68?auto=format&fit=crop&w=500&q=60" },

  // Computers
  { id: 8, name: "HP Pavilion Laptop", description: "15.6'' laptop, i7, 16GB RAM, 512GB SSD", price: 105000, category: "Computers", tags: ["bestselling"], image: "https://images.unsplash.com/photo-1587825140708-2ef3f6317eeb?auto=format&fit=crop&w=500&q=60" },
  { id: 9, name: "Dell Inspiron Laptop", description: "Reliable laptop for work and study", price: 85000, category: "Computers", tags: ["flash"], image: "https://images.unsplash.com/photo-1616628182501-75d579051fb4?auto=format&fit=crop&w=500&q=60" },
  { id: 10, name: "MacBook Air M2", description: "Lightweight MacBook with M2 chip", price: 200000, category: "Computers", tags: ["new"], image: "https://images.unsplash.com/photo-1593642532973-d31b6557fa68?auto=format&fit=crop&w=500&q=60" },

  // Accessories
  { id: 11, name: "Logitech Wireless Mouse", description: "Ergonomic mouse", price: 3500, category: "Accessories", tags: ["new"], image: "https://images.unsplash.com/photo-1580894908361-5e3d9f0325fa?auto=format&fit=crop&w=500&q=60" },
  { id: 12, name: "Sony WH-1000XM5 Headphones", description: "Noise-cancelling headphones", price: 28000, category: "Accessories", tags: ["flash", "bestselling"], image: "https://images.unsplash.com/photo-1623040082283-d0f18f7cb2f1?auto=format&fit=crop&w=500&q=60" },
  { id: 13, name: "Anker Power Bank 20000mAh", description: "Portable fast charging power bank", price: 6000, category: "Accessories", tags: ["new"], image: "https://images.unsplash.com/photo-1596228460606-2c20461e63f0?auto=format&fit=crop&w=500&q=60" },

  // Cameras
  { id: 14, name: "Canon EOS 250D DSLR", description: "Lightweight DSLR camera", price: 85000, category: "Cameras", tags: ["new"], image: "https://images.unsplash.com/photo-1615886392313-7f1e3c7cb4de?auto=format&fit=crop&w=500&q=60" },
  { id: 15, name: "Nikon D3500 DSLR", description: "Beginner-friendly DSLR camera", price: 79000, category: "Cameras", tags: ["bestselling"], image: "https://images.unsplash.com/photo-1575120237266-5b5b3d52aa6f?auto=format&fit=crop&w=500&q=60" },

  // Tablets
  { id: 16, name: "Samsung Galaxy Tab S8", description: "High-performance tablet", price: 75000, category: "Tablets", tags: ["flash"], image: "https://images.unsplash.com/photo-1648737968241-0d8d0b7b6b0e?auto=format&fit=crop&w=500&q=60" },
  { id: 17, name: "Apple iPad Air", description: "Lightweight iPad with Retina display", price: 95000, category: "Tablets", tags: ["new"], image: "https://images.unsplash.com/photo-1587825140578-2ef3f6317eeb?auto=format&fit=crop&w=500&q=60" },

  // Audio
  { id: 18, name: "JBL Flip 6 Bluetooth Speaker", description: "Portable waterproof speaker", price: 9000, category: "Audio", tags: ["new", "flash"], image: "https://images.unsplash.com/photo-1633980197285-b0b93ff0c4c3?auto=format&fit=crop&w=500&q=60" },
  { id: 19, name: "Bose SoundLink Revolve", description: "360-degree portable speaker", price: 25000, category: "Audio", tags: ["bestselling"], image: "https://images.unsplash.com/photo-1616628001817-2cf2a8cbb66d?auto=format&fit=crop&w=500&q=60" },

  // Gaming
  { id: 20, name: "Sony PlayStation 5", description: "Next-gen gaming console", price: 150000, category: "Gaming", tags: ["flash"], image: "https://images.unsplash.com/photo-1606813904671-0b7e5c4f2e92?auto=format&fit=crop&w=500&q=60" },
  { id: 21, name: "Xbox Series X", description: "Powerful gaming console", price: 145000, category: "Gaming", tags: ["bestselling"], image: "https://images.unsplash.com/photo-1606813885652-c3d2aa8f6c3b?auto=format&fit=crop&w=500&q=60" },
  { id: 22, name: "Nintendo Switch OLED", description: "Versatile gaming console", price: 65000, category: "Gaming", tags: ["new"], image: "https://images.unsplash.com/photo-1618401473776-f4a7f7dbf5e7?auto=format&fit=crop&w=500&q=60" },

  // Smartwatches
  { id: 23, name: "Apple Watch Series 9", description: "Advanced smartwatch with fitness tracking", price: 65000, category: "Wearables", tags: ["bestselling"], image: "https://images.unsplash.com/photo-1611632569595-c8b173cfc55d?auto=format&fit=crop&w=500&q=60" },
  { id: 24, name: "Samsung Galaxy Watch 6", description: "Stylish smartwatch", price: 55000, category: "Wearables", tags: ["new"], image: "https://images.unsplash.com/photo-1618205489854-5bbbc02b1713?auto=format&fit=crop&w=500&q=60" },
  { id: 25, name: "Fitbit Versa 4", description: "Health-focused smartwatch", price: 40000, category: "Wearables", tags: ["flash"], image: "https://images.unsplash.com/photo-1618218989760-0cfb6f6a84b0?auto=format&fit=crop&w=500&q=60" }
];

const productSlice = createSlice({
  name: "products",
  initialState: { items: [], status: "idle" },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => { state.status = "loading"; })
      .addCase(fetchProducts.fulfilled, (state, action) => { state.status = "succeeded"; state.items = action.payload; })
      .addCase(fetchProducts.rejected, (state) => { state.status = "failed"; });
  }
});

export default productSlice.reducer;
