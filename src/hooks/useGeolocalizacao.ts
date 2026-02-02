import { useState, useEffect } from "react";
import { Errors } from "@/types/cadastro";

export function useGeolocalizacao() {
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [erro, setErro] = useState<Errors>({});
  const [tentouAutomatico, setTentouAutomatico] = useState(false);
  const [carregando, setCarregando] = useState(false);

  // função para obter a localização rápida
  const obterLocalizacao = (automatico = false) => {
    if (automatico) setTentouAutomatico(true);
    setCarregando(true);

    if (!navigator.geolocation) {
      setErro((e) => ({
        ...e,
        localizacao: "Geolocalização não suportada pelo seu navegador",
      }));
      setCarregando(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLatitude(pos.coords.latitude);
        setLongitude(pos.coords.longitude);
        setErro((e) => ({ ...e, localizacao: undefined }));
        setCarregando(false);
      },
      (err) => {
        let msg = "";
        switch (err.code) {
          case err.PERMISSION_DENIED:
            msg = "Permissão negada para obter a localização";
            break;
          case err.POSITION_UNAVAILABLE:
            msg = "Localização não disponível";
            break;
          case err.TIMEOUT:
            msg = "Tempo esgotado para obter localização";
            break;
          default:
            msg = "Erro ao obter localização";
        }
        setErro((e) => ({ ...e, localizacao: msg }));
        setCarregando(false);
      },
      {
        enableHighAccuracy: true, // ainda usa GPS
        timeout: 10000, // 10s é rápido
        maximumAge: 0, // não pega posição antiga
      },
    );
  };

  // chama automaticamente ao montar o hook
  useEffect(() => {
    obterLocalizacao(true);
  }, []);

  // atualizar posição manual (arrastando marcador)
  const atualizarPosicaoManual = (lat: number, lng: number) => {
    setLatitude(lat);
    setLongitude(lng);
  };

  return {
    latitude,
    longitude,
    erro,
    atualizarPosicaoManual,
    obterLocalizacao,
    localizacaoErro: erro.localizacao,
    tentouAutomatico,
    carregando,
  };
}

// import { useState, useEffect } from "react";
// import { Errors } from "@/types/cadastro";

// export function useGeolocalizacao() {
//   const [latitude, setLatitude] = useState<number | null>(null);
//   const [longitude, setLongitude] = useState<number | null>(null);
//   const [erro, setErro] = useState<Errors>({});
//   const [tentouAutomatico, setTentouAutomatico] = useState(false);
//   const [carregando, setCarregando] = useState(false);

//   const obterLocalizacao = (automatico = false) => {
//     if (automatico) setTentouAutomatico(true);
//     setCarregando(true);
//     if (!navigator.geolocation) {
//       setErro((e) => ({
//         ...e,
//         localizacao: "Geolocalização não é suportada pelo seu navegador",
//       }));
//       return;
//     }

//     const leituras: GeolocationPosition[] = [];

//     navigator.geolocation.getCurrentPosition(
//       (pos) => {
//         setLatitude(pos.coords.latitude);
//         setLongitude(pos.coords.longitude);
//         setErro((e) => ({ ...e, localizacao: undefined }));
//         setCarregando(false);
//       },
//       () => {
//         setErro((e) => ({
//           ...e,
//           localizacao: "Permissão negada para obter a localização",
//         }));
//         setCarregando(false);
//       },
//       {
//         enableHighAccuracy: true, // força GPS
//         timeout: 15000, // aguarda até 15s
//         maximumAge: 0, // não usa posição antiga
//       },
//     );
//   };

//   useEffect(() => {
//     obterLocalizacao(true);
//   }, []);

//   return {
//     latitude,
//     longitude,
//     erro,
//     obterLocalizacao,
//     localizacaoErro: erro.localizacao,
//     tentouAutomatico,
//     carregando,
//   };
// }

// import { useState, useEffect } from "react";
// import { Errors } from "@/types/cadastro";

// export function useGeolocalizacao() {
//   const [latitude, setLatitude] = useState<number | null>(null);
//   const [longitude, setLongitude] = useState<number | null>(null);
//   const [accuracy, setAccuracy] = useState<number | null>(null);
//   const [erro, setErro] = useState<Errors>({});
//   const [tentouAutomatico, setTentouAutomatico] = useState(false);
//   const [carregando, setCarregando] = useState(false);

//   const obterLocalizacao = (automatico = false) => {
//     if (automatico) setTentouAutomatico(true);
//     setCarregando(true);

//     if (!navigator.geolocation) {
//       setErro((e) => ({
//         ...e,
//         localizacao: "Geolocalização não suportada pelo seu navegador",
//       }));
//       setCarregando(false);
//       return;
//     }

//     const leituras: GeolocationPosition[] = [];

//     const id = navigator.geolocation.watchPosition(
//       (pos) => {
//         leituras.push(pos);

//         // esperar até 3 leituras para pegar a melhor precisão
//         if (leituras.length >= 3) {
//           leituras.sort((a, b) => a.coords.accuracy - b.coords.accuracy);
//           const melhor = leituras[0];
//           setLatitude(melhor.coords.latitude);
//           setLongitude(melhor.coords.longitude);
//           setAccuracy(melhor.coords.accuracy);
//           setErro((e) => ({ ...e, localizacao: undefined }));
//           setCarregando(false);
//           navigator.geolocation.clearWatch(id);
//         }
//       },
//       (err) => {
//         let msg = "";
//         switch (err.code) {
//           case err.PERMISSION_DENIED:
//             msg = "Permissão negada para obter a localização";
//             break;
//           case err.POSITION_UNAVAILABLE:
//             msg = "Localização não disponível";
//             break;
//           case err.TIMEOUT:
//             msg = "Tempo esgotado para obter localização";
//             break;
//           default:
//             msg = "Erro ao obter localização";
//         }
//         setErro((e) => ({ ...e, localizacao: msg }));
//         setCarregando(false);
//         navigator.geolocation.clearWatch(id);
//       },
//       {
//         enableHighAccuracy: true, // força GPS
//         timeout: 15000, // aguarda até 15s
//         maximumAge: 0, // não usa posição antiga
//       },
//     );
//   };

//   // chama automaticamente ao montar o hook
//   useEffect(() => {
//     obterLocalizacao(true);
//   }, []);

//   // função para atualizar manualmente (por exemplo, ao arrastar o marcador)
//   const atualizarPosicaoManual = (
//     lat: number,
//     lng: number,
//     precisao?: number,
//   ) => {
//     setLatitude(lat);
//     setLongitude(lng);
//     if (precisao) setAccuracy(precisao);
//   };

//   return {
//     latitude,
//     longitude,
//     accuracy,
//     erro,
//     atualizarPosicaoManual,
//     obterLocalizacao,
//     localizacaoErro: erro.localizacao,
//     tentouAutomatico,
//     carregando,
//   };
// }
