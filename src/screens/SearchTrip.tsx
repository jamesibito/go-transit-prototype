import { useNav } from '../App'
import NavHeader from '../components/NavHeader'
import SearchForm from '../components/SearchForm'
import TripCard from '../components/TripCard'
import { getRouteKeyFromStations } from '../data/trips'

const history = [
  { from: 'Miliken GO', to: 'Union Station GO', line: 'Stouffville', type: 'train' as const },
  { from: 'Union Station GO', to: 'Oshawa GO', line: 'Lakeshore East', type: 'train' as const },
  { from: 'Union Station GO', to: 'Aurora GO', line: 'Barrie', type: 'train' as const },
  { from: 'Union Station GO', to: 'Burlington GO', line: 'Lakeshore West', type: 'train' as const },
]

export default function SearchTrip() {
  const { navigate, setSelectedRoute } = useNav()

  const handleHistoryClick = (from: string, to: string) => {
    const key = getRouteKeyFromStations(from, to)
    setSelectedRoute(key)
    navigate('results')
  }

  return (
    <div className="min-h-full" style={{ background: 'var(--surface-primary)' }}>
      <NavHeader title="Search Schedule" showBack />

      <div className="px-5">
        <SearchForm fromValue="" toValue="" />

        <button
          className="pressable w-full mt-4 py-4 rounded-2xl text-white font-bold text-lg"
          style={{ background: '#357a1e', fontSize: 16, fontWeight: 800, fontFamily: 'inherit', boxShadow: '0 4px 16px rgba(53,122,30,0.3)' }}
          onClick={() => {
            setSelectedRoute('stouffville')
            navigate('results')
          }}
        >
          See Schedule
        </button>
      </div>

      <div className="px-5 pt-6">
        <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'inherit', marginBottom: 12, letterSpacing: '-0.3px' }}>
          History
        </h2>
        <div className="flex flex-col gap-2.5">
          {history.map((trip, i) => (
            <TripCard
              key={i}
              {...trip}
              onClick={() => handleHistoryClick(trip.from, trip.to)}
            />
          ))}
        </div>
      </div>
      <div className="h-8" />
    </div>
  )
}
