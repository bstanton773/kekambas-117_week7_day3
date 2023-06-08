// Load in the JS functionality by calling the pageLoader function
pageLoader();


function pageLoader(){
    console.log('Loading The Page with Functionality...')
    // Add the color changer on click to dark/light button
    const colorButtons = document.getElementsByClassName('light-dark-button');
    for (let btn of colorButtons){
        btn.addEventListener('click', changeBackgroundColor);
    };

    // Add the changeDiv function to the Nav Links
    const navLinks = document.getElementsByClassName('nav-link')
    for (let link of navLinks){
        link.addEventListener('click', changeDiv)
    }

    // Add the brew finder when form submits
    const findBrewsForm = document.querySelector('#find-brews-form');
    findBrewsForm.addEventListener('submit', e => findBreweries(e, 1));

}


// Create a function that will change the background color
function changeBackgroundColor(e){
    console.log('clicked color button');
    if (e.target.value === 'Dark'){
        document.body.style.backgroundColor = '#C96E12'
    } else {
        document.body.style.backgroundColor = '#FFF897'
    }
}


// Create a function to make this a Single Page App by swapping visible divs
function changeDiv(e){
    
    // Turn off the element(s) that is currently being displayed
    const toTurnOff = document.getElementsByClassName('is-visible');
    for (let element of toTurnOff){
        console.log('turning off', element);
        element.classList.replace('is-visible', 'is-invisible');
        let navLink = document.getElementsByName(element.id)[0];
        navLink.classList.remove('active');
    }

    // Turn on the element based on the link that was clicked
    let toTurnOnID = e.target.name;
    const toTurnOn = document.getElementById(toTurnOnID);
    toTurnOn.classList.replace('is-invisible', 'is-visible');
    e.target.classList.add('active')
}


// Function that will run API call from user Input to get breweries
function findBreweries(event, page){
    event.preventDefault();

    console.log('Finding breweries...');
    const city = document.getElementsByName('city')[0].value;
    const perPage = 10;
    const url = `https://api.openbrewerydb.org/v1/breweries?by_city=${city}&per_page=${perPage}&page=${page}`
    console.log(url);

    fetch(url)
        .then(response => response.json())
        .then(data => displayBreweries(data, page))
        .catch(err => console.error(err))
}

// Function to add a cell of data to a row
function newDataCell(tr, value){
    let td = document.createElement('td');
    td.innerText = value ?? '-';
    tr.appendChild(td);
}

// Function to clear out the brewery table and remove buttons
function clearBreweryTable(table){
    table.innerHTML = '';
    const buttonsToClear = document.querySelectorAll('.prev-next-btn');
    for (let btn of buttonsToClear){
        console.log("removing...", btn);
        btn.remove()
    }
}

// Callback function for findBreweries that will write the info to the screen
function displayBreweries(data, page){

    let table = document.getElementById('brewery-table');
    // TODO: Remove all the old results from the table
    clearBreweryTable(table);

    // Create the Brewery Table Headers
    const thead = document.createElement('thead');
    table.append(thead);
    let tr = document.createElement('tr');
    thead.appendChild(tr);

    const tableHeadings = ['Name', 'Type', 'Streeet Address', 'Address 2', 'Address 3', 'City', 'State'];

    for (let heading of tableHeadings){
        let th = document.createElement('th');
        th.scope = 'col';
        th.innerText = heading;
        tr.appendChild(th)
    }

    // Write the info for each brewery to the table
    for (brewery of data){
        tr=document.createElement("tr")
        table.appendChild(tr)

        const td = document.createElement('td')
        td.innerHTML = `<a href=${brewery.website_url} target="_blank">${brewery.name}</a>`

        // Add copy event listener that will copy not only the name of brewery
        // But also the the website as well
        const copyString = `Visit ${brewery.name} at ${brewery.website_url}`
        td.addEventListener('copy', (event) => {
            event.clipboardData.setData('text/plain', copyString);
            event.preventDefault();
        })

        tr.appendChild(td);
        newDataCell(tr, brewery.brewery_type);
        newDataCell(tr, brewery.street);
        newDataCell(tr, brewery.address_2);
        newDataCell(tr, brewery.address_3);
        newDataCell(tr, brewery.city);
        newDataCell(tr, brewery.state);
    }

    // Add a Next Button if there is data
    if (data.length >= 0 && data.length == 10){
        let nextButton = document.createElement('button');
        nextButton.classList.add("prev-next-btn", "btn", "btn-primary");
        nextButton.innerText = "Next";
        nextButton.addEventListener('click', e => findBreweries(e, page+1));
        table.insertAdjacentElement('afterend', nextButton);
    }

    // Add a Previous Button for all pages past 1
    if (page > 1){
        let prevButton = document.createElement('button');
        prevButton.classList.add("prev-next-btn", "btn", "btn-danger");
        prevButton.innerText = "Prev";
        prevButton.addEventListener('click', e => findBreweries(e, page-1));
        table.insertAdjacentElement('afterend', prevButton);
    }
}