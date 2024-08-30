"use client";
import React, { useState, useEffect, useMemo } from "react";

import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dialog } from 'primereact/dialog';
import { Calendar } from 'primereact/calendar';


interface DropdownItem {
    name: string;
    code: string;
}

const Customer = () => {
    const [products2, setProducts2] = useState([
        {
            color: "Spring Muscle Melt",
            image: "demo/images/ecommerce/product-list/1111.jpeg",
            price: 150,
        },
        {
            color: "Little Miss Sparkle Package",
            image: "demo/images/ecommerce/product-list/2222.jpeg",
            price: 200,
        },
        {
            color: "Skin Sensation",
            image: "demo/images/ecommerce/product-list/3333.jpeg",
            price: 180,
        },
        {
            color: "Twos Company",
            image: "demo/images/ecommerce/product-list/4444.jpeg",
            price: 250,
        },
        {
            color: "Skin Sensation",
            image: "demo/images/ecommerce/product-list/5555.jpeg",
            price: 180,
        },
        {
            color: "Twos Company",
            image: "demo/images/ecommerce/product-list/1111.jpeg",
            price: 250,
        },
        {
            color: "Skin Sensation",
            image: "demo/images/ecommerce/product-list/7777.jpeg",
            price: 180,
        },
        {
            color: "Twos Company",
            image: "demo/images/ecommerce/product-list/2222.jpeg",
            price: 250,
        },
    ]);

    const onColorChange = (color: string, productIndex: number) => {
        const _products2 = [...products2];
        _products2[productIndex]["color"] = color;
        setProducts2(_products2);
    };

    const [visible, setVisible] = useState(false);

    const [date2, setDate2] = useState(null);

    const dateTemplate = (date2:any) => {
        if (date2.day > 1 && date2.day < 13) {
            return (
                <strong style={{ textDecoration: 'line-through' }}>{date2.day}</strong>
            );
        }

        return date2.day;
    }

    return (
        <div className="card">
            <div className="grid -mt-3 -ml-3 -mr-3">
                {products2.map((product, i) => {
                    return (
                        <div
                            key={i}
                            className="col-12 md:col-6 lg:col-3 mb-5 lg:mb-0"
                        >
                            <div className="mb-3 relative">
                                <img
                                    src={"/" + product.image}
                                    className="w-full"
                                    alt={i.toString()}
                                />
                                <Button onClick={() => setVisible(true)}
                                    type="button"
                                    className="border-1 border-white border-round py-2 px-3 absolute bg-black-alpha-30 text-white inline-flex align-items-center justify-content-center hover:bg-black-alpha-40 transition-colors transition-duration-300 cursor-pointer"
                                    style={{
                                        bottom: "1rem",
                                        left: "1rem",
                                        width: "calc(100% - 2rem)",
                                    }}
                                >
                                    <i className="pi pi-shopping-cart mr-3 text-base"></i>
                                    <span className="text-base">
                                        Purchase
                                    </span>
                                </Button>
                            </div>
                            <div className="flex flex-column align-items-center">
                                <span className="text-xl text-900 font-medium mb-3">
                                    {product.color}
                                </span>
                                <span className="text-xl text-900 mb-3">
                                    $ {product.price}
                                </span>


                            </div>



                            <Dialog
                                visible={visible}
                                style={{ width: "450px" }}
                                header="Purchase Details"
                                modal
                                className="p-fluid"
                                onHide={() => setVisible(false)}>

                                <div className="card p-fluid">
                                    <h5>Price $ 150</h5>
                                    

                                </div>

                                <div className="flex align-items-center gap-2">
                                    <Button label="Purchase Now" onClick={() => setVisible(false)}></Button>
                                    <Button label="Cancel" onClick={() => setVisible(false)}></Button>
                                </div>


                            </Dialog>

                        </div>
                    );
                })}
            </div >
        </div >



    );
}

export default Customer;
