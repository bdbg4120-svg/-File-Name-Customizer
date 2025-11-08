
export type CaseChangeOption = 'lowercase' | 'uppercase' | 'sentence' | 'title' | '';

export interface CustomizationOptions {
  removeNumbers: boolean;
  removeParentheses: boolean;
  removeDashes: boolean;
  removeSpaces: boolean;
  replaceUnderscoreWithSpace: boolean;
  caseChange: CaseChangeOption;
  addPrefix: string;
  addSuffix: string;
  removeWords: string;
  changeExtension: string;
  findText: string;
  replaceText: string;
  maxLength: number; // 0 for no limit
}

export interface ProcessedFile {
  originalFile: File;
  originalName: string;
  newName: string;
  size: string;
  extension: string;
}
