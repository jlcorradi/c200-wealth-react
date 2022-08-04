/** Error Messages */

export const isRequiredMsg = fieldDescription => `${fieldDescription} is Required.`

export const mustMatchMsg = otherfieldDescription => {
    return (fieldDescription) => `${fieldDescription} and ${otherfieldDescription} must match.`
};

export const mustDifferMsg = otherfieldDescription => {
    return (fieldDescription) => `${fieldDescription} and ${otherfieldDescription} must be different.`
};

export const minLengthMsg = length => {
    return (fieldDescription) => `${fieldDescription} must be at least ${length} characters length.`
};

export const maxLengthMsg = length => {
    return (fieldDescription) => `${fieldDescription} length must not exceed ${length} characters.`
};

export const regexMsg = fieldDescription => {
    return `${fieldDescription} does not match the regular expression ${regexMsg}`
}

export const emailMsg = fieldDescription => `${fieldDescription} must be a valid email address`

export const minValueMsg = fieldDescription => {
    return (theMinValue) => `${fieldDescription} must be at least ${theMinValue}`
}

/** Validation Rules */

export const required = text => {
    if (text) {
        return null
    } else {
        return isRequiredMsg
    }
}

export const mustMatch = (field, fieldDescription) => {
    return (text, state) => {
        return state[field] === text ? null : mustMatchMsg(fieldDescription)
    }
}

export const mustDiffer = (field, fieldDescription) => {
    return (text, state) => {
        return state[field] !== text ? null : mustDifferMsg(fieldDescription)
    }
}

export const minLength = length => {
    return text => {
        let theLen = !text ? 0 : text.length;
        return (theLen) >= length ? null : minLengthMsg(length)
    }
}

export const maxLength = length => {
    return text => {
        let theLen = !text ? 0 : text.length;
        return (theLen) <= length ? null : maxLengthMsg(length)
    }
}

export const regex = theRegex => {
    return text => {
        return theRegex.test(text) ? null : regexMsg
    }
}

export const email = text => {
    var re = /^$|^([\w\.\-]+)@([\w\-]+)((\.(\w){2,3})+)$/
    return re.test(text) ? null : emailMsg
}

export const minValue = value => {
    return fieldValue => {
        return fieldValue && fieldValue >= value ? null : minValueMsg(value)
    }
}

/** Validation Engine */

export const ruleRunner = (field, fieldDescription, ...validations) => {
    return (state) => {
        for (let v of validations) {
            let errorMessageFunc = v(state[field], state);
            if (errorMessageFunc) {
                return { [field]: errorMessageFunc(fieldDescription) };
            }
        }
        return null;
    };
};

export const runValidations = (model, runners) => {
    return runners.reduce((memo, runner) => {
        return Object.assign(memo, runner(model));
    }, {});
};

export const hasErrors = (validationErrors) => {
    for (var key in validationErrors) {
        if (validationErrors.hasOwnProperty(key)) {
            return true;
        }
    }
    return false;
}