import React from "react";
import { hasErrors, runValidations } from "../Validatoion";
import classNames from "classnames";
import { CustomCombo } from "./CustomCombo";
import { Constants } from "../Constants";
import ExpenseIncomeCategoryCombo from "../ExpenseIncomeCategoryCombo";

// const exConfig = {
//   fields: [
//     {
//       field: 'field',
//       label: 'label',
//       fieldType: 'DEFAULT',
//       placeHolder: 'Placeholder',
//       rowNum: 0,
//       rowGroup: '',
//       cssClass: '',
//       renderField: (model, onChange) => {},
//       disabled: false,
//       onBlur: (e, onChange) => {},
//       onValidate: (errors) => {}
//     },
//   ],
//   validationRules: [],
// };

// TODO: make validation Rules dynamic

function FormWithValidation({ config, modelToEdit, onSubmit, onDismiss }) {
  const [model, setModel] = React.useState({ ...modelToEdit });
  const [errors, setErrors] = React.useState({});
  const [submitted, setSubmitted] = React.useState(false);

  function formSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
    let newErrors = runValidations(model, config.validationRules);
    if (!validateForm(newErrors)) {
      onSubmit(model);
      setSubmitted(false);
    }
  }

  function validateForm(newErrors) {
    if (config.onValidate) {
      config.onValidate(newErrors);
    }
    setErrors(newErrors);
    return hasErrors(newErrors);
  }

  function onChange(field, value) {
    let newModel = Object.assign({}, model);
    newModel[field] = value;
    setModel(newModel);
    let newErrors = runValidations(model, config.validationRules);
    validateForm(newErrors);
  }

  React.useEffect(() => setModel({ ...modelToEdit }), [modelToEdit]);

  let rows = {};
  config.fields.forEach((f) => (rows[f.rowGroup ? f.rowGroup : f.field] = []));

  return (
    <form
      onSubmit={formSubmit}
      className={classNames("flex", "flex-column", {
        submitted: submitted,
      })}
    >
      <div className="flex flex-column">
        {config.fields.forEach((field) => {
          let editor = (
            <div
              className={classNames(
                "form-group",
                field.cssClass ? field.cssClass : "flex-1",
                "padding-h",
                "w200",
                {
                  error: errors[field.field],
                }
              )}
            >
              <label htmlFor={field.field}>{field.label || field.field}</label>
              <Editor
                name={field.field}
                id={field.field}
                field={field}
                model={model}
                onChange={onChange}
              />
              <small>{errors[field.field]}</small>
            </div>
          );

          rows[field.rowGroup ? field.rowGroup : field.field].push(editor);
        })}

        {Object.keys(rows).map((r) => (
          <div className="flex flex-row" key={r}>
            {rows[r]}
          </div>
        ))}
      </div>
      <div className="buttons" style={{ alignSelf: "flex-end" }}>
        <button type="submit">
          <i className="bx bx-save"></i>Save
        </button>
        <button className="default" onClick={onDismiss} type="button">
          <i className="bx bx-hide"></i>Done
        </button>
      </div>
    </form>
  );
}

function Editor({ field, model, onChange }) {
  if (field.renderField) {
    return field.renderField(model, onChange);
  }

  switch (field.fieldType) {
    case "EXPENSE_INCOME_CATEGORY":
      return (
        <ExpenseIncomeCategoryCombo
          className={field.className}
          onChange={(value) => onChange(field.field, value)}
          value={model[field.field]}
          disabled={field.disabled}
        ></ExpenseIncomeCategoryCombo>
      );
    case "PAYMENT_TYPE":
      return (
        <CustomCombo
          itemsArray={Constants.paymentTypes}
          className={field.className}
          onChange={(value) => onChange(field.field, value)}
          value={model[field.field]}
          disabled={field.disabled}
        ></CustomCombo>
      );
    case "textarea":
      return (
        <textarea
          className={field.className}
          name={field.field}
          value={model[field.field]}
          placeholder={field.placeHolder}
          onBlur={field.onBlur ? (e) => field.onBlur(e, onChange) : () => {}}
          onChange={(e) => onChange(field.field, e.target.value)}
          disabled={field.disabled}
          rows={5}
        />
      );
    case "checkbox":
      return (
        <input
          type="checkbox"
          name={field.field}
          checked={model[field.field]}
          onBlur={field.onBlur ? (e) => field.onBlur(e, onChange) : () => {}}
          onClick={(e) => onChange(field.field, e.target.checked)}
          disabled={field.disabled}
        />
      );
    default:
      return (
        <input
          type={field.fieldType ? field.fieldType : "text"}
          name={field.field}
          value={model[field.field]}
          placeholder={field.placeHolder}
          onBlur={field.onBlur ? (e) => field.onBlur(e, onChange) : () => {}}
          onChange={(e) => onChange(field.field, e.target.value)}
          disabled={field.disabled}
        />
      );
  }
}

export default FormWithValidation;
