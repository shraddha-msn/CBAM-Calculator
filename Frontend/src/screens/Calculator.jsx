import React, { useState, useEffect } from 'react';
import Navbar from '../components/shared/Navbar';
import Select1 from '../components/caluculatorComponents/Select1';
import Select2 from '../components/caluculatorComponents/Select2';
import Date from '../components/caluculatorComponents/Date';
import Report from '../screens/Report';
import dayjs from 'dayjs';
import './Calculator.css';

export default function Calculator() {
  useEffect(() => {
    getCountries();
    getProducts();
    getCurrency();
  }, []);

  const [inputs, setInputs] = useState({
    product: '',
    code: '',
    unit: '',
    weight: '',
    currency: '',
  });

  const [details, setDetails] = useState({
    decName: '',
    decAddress: '',
    decEmail: '',
    compName: '',
    compAddress: '',
    compEmail: '',
    coofOrigin: '',
  });

  const [products, setProducts] = useState([]);
  const [subproducts, setSubproducts] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [countries, setCountries] = useState([]);
  const [sdate, setSdate] = useState(dayjs());
  const [edate, setEdate] = useState(dayjs());
  const [result, setResult] = useState({
    diremission: { directEm: '', unit: '' },
    indiremission: { indirectEm: '', unit: '' },
    totemission: { totEm: '', unit: '' },
    carbonPrice: { price: '', currency: '' },
  });
  const [isDisabled, setIsDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const { diremission, indiremission, totemission, carbonPrice } = result;
  const { directEm: directEmissions, unit: emissionUnit1 } = diremission;
  const { indirectEm: indirectEmissions, unit: emissionUnit2 } = indiremission;
  const { totEm: totalEmissions, unit: emissionUnit3 } = totemission;
  const { price: carbonPriceValue, currency: carbonCurrency } = carbonPrice;

  useEffect(() => {
    if (
      inputs.product !== '' &&
      inputs.code !== '' &&
      inputs.currency !== '' &&
      inputs.unit !== '' &&
      inputs.weight !== ''
    ) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  }, [inputs]);

  function handleChange(e) {
    const v = e.target.value;
    const n = e.target.name;
    setInputs({ ...inputs, [n]: v });
  }

  function detailChange(e) {
    const v = e.target.value;
    const n = e.target.name;
    setDetails({ ...details, [n]: v });
  }

  function handleSdate(date) {
    setSdate(date);
  }

  function handleEdate(date) {
    setEdate(date);
  }

  function handleSubmit(e) {
    e.preventDefault();
    getResult();
  }

  async function getCountries() {
    const url = 'https://restcountries.com/v3.1/all?fields=name,name';
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const json = await response.json();
      const country = json.map((c) => c.name.common);
      setCountries(country.sort());
    } catch (error) {
      console.error(error.message);
    }
  }

  async function getProducts() {
    const url = 'http://localhost:3000/api/products';
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const json = await response.json();
      setProducts(json.efactordata || []);
    } catch (error) {
      console.error(error.message);
    }
  }

  async function getCurrency() {
    const url = 'http://localhost:3000/api/currency';
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const json = await response.json();
      setCurrencies(json || []);
    } catch (error) {
      console.error(error.message);
    }
  }

  async function getResult() {
    const url = 'http://localhost:3000/api/result';
    const method = 'POST';
    try {
      setIsLoading(true);
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(inputs),
      });
      setIsLoading(false);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const json = await response.json();
      setResult(json);
    } catch (error) {
      setIsLoading(false);
      console.error(error.message);
    }
  }

  useEffect(() => {
    if (inputs.product && products.length > 0) {
      const s = products.find((p) => p.product === inputs.product);
      if (s && s.subProduct) {
        setSubproducts(s.subProduct);
      } else {
        setSubproducts([]);
      }
    } else {
      setSubproducts([]);
    }
  }, [inputs.product, products]);

  useEffect(() => {
  console.log("products from API:", products);
  console.log("currencies from API:", currencies);
    }, [products, currencies]);


  return (
    <>
      <Navbar />
      <div className="calculator-page">
        <div className="calculator-wrapper">
          <h2 className="calculator-title">CBAM Emission Calculator</h2>
          <p className="calculator-subtitle">
            Enter your details below to generate your CBAM report.
          </p>

          <div className="calculator-card">
            <form onSubmit={handleSubmit} className="calculator-form">
              {/* Left column – details & inputs */}
              <div className="calculator-form-left">
                <h5 className="section-heading">Declarant Details</h5>
                <div className="input-group input-group-sm mb-3">
                  <input
                    name="decName"
                    value={details.decName}
                    type="text"
                    aria-label="Declarant name"
                    className="form-control"
                    placeholder="Declarant Name"
                    onChange={detailChange}
                  />
                  <input
                    name="decAddress"
                    value={details.decAddress}
                    type="text"
                    aria-label="Declarant Address"
                    className="form-control"
                    placeholder="Declarant Address"
                    onChange={detailChange}
                  />
                </div>
                <div>
                  <input
                    name="decEmail"
                    value={details.decEmail}
                    type="email"
                    className="form-control mb-3"
                    placeholder="Declarant Email"
                    onChange={detailChange}
                  />
                </div>

                <h5 className="section-heading mt-3">Company Details</h5>
                <div className="input-group input-group-sm mb-3">
                  <input
                    name="compName"
                    value={details.compName}
                    type="text"
                    aria-label="Company name"
                    className="form-control"
                    placeholder="Company Name"
                    onChange={detailChange}
                  />
                  <input
                    name="compAddress"
                    value={details.compAddress}
                    type="text"
                    aria-label="Company Address"
                    className="form-control"
                    placeholder="Company Address"
                    onChange={detailChange}
                  />
                </div>
                <div>
                  <input
                    name="compEmail"
                    value={details.compEmail}
                    type="email"
                    className="form-control mb-3"
                    placeholder="Company Email"
                    onChange={detailChange}
                  />
                </div>

                <Select2
                  name="coofOrigin"
                  val1={details.coofOrigin}
                  defaultSelect="Select Country of Origin"
                  data={countries}
                  handleChange={detailChange}
                />

                <h5 className="section-heading mt-4">Product Details</h5>
                <Select2
                  name="product"
                  val1={inputs.product}
                  defaultSelect="Select Product"
                  data={products.map((p) => p.product)}
                  handleChange={handleChange}
                />
                {subproducts && subproducts.length > 0 && (
                  <Select1
                    name="code"
                    val1={inputs.code}
                    val2={'CNcode'}
                    text={'productName'}
                    defaultSelect="Select CN Code"
                    data={subproducts}
                    handleChange={handleChange}
                  />
                )}
                <Select2
                  name="currency"
                  val1={inputs.currency}
                  defaultSelect="Select Currency"
                  data={currencies}
                  handleChange={handleChange}
                />
                <Select2
                  name="unit"
                  val1={inputs.unit}
                  defaultSelect="Select Weight Unit"
                  data={['kg', 'ton']}   
                  handleChange={handleChange}
                />
                <div className="input-group input-group-sm mb-3">
                  <input
                    value={inputs.weight}
                    onChange={handleChange}
                    name="weight"
                    type="number"
                    min="1"
                    className="form-control"
                    placeholder="Weight"
                  />
                </div>

                <div className="row g-3 mb-3">
                  <div className="col-12 col-md-6">
                    <p className="mb-1 small-label">Start date</p>
                    <Date value={sdate} handleChange={handleSdate} />
                  </div>
                  <div className="col-12 col-md-6">
                    <p className="mb-1 small-label">End date</p>
                    <Date value={edate} handleChange={handleEdate} />
                  </div>
                </div>

                <div className="d-grid">
                  <button
                    className="btn btn-primary btn-lg"
                    type="submit"
                    disabled={isDisabled}
                  >
                    {isLoading ? (
                      <div className="d-flex align-items-center justify-content-center">
                        <p className="mb-0 me-2">Calculating...</p>
                        <div
                          className="spinner-border"
                          role="status"
                          aria-hidden="true"
                        ></div>
                      </div>
                    ) : (
                      'Calculate'
                    )}
                  </button>
                </div>
              </div>

              {/* Right column – results */}
              <div className="calculator-form-right">
                <h5 className="section-heading text-center mb-3">
                  Calculation Summary
                </h5>
                <p className="summary-helper text-center mb-4">
                  Results will appear here after you calculate.
                </p>

                <div className="result-badges">
                  <p className="badge bg-success fs-6 result-badge">
                    Direct Emissions:{' '}
                    <span className="fw-semibold">
                      {directEmissions || '--'} {emissionUnit1}
                    </span>
                  </p>
                  <p className="badge bg-success fs-6 result-badge">
                    Indirect Emissions:{' '}
                    <span className="fw-semibold">
                      {indirectEmissions || '--'} {emissionUnit2}
                    </span>
                  </p>
                  <p className="badge bg-success fs-6 result-badge">
                    Total Emissions:{' '}
                    <span className="fw-semibold">
                      {totalEmissions || '--'} {emissionUnit3}
                    </span>
                  </p>
                  <p className="badge bg-success fs-6 result-badge">
                    Carbon Price:{' '}
                    <span className="fw-semibold">
                      {carbonPriceValue || '--'} {carbonCurrency}
                    </span>
                  </p>
                </div>

                {result.diremission.directEm && (
                  <div className="mt-4">
                    <Report
                      inputs={inputs}
                      details={details}
                      sdate={sdate}
                      edate={edate}
                      result={result}
                    />
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
