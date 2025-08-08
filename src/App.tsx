import { useEffect, useState } from "react";
import 'leaflet/dist/leaflet.css'
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import rightArrow from "./assets/images/icon-arrow.svg"
import marker from "./assets/images/icon-location.svg"
import { Icon } from "leaflet";
import { PuffLoader } from "react-spinners";

type IPData = {
  ipAddress: string | "",
  location: string | "",
  timezone: string | "",
  isp: string | "",
}

type GeoData = {
  lat: number
  lon: number
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
    lat: 51.505,
    lon: -0.09
  })

  // Map

  const handleIpTracking = async () => {
    try {
      await getIpLocation()
    } catch (e) {
      console.log(`something went wrong`)
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
      console.log("Error getting ip ", e)
    }
  }

  const getGeoLocation = async (ip: string) => {
    console.log(`getting geo location`)
    try {
      const response = await fetch(`http://ip-api.com/json/${ip}?fields=lat,lon`)
      const data = await response.json()
      const { lat, lon } = data
      setGeoLocation({
        lat,
        lon
      })
      console.log(`geo location ${lon}`)
    } catch (e) {
      console.log('error getting geo location', e)
    }
  }

  useEffect(() => {
    getIpLocation()
  }, [])

  return (
    <main className="w-full flex flex-col justify-center items-center">
      <section className="w-full upper-section flex justify-center h-10vh">
        {/* Header and input container */}
        <div className="py-10 w-full  max-w-xl flex flex-col items-center gap-5">
          <h1 className="font-semibold  text-2xl text-white capitalize">
            IP Address Tracker
          </h1>
          <div className="w-full flex h-12 px-2">
            <input onChange={e => setIP(e.target.value)} className="w-full outline-none h-full rounded-tl-lg rounded-bl-lg  bg-white flex-4  py-1 px-2 placeholder:text-xs md:placeholder:text-md  lg:hover:cursor-pointer" type="text" name="" id="" placeholder="Search for any IP address or domain" />
            <button onClick={handleIpTracking} className="h-full py-3 w-15 flex justify-center items-center bg-black rounded-tr-lg rounded-br-lg hover:cursor-pointer lg:hover:bg-dark-gray transition-all ease-in-out  ">
              <img src={rightArrow} alt="forward arrow" className=" w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* IMPLEMENT ANSWER MODAL */}

      {
        isLoading && (
          <PuffLoader size={50} className="absolute top-0 mx-auto w-72 z-1000 lg:w-1/2" />
        )
      }

      {
        ipData !== null && !isLoading && (
          <div className="absolute top-50 mx-auto w-72 z-1000 lg:w-1/2">
            <div className="w-full rounded-lg  bg-white flex flex-col items-center gap-4 py-5 px-2  h-full lg:flex-row lg:py-10 lg:px-5 ">
              {
                [{ label: "ip address", value: ipData.ipAddress }, { label: "location", value: ipData.location }, { label: "timezone", value: ipData.timezone }, { label: "isp", value: ipData.isp }].map(({ label, value }, index) => (
                  <div key={index} className={`w-full flex flex-col items-center justify-center lg:items-start ${index !== 3 && 'lg:border-r-1 lg:border-gray-200'}`}>
                    <h2 className="uppercase font-light text-xs">{label}</h2>
                    <p className="font-bold text-lg">{value}</p>
                  </div>
                ))
              }

            </div>

          </div>
        )
      }


      <MapContainer className="w-full h-screen" center={[geoLocation.lat, geoLocation.lon]} zoom={13} scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {
          ipData !== null && (
            <Marker icon={CustomIcon} position={[geoLocation.lat, geoLocation.lon]}>
              <Popup>
                {ipData?.location}
              </Popup>
            </Marker>
          )
        }

      </MapContainer>



      {/* <!-- add offset value dynamically using the API --> */}
      {/* <div className="attribution">
        Challenge by{" "}
        <a href="https://www.frontendmentor.io?ref=challenge" target="_blank">
          Frontend Mentor
        </a>
        . Coded by <a href="#">Your Name Here</a>.
      </div> */}
    </main>
  );
};

export default App;
