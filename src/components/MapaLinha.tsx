"use client";
import {
  MapContainer,
  TileLayer,
  Polyline,
  Marker,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";

const defaultIcon = new L.Icon({
  iconUrl: "/leaflet/marker-icon.png",
  iconRetinaUrl: "/leaflet/marker-icon-2x.png",
  shadowUrl: "/leaflet/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function AjustarMapa({
  rota,
  pontoCasa,
}: {
  rota: { lat: number; lng: number }[];
  pontoCasa?: { lat: number; lng: number };
}) {
  const map = useMap();
  useEffect(() => {
    if (rota.length > 0) {
      const bounds = L.latLngBounds(rota.map((p) => [p.lat, p.lng]));
      if (pontoCasa) bounds.extend([pontoCasa.lat, pontoCasa.lng]);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [rota, pontoCasa, map]);
  return null;
}

export default function MapaLinha({
  rota,
  pontoCasa,
  tipoMapa,
}: {
  rota: { lat: number; lng: number }[];
  pontoCasa?: { lat: number; lng: number };
  tipoMapa: "mapa" | "satelite";
}) {
  const urlTile =
    tipoMapa === "mapa"
      ? "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      : "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
  return (
    <MapContainer
      center={pontoCasa || [0, 0]}
      zoom={13}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer url={urlTile} />
      {rota.length > 0 && <Polyline positions={rota} color="blue" />}
      {pontoCasa && <Marker position={pontoCasa} icon={defaultIcon} />}
      <AjustarMapa rota={rota} pontoCasa={pontoCasa} />
    </MapContainer>
  );
}
