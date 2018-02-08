export type CounterLabelProp = {
  label: string
}

export type System = {
  ip: string
  restResponse: {}
  wsResponse: {}
}

export interface IUser {
  [key: string]: any;
  displayName: string;
  userName: string;
  principal: string;
  source: string;
  email: string;
  picto: string;
}
