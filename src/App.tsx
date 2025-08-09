import { useEffect, useState } from "react";
import 'leaflet/dist/leaflet.css'
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import rightArrow from "./assets/images/icon-arrow.svg"
import marker from "./assets/images/icon-location.svg"
import { Icon } from "leaflet";
import { PuffLoader } from "react-spinners";
import ReCenterMap from "./components/ReCenterMap"
import { isValidIP } from "./util";


type IPData = {
  ipAddress: string | "",
  location: string | "",
  timezone: string | "",
  isp: string | "",
}

type GeoData = {
  latitude: number
  longitude: number
}

const CustomIcon = new Icon({
  iconUrl: marker,
  iconSize: [38, 50]
})

const App = () => {

  const ip_api = import.meta.env.VITE_IP_API
  const [IP, setIP] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [ipData, setIpData] = useState<IPData | null>(null)
  const [geoLocation, setGeoLocation] = useState<GeoData>({
    latitude: 51.505,
    longitude: -0.09
  })

  const [error, setError] = useState("")
  const [warn, setWarn] = useState("")

  const handleIpTracking = async () => {
    if (!isValidIP(IP)) {
      setError("Invalid IP address, try another value 🤔 ")
      return;
    }
    setError("")
    try {
      await getIpLocation()
    } catch (e) {
      console.error(`something went wrong`, e)
    } finally {
      setIsLoading(false)
    }
  }



  const getIpLocation = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`https://geo.ipify.org/api/v2/country?apiKey=${ip_api}&ipAddress=${IP}`)
      const data = await response.json()
      const { ip, isp, location: { country, region, timezone } } = data
      setIpData({
        ipAddress: ip,
        isp,
        timezone: `UTC ${timezone}`,
        location: `${country}, ${region}`
      })
      await getGeoLocation(ip)
    } catch (e) {
      console.error("something went wrong ", e)
    }
  }

  const getGeoLocation = async (ip: string) => {
    try {
      const response = await fetch(`https://ipwho.is/${ip}?fields=latitude,longitude`)
      const data = await response.json()
      console.log(`data`, data)

      const { latitude, longitude } = data
      if (latitude === undefined || longitude === undefined) {
        setWarn("Can't find geographical location, sorry 😢 ")
        return
      }
      setGeoLocation({
        latitude,
        longitude
      })
      setWarn("")
    } catch (e) {
      console.error('something went wrong', e)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getIpLocation()
  }, [])

  return (
    <main className="w-full flex flex-col justify-center items-center">
      <section className="w-full upper-section flex justify-center h-10vh ">
        {/* Header and input container */}
        <div className="py-10 w-full  max-w-2xl flex flex-col items-center justify-center gap-5">
          <h1 className="font-semibold  text-2xl text-white capitalize lg:text-3xl xl:mb-2">
            IP Address Tracker
          </h1>
          <div className="w-full flex h-12 lg:h-14 px-2">
            <input onChange={e => setIP(e.target.value)} className="w-full outline-none h-full rounded-tl-lg rounded-bl-lg  bg-white flex-4  py-1 px-5 placeholder:text-xs md:placeholder:text-md xl:placeholder:text-lg  lg:hover:cursor-pointer xl:text-xl " placeholder="Search for any IP address or domain" />
            <button onClick={handleIpTracking} className="h-full py-3 w-15  flex justify-center items-center bg-black rounded-tr-xl rounded-br-xl hover:cursor-pointer lg:hover:bg-dark-gray  transition-all ease-in-out xl:w-20  ">
              <img src={rightArrow} alt="forward arrow" className=" w-5 h-5" />
            </button>
          </div>
          {
            error && (<span className="text-red-500 text-md lg:text-xl">{error}</span>)
          }

          {
            warn && (<span className="text-yellow-500 text-md lg:text-xl">{warn}</span>)
          }

        </div>
      </section>

      {/* IMPLEMENT ANSWER MODAL */}
      {
        isLoading && (
          <PuffLoader size={70} className="absolute top-0 mx-auto w-72 z-1000 lg:w-1/2" />
        )
      }

      {
        ipData !== null && !isLoading && (
          <div className="absolute top-70 mx-auto w-72 z-1000 lg:w-1/2">
            <div className="w-full rounded-lg  bg-white flex flex-col items-center gap-4 py-5 px-2  h-full lg:flex-row  lg:px-5 ">
              {
                [{ label: "ip address", value: ipData.ipAddress }, { label: "location", value: ipData.location }, { label: "timezone", value: ipData.timezone }, { label: "isp", value: ipData.isp }].map(({ label, value }, index) => (
                  <div key={index} className={`w-full flex flex-col items-center justify-center lg:items-start ${index !== 3 && 'lg:border-r-1 lg:border-gray-200'}`}>
                    <h2 className="uppercase font-light text-xs ">{label}</h2>
                    <p className="font-bold text-lg ">{value}</p>
                  </div>
                ))
              }

            </div>

          </div>
        )
      }


      <MapContainer className="w-full h-screen" center={[geoLocation.latitude, geoLocation.longitude]} zoom={13} scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ReCenterMap lat={geoLocation.latitude} lon={geoLocation.longitude} />
        {
          ipData !== null && (
            <Marker icon={CustomIcon} position={[geoLocation.latitude, geoLocation.longitude]}>
              <Popup className="text-2xl">
                {ipData?.location}
              </Popup>
            </Marker>
          )
        }

      </MapContainer>
    </main>
  );
};

export default App;
