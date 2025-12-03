"use client"

import { useEffect, useState } from "react"

import { AlertCircle, MapPin, TrendingUp } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"

interface GapAnalysisResult {
  place_id: number
  place_type: string
  place_geom: unknown
  longitude: number
  latitude: number
  distance_meters: number
  area_sqkm: number
  priority_score: number
  priority_level: "critical" | "high" | "medium" | "low"
}

const priorityColors = {
  critical: "bg-red-500",
  high: "bg-orange-500",
  medium: "bg-yellow-500",
  low: "bg-blue-500",
}

const priorityBadgeVariants = {
  critical: "destructive",
  high: "default",
  medium: "secondary",
  low: "outline",
} as const

export default function GapAnalysisPage() {
  const [data, setData] = useState<GapAnalysisResult[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [maxDistance, setMaxDistance] = useState("10000")
  const [limit, setLimit] = useState("50")

  const fetchGapAnalysis = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(
        `/api/gap-analysis?maxDistance=${maxDistance}&limit=${limit}`
      )
      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || "Failed to fetch data")
      }

      setData(result.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchGapAnalysis()
  }, [])

  const stats = {
    total: data.length,
    critical: data.filter((d) => d.priority_level === "critical").length,
    high: data.filter((d) => d.priority_level === "high").length,
    avgDistance:
      data.length > 0
        ? (
            data.reduce((sum, d) => sum + d.distance_meters, 0) /
            data.length /
            1000
          ).toFixed(2)
        : "0",
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Gap Analysis & Priority Ranking
        </h1>
        <p className="text-muted-foreground">
          Identify underserved populated places and prioritize locations for new
          schools
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Analysis Parameters</CardTitle>
          <CardDescription>
            Adjust parameters to refine the gap analysis
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          <div className="min-w-[200px] flex-1">
            <Label htmlFor="maxDistance">Max Distance (meters)</Label>
            <Select value={maxDistance} onValueChange={setMaxDistance}>
              <SelectTrigger id="maxDistance">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5000">5 km</SelectItem>
                <SelectItem value="10000">10 km</SelectItem>
                <SelectItem value="15000">15 km</SelectItem>
                <SelectItem value="20000">20 km</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="min-w-[200px] flex-1">
            <Label htmlFor="limit">Results Limit</Label>
            <Select value={limit} onValueChange={setLimit}>
              <SelectTrigger id="limit">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
                <SelectItem value="200">200</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end">
            <Button onClick={fetchGapAnalysis} disabled={loading}>
              {loading ? "Analyzing..." : "Run Analysis"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      {!loading && !error && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Underserved Places
              </CardTitle>
              <MapPin className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-muted-foreground text-xs">
                Places beyond 5km from schools
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Critical Priority
              </CardTitle>
              <AlertCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.critical}</div>
              <p className="text-muted-foreground text-xs">
                Require immediate attention
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                High Priority
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.high}</div>
              <p className="text-muted-foreground text-xs">
                Need planning consideration
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Avg Distance
              </CardTitle>
              <MapPin className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.avgDistance} km</div>
              <p className="text-muted-foreground text-xs">To nearest school</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Results Table */}
      <Card>
        <CardHeader>
          <CardTitle>Priority Ranking</CardTitle>
          <CardDescription>
            Populated places ranked by priority score (distance + settlement
            size)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : (
            <ScrollArea className="h-[600px]">
              <div className="space-y-2">
                {data.map((place, index) => (
                  <div
                    key={place.place_id}
                    className="hover:bg-accent flex items-center gap-4 rounded-lg border p-4"
                  >
                    <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-full font-bold">
                      {index + 1}
                    </div>

                    <div
                      className={`h-full w-1 rounded ${priorityColors[place.priority_level]}`}
                    />

                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">
                          Place ID: {place.place_id}
                        </span>
                        <Badge
                          variant={priorityBadgeVariants[place.priority_level]}
                        >
                          {place.priority_level.toUpperCase()}
                        </Badge>
                        <Badge variant="outline">{place.place_type}</Badge>
                      </div>
                      <div className="text-muted-foreground text-sm">
                        Distance: {(place.distance_meters / 1000).toFixed(2)} km
                        • Area: {place.area_sqkm} km² • Coordinates:{" "}
                        {place.latitude.toFixed(4)},{" "}
                        {place.longitude.toFixed(4)}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-2xl font-bold">
                        {place.priority_score}
                      </div>
                      <div className="text-muted-foreground text-xs">
                        Priority Score
                      </div>
                    </div>
                  </div>
                ))}

                {data.length === 0 && !loading && (
                  <div className="text-muted-foreground py-12 text-center">
                    No underserved places found with current parameters
                  </div>
                )}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
