'use strict';

const Handlebars = require('handlebars');
const fs = require('fs');
const service = require('../services/Html2Pdf');
const puppeteer = require('puppeteer');
const os = require("os");
const hostname = os.hostname();

const { createCoreController } = require('@strapi/strapi').factories;

//Function to calculate priceExcludingTax
const priceExcludingTax = (invoice) => {
  let counter=1;
  const services = invoice.items.map((item) => {
    const price = item.quantity * (item.unitPrice - item.unitPrice * item.discount / 100);
    return {...item, price, counter: counter++}; 
  });
  return services;
};

//Function to calculate Base and vatAmount :
const baseVatAmount=(invoice)=>{
  const baseAndVatAmount = {};
  invoice.items.forEach(item => {
    const subtotal = item.quantity * (item.unitPrice - item.unitPrice * item.discount / 100);
    const vat = (subtotal * item.taxPercentage) / 100;
    if (!baseAndVatAmount[item.taxPercentage]) {
      baseAndVatAmount[item.taxPercentage] = {
        base: subtotal,
        tax:item.taxPercentage,
        vatAmount: vat
      };
    } else {
      baseAndVatAmount[item.taxPercentage].base += subtotal;
      baseAndVatAmount[item.taxPercentage].vatAmount += vat;
    }
  }
);
return baseAndVatAmount;
}

//Function to calculate total TVA
const total=(invoice)=>{
const totalTva=invoice.items.reduce((sum,item)=>{
  const tot=(item.unitPrice- item.unitPrice * item.discount /100)* item.taxPercentage/100 * item.quantity;
  return sum + tot;
},0);

// Function to calculate partial total
const partialTot = invoice.items.reduce((sum, item) => {
  const tot = item.quantity * item.unitPrice;
  return sum + tot;
}, 0);

//Function to calculate total discount
const totalDis=invoice.items.reduce((sum,item)=>{
  const tot = item.quantity * item.unitPrice * item.discount/100;
  return sum + tot;
}, 0);

//Function to calculate total additionalInvoiceFees
const totalAdditional=invoice.additionalInvoiceFees.reduce((sum,additional)=>{
  return sum + additional.value;
},0);

const totalAfterDisc = partialTot - totalDis;
const totalTtc = totalAfterDisc + totalTva + totalAdditional;

return {partialTot, totalDis,totalAfterDisc, totalTva, totalTtc };
}





module.exports = createCoreController('api::invoice.invoice', ({ strapi }) => ({
  async printInvoice(ctx) {
    try {
      let id = ctx.params.id;
      let lang = ctx.query.lang

      // Language : French or English
      let invoiceLabel = lang === "en" ? "Invoice" : "Facture"
      let numInvoice = lang === "en" ? "Invoice number" : "Numéro de facture"
      let customerRef = lang ==="en" ? "Customer reference" : "Réference Client"
      let customerLabel = lang ==="en" ? "Customer" : "Client"
      let company = lang ==="en" ? "Company" : "Société"
      let taxPercentageLabel = lang ==="en" ? "VAT" : "TVA"
      let totExcludingTax = lang ==="en" ? "Total" : "Total"
      let discount = lang ==="en" ? "Discount" : "Remise"
      let netAmount= lang ==="en" ? "Net amount" : "Base"
      let subtot = lang ==="en" ? "subtoal" : "Sous total"
      let discTotal= lang ==="en" ? "Discounted total" : "Total après remise"
      let totalT= lang === "en" ? "Total Including All Taxes" : "Total TTC"
      let unitPrice = lang === "en" ? "Unit Price" : "Prix Unitaire" 
      let excludingTax=lang==="en" ?  "(Excluding Taxes)" : "(Hors Taxes)"



      let invoices = await strapi.entityService.findMany('api::invoice.invoice', {
        filters: { id },
        populate: {
          customer: {
            populate: {
              companyData: true
            },
          },
          items: true,
          additionalInvoiceFees: true,
        }
      });

      const host = `http://${ctx.headers.host}`;
      let invoice = invoices[0];
      let items = priceExcludingTax(invoice);
      let baseAndVatAmount = baseVatAmount(invoice);
      let totalPrice = total(invoice);
      let date = invoice.date;
      let changeDate = date.slice(8,10) +'/'+ date.slice(5,7)+'/'+ date.slice(0,4);
      let source = fs.readFileSync(`C:/Users/a/Desktop/treasure-server-develop/public/Views/invoice.hbs`);
      const css = fs.readFileSync(`C:/Users/a/Desktop/treasure-server-develop/public/Views/style.css`, 'utf-8');
      let template = Handlebars.compile(source.toString());
      let showColumnTaxPercentage = invoice.items.some(el => el.taxPercentage !== 0)
      let showColumnDiscount = invoice.items.some(el => el.discount !== 0)
      items = items.map(el => ({...el, showColumnTaxPercentage,showColumnDiscount}))
      let showAdditional = invoice.additionalInvoiceFees.some(el => el.title !== null)
      let result = template({ 
        ...invoice, 
        css, 
        host,
        baseAndVatAmount, 
        items, 
        totalPrice,
        invoiceLabel,
        numInvoice,
        customerRef,
        customerLabel,
        company, 
        taxPercentageLabel,
        totExcludingTax,
        discount,
        subtot,
        discTotal,
        totalT,
        unitPrice,
        netAmount,
        excludingTax,
        changeDate,
        showColumnTaxPercentage,
        showColumnDiscount,
        showAdditional,
      });

      ctx.set("Content-Type", "application/pdf");
      let pdfGenerated = await service.html2pdf(result, {
        format: "A4",
        scale: 1,
      });
      ctx.body = pdfGenerated;
      return pdfGenerated;

    } catch (err) {
      console.log(err);
      ctx.body = err;
    }
  },
}));
