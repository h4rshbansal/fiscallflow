"use client";

import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CalendarIcon, PlusCircle, Camera, X } from "lucide-react";
import { categories } from "@/lib/data";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { Transaction } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { extractBillData } from "@/ai/flows/extract-bill-data";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


const formSchema = z.object({
  description: z.string().min(2, {
    message: "Description must be at least 2 characters.",
  }),
  amount: z.coerce.number().positive({ message: "Amount must be positive." }),
  category: z.string().min(1, { message: "Please select a category." }),
  date: z.date(),
  type: z.enum(["expense", "income"], {
    required_error: "You need to select a transaction type.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

interface AddTransactionSheetProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    onSubmit: (values: any) => void;
    transactionToEdit?: Transaction | null;
}

export function AddTransactionSheet({ 
    isOpen,
    onOpenChange,
    onSubmit,
    transactionToEdit,
}: AddTransactionSheetProps) {
  const { toast } = useToast();
  const [isScanning, setIsScanning] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const defaultValues = transactionToEdit ? {
    ...transactionToEdit,
    amount: transactionToEdit.amount / 100,
    date: new Date(transactionToEdit.date),
  } : {
    description: "",
    amount: 0,
    type: "expense" as "expense" | "income",
    date: new Date(),
    category: "",
  }

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  });

  useEffect(() => {
    form.reset(defaultValues);
  }, [transactionToEdit, form, isOpen]);

  useEffect(() => {
    let stream: MediaStream | null = null;
    const getCameraPermission = async () => {
      if (!isCameraOpen) {
        if (videoRef.current?.srcObject) {
          (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
          videoRef.current.srcObject = null;
        }
        return;
      }

      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        setHasCameraPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description: 'Please enable camera permissions in your browser settings to use this app.',
        });
        setIsCameraOpen(false);
      }
    };

    getCameraPermission();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isCameraOpen, toast]);
  

  const handleFormSubmit = (values: FormValues) => {
    const processedValues = {
        ...values,
        amount: values.amount * 100, // convert back to cents
        date: values.date.toISOString(),
    };

    if (transactionToEdit) {
        onSubmit({ ...processedValues, id: transactionToEdit.id });
    } else {
        onSubmit(processedValues);
    }
    onOpenChange(false);
  };

  const handleCaptureAndScan = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    setIsScanning(true);

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    context?.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageDataUri = canvas.toDataURL('image/jpeg');

    try {
      const result = await extractBillData({ imageDataUri });

      // Find the closest matching category
      const categoryNames = categories.map(c => c.name.toLowerCase());
      const suggestedCategoryLower = result.category.toLowerCase();
      let bestMatch = categories.find(c => c.name.toLowerCase() === suggestedCategoryLower)?.name || 'Other';
      
      form.reset({
        description: result.description,
        amount: result.amount,
        date: new Date(result.date),
        category: bestMatch,
        type: 'expense'
      });

      toast({
        title: "Scan Successful",
        description: "Transaction details have been filled. Please review and save.",
      });
    } catch(err) {
      console.error(err);
      toast({
        variant: "destructive",
        title: "Scan Failed",
        description: "Could not extract details from the bill. Please try again or enter manually.",
      });
    } finally {
      setIsScanning(false);
      setIsCameraOpen(false);
    }
  };


  return (
    <>
    <Sheet open={isOpen && !isCameraOpen} onOpenChange={(open) => {
      if (isCameraOpen) return;
      onOpenChange(open);
    }}>
      <SheetTrigger asChild>
        <Button onClick={() => onOpenChange(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Transaction
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle>{transactionToEdit ? 'Edit Transaction' : 'Add New Transaction'}</SheetTitle>
          <SheetDescription>
            {transactionToEdit ? 'Update the details of your transaction.' : 'Enter the details of your new transaction below.'}
          </SheetDescription>
        </SheetHeader>
        <div className="py-4">
            <Button variant="outline" className="w-full" onClick={() => setIsCameraOpen(true)}>
                <Camera className="mr-2 h-4 w-4" />
                Scan a Bill
            </Button>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6 flex-grow flex flex-col">
            <div className="flex-grow pr-4 overflow-y-auto space-y-4">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Coffee with friends" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0.00" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Transaction Type</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex space-x-4"
                        >
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="expense" />
                            </FormControl>
                            <FormLabel className="font-normal">Expense</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="income" />
                            </FormControl>
                            <FormLabel className="font-normal">Income</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.name}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Transaction Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </div>
            <SheetFooter>
                <Button type="submit">{transactionToEdit ? 'Save Changes' : 'Save Transaction'}</Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
    
    {isCameraOpen && (
      <div className="fixed inset-0 z-50 bg-black flex flex-col">
        <header className="flex items-center justify-between p-4 bg-black/50 text-white">
          <h2 className="text-lg font-semibold">Scan Bill</h2>
          <Button variant="ghost" size="icon" onClick={() => setIsCameraOpen(false)}>
            <X className="h-6 w-6" />
          </Button>
        </header>

        <div className="flex-grow relative flex items-center justify-center">
            {hasCameraPermission === null && (
                <p className="text-white">Requesting camera permission...</p>
            )}

            {hasCameraPermission === false && (
                <Alert variant="destructive" className="max-w-sm mx-auto">
                    <AlertTitle>Camera Access Required</AlertTitle>
                    <AlertDescription>
                        Please allow camera access in your browser to use this feature.
                    </AlertDescription>
                </Alert>
            )}
            
            <video ref={videoRef} className="w-full h-full object-cover" autoPlay playsInline muted />
            <canvas ref={canvasRef} className="hidden"></canvas>

            {isScanning && (
                <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center gap-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <p className="text-white text-lg">Analyzing your bill...</p>
                </div>
            )}
        </div>
        
        <footer className="p-4 bg-black/50 flex justify-center">
          <Button 
            className="h-16 w-16 rounded-full" 
            onClick={handleCaptureAndScan}
            disabled={isScanning || !hasCameraPermission}
          >
            <Camera className="h-8 w-8"/>
          </Button>
        </footer>
      </div>
    )}
    </>
  );
}
