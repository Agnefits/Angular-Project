import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function passwordMatched(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const password = control.get("password")
        const confirmedPassword = control.get("confirmedPassword")
        if (!password || !confirmedPassword || !password.value || !confirmedPassword.value) {
            return null;
        }
        const valErr = { "UnmatchedPassword": { "password": password.value, 'Confirmed password': confirmedPassword.value } }
        return (password.value === confirmedPassword.value) ? null : valErr
    }
} 