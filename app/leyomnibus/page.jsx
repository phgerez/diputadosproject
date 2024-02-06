"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import Image from 'next/image';
import { Button, Input, Typography, Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter, } from "@material-tailwind/react";


ChartJS.register(ArcElement, Tooltip, Legend);

const SemicircularChart = () => {

  const chartRef = useRef(null);
  const [positivos, setAffirmativeVotes] = useState(0);
  const [negativos, setNegativeVotes] = useState(0);
  const [ausentes, setAbstentionVotes] = useState(0);
  const [totalVotesByParty, setTotalVotesByParty] = useState({});
  //SetState para mostrar info de votos desglosados
  const [partyVotesInfo, setPartyVotesInfo] = useState(null);

  const [parties, setParties] = useState([
    { name: 'Unión por la Patria + Independencia', positivos: 3, negativos: 97, ausentes: 2, logo: "https://upload.wikimedia.org/wikipedia/commons/6/66/Logo_Union_por_la_Patria.svg" },
    { name: 'Frente de Izquierda y De Trabajadores', positivos: 0, negativos: 5, ausentes: 0, logo: "https://upload.wikimedia.org/wikipedia/commons/8/8c/Logo_Frente_de_Izquierda_y_de_Trabajadores-Unidad.svg" },
    { name: 'Propuesta Republicana', positivos: 37, negativos: 0, ausentes: 0, logo: "https://upload.wikimedia.org/wikipedia/commons/b/ba/Logo_PRO.svg" },
    { name: 'La Libertad Avanza', positivos: 37, negativos: 0, ausentes: 0, logo: "https://upload.wikimedia.org/wikipedia/commons/2/20/Logo_La_Libertad_Avanza_%28sin_%C3%A1guila%29.svg"},
    { name: 'Buenos Aires Libre', positivos: 2, negativos: 0, ausentes: 0, logo: "https://upload.wikimedia.org/wikipedia/commons/d/d6/Buenos_Aires_Libre.png" },
    { name: 'Avanza Libertad', positivos: 1, negativos: 0, ausentes: 0, logo: "https://upload.wikimedia.org/wikipedia/commons/7/7b/AvanzaLibertadLogo2022.png" },
    { name: 'La Unión Mendocina', positivos: 1, negativos: 0, ausentes: 0, logo: "https://upload.wikimedia.org/wikipedia/commons/1/11/La_Union_Mendocina.svg" },
    { name: 'Unión Cívica Radical', positivos: 37, negativos: 2, ausentes: 0, logo: "https://upload.wikimedia.org/wikipedia/commons/d/d7/Ucr_modern_logo.svg" },
    { name: 'Hacemos Coalición Federal', positivos: 18, negativos: 4, ausentes: 1, logo: "https://upload.wikimedia.org/wikipedia/commons/f/f8/Hacemos_Coalicion_Federal_Logo.png" },
    { name: 'Innovación Federal', positivos: 9, negativos: 0, ausentes: 0, logo: "https://upload.wikimedia.org/wikipedia/commons/1/15/Innovaci%C3%B3n_Federal.png" },
    { name: 'Por Santa Cruz', positivos: 1, negativos: 1, ausentes: 0, logo: "https://upload.wikimedia.org/wikipedia/commons/7/7a/SER_Santa_Cruz_logo.png" },
    { name: 'Producción y Trabajo', positivos: 2, negativos: 0, ausentes: 0, logo: "https://upload.wikimedia.org/wikipedia/commons/b/bc/Logo_PyT.png" },
    { name: 'CREO', positivos: 1, negativos: 0, ausentes: 0, logo: "https://upload.wikimedia.org/wikipedia/commons/a/a0/CREO_Tucum%C3%A1n.png" },
  ]);

  const data = {
    labels: ['Positivos', 'Negativos', 'Ausentes'],
    datasets: [
      {
        data: [positivos, negativos, ausentes],
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
    const totalAffirmativeVotes = parties.reduce((acc, party) => acc + party.positivos, 0);
    const totalNegativeVotes = parties.reduce((acc, party) => acc + party.negativos, 0);
    const totalAbstentionVotes = parties.reduce((acc, party) => acc + party.ausentes, 0);
    

    // Actualizamos los estados de votos totales
    setAffirmativeVotes(totalAffirmativeVotes);
    setNegativeVotes(totalNegativeVotes);
    setAbstentionVotes(totalAbstentionVotes);

    // Calculamos los totales de votos por partido
  const totalVotesByParty = parties.reduce((acc, party) => {
    acc[party.name] = {
      positivos: party.positivos,
      negativos: party.negativos,
      ausentes: party.ausentes,
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


  return (
    <>
    <Dialog open={open} className='max-h-[50vh] lg:max-h-full overflow-y-auto'>
        <DialogHeader>Desglose de votos por partido</DialogHeader>
        <DialogBody>
        <p className='text-black hidden'>Así votaron los diputados:</p>
        {partyVotesInfo && (
        <div> 
          <p className='font-bold uppercase mb-4'>{`votos ${partyVotesInfo.type}`}</p>
          <ul>
            {Object.entries(partyVotesInfo.votesByParty).map(([party, votes]) => (
              <li className="mb-2" key={party}>{`${party}: ${votes}`}</li>
            ))}
          </ul>
        </div>
      )}
        </DialogBody>
        <DialogFooter>
          <Button variant="outlined" color='black' onClick={()=> setOpen(!open)}>
            <span>Cerrar</span>
          </Button>
        </DialogFooter>
      </Dialog>
    <div className='bg-white'>
      <Typography variant="h1" className='text-black text-center max-w-[70%] mx-auto mb-10'>Votos de Diputados por la "Ley Ómnibus"</Typography>
      {/*--gráfico--*/}
      <div className='parent relative w-full lg:w-[50%] mx-auto'>
        <Doughnut data={data} options={options} ref={chartRef}/>
        <p className='relative lg:absolute lg:bottom-36 mx-auto w-full text-blue-gray-200 text-sm text-center'>Hacé click en cada tipo de voto para ver cómo votaron los bloques.</p>
      </div>
      {/*--gráfico--*/}
      <div className='flex w-full flex-col lg:flex-row lg:w-[70%] mx-auto justify-center px-7 lg:px-0 gap-11 lg:flex-wrap'>
        {parties.map((party, index) => (
          <div key={index} className='w-full lg:w-[33%] flex flex-col gap-x-2 gap-y-2 mb-10'>
            <div className='h-[40px] w-auto'>
              <Image loader={()=>party.logo} src={party.logo} width={300} height={300} className='max-h-[40px] w-auto mx-auto' alt='logo de partido'/>
              </div>
            <label className='text-black font-bold uppercase mb-4'>{party.name}:</label>
            <div className='w-full'>
            <Input label="positivos" value={party.positivos}
                success
                readOnly
                className='text-black border border-black cursor-not-allowed'/>
            </div>
            <div className='w-full'>
            <Input label="Negativos" value={party.negativos}
                readOnly
                error
                className='text-black border border-black cursor-not-allowed'/>
            </div>
            <div className='w-full'>
            <Input label="Ausentes" value={party.ausentes}
                readOnly
                className='text-black border border-black cursor-not-allowed'/>
            </div>
          </div>
        ))}
      </div>
    </div>
    </>
  );
};

export default SemicircularChart;
