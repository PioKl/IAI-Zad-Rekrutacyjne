import React, { useState, useContext } from 'react'
import '../styles/PopUp.scss';
import { ReactComponent as CloseIcon } from '../icons/closeIcon.svg';
import { ReactComponent as ArrowIcon } from '../icons/arrowIcon.svg';
import { ShopBasketContext } from '../contexts/ShopBasketContext';

export default function PopUp({ jsonData, openPopUp, setOpenPopUp }) {
    const { order, setOrder } = useContext(ShopBasketContext);
    const [data] = useState(jsonData);

    const ramSizes = Object.values(data.sizes.items) //Znajdują się tu wszystkie items, a w każdym z nich pamięć ram

    /* Wybrana ilość pamięci ram. Zaznaczona jest pierwsza pamięć ram z items z pliku json na samym początku */
    const [choosedXboxRam, setChoosedXboxRam] = useState(ramSizes[0]);

    /* ================================================================================================================================ 
        Tablice posiadające wszystkie dostępne kolory i różnice w cenach (zależne od koloru)
        Hooki: pickedColorVariant - wybrany przez użytkownika kolor, priceDiffrence -  różnica w cenie po wybraniu odpowiedniego koloru
        Zmienna: newPrice - cena danej konsoli z uwzględnieniem różnicy cenowej po wybraniu odpowiedniego koloru 
    ==================================================================================================================================*/

    const multiVersions = Object.values(data.multiversions[0].items) //Zamienienie obiektu items, która znajduje się w tablicy multiVersions również na tablicę w celu użycia map

    let multiValues = multiVersions.map((item) => { //zwrócenie tablicy values z obiektów 1-1, 1-2, 1-3
        return Object.values(item.values)
    })

    //Tablica wszystkich dostępnych wariantów kolorystycznych
    let colors = multiValues.map((color) => {
        return color[0].name
    })

    //Tablica wszystkich produktów
    let multiProducts = multiVersions.map((item) => {
        return Object.values(item.products)
    })

    //Tablica wszystkich dostępnych przecen powiązanych z kolorami
    let priceDifferences = multiProducts.map((item) => {
        return item[0].price_difference * 1 //dodatkowo zamiana na typ number
    })

    const [pickedColorVariant, setPickedColorVariant] = useState(colors[0]); //domyślnie pierwszy z tablicy colors

    const [priceDiffrence, setPriceDiffrence] = useState(priceDifferences[0]); //domyślnie pierwszy z tablice priceDifferences

    let newPrice = choosedXboxRam.price + priceDiffrence;

    /* ============================================================================================================= 
                                Hook odpowiedzialny za wyświetlenie drop-down listy

        Dodatkowo: Jeśli otworzony jest dropDownList z wariantami kolorów do wyboru to dopiero wtedy będzie możliwość zamknięcia dropdowna poprzez kliknięcie gdzieś w obszare popUp-containera
        onClick={() => showVariantsDropDownList && setShowVariantsDropDownList(false)}
    =================================================================================================================*/

    const [showVariantsDropDownList, setShowVariantsDropDownList] = useState(false);

    /* ============================================================================================================= 
                                                    Galeria 
    =================================================================================================================*/

    const [galleryItem, setGalleryItem] = useState(0);

    const handleNextGalleryItem = () => {
        setGalleryItem(galleryItem + 1);

        /*Wybranie kolejnego zdjęcia w galerii ma także wpływ na wybrany kolor w liście wariantów, jak i również cenę (obniżka ceny, związana z wyborem koloru). Działa to także w drugą stronę wybranie koloru, poprzez listę wariantów wpływa na wyświetlenie odpowiedniego zdjęcia w galerii */

        setPickedColorVariant(colors[galleryItem + 1]);
        setPriceDiffrence(priceDifferences[galleryItem + 1])
        if (galleryItem === colors.length - 1) {
            setGalleryItem(0);
            setPickedColorVariant(colors[0]);
            setPriceDiffrence(priceDifferences[0]);
        }
    }
    const handlePreviousGalleryItem = () => {
        setGalleryItem(galleryItem - 1);
        setPickedColorVariant(colors[galleryItem - 1]);
        setPriceDiffrence(priceDifferences[galleryItem - 1]);
        if (galleryItem <= 0) {
            setGalleryItem(colors.length - 1);
            setPickedColorVariant(colors[colors.length - 1]);
            setPriceDiffrence(priceDifferences[priceDifferences.length - 1]);
        }
    }

    /* ============================================================================================================= 
                                            Licznik ilości sztuk konsol dodawanych do zakupu
    =================================================================================================================*/

    const [quantity, setQuantity] = useState(1); //Początkowa ilość, domyślnie wynosi 1

    //Zmniejszanie ilości konsol do zakupu
    const handleMinus = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1)
        }
    }

    //Zwiększanie ilości konsol do zakupu
    const handlePlus = () => {
        if (quantity >= 0 && quantity < choosedXboxRam.amount) {
            setQuantity(quantity + 1)
        }
    }

    /* ============================================================================================================= 
                                        Dodanie do koszyka Podsumowanie
    =================================================================================================================*/
    const handleAdd = (e) => {
        e.preventDefault();
        choosedXboxRam.amount = choosedXboxRam.amount - quantity; // zmiana stanu w magazynie wybranej konsoli
        setQuantity(choosedXboxRam.amount > 0 ? 1 : 0); //jeśli w magazynie ilość sztuk jest większa od zero to quantity będzie wynosiło 1, a jeśli nie to 0

        if (choosedXboxRam.amount === 0) {
            choosedXboxRam.status = 'Produkt niedostępny';
        }

        quantity > 0 && setOrder([...order, { price: newPrice * quantity, color: pickedColorVariant, ram: choosedXboxRam.name, quantity: quantity }]) //zamówienie użytkownika

        quantity && setOpenPopUp(false); //jeśli quantity nie jest puste (nie jest false) to po dodaniu do koszyka, następuje zamknięciu PopUpa;
    }

    return (
        <>
            {openPopUp &&
                <div className="popUp-Box">
                    <div className='popUp-container' onClick={() => showVariantsDropDownList && setShowVariantsDropDownList(false)}>

                        <div className="popUp-container__gallery">
                            <button onClick={handlePreviousGalleryItem} className="popUp-container__arrowButton"><ArrowIcon className="popUp-container__arrowIcon popUp-container__arrowIcon--left" /></button>
                            <img className="popUp-container__img" src={multiVersions[galleryItem].products[0].url} alt="Zdjęcie Poglądowe Konsoli Xbox One S" />
                            <button onClick={handleNextGalleryItem} className="popUp-container__arrowButton"><ArrowIcon className="popUp-container__arrowIcon popUp-container__arrowIcon--right" /></button>
                        </div>

                        <form onSubmit={handleAdd} className="popUp-container__form">
                            <div className="consoleHead-container">
                                <h1 className="consoleHead-container__name">{data.product.name}</h1>
                                <button onClick={() => { setOpenPopUp(false) }} className="consoleHead-container__closeButton"><CloseIcon className="consoleHead-container__closeIcon" /></button>
                            </div>
                            <span className="consolePricing">{newPrice.toFixed(2).replace(/\./g, ',')} zł</span>
                            <div className="consoleRam-container">
                                <span className="consoleRam-container__sizeText">Rozmiar: </span>
                                <ul className="consoleRam-container__ramList">
                                    {ramSizes.map((ram, index) => (
                                        <li className="consoleRam-container__ramItem" key={index}>
                                            <button type="button" onClick={() => { setChoosedXboxRam(ramSizes[index]); setQuantity(ramSizes[index].amount > 0 ? 1 : 0) }} value={ram.name} disabled={choosedXboxRam.name.replaceAll(' ', '') === `${ram.name.replaceAll(' ', '')}` ? true : false} className="consoleRam-container__ramButton" title={`Dostępnych sztuk: ${ram.amount}`}>{ram.name}</button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="consoleVariants">
                                <span className="consoleVariants__variantText">Wariant:</span>
                                <div className="selectVariant">
                                    <span onClick={() => setShowVariantsDropDownList(!showVariantsDropDownList)} className="selectVariant__selectedVariant">{pickedColorVariant}</span>
                                    {showVariantsDropDownList &&
                                        <ul className='selectVariant__dropDownList'>
                                            {colors.map((color, index) => (
                                                <li onClick={() => { setPickedColorVariant(colors[index]); setGalleryItem(index); setPriceDiffrence(priceDifferences[index]); setShowVariantsDropDownList(false) }} className='selectVariant__item' key={index} value={color}>{color}</li>
                                            ))}
                                        </ul>
                                    }
                                </div>
                            </div>
                            <div className="consoleAvailability-container">
                                <span className={`consoleAvailability-container__availability ${choosedXboxRam.amount > 0 ? 'consoleAvailability-container__availability--available' : 'consoleAvailability-container__availability--notAvailable'}`}>{choosedXboxRam.status}</span>
                                {choosedXboxRam.amount !== 0 &&
                                    <div className="consoleAvailability-container__delivery">
                                        <div className={`consoleAvailability-container__deliveryInformation`}>
                                            <span className="consoleAvailability-container__whenSending">Możemy wysłać już dzisiaj!</span>
                                            <a href="/#" className="consoleAvailability-container__deliveryTimeInfo">Sprawdź czasy i koszy wysyłki</a>
                                        </div>
                                    </div>
                                }
                            </div>

                            <div className="consoleOrder-container">
                                <div className='consoleStock-container'>
                                    <div className={`consoleQuantity-container ${choosedXboxRam.amount === 0 && 'consoleQuantity-container--disable'}`}>
                                        <button type="button" disabled={quantity <= 1 && true} onClick={handleMinus} title="Zmniejsz ilość" className="consoleQuantity-container__quantityButton consoleQuantity-container__quantityButton--reduce">-</button>

                                        <input title={`Ilość sztuk do koszyka, maksymalnie: ${choosedXboxRam.amount}`} className="consoleQuantity-container__quantityInput" value={quantity} autoComplete='off' type="number" name="quantity" min="1" max={choosedXboxRam.amount} onChange={(e) => setQuantity(e.target.value <= choosedXboxRam.amount && e.target.value !== '' && parseInt(e.target.value !== '0' && e.target.value))}></input>

                                        <button type="button" disabled={quantity >= choosedXboxRam.amount && true} onClick={handlePlus} title={`Zwiększ ilość - dostępnych sztuk: ${choosedXboxRam.amount}`} className="consoleQuantity-container__quantityButton consoleQuantity-container__quantityButton--add">+</button>
                                    </div>
                                    <span className={`consoleStock-container__ramInStock ${(choosedXboxRam.amount <= 0 || showVariantsDropDownList === true) && 'consoleStock-container__ramInStock--hidden'}`}>Dostępnych sztuk: {choosedXboxRam.amount}</span>
                                </div>

                                <button type="submit" disabled={choosedXboxRam.amount <= 0 ? true : false} title="Dodaj do koszyka" className="consoleOrder-container__addToBasketButton">
                                    <span className={`consoleOrder-container__addToBasketButtonTitle}`}>Dodaj do koszyka</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            }
        </>
    )
}
