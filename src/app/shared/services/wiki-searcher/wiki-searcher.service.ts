import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { concatMap, delay, filter, from, map, Observable, of, switchMap, take, takeWhile, tap } from 'rxjs';
import { mapWikiLinkToString } from '../../methods/map-wiki-link-to-string';

@Injectable()
export class WikiSearcherService {
  private wikiPages: string[][] = [[]];
  private checkedTitles: string[] = [];

  constructor(
    private httpClientService: HttpClient
  ) { }

  public loader(fromWikiLink: string, toWikiLink: string): Observable<any> {
    this.resetSearch();
    const fromWiki = this.getWikipediaTitle(fromWikiLink);
    const toWiki = this.getWikipediaTitle(toWikiLink);

    return this.findNumberOfWikiPagesToAnotherWikiPage(fromWiki, toWiki, 0)
  }

  /**
   * Start searching in wiki. Used Breadth-First Search (BFS) algorithm
   * @param fromWiki from which page the search should start
   * @param toWiki which page is the search for
   * @param searchLevel how many links will be clicked to open it
   * @param searchLevelIndex the current level's page index
   * @returns
   */
  private findNumberOfWikiPagesToAnotherWikiPage(
    fromWiki: string,
    toWiki: string,
    searchLevel: number,
    searchLevelIndex?: number | undefined
  ): Observable<any> {
    return this.loadWikiLink(fromWiki).pipe(
      delay(1), // Awaits for each request so that wiki doesnt block
      map((data: any) => {
        const results = this.mapAllLinks(data?.parse?.links);
        this.wikiPages[searchLevel] = this.wikiPages[searchLevel].concat(results);

        return this.wikiPages[searchLevel];
      }),
      switchMap((data: string[]) => {
        console.log('this.wikiPages : ', this.wikiPages);
        if(!!this.isToWikiPageAvailable(data, toWiki)) {
          console.log('found!!!  : ', data);
          return of(true);
        }

        const isLastInLevel = searchLevelIndex === undefined || this.wikiPages[searchLevel-1].length - 1 === searchLevelIndex;

        if(isLastInLevel && !this.checkedTitles.includes(fromWiki)) {
          if(!this.wikiPages[searchLevel+1]) {
            this.wikiPages[searchLevel+1] = [];
          }

          this.checkedTitles.push(fromWiki);

          return from(data).pipe(
            concatMap((item: string, index: number) =>
              this.findNumberOfWikiPagesToAnotherWikiPage(
                item,
                toWiki,
                searchLevel + 1,
                index
              )
            ),
            takeWhile((value) => !value, true), // Allow final true value to pass
          );
        }

        return of(false);
      }),
      filter((data: boolean) => !!data),
      map(() => {
        return this.wikiPages.length;
      }),
    )
  }

  /**
   * Check if wiki page is available in the string
   * @param data array of strings
   * @param toWikiLink the searched wiki page
   * @returns
   */
  private isToWikiPageAvailable(data: string[], toWikiLink: string): string | undefined {
    return data.find((item: string) => item.includes(toWikiLink))
  }

  /**
   * Load wiki page
   * @param link of wiki page
   * @returns
   */
  private loadWikiLink(link: string): Observable<any> {
    const apiURL = this.getApiURL(link);

    return this.httpClientService.get(apiURL);
  }

  /**
   * Get title from link
   * @param url
   * @returns
   */
  private getWikipediaTitle(url: string): string {
    try {
      const urlParts = new URL(url);
      const pathParts = urlParts.pathname.split('/');
      return pathParts[pathParts.length - 1];
    } catch(e ) {
      return url;
    }
  }

  /**
   * Map the array of objects to array of strings
   * @param data array of objects
   * @returns
   */
  private mapAllLinks(data: any[] | undefined): string[] {
    if(!data) {
      return [];
    }

    return data.map((item: any) => {
      return mapWikiLinkToString(item);
    })
  }

  /**
   * Get the url for wiki load
   * @param title string
   * @returns
   */
  private getApiURL(title: string) {
    return `https://en.wikipedia.org/w/api.php?action=parse&page=${title}&format=json&origin=*`;
  }

  /**
   * Reset search
   */
  private resetSearch(): void {
    this.wikiPages = [[]];
    this.checkedTitles = [];
  }
}
