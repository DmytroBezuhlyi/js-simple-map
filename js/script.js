import {getMap} from "./map.js";

// Cities position
const $cities = document.getElementById('cities');

(async () => {
    const response = await fetch('./db/cities.json');
    const cities = await response.json();

    for (const city in cities) {
        const $button = document.createElement('button');

        $button.textContent = city;

        const {lat, lon} = cities[city];

        $button.dataset.city = city;
        $button.dataset.lat = lat;
        $button.dataset.lon = lon;

        $cities.append($button);
    }
})()

$cities.addEventListener('click', ({target}) => {
    if (target.tagName !== 'BUTTON') return;

    const {city, lat, lon} = target.dataset;
    const position = [lat, lon];

    getMap(position, city);
})

// Addresses position
const $addresses = document.getElementById('addresses');

(async () => {
    const response = await fetch('./db/addresses.json');
    const addresses = await response.json();

    for (const place in addresses) {
        const $button = document.createElement('button');

        $button.textContent = place;

        const address = addresses[place];
        const query = address.replace(
            /([А-ЯЁа-яё]+)\s([А-ЯЁа-яё]+),\s([0-9А-ЯЁа-яё]+)/,
            '$3+$1+$2,+Харьков'
        );

        $button.dataset.address = address;
        $button.dataset.query = query;

        $addresses.append($button);
    }
})()

$addresses.addEventListener('click', async ({target}) => {
    if (target.tagName !== 'BUTTON') return;

    const {address, query} = target.dataset;
    const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`
    )
    const {display_name, lat, lon} = (await response.json())[0];
    const name = display_name.match(/[А-ЯЁа-яё\s(«\-»)]+/)[0];
    const position = [lat, lon];
    const tooltip = `${name}<br>${address}`

    getMap(position, tooltip);
})

// My position
document.getElementById('my_position').onclick = () => {
    navigator.geolocation.getCurrentPosition(success, error, {
        enableHighAccuracy: true
    });
}

function success({coords}) {
    const {latitude, longitude} = coords;
    const currentPosition = [latitude, longitude];

    getMap(currentPosition, 'You are here');
}

function error({message}) {
    console.log(message);
}