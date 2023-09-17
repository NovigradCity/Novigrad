function selectCategory() {
    let val = dqs('#tradeSelectCategory').value;
    console.log(val);
    if (val == '-1')
        return false;
    let items = document.tradeData.items.filter(e => e.category === val);
    let buyType = dqs('#tradeSelectType').value;
    dqs('#tradeSelectItem').innerHTML = '';
    items.forEach(e => {
        if (buyType === 'sell' && e.isSell)
            dqs('#tradeSelectItem').innerHTML += `<option value='${e.name}'>${e.name}</option>`
        else if (buyType === 'buy' && e.isBuy)
            dqs('#tradeSelectItem').innerHTML += `<option value='${e.name}'>${e.name}</option>`
    });
    document.lastClacItem = {};
    dqs('#tradeAmount').value = 0;
    dqs('#tradeTab_' + val).click();
    calcTrade();
}

function calcTrade() {
    let amount = dqs('#tradeAmount').value;
    amount = parseInt(amount);
    if(amount > 20000) {
        amount = 20000;
        dqs('#tradeAmount').value = amount;
    }
    if (amount > 0) {
        let category = dqs('#tradeSelectCategory').value;
        let product = dqs('#tradeSelectItem').value;
        let buyType = dqs('#tradeSelectType').value;
        let productData = document.tradeData.items.filter(item => item.name === product && item.category === category);
        if (productData.length > 0) {
            productData = productData[0];
            let isLogic = false;
            let logic = {};
            if (typeof document.tradeData.categoryPriceLogic[category] === 'object') {
                logic = document.tradeData.categoryPriceLogic[category];
                isLogic = true;
            }

            let total = 0;
            let startPrice = 0;

            if (buyType === 'sell') {
                if(amount >= productData.amount){
                    amount = productData.amount;
                    dqs('#tradeAmount').value = amount;
                }

                startPrice = productData.sell;
            } else {
                startPrice = productData.buy;
            }
            if (!isLogic) {
                total = amount * startPrice;
            } else {
                if (buyType === 'sell') {
                    total = amount * startPrice;
                } else {
                    let currentAmm = productData.amount;
                    currentAmm = parseInt(currentAmm);
                    if (currentAmm === NaN) {
                        currentAmm = 0;
                    }
                    let steep = logic.steep;
                    let base = logic.base;
                    let tmpSteep = 0;
                    let tmpAmm = 0;
                    let lastRecalc = 0;
                    let minPrice = productData.buy / 100 * productData.minPercent;
                    if (currentAmm > base) {
                        tmpAmm = currentAmm - base;
                        lastRecalc = Math.ceil(tmpAmm / steep);
                        startPrice = startPrice - (Math.ceil(tmpAmm / steep) * logic.sell);
                        if(minPrice > startPrice)
                            startPrice = minPrice;
                    }
                    let tmpAmount = amount;

                    while (tmpAmount > 0) {
                        currentAmm += 1;
                        tmpAmount -= 1;
                        tmpAmm = currentAmm - base;
                        if (currentAmm > base) {
                            if (lastRecalc !== Math.ceil(tmpAmm / steep)) {
                                lastRecalc = Math.ceil(tmpAmm / steep);
                                startPrice -= logic.sell;
                                if(minPrice > startPrice)
                                    startPrice = minPrice;
                            }
                        }
                        total += startPrice;
                    }
                }
            }
            total = Math.floor(total);
            document.lastClacItem = {name: productData.name, category, amount, total, isLogic, buyType, icon: productData.icon}
            dqs('#calcRowTotal').innerText = total;
        } else {
            document.lastClacItem = {};
            dqs('#calcRowTotal').innerText = 0;
        }
    } else {
        dqs('#tradeAmount').value = 0;
        dqs('#calcRowTotal').innerText = 0;
        document.lastClacItem = {};
    }
}

