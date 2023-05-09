import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from './../shared/services/api.service';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-addproductdialog',
  templateUrl: './addproductdialog.component.html',
  styleUrls: ['./addproductdialog.component.scss'],
})
export class AddproductdialogComponent implements OnInit {
  freshnessValue!: string;
  freshnessList: string[] = ['TestFeature1', 'TestFeature2', 'TestFeature3','TestFeature4','TestFeature5'];
  selectedCategory: string = '';
  productForm!: FormGroup;
  actBtn : string="Save"
  constructor(
    private formBuilder: FormBuilder,
    private api: ApiService,
    private matDialog: MatDialogRef<AddproductdialogComponent>,
    @Inject(MAT_DIALOG_DATA) public editData: any
  ) {}

  ngOnInit(): void {
    this.productForm = this.formBuilder.group({
      productName: ['', Validators.required],
      productCategory: ['', Validators.required],
      freshness: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', Validators.required],
      comment: ['', Validators.required],
      date:['',Validators.required]
    });

    if (this.editData) {
      this.actBtn = "Update"
      this.productForm.controls['productName'].setValue(
        this.editData.productName
      );
      this.productForm.controls['productCategory'].setValue(
        this.editData.productCategory
      );
      //this.productForm.controls['freshness'].setValue(this.editData.freshness);
      this.freshnessValue = this.editData.freshness;
      this.productForm.controls['description'].setValue(
        this.editData.description
      );
      this.productForm.controls['price'].setValue(this.editData.price);
      this.productForm.controls['comment'].setValue(this.editData.comment);
      this.productForm.controls['date'].setValue(this.editData.date)
    }
  }

  addProduct() {

    if(!this.editData){
      if (this.productForm.valid) {
        this.api.postProduct(this.productForm.value).subscribe({
          next: (res) => {
            alert('product added');
            this.matDialog.close('save');
          },
          error: (err) => {
            alert('error while adding product');
          },
        });
      }
    }else{
      this.updateProduct();
    }
  }
  updateProduct() {
    this.api.updateProduct(this.productForm.value,this.editData.id)
    .subscribe({
      next:(res)=>{
        alert("Updated Successfully");
        this.matDialog.close('update');
      },
      error:()=>{
        alert("error while updating");
      }
    })
  }
}
