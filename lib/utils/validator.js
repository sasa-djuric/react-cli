"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const validator = (value) => {
    const actions = {};
    actions.errors = [];
    const validate = (condition, error) => {
        if (condition)
            return actions;
        actions.errors.push(error);
        return actions;
    };
    actions.isRequired = (error = `Field is required`) => {
        const condition = value;
        return validate(condition, error);
    };
    actions.min = (length, error = `Required length is at least ${length} characters`) => {
        const condition = value.length >= length;
        return validate(condition, error);
    };
    actions.max = (length, error = `Maximum length can be ${length} characters`) => {
        const condition = value.length <= length;
        return validate(condition, error);
    };
    actions.greater = (length, error = `Required number must be greater than ${length}`) => {
        const condition = value > length;
        return validate(condition, error);
    };
    actions.less = (length, error = `The required number must be max ${length}`) => {
        const condition = value < length;
        return validate(condition, error);
    };
    actions.equal = (compare, error = `Values must be the same`) => {
        const condition = value === compare;
        return validate(condition, error);
    };
    actions.isEmail = (error = `Invalid email`) => {
        const condition = mailRegex.test(String(value).toLowerCase());
        return validate(condition, error);
    };
    return actions;
};
exports.default = validator;
