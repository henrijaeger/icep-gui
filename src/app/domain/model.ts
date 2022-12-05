export interface Response {

  status: string;
  value: any;

}

export interface Station {

  uid: string;
  id?: string;
  date?: [year: number, month: number, day: number];
  target?: number;
  value?: number;

}

export interface StationUpdateDto {

  date: string;
  value: number;

}

export interface StationUpdate {

  id: string;
  before: Station | undefined;
  after: Station | undefined;

}
