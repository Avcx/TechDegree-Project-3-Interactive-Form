
/*

    Variable Declarations:

*/

const nameField = document.querySelector('#name');
const emailField = document.querySelector('#email');
const jobRoleField = document.querySelector('#title');
const otherRoleField = document.querySelector('#other-job-role');

const paymentTypeField = document.querySelector('#payment');
const paymentExpirationMonth = document.querySelector('#exp-month');
const paymentExpirationYear = document.querySelector('#exp-year');
const paymentCardNumber = document.querySelector('#cc');
const paymentZipCodeField = document.querySelector('#zip');
const paymentCVVField = document.querySelector('#cvv')

const form = document.querySelector('form');
const basicAndShirtInfoDiv = document.querySelector('.basic-info-and-shirt-box');
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

const validator = {

    nameIsValid: (name = nameField.value) => /^[A-Z]+.?/i.test(name),

    emailIsValid: (email = emailField.value) => /^[^@]{2,}@[^@]{2,}\.[a-z]{2,}$/i.test(email),

    zipIsValid: (zipCode = paymentZipCodeField.value) => /^[0-9]{5}$/.test(zipCode),

    ccIsValid: (cardNumber = paymentCardNumber.value) => /^[0-9]{13,16}$/.test(cardNumber),

    expIsValid: (expirationMonth = paymentExpirationMonth.value, expirationYear = paymentExpirationYear.value) => {

        const currentDate = new Date(Date.now());
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();

        if (expirationYear > currentYear) {
            return true;
        } else if (expirationYear === currentYear && expirationMonth > currentMonth) {
            return true;
        } else {
            return false;
        }

    },

    cvvIsValid: (securityCode = paymentCVVField.value) => /^[0-9]{3}$/.test(securityCode),

    activityIsValid: (activities = activityFieldSet.querySelectorAll(':checked')) => activities === null

};

function validate(field) {


    if (field === 'exp') {
        const expFields = document.querySelectorAll('#exp select');

            if (!validator[`expIsValid`]()) {
                document.getElementById(`exp-hint`).style.display = 'inherit';
                for (const expField of expFields) {
                    expField.classList.add('not-valid');
                    expField.classList.remove('valid');
                }
                return false;
            } else {
                document.getElementById(`exp-hint`).style.display = 'none';

                for (const expField of expFields) {
                    expField.classList.add('valid');
                    expField.classList.remove('not-valid');
                }
                return true;
            };

    } else if (field === 'activities') {

        if (!validator[`activityIsValid`]()) {
            document.getElementById(`activities-hint`).style.display = 'inherit';
            return false;
        } else {
            document.getElementById(`activities-hint`).style.display = 'none';
            return true;
        };
        
    }



    if (!validator[`${field.id}IsValid`]()) {
        document.getElementById(`${field.id}-hint`).style.display = 'inherit';
        field.classList.add('not-valid');
        field.classList.remove('valid');
    } else {
        document.getElementById(`${field.id}-hint`).style.display = 'none';
        field.classList.add('valid');
        field.classList.remove('not-valid');
    };

};


const formControls = {

    name: () => validate(nameField),

    email: () => validate(emailField),

    zip: () => validate(paymentZipCodeField),

    cc: () => validate(paymentCardNumber),

    cvv: ()=> validate(paymentCVVField),

    exp: () => validate('exp'),

    activities: () => validate('activities'),

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

        shirtColorsDiv.hidden = false;

        let colorOptions = document.querySelectorAll('#color option[disabled]');


        for (color of colorOptions) {
            if (color.getAttribute('data-theme') === userSelection.value)
            color.disabled = true;
            color.removeAttribute('selected');
        }

        colorOptions = document.querySelectorAll(`#color > [data-theme="${userSelection.value}"]`);
        colorOptions[0].setAttribute('selected', true)

        for (color of colorOptions) {
            color.disabled = false;
        }

    },




};

/*
    This listener runs when the `select job role` field is changed.
*/

/*
    This listener runs when an input in the shirt design div changes.
*/


form.addEventListener('input', (e) => {

    const userSelection = e.target;
    let formFunction = e.target.id;
    if (e.target.id === "exp-year" || e.target.id === "exp-month") {
        formFunction = 'exp';
    }

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

    function checkFields() {
        e.preventDefault();

        formControls.name()
        formControls.email()
        formControls.activities();

        if (!creditCardDiv.hidden) {
            formControls.cc();
            formControls.cvv();
            formControls.zip();
            formControls.exp();
        }

        window.location.href = "#";
    
    };

    if (creditCardDiv.hidden) {

        if (validator.nameIsValid() && validator.emailIsValid()) {
            return;
        } else {
            checkFields();
        };

    } else {

        for (functions in validator) {
           if (!validator[functions]()) {
                console.log('Error Validating Form.');
                checkFields()
           }
        };
    };
});