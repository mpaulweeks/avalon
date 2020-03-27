import { ServerShare } from "./ServerShare";

export interface VoteData {
  showResults: boolean,
  votes: {
    [key: string]: string,
  };
}

export class ServerVote extends ServerShare<VoteData> {
  path = 'vote';
}
