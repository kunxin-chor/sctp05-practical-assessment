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
// we often create functions that perform CRUD on the jotai atom
// and then share them via custom hooks
export const useCart = () => {
    const [cart, setCart] = useAtom(cartAtom); // -> one atom is one shared data in Jotai

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
        setCart(currentCart => {
            // find if the item already exists in the shopping item
            const existingItemIndex = cart.findIndex(i => i.product_id === product.product_id);
            if (existingItemIndex !== -1) {
                let newQuantity = cart[existingItemIndex].quantity + 1;

                // existing item
                const modifiedCart = currentCart.setIn([existingItemIndex, 'quantity'], newQuantity);
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

    const modifyQuantity = (product_id, quantity) => {
        // updating the atom in Jotai is asynchronous
        setCart(currentCart => {

            // 1. find the index of the cart item for the product_id
            const existingItemIndex = currentCart.findIndex(i => i.product_id === product_id);

            // 2. If the new quantity is more than 0, then we'll just update the new quantity
            if (quantity > 0) {
                // .setIn will return a modified copy of the original array
                const modifiedCart = currentCart.setIn([existingItemIndex, "quantity"], quantity);
                return modifiedCart;
            } else {
                // 3. If the new quantity is 0
                // const lhs = currentCart.slice(0,existingItemIndex-1);
                // const rhs = currentCart.slice(existingItemIndex+1);
                // return [...lhs, ...rhs];
                return currentCart.filter(cartItem => cartItem.product_id != product_id);
            }



        })


    }

    const removeFromCart = (product_id) => {
        setCart(currentCart => {
            return currentCart.filter(cartItem => cartItem.product_id != product_id);
        })
    }

    return {
        cart, getCartTotal, addToCart, modifyQuantity, removeFromCart
    }

}