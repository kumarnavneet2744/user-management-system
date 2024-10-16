import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { User } from 'src/app/models/user.module';
import { UserService } from 'src/app/services/user-service.service';
import { AddUserComponent } from '../add-user/add-user.component';
import { MatDialog } from '@angular/material/dialog';
import { EditUserComponent } from '../edit-user/edit-user.component';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  displayedColumns: string[] = ['serialNo','name', 'email', 'role', 'actions'];
  users: User[] = [];
  filteredUsers: MatTableDataSource<User> = new MatTableDataSource();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private userService: UserService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.users = this.userService.getUsers();
    this.filteredUsers = new MatTableDataSource(this.users);
  }

  // After view is initialized, assign paginator and sort
  ngAfterViewInit() {
    this.filteredUsers.paginator = this.paginator;
    this.filteredUsers.sort = this.sort;
  }

  private reloadUsers(): void {
    this.users = this.userService.getUsers();
    this.filteredUsers.data = this.users;
    this.filteredUsers.paginator = this.paginator; // Reassign paginator after reload
    this.filteredUsers.sort = this.sort; // Reassign sort after reload
  }

  getSerialNumber(index: number): number {
    if (this.paginator) {
      return index + 1 + (this.paginator.pageIndex * this.paginator.pageSize);
    }
    return index + 1;
  }


   // Apply search filter based on name or email
   applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filteredUsers.filter = filterValue.trim().toLowerCase();

    // Custom filter predicate for filtering by name or email
    this.filteredUsers.filterPredicate = (data: User, filter: string) => {
      return data.name.toLowerCase().includes(filter) || data.email.toLowerCase().includes(filter);
    };

    if (this.filteredUsers.paginator) {
      this.filteredUsers.paginator.firstPage();
    }
  }

  editUser(user: User) {
    const dialogRef = this.dialog.open(EditUserComponent, {
      width: '400px',
      data: user
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (user) {
          this.userService.editUser(user); // Edit existing user
        } 
      }
      this.reloadUsers();
    });
  
  }

  deleteUser(userId: number) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(userId);
       this.reloadUsers();
    }
  }

  addUser() {
    const dialogRef = this.dialog.open(AddUserComponent, {
      width: '500px',
      data: { user: {}, action: 'Add' }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.addUser(result.data); 
        this.users.push(result.data); 
        this.filteredUsers.data = this.users; 
      }
      this.reloadUsers();
    });
  }
}

