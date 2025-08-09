import { useEffect } from "react";
import { useMap } from "react-leaflet/hooks";

const ReCenterMap = ({ lat, lon }: { lat: number, lon: number }) => {
    const map = useMap();
    useEffect(() => {
        map.setView([lat, lon])
    }, [lat, lon, map])
    return null;
}


export default ReCenterMap