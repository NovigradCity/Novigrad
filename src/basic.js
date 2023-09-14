const dqs = (selector) => {
    return document.querySelector(selector);
}

function selectCategory(event){
    let val = event.value;
    let items = document.tradeData.items.filter(e => e.category === val);

    dqs('#tradeSelectItem').innerHTML = '';
    items.forEach( e => {
        dqs('#tradeSelectItem').innerHTML += `<option value='${e.name}'>${e.name}</option>`
    });
}

function calcTrade(){
    let amount = dqs('#tradeAmount').value;
}

document.addEventListener('DOMContentLoaded', async () => {
    let data = await fetch('./data/catalog.json', {cache: "no-store"});
    data = await data.json();
    document.tradeData = data;
    console.log(data);

    let trade = dqs('#trade');

    for(let iKey in data.categories){
        let id = 'tradeTab_' + iKey;
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

        let selectOption = document.createElement('option');
        selectOption.innerText = data.categories[iKey];
        selectOption.value = iKey;
        dqs('#tradeSelectCategory').append(selectOption);

        let block = document.createElement('div');
        block.classList.add('tab-pane');
        block.classList.add('fade');
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

        let tr = document.createElement('tr');
        tr.innerHTML = `
        <th scope="col">#</th>
        <th>Иконка</th>
        <th scope="col">Наименование</th>
        <th scope="col">Покупка</th>
        <th scope="col">Продажа</th>
        <th scope="col">Наличие</th>
        `;

        thead.append(tr);
        table.append(thead);

        let tbody = document.createElement('tbody');
        tbody.id = iKey;
        table.append(tbody);

        block.append(table);
    }

    let counter = 0;
    for(let iKey in data.items){

        let row = data.items[iKey];
        let tr = document.createElement('tr');
        //tr.style.fontSize = '2em';

        let isSell = (row.isSell) ? 'text-success' : 'text-danger';
        //cellSell.innerHTML = "<span>Продажа: <span><span class='"+isSell+"'>" + row.price + "</span>";

        let isBuy = (row.isBuy) ? 'text-success' : 'text-danger';
        //cellBuy.innerHTML = "<span>Покупка: <span><span class='"+isBuy+"'>" + row.buy + "</span>";

        let rowIco = '';
        if(row.icon){
            rowIco = `<img src="${row.icon}" width=24 height=24 alt='${row.name}'>`
        }

        tr.innerHTML = `
        <td class="value">${counter}</td>
        <td style="width: 90px;">${rowIco}</td>
        <td class="value">${row.name}</td>
        <td class="${isBuy} value">${row.buy}</td>
        <td class="${isSell} value">${row.price}</td>
        <td class="value">${row.amount}</td>
        `
        dqs('#' + row.category).append(tr);
        counter++;
    }

    data = await fetch('./data/VonderanShop.json', {cache: "no-store"});
    data = await data.json();
    console.log(data);

    trade = dqs('#vShop');
    for(let iKey in data.categories){

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
        dqs('#vShopTabs').append(tabHead);

        let block = document.createElement('div');
        block.classList.add('tab-pane');
        block.classList.add('fade');
        block.id = id + "Content";
        block.setAttribute('role', 'tabpanel')
        let title = document.createElement('h3');
        title.innerText = data.categories[iKey];
        title.classList.add('text-white')
        title.classList.add('value')

        //tradeSelectCategory
        block.append(title);
        dqs('#vShopTabsContainer').append(block)
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
    for(let iKey in data.items){
        let row = data.items[iKey];
        let tr = document.createElement('tr');
        tr.style.fontSize = '1.5em';
        let rowIco = '';
        if(row.icons){
            if(row.icons.length > 0){
                row.icons.forEach( ic => {
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