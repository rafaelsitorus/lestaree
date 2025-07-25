import { NextResponse } from 'next/server'
import { getIslandConfig } from '@/lib/mapConfig'

export async function GET(
  request: Request,
  { params }: { params: { island: string } }
) {
  try {
    const { island } = params
    const config = getIslandConfig(island)

    if (!config) {
      return NextResponse.json(
        { error: 'Island not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      island,
      name: config.name,
      center: config.center,
      zoom: config.zoom,
      areas: config.areas
    })

  } catch (error) {
    console.error('Error fetching areas:', error)
    return NextResponse.json(
      { error: 'Failed to fetch areas' },
      { status: 500 }
    )
  }
}