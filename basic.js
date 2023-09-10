document.addEventListener('DOMContentLoaded', async () => {
    let data = await fetch('./data/catalog.json');
    data = await data.json();
    console.log(data);
})