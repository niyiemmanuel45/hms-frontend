import { Component } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Hospital } from 'src/app/models/hospital';
import { ICurrentUser } from 'src/app/models/icurrent-user';
import { Medicine, MedicineDto } from 'src/app/models/medicine';
import { Pagination, PaginatedResult } from 'src/app/models/pagination';
import { AccountService } from 'src/app/services/account.service';
import { CategoryService } from 'src/app/services/category.service';
import { MedicineService } from 'src/app/services/medicine.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-medicine-hospital',
  templateUrl: './medicine-hospital.component.html',
  styleUrls: ['./medicine-hospital.component.css']
})
export class MedicineHospitalComponent {
  departments : Medicine[] = [];
  organization : Hospital;
  userRoleStatus : string;
  code : string;
  orgId : number;
  department : Medicine;
  addDto : MedicineDto;
  empDetail: FormGroup;
  pagination: Pagination = new Pagination(1, 0, 10, [10, 20, 30, 40]);
  details: ICurrentUser[];
  categories: any = [];

  insertForm: FormGroup;
  name: FormControl;
  purchasePrice: FormControl;
  salePrice: FormControl;
  quantity: FormControl;
  genericName: FormControl;
  companyName: FormControl;
  milligram: FormControl;
  expireDate: FormControl;
  categoryId: FormControl;

  constructor(private deptServ : MedicineService,
    private catServ : CategoryService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private acct: AccountService) { }

  ngOnInit():void {
    this.route.data.subscribe(data => {
      this.organization = data['organization'].responseData;
      this.code = this.organization.code;
      this.orgId = this.organization.id;
      // console.log(this.organization);
      this.GetDepartments(this.code);
    });

    this.catServ.GetAllWithoutPage().subscribe(
      data => {
        const {items} = data.responseData;
        this.categories = items;
    });

    this.details = this.acct.TokenDecodeUserDetail();
    var strArr = this.details.map(function(e){return e.toString()});
    this.userRoleStatus = strArr[4];

    this.name = new FormControl('', [Validators.required]);
    this.salePrice = new FormControl('', [Validators.required]);
    this.purchasePrice = new FormControl('', [Validators.required]);
    this.quantity = new FormControl('', [Validators.required]);
    this.genericName = new FormControl('', [Validators.required]);
    this.companyName = new FormControl('', [Validators.required]);
    this.milligram = new FormControl('', [Validators.required]);
    this.expireDate = new FormControl('', [Validators.required]);
    this.categoryId = new FormControl('', [Validators.required]);

    this.insertForm = this.fb.group(
    {
      'name': this.name,
      'salePrice': this.salePrice,
      'purchasePrice': this.purchasePrice,
      'quantity': this.quantity,
      'genericName': this.genericName,
      'companyName': this.companyName,
      'milligram': this.milligram,
      'expireDate': this.expireDate,
      'categoryId': this.categoryId
    });

    this.empDetail = this.fb.group({
      id : [''],
      name : [''],
      purchasePrice: [''],
      salePrice: [''],
      quantity: [''],
      genericName: [''],
      companyName: [''],
      milligram: [''],
      expireDate: [''],
      categoryId: [''],
    });
  }

  GetDepartments(code: string){
    this.deptServ.GetAllByCode(code, this.pagination)
      .subscribe((response: PaginatedResult<Medicine>) => {
        this.departments = response.responseData.items as Medicine[];
        this.pagination.count = response.responseData.totalSize;
        this.pagination.page = response.responseData.pageNumber;
        this.pagination.pageSize = response.responseData.pageSize;
    },error => {
      if(error.length > 0){
        for(let err in error){
          this.toastr.error(error[err]);
        }
      }else{
        this.toastr.error(error);
      }
    });
  }

  onPageChange(event: any, code: string){
    this.pagination.page = event;
    this.GetDepartments(code);
  }
  onPageSizeChange(event: any, code: string){
    this.pagination.pageSize = event.target.value;
    this.pagination.page = 1;
    this.GetDepartments(code);
  }

  AddDepartment() {
    this.addDto = this.insertForm.value;
    if(!isNaN(Number(this.addDto.purchasePrice)) && !isNaN(Number(this.addDto.salePrice)) && !isNaN(Number(this.addDto.quantity))){
      var numberValue = Number(this.addDto.purchasePrice);
      this.deptServ.Insert(this.addDto).subscribe(() => {
        this.insertForm.reset();
        document.getElementById("ModalClose")?.click();
        this.toastr.success('Medicine added Successfully');
        this.GetDepartments(this.code);
      }, error => {
        if(error.length > 0){
          for(let err in error){
            document.getElementById("ModalClose")?.click();
            this.toastr.error(error[err]);
          }
        }else{
          document.getElementById("ModalClose")?.click();
          this.toastr.error(error);
        }
      });
    } else{
      this.insertForm.reset();
      document.getElementById("ModalClose")?.click();
      this.toastr.error('Quantity / Purchase / Sale price must be a number');
    }
  }

  showPayItems(org: Medicine){
    this.empDetail.controls['id'].setValue(org.id);
    this.empDetail.controls['name'].setValue(org.name);
    this.empDetail.controls['purchasePrice'].setValue(org.purchasePrice);
    this.empDetail.controls['salePrice'].setValue(org.salePrice);
    this.empDetail.controls['quantity'].setValue(org.quantity);
    this.empDetail.controls['genericName'].setValue(org.genericName);
    this.empDetail.controls['companyName'].setValue(org.companyName);
    this.empDetail.controls['categoryId'].setValue(org.category.id);
    this.empDetail.controls['milligram'].setValue(org.milligram);
    this.empDetail.controls['expireDate'].setValue(org.expireDate);
  }

  UpdateDepartment(){
    let edit = this.empDetail.value;
    this.addDto = edit;
    if(!isNaN(Number(this.addDto.purchasePrice)) && !isNaN(Number(this.addDto.salePrice)) && !isNaN(Number(this.addDto.quantity))){
      this.deptServ.Update(edit.id, this.addDto).subscribe(next => {
        document.getElementById("ModalShut")?.click();
        this.toastr.success('Medicine updated Successfully');
        this.GetDepartments(this.code);
      }, error => {
        if(error.length > 0){
          for(let err in error){
            document.getElementById("ModalShut")?.click();
            this.toastr.error(error[err]);
          }
        }else{
          document.getElementById("ModalShut")?.click();
          this.toastr.error(error);
        }
      });
    } else{
      this.insertForm.reset();
      document.getElementById("ModalClose")?.click();
      this.toastr.error('Quantity / Purchase / Sale price must be a number');
    }    
  }

  DeleteTest(dept : Medicine, code: string) : void
  {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this.deptServ.Delete(dept.id).subscribe(next => {
          this.toastr.success('Medicine deleted Successfully');
          this.GetDepartments(code);
        }, error => {
          this.toastr.success(error.message);
          this.GetDepartments(code);
        });

      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          '',
          'error'
        )
      }
    });
  }
}
