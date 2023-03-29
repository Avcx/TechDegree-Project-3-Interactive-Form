
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

    This listener runs when the page content is fully loaded

*/

document.addEventListener('DOMContentLoaded', (_e) => {

    nameField.focus(); // Sets the focus to the first text field when the page loads
    

    shirtColorsDiv.hidden = true;
    otherRoleField.hidden = true;

    creditCardDiv.hidden = false;
    paypalDiv.hidden = true;
    bitcoinDiv.hidden = true;

});


/*

    `validator` object contains all the methods that test the form fields

*/

const validator = {

    nameIsValid: (name = nameField.value) => /^[A-Z]+.?/i.test(name),

    emailIsValid: (email = emailField.value) => {

        const emailHint = document.querySelector('.email-hint');

        if (!email) {
            
            emailHint.textContent = 'Email address is required';
        } else {
            emailHint.textContent = 'Email address must be formatted correctly';
        }
        
       return /^[^@]{2,}@[^@]{2,}\.[a-z]{2,}$/i.test(email)},

    zipIsValid: (zipCode = paymentZipCodeField.value) => /^[0-9]{5}$/.test(zipCode),

    ccIsValid: (cardNumber = paymentCardNumber.value) => /^[0-9]{13,16}$/.test(cardNumber),

    expIsValid: (expirationMonth = +paymentExpirationMonth.value, expirationYear = +paymentExpirationYear.value) => {

        // Current date is stored in variables to use for comparision against user's card input

        const currentDate = new Date(Date.now());
        const currentMonth = currentDate.getMonth() + 1; // `getMonth` is zero based. 1 is added to allow for accurate comparision
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

    activityIsValid: (activities = activityFieldSet.querySelectorAll(':checked')) => activities.length > 0
};


function validate(field) {


    function displayValidity(isValid, hintName, fieldName = null) {

        if (isValid) {
            if (fieldName) {
                fieldName['parentNode'].classList.add('valid');
                fieldName['parentNode'].classList.remove('not-valid');
            }
            hintName.style.display = 'none';
        } else {

            if (fieldName) {
                fieldName['parentNode'].classList.add('not-valid');
                fieldName['parentNode'].classList.remove('valid');
            }
            hintName.style.display = 'inherit';
        }

    }


    if (field === 'exp') {

        const expFields = document.querySelectorAll('#exp select');
        const expHint = document.getElementById(`exp-hint`);

            if (validator.expIsValid()) {

                for (const expField of expFields) {
                
                    displayValidity(true, expHint, expField);

                }
                return true;
            } else {

                for (const expField of expFields) {

                    displayValidity(false, expHint, expField);
                    
                }
                return false;
            };

    } else if (field === 'activities') {

        const activitiesHint = document.getElementById(`activities-hint`);

        if (validator.activityIsValid()) {

            displayValidity(true, activitiesHint);

            return true;
        } else {

            displayValidity(false, activitiesHint);

            return false;
        };
        
    }

    const hint = document.getElementById(`${field.id}-hint`);

    if (validator[`${field.id}IsValid`]()) {

        displayValidity(true, hint, field);

    } else {

        displayValidity(false, hint, field);

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
    Runs this function when an input is detected in the forum
*/

function formInput(e)  {

    const userSelection = e.target;
    let formFunction = e.target.id;
    if (e.target.id === "exp-year" || e.target.id === "exp-month") {
        formFunction = 'exp';
    }

    // If the value of the 'formFunction' variable also the name of a method in the 'formControls', the respective method is ran

    if (formFunction in formControls) {

        formControls[formFunction](userSelection);

    }

}

form.addEventListener('input', formInput);
form.addEventListener('blur', formInput);

/*
    Runs function when the state of the checkboxes in the activities fieldset are changed
*/

activityFieldSet.addEventListener('input', (e) => {

    const checkboxes = document.querySelectorAll('#activities-box [type="checkbox"]')
    userSelection = e.target;
    const selectionDateAndTime = userSelection.getAttribute('data-day-and-time');
    const cost = document.getElementById('activities-cost');

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

    cost.textContent = `Total: $${totalPrice}`;

    formControls.activities();

});

/*
    Runs function when the input fields of the credit card payment section are changed
*/

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

/*

    This listener runs the function when the form is submitted

*/

form.addEventListener('submit', (e) => {

    function checkFields() {
        e.preventDefault(); // Stops the page from submitting the form as 1 or more fields are invalid

        const fields = ['name', 'email', 'activities', 'cc', 'exp', 'cvv', 'zip']; // Array of required fields

        // Runs all the formControl methods that are relevent

        for (let i = 0; i <= 2; i++) {

            formControls[fields[i]]();

        }

        if (!creditCardDiv.hidden) {

            for (let i = 3; i < fields.length; i++) {

                formControls[fields[i]]();

            }
        }
        return window.location.href = "#";
    };

    // Runs validation methods before submission

    if (creditCardDiv.hidden) {

        // If the credit card payment option is hidden only run the relevant validation methods

        if (!validator.nameIsValid() || !validator.emailIsValid() || !validator.activityIsValid()) {
           return checkFields();
        };

    } else {

        // If the credit card payment option is visible then all validation methods are ran

        for (functions in validator) {
           if (!validator[functions]()) {
               return checkFields()
           }
        };
    };
});