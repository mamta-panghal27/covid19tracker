const countryInput = document.getElementById("countryInput");
const searchBtn = document.getElementById("searchBtn");

const countryName = document.getElementById("countryName");
const flag = document.getElementById("flag");

const cases = document.getElementById("cases");
const recovered = document.getElementById("recovered");
const deaths = document.getElementById("deaths");
const active = document.getElementById("active");
const todayCases = document.getElementById("todayCases");
const todayDeaths = document.getElementById("todayDeaths");
const updated = document.getElementById("updated");

const loader = document.getElementById("loader");
const error = document.getElementById("error");

const WORLD_URL = "https://disease.sh/v3/covid-19/all";
const COUNTRY_URL = "https://disease.sh/v3/covid-19/countries/";

function showLoader() {
    loader.classList.remove("hidden");
}

function hideLoader() {
    loader.classList.add("hidden");
}

function showError(message) {
    error.textContent = message;
    error.classList.remove("hidden");
}

function hideError() {
    error.classList.add("hidden");
    error.textContent = "";
}

function formatNumber(number) {
    return Number(number).toLocaleString();
}

function formatDate(time) {
    return new Date(time).toLocaleString();
}

function updateUI(data, world = false) {

    countryName.textContent = world ? "Worldwide" : data.country;

    if (world) {
        flag.src = "https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg";
    } else {
        flag.src = data.countryInfo.flag;
    }

    cases.textContent = formatNumber(data.cases);
    recovered.textContent = formatNumber(data.recovered);
    deaths.textContent = formatNumber(data.deaths);
    active.textContent = formatNumber(data.active);
    todayCases.textContent = formatNumber(data.todayCases);
    todayDeaths.textContent = formatNumber(data.todayDeaths);

    updated.textContent =
        "Last Updated: " + formatDate(data.updated);
}

async function fetchWorldwideData() {

    showLoader();
    hideError();

    try {

        const response = await fetch(WORLD_URL);

        if (!response.ok) {
            throw new Error("Unable to fetch data.");
        }

        const data = await response.json();

        updateUI(data, true);

    } catch (err) {

        showError(err.message);

    } finally {

        hideLoader();

    }
}

async function fetchCountryData(country) {

    showLoader();
    hideError();

    try {

        const response = await fetch(COUNTRY_URL + country);

        if (!response.ok) {
            throw new Error("Country not found.");
        }

        const data = await response.json();

        updateUI(data);

    } catch (err) {

        showError(err.message);

    } finally {

        hideLoader();

    }
}

searchBtn.addEventListener("click", () => {

    const country = countryInput.value.trim();

    if (country === "") {

        fetchWorldwideData();

    } else {

        fetchCountryData(country);

    }

});

countryInput.addEventListener("keypress", (event) => {

    if (event.key === "Enter") {

        searchBtn.click();

    }

});

fetchWorldwideData();