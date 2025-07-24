"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Share2,
  Heart,
  Plus,
  Search,
  Bell,
  Settings,
} from "lucide-react"
import { Bar, BarChart, Line, LineChart, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const trafficData = [
  { date: "24 Jun", value: 12 },
  { date: "26 Jun", value: 15 },
  { date: "28 Jun", value: 8 },
  { date: "30 Jun", value: 18 },
  { date: "02 Jul", value: 22 },
  { date: "04 Jul", value: 25 },
  { date: "06 Jul", value: 20 },
  { date: "08 Jul", value: 35 },
  { date: "10 Jul", value: 45 },
  { date: "12 Jul", value: 38 },
  { date: "14 Jul", value: 52 },
  { date: "16 Jul", value: 48 },
  { date: "18 Jul", value: 65 },
  { date: "20 Jul", value: 58 },
  { date: "22 Jul", value: 72 },
  { date: "24 Jul", value: 68 },
]

const revenueData = [
  { date: "Week 1", value: 3200 },
  { date: "Week 2", value: 3800 },
  { date: "Week 3", value: 4100 },
  { date: "Week 4", value: 4300 },
]

const clientsData = [
  { date: "Week 1", value: 5200 },
  { date: "Week 2", value: 5800 },
  { date: "Week 3", value: 6200 },
  { date: "Week 4", value: 6782 },
]

const usersData = [
  { date: "Mon", value: 2100 },
  { date: "Tue", value: 2300 },
  { date: "Wed", value: 2800 },
  { date: "Thu", value: 2600 },
  { date: "Fri", value: 2986 },
  { date: "Sat", value: 2400 },
  { date: "Sun", value: 2200 },
]

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      {/* Header */}
      <header className="bg-white border-b border-green-100 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-sm"></div>
              </div>
              <span className="text-xl font-semibold text-slate-800">tabler</span>
            </div>
            <nav className="flex items-center space-x-6">
              <a href="#" className="text-slate-600 hover:text-green-600 font-medium border-b-2 border-green-500 pb-1">
                Home
              </a>
              <a href="#" className="text-slate-500 hover:text-green-600">
                Interface
              </a>
              <a href="#" className="text-slate-500 hover:text-green-600">
                Form elements
              </a>
              <a href="#" className="text-slate-500 hover:text-green-600">
                Extra
              </a>
              <a href="#" className="text-slate-500 hover:text-green-600">
                Layout
              </a>
              <a href="#" className="text-slate-500 hover:text-green-600">
                Plugins
              </a>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="text-slate-600 hover:text-teal-600">
              <Search className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-slate-600 hover:text-teal-600">
              <Bell className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-slate-600 hover:text-teal-600">
              <Settings className="w-4 h-4" />
            </Button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-green-500 rounded-full"></div>
              <span className="text-sm text-slate-600">Pavel Kuna</span>
            </div>
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-sm text-slate-500 uppercase tracking-wide">OVERVIEW</p>
            <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" className="border-green-200 text-green-700 hover:bg-green-50 bg-transparent">
              New view
            </Button>
            <Button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Create new report
            </Button>
          </div>
        </div>

        {/* Main Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Sales */}
          <Card className="border-green-100 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-slate-600">SALES</CardTitle>
                <span className="text-xs text-slate-400">Last 7 days</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-3xl font-bold text-slate-800">75%</div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Conversion rate</span>
                    <div className="flex items-center text-emerald-600">
                      <span className="font-medium">7%</span>
                      <TrendingUp className="w-3 h-3 ml-1" />
                    </div>
                  </div>
                  <Progress value={75} className="h-2 bg-green-100" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Revenue */}
          <Card className="border-green-100 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-slate-600">REVENUE</CardTitle>
                <span className="text-xs text-slate-400">Last 7 days</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="text-3xl font-bold text-slate-800">$4,300</div>
                  <div className="flex items-center text-emerald-600">
                    <span className="text-sm font-medium">8%</span>
                    <TrendingUp className="w-3 h-3 ml-1" />
                  </div>
                </div>
                <div className="h-12">
                  <ChartContainer
                    config={{
                      value: {
                        label: "Revenue",
                        color: "rgb(34 197 94)",
                      },
                    }}
                    className="h-full w-full"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={revenueData}>
                        <Line type="monotone" dataKey="value" stroke="rgb(34 197 94)" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* New Clients */}
          <Card className="border-green-100 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-slate-600">NEW CLIENTS</CardTitle>
                <span className="text-xs text-slate-400">Last 7 days</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="text-3xl font-bold text-slate-800">6,782</div>
                  <div className="flex items-center text-amber-600">
                    <span className="text-sm font-medium">0%</span>
                    <TrendingDown className="w-3 h-3 ml-1" />
                  </div>
                </div>
                <div className="h-12">
                  <ChartContainer
                    config={{
                      value: {
                        label: "Clients",
                        color: "rgb(34 197 94)",
                      },
                    }}
                    className="h-full w-full"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={clientsData}>
                        <Line type="monotone" dataKey="value" stroke="rgb(34 197 94)" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Active Users */}
          <Card className="border-green-100 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-slate-600">ACTIVE USERS</CardTitle>
                <span className="text-xs text-slate-400">Last 7 days</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="text-3xl font-bold text-slate-800">2,986</div>
                  <div className="flex items-center text-emerald-600">
                    <span className="text-sm font-medium">4%</span>
                    <TrendingUp className="w-3 h-3 ml-1" />
                  </div>
                </div>
                <div className="h-12">
                  <ChartContainer
                    config={{
                      value: {
                        label: "Users",
                        color: "rgb(34 197 94)",
                      },
                    }}
                    className="h-full w-full"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={usersData}>
                        <Bar dataKey="value" fill="rgb(34 197 94)" radius={[2, 2, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-green-100 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-slate-800">132 Sales</div>
                  <div className="text-sm text-slate-500">12 waiting payments</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-100 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                  <ShoppingCart className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-slate-800">78 Orders</div>
                  <div className="text-sm text-slate-500">32 shipped</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-100 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-green-700 to-green-800 rounded-lg flex items-center justify-center">
                  <Share2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-slate-800">623 Shares</div>
                  <div className="text-sm text-slate-500">16 today</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-100 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-green-700 rounded-lg flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-slate-800">132 Likes</div>
                  <div className="text-sm text-slate-500">21 today</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Traffic Summary */}
          <Card className="border-green-100 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-800">Traffic summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ChartContainer
                  config={{
                    value: {
                      label: "Traffic",
                      color: "rgb(34 197 94)",
                    },
                  }}
                  className="h-full w-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={trafficData}>
                      <XAxis
                        dataKey="date"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: "#64748b" }}
                      />
                      <YAxis hide />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="value" fill="rgb(34 197 94)" radius={[2, 2, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>

          {/* Locations */}
          <Card className="border-green-100 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-800">Locations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-green-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <div className="w-8 h-8 bg-white rounded-full"></div>
                  </div>
                  <p className="text-slate-600">World Map Visualization</p>
                  <p className="text-sm text-slate-400">Interactive map would be displayed here</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Storage */}
          <Card className="border-green-100 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Using Storage</span>
                  <span className="font-medium text-slate-800">6854.45 MB of 8 GB</span>
                </div>
                <div className="space-y-2">
                  <Progress value={85} className="h-3 bg-slate-100" />
                  <div className="flex space-x-1">
                    <div className="h-2 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex-1"></div>
                    <div className="h-2 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full w-16"></div>
                    <div className="h-2 bg-gradient-to-r from-green-400 to-green-500 rounded-full w-8"></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Development Activity */}
          <Card className="border-green-100 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-800">Development activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-slate-600">Updated dashboard components</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <span className="text-sm text-slate-600">Fixed responsive layout issues</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  <span className="text-sm text-slate-600">Added new chart visualizations</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
