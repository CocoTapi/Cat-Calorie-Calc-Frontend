import { Component } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonConstants } from './app.constants';
import { FeedComponent } from './components/feed/feed.component';
import { PetProfileComponent } from "./components/pet-profile/pet-profile.component";

@Component({
  selector: 'app-root',
  imports: [TranslateModule, FeedComponent, PetProfileComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'cat-calorie-calc-frontend';
  pet_id = 0;

  // Path to change language
  toEnglish = CommonConstants.EN;
  toJapanese = CommonConstants.JP;

  constructor(
    private translate: TranslateService
  ){
    this.translate.addLangs([CommonConstants.EN, CommonConstants.JP])
    this.translate.setDefaultLang(CommonConstants.EN);
    this.translate.use(CommonConstants.EN);
  }

  switchLang(lang: string) {
    this.translate.use(lang);
  }
}
