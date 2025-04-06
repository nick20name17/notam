import { AirTable } from './components/air-table/air-table'
import { airColumns } from './components/air-table/airt-columns'
import { GoogleForm } from './components/google-form/google-form'
import { News } from './components/news/news'
import { getSheetData } from '@/utils/google/sheet'

const HomePage = async () => {
  const data = await getSheetData()

  return (
    <>
      <AirTable
        data={data}
        columns={airColumns}
      />
      <GoogleForm />
      <News />
    </>
  )
}

export default HomePage
