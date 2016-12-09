import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';

import { Hero } from '../hero';
import { HeroSearchService } from '../hero-data/hero-search.service';

@Component({
  moduleId: module.id.toString(),
  selector: 'app-hero-search',
  templateUrl: './hero-search.component.html',
  styleUrls: ['./hero-search.component.css'],
  providers: [HeroSearchService]
})
export class HeroSearchComponent implements OnInit {
  heroes: Observable<Hero[]>;
  private searchTerms = new Subject<string>();

  constructor(
    private heroSearchService: HeroSearchService,
    private router: Router) { }

// Push a search term into the observable stream.
  search(term: string): void {
    this.searchTerms.next(term);
  }

  ngOnInit(): void {
    this.heroes = this.searchTerms
      .debounceTime(300)
      .distinctUntilChanged()
      .switchMap(term => term ? this.heroSearchService.search(term) : Observable.of<Hero[]>([]))
      .catch(error => {
        console.error(error);
        return Observable.of<Hero[]>([]);
      });
  }

  gotoDetails(hero: Hero): void {
    let link = ['/detail', hero.id];
    this.router.navigate(link);
  }


}
