import { Component, OnInit } from '@angular/core';
import { TodoService } from '../services/todo.service';
import { Router } from '@angular/router';
import { TodoList } from 'src/app/model/todoList';
import { Subject } from 'rxjs';


export interface TodoElement {
  name: string;
  position: number;
  item: any;
  value: any;
}

const ELEMENT_DATA: TodoElement[] = [];


@Component({
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {

  constructor(private todoService: TodoService,private router: Router) { }

  displayedColumns: string[] = ['position', 'name', 'value'];
  dataSource = ELEMENT_DATA;
  changes = new Subject<void>();

  pgnation_page: number = 0; 
  pgnation_pageSize: number = 0;  
  pgnation_length: number = 12;  
  pgnation_totalPages: number = 0;

  listStoreOwner:Array<string> = [];

  ngOnInit() {
    this.todoService.getStoreOwner().subscribe({
      next: (res:Array<TodoList>) => {
        console.log("get getStoreOwner ***********");
        console.log(res);

        let todoList:any = []; 
        for (const element of res) {
          if(!this.listStoreOwner.includes(element.storeOwner)){
            this.listStoreOwner.push(element.storeOwner);
            todoList.push({ position: todoList.length, name: element.storeOwner, value: 0, item: element })
          }
        }

       this.listStoreOwner.forEach(
          (e) => {
              let index_list:any = this.getIndexOwnerArray(e,todoList);
              for (const element of res) {
                if(element.storeOwner == e){
                    if(element.transactions_CNAB.signal.toString() == "-"){
                      todoList[index_list].value = todoList[index_list].value - element.value;
                    }else{
                      todoList[index_list].value = todoList[index_list].value + element.value;
                    }
                }
              }
          }
        );


        todoList.forEach(
          (is:any) => {
            is.value = this.formatNum(is.value, 2);
          });


        

        this.dataSource = todoList;
      },
      error: (e) => e,
    })
  }

  formatNum(num:any, decimals:any) {
    return num.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  getIndexOwnerArray(name:string, todoList:any){
    let todoIdex = null;
    for (let index = 0; index < todoList.length; index++) {
      const element = todoList[index];
      if(element.name == name){
        todoIdex = index;
        break;
      }
    }
    return todoIdex;
  }

  onSubmit(){
    console.log(" onSubmit ------------------- ");

    return this.router.navigate(['upload']);

    // this.todoService.getTodoOfUser().subscribe({
    //   next: (res) => res,
    //   error: (e) => e,
    // })
  }

  goTodo(element: any){
    console.log(element)
    console.log(element.item.id)
    this.router.navigate(['task/list/'+element.item.id]);
  }

  goBack(){
    localStorage.removeItem('access_token');
    localStorage.removeItem('token');
    this.router.navigate(['']);
  }


  firstPageLabel = `First page`;
  itemsPerPageLabel = `Items per page:`;
  lastPageLabel = `Last page`;

  // You can set labels to an arbitrary string too, or dynamically compute
  // it through other third-party internationalization libraries.
  nextPageLabel = 'Next page';
  previousPageLabel = 'Previous page';

  getRangeLabel(page: number, pageSize: number, length: number): string {
    console.log("getRangeLabel")
    if (length === 0) {
      return `Page 1 of 1`;
    }
    const amountPages = Math.ceil(length / pageSize);
    return `Page ${page + 1} of ${amountPages}`;
  }

  nextpageData(element:any){
    console.log("nextpageData");
    console.log(element);
    this.pgnation_pageSize = element.pageIndex;  
    this.pgnation_length = element.pageSize;  

    this.ngOnInit();
  }


}