function addToBasket() {
    if (typeof document.lastClacItem.name !== 'undefined') {
        document.basket.push(Object.assign({}, document.lastClacItem));
        let item = document.tradeData.items.filter(item => document.lastClacItem.name === item.name && document.lastClacItem.category === item.category);
        if (document.lastClacItem.buyType === 'sell') {
            item[0].amount -= document.lastClacItem.amount;
        } else if (document.lastClacItem.buyType === 'buy') {
            item[0].amount += document.lastClacItem.amount;
        }
    }
    calcTrade();
    drawBasket();
}

function removeFromBasket(index) {
    index = parseInt(index);
    let spliced = document.basket.splice(index, 1)[0];
    //console.log(spliced);
    let item = document.tradeData.items.filter(item => spliced.name === item.name && spliced.category === item.category);
    if (spliced.buyType === 'sell') {
        item[0].amount += spliced.amount;
    } else if (spliced.buyType === 'buy') {
        item[0].amount -= spliced.amount;
    }
    reCalcBasket();

    dqs('#tradeSelectCategory').value = spliced.category;
    selectCategory();
    dqs('#tradeSelectItem').value = spliced.name;
    dqs('#tradeSelectType').value = spliced.buyType;
    dqs('#tradeAmount').value = spliced.amount;

    calcTrade();
    drawBasket();
}

function reCalcBasket(){
    let newBasket = Object.assign([], document.basket);
    console.log(newBasket);
    document.basket = [];

    newBasket.forEach(item => {
        itemJ = document.tradeData.items.filter(itemF => item.name === itemF.name && item.category === itemF.category);
        if (item.buyType === 'sell') {
            itemJ[0].amount += item.amount;
        } else if (item.buyType === 'buy') {
            itemJ[0].amount -= item.amount;
        }
    })

    newBasket.forEach(item => {
        console.log(item);
        dqs('#tradeSelectCategory').value = item.category;
        dqs('#tradeSelectItem').value = item.name;
        dqs('#tradeSelectType').value = item.buyType;
        dqs('#tradeAmount').value = item.amount;
        calcTrade();
        document.basket.push(Object.assign({}, document.lastClacItem));
        itemJ = document.tradeData.items.filter(item => document.lastClacItem.name === item.name && document.lastClacItem.category === item.category);
        if (document.lastClacItem.buyType === 'sell') {
            itemJ[0].amount -= document.lastClacItem.amount;
        } else if (document.lastClacItem.buyType === 'buy') {
            itemJ[0].amount += document.lastClacItem.amount;
        }
    });
}

function drawBasket() {
    if (document.basket.length === 0) {
        dqs('#basketList').innerHTML = '';
        drawTables();
        return false;
    }
    dqs('#basketList').innerHTML = '';
    let complete = 0;
    let label = dqs('#basketCompleteLabel');
    basketList.innerHTML += `
        <div class='row p-1'>
            <div class="col-1 pe-0 border-end" style="width: 50px;"><img style="margin-left: 8px;" src="/assets/castle.png" width="24" height="24" alt="Город"></div>
            <div class="col-6 border-end">Товар</div>
            <div class="col border-end ps-1 pe-1">Кол-во</div>
            <div class="col border-end ps-1 pe-1">Цена</div>
            <div class="col-1"></div>
        </div>
        `
    document.basket.forEach((item, index) => {
        if(item.buyType === 'buy'){
            complete += item.total;
        }else{
            complete -= item.total;
        }
        basketList.innerHTML += `
        <div class='row p-1'>
            <div class="col-1 pe-0 border-end" style="width: 50px;"><img src="/assets/${item.buyType}.png" width="32" height="24" alt="${item.buyType}"></div>
            <div class="col-6 border-end"><img style="margin-right: 5px;" src="${item.icon}" width=16 height=16 alt='${item.name}'>${item.name}</div>
            <div class="col border-end ps-1 pe-1">${item.amount}</div>
            <div class="col border-end ps-1 pe-1">${item.total}</div>
            <div class="col-1"><button onclick="removeFromBasket(${index})" class="btn btn-sm btn-danger">X</button></div>
        </div>
        `
    });
    label.innerText = `Доход: ${complete}`;
    drawTables();
}