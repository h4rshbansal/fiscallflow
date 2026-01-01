'use server';

/**
 * @fileOverview Extracts transaction data from a bill image.
 *
 * - extractBillData - A function that extracts transaction data from an image.
 * - ExtractBillDataInput - The input type for the extractBillData function.
 * - ExtractBillDataOutput - The return type for the extractBillData function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractBillDataInputSchema = z.object({
  imageDataUri: z
    .string()
    .describe(
      "A photo of a bill or receipt, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ExtractBillDataInput = z.infer<typeof ExtractBillDataInputSchema>;

const ExtractBillDataOutputSchema = z.object({
  description: z.string().describe("The name of the vendor or a short description of the bill."),
  amount: z.number().describe("The total amount of the transaction."),
  date: z.string().describe("The date of the transaction in ISO 8601 format (YYYY-MM-DD)."),
  category: z.string().describe("A suggested category for the transaction (e.g., Food, Groceries, Utilities)."),
});
export type ExtractBillDataOutput = z.infer<typeof ExtractBillDataOutputSchema>;

export async function extractBillData(
  input: ExtractBillDataInput
): Promise<ExtractBillDataOutput> {
  return extractBillDataFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractBillDataPrompt',
  input: {schema: ExtractBillDataInputSchema},
  output: {schema: ExtractBillDataOutputSchema},
  prompt: `You are an expert at extracting structured data from images of receipts and bills.
Analyze the following image and extract the vendor name (for the description), the total amount, the transaction date, and suggest a suitable category.

Today's date is ${new Date().toDateString()} for reference if the year is not present on the receipt.

Image: {{media url=imageDataUri}}

Return the data in the specified JSON format.
`,
});

const extractBillDataFlow = ai.defineFlow(
  {
    name: 'extractBillDataFlow',
    inputSchema: ExtractBillDataInputSchema,
    outputSchema: ExtractBillDataOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
