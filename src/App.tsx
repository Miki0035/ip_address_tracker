import { useState } from "react";
import rightArrow from "./assets/images/icon-arrow.svg"

const App = () => {
  const ip_api = import.meta.env.VITE_IP_API
  const [IP, setIP] = useState("")
  const [ipData, setIpData] = useState({
    ipAddress: "",
    location: "",
    timezone: "",
    isp: "",
  })
  const handleIpTracking = async () => {

    const { ip, isp, location: { country, region, timezone } } = await getIpLocation()
    setIpData({
      ipAddress: ip,
      isp,
      timezone: `UTC ${timezone}`,
      location: `${country}, ${region}`
    })
  }

  // const validIp = () => {

  // }

  const getIpLocation = async () => {
    try {
      const response = await fetch(`https://geo.ipify.org/api/v2/country?apiKey=${ip_api}&ipAddress=${IP}`)
      const data = await response.json()
      return data
    } catch (e) {
      console.log("Error getting ip ", e)
    }
  }

  return (
    <main className="w-full flex flex-col justify-center items-center">
      <section className="w-full upper-section flex justify-center h-10vh">
        {/* Header and input container */}
        <div className="py-10 w-full  max-w-xl flex flex-col items-center gap-5">
          <h1 className="font-semibold  text-2xl text-white capitalize">
            IP Address Tracker
          </h1>
          <div className="w-full flex h-12 px-2">
            <input onChange={e => setIP(e.target.value)} className="w-full h-full rounded-tl-lg rounded-bl-lg  bg-white flex-4  py-1 px-2 placeholder:text-xs md:placeholder:text-md" type="text" name="" id="" placeholder="Search for any IP address or domain" />
            <button onClick={handleIpTracking} className="h-full py-3 w-15 flex justify-center items-center bg-black rounded-tr-lg rounded-br-lg hover:cursor-pointer ">
              <img src={rightArrow} alt="forward arrow" className=" w-5 h-5" />
            </button>
          </div>

        </div>
      </section>

      <section className="w-full h-full">

      </section>

      {/* IMPLEMENT ANSWER MODAL */}

      {
        ipData && (
          <div className="absolute top-50 left-50 bg-white rounded-lg">
            <div className="w-full flex flex-col items-center gap-4  w-45 h-full">
              {
                [{ label: "ip address", value: ipData.ipAddress }, { label: "location", value: ipData.location }, { label: "timezone", value: ipData.timezone }, { label: "isp", value: ipData.isp }].map(({ label, value }) => (
                  <div key={value} className="w-full flex flex-col items-center justify-center">
                    <h2 className="uppercase font-light text-xs">{label}</h2>
                    <p className="font-bold text-lg">{value}</p>
                  </div>
                ))
              }

            </div>

          </div>
        )
      }



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
