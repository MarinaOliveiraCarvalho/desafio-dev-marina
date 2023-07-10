import { Component, OnInit } from '@angular/core';
import { TodoService } from '../services/todo.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { HttpEventType, HttpResponse } from '@angular/common/http';


@Component({
  templateUrl: 'upload-file.component.html',
  styleUrls: ['upload-file.component.scss'],
})
export class UploadFileComponent implements OnInit {
  currentFile?: File;
  progress = 0;
  message = '';

  fileName = 'Select File';
  fileInfos?: Observable<any>;

  form: FormGroup | any;
  private formSubmitAttempt: boolean | undefined;


  constructor(private router: Router,private todoService: TodoService, private fb: FormBuilder) { }

  ngOnInit() {
    this.form = this.fb.group({
      todoName: ['', Validators.required],
    });
  }

  isFieldInvalid(field: string) {
    return (
      (!this.form.get(field).valid && this.form.get(field).touched) ||
      (this.form.get(field).untouched && this.formSubmitAttempt)
    );
  }


  onSubmit(){
    console.log("upload new file "); 
    this.upload();
  }

  goBack(){
    this.router.navigate(['dashboard']);
  }






  selectFile(event: any): void {
    if (event.target.files && event.target.files[0]) {
      const file: File = event.target.files[0];
      this.currentFile = file;
      this.fileName = this.currentFile.name;
    } else {
      this.fileName = 'Select File';
    }
  }


  upload(): void {
    this.progress = 0;
    this.message = "";

    if (this.currentFile) {
      this.todoService.uploadFile(this.currentFile).subscribe(
        (event: any) => {
          if (event.type === HttpEventType.UploadProgress) {
            this.progress = Math.round(100 * event.loaded / event.total);
          } else if (event instanceof HttpResponse) {
            this.message = event.body.message;
            console.log("this file upload HttpResponse");
            this.router.navigate(['dashboard']);
          }
        },
        (err: any) => {
          console.log(err);
          this.progress = 0;

          if (err.error && err.error.message) {
            this.message = err.error.message;
          } else {
            this.message = 'Could not upload the file!';
          }

          this.currentFile = undefined;
        });
    }

  }

}