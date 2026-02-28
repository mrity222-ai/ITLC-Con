'use server';
/**
 * @fileOverview This file provides a Genkit flow for correcting and standardizing address entries
 * using an LLM, intended for use in a lead generation form.
 *
 * - correctAddress - A function that handles the address correction process.
 * - AddressCorrectionInput - The input type for the correctAddress function.
 * - AddressCorrectionOutput - The return type for the correctAddress function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AddressCorrectionInputSchema = z.object({
  addressInput: z
    .string()
    .describe('The user-provided address string that needs correction.'),
});
export type AddressCorrectionInput = z.infer<typeof AddressCorrectionInputSchema>;

const AddressCorrectionOutputSchema = z.object({
  correctedAddress: z
    .string()
    .describe('The corrected and standardized address. Returns an empty string if the input is not a valid or recognizable address.'),
});
export type AddressCorrectionOutput = z.infer<typeof AddressCorrectionOutputSchema>;

export async function correctAddress(input: AddressCorrectionInput): Promise<AddressCorrectionOutput> {
  return addressCorrectionFlow(input);
}

const addressCorrectionPrompt = ai.definePrompt({
  name: 'addressCorrectionPrompt',
  input: { schema: AddressCorrectionInputSchema },
  output: { schema: AddressCorrectionOutputSchema },
  prompt: `You are an expert address standardization and correction agent.

Given the following address input, your task is to:
1. Correct any typos or errors.
2. Standardize the address format.
3. Provide a single, accurate, and complete corrected address string.
4. If the input is too vague, clearly not an address, or cannot be corrected into a meaningful address, return an empty string for the 'correctedAddress' field.

Address Input: {{{addressInput}}}`,
});

const addressCorrectionFlow = ai.defineFlow(
  {
    name: 'addressCorrectionFlow',
    inputSchema: AddressCorrectionInputSchema,
    outputSchema: AddressCorrectionOutputSchema,
  },
  async (input) => {
    const { output } = await addressCorrectionPrompt(input);
    return output!;
  }
);
