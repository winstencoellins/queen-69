import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

interface clientForm {
  clientName: string;
  city: string;
  address: string;
  telephone: string;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
