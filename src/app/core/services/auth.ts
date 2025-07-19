import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { NotificationService } from './notification';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private users: any[] = [];
  private storageKeyUsers = 'legoFordUsers';
  private storageKeyRemembered = 'legoFordRememberedUser';

  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private notificationService: NotificationService) {
    const storedUsers = localStorage.getItem(this.storageKeyUsers);
    if (storedUsers) {
      this.users = JSON.parse(storedUsers);
    } else {
      this.users = [{ username: 'admin', email: 'admin@admin.com', password: 'admin123' }];
      this.saveUsersToLocalStorage();
    }
  }

  private saveUsersToLocalStorage() {
    localStorage.setItem(this.storageKeyUsers, JSON.stringify(this.users));
  }
  getRememberedUser(): string | null {
    return localStorage.getItem(this.storageKeyRemembered);
  }

  register(userData: any): boolean {
    const userExists = this.users.some(user => user.email === userData.email || user.username === userData.username);
    if (userExists) {
      return false;
    }
    this.users.push(userData);
    this.saveUsersToLocalStorage();
    this.notificationService.show('Seu cadastro foi realizado com sucesso!');
    return true;
  }

  login(credentials: any, rememberMe: boolean): boolean {
    const user = this.users.find(u => u.username === credentials.username && u.password === credentials.password);
    if (user) {
      this.currentUserSubject.next(user);
      this.notificationService.show(`Bem-vindo(a), ${user.username}!`);
      
      if (rememberMe) {
        localStorage.setItem(this.storageKeyRemembered, user.username);
      } else {
        localStorage.removeItem(this.storageKeyRemembered);
      }
      return true;
    }
    return false;
  }

  logout() {
    this.currentUserSubject.next(null);
  }
}