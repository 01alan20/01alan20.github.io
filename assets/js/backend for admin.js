"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertCircle, ArrowUpDown, Search } from "lucide-react"

interface Student {
  id: number
  name: string
  year: number
  gpa: number
  riskScore: number
  advisor: string
}

const mockStudents: Student[] = [
  { id: 1, name: "Alice Johnson", year: 2, gpa: 3.8, riskScore: 15, advisor: "Dr. Emily Parker" },
  { id: 2, name: "Bob Smith", year: 3, gpa: 2.1, riskScore: 65, advisor: "Prof. Michael Brown" },
  { id: 3, name: "Charlie Brown", year: 1, gpa: 3.2, riskScore: 25, advisor: "Dr. Sarah Lee" },
  { id: 4, name: "Diana Ross", year: 4, gpa: 3.9, riskScore: 10, advisor: "Prof. David Wilson" },
  { id: 5, name: "Ethan Hunt", year: 2, gpa: 2.7, riskScore: 45, advisor: "Dr. Emily Parker" },
  { id: 6, name: "Fiona Apple", year: 3, gpa: 3.5, riskScore: 20, advisor: "Prof. Michael Brown" },
  { id: 7, name: "George Michael", year: 1, gpa: 2.0, riskScore: 70, advisor: "Dr. Sarah Lee" },
  { id: 8, name: "Hannah Montana", year: 4, gpa: 3.3, riskScore: 30, advisor: "Prof. David Wilson" },
  { id: 9, name: "Ian McKellen", year: 2, gpa: 3.7, riskScore: 15, advisor: "Dr. Emily Parker" },
  { id: 10, name: "Julia Roberts", year: 3, gpa: 2.5, riskScore: 55, advisor: "Prof. Michael Brown" },
]

export default function AdminDashboard() {
  const [students, setStudents] = useState<Student[]>(mockStudents)
  const [sortConfig, setSortConfig] = useState<{ key: keyof Student; direction: 'asc' | 'desc' } | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  const sortedStudents = [...students].sort((a, b) => {
    if (!sortConfig) return 0
    const { key, direction } = sortConfig
    if (a[key] < b[key]) return direction === 'asc' ? -1 : 1
    if (a[key] > b[key]) return direction === 'asc' ? 1 : -1
    return 0
  })

  const filteredStudents = sortedStudents.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.advisor.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSort = (key: keyof Student) => {
    let direction: 'asc' | 'desc' = 'asc'
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
  }

  const highRiskCount = students.filter(student => student.riskScore >= 60).length

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full mb-6">
        <CardHeader>
          <CardTitle>University Student Risk Dashboard</CardTitle>
          <CardDescription>Overview of student risk assessments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{students.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">High Risk Students</CardTitle>
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{highRiskCount}</div>
                <p className="text-xs text-muted-foreground">
                  {((highRiskCount / students.length) * 100).toFixed(1)}% of total
                </p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Student Risk Table</CardTitle>
          <div className="flex items-center gap-4">
            <Input
              placeholder="Search students or advisors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <Search className="h-4 w-4 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead onClick={() => handleSort('name')} className="cursor-pointer">
                  Name <ArrowUpDown className="ml-2 h-4 w-4" />
                </TableHead>
                <TableHead onClick={() => handleSort('year')} className="cursor-pointer">
                  Year <ArrowUpDown className="ml-2 h-4 w-4" />
                </TableHead>
                <TableHead onClick={() => handleSort('gpa')} className="cursor-pointer">
                  GPA <ArrowUpDown className="ml-2 h-4 w-4" />
                </TableHead>
                <TableHead onClick={() => handleSort('riskScore')} className="cursor-pointer">
                  Risk Score <ArrowUpDown className="ml-2 h-4 w-4" />
                </TableHead>
                <TableHead onClick={() => handleSort('advisor')} className="cursor-pointer">
                  Academic Advisor <ArrowUpDown className="ml-2 h-4 w-4" />
                </TableHead>
                <TableHead>Risk Level</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.year}</TableCell>
                  <TableCell>{student.gpa.toFixed(2)}</TableCell>
                  <TableCell>{student.riskScore}</TableCell>
                  <TableCell>{student.advisor}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        student.riskScore < 30
                          ? "bg-green-100 text-green-800"
                          : student.riskScore < 60
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {student.riskScore < 30 ? "Low" : student.riskScore < 60 ? "Medium" : "High"}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}