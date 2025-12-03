"use client"

import { useState } from "react"

import dynamic from "next/dynamic"

import { Map, MapPin, School, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"

// Dynamically import the map component to avoid SSR issues
const MapWithNoSSR = dynamic(() => import("@/components/ui/map"), {
  ssr: false,
})

export function SchoolCoverageMap() {
  const [coverageRadius, setCoverageRadius] = useState<number>(5) // Default 5km radius
  const [showCoverage, setShowCoverage] = useState<boolean>(true)
  const [showUnserved, setShowUnserved] = useState<boolean>(true)

  // Mock data - replace with real data from your API
  const schools = [
    { id: 1, name: "Primary School A", lat: -13.9626, lng: 33.7741 },
    { id: 2, name: "Secondary School B", lat: -13.9675, lng: 33.7878 },
  ]

  // Mock data for unserved communities
  const unservedCommunities = [
    { id: 1, name: "Community X", lat: -13.955, lng: 33.785, population: 2500 },
    { id: 2, name: "Village Y", lat: -13.97, lng: 33.76, population: 1800 },
  ]

  // Calculate statistics
  const totalSchools = schools.length
  const totalUnservedCommunities = unservedCommunities.length
  const totalPopulationUnserved = unservedCommunities.reduce(
    (sum, community) => sum + community.population,
    0
  )

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Schools Mapped
            </CardTitle>
            <School className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSchools}</div>
            <p className="text-muted-foreground text-xs">
              Total schools in the system
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Unserved Communities
            </CardTitle>
            <Users className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUnservedCommunities}</div>
            <p className="text-muted-foreground text-xs">
              Communities without school access
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Population Unserved
            </CardTitle>
            <Users className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalPopulationUnserved.toLocaleString()}
            </div>
            <p className="text-muted-foreground text-xs">
              People without school access
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Coverage Radius
            </CardTitle>
            <MapPin className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{coverageRadius} km</div>
            <p className="text-muted-foreground text-xs">
              School coverage distance
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Coverage Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-sm font-medium">
                    Coverage Radius: {coverageRadius} km
                  </label>
                </div>
                <Slider
                  min={1}
                  max={20}
                  step={1}
                  value={[coverageRadius]}
                  onValueChange={(value) => setCoverageRadius(value[0])}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="showCoverage"
                    checked={showCoverage}
                    onChange={(e) => setShowCoverage(e.target.checked)}
                    className="text-primary focus:ring-primary h-4 w-4 rounded border-gray-300"
                  />
                  <label htmlFor="showCoverage" className="text-sm font-medium">
                    Show coverage areas
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="showUnserved"
                    checked={showUnserved}
                    onChange={(e) => setShowUnserved(e.target.checked)}
                    className="text-primary focus:ring-primary h-4 w-4 rounded border-gray-300"
                  />
                  <label htmlFor="showUnserved" className="text-sm font-medium">
                    Show unserved communities
                  </label>
                </div>
              </div>
              <Button className="w-full" onClick={() => {}}>
                <Map className="mr-2 h-4 w-4" />
                Generate Report
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Accessibility Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="mb-2 text-sm font-medium">
                    Within {coverageRadius}km coverage:
                  </h4>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground text-sm">
                        Communities served:
                      </span>
                      <span className="font-medium">24</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground text-sm">
                        Population covered:
                      </span>
                      <span className="font-medium">12,450</span>
                    </div>
                  </div>
                </div>
                <div className="bg-border h-px" />
                <div>
                  <h4 className="mb-2 text-sm font-medium">
                    Outside {coverageRadius}km coverage:
                  </h4>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground text-sm">
                        Communities unserved:
                      </span>
                      <span className="text-destructive font-medium">
                        {totalUnservedCommunities}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground text-sm">
                        Population unserved:
                      </span>
                      <span className="text-destructive font-medium">
                        {totalPopulationUnserved.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-3">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>School Coverage Map</CardTitle>
            </CardHeader>
            <CardContent className="h-[600px] p-0">
              <div className="h-full w-full">
                <MapWithNoSSR
                  center={[-13.9626, 33.7741]} // Default to Malawi coordinates
                  zoom={12}
                  schools={schools}
                  unservedCommunities={showUnserved ? unservedCommunities : []}
                  coverageRadius={showCoverage ? coverageRadius * 1000 : 0} // Convert km to meters
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
