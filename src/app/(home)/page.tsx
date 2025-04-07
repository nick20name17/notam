import { AirTable } from './components/air-table/air-table'
import { airColumns } from './components/air-table/airt-columns'
import { airPortColumns } from './components/airport-table/airport-columns'
import { AirPortTable } from './components/airport-table/airport-table'
import { GoogleForm } from './components/google-form/google-form'
import { News } from './components/news/news'
import { AirInfo, AirportInfo } from '@/types/table'
import { getSheetData } from '@/utils/google/sheet'

function getLocationCounts(data: AirInfo[]): AirportInfo[] {
  const locationCounts: Record<string, number> = {}

  data.forEach((item: AirInfo) => {
    const location = item.location

    if (location) {
      if (locationCounts[location]) {
        locationCounts[location]++
      } else {
        locationCounts[location] = 1
      }
    }
  })

  const result: AirportInfo[] = Object.keys(locationCounts).map(
    (location, index) => ({
      id: (index + 1).toString(),
      location: location,
      count: locationCounts[location]
    })
  )

  result.sort((a, b) => b.count - a.count)

  return result
}

const HomePage = async () => {
  const data = await getSheetData()

  const groupedByLocation = getLocationCounts(data)

  return (
    <>
      <AirTable
        data={data}
        columns={airColumns}
      />
      <AirPortTable
        data={groupedByLocation}
        columns={airPortColumns}
      />
      <GoogleForm />
      <News />
    </>
  )
}

export default HomePage
