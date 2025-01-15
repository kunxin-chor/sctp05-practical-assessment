import React from 'react';
import { useCart } from './CartStore';

export default function ShoppingCart() {
    const {cart, getCartTotal} = useCart();
    return <div className="container mt-4">
        <h2>Shopping Cart</h2>
        {
            cart.length === 0 ? (<p>Your cart is empty</p>) :
                (
                    <>
                        <ul className="list-group">
                            {
                                cart.map(item => (
                                    <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
                                        <img src={item.imageUrl}/>
                                        <div>
                                            <h5>{item.productName}</h5>
                                            <p>Quantity: {item.quantity}</p>
                                            <p>Per Price: ${item.price}</p>
                                        </div>
                                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                                    </li>
                                ))
                            }
                        </ul>
                        <div className="mt-3 text-end">
                            <h4>Total:${getCartTotal()}</h4>
                        </div>
                    </>
                )
        }

    </div>
}