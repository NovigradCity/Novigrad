const dqs = (selector) => {
    return document.querySelector(selector);
}

async function drawTables() {
    let data = null;
    if (typeof document.tradeData === 'undefined') {
        data = await fetch('./data/catalog.json', {cache: "no-store"});
        data = await data.json();
        let data2 = await fetch('./data/VonderanShop.json', {cache: "no-store"});
        data2 = await data2.json();

        data2.items.forEach(d2i => {
            data.items.push(d2i);
        })

        for(let d2c in data2.categories){
            data.categories[d2c] = data2.categories[d2c];
        }

        for(let d2l in data2.categoryPriceLogic){
            data.categoryPriceLogic[d2l] = data2.categoryPriceLogic[d2l];
        }

        document.tradeData = data;
        console.log(data);
    }

    let trade = dqs('#trade');
    let isFirst = true;

    let afterDrawActive = null;
    let afterSelectedCategory = null;
    if (data === null) {
        data = document.tradeData;
        afterDrawActive = dqs('#tradeTabs').querySelector('.active').id;
        dqs('#tradeTabs').innerHTML = '';
        dqs('#tradeTabsContainer').innerHTML = '';
        afterSelectedCategory = dqs('#tradeSelectCategory').value;
        dqs('#tradeSelectCategory').innerHTML = '';
    }

    for (let iKey in data.categories) {
        let id = 'tradeTab_' + iKey;
        let tabHead = document.createElement('li');
        tabHead.classList.add('nav-item');
        tabHead.setAttribute('role', 'presentation');
        let tabButton = document.createElement('button');
        tabButton.classList.add('nav-link');
        tabButton.classList.add('value');
        tabButton.classList.add('text-white');
        tabButton.classList.add('rounded-0');
        if (isFirst) {
            tabButton.classList.add('active');
            //isFirst = false;
        }
        tabButton.id = id;
        tabButton.setAttribute('data-bs-toggle', 'tab')
        tabButton.setAttribute('data-bs-target', "#" + id + "Content")
        tabButton.setAttribute('type', "button")
        tabButton.setAttribute('role', "tab")
        tabButton.innerText = data.categories[iKey];
        tabHead.append(tabButton);
        dqs('#tradeTabs').append(tabHead);

        let selectOption = document.createElement('option');
        selectOption.innerText = data.categories[iKey];
        selectOption.value = iKey;
        dqs('#tradeSelectCategory').append(selectOption);

        let block = document.createElement('div');
        block.classList.add('tab-pane');
        block.classList.add('fade');
        if (isFirst) {
            block.classList.add('active');
            block.classList.add('show');
            isFirst = false;
        }
        block.id = id + "Content";
        block.setAttribute('role', 'tabpanel')
        let title = document.createElement('h3');
        title.innerText = data.categories[iKey];
        title.classList.add('text-white');
        title.classList.add('value');
        title.classList.add('d-none');
        block.append(title);
        dqs('#tradeTabsContainer').append(block);
        //trade.append(block);

        let table = document.createElement('table');
        table.classList.add('table');
        table.classList.add('table-sm');
        table.classList.add('table-striped');

        let thead = document.createElement('thead');

        let logicShow = data.categoryPriceLogic[iKey]
        let isSell = true;
        let isAmount = true;
        let isBuy = true;
        //console.log(logicShow);
        if(logicShow){
            if(typeof logicShow.showBuy !== 'undefined'){
                isSell = logicShow.showBuy;
            }
            if(typeof logicShow.showAmount !== 'undefined'){
                isAmount = logicShow.showAmount;
            }
            if(typeof logicShow.showSell !== 'undefined'){
                isBuy = logicShow.showSell;
            }
        }

        if(!isSell){
            isSell = 'd-none'
        }else{
            isSell = '';
        }

        if(!isAmount){
            isAmount = 'd-none'
        }else{
            isAmount = '';
        }

        if(!isBuy){
            isBuy = 'd-none'
        }else{
            isBuy = '';
        }

        let tr = document.createElement('tr');
        tr.innerHTML = `
        <th scope="col">#</th>
        <th>Иконка</th>
        <th scope="col">Наименование</th>
        <th scope="col" class="${isBuy}">Покупка</th>
        <th scope="col" class="${isSell}">Продажа</th>
        <th scope="col" class="${isAmount}">Наличие</th>
        `;

        thead.append(tr);
        table.append(thead);

        let tbody = document.createElement('tbody');
        tbody.id = iKey;
        table.append(tbody);

        block.append(table);
    }

    let counter = 0;
    for (let iKey in data.items) {

        let row = data.items[iKey];
        let tr = document.createElement('tr');
        let isSell = (row.isSell) ? 'text-success' : 'text-danger';
        let isBuy = (row.isBuy) ? 'text-success' : 'text-danger';

        let rowIco = '';
        if (row.icon) {
            rowIco = `<img src="${row.icon}" width=24 height=24 alt='${row.name}'>`
        }else if(row.icons){
            rowIco = ``;
            row.icons.forEach(ir => {
                rowIco += `<img src="${ir}" width=24 height=24 alt='${row.name}'>`
            })
        }

        let sell = row.buy;
        let isLogic = false;
        let logic = {};
        if (row.logic) {
            logic = row.logic;
            isLogic = true;
        } else if (typeof document.tradeData.categoryPriceLogic[row.category] === 'object') {
            logic = document.tradeData.categoryPriceLogic[row.category];
            isLogic = true;
        }

        let isSellShow = true;
        let isAmountShow = true;
        let isBuyShow = true;

        if(logic){
            if(typeof logic.showBuy !== 'undefined'){
                isSellShow = logic.showBuy;
            }
            if(typeof logic.showAmount !== 'undefined'){
                isAmountShow = logic.showAmount;
            }
            if(typeof logic.showSell !== 'undefined'){
                isBuyShow = logic.showSell;
            }
        }

        if(!isSellShow){
            isSellShow = 'd-none'
        }else{
            isSellShow = '';
        }

        if(!isAmountShow){
            isAmountShow = 'd-none'
        }else{
            isAmountShow = '';
        }

        if(!isBuyShow){
            isBuyShow = 'd-none'
        }else{
            isBuyShow = '';
        }

        if (row.isBuy && isLogic) {
            let minPrice = row.buy / 100 * row.minPercent;
            if (row.amount > logic.base) {
                let currentAmm = row.amount;
                currentAmm = parseInt(currentAmm);
                let steep = logic.steep;
                let base = logic.base;
                let tmpAmm = currentAmm - base;
                sell = sell - (Math.ceil(tmpAmm / steep) * logic.sell);

                if (row.amount % logic.steep === 0) {
                    sell -= logic.sell;
                }
            } else if (row.amount === logic.base) {
                sell -= logic.sell;
            }
            if (sell < minPrice) {
                sell = Math.ceil(minPrice);
            }
        }

        tr.innerHTML = `
        <td class="value">${counter}</td>
        <td style="width: 120px;">${rowIco}</td>
        <td class="value">${row.name}</td>
        <td class="${isBuy} ${isBuyShow} value">${sell}</td>
        <td class="${isSell} ${isSellShow} value">${row.sell}</td>
        <td class="value ${isAmountShow}">${row.amount}</td>
        `
        dqs('#' + row.category).append(tr);
        counter++;
    }

    if (afterDrawActive) {
        dqs('#' + afterDrawActive).click();
    }
    if (afterSelectedCategory) {
        dqs('#tradeSelectCategory').querySelector(`[value='${afterSelectedCategory}']`).setAttribute('selected', true);
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    document.basket = [];
    document.lastClacItem = {};

    await drawTables();
    return 0;

    let data = await fetch('./data/VonderanShop.json', {cache: "no-store"});
    data = await data.json();
    console.log(data);

    let trade = dqs('#trade');
    let isFirst = true;
    for (let iKey in data.categories) {
        let id = 'tradevShopTab_' + iKey;
        let tabHead = document.createElement('li');
        tabHead.classList.add('nav-item');
        tabHead.setAttribute('role', 'presentation');
        let tabButton = document.createElement('button');
        tabButton.classList.add('nav-link');
        tabButton.classList.add('value');
        tabButton.classList.add('text-white');
        tabButton.classList.add('rounded-0');

        tabButton.id = id;
        tabButton.setAttribute('data-bs-toggle', 'tab')
        tabButton.setAttribute('data-bs-target', "#" + id + "Content")
        tabButton.setAttribute('type', "button")
        tabButton.setAttribute('role', "tab")
        tabButton.innerText = data.categories[iKey];
        tabHead.append(tabButton);
        dqs('#tradeTabs').append(tabHead);

        let block = document.createElement('div');
        block.classList.add('tab-pane');
        block.classList.add('fade');
        if (isFirst) {
            //block.classList.add('active');
            //block.classList.add('show');
            isFirst = false;
        }
        block.id = id + "Content";
        block.setAttribute('role', 'tabpanel')
        let title = document.createElement('h3');
        title.innerText = data.categories[iKey];
        title.classList.add('text-white')
        title.classList.add('value')

        //tradeSelectCategory
        block.append(title);
        dqs('#tradeTabsContainer').append(block)
        //trade.append(block);

        let table = document.createElement('table');
        table.classList.add('table');
        table.classList.add('table-sm');
        table.classList.add('table-striped');

        let thead = document.createElement('thead');

        let tr = document.createElement('tr');
        tr.innerHTML = `
        <th scope="col">#</th>
        <th>Иконка</th>
        <th scope="col">Наименование</th>
        <th scope="col">Цена</th>
        `;

        thead.append(tr);
        table.append(thead);

        let tbody = document.createElement('tbody');
        tbody.id = iKey;
        table.append(tbody);

        block.append(table);
    }

    counter = 0;
    for (let iKey in data.items) {
        let row = data.items[iKey];
        let tr = document.createElement('tr');
        tr.style.fontSize = '1.5em';
        let rowIco = '';
        if (row.icons) {
            if (row.icons.length > 0) {
                row.icons.forEach(ic => {
                    rowIco += `<img src="${ic}" width=32 height=32 alt='${row.name}'>`
                })
            }
        }
        tr.innerHTML = `
        <td style="width: 100px;" class="value">${counter}</td>
        <td style="width: 180px;">${rowIco}</td>
        <td class="value">${row.name}</td>
        <td style="width: 100px;" class="value text-success">${row.price}</td>
        `
        dqs('#' + row.category).append(tr);
        counter++;
    }
})