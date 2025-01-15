import React, { useEffect, useState } from 'react'
import ProductCard from './ProductCard'
import axios from 'axios'

export default function HomePage() {

    const [featuredProducts, setFeaturedProducts] = useState([]);

    // effect: when the component is mounted for the first time, read in the featured
    // products
    useEffect(() => {

        const fetchData = async () => {
            const response = await axios.get('featured.json');
            setFeaturedProducts(response.data);
        }
        fetchData();

    }, []);

    const renderProducts = () => {
        const products = [];
        for (let p of featuredProducts) {
            products.push(<div className="col-md-3 mb-4" key={p.id}>
                <ProductCard
                    imageUrl={p.image}
                    productName={p.name}
                    price={p.price}
                />
            </div>);
        }
        return products;
    }

    return (<>
        <header className="bg-primary text-white text-center py-5">
            <div className="container">
                <h1 className="display-4">Welcome to E-Shop</h1>
                <p className="lead">Discover amazing products at unbeatable prices!</p>
                <a href="#" className="btn btn-light btn-lg">Shop Now</a>
            </div>
        </header>

        <main className="container my-5">
            <h2 className="text-center mb-4">Featured Products</h2>
            <div className="row">
                {
                    renderProducts()
                }


               
            </div>
        </main>
    </>)
}