'use server';

/**
 * @fileOverview Recommends budget adjustments based on spending patterns.
 *
 * - getBudgetRecommendations - A function that provides budget adjustment recommendations.
 * - BudgetRecommendationsInput - The input type for the getBudgetRecommendations function.
 * - BudgetRecommendationsOutput - The return type for the getBudgetRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const BudgetRecommendationsInputSchema = z.object({
  spendingData: z.record(z.number()).describe('A record of spending data for each category.'),
  currentBudgets: z.record(z.number()).describe('A record of current budgets for each category.'),
});
export type BudgetRecommendationsInput = z.infer<typeof BudgetRecommendationsInputSchema>;

const BudgetRecommendationsOutputSchema = z.record(z.string()).describe('Recommendations for budget adjustments for each category.');
export type BudgetRecommendationsOutput = z.infer<typeof BudgetRecommendationsOutputSchema>;

export async function getBudgetRecommendations(input: BudgetRecommendationsInput): Promise<BudgetRecommendationsOutput> {
  return budgetRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'budgetRecommendationsPrompt',
  input: {schema: BudgetRecommendationsInputSchema},
  output: {schema: BudgetRecommendationsOutputSchema},
  prompt: `You are a personal finance advisor. Analyze the provided spending data and current budgets, and provide recommendations for adjusting budgets in each category to avoid overspending.

Spending Data: {{{spendingData}}}
Current Budgets: {{{currentBudgets}}}

Provide recommendations for each category. Be direct and concise.
`,
});

const budgetRecommendationsFlow = ai.defineFlow(
  {
    name: 'budgetRecommendationsFlow',
    inputSchema: BudgetRecommendationsInputSchema,
    outputSchema: BudgetRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
