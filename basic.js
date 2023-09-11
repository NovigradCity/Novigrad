const dqs = (selector) => {
    return document.querySelector(selector);
}

document.addEventListener('DOMContentLoaded', async () => {
    let data = await fetch('./data/catalog.json');
    data = await data.json();
    console.log(data);

    let trade = dqs('#trade');

    for(let iKey in data.categories){
        let block = document.createElement('div');
        let title = document.createElement('h3');
        title.innerText = data.categories[iKey];
        title.classList.add('text-white')
        title.classList.add('value')
        block.append(title);
        trade.append(block);

        let table = document.createElement('table');
        table.classList.add('table');
        table.classList.add('table-sm');
        table.classList.add('table-striped');

        let thead = document.createElement('thead');

        let tr = document.createElement('tr');
        tr.innerHTML = `
        <th scope="col">#</th>
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

        let isSell = (row.isSell) ? 'text-success' : 'text-danger';
        //cellSell.innerHTML = "<span>Продажа: <span><span class='"+isSell+"'>" + row.price + "</span>";

        let isBuy = (row.isBuy) ? 'text-success' : 'text-danger';
        //cellBuy.innerHTML = "<span>Покупка: <span><span class='"+isBuy+"'>" + row.buy + "</span>";

        let rowIco = '';
        if(row.icon){
            rowIco = `<img src="${row.icon}" width=16 height=16 alt='${row.name}'>`
        }

        tr.innerHTML = `
        <td class="value">${counter}</td>
        <td class="value">${rowIco} ${row.name}</td>
        <td class="${isBuy} value">${row.buy}</td>
        <td class="${isSell} value">${row.price}</td>
        <td class="value">${row.amount}</td>
        `
        dqs('#' + row.category).append(tr);
        counter++;
        continue;
        // let row = data.items[iKey];
        // let rowItem = document.createElement('span');
        //
        // rowItem.innerText = row.name;
        //
        // let divRow = document.createElement('div');
        // divRow.classList.add('row');
        // divRow.classList.add('border');
        // divRow.classList.add('border-success');
        // divRow.classList.add('bg-secondary');
        // divRow.classList.add('text-black');
        // divRow.style.width = '400px';
        // let cellSell = document.createElement('div');
        // cellSell.classList.add('col-5');
        // let cellBuy = document.createElement('div');
        // cellBuy.classList.add('col-5');
        // let cellName = document.createElement('div');
        // cellName.classList.add('col-2');
        // cellName.append(rowItem);
        //
        //
        // let isSell = (row.isSell) ? 'text-success' : 'text-dunger';
        // cellSell.innerHTML = "<span>Продажа: <span><span class='"+isSell+"'>" + row.price + "</span>";
        //
        // let isBuy = (row.isBuy) ? 'text-success' : 'text-dunger';
        // cellBuy.innerHTML = "<span>Покупка: <span><span class='"+isBuy+"'>" + row.buy + "</span>";
        //
        // divRow.append(cellName);
        // divRow.append(cellSell);
        // divRow.append(cellBuy);
        //
        // //dqs('#' + row.category).append(rowItem);
        // dqs('#' + row.category).append(divRow);
    }
})