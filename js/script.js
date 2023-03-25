
const nameField = document.querySelector('#name');
const emailField = document.querySelector('email');
const jobRoleField = document.querySelector('#title');
const otherRoleField = document.querySelector('#other-job-role');
const paymentTypeField = document.querySelector('#payment');

const basicAndShirtInfoDiv = document.querySelector('.basic-info-and-shirt-box');
const form = document.querySelector('form');
const activityFieldSet = document.querySelector('#activities');
const shirtDesignDiv = document.querySelector('#shirt-designs');
const shirtColorsDiv = document.querySelector('#shirt-colors');

const creditCardDiv = document.querySelector('#credit-card');
const paypalDiv = document.querySelector('#paypal');
const bitcoinDiv = document.querySelector('#bitcoin');

let totalPrice = 0;
let userSchedule = [];


/*
    This listener runs when the page content is fully loaded.
*/

document.addEventListener('DOMContentLoaded', (_e) => {

    nameField.focus(); // Sets the focus to the first text field when the page loads
    otherRoleField.hidden = true;
    shirtColorsDiv.hidden = true;

    creditCardDiv.hidden = true;
    paypalDiv.hidden = true;
    bitcoinDiv.hidden = true;

});

function validate(field) {

    if (!validator[`${field.id}IsValid`](field.value)) {
        document.getElementById(`${field.id}-hint`).style.display = 'inherit';
        field.classList.add('not-valid');
        field.classList.remove('valid');
    } else {
        document.getElementById(`${field.id}-hint`).style.display = 'none';
        field.classList.add('valid');
        field.classList.remove('not-valid');
    }

}

const validator = {

    nameIsValid: name => /^[A-Z]+.?/i.test(name),

    emailIsValid: email => /^[^@]{2,}@[^@]{2,}\.[a-z]{2,}$/i.test(email),

}


const formControls = {

    name: userSelection => validate(userSelection),

    email: userSelection => validate(userSelection),

    title: (userSelection) => {

        if (userSelection.value === 'other') {

            otherRoleField.hidden = false;

        } else if (userSelection.value !== 'other') {

            //If the field isn't set to other the textbox is cleared hidden from view of the page

            otherRoleField.hidden = true;
            otherRoleField.value = '';
        }
    },

    design: (userSelection) => {

        let colorOptions = document.querySelectorAll('#color option');

        for (color of colorOptions) {
            color.disabled = true;
            color.removeAttribute('selected');
        }

        shirtColorsDiv.hidden = false;
    

        colorOptions = document.querySelectorAll(`#color > [data-theme="${userSelection.value}"]`);
        colorOptions[0].setAttribute('selected', true)

        for (color of colorOptions) {
            color.disabled = false;
        }

    },




}

/*
    This listener runs when the `select job role` field is changed.
*/

/*
    This listener runs when an input in the shirt design div changes.
*/


form.addEventListener('input', (e) => {

    const userSelection = e.target;
    const formFunction = e.target.id;

    if (formFunction in formControls) {

        formControls[formFunction](userSelection);

    }

});

activityFieldSet.addEventListener('input', (e) => {

    const checkboxes = document.querySelectorAll('#activities-box [type="checkbox"]')
    userSelection = e.target;
    const selectionDateAndTime = userSelection.getAttribute('data-day-and-time');

    if (userSelection.checked) {
        
        totalPrice += +userSelection.getAttribute('data-cost');
        userSchedule.push(selectionDateAndTime);

    } else {

        totalPrice -= +userSelection.getAttribute('data-cost');
        userSchedule[userSchedule.indexOf(selectionDateAndTime)] = undefined;
    }

    for (const checkbox of checkboxes) {
        if (userSchedule.includes(checkbox.getAttribute('data-day-and-time')) && !checkbox.checked) {
            checkbox.disabled = true;
        } else {
            checkbox.disabled = false;
        }
    }

    document.getElementById('activities-cost').textContent = `Total: $${totalPrice}`;

});

paymentTypeField.addEventListener('input', (e) => {

    const paymentTypes = Array.from(paymentTypeField.querySelectorAll('select option'));
    
    const userSelection = e.target

    for (const payment of paymentTypes) {
        if (payment.value === userSelection.value) {
            document.querySelector(`#${userSelection.value}`).hidden = false;
        } else if (paymentTypes.indexOf(payment) !== 0) {
            document.querySelector(`#${payment.value}`).hidden = true;
        }
    } 
    
})

form.addEventListener('submit', (e) => {

    if (validator.nameIsValid(nameField.value) && validator.emailIsValid(emailField.value)) {
        if (creditCardDiv.hidden) {
            return
        } else if (validator) {
            
        }
    }

})