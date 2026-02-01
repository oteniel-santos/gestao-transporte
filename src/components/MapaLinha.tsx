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
import { useEffect, useState } from "react";

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
  if (!pontoCasa) return null;

  const [mapaAtivo, setMapaAtivo] = useState(false);

  const urlTile =
    tipoMapa === "mapa"
      ? "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      : "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";

  return (
    <div className="relative w-full h-full">
      {/* OVERLAY */}
      {!mapaAtivo && (
        <div
          onClick={() => setMapaAtivo(true)}
          className="
          absolute inset-0 z-10
          flex items-center justify-center
          bg-black/30
          text-white text-sm font-medium
          cursor-pointer
          select-none
        "
        >
          👆 Toque no mapa para mover
        </div>
      )}

      <MapContainer
        center={pontoCasa}
        zoom={13}
        className="w-full h-full"
        scrollWheelZoom={mapaAtivo}
        dragging={mapaAtivo}
        doubleClickZoom={mapaAtivo}
        touchZoom={mapaAtivo}
        boxZoom={mapaAtivo}
        keyboard={mapaAtivo}
      >
        {urlTile && <TileLayer url={urlTile} />}
        {rota.length > 0 && (
          <Polyline positions={rota.map((p) => [p.lat, p.lng])} color="blue" />
        )}
        <Marker position={[pontoCasa.lat, pontoCasa.lng]} icon={defaultIcon} />

        <AjustarMapa rota={rota} pontoCasa={pontoCasa} />
      </MapContainer>
    </div>
  );
}
