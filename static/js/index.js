// Load in the JS functionality by calling the pageLoader function
pageLoader();


function pageLoader(){
    console.log('Loading The Page with Functionality...')
    // Add the color changer on click to dark/light button
    const colorButtons = document.getElementsByClassName('light-dark-button');
    for (let btn of colorButtons){
        btn.addEventListener('click', changeBackgroundColor);
    };

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
