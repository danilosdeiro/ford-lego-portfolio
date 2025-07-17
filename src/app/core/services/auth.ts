import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private users: any[] = [];
  private storageKey = 'legoFordUsers';

  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    const storedUsers = localStorage.getItem(this.storageKey);
    if (storedUsers) {
      this.users = JSON.parse(storedUsers);
    } else {
      this.users = [{ username: 'admin', email: 'admin@admin.com', password: 'admin123' }];
      this.saveUsersToLocalStorage();
    }
  }

  private saveUsersToLocalStorage() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.users));
  }

  register(userData: any): boolean {
    const userExists = this.users.some(user => user.email === userData.email || user.username === userData.username);
    if (userExists) {
      return false;
    }
    this.users.push(userData);
    this.saveUsersToLocalStorage();

    return true;
  }

  login(credentials: any): boolean {
    const user = this.users.find(u => u.username === credentials.username && u.password === credentials.password);
    if (user) {
      this.currentUserSubject.next(user);
      return true;
    } else {
      return false;
    }
  }

  logout() {
    this.currentUserSubject.next(null);
  }
}