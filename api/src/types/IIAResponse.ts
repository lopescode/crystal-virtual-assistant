export interface IIAResponse {
  choices: {
    message: {
      role: string;
      content: string;
    };
  }[];
}
