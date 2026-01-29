'use client';

import DashboardLayout from '@/components/DashboardLayout';

interface BettingHouse {
  name: string;
  url: string;
  hasPA: boolean;
  color: string;
}

interface Group {
  name: string;
  houses: BettingHouse[];
}

export default function CasasPage() {
  const groups: Group[] = [
    {
      name: "BETBY",
      houses: [
        { name: "BLAZE", url: "https://www.blaze.bet.br", hasPA: false, color: "from-orange-600 to-orange-800" },
        { name: "JONBET", url: "https://www.jonbet.bet.br", hasPA: false, color: "from-blue-600 to-blue-800" },
        { name: "GANHEI", url: "https://ganhei.bet.br/sports", hasPA: true, color: "from-green-600 to-green-800" },
        { name: "BETVIP", url: "https://www.betvip.bet.br", hasPA: false, color: "from-purple-600 to-purple-800" },
        { name: "APOSTEFACIL (LOTERJ)", url: "https://apostefacil.bet/sports?bt-path=%2F", hasPA: false, color: "from-yellow-600 to-yellow-800" },
        { name: "BETAGORA (LOTERJ)", url: "https://betagora.io/esportes/futebol", hasPA: false, color: "from-red-600 to-red-800" },
        { name: "AFUN", url: "https://www.afun.bet.br", hasPA: true, color: "from-indigo-600 to-indigo-800" },
        { name: "VIABET (LOTERJ)", url: "https://www.viabet.com.br/casino", hasPA: false, color: "from-pink-600 to-pink-800" },
      ]
    },
    {
      name: "Cactus Gaming",
      houses: [
        { name: "BET7K", url: "https://7k.bet.br", hasPA: true, color: "from-blue-600 to-blue-800" },
        { name: "VERABET", url: "https://vera.bet.br", hasPA: true, color: "from-purple-600 to-purple-800" },
        { name: "APOSTATUDO", url: "https://www.apostatudo.bet.br", hasPA: true, color: "from-green-600 to-green-800" },
        { name: "PIXBET", url: "https://www.pixbet.bet.br", hasPA: true, color: "from-green-500 to-green-700" },
        { name: "BET DA SORTE", url: "https://www.betdasorte.bet.br", hasPA: true, color: "from-yellow-600 to-yellow-800" },
        { name: "KINGPANDA", url: "https://www.kingpanda.bet.br", hasPA: true, color: "from-orange-600 to-orange-800" },
        { name: "MMABET", url: "https://www.mmabet.bet.br", hasPA: true, color: "from-indigo-600 to-indigo-800" },
        { name: "SORTENABET", url: "https://www.sortenabet.bet.br", hasPA: true, color: "from-pink-600 to-pink-800" },
        { name: "BULLSBET", url: "https://www.bullsbet.bet.br", hasPA: true, color: "from-cyan-600 to-cyan-800" },
        { name: "DONALDBET", url: "https://donald.bet.br", hasPA: true, color: "from-teal-600 to-teal-800" },
        { name: "BET.BET", url: "https://betpontobet.bet.br/sports?tab=Early", hasPA: true, color: "from-lime-600 to-lime-800" },
        { name: "JOGÃO", url: "https://www.jogao.bet.br", hasPA: true, color: "from-emerald-600 to-emerald-800" },
        { name: "B2XBET", url: "https://b2x.bet.br", hasPA: true, color: "from-violet-600 to-violet-800" },
        { name: "RICOBET", url: "https://rico.bet.br", hasPA: true, color: "from-rose-600 to-rose-800" },
        { name: "BRX", url: "https://www.brx.bet.br", hasPA: true, color: "from-amber-600 to-amber-800" },
        { name: "AVIAO", url: "https://www.aviao.bet.br", hasPA: true, color: "from-sky-600 to-sky-800" },
        { name: "APOSTAMAX", url: "https://www.apostamax.bet.br", hasPA: true, color: "from-blue-700 to-blue-900" },
        { name: "ENERGIA", url: "https://www.energia.bet.br", hasPA: true, color: "from-lime-700 to-lime-900" },
        { name: "4PLAY", url: "https://www.4play.bet.br", hasPA: true, color: "from-emerald-700 to-emerald-900" },
        { name: "4WIN", url: "https://www.4win.bet.br", hasPA: true, color: "from-violet-700 to-violet-900" },
        { name: "PLAYUZU", url: "https://www.playuzu.bet.br", hasPA: false, color: "from-fuchsia-700 to-fuchsia-900" },
        { name: "BACANAPLAY", url: "https://www.bacanaplay.bet.br", hasPA: false, color: "from-rose-700 to-rose-900" },
        { name: "BETFALCONS", url: "https://www.betfalcons.bet.br", hasPA: true, color: "from-purple-600 to-purple-800" },
        { name: "LIDERBET", url: "https://www.liderbet.bet.br", hasPA: true, color: "from-green-600 to-green-800" },
        { name: "BETGORILLAS", url: "https://www.betgorillas.bet.br", hasPA: true, color: "from-gray-600 to-gray-800" },
      ]
    },
    {
      name: "Pinnacle API",
      houses: [
        { name: "BETBRA", url: "https://www.betbra.bet.br", hasPA: false, color: "from-yellow-600 to-yellow-800" },
        { name: "BOLSADEAPOSTA", url: "https://www.bolsadeaposta.bet.br", hasPA: false, color: "from-red-600 to-red-800" },
        { name: "FULLTBET", url: "https://www.fulltbet.bet.br", hasPA: false, color: "from-orange-600 to-orange-800" },
        { name: "MATCHBOOK", url: "https://www.matchbook.bet.br", hasPA: false, color: "from-indigo-600 to-indigo-800" },
      ]
    },
    {
      name: "Caesars Sportsbook",
      houses: [
        { name: "LUVABET", url: "https://luva.bet.br/casino", hasPA: false, color: "from-pink-600 to-pink-800" },
        { name: "LUCKBET", url: "https://luck.bet.br/live-casino", hasPA: false, color: "from-cyan-600 to-cyan-800" },
        { name: "1PRA1", url: "https://www.1pra1.bet.br", hasPA: false, color: "from-teal-600 to-teal-800" },
        { name: "ESPORTE365", url: "https://esporte365.bet.br/sportsbook/Football/Brazil", hasPA: false, color: "from-lime-600 to-lime-800" },
        { name: "BIG BET", url: "https://big.bet.br/sportsbook/Football/South%20America", hasPA: false, color: "from-emerald-600 to-emerald-800" },
        { name: "APOSTAR", url: "https://www.apostar.bet.br", hasPA: false, color: "from-violet-600 to-violet-800" },
        { name: "REALS BET", url: "https://reals.bet.br/casino", hasPA: false, color: "from-rose-600 to-rose-800" },
        { name: "GERALBET", url: "https://www.geralbet.bet.br", hasPA: false, color: "from-amber-600 to-amber-800" },
        { name: "ONABET", url: "https://ona.bet.br/sportsbook/Football/South%20America", hasPA: false, color: "from-sky-600 to-sky-800" },
      ]
    },
    {
      name: "Open Bet",
      houses: [
        { name: "BANDBET", url: "https://www.bandbet.bet.br", hasPA: false, color: "from-blue-700 to-blue-900" },
        { name: "BET DO MILHÃO", url: "https://www.milhao.bet.br/esportes", hasPA: false, color: "from-purple-700 to-purple-900" },
      ]
    },
    {
      name: "SGA System",
      houses: [
        { name: "VAIDEBET", url: "https://www.vaidebet.bet.br", hasPA: false, color: "from-green-700 to-green-900" },
        { name: "BETPIX365", url: "https://www.betpix365.bet.br", hasPA: false, color: "from-gray-600 to-gray-800" },
        { name: "HIPERBET", url: "https://www.hiper.bet.br/", hasPA: false, color: "from-red-700 to-red-900" },
      ]
    },
    {
      name: "Clones LOTERJ",
      houses: [
        { name: "MARJOSPORTS", url: "https://www.marjosports.com.br/home", hasPA: false, color: "from-yellow-700 to-yellow-900" },
        { name: "BESTBET", url: "https://www.bestbet.com.br/home", hasPA: false, color: "from-cyan-700 to-cyan-900" },
        { name: "CHEGOUBET", url: "https://www.chegoubet.com.br/home", hasPA: false, color: "from-orange-700 to-orange-900" },
        { name: "BRILHANTE", url: "https://www.brilhante.bet/home", hasPA: false, color: "from-pink-700 to-pink-900" },
        { name: "CLUBE DO BET", url: "https://www.clubedobet.bet/home", hasPA: false, color: "from-indigo-700 to-indigo-900" },
      ]
    },
    {
      name: "Altenar Golden Palace",
      houses: [
        { name: "BRASIL DA SORTE", url: "https://www.brasildasorte.bet.br", hasPA: false, color: "from-green-600 to-green-800" },
        { name: "BETFUSION", url: "https://www.betfusion.bet.br", hasPA: true, color: "from-purple-600 to-purple-800" },
        { name: "NOSSABET", url: "https://www.nossabet.bet.br", hasPA: true, color: "from-blue-600 to-blue-800" },
        { name: "PAGOL", url: "https://www.pagol.bet.br", hasPA: true, color: "from-green-600 to-green-800" },
        { name: "VUPI BET", url: "https://www.vupi.bet.br/aposta-esportiva", hasPA: true, color: "from-red-600 to-red-800" },
        { name: "ESTRELA BET", url: "https://www.estrelabet.bet.br", hasPA: true, color: "from-yellow-600 to-yellow-800" },
        { name: "CASSINO", url: "https://www.cassino.bet.br", hasPA: true, color: "from-orange-600 to-orange-800" },
        { name: "BATEUBET", url: "https://www.bateubet.bet.br", hasPA: true, color: "from-indigo-600 to-indigo-800" },
        { name: "ESPORTIVABET", url: "https://esportiva.bet.br/", hasPA: true, color: "from-pink-600 to-pink-800" },
        { name: "GOL DE BET", url: "https://www.goldebet.bet.br", hasPA: false, color: "from-cyan-600 to-cyan-800" },
        { name: "LOTOGREEN", url: "https://www.lotogreen.bet.br", hasPA: true, color: "from-teal-600 to-teal-800" },
        { name: "BR4BET", url: "https://www.br4bet.bet.br", hasPA: true, color: "from-lime-600 to-lime-800" },
        { name: "SORTEONLINE", url: "https://www.sorteonline.bet.br", hasPA: false, color: "from-emerald-600 to-emerald-800" },
        { name: "LOTTOLAND", url: "https://www.lottoland.bet.br", hasPA: false, color: "from-violet-600 to-violet-800" },
        { name: "MULTIBET", url: "https://www.multibet.bet.br", hasPA: true, color: "from-rose-600 to-rose-800" },
        { name: "JOGO DE OURO", url: "https://www.jogodeouro.bet.br", hasPA: true, color: "from-amber-600 to-amber-800" },
        { name: "BETAKI", url: "https://www.betaki.bet.br", hasPA: true, color: "from-sky-600 to-sky-800" },
        { name: "MCGAMES", url: "https://www.mcgames.bet.br", hasPA: true, color: "from-blue-700 to-blue-900" },
        { name: "APOSTA1", url: "https://www.aposta1.bet.br", hasPA: false, color: "from-purple-700 to-purple-900" },
      ]
    },
    {
      name: "Entain",
      houses: [
        { name: "SPORTINGBET", url: "https://www.sportingbet.bet.br", hasPA: true, color: "from-green-600 to-green-800" },
        { name: "BETBOO", url: "https://www.betboo.bet.br", hasPA: true, color: "from-orange-600 to-orange-800" },
      ]
    },
    {
      name: "Altenar",
      houses: [
        { name: "STAKE", url: "https://www.stake.bet.br", hasPA: true, color: "from-purple-600 to-purple-800" },
        { name: "KTO", url: "https://www.kto.bet.br", hasPA: true, color: "from-blue-600 to-blue-800" },
        { name: "BETMGM", url: "https://www.betmgm.bet.br", hasPA: false, color: "from-yellow-600 to-yellow-800" },
        { name: "BETWARRIOR", url: "https://www.betwarrior.bet.br", hasPA: true, color: "from-cyan-600 to-cyan-800" },
      ]
    },
    {
      name: "Bet Construct",
      houses: [
        { name: "7GAMES", url: "https://www.7games.bet.br", hasPA: false, color: "from-red-600 to-red-800" },
        { name: "BETÃO", url: "https://www.betao.bet.br", hasPA: false, color: "from-blue-600 to-blue-800" },
        { name: "R7", url: "https://www.r7.bet.br", hasPA: false, color: "from-green-600 to-green-800" },
        { name: "SEGUROBET", url: "https://www.segurobet.bet.br", hasPA: true, color: "from-purple-600 to-purple-800" },
        { name: "VBET", url: "https://www.vbet.bet.br", hasPA: true, color: "from-yellow-600 to-yellow-800" },
        { name: "SUPREMABET", url: "https://www.supremabet.bet.br", hasPA: false, color: "from-orange-600 to-orange-800" },
        { name: "MAXIMABET", url: "https://www.maximabet.bet.br", hasPA: false, color: "from-indigo-600 to-indigo-800" },
        { name: "ULTRABET", url: "https://www.ultrabet.bet.br", hasPA: true, color: "from-pink-600 to-pink-800" },
        { name: "SEUBET", url: "https://www.seubet.bet.br", hasPA: true, color: "from-cyan-600 to-cyan-800" },
        { name: "H2BET", url: "https://www.h2bet.bet.br", hasPA: true, color: "from-teal-600 to-teal-800" },
        { name: "BRAVOBET", url: "https://www.bravobet.bet.br", hasPA: true, color: "from-lime-600 to-lime-800" },
        { name: "BETPARK", url: "https://www.betpark.bet.br", hasPA: false, color: "from-emerald-600 to-emerald-800" },
      ]
    },
    {
      name: "Provedor Próprio",
      houses: [
        { name: "BETFAST", url: "https://www.betfast.bet.br", hasPA: false, color: "from-blue-600 to-blue-800" },
        { name: "FAZIBET", url: "https://www.fazibet.bet.br", hasPA: false, color: "from-green-600 to-green-800" },
        { name: "TIVOBET", url: "https://www.tivobet.bet.br", hasPA: false, color: "from-purple-600 to-purple-800" },
        { name: "9F", url: "https://www.9f.bet.br", hasPA: false, color: "from-red-600 to-red-800" },
        { name: "6R", url: "https://www.6r.bet.br", hasPA: false, color: "from-yellow-600 to-yellow-800" },
        { name: "BET.APP", url: "https://www.betapp.bet.br", hasPA: false, color: "from-orange-600 to-orange-800" },
        { name: "IJOGO", url: "https://www.ijogo.bet.br", hasPA: false, color: "from-indigo-600 to-indigo-800" },
        { name: "FOGO777", url: "https://www.fogo777.bet.br", hasPA: false, color: "from-pink-600 to-pink-800" },
        { name: "P9", url: "https://www.p9.bet.br", hasPA: false, color: "from-cyan-600 to-cyan-800" },
        { name: "9D", url: "https://www.9d.bet.br", hasPA: false, color: "from-teal-600 to-teal-800" },
        { name: "WJCASINO", url: "https://www.wjcasino.bet.br", hasPA: false, color: "from-lime-600 to-lime-800" },
        { name: "GLAZE (LOTERJ)", url: "https://www.glaze.bet.br", hasPA: false, color: "from-emerald-600 to-emerald-800" },
        { name: "GRESPORTES", url: "https://www.gresportes.bet.br", hasPA: false, color: "from-violet-600 to-violet-800" },
        { name: "DONOSDABOLA", url: "https://www.donosdabola.bet.br", hasPA: false, color: "from-rose-600 to-rose-800" },
        { name: "ESPORTIVAVIP", url: "https://www.esportivavip.bet.br", hasPA: false, color: "from-amber-600 to-amber-800" },
        { name: "BETESPORTE", url: "https://www.betesporte.bet.br", hasPA: false, color: "from-sky-600 to-sky-800" },
        { name: "LANCEDESORTE", url: "https://www.lancedesorte.bet.br", hasPA: false, color: "from-blue-700 to-blue-900" },
        { name: "APOSTOU", url: "https://www.apostou.bet.br", hasPA: false, color: "from-purple-700 to-purple-900" },
        { name: "B1BET", url: "https://www.b1bet.bet.br", hasPA: false, color: "from-green-700 to-green-900" },
        { name: "BRBET", url: "https://www.brbet.bet.br", hasPA: false, color: "from-gray-600 to-gray-800" },
        { name: "UX BET", url: "https://www.uxbet.bet.br", hasPA: false, color: "from-red-700 to-red-900" },
        { name: "FAZOBET", url: "https://www.fazobet.bet.br", hasPA: true, color: "from-yellow-700 to-yellow-900" },
        { name: "BET4", url: "https://www.bet4.bet.br", hasPA: true, color: "from-cyan-700 to-cyan-900" },
        { name: "APOSTABET", url: "https://www.apostabet.bet.br", hasPA: true, color: "from-orange-700 to-orange-900" },
        { name: "BETNACIONAL", url: "https://www.betnacional.bet.br", hasPA: false, color: "from-yellow-600 to-yellow-800" },
        { name: "VIVASORTE", url: "https://www.vivasorte.bet.br", hasPA: true, color: "from-pink-700 to-pink-900" },
        { name: "GINGABET", url: "https://www.gingabet.bet.br", hasPA: true, color: "from-indigo-700 to-indigo-900" },
        { name: "QGBET", url: "https://www.qgbet.bet.br", hasPA: true, color: "from-teal-700 to-teal-900" },
      ]
    },
    {
      name: "Casas Sem Clones",
      houses: [
        { name: "VERSUS", url: "https://www.versus.bet.br", hasPA: true, color: "from-red-600 to-red-800" },
        { name: "ALFABET", url: "https://www.alfabet.bet.br", hasPA: false, color: "from-yellow-600 to-yellow-800" },
        { name: "NOVIBET", url: "https://www.novibet.bet.br", hasPA: true, color: "from-cyan-600 to-cyan-800" },
        { name: "ESPORTESDASORTE", url: "https://www.esportesdasorte.bet.br", hasPA: false, color: "from-blue-600 to-blue-800" },
        { name: "RIVALO", url: "https://www.rivalo.bet.br", hasPA: false, color: "from-green-600 to-green-800" },
        { name: "F12", url: "https://www.f12.bet.br", hasPA: false, color: "from-orange-600 to-orange-800" },
        { name: "MERIDIAN", url: "https://www.meridian.bet.br", hasPA: true, color: "from-purple-600 to-purple-800" },
        { name: "SPINBET", url: "https://www.spinbet.bet.br", hasPA: false, color: "from-indigo-600 to-indigo-800" },
        { name: "UPBET", url: "https://www.upbet.bet.br", hasPA: false, color: "from-pink-600 to-pink-800" },
        { name: "CASADEAPOSTAS", url: "https://www.casadeapostas.bet.br", hasPA: false, color: "from-teal-600 to-teal-800" },
        { name: "BETSUL", url: "https://www.betsul.bet.br", hasPA: true, color: "from-lime-600 to-lime-800" },
        { name: "APOSTAGANHA", url: "https://www.apostaganha.bet.br", hasPA: true, color: "from-emerald-600 to-emerald-800" },
        { name: "BETFAIR", url: "https://www.betfair.bet.br", hasPA: true, color: "from-violet-600 to-violet-800" },
        { name: "SPORTYBET", url: "https://www.sportybet.bet.br", hasPA: true, color: "from-rose-600 to-rose-800" },
        { name: "PINNACLE", url: "https://www.pinnacle.bet.br", hasPA: false, color: "from-amber-600 to-amber-800" },
        { name: "GALERABET", url: "https://www.galerabet.bet.br", hasPA: false, color: "from-sky-600 to-sky-800" },
        { name: "BETSSON", url: "https://www.betsson.bet.br", hasPA: true, color: "from-red-700 to-red-900" },
        { name: "BETBOOM", url: "https://www.betboom.bet.br", hasPA: false, color: "from-orange-700 to-orange-900" },
        { name: "SUPERBET", url: "https://www.superbet.bet.br", hasPA: true, color: "from-blue-700 to-blue-900" },
        { name: "BETANO", url: "https://www.betano.bet.br", hasPA: true, color: "from-green-700 to-green-900" },
        { name: "BET365", url: "https://www.bet365.bet.br", hasPA: true, color: "from-green-600 to-green-800" },
        { name: "REIDOPITACO", url: "https://www.reidopitaco.bet.br", hasPA: true, color: "from-purple-700 to-purple-900" },
        { name: "A247", url: "https://www.a247.bet.br", hasPA: false, color: "from-gray-600 to-gray-800" },
        { name: "BRAZINO777", url: "https://www.brazino777.bet.br", hasPA: false, color: "from-yellow-700 to-yellow-900" },
        { name: "BETESPECIAL", url: "https://www.betespecial.bet.br", hasPA: true, color: "from-cyan-700 to-cyan-900" },
        { name: "PAPIGAMES", url: "https://www.papigames.bet.br", hasPA: false, color: "from-red-700 to-red-900" },
      ]
    },
    {
      name: "Desconhecido",
      houses: [
        { name: "OLEYBET", url: "https://www.oleybet.bet.br", hasPA: false, color: "from-emerald-700 to-emerald-900" },
      ]
    },
  ];

  const totalHouses = groups.reduce((sum, group) => sum + group.houses.length, 0);

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#0A0A0A] text-white">
        {/* Hero Section */}
        <section className="hero-section relative overflow-hidden pt-20 pb-20">
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/10 via-transparent to-transparent"></div>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-emerald-500/5 rounded-full blur-3xl"></div>
          
          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-2 mb-8">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                <span className="text-emerald-500 font-medium text-sm">{totalHouses} Casas Verificadas</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight">
                <span className="text-emerald-500">Casas de Apostas</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-400 mb-8 max-w-3xl mx-auto">
                Informações sobre Pagamento Antecipado (PA) organizadas por grupo
              </p>
            </div>
          </div>
        </section>

        {/* Groups Sections */}
        {groups.map((group, groupIndex) => (
          <section key={groupIndex} className="py-12 relative">
            <div className="container mx-auto px-6">
              <div className="mb-8">
                <h2 className="text-3xl md:text-4xl font-black mb-2">
                  <span className="text-emerald-500">{group.name}</span>
                </h2>
                <p className="text-gray-400">{group.houses.length} casas do grupo</p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-[1600px] mx-auto">
                {group.houses.map((house, houseIndex) => (
                  <div
                    key={houseIndex}
                    className="group"
                  >
                    <div className="bg-gradient-to-br from-[#1A1A1A] to-[#111] border border-gray-800/50 rounded-2xl p-6 hover:border-emerald-500/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/20 h-full flex flex-col">
                      <a
                        href={house.name === "VUPI BET" ? "https://www.vupi.bet.br/" : house.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <div className={`bg-gradient-to-r ${house.color} rounded-xl p-4 mb-4 relative overflow-hidden hover:opacity-90 transition-opacity cursor-pointer`}>
                          <div className="absolute inset-0 bg-black/20"></div>
                          <h3 className="text-xl font-black text-white relative z-10 text-center">{house.name}</h3>
                        </div>
                      </a>

                      <div className="flex-1 flex flex-col items-center justify-center">
                        <div className="mb-2">
                          <span className="text-sm text-gray-400 font-semibold">Pagamento Antecipado</span>
                        </div>
                        <div className={`inline-flex items-center px-6 py-2 rounded-full text-lg font-black ${
                          house.hasPA 
                            ? 'bg-emerald-500/20 text-emerald-400 border-2 border-emerald-500' 
                            : 'bg-red-500/20 text-red-400 border-2 border-red-500'
                        }`}>
                          {house.hasPA ? 'SIM' : 'NÃO'}
                        </div>
                      </div>

                      <div className="mt-6">
                        <a
                          href={house.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-bold text-center py-3 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/50"
                        >
                          Acessar Casa
                          <svg className="w-5 h-5 inline-block ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ))}

        {/* Info Section */}
        <section className="py-20 relative">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/20 rounded-3xl p-8 md:p-12">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-4 text-white">O que é PA?</h3>
                  <div className="space-y-3 text-gray-300">
                    <p className="flex items-start gap-2">
                      <span className="text-emerald-500 mt-1 font-bold">•</span>
                      <span><strong>PA (Pagamento Antecipado)</strong> é quando a casa paga sua aposta antes do fim do jogo, em determinadas condições favoráveis</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <span className="text-emerald-500 mt-1 font-bold">•</span>
                      <span>Exemplo: Se seu time abrir 2 gols de vantagem, a casa pode pagar sua aposta mesmo que o jogo ainda esteja em andamento</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <span className="text-emerald-500 mt-1 font-bold">•</span>
                      <span>As casas estão organizadas por <strong>grupos/provedores</strong> de plataforma</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
