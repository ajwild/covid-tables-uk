import { Except } from 'type-fest';

export type CoronavirusItem = {
  areaCode: string;
  date: string;
  cumAdmissions: number;
  newAdmissions: number;
  cumCasesByPublishDate: number;
  newCasesByPublishDate: number;
  cumCasesBySpecimenDate: number;
  newCasesBySpecimenDate: number;
  cumDeathsByDeathDate: number;
  newDeathsByDeathDate: number;
  cumDeathsByPublishDate: number;
  newDeathsByPublishDate: number;
  cumTestsByPublishDate: number;
  newTestsByPublishDate: number;
};

export type CoronavirusApiResponse<T> = {
  length: number;
  maxPageLimit: number;
  data: T[];
  pagination: {
    first: string | null;
    previous: string | null;
    current: string | null;
    next: string | null;
    last: string | null;
  };
};

export type HistoryItem = Except<CoronavirusItem, 'areaCode'>;
export type HistoryData = { [areaCode: string]: HistoryItem[] };

export type LocationItem = [string, string, string];

export type SummaryItemLatest = {
  date: string;
  value: number;
} | null;

export type SummaryItemRecent = {
  startDate: string;
  values: Array<number | null>;
} | null;

export type SummaryItems = {
  cumAdmissions: SummaryItemLatest;
  newAdmissions: SummaryItemLatest;
  recAdmissions: SummaryItemRecent;
  cumCasesByPublishDate: SummaryItemLatest;
  newCasesByPublishDate: SummaryItemLatest;
  recCasesByPublishDate: SummaryItemRecent;
  cumCasesBySpecimenDate: SummaryItemLatest;
  newCasesBySpecimenDate: SummaryItemLatest;
  recCasesBySpecimenDate: SummaryItemRecent;
  cumDeathsByDeathDate: SummaryItemLatest;
  newDeathsByDeathDate: SummaryItemLatest;
  recDeathsByDeathDate: SummaryItemRecent;
  cumDeathsByPublishDate: SummaryItemLatest;
  newDeathsByPublishDate: SummaryItemLatest;
  recDeathsByPublishDate: SummaryItemRecent;
  cumTestsByPublishDate: SummaryItemLatest;
  newTestsByPublishDate: SummaryItemLatest;
  recTestsByPublishDate: SummaryItemRecent;
};

export type SummaryGroupItem = {
  cumulative: SummaryItemLatest;
  new: SummaryItemLatest;
  recent: SummaryItemRecent;
  groupBy?: string | null;
};

export type SummaryGroups = {
  admissions: SummaryGroupItem;
  cases: SummaryGroupItem;
  deaths: SummaryGroupItem;
  tests: SummaryGroupItem;
};

export type Summary = SummaryItems & SummaryGroups;
