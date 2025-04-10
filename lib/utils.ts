import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function convertToDate(date: string) {
  const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Des"]

  const temp = date.split("-")

  const [ day, month, year ] = [temp[2], months[parseInt(temp[1]) - 1], temp[0]]

  return `${day} ${month} ${year}`
}
