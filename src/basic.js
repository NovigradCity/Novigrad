const dqs = (selector) => {
    return document.querySelector(selector);
}

const dqsa = (selector) => {
    return document.querySelectorAll(selector);
}

async function drawTables(sort = null) {
    let data = null;
    if (typeof document.tradeData === 'undefined') {
        data = await fetch('./data/catalog.json', {cache: "no-store"});
        data = await data.json();
        let data2 = await fetch('./data/VonderanShop.json', {cache: "no-store"});
        data2 = await data2.json();

        data2.items.forEach(d2i => {
            data.items.push(d2i);
        })

        for (let d2c in data2.categories) {
            data.categories[d2c] = data2.categories[d2c];
        }

        for (let d2l in data2.categoryPriceLogic) {
            data.categoryPriceLogic[d2l] = data2.categoryPriceLogic[d2l];
        }

        document.tradeData = data;
        console.log(data);
    }

    document.needLoad.tables = true;

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
        if (logicShow) {
            if (typeof logicShow.showBuy !== 'undefined') {
                isSell = logicShow.showBuy;
            }
            if (typeof logicShow.showAmount !== 'undefined') {
                isAmount = logicShow.showAmount;
            }
            if (typeof logicShow.showSell !== 'undefined') {
                isBuy = logicShow.showSell;
            }
        }

        if (!isSell) {
            isSell = 'd-none'
        } else {
            isSell = '';
        }

        if (!isAmount) {
            isAmount = 'd-none'
        } else {
            isAmount = '';
        }

        if (!isBuy) {
            isBuy = 'd-none'
        } else {
            isBuy = '';
        }

        let tr = document.createElement('tr');
        tr.innerHTML = `
        <th scope="col">#</th>
        <th>Иконка</th>
        <th scope="col" data-table="${iKey}" data-coll="name" class="sortable">Наименование</th>
        <th scope="col" data-table="${iKey}" data-coll="buy" class="${isBuy} sortable">Покупка</th>
        <th scope="col" data-table="${iKey}" data-coll="sell" class="${isSell} sortable">Продажа</th>
        <th scope="col" data-table="${iKey}" data-coll="amount" class="${isAmount} sortable">Наличие</th>
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
        } else if (row.icons) {
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

        if (logic) {
            if (typeof logic.showBuy !== 'undefined') {
                isSellShow = logic.showBuy;
            }
            if (typeof logic.showAmount !== 'undefined') {
                isAmountShow = logic.showAmount;
            }
            if (typeof logic.showSell !== 'undefined') {
                isBuyShow = logic.showSell;
            }
        }

        if (!isSellShow) {
            isSellShow = 'd-none'
        } else {
            isSellShow = '';
        }

        if (!isAmountShow) {
            isAmountShow = 'd-none'
        } else {
            isAmountShow = '';
        }

        if (!isBuyShow) {
            isBuyShow = 'd-none'
        } else {
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
        <td><span class="value">${counter}</span></td>
        <td><span style="width: 120px;">${rowIco}</span></td>
        <td><span class="value">${row.name}</span></td>
        <td><span class="${isBuy} ${isBuyShow} value">${sell}</span></td>
        <td><span class="${isSell} ${isSellShow} value">${row.sell}</span></td>
        <td><span class="value ${isAmountShow}">${row.amount}</span></td>
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

    await prepareSort();
}

async function loadHorses() {
    let data = [];
    if (typeof document.horses === 'undefined') {
        data = await fetch('./data/horses.json', {cache: "no-store"});
        data = await data.json();
        document.horses = data;
    }else{
        data = document.horses;
    }
    dqs('#horsesCards').innerHTML = '';
    document.needLoad.horses = true;

    let drawData = Object.assign([], data.horses);

    let sortParam = dqs('#selectParam').value;
    let sortPrice = dqs('#selectPrice').value;

    if(sortParam !== 'Не имеет значение'){
        if(sortParam === 'Здоровье'){
            drawData = drawData.sort((a,b) => b.hp - a.hp);
        }
        if(sortParam === 'Скорость'){
            drawData = drawData.sort((a,b) => b.speed - a.speed);
        }
        if(sortParam === 'Прыжок'){
            drawData = drawData.sort((a,b) => b.jump - a.jump);
        }
    }

    let needSort = false;
    let sortType = null;
    if(sortPrice !== 'Не имеет значение'){
        if(sortPrice === 'Дороже'){
            needSort = true;
            sortType = 'desc';
        }
        if(sortPrice === 'Дешевле'){
            needSort = true;
            sortType = 'asc';
        }
    }

    //horsesCards
    drawData.forEach((horse, index) => {

        let color = dqs('#selectColor').value;
        let skin = dqs('#selectSkin').value;

        if(color !== 'Любая'){
            if(horse.color.toLowerCase() !== color.toLowerCase())
                return;
        }

        if(skin !== 'Любая'){
            if(skin === 'Чистая'){
                if(horse.skin !== ''){
                    return;
                }
            }else {
                if (horse.skin.toLowerCase() !== skin.toLowerCase())
                    return;
            }
        }

        let price = horse.basePrice;
        let tmpSpeed = 0;
        tmpSpeed = horse.speed;
        let priceForSpeed = 0;
        let priceForJump = 0;
        let priceForHP = 0;
        let tmpJump = 0;
        if(horse.speed <= 7.5){
            price += 400;
            priceForSpeed = 400;
        }else{
            tmpSpeed = tmpSpeed - 7.5;
            priceForSpeed = Math.floor((tmpSpeed / 0.5 + 1) * 600) + 400;
            price += priceForSpeed;
        }

        if(horse.jump <= 1.25){
            priceForJump = 90;
            price += priceForJump;
        }else{
            priceForJump = Math.floor(((horse.jump - 1.25) / 0.25) * 65) + 90;
            price += priceForJump;
        }


        if(horse.hp <= 15){
            priceForHP = 200;
            price += priceForHP;
        }else if(horse.hp > 15){
            priceForHP = data.hpMatrix[horse.hp.toString()];
            price += priceForHP;
        }
        //price += horse.jump / 0.25 * 100;
        //price +=

        let name = horse.color + ((horse.skin !== '') ? " " + horse.skin : '');

        let sortStyle = '';
        if(needSort){
            if(sortType === 'asc'){
                sortStyle = `order: ${price};`
            }
            if(sortType === 'desc'){
                sortStyle = `order: ${price*-1};`
            }
        }

        let html = `
        <div class="col-xs-12 col-sm-6 col-lg-4 mb-2" style="${sortStyle}">
            <div class="card">
                <img src="./assets/horses/${name} лошадь-min.png" onerror="this.src='./assets/horses/sc1.jpg'" class="card-img-top" alt="${name}">
                <div class="card-body">
                  <h5 class="card-title">${name} #${index+1}</h5>
                  <p class="card-text mb-0">
                    Находится в стойле ${horse.stable}.<br>
                    </p>
                    <div class="row">
                    <div class="col-1"><img width="16" src="./assets/horses/speed.png"></div>
                    <div class="col-10">${horse.speed} (${priceForSpeed})</div>
                    </div>
                    
                    <div class="row">
                    <div class="col-1"><img width="16" src="./assets/horses/jump.png"></div>
                    <div class="col-10">${horse.jump} (${priceForJump})</div>
                    </div>
                    
                    <div class="row">
                    <div class="col-1"><img width="16" src="./assets/horses/hp.png"></div>
                    <div class="col-10">${horse.hp} (${priceForHP})</div>
                    </div>
                  
                </div>
                <div class="card-footer"><small class="text-body-secondary">Цена: ${price}</small></div>
            </div>
        </div>
        `;

        dqs('#horsesCards').innerHTML += html;

    });
}

async function loadBG(){
    fetch('./data/screens.json', {cache: "no-store"})
        .then(data => data.json())
        .then(data => {
            let last = data[data.length - 1];
            document.querySelector('body').style.backgroundImage = "url(.." + last + ")";
            data = data.reverse();

            let divScreens = document.querySelector('#cityScreens');
            data.forEach((screen, i) => {
                let img = document.createElement('img');
                img.src = screen;
                img.style.maxWidth = '100%';
                img.style.marginBottom = '10px';
                img.alt = 'Изображение города';
                img.onerror = () => {
                    document.imgsLoaded += 1;
                }
                img.onload = () => {
                    document.imgsLoaded += 1;
                }
                divScreens.append(img);
                document.imgsTotal +=1;
            })
            document.needLoad.bg = true;
        })
}

function sortHandler(event){
    console.log(event);
    console.log(this);
}

async function prepareSort(){
    document.querySelectorAll('table').forEach(e => {
        var datatable = new DataTable(e, {
            sort: [true, false, true, true, true, true],
            filters: [false, false, 'input'],
            filterText: 'Type to filter... ',
            pageSize: 500
        });
    })
}

document.addEventListener('DOMContentLoaded', async () => {
    document.basket = [];
    document.lastClacItem = {};
    document.lastSort = null;
    document.loaded = false;
    document.needLoad = {bg: false, tables: false, horses: false, imgs: false};
    document.imgsTotal = 0;
    document.imgsLoaded = 0;

    setTimeout(function loadTick(){
        let isLoad = true;
        for(let iKey in document.needLoad){
            if(document.needLoad[iKey] === false){
                isLoad = false;
            }
            if(document.imgsTotal > document.imgsLoaded){
                isLoad = false;
            }else{
                document.needLoad.imgs = true;
            }
        }
        if(!isLoad){
            setTimeout(loadTick, 2000);
        }else{
            dqs('#pagePreloader').classList.remove('activeLoader');
            dqs('#mainContainer').classList.remove('activeLoaderMain');
        }
    }, 2000);

    await loadBG();
    await drawTables();
    await loadHorses();

    dqsa('.choices').forEach(e => {
        const choices = new Choices(e, {shouldSort: false});
    })
})
