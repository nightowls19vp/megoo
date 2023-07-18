import {action, makeAutoObservable, observable} from 'mobx';

class SearchStore {
  @observable
  public searchText: string = '';

  @observable
  public searchResult: unknown = undefined;

  @observable
  public searchService: Function | undefined = undefined;

  @observable
  public searchParams: unknown[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  @action
  public setSearchText = (search: string) => {
    this.searchText = search;
  };

  @action
  public setSearchResult = (searchResult: unknown) => {
    this.searchResult = searchResult;
  };

  @action
  public setSearchService = (searchService: Function) => {
    this.searchService = searchService;
  };

  @action
  public setSearchParams = (searchParams: unknown[]) => {
    this.searchParams = searchParams.map(searchParams =>
      JSON.parse(JSON.stringify(searchParams)),
    );
  };

  @action
  public reset() {
    this.searchText = '';
    this.searchResult = undefined;
    this.searchService = undefined;
    this.searchParams = [];
  }

  @action
  doSearch = async (): Promise<void> => {
    console.log('\n\n\ndoSearch', this.searchText + '\n\n\n');

    if (this.searchService) {
      const searchResult = await this.searchService(
        {
          ...(this.searchParams?.[0] as object),
          search: this.searchText,
        },
        ...(this.searchParams.slice(1) as object[]),
      );

      this.setSearchResult(searchResult);

      console.log('searchResult', JSON.stringify(this.searchResult, null, 2));
    }
  };
}

const searchStore = new SearchStore();

export default searchStore;
