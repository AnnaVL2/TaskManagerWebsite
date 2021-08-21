import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IssueService } from '../../issue.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateComponent implements OnInit {
  createForm: FormGroup;

  constructor(
    private issueService: IssueService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.createForm = this.fb.group({
      title: ['', Validators.required],
      responcible: '',
      description: '',
      severity: '',
    });
  }

  // tslint:disable-next-line:typedef
  addIssue(title: any, responcible: any, description: any, severity: any) {
    // tslint:disable-next-line:no-unused-expression
    if (this.createForm.valid) {
      console.log('Form submitted');
    }
    this.issueService
      .addIssue(title, responcible, description, severity)
      .subscribe(() => {
        this.router.navigate(['/list']);
      });
  }

  ngOnInit(): void {}
}
