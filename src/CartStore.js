import { atom, useAtom } from 'jotai';
import Immutable from 'seamless-immutable';

// Create an array with seamless-immutable
// this array now can use functions to add and update without
// having to manually clone, modify etc. etc.
const initialCart = Immutable([
    {
        "id": 1,
        "product_id": 1,
        "quantity": 10,
        "price": 19.99,
        "productName": "Organic Green Tea",
        "imageUrl": "https://picsum.photos/id/225/300/200",
        "description": "Premium organic green tea leaves, rich in antioxidants and offering a smooth, refreshing taste."
    }
]);

// create an atom for the cart
export const cartAtom = atom(initialCart);

// custom hook
// a custom hook is a way to share functions between components
export const useCart = () => {
    const [cart, setCart] = useAtom(cartAtom);

    const getCartTotal = () => {
        let total = 0;
        for (let c of cart) {
            total += c.price * c.quantity;
        }
        // round up to 2 decimal places
        // (will return string)
        return total.toFixed(2);
    }

    const addToCart = (product) => {
        console.log(product)
        setCart(currentCart => {

            // find if the item already exists in the shopping item
            const existingItemIndex = cart.findIndex(i => i.product_id === product.product_id);
            console.log(existingItemIndex);
            if (existingItemIndex !== -1) {

                let newQuantity = cart[existingItemIndex].quantity + 1;
                console.log("new quantity", newQuantity);
                // existing item
                const modifiedCart= currentCart.setIn([existingItemIndex, 'quantity'], newQuantity);
                return modifiedCart;
            } else {

                // new item
                return currentCart.concat({
                    ...product,
                    quantity: 1
                })


            }

        })
    }

    return {
        cart, getCartTotal, addToCart
    }

}