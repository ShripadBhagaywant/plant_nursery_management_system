import React from "react";
import { Button } from "@/components/ui/button";

const CartItemCard = ({ item, onUpdateQty, onRemove }) => {
  return (
    <div className="border p-4 rounded-xl flex justify-between items-center">
      <div>
        <h3 className="text-lg font-bold">{item.plantName}</h3>
        <p>Price: ₹{item.price}</p>
        <p>Quantity: 
          <input
            type="number"
            className="w-16 ml-2 border p-1"
            value={item.quantity}
            min="1"
            onChange={(e) =>
              onUpdateQty({ ...item, quantity: parseInt(e.target.value, 10) })
            }
          />
        </p>
      </div>
      <Button variant="destructive" onClick={() => onRemove(item.plantId)}>
        Remove
      </Button>
    </div>
  );
};

export default CartItemCard;
