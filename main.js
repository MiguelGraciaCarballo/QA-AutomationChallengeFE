const puppeteer = require('puppeteer');
const url = "https://www.demoblaze.com/index.html";
const assert = require('assert');

runTest();

async function runTest () {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        slowMo: 250,
    });
    const page = await browser.newPage();
    await page.goto(url);
    
    //Handle alerts, wait 1 second and accept it
    page.on('dialog', async dialog => {
        //get alert message
        console.log("Alert: " + dialog.message());
        //accept alert
        await sleep(1000);
        await dialog.accept();
    });
    
    // Navigate to "Laptop" → "Sony vaio i5" and click on "Add to cart". Accept pop up confirmation.
    await navigateToCategory(page, "Laptops");
    await addProductToCart(page, 'Sony vaio i5');

    // Navigate to "Laptop" → "Dell i7 8gb" and click on "Add to cart". Accept pop up confirmation.
    await goLandingPage(page);
    await navigateToCategory(page, "Laptops");
    await addProductToCart(page, 'Dell i7 8gb');

    // Navigate to "Cart" → Delete "Dell i7 8gb" from cart.
    await goToCart(page);
    await deleteProduct(page, 'Dell i7 8gb');

    //Click on "Place order", Fill in all web form fields, and, Click on Purchase
    await placeOrder(page);

    const userData = {
        name: 'Miguel',
        country: 'Spain',
        city: 'Zaragoza',
        creditCard: '1111222233334444',
        month: '05',
        year: '2022'
    };

    await fillOrder(page, userData);

    await captureData(page);

    browser.close();
}

async function navigateToCategory(page, category) {
    await page.waitForXPath("//*[@id='itemc'][contains(., '" + category + "')]");
    var elements = await page.$x("//*[@id='itemc'][contains(., '" + category + "')]"); 
    await elements[0].click()
}

async function addProductToCart(page, product) {
    await page.waitForXPath("//*[@class='hrefch'][contains(., '" + product + "')]");
    var elements = await page.$x("//*[@class='hrefch'][contains(., '" + product + "')]"); 
    await elements[0].click();
    
    await page.waitForXPath("//*[@id='tbodyid']/div[2]/div/a");
    var elements = await page.$x("//*[@id='tbodyid']/div[2]/div/a"); 
    await elements[0].click();
}

async function goLandingPage(page) {
    await page.waitForXPath("//*[@id='navbarExample']/ul/li[1]/a");
    var elements = await page.$x("//*[@id='navbarExample']/ul/li[1]/a"); 
    await elements[0].click();
}

async function goToCart(page) {
    await page.waitForXPath("//*[@id='navbarExample']/ul/li[4]/a");
    var elements = await page.$x("//*[@id='navbarExample']/ul/li[4]/a"); 
    await elements[0].click();
}

async function deleteProduct(page, product) {
    await page.waitForXPath("//*[@id='tbodyid']/tr[td[.='" + product + "']]/td[4]/a");
    var elements = await page.$x("//*[@id='tbodyid']/tr[td[.='" + product + "']]/td[4]/a"); 
    await elements[0].click();
}

async function placeOrder(page) {
    await page.waitForXPath("//*[@id='page-wrapper']/div/div[2]/button");
    var elements = await page.$x("//*[@id='page-wrapper']/div/div[2]/button"); 
    await elements[0].click();
}

async function fillOrder(page, userData) {
    await page.type('#name', userData.name);
    await page.type('#country', userData.country);
    await page.type('#city', userData.city);
    await page.type('#card', userData.creditCard);
    await page.type('#month', userData.month);
    await page.type('#year', userData.year);
    
    await page.waitForXPath("//*[@id='orderModal']/div/div/div[3]/button[2]");
    var elements = await page.$x("//*[@id='orderModal']/div/div/div[3]/button[2]"); 
    await elements[0].click();
}

async function captureData(page) {

    await page.waitForSelector('body > div.sweet-alert.showSweetAlert.visible > p');
    let element = await page.$('body > div.sweet-alert.showSweetAlert.visible > p');
    let value = await page.evaluate(el => el.textContent, element);

    let filteredValue = value.replace('Id: ', '~').replace('Amount: ', '~').replace('Card Number: ', '~').replace('Date: ', '~').replace('Name: ', '~').split('~');

    let purchaseId = filteredValue[1];
    let purchaseAmount = filteredValue[2];

    assert.equal(purchaseAmount, '790 USD');
    
    console.log("ID of the purchase is: " + purchaseId);
    console.log("Purchase Amount is: " + purchaseAmount);

    await page.waitForXPath("//*[@class='confirm btn btn-lg btn-primary'][contains(., 'OK')]");
    var elements = await page.$x("//*[@class='confirm btn btn-lg btn-primary'][contains(., 'OK')]"); 
    await elements[0].click();
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}