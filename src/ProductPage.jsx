import React, { useEffect, useState } from 'react'
import axios from 'axios'
import ProductCard from './ProductCard'

export default function ProductPage() {

    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const response = await axios.get("products.json");
            setProducts(response.data);
        }
        fetchData();
    }, []);

    return (
        <div className="container mt-5">
            <h1>Our Products</h1>
            <div className="row">
                {
                    products.map(p =>
                        (
                            <div className="col-md-3 mb-4" key={p.id}>
                                <ProductCard
                                    imageUrl={p.image}
                                    productName={p.name}
                                    price={p.price}
                                />
                            </div>
                        )
                    )
                }
            </div>
        </div>
    )
}