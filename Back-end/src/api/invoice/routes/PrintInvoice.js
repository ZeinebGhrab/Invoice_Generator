module.exports= {
    routes: [
      {
        "method": "GET",
        "path": "/print-invoice/:id",
        "handler": "invoice.printInvoice",
        "config": {
          "auth": false
        }
      },
    ]
  }