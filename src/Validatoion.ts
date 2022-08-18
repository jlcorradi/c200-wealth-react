/** Error Messages */

export const isRequiredMsg = (fieldDescription: string) =>
  `${fieldDescription} is Required.`;

export const mustMatchMsg = (otherfieldDescription: string) => {
  return (fieldDescription: string) =>
    `${fieldDescription} and ${otherfieldDescription} must match.`;
};

export const mustDifferMsg = (otherfieldDescription: string) => {
  return (fieldDescription: string) =>
    `${fieldDescription} and ${otherfieldDescription} must be different.`;
};

export const minLengthMsg = (length: number) => {
  return (fieldDescription: string) =>
    `${fieldDescription} must be at least ${length} characters length.`;
};

export const maxLengthMsg = (length: number) => {
  return (fieldDescription: string) =>
    `${fieldDescription} length must not exceed ${length} characters.`;
};

export const regexMsg = (fieldDescription: string) => {
  return `${fieldDescription} does not match the regular expression ${regexMsg}`;
};

export const emailMsg = (fieldDescription: string) =>
  `${fieldDescription} must be a valid email address`;

export const minValueMsg = (fieldDescription: string) => {
  return (theMinValue: number) =>
    `${fieldDescription} must be at least ${theMinValue}`;
};

/** Validation Rules */

export const required = (text: string) => {
  if (text) {
    return null;
  } else {
    return isRequiredMsg;
  }
};

export const mustMatch = <T>(field: string, fieldDescription: string) => {
  return (text: string, state: T) => {
    return (state as any)[field] === text
      ? null
      : mustMatchMsg(fieldDescription);
  };
};

export const mustDiffer = <T>(field: string, fieldDescription: string) => {
  return (text: string, state: T) => {
    return (state as any)[field] !== text
      ? null
      : mustDifferMsg(fieldDescription);
  };
};

export const minLength = (length: number) => {
  return (text: string) => {
    let theLen = !text ? 0 : text.length;
    return theLen >= length ? null : minLengthMsg(length);
  };
};

export const maxLength = (length: number) => {
  return (text: string) => {
    let theLen = !text ? 0 : text.length;
    return theLen <= length ? null : maxLengthMsg(length);
  };
};

export const regex = (theRegex: RegExp) => {
  return (text: string) => {
    return theRegex.test(text) ? null : regexMsg;
  };
};

export const email = (text: string) => {
  var re = /^$|^([\w\.\-]+)@([\w\-]+)((\.(\w){2,3})+)$/;
  return re.test(text) ? null : emailMsg;
};

export const minValue = (value: number) => {
  return (fieldValue: number) => {
    // TODO: Fix this line
    return fieldValue && fieldValue >= value
      ? null
      : minValueMsg(value.toString());
  };
};

/** Validation Engine */

export const ruleRunner = <T>(
  field: string,
  fieldDescription: string,
  ...validations: any[]
) => {
  return (state: T) => {
    for (let v of validations) {
      let errorMessageFunc = v((state as any)[field], state);
      if (errorMessageFunc) {
        return { [field]: errorMessageFunc(fieldDescription) };
      }
    }
    return null;
  };
};

export const runValidations = <T>(model: T, runners: any[]) => {
  return runners.reduce((memo, runner) => {
    return Object.assign(memo, runner(model));
  }, {});
};

export const hasErrors = (validationErrors: any) => {
  for (var key in validationErrors) {
    if (validationErrors.hasOwnProperty(key)) {
      return true;
    }
  }
  return false;
};
