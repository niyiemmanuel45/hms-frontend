import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ICurrentUser } from 'src/app/models/icurrent-user';
import { Prescription, PrescriptionDto } from 'src/app/models/prescription';
import { User } from 'src/app/models/user';
import { AccountService } from 'src/app/services/account.service';
import { MedicineService } from 'src/app/services/medicine.service';
import { PrescriptionService } from 'src/app/services/prescription.service';
import { StaffService } from 'src/app/services/staff.service';

@Component({
  selector: 'app-prescription-add',
  templateUrl: './prescription-add.component.html',
  styleUrls: ['./prescription-add.component.css']
})
export class PrescriptionAddComponent {
  doctors: any = [];
  medicines: any = [];
  details: ICurrentUser[];
  user : User = new User();
  patient : string;
  userRoleStatus : string;
  prescription : Prescription;
  addPrescription : PrescriptionDto;
  
  prescriptionForm: FormGroup;

  constructor(private preServ : PrescriptionService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private medicineServ: MedicineService,
    private staffServ: StaffService,
    private toastr: ToastrService,
    private acct: AccountService) { }

  ngOnInit():void {
    this.route.data.subscribe(data => {
      this.user = data['user'];
      // console.log(this.user);
      this.patient = this.user.userId;
    }); 

    this.details = this.acct.TokenDecodeUserDetail();
    var strArr = this.details.map(function(e){return e.toString()});
    this.userRoleStatus = strArr[4];

    //load all medicines
    this.medicineServ.GetAllWithoutPage().subscribe(
      data => {
        const {items} = data.responseData;
        this.medicines = items;
    });

    this.staffServ.DoctorsWithoutPage(this.user.hospital?.id!).subscribe(
      data => {
        const {items} = data.responseData;
        this.doctors = items;
    });
    
    this.initializeForm();
  }

  initializeForm() {
    this.prescriptionForm = this.fb.group({
      history: ['', Validators.required],
      doctorId: ['', Validators.required],
      patientId: [{ value: this.patient, disabled: true }, Validators.required],
      dosage: this.fb.array([
        this.createDosageFormGroup()
      ])
    });
  }

  createDosageFormGroup(): FormGroup {
    return this.fb.group({
      frequency: ['', Validators.required],
      days: ['', Validators.required],
      instruction: ['', Validators.required],
      medicineId: [0, Validators.required]
    });
  }

  get dosage(): FormArray {
    return this.prescriptionForm.get('dosage') as FormArray;
  }

  addDosage(): void {
    this.dosage.push(this.createDosageFormGroup());
  }

  removeDosage(index: number): void {
    this.dosage.removeAt(index);
  }

  onSubmit() {
    if (this.prescriptionForm.valid) {
      const formData = { ...this.prescriptionForm.getRawValue(), patientId: this.patient };
      // console.log(formData);
      this.preServ.Insert(formData).subscribe((res: any) => {
        // console.log('API Response:', res);
        this.toastr.success('Drug prescription added successfully');
        this.router.navigate(['/feed/prescription', this.patient]);
      }, error => {
        if(error.length > 0){
          for(let err in error){
            this.toastr.error(error[err]);
          }
        }else{
          this.toastr.error(error);
        }
      });
    } else {
      this.toastr.error('All fields are required!');
    }    
  }
}
