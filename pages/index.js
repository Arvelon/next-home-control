import Image from 'next/image'
import Graph from '../components/chart'
import { format } from 'date-fns'
import { getValue, setValue } from '@/config/firebase'

export default function Home({data, main}) {
  console.log(data)
  return (
    <main className="flex flex-col items-center justify-start">
      <div className="py-4 pt-8">
        <h1 className="text-center text-4xl">{data[data.length-1].temperature}°C</h1>
        <span>{parseInt((new Date().getTime() - parseInt(data[data.length-1].timestamp))/1000/60)} {parseInt((new Date().getTime() - parseInt(data[data.length-1].timestamp))/1000/60) == 1 ? " minute" : " minutes"} ago</span>
      </div>
      <div className="h-full w-full flex justify-center">
        <Graph dataset={data} />
      </div>
      <div>
        <button onClick={() => setValue('main', 'private', {last_porn: new Date().getTime()})}>I watched Porn ({})</button>
        <button onClick={() => setValue('main', 'private', {last_smoke: new Date().getTime()})}>I smoked</button>
        <button onClick={() => setValue('main', 'private', {last_weed: new Date().getTime()})}>I smoked weed</button>
        <button onClick={() => setValue('main', 'private', {last_masturbation: new Date().getTime()})}>I masturbated</button>
        <button onClick={() => setValue('main', 'private', {last_ejaculation: new Date().getTime()})}>I ejaculated</button>
      </div>
    </main>
  )
}
export const getServerSideProps = async () => {
  console.log(process.env.HOST + '/api/temperature')
  const res = await fetch(process.env.HOST + '/api/temperature')
  const main = await getValue('main', 'test')

  const data = await res.json()
  
  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch data')
  }
 
  return {
    props: {
      data,
      main
    },
    // revalidate: 60
  }
}