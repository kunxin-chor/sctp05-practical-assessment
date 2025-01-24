import { atom, useAtom } from 'jotai';
import Immutable from 'seamless-immutable';
import { useEffect, useRef } from 'react';
import { useJwt } from './UserStore';
import axios from 'axios';

// Create an array with seamless-immutable
// this array now can use functions to add and update without
// having to manually clone, modify etc. etc.
const initialCart = Immutable([
]);

// create an atom for the cart
export const cartAtom = atom(initialCart);

// keep track of whether the shopping cart is loading
export const cartLoadAtom = atom(false);


// custom hook
// a custom hook is a way to share functions between components
// we often create functions that perform CRUD on the jotai atom
// and then share them via custom hooks
export const useCart = () => {
    const [cart, setCart] = useAtom(cartAtom); // -> one atom is one shared data in Jotai
    const [isLoading, setIsLoading] = useAtom(cartLoadAtom);
    const { getJwt } = useJwt();
    
    // when the component with the cartStore is mounted for the first time,
    // we will fetch the shopping cart
    useEffect(() => {
        fetchCart();
    }, [])

    const fetchCart = async () => {
        // get the JWT so that we know the id of the current logged in user
        const jwt = getJwt();
        setIsLoading(true);
        try {
            const response = await axios.get(import.meta.env.VITE_API_URL + '/api/cart', {
                headers: {
                    Authorization: 'Bearer ' + jwt
                }
            });
            setCart(Immutable(response.data));
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    }

    // updatedCart contains the latest cart items
    const updateCart = async (updatedCart) => {
        const jwt = getJwt();
        setIsLoading(true);
        try {
            // .map  will generate the new array
            // which will consist of the elements from the
            // original array but transformed somehow
            const updatedCartItems = updatedCart.map(item => ({
                product_id: item.product_id,
                quantity: item.quantity
            })
            );
            await axios.put(import.meta.env.VITE_API_URL + '/api/cart', {
                cartItems: updatedCartItems
            }, {
                headers: {
                    Authorization: 'Bearer ' + jwt
                }
            })

        } catch (e) {
            console.error("Error updating cart:", error);
        } finally {
            setIsLoading(false);
        }
    }

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
                
                // send the modified cart to our RESTFul API
                updateCart(modifiedCart);
                return modifiedCart;
            } else {
                // new item
                const modifiedCart =  currentCart.concat({
                    ...product,
                    quantity: 1
                })
                updateCart(modifiedCart);
                return modifiedCart;
                
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
                updateCart(modifiedCart);
                return modifiedCart;
            } else {
                // 3. If the new quantity is 0
                // const lhs = currentCart.slice(0,existingItemIndex-1);
                // const rhs = currentCart.slice(existingItemIndex+1);
                // return [...lhs, ...rhs];
                const modifiedCart = currentCart.filter(cartItem => cartItem.product_id != product_id);
                updateCart(modifiedCart);
                return modifiedCart;
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