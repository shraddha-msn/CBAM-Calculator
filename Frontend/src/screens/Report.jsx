import React from 'react'
import generatePDF from "react-to-pdf";

export default function Report({ inputs, details, sdate, edate, result }) {

    const options = {
        filename: "Report.pdf",
        page: {
            margin: 20
        }
    }

    const getTargetElement = () => document.getElementById("reportSection");

    const downloadPdf = () => generatePDF(getTargetElement, options);

    return (
        <>
            <div id="reportSection" className="d-grid gap-2">
                <h2>Report Details</h2>
                <h4>Reporting Period: {sdate.format('DD-MM-YYYY')} to {edate.format('DD-MM-YYYY')}</h4>
                <h4>Year: {sdate.format('YYYY')} </h4>
                <h4>Reporting Declarant: {details.decName}</h4>
                <h4>Declarant Address: {details.decAddress}</h4>
                <h4>Importer Company: {details.compName}</h4>
                <h4>Company Address: {details.compAddress}</h4>
                <h4>CBAM goods imported: {inputs.product}</h4>
                <h4>CN number (Combined Nomenclature): {inputs.code}</h4>
                <h4>Country of origin: {details.coofOrigin}</h4>
                <h4>Imported quantity per customs procedure: {inputs.weight} {inputs.unit}</h4>
                <h3>CBAM Emission Data</h3>
                <h4>Direct embedded Emission: {result.diremission.directEm} {result.diremission.unit} </h4>
                <h4>Indirect embedded Emission: {result.indiremission.indirectEm} {result.indiremission.unit}</h4>
                <h4>Total embedded Emission: {result.totemission.totEm} {result.totemission.unit}</h4>
                <h3>Carbon tax</h3>
                <h4>In {result.carbonPrice.currency}: {result.carbonPrice.price}</h4>
            </div>
            <button className="btn btn-primary" onClick={downloadPdf}>
                <div className="d-flex align-items-center">
                    <p>Download as PDF</p>
                </div>
            </button>
        </>
    )
}

