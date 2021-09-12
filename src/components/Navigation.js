import React, { useContext } from 'react'
import '../styles/Navigation.scss';
import { ReactComponent as CartIcon } from '../icons/cartIcon.svg';
import { ReactComponent as GoFurtherIcon } from '../icons/arrowIcon.svg';
import { ShopBasketContext } from '../contexts/ShopBasketContext';

export default function Navigation() {
    const { order } = useContext(ShopBasketContext);
    let totalPrice = 0;
    let totalQuantity = 0;
    for (const xboxItem of order) {
        totalPrice += xboxItem.price
        totalQuantity += xboxItem.quantity
    }
    return (
        <nav id='nav'>
            <div className="shopCart">
                <CartIcon className="shopCart__cartIcon" />
                <span className="shopCart__counter">{totalQuantity}</span>
                <span className="shopCart__totalCost">{totalPrice} zł</span>
                {/* Przycisk, który w przyszłości prowadziłby do podsumowania koszyka */}
                <button className="shopCart__goFurtherButton">
                    <GoFurtherIcon className="shopCart__goFurtherIcon" />
                </button>
            </div>
        </nav>
    )
}
