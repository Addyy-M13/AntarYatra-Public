"use client"

import { Check, X } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table"

const features = [
  {
    feature: "AI-Powered Journaling",
    antaryatra: true,
    others: false,
    description: "Smart analysis and personalized insights"
  },
  {
    feature: "Hinglish Support",
    antaryatra: true,
    others: false,
    description: "Write comfortably in Hindi, English, or mix both"
  },
  {
    feature: "India-Focused Wellness",
    antaryatra: true,
    others: false,
    description: "Content tailored to Indian cultural context"
  },
  {
    feature: "Privacy Focus",
    antaryatra: true,
    others: true,
    description: "End-to-end encryption and anonymity options"
  },
  {
    feature: "Community Support",
    antaryatra: true,
    others: true,
    description: "Connect with others on similar journeys"
  },
  {
    feature: "Free Version",
    antaryatra: true,
    others: true,
    description: "Basic features available at no cost"
  }
]

export function ComparisonTable() {
  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Feature</TableHead>
            <TableHead className="text-center">AntarYatra</TableHead>
            <TableHead className="text-center">Others</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {features.map((item) => (
            <TableRow key={item.feature}>
              <TableCell className="font-medium">
                <div>
                  <p>{item.feature}</p>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              </TableCell>
              <TableCell className="text-center">
                {item.antaryatra ? (
                  <Check className="w-5 h-5 text-green-500 mx-auto" />
                ) : (
                  <X className="w-5 h-5 text-red-500 mx-auto" />
                )}
              </TableCell>
              <TableCell className="text-center">
                {item.others ? (
                  <Check className="w-5 h-5 text-green-500 mx-auto" />
                ) : (
                  <X className="w-5 h-5 text-red-500 mx-auto" />
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
