import { Component, OnInit } from '@angular/core';
import { logout } from '@app/store/actions';
import { Store } from '@ngrx/store';
import packageInfo from '../../../package.json';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
})
export class AboutPage implements OnInit {
  author: string;
  name: string;
  description: string;
  version: string;

  constructor(private store: Store) {}

  ngOnInit() {
    this.author = packageInfo.author;
    this.name = packageInfo.name;
    this.description = packageInfo.description;
    this.version = packageInfo.version;
  }

  logout() {
    this.store.dispatch(logout());
  }
}
