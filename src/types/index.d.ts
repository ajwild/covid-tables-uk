import { Except } from 'type-fest';

export type CoronavirusItem = {
  readonly areaCode: string;
  readonly date: string;
  readonly cumAdmissions: number;
  readonly newAdmissions: number;
  readonly cumCasesByPublishDate: number;
  readonly newCasesByPublishDate: number;
  readonly cumCasesByPublishDateRate: number;
  readonly cumCasesBySpecimenDate: number;
  readonly newCasesBySpecimenDate: number;
  readonly cumCasesBySpecimenDateRate: number;
  readonly cumDeaths28DaysByPublishDate: number;
  readonly newDeaths28DaysByPublishDate: number;
  readonly cumTestsByPublishDate: number;
  readonly newTestsByPublishDate: number;
};

export type CoronavirusApiResponse<T> = {
  readonly length: number;
  readonly maxPageLimit: number;
  readonly data: readonly T[];
  readonly pagination: {
    readonly first: string | null;
    readonly previous: string | null;
    readonly current: string | null;
    readonly next: string | null;
    readonly last: string | null;
  };
};

export type HistoryItem = Except<CoronavirusItem, 'areaCode'>;
export type HistoryData = {
  readonly [areaCode: string]: readonly HistoryItem[];
};

export type LocationItem = readonly [string, string, string];

export type SummaryItemLatest = {
  readonly date: string;
  readonly value: number;
} | null;

export type SummaryItemRecent = {
  readonly startDate: string;
  readonly values: ReadonlyArray<number | null>;
} | null;

export type SummaryItems = {
  readonly cumAdmissions: SummaryItemLatest;
  readonly newAdmissions: SummaryItemLatest;
  readonly recAdmissions: SummaryItemRecent;
  readonly cumCasesByPublishDate: SummaryItemLatest;
  readonly newCasesByPublishDate: SummaryItemLatest;
  readonly recCasesByPublishDate: SummaryItemRecent;
  readonly cumCasesBySpecimenDate: SummaryItemLatest;
  readonly newCasesBySpecimenDate: SummaryItemLatest;
  readonly recCasesBySpecimenDate: SummaryItemRecent;
  readonly cumDeaths28DaysByPublishDate: SummaryItemLatest;
  readonly newDeaths28DaysByPublishDate: SummaryItemLatest;
  readonly recDeaths28DaysByPublishDate: SummaryItemRecent;
  readonly cumTestsByPublishDate: SummaryItemLatest;
  readonly newTestsByPublishDate: SummaryItemLatest;
  readonly recTestsByPublishDate: SummaryItemRecent;
};

export type SummaryGroupItem = {
  readonly cumulative: SummaryItemLatest;
  readonly new: SummaryItemLatest;
  readonly recent: SummaryItemRecent;
  readonly groupBy?: string | null;
};

export type SummaryGroups = {
  readonly admissions: SummaryGroupItem;
  readonly cases: SummaryGroupItem;
  readonly deaths: SummaryGroupItem;
  readonly tests: SummaryGroupItem;
};

export type Summary = SummaryItems & SummaryGroups;

export type Populations = ReadonlyArray<{
  readonly areaCode: string;
  readonly population: number;
}>;

export type PopulationData = { readonly [areaCode: string]: number };
