'use server';

/**
 * @fileOverview This file defines a Genkit flow for assisting new users in setting up their initial budget.
 *
 * It uses the user's income and typical spending habits for their region to provide personalized budget recommendations.
 *
 * - budgetSetupAssistant - A function that orchestrates the budget setup process.
 * - BudgetSetupAssistantInput - The input type for the budgetSetupAssistant function.
 * - BudgetSetupAssistantOutput - The return type for the budgetSetupAssistant function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const BudgetSetupAssistantInputSchema = z.object({
  income: z.number().describe('The user’s monthly income.'),
  region: z
    .string() 
    .describe('The user’s region to tailor spending habits.'),
});
export type BudgetSetupAssistantInput = z.infer<typeof BudgetSetupAssistantInputSchema>;

const BudgetSetupAssistantOutputSchema = z.object({
  recommendedBudget: z
    .record(z.string(), z.number())
    .describe('A map of budget categories to recommended amounts.'),
});
export type BudgetSetupAssistantOutput = z.infer<typeof BudgetSetupAssistantOutputSchema>;

export async function budgetSetupAssistant(
  input: BudgetSetupAssistantInput
): Promise<BudgetSetupAssistantOutput> {
  return budgetSetupAssistantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'budgetSetupAssistantPrompt',
  input: {schema: BudgetSetupAssistantInputSchema},
  output: {schema: BudgetSetupAssistantOutputSchema},
  prompt: `You are a personal finance advisor helping a new user set up their initial monthly budget.

  Based on the user's income of {{{income}}} and region of {{{region}}}, provide a personalized budget recommendation.

  Consider typical spending habits for the region and suggest amounts for the following categories:
  - Housing
  - Food
  - Transportation
  - Utilities
  - Healthcare
  - Entertainment
  - Savings

  The recommended budget should be a JSON object with the categories as keys and the recommended amounts as values.
  Do not include any conversational text, only the JSON object.
  Ensure the total budget does not exceed the user's income, put savings as the lowest priority.
  Be conservative and put more emphasis on savings than other categories.

  Here is the output:
  `,
});

const budgetSetupAssistantFlow = ai.defineFlow(
  {
    name: 'budgetSetupAssistantFlow',
    inputSchema: BudgetSetupAssistantInputSchema,
    outputSchema: BudgetSetupAssistantOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
