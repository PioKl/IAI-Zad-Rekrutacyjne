import React, { useState, useEffect } from 'react';
import PopUp from './PopUp';
import '../styles/Xbox.scss';

export default function Xbox() {

    const [data, setData] = useState();

    useEffect(() => {
        loadXboxData();
    }, [])

    const loadXboxData = async () => {
        await fetch('data/xbox.json')
            .then(response => response.json())
            .then(data => setData(data))
            .catch(error => {
                console.log(error)
            });
    }

    const [openPopUp, setOpenPopUp] = useState(false);
    return (
        <>
            {data ?
                <>
                    <div className="card">
                        <img className="card__img" src="https://cdn.shopify.com/s/files/1/0409/7245/products/silver_cc6169e3-7656-451c-9f9a-5e0ea2abcb63_900x.png?v=1608656521" alt="Zdjęcie Poglądowe Konsoli Xbox One S" />
                        <span className="card__consoleName">Konsola MICROSOFT XBOX ONE S 500GB + FIFA 19</span>
                        <button onClick={() => setOpenPopUp(true)} className="card__consoleButton">Dodaj do koszyka</button>
                    </div>
                    <PopUp jsonData={data} openPopUp={openPopUp} setOpenPopUp={setOpenPopUp} />
                </>
                :
                <div className='loading'>
                    <h1 className='loading__heading'>Ładowanie danych...</h1>
                </div>
            }

        </>
    )
}
