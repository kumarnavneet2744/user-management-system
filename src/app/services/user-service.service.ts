import { Injectable } from '@angular/core';
import { User } from '../models/user.module';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  [x: string]: any;
  private storageKey = 'users';

  constructor() {
    const users = this.getUsers();
    if (!users.length) {
      this.saveUsers([{ id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' }]);
    }
  }

  getUsers(): User[] {
    return JSON.parse(localStorage.getItem(this.storageKey) || '[]');
  }

  saveUsers(users: User[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(users));
  }

  addUser(user: User): void {
    const users = this.getUsers();
    user.id = users.length + 1;
    users.push(user);
    this.saveUsers(users);
  }

  editUser(updatedUser: User): void {
    const users = this.getUsers();
    const index = users.findIndex(user => user.id === updatedUser.id);
    if (index > -1) {
      users[index] = updatedUser;
      this.saveUsers(users);
    }
  }

  deleteUser(userId: number): void {
    const users = this.getUsers().filter(user => user.id !== userId);
    this.saveUsers(users); 
  }
}