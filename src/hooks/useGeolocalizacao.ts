import { useState, useEffect } from "react";
import { Errors } from "@/types/cadastro";

export function useGeolocalizacao() {
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [erro, setErro] = useState<Errors>({});

  const obterLocalizacao = () => {
    if (!navigator.geolocation) {
      setErro((e) => ({
        ...e,
        localizacao: "Geolocalização não é suportada pelo seu navegador",
      }));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLatitude(pos.coords.latitude);
        setLongitude(pos.coords.longitude);
        setErro((e) => ({ ...e, localizacao: undefined }));
      },
      () =>
        setErro((e) => ({
          ...e,
          localizacao: "Permissão negada para obter a localização",
        })),
    );
  };

  useEffect(() => {
    obterLocalizacao();
  }, []);

  return { latitude, longitude, erro, obterLocalizacao };
}
