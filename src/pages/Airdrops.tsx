"use client"

import type React from "react"

import { useState } from "react"
import { v4 as uuidv4 } from "uuid"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"

import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Textarea } from "../components/ui/textarea"
import { Label } from "../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Separator } from "../components/ui/separator"
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover"
import { Calendar } from "../components/ui/calendar"

// Define TypeScript interfaces for MongoDB
export interface TokenDetails {
  name: string
  symbol: string
  contractAddress: string
  decimals: number
  blockchain: string
}

// Update the AirdropData interface to include tasks
export interface AirdropData {
  _id?: string // MongoDB ID
  airdropId: string
  airdropName: string
  description: string
  websiteUrl: string
  totalAirdropAmount: number
  tokensPerUser: number
  distributionMethod: string
  eligibilityCriteria: string
  airdropStartDate: Date
  airdropEndDate: Date
  distributionDate: Date
  claimDeadline: Date
  token: TokenDetails
  createdAt?: Date
  updatedAt?: Date
  tasks: Array<{
    taskId: string
    taskName: string
  }>
}

export default function CreateAirdropForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Initialize form state
  // Update the initial state in useState
  const [formData, setFormData] = useState<AirdropData>({
    airdropId: uuidv4(),
    airdropName: "",
    description: "",
    websiteUrl: "",
    totalAirdropAmount: 0,
    tokensPerUser: 0,
    distributionMethod: "",
    eligibilityCriteria: "",
    airdropStartDate: new Date(),
    airdropEndDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default to 1 week later
    distributionDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000), // Default to 8 days later
    claimDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Default to 30 days later
    token: {
      name: "",
      symbol: "",
      contractAddress: "",
      decimals: 18,
      blockchain: "",
    },
    tasks: [],
  })

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    // Handle nested token fields
    if (name.startsWith("token.")) {
      const tokenField = name.split(".")[1]
      setFormData({
        ...formData,
        token: {
          ...formData.token,
          [tokenField]: value,
        },
      })
    } else {
      setFormData({
        ...formData,
        [name]: value,
      })
    }
  }

  // Handle number input changes
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    // Handle nested token fields
    if (name.startsWith("token.")) {
      const tokenField = name.split(".")[1]
      setFormData({
        ...formData,
        token: {
          ...formData.token,
          [tokenField]: Number(value),
        },
      })
    } else {
      setFormData({
        ...formData,
        [name]: Number(value),
      })
    }
  }

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    // Handle nested token fields
    if (name.startsWith("token.")) {
      const tokenField = name.split(".")[1]
      setFormData({
        ...formData,
        token: {
          ...formData.token,
          [tokenField]: value,
        },
      })
    } else {
      setFormData({
        ...formData,
        [name]: value,
      })
    }
  }

  // Handle date changes
  const handleDateChange = (name: string, date: Date | undefined) => {
    if (date) {
      setFormData({
        ...formData,
        [name]: date,
      })
    }
  }

  // Add a new function to handle adding tasks
  const addTask = () => {
    setFormData((prevData) => ({
      ...prevData,
      tasks: [...prevData.tasks, { taskId: uuidv4(), taskName: "" }],
    }))
  }

  // Add a function to handle task input changes
  const handleTaskChange = (index: number, field: "taskName", value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      tasks: prevData.tasks.map((task, i) => (i === index ? { ...task, [field]: value } : task)),
    }))
  }

  // Add a function to remove a task
  const removeTask = (index: number) => {
    setFormData((prevData) => ({
      ...prevData,
      tasks: prevData.tasks.filter((_, i) => i !== index),
    }))
  }

  // Reset form
  const resetForm = () => {
    setFormData({
      airdropId: uuidv4(),
      airdropName: "",
      description: "",
      websiteUrl: "",
      totalAirdropAmount: 0,
      tokensPerUser: 0,
      distributionMethod: "",
      eligibilityCriteria: "",
      airdropStartDate: new Date(),
      airdropEndDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      distributionDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
      claimDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      token: {
        name: "",
        symbol: "",
        contractAddress: "",
        decimals: 18,
        blockchain: "",
      },
      tasks: [],
    })
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/save-airdrop', {  // Ensure this is the correct API route
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create airdrop');
      }
  
      const data = await response.json();
      console.log("Airdrop created:", data);
  
      alert("Airdrop created successfully!");
      resetForm();
    } catch (error) {
      console.error("Error creating airdrop:", error);
      alert("Failed to create airdrop. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Create New Airdrop</CardTitle>
          <CardDescription>Fill in the details to create a new crypto airdrop campaign</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
              <h3 className="text-lg font-medium">Basic Information</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="airdropId">Airdrop ID</Label>
                  <Input
                    id="airdropId"
                    name="airdropId"
                    value={formData.airdropId}
                    disabled
                    placeholder="Auto-generated UUID"
                  />
                  <p className="text-sm text-muted-foreground">Unique identifier for this airdrop (auto-generated)</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="airdropName">Airdrop Name</Label>
                  <Input
                    id="airdropName"
                    name="airdropName"
                    value={formData.airdropName}
                    onChange={handleChange}
                    placeholder="e.g., Project X Token Airdrop"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your airdrop campaign"
                  className="min-h-[100px]"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="websiteUrl">Website URL</Label>
                <Input
                  id="websiteUrl"
                  name="websiteUrl"
                  value={formData.websiteUrl}
                  onChange={handleChange}
                  placeholder="https://yourproject.com"
                  type="url"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="totalAirdropAmount">Total Airdrop Amount</Label>
                  <Input
                    id="totalAirdropAmount"
                    name="totalAirdropAmount"
                    value={formData.totalAirdropAmount}
                    onChange={handleNumberChange}
                    type="number"
                    min="0"
                    step="any"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tokensPerUser">Tokens Per User</Label>
                  <Input
                    id="tokensPerUser"
                    name="tokensPerUser"
                    value={formData.tokensPerUser}
                    onChange={handleNumberChange}
                    type="number"
                    min="0"
                    step="any"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="distributionMethod">Distribution Method</Label>
                <Select
                  onValueChange={(value: string) => handleSelectChange("distributionMethod", value)}
                  value={formData.distributionMethod}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select distribution method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="equal">Equal Distribution</SelectItem>
                    <SelectItem value="weighted">Weighted Distribution</SelectItem>
                    <SelectItem value="random">Random Distribution</SelectItem>
                    <SelectItem value="tiered">Tiered Distribution</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="eligibilityCriteria">Eligibility Criteria</Label>
                <Textarea
                  id="eligibilityCriteria"
                  name="eligibilityCriteria"
                  value={formData.eligibilityCriteria}
                  onChange={handleChange}
                  placeholder="Specify who can participate in this airdrop"
                  className="min-h-[80px]"
                  required
                />
                <p className="text-sm text-muted-foreground">
                  You can enter plain text or JSON format for complex criteria
                </p>
              </div>
            </div>

            <Separator />

            <div className="space-y-6">
              <h3 className="text-lg font-medium">Token Details</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="token.name">Token Name</Label>
                  <Input
                    id="token.name"
                    name="token.name"
                    value={formData.token.name}
                    onChange={handleChange}
                    placeholder="e.g., Ethereum"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="token.symbol">Token Symbol</Label>
                  <Input
                    id="token.symbol"
                    name="token.symbol"
                    value={formData.token.symbol}
                    onChange={handleChange}
                    placeholder="e.g., ETN"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="token.contractAddress">Token Contract Address</Label>
                <Input
                  id="token.contractAddress"
                  name="token.contractAddress"
                  value={formData.token.contractAddress}
                  onChange={handleChange}
                  placeholder="0x..."
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="token.decimals">Token Decimals</Label>
                  <Input
                    id="token.decimals"
                    name="token.decimals"
                    value={formData.token.decimals}
                    onChange={handleNumberChange}
                    type="number"
                    min="0"
                    max="18"
                    required
                  />
                  <p className="text-sm text-muted-foreground">Usually 18 for most ERC-20 tokens</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="token.blockchain">Blockchain/Network</Label>
                  <Select
                    onValueChange={(value: string) => handleSelectChange("token.blockchain", value)}
                    value={formData.token.blockchain}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select blockchain" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Sonic">Sonic</SelectItem>
                      <SelectItem value="ethereum">Ethereum</SelectItem>
                      <SelectItem value="binance">Binance Smart Chain</SelectItem>
                      <SelectItem value="polygon">Polygon</SelectItem>
                      <SelectItem value="solana">Solana</SelectItem>
                      <SelectItem value="avalanche">Avalanche</SelectItem>
                      <SelectItem value="arbitrum">Arbitrum</SelectItem>
                      <SelectItem value="optimism">Optimism</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-6">
              <h3 className="text-lg font-medium">Tasks</h3>

              {formData.tasks.map((task, index) => (
                <div key={task.taskId} className="flex items-center space-x-2">
                  <Input
                    placeholder="Task Name"
                    value={task.taskName}
                    onChange={(e: { target: { value: string } }) => handleTaskChange(index, "taskName", e.target.value)}
                    required
                  />
                  <Button type="button" variant="destructive" onClick={() => removeTask(index)}>
                    Remove
                  </Button>
                </div>
              ))}

              <Button type="button" onClick={addTask}>
                Add Task
              </Button>
            </div>

            <Separator />

            <div className="space-y-6">
              <h3 className="text-lg font-medium">Timeline</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="airdropStartDate">Airdrop Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant={"outline"} className="w-full pl-3 text-left font-normal">
                        {format(formData.airdropStartDate, "PPP")}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.airdropStartDate}
                        onSelect={(date: Date | undefined) => handleDateChange("airdropStartDate", date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="airdropEndDate">Airdrop End Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant={"outline"} className="w-full pl-3 text-left font-normal">
                        {format(formData.airdropEndDate, "PPP")}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.airdropEndDate}
                        onSelect={(date: Date | undefined) => handleDateChange("airdropEndDate", date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="distributionDate">Distribution Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant={"outline"} className="w-full pl-3 text-left font-normal">
                        {format(formData.distributionDate, "PPP")}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.distributionDate}
                        onSelect={(date: Date | undefined) => handleDateChange("distributionDate", date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="claimDeadline">Claim Deadline</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant={"outline"} className="w-full pl-3 text-left font-normal">
                        {format(formData.claimDeadline, "PPP")}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.claimDeadline}
                        onSelect={(date: Date | undefined) => handleDateChange("claimDeadline", date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <Button variant="outline" type="button" onClick={resetForm}>
                Reset
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Airdrop"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

