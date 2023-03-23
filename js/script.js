
const nameField = document.querySelector('#name');
const jobRoleField = document.querySelector('#title');
const otherRoleField = document.querySelector('#other-job-role');
const shirtDesignDiv = document.querySelector('#shirt-designs');
const shirtColorsDiv = document.querySelector('#shirt-colors');


/*
    This listener runs when the page content is fully loaded
*/

document.addEventListener('DOMContentLoaded', (_e) => {

    nameField.focus(); // Sets the focus to the first text field when the page loads
    otherRoleField.style.display = 'none';
    shirtColorsDiv.style.display = 'none';

})

/*
    This listener runs when the `select job role` field is changed.
*/

jobRoleField.addEventListener('input', (e) => {

    if (e.target.value === 'other') {

        //Displays a textbox to allow the user to further explain their `other` job role 

        otherRoleField.style.display = '';

    } else {

        //If the field isn't set to other the textbox is cleared hidden from view of the page

        otherRoleField.style.display = 'none';
        otherRoleField.value = '';
    }

})

shirtDesignDiv.addEventListener('input', (e) => {

    let colorOptions = document.querySelectorAll('#color option');
    let colorHTML;
    const colorSelector = document.querySelector('#color');
    const userSelection = e.target;



    function displayAvaliableColors() {

        shirtColorsDiv.style.display = '';
     

        colorOptions = document.querySelectorAll(`#color > [data-theme="${userSelection.value}"]`);


        for (color of colorOptions) {
            if (color.getAttribute('data-theme') === userSelection.value) {
                color.style.display = '';
            }
        }

    }

    if (userSelection.tagName === 'SELECT') {

        for (option of colorOptions) {
            option.style.display = 'none';
        }

        displayAvaliableColors()

    }
})