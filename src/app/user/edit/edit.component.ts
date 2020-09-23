import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { UserDataService } from '../user-data.service';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

  id: number;
  registerForm: FormGroup; // // hold the form object
  userData: User; //  hold the form object's value
  formErrMess: string; // hold the form error message
  showSpinner: boolean; // spinner toggler
  telNumberPattern: string | RegExp = '^((\\002-?)|0)?[0-9]{10}$'; // regex for Egypt phone number (11)digits pattern validation


  // will contain the error messages if any for each form control
  formErrors = {
    firstname: '',
    address: '',
    telnum: '',
    email: ''
  };

  // cusotm made error messages array
  validationMessages = {
    firstname: {
      required: 'First Name is required.',
      minlength: 'First Name must be at least 2 characters long.',
      maxlength: 'FirstName cannot be more than 25 characters long.'
    },
    address: {
      required: 'First Name is required.',
      minlength: 'First Name must be at least 2 characters long.',
      maxlength: 'FirstName cannot be more than 25 characters long.'
    },
    telnum: {
      required: 'Tel. number is required.',
      pattern: 'Tel. number must contain only numbers.'
    },
    email: {
      required: 'Email is required.',
      email: 'Email not in valid format.'
    },
  };

  // selecting the form so it can be reset after submition
  // @ViewChild('registerForm', { static: true }) registerFormRef;

  constructor(private userDataService: UserDataService,
              private formBuilder: FormBuilder,
              private activatedrouter: ActivatedRoute,
              private router: Router) {

    this.userDataService.curruntUser$ // getting the userData form the user state
      .subscribe(
        user => {
          this.userData = user;
        },
        error => {
          console.log(error);
        });
  }

  ngOnInit() {
    this.createForm(); // creating the form with the initialized data

    this.activatedrouter.params
      .subscribe(
        params => this.id = +params.id
      );

  }

  onBack() { // redirect to profile component
    this.router.navigateByUrl(`/profile/${this.id}`);
  }


  createForm() {
    this.registerForm = this.formBuilder.group({
      firstname: [this.userData.firstname, [Validators.required, Validators.minLength(4), Validators.maxLength(25)]],
      address: [this.userData.address, [Validators.required, Validators.minLength(4), Validators.maxLength(25)]],
      email: [this.userData.email, [Validators.required, Validators.email]],
      telnum: [this.userData.telnum, [Validators.required, Validators.minLength(11), Validators.pattern]]
    });

    // watching for errors and validations on every value change on each control
    this.registerForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

    this.onValueChanged(); // update validation messages on every value change on each control

  }

  // Error messages watcher
  onValueChanged(data?: any) {
    if (!this.registerForm) { return; }  // do nothing if form is undefined
    const form = this.registerForm;  // saving form's data
    for (const field in this.formErrors) {  // looping through formErrors array
      if (this.formErrors.hasOwnProperty(field)) {   // checking for previos error if any
        this.formErrors[field] = '';   // clear previous error message if any
        const control = form.get(field);  // selcting each form control based on the name matches with the formErrors array
        if (control && control.dirty && !control.valid) {  // checking for validity
          /* saving the choosen message based on matched names from the control name
              and the messages in the validationMessages array*/
          const messages = this.validationMessages[field];
          for (const key in control.errors) {   // looping through all the errors in the errors array in the same control
            if (control.errors.hasOwnProperty(key)) {    // if there is a match
              this.formErrors[field] += messages[key] + ' ';  // add the custom message to the formErros array
            }
          }
        }
      }
    }
  }

  onSubmit() {
    this.userData = this.registerForm.value; // making a copy of the registration form value
    this.showSpinner = true; // enable the spinner
    setTimeout(() => { // simulating server response with 500ms latency
      this.userDataService.updateUserData(this.id, this.userData) // calling the put method form the service
        .subscribe(userData => {
          this.userDataService.curruntUserChanges(userData); // update the userData state
          this.showSpinner = false;
          this.router.navigate(['/profile', userData.id]); // redirect the user after successful update to profile page
        },
          formErrMess => {
            this.formErrMess = (formErrMess as any);
            this.showSpinner = false;
          });
      this.registerForm.reset();
    }, 500);
  }

}
