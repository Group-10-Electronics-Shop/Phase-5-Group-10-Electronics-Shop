import { useSelector } from "react-redux";

function Cart() {
  const items = useSelector((state) => state.cart.items);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Cart</h2>
      {items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <ul className="space-y-2">
          {items.map((item) => (
            <li key={item.id} className="flex justify-between border-b pb-2">
              <span>{item.name}</span>
              <span>${item.price}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Cart;
