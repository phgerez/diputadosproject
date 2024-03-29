"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import Image from 'next/image';
import {
  Button, Input, Typography, Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import Link from 'next/link'


ChartJS.register(ArcElement, Tooltip, Legend);

const SemicircularChart = () => {

  const chartRef = useRef(null);
  const [afirmativos, setAffirmativeVotes] = useState(0);
  const [negativos, setNegativeVotes] = useState(0);
  const [abstencion, setAbstentionVotes] = useState(0);
  const [totalVotesByParty, setTotalVotesByParty] = useState({});
  //SetState para mostrar info de votos desglosados
  const [partyVotesInfo, setPartyVotesInfo] = useState(null);

  const [parties, setParties] = useState([
    { name: 'Unión por la Patria', afirmativos: 20, negativos: 10, abstencion: 5, logo: "https://upload.wikimedia.org/wikipedia/commons/6/66/Logo_Union_por_la_Patria.svg" },
    { name: 'Frente de Izquierda y De Trabajadores', afirmativos: 15, negativos: 8, abstencion: 7, logo: "https://upload.wikimedia.org/wikipedia/commons/8/8c/Logo_Frente_de_Izquierda_y_de_Trabajadores-Unidad.svg" },
    { name: 'Propuesta Republicana', afirmativos: 15, negativos: 8, abstencion: 7, logo: "https://upload.wikimedia.org/wikipedia/commons/b/ba/Logo_PRO.svg" },
    { name: 'La Libertad Avanza', afirmativos: 15, negativos: 8, abstencion: 7, logo: "https://upload.wikimedia.org/wikipedia/commons/2/20/Logo_La_Libertad_Avanza_%28sin_%C3%A1guila%29.svg" },
    { name: 'Buenos Aires Libre', afirmativos: 15, negativos: 8, abstencion: 7, logo: "https://upload.wikimedia.org/wikipedia/commons/d/d6/Buenos_Aires_Libre.png" },
    { name: 'Avanza Libertad', afirmativos: 15, negativos: 8, abstencion: 7, logo: "https://upload.wikimedia.org/wikipedia/commons/7/7b/AvanzaLibertadLogo2022.png" },
    { name: 'La Unión Mendocina', afirmativos: 15, negativos: 8, abstencion: 7, logo: "https://upload.wikimedia.org/wikipedia/commons/1/11/La_Union_Mendocina.svg" },
    { name: 'Unión Cívica Radical', afirmativos: 15, negativos: 8, abstencion: 7, logo: "https://upload.wikimedia.org/wikipedia/commons/d/d7/Ucr_modern_logo.svg" },
    { name: 'Hacemos Coalición Federal', afirmativos: 15, negativos: 8, abstencion: 7, logo: "https://upload.wikimedia.org/wikipedia/commons/f/f8/Hacemos_Coalicion_Federal_Logo.png" },
    { name: 'Innovación Federal', afirmativos: 15, negativos: 8, abstencion: 7, logo: "https://upload.wikimedia.org/wikipedia/commons/1/15/Innovaci%C3%B3n_Federal.png" },
    { name: 'Independencia', afirmativos: 15, negativos: 8, abstencion: 7, logo: "https://placehold.co/300x300" },
    { name: 'Por Santa Cruz', afirmativos: 15, negativos: 8, abstencion: 7, logo: "https://upload.wikimedia.org/wikipedia/commons/7/7a/SER_Santa_Cruz_logo.png" },
    { name: 'Producción y Trabajo', afirmativos: 15, negativos: 8, abstencion: 7, logo: "https://upload.wikimedia.org/wikipedia/commons/b/bc/Logo_PyT.png" },
    { name: 'CREO', afirmativos: 15, negativos: 8, abstencion: 7, logo: "https://upload.wikimedia.org/wikipedia/commons/a/a0/CREO_Tucum%C3%A1n.png" },
  ]);

  const data = {
    labels: ['Afirmativos', 'Negativos', 'Abstencion'],
    datasets: [
      {
        data: [afirmativos, negativos, abstencion],
        backgroundColor: ['lightgreen', '#FF6384', 'lightgray'],
        hoverBackgroundColor: ['lightgreen', '#FF6384', 'lightgray'],
      },
    ],
  };

  const calculateVotesByTypeAndParty = (voteType) => {
    const votesByTypeAndParty = {};

    parties.forEach((party) => {
      votesByTypeAndParty[party.name] = party[voteType];
    });

    return votesByTypeAndParty;
  };


  useEffect(() => {
    // Calculamos los totales de votos
    const totalAffirmativeVotes = parties.reduce((acc, party) => acc + party.afirmativos, 0);
    const totalNegativeVotes = parties.reduce((acc, party) => acc + party.negativos, 0);
    const totalAbstentionVotes = parties.reduce((acc, party) => acc + party.abstencion, 0);


    // Actualizamos los estados de votos totales
    setAffirmativeVotes(totalAffirmativeVotes);
    setNegativeVotes(totalNegativeVotes);
    setAbstentionVotes(totalAbstentionVotes);

    // Calculamos los totales de votos por partido
    const totalVotesByParty = parties.reduce((acc, party) => {
      acc[party.name] = {
        afirmativos: party.afirmativos,
        negativos: party.negativos,
        abstencion: party.abstencion,
      };
      return acc;
    }, {});

    // Actualizamos el estado de votos por partido
    setTotalVotesByParty(totalVotesByParty);
  }, [parties]);

  const [open, setOpen] = React.useState(false);

  const options = {
    circumference: 180,
    rotation: -90,
    tooltips: {
      callbacks: {
        label: (tooltipItem, chartData) => {
          const dataset = chartData.datasets[tooltipItem.datasetIndex];
          const total = dataset.data.reduce((acc, value) => acc + value, 0);
          const currentValue = dataset.data[tooltipItem.index];
          const percentage = Math.round((currentValue / total) * 100);



          // Imprime en la consola la información sobre votos por tipo y partido
          //console.log('Votos por tipo y partido:', votesByTypeAndParty);

          return `${chartData.labels[tooltipItem.index]}: pepe ${percentage}%`;
        },
      },
    },
    onClick: (event, elements) => {
      if (elements && elements.length > 0) {
        setOpen(!open)
        const clickedIndex = elements[0].index;

        // Llama a la función para calcular los votos por tipo y partido
        const voteType = data.labels[clickedIndex].toLowerCase();
        const votesByParty = calculateVotesByTypeAndParty(voteType);
        setPartyVotesInfo({
          type: data.labels[clickedIndex],
          votesByParty: votesByParty,
        });
      }
    },
  };



  const handlePartyInputChange = (partyIndex, voteType, value) => {
    setParties((prevParties) => {
      const newParties = [...prevParties];
      newParties[partyIndex][voteType] = parseInt(value, 10) || 0;

      // Recalcula los votos por tipo y partido
      const votesByTypeAndParty = {
        afirmativos: {},
        negativos: {},
        abstencion: {},
      };

      newParties.forEach((party) => {
        votesByTypeAndParty.afirmativos[party.name] = party.afirmativos;
        votesByTypeAndParty.negativos[party.name] = party.negativos;
        votesByTypeAndParty.abstencion[party.name] = party.abstencion;
      });

      //console.log('Votos por tipo y partido:', votesByTypeAndParty);

      return newParties;
    });
  };


  return (
    <>
      <Dialog open={open} className='max-h-[50vh] lg:max-h-full'>
        <DialogHeader className="sticky top-0 text-base md:text-2xl justify-between">Desglose de votos por partido
        <Button variant="outlined" color='black' onClick={()=> setOpen(!open)}>
            <span>Cerrar</span>
          </Button></DialogHeader>
        <DialogBody>
        <p className='text-black hidden'>Así votaron los diputados:</p>
        {partyVotesInfo && (
        <div className='parent relative overflow-y-scroll h-[200px] md:h-full'> 
          <div className='font-bold uppercase mb-4 sticky top-0 bg-white'><p >{`votos ${partyVotesInfo.type}`}</p></div>
          <ul>
            {Object.entries(partyVotesInfo.votesByParty).map(([party, votes]) => (
              <li className="mb-2" key={party}>{`${party}: ${votes}`}</li>
            ))}
          </ul>
        </div>
      )}
        </DialogBody>
        <DialogFooter>
        <p className='text-black hidden'>Votos</p>
        </DialogFooter>
      </Dialog>
      <div className='bg-white'>
        <Typography variant="h1" className='text-black text-center max-w-[70%] mx-auto mb-10 max-md:text-[30px] pt-5'>Gráfico de Cámara de Diputados</Typography>
          <Link href="/leyomnibus" className="flex w-full my-5">
            <Button className="mx-auto">Ver votos de Ley Omnibus</Button>
          </Link>
        <Typography variant="h4" className='text-blue-gray-200 text-center mb-10'>Ingresar votos por partido:</Typography>
        <div className='flex w-full flex-col lg:flex-row lg:w-[70%] mx-auto justify-center px-7 lg:px-0 gap-11 lg:flex-wrap'>
          {parties.map((party, index) => (
            <div key={index} className='w-full lg:w-[33%] flex flex-col gap-x-2 gap-y-2 mb-10'>
              <div className='h-[40px] w-auto'>
                <Image loader={() => party.logo} src={party.logo} width={300} height={300} className='max-h-[40px] w-auto mx-auto' alt='logo de partido' />
              </div>
              <label className='text-black font-bold uppercase mb-4'>{party.name}:</label>
              <div className='w-full'>
                <Input label="Afirmativos" value={party.afirmativos}
                  className='text-black border border-black'
                  onChange={(e) => handlePartyInputChange(index, 'afirmativos', e.target.value)} />
              </div>
              <div className='w-full'>
                <Input label="Negativos" value={party.negativos}
                  className='text-black border border-black'
                  onChange={(e) => handlePartyInputChange(index, 'negativos', e.target.value)} />
              </div>
              <div className='w-full'>
                <Input label="Abstención" value={party.abstencion}
                  className='text-black border border-black'
                  onChange={(e) => handlePartyInputChange(index, 'abstencion', e.target.value)} />
              </div>
            </div>
          ))}
        </div>
        <p className='text-blue-gray-200 text-sm text-center'>El gráfico se actualiza automáticamente con los números ingresados en cada campo.</p>

        <div className='parent relative w-full lg:w-[50%] mx-auto'>
          <Doughnut data={data} options={options} ref={chartRef} />
          <p className='relative lg:absolute lg:bottom-36 mx-auto w-full text-blue-gray-200 text-sm text-center'>Hacé click en cada tipo de voto para ver cómo votaron los bloques.</p>
        </div>


      </div>
    </>
  );
};

export default SemicircularChart;
