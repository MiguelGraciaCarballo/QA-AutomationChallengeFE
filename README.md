# QA-AutomationChallengeFE

This project is part of the QA Tech Challenge where we have to implement a Web automation over a demo online shop: https://www.demoblaze.com/index.html

## Automation Steps

• Customer navigation through product categories: Phones, Laptops and Monitors.

• Navigate to "Laptop" → "Sony vaio i5" and click on "Add to cart". Accept pop up confirmation.

• Navigate to "Laptop" → "Dell i7 8gb" and click on "Add to cart". Accept pop up confirmation.

• Navigate to "Cart" → Delete "Dell i7 8gb" from cart.

• Click on "Place order".

• Fill in all web form fields.

• Click on "Purchase"

• Capture and log purchase Id and Amount.

• Assert purchase amount equals expected.

• Click on "Ok"

## Tech Stack

**Programming Language:** Javascript
**Server:** Node.js
**Libraries:** Puppeteer
    
## Running Aplication

To run the aplication, run the following command

```bash
  node main.js
```



