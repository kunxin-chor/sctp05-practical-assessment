import React, { useState } from 'react';
import Navbar from './Navbar';
import HomePage from './HomePage'
import ProductPage from './ProductPage'
import RegisterPage from './RegisterPage'
import { Route, Switch } from 'wouter';

export default function App() {

  return (
    <>
      <Navbar />

      {/* Any JSX in the switch now be part of the pages */}
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/products" component={ProductPage}/>
        <Route path="/register" component={RegisterPage}/>
      </Switch>


      <footer className="bg-dark text-white text-center py-3">
        <div className="container">
          <p>&copy; 2023 E-Shop. All rights reserved.</p>
        </div>
      </footer>
    </>
  )
}