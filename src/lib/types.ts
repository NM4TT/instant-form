export interface FormConfig {
  project: {
    name: string;
    description: string;
  };
  branding: {
    logo_url: string;
    colors?: {
      primary: string;
      background: string;
      text: string;
    };
    fonts?: {
      google_fonts_url?: string;
      display?: string;
      sans?: string;
      mono?: string;
    };
  };
  pages: {
    about: {
      title: string;
      content: string;
    };
    error_404: {
      title: string;
      message: string;
    };
    summary?: {
      title: string;
      description: string;
    };
    success?: {
      title: string;
      message: string;
      image_url?: string;
    };
    failure?: {
      title: string;
      message: string;
      image_url?: string;
    };
  };
  settings: {
    pagination_size: number;
    submit_url?: string;
    mockMode?: boolean;
    encryption?: {
      public_key: string;
    };
  };
  questions: (Question | Section)[];
}

export interface Section {
  type: 'section';
  title: string;
  questions: Question[];
}

export type QuestionType = 'text' | 'mask' | 'star' | 'dropdown' | 'ranking' | 'matrix' | 'hidden';

export interface Question {
  id: string;
  type: QuestionType;
  label?: string;
  placeholder?: string;
  required?: boolean;
  regex?: string;
  mask?: string;
  max_stars?: number;
  options?: string[];
  items?: string[];
  images?: string[];
  rows?: string[];
  columns?: string[];
  value?: any;
}
