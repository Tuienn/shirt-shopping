import library from "./file.js";

const inputIsNull = (input) => {
    if (input.value == "") {
        return true;
    }
    return false;
};
const isPhoneNumber = (phoneNumber) => {
    const regex = /^\d{10}$/;
    return regex.test(phoneNumber);
};
const isEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

const inputLocationIsSelected = (input) => {
    if (input.value == "default") {
        return false;
    }
    return true;
};

const addClassInputError = (input) => {
    input.classList.add("form-input--error");
};
const removeClassInputError = (input) => {
    input.classList.remove("form-input--error");
};

const checkError_groupInputName = (groupErrorMessage, groupInput) => {
    if (inputIsNull(groupInput[0]) && !inputIsNull(groupInput[1])) {
        addClassInputError(groupInput[0]);
        removeClassInputError(groupInput[1]);
        groupErrorMessage[0].innerText = "(*) Please enter your first name";
        return false;
    } else if (inputIsNull(groupInput[1]) && !inputIsNull(groupInput[0])) {
        addClassInputError(groupInput[1]);
        removeClassInputError(groupInput[0]);
        groupErrorMessage[0].innerText = "(*) Please enter your last name";
        return false;
    } else if (inputIsNull(groupInput[0]) && inputIsNull(groupInput[1])) {
        addClassInputError(groupInput[0]);
        addClassInputError(groupInput[1]);
        groupErrorMessage[0].innerText = "(*) Please enter your full name";
        return false;
    } else {
        removeClassInputError(groupInput[0]);
        removeClassInputError(groupInput[1]);
        groupErrorMessage[0].innerText = "";
        return true;
    }
};

const checkError_inputEmail = (groupErrorMessage, groupInput) => {
    if (inputIsNull(groupInput[2])) {
        addClassInputError(groupInput[2]);
        groupErrorMessage[1].innerText = "(*) Please enter your email";
        return false;
    } else if (!isEmail(groupInput[2].value)) {
        addClassInputError(groupInput[2]);
        groupErrorMessage[1].innerText = "(*) Invalid email format";
        return false;
    } else {
        removeClassInputError(groupInput[2]);
        groupErrorMessage[1].innerText = "";
        return true;
    }
};

const checkError_inputLocation = (groupErrorMessage, groupInput) => {
    if (
        !inputLocationIsSelected(groupInput[4]) ||
        !inputLocationIsSelected(groupInput[5]) ||
        !inputLocationIsSelected(groupInput[6]) ||
        inputIsNull(groupInput[7])
    ) {
        addClassInputError(groupInput[4]);
        addClassInputError(groupInput[5]);
        addClassInputError(groupInput[6]);
        addClassInputError(groupInput[7]);
        groupErrorMessage[3].innerText =
            "(*) Please enter your complete address";
        return false;
    } else {
        removeClassInputError(groupInput[4]);
        removeClassInputError(groupInput[5]);
        removeClassInputError(groupInput[6]);
        removeClassInputError(groupInput[7]);
        groupErrorMessage[3].innerText = "";
        return true;
    }
};

const checkError_inputPhoneNumber = (groupErrorMessage, groupInput) => {
    if (inputIsNull(groupInput[3])) {
        addClassInputError(groupInput[3]);
        groupErrorMessage[2].innerText = "(*) Please enter your phone number";
        return false;
    } else if (!isPhoneNumber(groupInput[3].value)) {
        addClassInputError(groupInput[3]);
        groupErrorMessage[2].innerText = "(*) Invalid phone number format";
        return false;
    } else {
        removeClassInputError(groupInput[3]);
        groupErrorMessage[2].innerText = "";
        return true;
    }
};

const checkInputLocationIsChecked_inOrder = (
    inputProvince,
    inputDistrict,
    inputWard
) => {
    const errorMessageLocation = document.querySelectorAll(".form-error")[3];
    inputDistrict.addEventListener("click", () => {
        if (!inputLocationIsSelected(inputProvince)) {
            addClassInputError(inputProvince);
            errorMessageLocation.innerText =
                "(*) Please select a Province/City";
            return false;
        } else {
            removeClassInputError(inputProvince);
            errorMessageLocation.innerText = "";
            return true;
        }
    });

    inputWard.addEventListener("click", () => {
        if (
            !inputLocationIsSelected(inputDistrict) &&
            inputLocationIsSelected(inputProvince)
        ) {
            addClassInputError(inputDistrict);
            errorMessageLocation.innerText = "(*) Please select a District";
            return false;
        } else if (
            !inputLocationIsSelected(inputDistrict) &&
            !inputLocationIsSelected(inputProvince)
        ) {
            addClassInputError(inputProvince);
            addClassInputError(inputDistrict);
            errorMessageLocation.innerText =
                "(*) Please select a Province/City and District";
            return false;
        } else {
            removeClassInputError(inputDistrict);
            errorMessageLocation.innerText = "";
            return true;
        }
    });
};

const handleOnFocusInput_clearInputError = (groupInput) => {
    groupInput.forEach((input) => {
        input.addEventListener("focus", () => {
            removeClassInputError(input);
        });
    });
};

const loadData_inputDistrict = (
    inputProvince,
    inputDistrict,
    inputWard,
    dataDistrict
) => {
    inputProvince.addEventListener("change", () => {
        const provinceCode = inputProvince.value;
        const dataDistrictFilter = library.getDistrictsByProvinceID(
            provinceCode,
            dataDistrict
        );
        const htmls = dataDistrictFilter.map(
            (district) =>
                `<option value=${district.code}>${district.name}</option>`
        );
        const html = htmls.join("");
        inputDistrict.innerHTML = ` <option
                                        value="default"
                                        selected
                                        disabled
                                        hidden
                                    >
                                        Select District
                                    </option>
                                    ${html}
                                `;
        inputWard.innerHTML = ` <option
                                value="default"
                                selected
                                disabled
                                hidden
                                >
                                    Select Ward
                                </option>
                            `;
    });
};
const loadData_inputWard = (inputDistrict, inputWard, dataWard) => {
    inputDistrict.addEventListener("change", () => {
        const districtCode = inputDistrict.value;
        const dataWardFilter = library.getWardsByDistrictID(
            districtCode,
            dataWard
        );

        const htmls = dataWardFilter.map(
            (ward) => `<option value=${ward.code}>${ward.name}</option>`
        );
        const html = htmls.join("");
        inputWard.innerHTML = ` <option
                                    value="default"
                                    selected
                                    disabled
                                    hidden
                                >
                                    Select Ward
                                </option>
                                ${html}
                            `;
    });
};

const eventSelectLocation = (dataDistrict, dataWard) => {
    //Select select tag with element id input--province -> id input--district -> id input--ward
    const inputProvince = document.getElementById("input--province");
    const inputDistrict = document.getElementById("input--district");
    const inputWard = document.getElementById("input--ward");

    checkInputLocationIsChecked_inOrder(
        inputProvince,
        inputDistrict,
        inputWard
    );
    loadData_inputDistrict(
        inputProvince,
        inputDistrict,
        inputWard,
        dataDistrict
    );
    loadData_inputWard(inputDistrict, inputWard, dataWard);
};

export {
    checkError_groupInputName,
    checkError_inputEmail,
    checkError_inputPhoneNumber,
    checkError_inputLocation,
    handleOnFocusInput_clearInputError,
    eventSelectLocation,
};
