import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import type { FormConfig } from '#lib/types';

// Schema aligned with src/lib/types.ts
const questionSchema = z.object({
  id: z.string(),
  type: z.enum(['text', 'mask', 'star', 'dropdown', 'ranking', 'matrix', 'hidden']),
  label: z.string().optional(),
  placeholder: z.string().optional(),
  required: z.boolean().optional(),
  regex: z.string().optional(),
  mask: z.string().optional(),
  max_stars: z.number().optional(),
  options: z.array(z.string()).optional(),
  items: z.array(z.string()).optional(),
  images: z.array(z.string()).optional(),
  rows: z.array(z.string()).optional(),
  columns: z.array(z.string()).optional(),
  value: z.any().optional(),
});

const sectionSchema = z.object({
  type: z.literal('section'),
  title: z.string(),
  questions: z.array(questionSchema),
});

const formSchema: z.ZodType<FormConfig> = z.object({
  project: z.object({
    name: z.string(),
    description: z.string(),
  }),
  branding: z.object({
    logo_url: z.string(),
    colors: z.object({
      primary: z.string().optional(),
      background: z.string().optional(),
      surface: z.string().optional(),
      text: z.string().optional(),
      border: z.string().optional(),
    }).optional(),
    fonts: z.object({
      google_fonts_url: z.string().url().optional(),
      display: z.string().optional(),
      sans: z.string().optional(),
      mono: z.string().optional(),
    }).optional(),
  }),
  pages: z.object({
    about: z.object({
      title: z.string(),
      content: z.string(),
    }),
    error_404: z.object({
      title: z.string(),
      message: z.string(),
    }),
    summary: z.object({
      title: z.string(),
      description: z.string(),
    }).optional(),
    success: z.object({
      title: z.string(),
      message: z.string(),
      image_url: z.string().optional(),
    }).optional(),
    failure: z.object({
      title: z.string(),
      message: z.string(),
      image_url: z.string().optional(),
    }).optional(),
  }),
  settings: z.object({
    pagination_size: z.number().default(3),
    submit_url: z.string().url().optional(),
    mockMode: z.boolean().optional(),
    encryption: z.object({
      public_key: z.string(),
    }).optional(),
  }),
  questions: z.array(z.union([questionSchema, sectionSchema])),
});

const form = defineCollection({
  loader: glob({ pattern: "form.yaml", base: "src/content" }),
  schema: formSchema,
});

export const collections = { form };
