import { useState, useEffect } from 'react';
import './card.css';
import { country_list } from '../js/countries';

const Card = () => {
  const [amount, setAmount] = useState('1');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('KES');
  const [exchangeRate, setExchangeRate] = useState(null);

  useEffect(() => {
    loadFlags();
    fetchExchangeRate();
  }, []);

  useEffect(() => {
    loadFlags();
    fetchExchangeRate();
  }, [fromCurrency, toCurrency]);

  const fetchExchangeRate = async () => {
    const apikey = import.meta.env.VITE_API_KEY;
    try {
      const url = `https://v6.exchangerate-api.com/v6/${apikey}/latest/${fromCurrency}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();
      const rate = result.conversion_rates[toCurrency];
      const totalExchangeRate = (amount * rate).toFixed(2);
      setExchangeRate(`${amount} ${fromCurrency} = ${totalExchangeRate} ${toCurrency}`);
    } catch (error) {
      console.error('Error:', error.message);
      setExchangeRate('Error! Could not retrieve data.');
    }
  };

  const handleSwap = () => {
    setFromCurrency(prevFrom => {
      setToCurrency(prevFrom);
      return toCurrency;
    });
    fetchExchangeRate();
  };

  const handleChange = (e) => {
    const { value, className } = e.target;
    if (className.includes('from')) {
      setFromCurrency(value);
    } else if (className.includes('to')) {
      setToCurrency(value);
    }
    fetchExchangeRate();
  };

  const loadFlags = () => {
    const fromFlagElement = document.querySelector('.from .select-box img');
    const toFlagElement = document.querySelector('.to .select-box img');

    if (fromCurrency in country_list) {
      fromFlagElement.src = `https://www.flagsapi.com/${country_list[fromCurrency]}/shiny/64.png`;
    }

    if (toCurrency in country_list) {
      toFlagElement.src = `https://www.flagsapi.com/${country_list[toCurrency]}/shiny/64.png`;
    }
  };

  return (
    <div className="wrapper">
      <header>Currency Converter</header>
      <form action="#">
        <div className="amount">
          <p>Enter Amount</p>
          <input
            type="text"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <div className="list">
          <div className="from">
            <p>From</p>
            <div className="select-box">
              <img src={`https://www.flagsapi.com/${country_list[fromCurrency]}/shiny/64.png`} alt="From Currency Flag" />
              <select
                className="from"
                value={fromCurrency}
                onChange={handleChange}
              >
                {Object.keys(country_list).map(currency_code => (
                  <option key={currency_code} value={currency_code}>
                    {currency_code}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="icon" onClick={handleSwap}>
            <i className="bx bx-transfer" />
          </div>
          <div className="to">
            <p>To</p>
            <div className="select-box">
              <img src={`https://www.flagsapi.com/${country_list[toCurrency]}/shiny/64.png`} alt="To Currency Flag" />
              <select
                className="to"
                value={toCurrency}
                onChange={handleChange}
              >
                {Object.keys(country_list).map(currency_code => (
                  <option key={currency_code} value={currency_code}>
                    {currency_code}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="rate">{exchangeRate || 'Getting Exchange Rate.....'}</div>
        <button type="button" onClick={fetchExchangeRate}>
          Check Exchange Rate
        </button>
      </form>
    </div>
  );
};

export default Card;
