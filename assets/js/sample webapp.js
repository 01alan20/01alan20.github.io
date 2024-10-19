"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { AlertCircle, CheckCircle2 } from "lucide-react"

interface StudentData {
  gpa: number
  attendance: number
  extracurricular: string
  financialAid: string
  year: number
  totalCredits: number
  currentCredits: number
}

interface Risk {
  name: string
  level: "high" | "medium" | "low"
  recommendation: string
}

export default function StudentRiskAssessment() {
  const [studentData, setStudentData] = useState<StudentData>({
    gpa: 2.5,
    attendance: 80,
    extracurricular: "none",
    financialAid: "no",
    year: 1,
    totalCredits: 0,
    currentCredits: 12,
  })

  const [riskScore, setRiskScore] = useState<number | null>(null)
  const [risks, setRisks] = useState<Risk[]>([])

  const calculateRiskScore = (data: StudentData): number => {
    let score = 0
    if (data.gpa < 2.0) score += 30
    else if (data.gpa < 3.0) score += 15
    if (data.attendance < 70) score += 30
    else if (data.attendance < 85) score += 15
    if (data.extracurricular === "none") score += 10
    if (data.financialAid === "no") score += 15
    if (data.year > 2 && data.totalCredits < 60) score += 20
    if (data.currentCredits < 12) score += 15
    else if (data.currentCredits > 18) score += 10
    return score
  }

  const identifyRisks = (data: StudentData): Risk[] => {
    const risks: Risk[] = []
    if (data.gpa < 2.0) {
      risks.push({
        name: "Low GPA",
        level: "high",
        recommendation: "Provide academic tutoring and study skills workshops",
      })
    } else if (data.gpa < 3.0) {
      risks.push({
        name: "Moderate GPA",
        level: "medium",
        recommendation: "Offer optional study groups and academic counseling",
      })
    }
    if (data.attendance < 70) {
      risks.push({
        name: "Poor Attendance",
        level: "high",
        recommendation: "Implement attendance improvement plan and regular check-ins",
      })
    } else if (data.attendance < 85) {
      risks.push({
        name: "Moderate Attendance",
        level: "medium",
        recommendation: "Send attendance reminders and offer incentives for improvement",
      })
    }
    if (data.extracurricular === "none") {
      risks.push({
        name: "No Extracurricular Activities",
        level: "low",
        recommendation: "Encourage participation in clubs or sports",
      })
    }
    if (data.financialAid === "no") {
      risks.push({
        name: "No Financial Aid",
        level: "medium",
        recommendation: "Provide information on scholarship opportunities and financial counseling",
      })
    }
    if (data.year > 2 && data.totalCredits < 60) {
      risks.push({
        name: "Insufficient Credits for Year Level",
        level: "high",
        recommendation: "Schedule academic advising to create a credit catch-up plan",
      })
    }
    if (data.currentCredits < 12) {
      risks.push({
        name: "Low Current Credit Load",
        level: "medium",
        recommendation: "Discuss potential for adding courses or addressing barriers to full-time enrollment",
      })
    } else if (data.currentCredits > 18) {
      risks.push({
        name: "High Current Credit Load",
        level: "low",
        recommendation: "Monitor for signs of academic stress and offer time management resources",
      })
    }
    return risks
  }

  const handleAssess = () => {
    const score = calculateRiskScore(studentData)
    setRiskScore(score)
    setRisks(identifyRisks(studentData))
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Student Risk Assessment</CardTitle>
          <CardDescription>Enter student information to calculate dropout risk</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="gpa">GPA (0.0 - 4.0)</Label>
            <Slider
              id="gpa"
              min={0}
              max={4}
              step={0.1}
              value={[studentData.gpa]}
              onValueChange={(value) => setStudentData({ ...studentData, gpa: value[0] })}
            />
            <p className="text-sm text-muted-foreground">Current GPA: {studentData.gpa.toFixed(1)}</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="attendance">Attendance Rate (%)</Label>
            <Slider
              id="attendance"
              min={0}
              max={100}
              step={1}
              value={[studentData.attendance]}
              onValueChange={(value) => setStudentData({ ...studentData, attendance: value[0] })}
            />
            <p className="text-sm text-muted-foreground">Current Attendance: {studentData.attendance}%</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="extracurricular">Extracurricular Activities</Label>
            <Select
              value={studentData.extracurricular}
              onValueChange={(value) => setStudentData({ ...studentData, extracurricular: value })}
            >
              <SelectTrigger id="extracurricular">
                <SelectValue placeholder="Select extracurricular involvement" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="some">Some</SelectItem>
                <SelectItem value="active">Active</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="financialAid">Financial Aid</Label>
            <Select
              value={studentData.financialAid}
              onValueChange={(value) => setStudentData({ ...studentData, financialAid: value })}
            >
              <SelectTrigger id="financialAid">
                <SelectValue placeholder="Select financial aid status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="year">Year in University</Label>
            <Select
              value={studentData.year.toString()}
              onValueChange={(value) => setStudentData({ ...studentData, year: parseInt(value) })}
            >
              <SelectTrigger id="year">
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1st Year</SelectItem>
                <SelectItem value="2">2nd Year</SelectItem>
                <SelectItem value="3">3rd Year</SelectItem>
                <SelectItem value="4">4th Year</SelectItem>
                <SelectItem value="5">5th Year or more</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="totalCredits">Total Credit Hours Taken</Label>
            <Input
              id="totalCredits"
              type="number"
              value={studentData.totalCredits}
              onChange={(e) => setStudentData({ ...studentData, totalCredits: parseInt(e.target.value) })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="currentCredits">Current Credit Load</Label>
            <Input
              id="currentCredits"
              type="number"
              value={studentData.currentCredits}
              onChange={(e) => setStudentData({ ...studentData, currentCredits: parseInt(e.target.value) })}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleAssess} className="w-full">Assess Risk</Button>
        </CardFooter>
      </Card>

      {riskScore !== null && (
        <Card className="w-full max-w-2xl mx-auto mt-4">
          <CardHeader>
            <CardTitle>Risk Assessment Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Overall Risk Score: {riskScore}</h3>
              <div className={`text-lg font-bold ${
                riskScore < 30 ? "text-green-500" : riskScore < 60 ? "text-yellow-500" : "text-red-500"
              }`}>
                {riskScore < 30 ? "Low Risk" : riskScore < 60 ? "Medium Risk" : "High Risk"}
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Identified Risks and Recommendations:</h3>
              {risks.map((risk, index) => (
                <div key={index} className="border-l-4 pl-4 py-2 space-y-1" style={{
                  borderColor: risk.level === "high" ? "red" : risk.level === "medium" ? "yellow" : "green"
                }}>
                  <h4 className="font-semibold flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    {risk.name}
                  </h4>
                  <p className="text-sm text-muted-foreground">{risk.recommendation}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}