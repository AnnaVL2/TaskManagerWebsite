import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// import { MatTableModule } from '@angular/material/table';
// import { Issue } from '../../issue.model';
import { IssueService } from '../../issue.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  issues: any;

  displayedColumns = ['title', 'responcible', 'severity', 'status', 'actions'];

  constructor(private issueService: IssueService, private router: Router) {}

  // tslint:disable-next-line:typedef
  ngOnInit() {
    this.fetchIssues();
  }
  // tslint:disable-next-line:typedef
  fetchIssues() {
    this.issueService.getIssues().subscribe((data: any) => {
      this.issues = data;
      console.log('Data requested ...');
      console.log(this.issues);
    });
  }

  // implemented type of any to id variable in editIssue()
  // tslint:disable-next-line:typedef
  editIssue(id: any) {
    this.router.navigate([`/edit/${id}`]);
  }

  // tslint:disable-next-line:typedef
  deleteIssue(id: any) {
    this.issueService.deleteIssue(id).subscribe(() => {
      this.fetchIssues();
    });
  }
}
