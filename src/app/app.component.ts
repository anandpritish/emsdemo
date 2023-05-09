import { ApiService } from './shared/services/api.service';
import { MatDialog } from '@angular/material/dialog';
import { Component, ViewChild, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AddproductdialogComponent } from './addproductdialog/addproductdialog.component';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  displayedColumns: string[] = [
    'productName',
    'productCategory',
    'freshness',
    'description',
    'price',
    'comment',
    'date',
    'action'
  ];
  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(public dialog: MatDialog, private api: ApiService) {}
  ngOnInit(): void {
    this.getAllProuducts();
  }
  openDialog() {
    let dialogBox = this.dialog.open(AddproductdialogComponent, {
      width: '30%',
    });
    dialogBox.afterClosed().subscribe((val) => {
      if(val==="save"){
        this.getAllProuducts();
      }
    });
  }
  getAllProuducts() {
    this.api.getProduct().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (err) => {
        alert('some Error occured while fetching');
      },
    });
  }
  editProduct(row : any){
    this.dialog.open(AddproductdialogComponent,{
      width:'30%',
      data:row
    }).afterClosed().subscribe(val=>{
      if(val==="update"){
        this.getAllProuducts();
      }
    })
  }
  delete(row:any){
    this.api.deleteProduct(row.id)
    .subscribe({
      next:(res)=>{
        alert("deleted Successfully");
        this.getAllProuducts();
      },
      error:(err)=>{
        alert("Error while deleting");
      }
    })
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }



}
