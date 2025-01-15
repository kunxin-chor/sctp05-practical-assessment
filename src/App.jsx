import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import HomePage from './HomePage'
import ProductPage from './ProductPage'
import RegisterPage from './RegisterPage'
import ShoppingCart from './ShoppingCart';
import { Route, Switch } from 'wouter';

import { useFlashMessage } from './FlashMessageStore';

export default function App() {

  const {getMessage, showMessage, clearMessage} = useFlashMessage();
  const flashMessage = getMessage();

  useEffect(()=>{
    const timer = setTimeout(()=>{
      clearMessage();
    }, 3000);

    // the return of the effect function is another function
    // that performs cleanup
    return ()=>{
      clearTimeout(timer)
    }

  }, [flashMessage]); // the effect will trigger whenver the flashMessage value is changed

  return (
    <>
      <Navbar />
      {
        flashMessage.message && 
        <div className={`alert alert-${flashMessage.type} text-center flash-alert`}
          role="alert"
        >
          {flashMessage.message}
        </div>
      }

      {/* Any JSX in the switch now be part of the pages */}
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/products" component={ProductPage}/>
        <Route path="/register" component={RegisterPage}/>
        <Route path="/cart" component={ShoppingCart}/>
      </Switch>


      <footer className="bg-dark text-white text-center py-3">
        <div className="container">
          <p>&copy; 2023 E-Shop. All rights reserved.</p>
        </div>
      </footer>
    </>
  )
}