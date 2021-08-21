import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

import { IssueService } from '../../issue.service';
import { Issue } from '../../issue.model';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class EditComponent implements OnInit {
  id: any;
  issue: any = {};
  updateForm!: FormGroup;
  // route: any;

  constructor(
    private issueService: IssueService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private fb: FormBuilder
  ) {
    this.createForm();
  }

  // tslint:disable-next-line:typedef
  createForm() {
    this.updateForm = this.fb.group({
      title: ['', Validators.required],
      responcible: '',
      description: '',
      severity: '',
      status: '',
    });
  }

  // tslint:disable-next-line:typedef
  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.id = params.id;
      this.issueService.getIssuesById(this.id).subscribe((res) => {
        this.issue = res;
        this.updateForm.get('title')?.setValue(this.issue.title);
        this.updateForm.get('responcible')?.setValue(this.issue.responcible);
        this.updateForm.get('description')?.setValue(this.issue.description);
        this.updateForm.get('severity')?.setValue(this.issue.severity);
        this.updateForm.get('status')?.setValue(this.issue.status);
      });
    });
  }

  // tslint:disable-next-line:typedef
  updateIssue(
    title: any,
    responcible: any,
    description: any,
    severity: any,
    status: any
  ) {
    this.issueService
      .updateIssue(this.id, title, responcible, description, severity, status)
      .subscribe(() => {
        this.snackBar.open('Issue updated successfully', 'OK', {
          duration: 3000,
        });
      });
  }
}
