import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/models/user.module';
import { UserService } from 'src/app/services/user-service.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {

  userForm!: FormGroup;
  userId!: number;
  user!: User;

  constructor(
    private dialogRef: MatDialogRef<EditUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: User, // Injecting user data
    private fb: FormBuilder,
    private userService: UserService,
  ) { }

  ngOnInit(): void {
    // Fetch the user ID from the URL
    this.userId = Number(this.data.id);
    console.log(this.data)
    // Fetch the user's data based on the ID
    this.user = this.userService.getUsers().find(user => user.id === this.userId) as User;

    // Initialize the form with the user's data
    this.userForm = this.fb.group({
      name: [this.data.name, Validators.required],
      email: [this.data.email, [Validators.required, Validators.email]],
      role: [this.data.role, Validators.required]
    });
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      const updatedUser = {
        id: this.userId,
        ...this.userForm.value
      };
      // Update the user in the service
      this.userService.editUser(updatedUser);
      this.dialogRef.close()
    }
  }

  cancel(): void {
    this.dialogRef.close()
  }
}
