import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { WikiSearcherService } from '../../shared/services/wiki-searcher/wiki-searcher.service';
import { CustomFormService } from '../../shared/services/custom-form/custom-form.service';
import { BehaviorSubject, filter, Observable, Subject, Subscription, switchMap } from 'rxjs';

interface SearchInterface {
  fromWiki: string
  toWiki: string
}

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrl: './page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PageComponent implements OnDestroy {
  private hasError$$ = new Subject();
  private isFormLoading$$ = new Subject<boolean>();
  private wikiPageToOpenFromTo$$ = new BehaviorSubject<string>('');
  private startSearch$$ = new BehaviorSubject<SearchInterface | null>(null);

  public formGroup: FormGroup | undefined;
  public readonly hasError$ = this.hasError$$.asObservable();
  public readonly isFormLoading$: Observable<boolean> = this.isFormLoading$$.asObservable();
  public readonly wikiPageToOpenFromTo$: Observable<string> = this.wikiPageToOpenFromTo$$.asObservable();
  public readonly startSerach$: Observable<number> = this.startSearch$$.asObservable().pipe(
    filter(searchWikiData => !!searchWikiData),
    switchMap((searchWikiData: SearchInterface) =>
      this.wikiSearcherService.loader(searchWikiData.fromWiki, searchWikiData.toWiki)
    )
  )

  public subscribers: Subscription = new Subscription();

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly wikiSearcherService: WikiSearcherService,
    private readonly customFormService: CustomFormService
  ) {
    this.createForm();

    this.subscribers.add(this.startSerach$.subscribe((data: number) => {
      console.log(data);
      this.wikiPageToOpenFromTo$$.next(String(data));
      this.isFormLoading$$.next(false);
    }));
  }

  public ngOnDestroy(): void {
    this.subscribers.unsubscribe();
  }

  /**
   * Submit form
   * @returns
   */
  public submitForm(): void {
    const isValid = this.customFormService.isFormValid(this.formGroup);
    this.hasError$$.next(!isValid);
    this.isFormLoading$$.next(true);
    this.wikiPageToOpenFromTo$$.next('');

    if(!isValid) {
      return;
    }

    const fromWiki = this.formGroup?.get('fromWiki')?.value;
    const toWiki = this.formGroup?.get('toWiki')?.value;

    this.startSearch$$.next({
      fromWiki: fromWiki,
      toWiki: toWiki
    })
  }

  /**
   * Create form group
   */
  private createForm(): void {
    this.formGroup = this.formBuilder.group({
      fromWiki: new FormControl('', [Validators.required]),
      toWiki: new FormControl('', [Validators.required]),
    })
  }
}
