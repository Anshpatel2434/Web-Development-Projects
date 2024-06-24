//GET ALL THE ELEMENTS WHICH COULD BE HELPFUL IN THE BACKEND
const sliderInput =document.querySelector("[data-lengthSlider]");
const lengthDisplay =document.querySelector("[data-lengthNumber]");
const passwordDisplay =document.querySelector("[data-passwordDisplay]");
const copyButton = document.querySelector("[data-copy]");
const copyMessage = document.querySelector("[data-copyMsg]");
const upperCaseBox = document.querySelector("#uppercase");
const lowerCaseBox = document.querySelector("#lowercase");
const numberBox = document.querySelector("#numbers");
const symbolBox = document.querySelector("#symbols");
const strengthIndicator = document.querySelector("[data-indicator]");
const generateButton = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");

const symbolString = "~`!@#$%^&*()_-+=[]{}\|/':;<>?/.,";

let password="";

//BECAUSE WE ARE GIVING A DEFAULT VALUE OF 10
let passwordLength=10;  

//BECAUSE CONTAINING THE UPPER CASE CHECK BOX WILL BE CHECKED INITIALLY
let checkCount=0;
handleSlider();

//set default indicator grey
setIndicator("#ccc");

//SET THE SLIDER AND SET THE PASSWORD ACCORDING TO THE SLIDER
function handleSlider(){
    sliderInput.value = passwordLength;
    lengthDisplay.innerText = passwordLength;

    const minn=sliderInput.min;
    const maxx=sliderInput.max;
    sliderInput.style.backgroundSize = ((passwordLength-minn)*100/(maxx-minn))+ "% 100%";
}

function setIndicator(color){
    strengthIndicator.style.backgroundColor=color;
    strengthIndicator.style.boxShadow = "0px 0px 10px 3px"+color;
}

//A LOGIC TO GET A NUMBER BETWEEN ANY GIVEN RANGE 
function getRndInteger(min,max){
    return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomNumber(){
    return getRndInteger(0,9);
}

function generateLowerCase(){
    return String.fromCharCode(getRndInteger(97,123));
}

function generateUpperCase(){
    return String.fromCharCode(getRndInteger(65,91));
}

function generateSymbol(){
    const rndNum = getRndInteger(0,symbolString.length);
    return symbolString.charAt(rndNum);
}

function calcStrength(){
    let hasUpper=false;
    let hasLower=false;
    let hasNumber=false;
    let hasSymbol=false;

    if(upperCaseBox.checked) hasUpper=true;
    if(lowerCaseBox.checked) hasLower=true;
    if(numberBox.checked) hasNumber=true;
    if(symbolBox.checked) hasSymbol=true;

    if(hasUpper && hasLower && (hasNumber || hasSymbol) && password.length>=8){
        setIndicator("#0f0");
    }
    else if((hasLower||hasUpper) && (hasNumber||hasSymbol)&&password.length>=6){
        setIndicator("#ff0");
    }
    else {
        setIndicator("#f00");
    }
}

async function copyContent(){
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMessage.innerText="copied";
    } catch (e) {
        copyMessage.innerText="failed";
    }

    copyMessage.classList.add("active");

    setTimeout(function(){
        copyMessage.classList.remove("active")
    },2000);
}

sliderInput.addEventListener('input', function(e){
    passwordLength = e.target.value; // targets the element on which the event is occuring
    handleSlider();
});

copyButton.addEventListener('click', function(){
    if(passwordDisplay.value){
        copyContent();
    }
});

function handleCheckBoxChange(){
    checkCount=0;
    allCheckBox.forEach( (checkbox)=>{
        if(checkbox.checked){
            checkCount++;
        }
    } );

    //if the password length is less than the checkcount then
    if(passwordLength<checkCount){
        passwordLength=checkCount;
        handleSlider();
    }
}

allCheckBox.forEach( (checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange)
} )


generateButton.addEventListener('click', function(){
    //if none of the checkboxes are selected then
    if(checkCount==0){
        return;
    }

    if(passwordLength<checkCount){
        passwordLength=checkCount;
        handleSlider();
    }

    //remove old password
    password="";

    //add the things mentioned by the checkboxes
    let funArray=[];

    if(upperCaseBox.checked)
        funArray.push(generateUpperCase);

    if(lowerCaseBox.checked)
        funArray.push(generateLowerCase);

    if(numberBox.checked)
        funArray.push(generateRandomNumber);

    if(symbolBox.checked)
        funArray.push(generateSymbol);

    //cumpulsory addition
    for(i=0;i<funArray.length;i++){
        password+=funArray[i]();
    }

    //remaining addition
    for(i=0;i<passwordLength-funArray.length;i++){
        let ranIndex= getRndInteger(0,funArray.length);
        console.log("randIndex " + ranIndex);
        password+=funArray[ranIndex]();
    }


    password=shufflePassword(Array.from(password));

    //update the password
    passwordDisplay.value=password;

    calcStrength();
});

function shufflePassword(array) {
    //Fisher Yates Method
    for (let i = array.length - 1; i > 0; i--) {
        //random J, find out using random function
        const j = Math.floor(Math.random() * (i + 1));
        //swap number at i index and j index
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}