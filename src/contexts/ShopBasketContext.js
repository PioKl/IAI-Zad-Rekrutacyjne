import React, { createContext, useState } from 'react';

export const ShopBasketContext = createContext();

const ShopBasketContextProvider = (props) => {
    const [order, setOrder] = useState([]);

    return (
        <ShopBasketContext.Provider value={{ order, setOrder }}>
            {props.children}
        </ShopBasketContext.Provider>
    )
}

export default ShopBasketContextProvider;