import { Component } from '@angular/core';
import { PetProfileComponent } from './components/pet-profile/pet-profile.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  imports: [PetProfileComponent, TranslateModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'cat-calorie-calc-frontend';
  pet_id = 0;

  constructor(
    private translate: TranslateService
  ){
    this.translate.addLangs(['en', 'jp'])
    this.translate.setDefaultLang('en');
    this.translate.use('en');
  }

  switchLang(lang: string) {
    this.translate.use(lang);
  }
}
