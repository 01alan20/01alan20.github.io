window.BRAZIL_STORY = {
  "meta": {
    "release": "2026-10",
    "retrieved_on": "2026-10-20",
    "scope": "Complete national CNPJ snapshot: all ten company and ten establishment shards",
    "survival_model_identified": false,
    "sources": [
      {
        "label": "Receita Federal CNPJ source files",
        "url": "https://arquivos.receitafederal.gov.br/index.php/s/YggdBLfdninEJX9"
      },
      {
        "label": "Official CNPJ layout",
        "url": "https://www.gov.br/receitafederal/dados/cnpj-metadados.pdf"
      },
      {
        "label": "Pipeline reference",
        "url": "https://github.com/caiopizzol/cnpj-data-pipeline"
      }
    ],
    "archive_count": 20,
    "source_compressed_bytes": 6803481897,
    "population_note": "CNPJ covers registered legal entities and establishments, including public bodies and nonprofits, not only commercial businesses. Partner and MEI/Simples files are inventoried but not included in the national 20-archive aggregation.",
    "geography_note": "Current registered location; includes EX (outside Brazil) and unknown if present. Not founding location.",
    "cohort_note": "Opening-year composition of retained registrations, not a verified historical births series."
  },
  "national": {
    "establishments": 73809379,
    "active": 28380653,
    "headquarters": 70517438,
    "branches": 3291941,
    "companies": 70517437,
    "company_source_records": 70517438,
    "active_share": 0.3845128272925857,
    "domestic_establishments": 73635969,
    "domestic_active": 28299348,
    "domestic_active_share": 0.3843141929727305,
    "outside_or_unknown_geography": 173410
  },
  "statuses": [
    {
      "code": "08",
      "count": 34829938,
      "label": "Deregistered",
      "share": 0.4718904083991819
    },
    {
      "code": "02",
      "count": 28380653,
      "label": "Active",
      "share": 0.3845128272925857
    },
    {
      "code": "04",
      "count": 10165173,
      "label": "Unfit",
      "share": 0.13772196891129512
    },
    {
      "code": "03",
      "count": 323068,
      "label": "Suspended",
      "share": 0.0043770589100878355
    },
    {
      "code": "01",
      "count": 110547,
      "label": "Null registration",
      "share": 0.0014977364868494559
    }
  ],
  "states": [
    {
      "uf": "SP",
      "total": 21369926,
      "active": 8833181,
      "headquarters": 20346062,
      "branches": 1023864,
      "name": "São Paulo",
      "active_share": 0.4133463541240152
    },
    {
      "uf": "MG",
      "total": 7988006,
      "active": 2935399,
      "headquarters": 7661468,
      "branches": 326538,
      "name": "Minas Gerais",
      "active_share": 0.36747581311280936
    },
    {
      "uf": "RJ",
      "total": 6253182,
      "active": 2299466,
      "headquarters": 6026569,
      "branches": 226613,
      "name": "Rio de Janeiro",
      "active_share": 0.3677273426553073
    },
    {
      "uf": "PR",
      "total": 5029433,
      "active": 2018638,
      "headquarters": 4811265,
      "branches": 218168,
      "name": "Paraná",
      "active_share": 0.40136492523113443
    },
    {
      "uf": "RS",
      "total": 5015901,
      "active": 1761594,
      "headquarters": 4769234,
      "branches": 246667,
      "name": "Rio Grande do Sul",
      "active_share": 0.35120190769315424
    },
    {
      "uf": "BA",
      "total": 3634418,
      "active": 1271841,
      "headquarters": 3475346,
      "branches": 159072,
      "name": "Bahia",
      "active_share": 0.34994351227624343
    },
    {
      "uf": "SC",
      "total": 3607531,
      "active": 1558584,
      "headquarters": 3428690,
      "branches": 178841,
      "name": "Santa Catarina",
      "active_share": 0.4320362042626938
    },
    {
      "uf": "GO",
      "total": 2675945,
      "active": 1055499,
      "headquarters": 2572469,
      "branches": 103476,
      "name": "Goiás",
      "active_share": 0.39443972129472016
    },
    {
      "uf": "PE",
      "total": 2202846,
      "active": 744715,
      "headquarters": 2101456,
      "branches": 101390,
      "name": "Pernambuco",
      "active_share": 0.3380694792100764
    },
    {
      "uf": "CE",
      "total": 2095032,
      "active": 757799,
      "headquarters": 2008923,
      "branches": 86109,
      "name": "Ceará",
      "active_share": 0.36171237479904844
    },
    {
      "uf": "ES",
      "total": 1560028,
      "active": 617508,
      "headquarters": 1489619,
      "branches": 70409,
      "name": "Espírito Santo",
      "active_share": 0.39583135687308174
    },
    {
      "uf": "PA",
      "total": 1493990,
      "active": 515731,
      "headquarters": 1429223,
      "branches": 64767,
      "name": "Pará",
      "active_share": 0.34520378315785244
    },
    {
      "uf": "MT",
      "total": 1432513,
      "active": 572775,
      "headquarters": 1360901,
      "branches": 71612,
      "name": "Mato Grosso",
      "active_share": 0.3998393033780496
    },
    {
      "uf": "DF",
      "total": 1287888,
      "active": 482623,
      "headquarters": 1237957,
      "branches": 49931,
      "name": "Distrito Federal",
      "active_share": 0.3747398842135341
    },
    {
      "uf": "MA",
      "total": 1095176,
      "active": 377000,
      "headquarters": 1052334,
      "branches": 42842,
      "name": "Maranhão",
      "active_share": 0.3442369080403515
    },
    {
      "uf": "MS",
      "total": 994428,
      "active": 380903,
      "headquarters": 941518,
      "branches": 52910,
      "name": "Mato Grosso do Sul",
      "active_share": 0.38303728374502727
    },
    {
      "uf": "PB",
      "total": 945776,
      "active": 351663,
      "headquarters": 906172,
      "branches": 39604,
      "name": "Paraíba",
      "active_share": 0.3718248295579503
    },
    {
      "uf": "RN",
      "total": 841294,
      "active": 309450,
      "headquarters": 800681,
      "branches": 40613,
      "name": "Rio Grande do Norte",
      "active_share": 0.3678262295939351
    },
    {
      "uf": "AM",
      "total": 799844,
      "active": 289486,
      "headquarters": 764853,
      "branches": 34991,
      "name": "Amazonas",
      "active_share": 0.3619280759748151
    },
    {
      "uf": "AL",
      "total": 700293,
      "active": 235835,
      "headquarters": 672609,
      "branches": 27684,
      "name": "Alagoas",
      "active_share": 0.3367661821551836
    },
    {
      "uf": "PI",
      "total": 633514,
      "active": 238752,
      "headquarters": 603896,
      "branches": 29618,
      "name": "Piauí",
      "active_share": 0.3768693351685993
    },
    {
      "uf": "RO",
      "total": 513472,
      "active": 173813,
      "headquarters": 486549,
      "branches": 26923,
      "name": "Rondônia",
      "active_share": 0.33850531285055463
    },
    {
      "uf": "TO",
      "total": 495890,
      "active": 181333,
      "headquarters": 474731,
      "branches": 21159,
      "name": "Tocantins",
      "active_share": 0.3656718223799633
    },
    {
      "uf": "SE",
      "total": 493090,
      "active": 178681,
      "headquarters": 469841,
      "branches": 23249,
      "name": "Sergipe",
      "active_share": 0.36236995274696304
    },
    {
      "uf": "EX",
      "total": 173410,
      "active": 81305,
      "headquarters": 172526,
      "branches": 884,
      "name": "Outside Brazil",
      "active_share": 0.46885992733983045
    },
    {
      "uf": "AC",
      "total": 168703,
      "active": 54887,
      "headquarters": 160236,
      "branches": 8467,
      "name": "Acre",
      "active_share": 0.325346911436074
    },
    {
      "uf": "AP",
      "total": 162516,
      "active": 51731,
      "headquarters": 153887,
      "branches": 8629,
      "name": "Amapá",
      "active_share": 0.31831327376996726
    },
    {
      "uf": "RR",
      "total": 145334,
      "active": 50461,
      "headquarters": 138423,
      "branches": 6911,
      "name": "Roraima",
      "active_share": 0.34720712290310596
    }
  ],
  "industries": [
    {
      "code": "4781400",
      "total": 3739346,
      "active": 1014303,
      "label": "Comércio varejista de artigos do vestuário e acessórios",
      "active_share": 0.2712514434342262
    },
    {
      "code": "9492800",
      "total": 3326186,
      "active": 158594,
      "label": "Atividades de organizações políticas",
      "active_share": 0.04768043639171111
    },
    {
      "code": "5611203",
      "total": 2061351,
      "active": 475233,
      "label": "Lanchonetes, casas de chá, de sucos e similares",
      "active_share": 0.23054443420843904
    },
    {
      "code": "9602501",
      "total": 2044079,
      "active": 942603,
      "label": "Cabeleireiros, manicure e pedicure",
      "active_share": 0.4611382436784488
    },
    {
      "code": "7319002",
      "total": 1880659,
      "active": 839779,
      "label": "Promoção de vendas",
      "active_share": 0.4465344328769862
    },
    {
      "code": "8888888",
      "total": 1806724,
      "active": 7862,
      "label": "Atividade Econônica não informada",
      "active_share": 0.004351522424011637
    },
    {
      "code": "4712100",
      "total": 1737073,
      "active": 444004,
      "label": "Comércio varejista de mercadorias em geral, com predominância de produtos alimentícios - minimercados, mercearias e armazéns",
      "active_share": 0.25560468673452413
    },
    {
      "code": "4399103",
      "total": 1411514,
      "active": 614840,
      "label": "Obras de alvenaria",
      "active_share": 0.43558902001680466
    },
    {
      "code": "5611201",
      "total": 1284981,
      "active": 400895,
      "label": "Restaurantes e similares",
      "active_share": 0.31198515775719643
    },
    {
      "code": "8219999",
      "total": 1278040,
      "active": 690727,
      "label": "Preparação de documentos e serviços especializados de apoio administrativo não especificados anteriormente",
      "active_share": 0.5404580451316078
    },
    {
      "code": "4930201",
      "total": 1209868,
      "active": 509264,
      "label": "Transporte rodoviário de carga, exceto produtos perigosos e mudanças, municipal.",
      "active_share": 0.4209252579620256
    },
    {
      "code": "5620104",
      "total": 1028023,
      "active": 383728,
      "label": "Fornecimento de alimentos preparados preponderantemente para consumo domiciliar",
      "active_share": 0.37326791326653197
    },
    {
      "code": "4723700",
      "total": 923192,
      "active": 289231,
      "label": "Comércio varejista de bebidas",
      "active_share": 0.31329452594909835
    },
    {
      "code": "4930202",
      "total": 918176,
      "active": 478938,
      "label": "Transporte rodoviário de carga, exceto produtos perigosos e mudanças, intermunicipal, interestadual e internacional",
      "active_share": 0.5216189488725473
    },
    {
      "code": "9602502",
      "total": 750700,
      "active": 377223,
      "label": "Atividades de estética e outros serviços de cuidados com a beleza",
      "active_share": 0.5024950046623152
    },
    {
      "code": "8599699",
      "total": 740267,
      "active": 358917,
      "label": "Outras atividades de ensino não especificadas anteriormente",
      "active_share": 0.4848480345605032
    },
    {
      "code": "4321500",
      "total": 728247,
      "active": 329933,
      "label": "Instalação e manutenção elétrica",
      "active_share": 0.4530509566122483
    },
    {
      "code": "5320202",
      "total": 698965,
      "active": 313091,
      "label": "Serviços de entrega rápida",
      "active_share": 0.44793516127416966
    },
    {
      "code": "5320201",
      "total": 691196,
      "active": 351995,
      "label": "Serviços de malote não realizados pelo Correio Nacional",
      "active_share": 0.5092549725403503
    },
    {
      "code": "4772500",
      "total": 669698,
      "active": 244067,
      "label": "Comércio varejista de cosméticos, produtos de perfumaria e de higiene pessoal",
      "active_share": 0.36444337596946685
    },
    {
      "code": "8599604",
      "total": 649273,
      "active": 335396,
      "label": "Treinamento em desenvolvimento profissional e gerencial",
      "active_share": 0.5165716116333191
    },
    {
      "code": "9430800",
      "total": 649076,
      "active": 263037,
      "label": "Atividades de associações de defesa de direitos sociais",
      "active_share": 0.4052483838564359
    },
    {
      "code": "5612100",
      "total": 612244,
      "active": 217098,
      "label": "Serviços ambulantes de alimentação",
      "active_share": 0.35459392007108276
    },
    {
      "code": "4520001",
      "total": 581539,
      "active": 283103,
      "label": "Serviços de manutenção e reparação mecânica de veículos automotores",
      "active_share": 0.4868168772859602
    },
    {
      "code": "4789099",
      "total": 578854,
      "active": 172552,
      "label": "Comércio varejista de outros produtos não especificados anteriormente",
      "active_share": 0.29809243781678973
    },
    {
      "code": "4729699",
      "total": 575488,
      "active": 200192,
      "label": "Comércio varejista de produtos alimentícios em geral ou especializado em produtos alimentícios não especificados anteriormente",
      "active_share": 0.34786476868327404
    },
    {
      "code": "8230001",
      "total": 571723,
      "active": 253251,
      "label": "Serviços de organização de feiras, congressos, exposições e festas",
      "active_share": 0.4429610143373627
    },
    {
      "code": "9700500",
      "total": 559379,
      "active": 281870,
      "label": "Serviços domésticos",
      "active_share": 0.503898072684173
    },
    {
      "code": "8211300",
      "total": 554311,
      "active": 344014,
      "label": "Serviços combinados de escritório e apoio administrativo",
      "active_share": 0.6206155028494834
    },
    {
      "code": "1412601",
      "total": 549156,
      "active": 160693,
      "label": "Confecção de peças de vestuário, exceto roupas íntimas e as confeccionadas sob medida",
      "active_share": 0.29261812672537496
    },
    {
      "code": "4774100",
      "total": 515937,
      "active": 76653,
      "label": "Comércio varejista de artigos de óptica",
      "active_share": 0.14857046499863355
    },
    {
      "code": "4530703",
      "total": 498155,
      "active": 203753,
      "label": "Comércio a varejo de peças e acessórios novos para veículos automotores",
      "active_share": 0.4090152663327679
    },
    {
      "code": "9511800",
      "total": 470225,
      "active": 163673,
      "label": "Reparação e manutenção de computadores e de equipamentos periféricos",
      "active_share": 0.3480737944600989
    },
    {
      "code": "4330404",
      "total": 465925,
      "active": 202531,
      "label": "Serviços de pintura de edifícios em geral",
      "active_share": 0.4346858399957075
    },
    {
      "code": "1091102",
      "total": 464208,
      "active": 208451,
      "label": "Fabricação de produtos de padaria e confeitaria com predominância de produção própria",
      "active_share": 0.449046548099128
    },
    {
      "code": "5611204",
      "total": 462982,
      "active": 119013,
      "label": "Bares e outros estabelecimentos especializados em servir bebidas, sem entretenimento",
      "active_share": 0.2570575097951972
    },
    {
      "code": "4923002",
      "total": 453581,
      "active": 326651,
      "label": "Serviço de transporte de passageiros - locação de automóveis com motorista",
      "active_share": 0.7201602359887209
    },
    {
      "code": "4120400",
      "total": 438858,
      "active": 181848,
      "label": "Construção de edifícios",
      "active_share": 0.4143663781906676
    },
    {
      "code": "4744099",
      "total": 430276,
      "active": 185333,
      "label": "Comércio varejista de materiais de construção em geral",
      "active_share": 0.4307305078600712
    },
    {
      "code": "8712300",
      "total": 426556,
      "active": 184921,
      "label": "Atividades de fornecimento de infra-estrutura de apoio e assistência a paciente no domicílio",
      "active_share": 0.4335210382693011
    },
    {
      "code": "4751201",
      "total": 401497,
      "active": 119398,
      "label": "Comércio varejista especializado de equipamentos e suprimentos de informática",
      "active_share": 0.29738204768653315
    },
    {
      "code": "4722901",
      "total": 368283,
      "active": 80422,
      "label": "Comércio varejista de carnes - açougues",
      "active_share": 0.21837011211486818
    },
    {
      "code": "4771701",
      "total": 363202,
      "active": 111699,
      "label": "Comércio varejista de produtos farmacêuticos, sem manipulação de fórmulas",
      "active_share": 0.307539606059438
    },
    {
      "code": "4754701",
      "total": 354950,
      "active": 98113,
      "label": "Comércio varejista de móveis",
      "active_share": 0.2764135793773771
    },
    {
      "code": "4711301",
      "total": 350659,
      "active": 6162,
      "label": "Comércio varejista de mercadorias em geral, com predominância de produtos alimentícios - hipermercados",
      "active_share": 0.017572627538434776
    },
    {
      "code": "8112500",
      "total": 340366,
      "active": 336603,
      "label": "Condomínios prediais",
      "active_share": 0.9889442541264404
    },
    {
      "code": "4755502",
      "total": 339165,
      "active": 107999,
      "label": "Comercio varejista de artigos de armarinho",
      "active_share": 0.31842613477216103
    },
    {
      "code": "6462000",
      "total": 325871,
      "active": 242774,
      "label": "Holdings de instituições não-financeiras",
      "active_share": 0.7450003222133912
    },
    {
      "code": "9491000",
      "total": 318725,
      "active": 209026,
      "label": "Atividades de organizações religiosas ou filosóficas",
      "active_share": 0.655819279943525
    },
    {
      "code": "4744001",
      "total": 314204,
      "active": 74574,
      "label": "Comércio varejista de ferragens e ferramentas",
      "active_share": 0.2373426181716337
    },
    {
      "code": "7020400",
      "total": 313591,
      "active": 174442,
      "label": "Atividades de consultoria em gestão empresarial, exceto consultoria técnica específica",
      "active_share": 0.556272341999611
    },
    {
      "code": "3101200",
      "total": 309451,
      "active": 127852,
      "label": "Fabricação de móveis com predominância de madeira",
      "active_share": 0.41315749504768123
    },
    {
      "code": "4782201",
      "total": 306148,
      "active": 84104,
      "label": "Comércio varejista de calçados",
      "active_share": 0.2747168036374564
    },
    {
      "code": "8630503",
      "total": 305581,
      "active": 226132,
      "label": "Atividade médica ambulatorial restrita a consultas",
      "active_share": 0.740006741256819
    },
    {
      "code": "8299799",
      "total": 304207,
      "active": 79431,
      "label": "Outras atividades de serviços prestados principalmente às empresas não especificadas anteriormente",
      "active_share": 0.26110839001074926
    },
    {
      "code": "4724500",
      "total": 302248,
      "active": 108914,
      "label": "Comércio varejista de hortifrutigranjeiros",
      "active_share": 0.36034647044810886
    },
    {
      "code": "4520005",
      "total": 302002,
      "active": 115085,
      "label": "Serviços de lavagem, lubrificação e polimento de veículos automotores",
      "active_share": 0.38107363527393856
    },
    {
      "code": "4721102",
      "total": 290354,
      "active": 86839,
      "label": "Padaria e confeitaria com predominância de revenda",
      "active_share": 0.2990797440365898
    },
    {
      "code": "4789004",
      "total": 287228,
      "active": 117080,
      "label": "Comércio varejista de animais vivos e de artigos e alimentos para animais de estimação",
      "active_share": 0.40762042697787126
    },
    {
      "code": "4110700",
      "total": 283207,
      "active": 194751,
      "label": "Incorporação de empreendimentos imobiliários",
      "active_share": 0.6876630874236865
    },
    {
      "code": "4752100",
      "total": 276382,
      "active": 104055,
      "label": "Comércio varejista especializado de equipamentos de telefonia e comunicação",
      "active_share": 0.37648978587607007
    },
    {
      "code": "6911701",
      "total": 268215,
      "active": 208280,
      "label": "Serviços advocatícios",
      "active_share": 0.7765412076132953
    },
    {
      "code": "4753900",
      "total": 261053,
      "active": 76404,
      "label": "Comércio varejista especializado de eletrodomésticos e equipamentos de áudio e vídeo",
      "active_share": 0.29267619985213733
    },
    {
      "code": "8130300",
      "total": 260638,
      "active": 89224,
      "label": "Atividades paisagísticas",
      "active_share": 0.3423292075599107
    },
    {
      "code": "7112000",
      "total": 255718,
      "active": 162331,
      "label": "Serviços de engenharia",
      "active_share": 0.6348047458528535
    },
    {
      "code": "4789001",
      "total": 255229,
      "active": 86008,
      "label": "Comércio varejista de suvenires, bijuterias e artesanatos",
      "active_share": 0.3369836499770794
    },
    {
      "code": "1412602",
      "total": 247030,
      "active": 95625,
      "label": "Confecção, sob medida, de peças do vestuário, exceto roupas íntimas",
      "active_share": 0.3870987329474153
    },
    {
      "code": "4619200",
      "total": 243412,
      "active": 87404,
      "label": "Representantes comerciais e agentes do comércio de mercadorias em geral não especializado",
      "active_share": 0.359078434916931
    },
    {
      "code": "5229099",
      "total": 242976,
      "active": 20450,
      "label": "Outras atividades auxiliares dos transportes terrestres não especificadas anteriormente",
      "active_share": 0.08416469116291321
    },
    {
      "code": "0151201",
      "total": 242589,
      "active": 182445,
      "label": "Criação de bovinos para corte",
      "active_share": 0.7520744963704042
    },
    {
      "code": "5912099",
      "total": 238757,
      "active": 132446,
      "label": "Atividades de pós-produção cinematográfica, de vídeos e de programas de televisão não especificadas anteriormente",
      "active_share": 0.5547313796035299
    },
    {
      "code": "7911200",
      "total": 235363,
      "active": 97354,
      "label": "Agências de viagens",
      "active_share": 0.41363340881956806
    },
    {
      "code": "5819100",
      "total": 227672,
      "active": 95083,
      "label": "Edição de cadastros, listas e de outros produtos gráficos",
      "active_share": 0.4176315049720651
    },
    {
      "code": "2542000",
      "total": 223572,
      "active": 96516,
      "label": "Fabricação de artigos de serralheria, exceto esquadrias",
      "active_share": 0.4316998550802426
    },
    {
      "code": "7420001",
      "total": 216305,
      "active": 100654,
      "label": "Atividades de produção de fotografias, exceto aérea e submarina",
      "active_share": 0.4653336723607869
    },
    {
      "code": "4322302",
      "total": 207416,
      "active": 110303,
      "label": "Instalação e manutenção de sistemas centrais de ar condicionado, de ventilação e refrigeração",
      "active_share": 0.5317960041655417
    },
    {
      "code": "0113000",
      "total": 206917,
      "active": 156904,
      "label": "Cultivo de cana-de-açúcar",
      "active_share": 0.7582943885712629
    },
    {
      "code": "6920601",
      "total": 202058,
      "active": 113771,
      "label": "Atividades de contabilidade",
      "active_share": 0.5630611012679527
    },
    {
      "code": "4755503",
      "total": 201477,
      "active": 70546,
      "label": "Comercio varejista de artigos de cama, mesa e banho",
      "active_share": 0.35014418519235446
    },
    {
      "code": "4729601",
      "total": 201166,
      "active": 17477,
      "label": "Tabacaria",
      "active_share": 0.08687849835459273
    },
    {
      "code": "3299099",
      "total": 199034,
      "active": 75671,
      "label": "Fabricação de produtos diversos não especificados anteriormente",
      "active_share": 0.3801913240953807
    },
    {
      "code": "8291100",
      "total": 193178,
      "active": 74932,
      "label": "Atividades de cobranças e informações cadastrais",
      "active_share": 0.3878909606683991
    },
    {
      "code": "4923001",
      "total": 192952,
      "active": 84000,
      "label": "Serviço de táxi",
      "active_share": 0.43534143206600606
    },
    {
      "code": "8630504",
      "total": 187952,
      "active": 131897,
      "label": "Atividade odontológica",
      "active_share": 0.7017589597344003
    },
    {
      "code": "4520002",
      "total": 182073,
      "active": 90532,
      "label": "Serviços de lanternagem ou funilaria e pintura de veículos automotores",
      "active_share": 0.4972291333695825
    },
    {
      "code": "4541206",
      "total": 175375,
      "active": 73624,
      "label": "Comércio a varejo de peças e acessórios novos para  motocicletas e motonetas",
      "active_share": 0.41980898075552386
    },
    {
      "code": "9001902",
      "total": 175095,
      "active": 95460,
      "label": "Produção musical",
      "active_share": 0.5451897541334704
    },
    {
      "code": "4530701",
      "total": 172927,
      "active": 19710,
      "label": "Comércio por atacado de peças e acessórios novos para veículos automotores",
      "active_share": 0.11397873090957455
    },
    {
      "code": "4761003",
      "total": 170792,
      "active": 57487,
      "label": "Comércio varejista de artigos de papelaria",
      "active_share": 0.3365907068246756
    },
    {
      "code": "9313100",
      "total": 169303,
      "active": 84362,
      "label": "Atividades de condicionamento físico",
      "active_share": 0.4982900480204131
    },
    {
      "code": "5620101",
      "total": 166112,
      "active": 63883,
      "label": "Fornecimento de alimentos preparados preponderantemente para empresas",
      "active_share": 0.38457787516856096
    },
    {
      "code": "4713002",
      "total": 164735,
      "active": 58740,
      "label": "Lojas de variedades, exceto lojas de departamentos ou magazines",
      "active_share": 0.35657267733025766
    },
    {
      "code": "6209100",
      "total": 164606,
      "active": 79477,
      "label": "Suporte técnico, manutenção e outros serviços em tecnologia da informação",
      "active_share": 0.48283173152861986
    },
    {
      "code": "4755501",
      "total": 162681,
      "active": 17238,
      "label": "Comércio varejista de tecidos",
      "active_share": 0.1059619746620687
    },
    {
      "code": "4929901",
      "total": 162510,
      "active": 48615,
      "label": "Transporte rodoviário coletivo de passageiros, sob regime de fretamento, municipal",
      "active_share": 0.29915082148790845
    },
    {
      "code": "5611205",
      "total": 161966,
      "active": 79483,
      "label": "Bares e outros estabelecimentos especializados em servir bebidas, com entretenimento",
      "active_share": 0.4907387970314757
    },
    {
      "code": "4759899",
      "total": 161948,
      "active": 64833,
      "label": "Comércio varejista de outros artigos de uso pessoal e doméstico não especificados anteriormente",
      "active_share": 0.40033220539926395
    },
    {
      "code": "2539001",
      "total": 160525,
      "active": 81127,
      "label": "Serviços de usinagem, tornearia e solda",
      "active_share": 0.5053854539791309
    },
    {
      "code": "9521500",
      "total": 160370,
      "active": 47422,
      "label": "Reparação e manutenção de equipamentos eletroeletrônicos de uso pessoal e doméstico",
      "active_share": 0.29570368522791046
    },
    {
      "code": "4784900",
      "total": 159862,
      "active": 48753,
      "label": "Comércio varejista de gás liqüefeito de petróleo (GLP)",
      "active_share": 0.30496928600918294
    },
    {
      "code": "7319003",
      "total": 155453,
      "active": 49302,
      "label": "Marketing direto",
      "active_share": 0.3171505213794523
    },
    {
      "code": "6821801",
      "total": 154340,
      "active": 104659,
      "label": "Corretagem na compra e venda e avaliação de imóveis",
      "active_share": 0.6781067772450434
    },
    {
      "code": "4744005",
      "total": 154087,
      "active": 33713,
      "label": "Comércio varejista de materiais de construção não especificados anteriormente",
      "active_share": 0.21879198115350418
    },
    {
      "code": "8592999",
      "total": 151538,
      "active": 71505,
      "label": "Ensino de arte e cultura não especificado anteriormente",
      "active_share": 0.4718618432340403
    },
    {
      "code": "8599603",
      "total": 149779,
      "active": 58746,
      "label": "Treinamento em informática",
      "active_share": 0.39221786765835
    },
    {
      "code": "9512600",
      "total": 149471,
      "active": 62734,
      "label": "Reparação e manutenção de equipamentos de comunicação",
      "active_share": 0.4197068327635461
    },
    {
      "code": "1091101",
      "total": 146996,
      "active": 41341,
      "label": "Fabricação de produtos de panificação industrial",
      "active_share": 0.2812389452774225
    },
    {
      "code": "4731800",
      "total": 145470,
      "active": 60687,
      "label": "Comércio varejista de combustíveis para veículos automotores",
      "active_share": 0.4171787997525263
    },
    {
      "code": "9499500",
      "total": 144053,
      "active": 87707,
      "label": "Atividades associativas não especificadas anteriormente",
      "active_share": 0.6088522974183113
    },
    {
      "code": "4924800",
      "total": 143888,
      "active": 64253,
      "label": "Transporte escolar",
      "active_share": 0.4465487045479818
    },
    {
      "code": "5620102",
      "total": 142883,
      "active": 55240,
      "label": "Serviços de alimentação para eventos e recepções - bufê",
      "active_share": 0.386610023585731
    },
    {
      "code": "8650003",
      "total": 141526,
      "active": 113395,
      "label": "Atividades de psicologia e psicanálise",
      "active_share": 0.8012308692395743
    },
    {
      "code": "0161003",
      "total": 141260,
      "active": 72161,
      "label": "Serviço de preparação de terreno, cultivo e colheita",
      "active_share": 0.5108381707489735
    },
    {
      "code": "4783101",
      "total": 137473,
      "active": 58216,
      "label": "Comércio varejista de artigos de joalheria",
      "active_share": 0.42347224545910833
    },
    {
      "code": "7490104",
      "total": 136133,
      "active": 78459,
      "label": "Atividades de intermediação e agenciamento de serviços e negócios em geral, exceto imobiliários",
      "active_share": 0.5763407843799814
    },
    {
      "code": "4711302",
      "total": 130611,
      "active": 52196,
      "label": "Comércio varejista de mercadorias em geral, com predominância de produtos alimentícios - supermercados",
      "active_share": 0.3996294339680425
    },
    {
      "code": "6204000",
      "total": 129323,
      "active": 72451,
      "label": "Consultoria em tecnologia da informação",
      "active_share": 0.5602329052063438
    },
    {
      "code": "4721104",
      "total": 129083,
      "active": 35739,
      "label": "Comércio varejista de doces, balas, bombons e semelhantes",
      "active_share": 0.27686837151290256
    },
    {
      "code": "9609208",
      "total": 128914,
      "active": 59596,
      "label": "Higiene e embelezamento de animais domésticos",
      "active_share": 0.46229269125153205
    },
    {
      "code": "6201501",
      "total": 127199,
      "active": 69472,
      "label": "Desenvolvimento de programas de computador sob encomenda",
      "active_share": 0.5461678157847153
    },
    {
      "code": "5212500",
      "total": 126478,
      "active": 57656,
      "label": "Carga e descarga",
      "active_share": 0.45585793576748523
    },
    {
      "code": "4761001",
      "total": 125906,
      "active": 21841,
      "label": "Comércio varejista de livros",
      "active_share": 0.17347068447889696
    },
    {
      "code": "6622300",
      "total": 125045,
      "active": 73530,
      "label": "Corretores e agentes de seguros, de planos de previdência complementar e de saúde",
      "active_share": 0.588028309808469
    },
    {
      "code": "4789005",
      "total": 123608,
      "active": 48267,
      "label": "Comércio varejista de produtos saneantes domissanitários",
      "active_share": 0.390484434664423
    },
    {
      "code": "6810202",
      "total": 123334,
      "active": 87098,
      "label": "Aluguel de imóveis próprios",
      "active_share": 0.7061961827233366
    },
    {
      "code": "4511102",
      "total": 118353,
      "active": 53236,
      "label": "Comércio a varejo de automóveis, camionetas e utilitários usados",
      "active_share": 0.4498069334955599
    },
    {
      "code": "3329501",
      "total": 117504,
      "active": 53604,
      "label": "Serviços de montagem de móveis de qualquer material",
      "active_share": 0.45618872549019607
    },
    {
      "code": "9609299",
      "total": 116918,
      "active": 44717,
      "label": "Outras atividades de serviços pessoais não especificadas anteriormente",
      "active_share": 0.38246463333276315
    },
    {
      "code": "7490101",
      "total": 111534,
      "active": 5670,
      "label": "Serviços de tradução, interpretação e similares",
      "active_share": 0.05083651621926946
    },
    {
      "code": "4757100",
      "total": 111177,
      "active": 48191,
      "label": "Comércio varejista especializado de peças e acessórios para aparelhos eletroeletrônicos para uso doméstico, exceto informática e comunicação",
      "active_share": 0.4334619570594637
    },
    {
      "code": "3321000",
      "total": 110215,
      "active": 54465,
      "label": "Instalação de máquinas e equipamentos industriais",
      "active_share": 0.4941704849612122
    },
    {
      "code": "4330499",
      "total": 108160,
      "active": 41860,
      "label": "Outras obras de acabamento da construção",
      "active_share": 0.3870192307692308
    },
    {
      "code": "4763601",
      "total": 107770,
      "active": 41609,
      "label": "Comércio varejista de brinquedos e artigos recreativos",
      "active_share": 0.38609074881692496
    },
    {
      "code": "4520007",
      "total": 105209,
      "active": 51631,
      "label": "Serviços de instalação, manutenção e reparação de acessórios para veículos automotores",
      "active_share": 0.49074698932600824
    },
    {
      "code": "6810201",
      "total": 105081,
      "active": 83475,
      "label": "Compra e venda de imóveis próprios",
      "active_share": 0.7943871870271505
    },
    {
      "code": "4543900",
      "total": 104936,
      "active": 52194,
      "label": "Manutenção e reparação de motocicletas e motonetas",
      "active_share": 0.49738888465350306
    },
    {
      "code": "1412603",
      "total": 104290,
      "active": 40910,
      "label": "Facção de peças do vestuário, exceto roupas íntimas",
      "active_share": 0.3922715504842267
    },
    {
      "code": "4721103",
      "total": 103963,
      "active": 33213,
      "label": "Comércio varejista de laticínios e frios",
      "active_share": 0.31946942662293315
    },
    {
      "code": "4742300",
      "total": 103906,
      "active": 46980,
      "label": "Comércio varejista de material elétrico",
      "active_share": 0.4521394337189383
    },
    {
      "code": "4330403",
      "total": 101247,
      "active": 47196,
      "label": "Obras de acabamento em gesso e estuque",
      "active_share": 0.4661471451005956
    },
    {
      "code": "8650004",
      "total": 100453,
      "active": 69821,
      "label": "Atividades de fisioterapia",
      "active_share": 0.6950613719849084
    },
    {
      "code": "4520006",
      "total": 99264,
      "active": 46676,
      "label": "Serviços de borracharia para veículos automotores",
      "active_share": 0.47022082527401676
    },
    {
      "code": "9529102",
      "total": 98837,
      "active": 21091,
      "label": "Chaveiros",
      "active_share": 0.21339174600605038
    },
    {
      "code": "5510801",
      "total": 97612,
      "active": 42618,
      "label": "Hotéis",
      "active_share": 0.43660615498094496
    },
    {
      "code": "8593700",
      "total": 96346,
      "active": 36616,
      "label": "Ensino de idiomas",
      "active_share": 0.38004691424656967
    },
    {
      "code": "4763602",
      "total": 96247,
      "active": 36178,
      "label": "Comércio varejista de artigos esportivos",
      "active_share": 0.37588704063503275
    },
    {
      "code": "4789002",
      "total": 95978,
      "active": 36995,
      "label": "Comércio varejista de plantas e flores naturais",
      "active_share": 0.38545291629331724
    },
    {
      "code": "5223100",
      "total": 94872,
      "active": 35460,
      "label": "Estacionamento de veículos",
      "active_share": 0.37376675942322285
    },
    {
      "code": "4929902",
      "total": 94728,
      "active": 39180,
      "label": "Transporte rodoviário coletivo de passageiros, sob regime de fretamento, intermunicipal, interestadual e internacional",
      "active_share": 0.4136052698251837
    },
    {
      "code": "7311400",
      "total": 92149,
      "active": 34163,
      "label": "Agências de publicidade",
      "active_share": 0.37073652454177475
    },
    {
      "code": "9312300",
      "total": 92019,
      "active": 26408,
      "label": "Clubes sociais, esportivos e similares",
      "active_share": 0.28698420978276223
    },
    {
      "code": "6190699",
      "total": 90901,
      "active": 34595,
      "label": "Outras atividades de telecomunicações não especificadas anteriormente",
      "active_share": 0.38057887151956526
    },
    {
      "code": "2512800",
      "total": 88481,
      "active": 31756,
      "label": "Fabricação de esquadrias de metal",
      "active_share": 0.35890191114476555
    },
    {
      "code": "4330405",
      "total": 86036,
      "active": 42417,
      "label": "Aplicação de revestimentos e de resinas em interiores e exteriores",
      "active_share": 0.4930145520479799
    },
    {
      "code": "6470101",
      "total": 85796,
      "active": 40136,
      "label": "Fundos de investimento, exceto previdenciários e imobiliários",
      "active_share": 0.4678073569863397
    },
    {
      "code": "4322301",
      "total": 85759,
      "active": 38974,
      "label": "Instalações hidráulicas, sanitárias e de gás",
      "active_share": 0.45445959024708776
    },
    {
      "code": "4617600",
      "total": 84929,
      "active": 31135,
      "label": "Representantes comerciais e agentes do comércio de produtos alimentícios, bebidas e fumo",
      "active_share": 0.3666003367518751
    },
    {
      "code": "4743100",
      "total": 83111,
      "active": 31898,
      "label": "Comércio varejista de vidros",
      "active_share": 0.383799978342217
    },
    {
      "code": "4754702",
      "total": 81941,
      "active": 24922,
      "label": "Comércio varejista de artigos de colchoaria",
      "active_share": 0.3041456657839177
    },
    {
      "code": "7111100",
      "total": 81665,
      "active": 45179,
      "label": "Serviços de arquitetura",
      "active_share": 0.5532235351741872
    },
    {
      "code": "4713004",
      "total": 81372,
      "active": 11255,
      "label": "Lojas de departamentos ou magazines, exceto lojas francas (Duty free)",
      "active_share": 0.13831539104360221
    },
    {
      "code": "8599605",
      "total": 80636,
      "active": 32349,
      "label": "Cursos preparatórios para concursos",
      "active_share": 0.40117317327248375
    },
    {
      "code": "1359600",
      "total": 79987,
      "active": 36717,
      "label": "Fabricação de outros produtos têxteis não especificados anteriormente",
      "active_share": 0.4590370935276982
    },
    {
      "code": "1096100",
      "total": 77957,
      "active": 30826,
      "label": "Fabricação de alimentos e pratos prontos",
      "active_share": 0.3954231178726734
    },
    {
      "code": "4789007",
      "total": 77632,
      "active": 12356,
      "label": "Comércio varejista de equipamentos para escritório",
      "active_share": 0.15916117065127783
    },
    {
      "code": "4930204",
      "total": 76930,
      "active": 36678,
      "label": "Transporte rodoviário de mudanças",
      "active_share": 0.47677109060184586
    },
    {
      "code": "0151202",
      "total": 75792,
      "active": 60132,
      "label": "Criação de bovinos para leite",
      "active_share": 0.7933818872704244
    },
    {
      "code": "7711000",
      "total": 75613,
      "active": 35228,
      "label": "Locação de automóveis sem condutor",
      "active_share": 0.46589872111938424
    },
    {
      "code": "7810800",
      "total": 74519,
      "active": 8218,
      "label": "Seleção e agenciamento de mão-de-obra",
      "active_share": 0.11028059957863096
    },
    {
      "code": "4618499",
      "total": 73981,
      "active": 19613,
      "label": "Outros representantes comerciais e agentes do comércio especializado em produtos não especificados anteriormente",
      "active_share": 0.26510860896716726
    },
    {
      "code": "4744002",
      "total": 73905,
      "active": 27829,
      "label": "Comércio varejista de madeira e artefatos",
      "active_share": 0.37655097760638656
    },
    {
      "code": "4763603",
      "total": 73483,
      "active": 28064,
      "label": "Comércio varejista de bicicletas e triciclos; peças e acessórios",
      "active_share": 0.3819114625151396
    },
    {
      "code": "4520003",
      "total": 73287,
      "active": 40357,
      "label": "Serviços de manutenção e reparação elétrica de veículos automotores",
      "active_share": 0.5506706510022241
    },
    {
      "code": "9001906",
      "total": 71771,
      "active": 36442,
      "label": "Atividades de sonorização e de iluminação",
      "active_share": 0.5077538281478592
    },
    {
      "code": "9329899",
      "total": 71697,
      "active": 28285,
      "label": "Outras atividades de recreação e lazer não especificadas anteriormente",
      "active_share": 0.3945074410365845
    },
    {
      "code": "4330402",
      "total": 71072,
      "active": 23194,
      "label": "Instalação de portas, janelas, tetos, divisórias e armários embutidos de qualquer material",
      "active_share": 0.3263451148131472
    },
    {
      "code": "8512100",
      "total": 70585,
      "active": 22379,
      "label": "Educação infantil - pré-escola",
      "active_share": 0.31705036480838705
    },
    {
      "code": "3212400",
      "total": 70541,
      "active": 24594,
      "label": "Fabricação de bijuterias e artefatos semelhantes",
      "active_share": 0.3486483038233084
    },
    {
      "code": "9609206",
      "total": 70138,
      "active": 33344,
      "label": "Serviços de tatuagem e colocação de piercing",
      "active_share": 0.47540562890301974
    },
    {
      "code": "6311900",
      "total": 69673,
      "active": 22043,
      "label": "Tratamento de dados, provedores de serviços de aplicação e serviços de hospedagem na internet",
      "active_share": 0.31637793693396293
    },
    {
      "code": "6822600",
      "total": 68961,
      "active": 48561,
      "label": "Gestão e administração da propriedade imobiliária",
      "active_share": 0.7041806238308609
    },
    {
      "code": "1813099",
      "total": 68481,
      "active": 25766,
      "label": "Impressão de material para outros usos",
      "active_share": 0.37625034681152436
    },
    {
      "code": "4399199",
      "total": 68477,
      "active": 36162,
      "label": "Serviços especializados para construção não especificados anteriormente",
      "active_share": 0.5280897235568147
    },
    {
      "code": "8230002",
      "total": 68332,
      "active": 29556,
      "label": "Casas de festas e eventos",
      "active_share": 0.43253526898085815
    },
    {
      "code": "4649401",
      "total": 68242,
      "active": 2901,
      "label": "Comércio atacadista de equipamentos elétricos de uso pessoal e doméstico",
      "active_share": 0.042510477418598515
    },
    {
      "code": "4639701",
      "total": 68148,
      "active": 23127,
      "label": "Comércio atacadista de produtos alimentícios em geral",
      "active_share": 0.33936432470505373
    },
    {
      "code": "5811500",
      "total": 67381,
      "active": 32794,
      "label": "Edição de livros",
      "active_share": 0.4866950624063163
    },
    {
      "code": "6463800",
      "total": 66837,
      "active": 50317,
      "label": "Outras sociedades de participação, exceto holdings",
      "active_share": 0.7528315154779538
    },
    {
      "code": "7739099",
      "total": 66497,
      "active": 40985,
      "label": "Aluguel de outras máquinas e equipamentos comerciais e industriais não especificados anteriormente, sem operador",
      "active_share": 0.6163435944478698
    },
    {
      "code": "1821100",
      "total": 66405,
      "active": 26027,
      "label": "Serviços de pré-impressão",
      "active_share": 0.39194337775769894
    },
    {
      "code": "1629301",
      "total": 65718,
      "active": 22654,
      "label": "Fabricação de artefatos diversos de madeira, exceto móveis",
      "active_share": 0.3447152987005082
    },
    {
      "code": "9601701",
      "total": 65402,
      "active": 28273,
      "label": "Lavanderias",
      "active_share": 0.4322956484511177
    },
    {
      "code": "0121101",
      "total": 64356,
      "active": 50335,
      "label": "Horticultura, exceto morango",
      "active_share": 0.7821337559823481
    },
    {
      "code": "7500100",
      "total": 64175,
      "active": 46294,
      "label": "Atividades veterinárias",
      "active_share": 0.7213712504869497
    },
    {
      "code": "4785799",
      "total": 63832,
      "active": 24326,
      "label": "Comércio varejista de outros artigos usados",
      "active_share": 0.3810941220704349
    },
    {
      "code": "6630400",
      "total": 63407,
      "active": 26646,
      "label": "Atividades de administração de fundos por contrato ou comissão",
      "active_share": 0.42023751320832087
    },
    {
      "code": "8610102",
      "total": 63375,
      "active": 49348,
      "label": "Atividades de atendimento em pronto-socorro e unidades hospitalares para atendimento a urgências",
      "active_share": 0.7786666666666666
    },
    {
      "code": "5590699",
      "total": 62740,
      "active": 32731,
      "label": "Outros alojamentos não especificados anteriormente",
      "active_share": 0.5216927000318776
    },
    {
      "code": "7319099",
      "total": 61821,
      "active": 22812,
      "label": "Outras atividades de publicidade não especificadas anteriormente",
      "active_share": 0.3690008249623914
    },
    {
      "code": "8411600",
      "total": 60886,
      "active": 49288,
      "label": "Administração pública em geral",
      "active_share": 0.8095128600992018
    },
    {
      "code": "8129000",
      "total": 60062,
      "active": 34654,
      "label": "Atividades de limpeza não especificadas anteriormente",
      "active_share": 0.5769704638540175
    },
    {
      "code": "8630599",
      "total": 59982,
      "active": 47472,
      "label": "Atividades de atenção ambulatorial não especificadas anteriormente",
      "active_share": 0.7914374312293688
    },
    {
      "code": "4773300",
      "total": 59736,
      "active": 21757,
      "label": "Comércio varejista de artigos médicos e ortopédicos",
      "active_share": 0.36421923128431766
    },
    {
      "code": "0115600",
      "total": 59440,
      "active": 47391,
      "label": "Cultivo de soja",
      "active_share": 0.7972913862718708
    },
    {
      "code": "4693100",
      "total": 59390,
      "active": 8576,
      "label": "Comércio atacadista de mercadorias em geral, sem predominância de alimentos ou de insumos agropecuários",
      "active_share": 0.14440141437952517
    },
    {
      "code": "1813001",
      "total": 58909,
      "active": 26183,
      "label": "Impressão de material para uso publicitário",
      "active_share": 0.4444651920759137
    },
    {
      "code": "7732201",
      "total": 57949,
      "active": 32263,
      "label": "Aluguel de máquinas e equipamentos para construção sem operador, exceto andaimes",
      "active_share": 0.5567481751195016
    },
    {
      "code": "1094500",
      "total": 57935,
      "active": 18436,
      "label": "Fabricação de massas alimentícias",
      "active_share": 0.3182186933632519
    },
    {
      "code": "6319400",
      "total": 56874,
      "active": 31667,
      "label": "Portais, provedores de conteúdo e outros serviços de informação na internet",
      "active_share": 0.5567922073355136
    },
    {
      "code": "8513900",
      "total": 56104,
      "active": 27856,
      "label": "Ensino fundamental",
      "active_share": 0.49650648795094826
    },
    {
      "code": "3811400",
      "total": 56045,
      "active": 22858,
      "label": "Coleta de resíduos não-perigosos",
      "active_share": 0.40785083415112855
    },
    {
      "code": "4642701",
      "total": 55705,
      "active": 11992,
      "label": "Comércio atacadista de artigos do vestuário e acessórios, exceto profissionais e de segurança",
      "active_share": 0.21527690512521316
    },
    {
      "code": "7420004",
      "total": 55698,
      "active": 30453,
      "label": "Filmagem de festas e eventos",
      "active_share": 0.5467521275449747
    },
    {
      "code": "8121400",
      "total": 55261,
      "active": 16046,
      "label": "Limpeza em prédios e em domicílios",
      "active_share": 0.29036752863683246
    },
    {
      "code": "4633801",
      "total": 55063,
      "active": 17482,
      "label": "Comércio atacadista de frutas, verduras, raízes, tubérculos, hortaliças e legumes frescos",
      "active_share": 0.3174908740896791
    },
    {
      "code": "4530704",
      "total": 55022,
      "active": 23050,
      "label": "Comércio a varejo de peças e acessórios usados para veículos automotores",
      "active_share": 0.41892333975500706
    },
    {
      "code": "0111302",
      "total": 54555,
      "active": 43675,
      "label": "Cultivo de milho",
      "active_share": 0.8005682338924022
    },
    {
      "code": "6202300",
      "total": 53888,
      "active": 38037,
      "label": "Desenvolvimento e licenciamento de programas de computador customizáveis",
      "active_share": 0.7058528800475059
    },
    {
      "code": "3314707",
      "total": 53758,
      "active": 25836,
      "label": "Manutenção e reparação de máquinas e aparelhos de refrigeração e ventilação para uso industrial e comercial",
      "active_share": 0.480598236541538
    },
    {
      "code": "8630502",
      "total": 53007,
      "active": 39506,
      "label": "Atividade médica ambulatorial com recursos para realização de exames complementares",
      "active_share": 0.7452977908578112
    },
    {
      "code": "4722902",
      "total": 52241,
      "active": 16527,
      "label": "Peixaria",
      "active_share": 0.3163607128500603
    },
    {
      "code": "5812301",
      "total": 52067,
      "active": 21166,
      "label": "Edição de jornais diários",
      "active_share": 0.40651468300459026
    },
    {
      "code": "1622699",
      "total": 52066,
      "active": 22076,
      "label": "Fabricação de outros artigos de carpintaria para construção",
      "active_share": 0.4240003073022702
    },
    {
      "code": "9529105",
      "total": 50399,
      "active": 22191,
      "label": "Reparação de artigos do mobiliário",
      "active_share": 0.4403063552848271
    },
    {
      "code": "4741500",
      "total": 49823,
      "active": 20386,
      "label": "Comércio varejista de tintas e materiais para pintura",
      "active_share": 0.4091684563354274
    },
    {
      "code": "7729202",
      "total": 49629,
      "active": 23445,
      "label": "Aluguel de móveis, utensílios e aparelhos de uso doméstico e pessoal; instrumentos musicais",
      "active_share": 0.4724052469322372
    },
    {
      "code": "9420100",
      "total": 49253,
      "active": 26530,
      "label": "Atividades de organizações sindicais",
      "active_share": 0.5386473920370333
    },
    {
      "code": "8640202",
      "total": 48748,
      "active": 28540,
      "label": "Laboratórios clínicos",
      "active_share": 0.5854599163042586
    },
    {
      "code": "0139306",
      "total": 48465,
      "active": 29917,
      "label": "Cultivo de seringueira",
      "active_share": 0.6172908284328897
    },
    {
      "code": "6821802",
      "total": 48463,
      "active": 18131,
      "label": "Corretagem no aluguel de imóveis",
      "active_share": 0.37412046303365454
    },
    {
      "code": "1411801",
      "total": 47689,
      "active": 11818,
      "label": "Confecção de roupas íntimas",
      "active_share": 0.24781396129086372
    },
    {
      "code": "1340599",
      "total": 47602,
      "active": 19056,
      "label": "Outros serviços de acabamento em fios, tecidos, artefatos têxteis e peças do vestuário",
      "active_share": 0.4003193143145246
    },
    {
      "code": "2391503",
      "total": 47506,
      "active": 24566,
      "label": "Aparelhamento de placas e execução de trabalhos em mármore, granito, ardósia e outras pedras",
      "active_share": 0.517113627752284
    },
    {
      "code": "4530705",
      "total": 47505,
      "active": 19797,
      "label": "Comércio a varejo de pneumáticos e câmaras-de-ar",
      "active_share": 0.41673508051784025
    },
    {
      "code": "5229002",
      "total": 47314,
      "active": 27512,
      "label": "Serviços de reboque de veículos",
      "active_share": 0.5814769412858773
    },
    {
      "code": "1610203",
      "total": 47225,
      "active": 8989,
      "label": "Serrarias com desdobramento de madeira em bruto",
      "active_share": 0.19034409740603495
    },
    {
      "code": "8610101",
      "total": 47110,
      "active": 29435,
      "label": "Atividades de atendimento hospitalar, exceto pronto-socorro e unidades para atendimento a urgências",
      "active_share": 0.62481426448737
    },
    {
      "code": "4689399",
      "total": 46944,
      "active": 8203,
      "label": "Comércio atacadista especializado em outros produtos intermediários não especificados anteriormente",
      "active_share": 0.17474011588275393
    },
    {
      "code": "1749400",
      "total": 46146,
      "active": 20630,
      "label": "Fabricação de produtos de pastas celulósicas, papel, cartolina, papel-cartão e papelão ondulado não especificados anteriormente",
      "active_share": 0.44705933342001475
    },
    {
      "code": "8711502",
      "total": 46115,
      "active": 10811,
      "label": "Instituições de longa permanência para idosos",
      "active_share": 0.23443565000542124
    },
    {
      "code": "6203100",
      "total": 45552,
      "active": 20961,
      "label": "Desenvolvimento e licenciamento de programas de computador não-customizáveis",
      "active_share": 0.4601554267650158
    },
    {
      "code": "4613300",
      "total": 45397,
      "active": 19468,
      "label": "Representantes comerciais e agentes do comércio de madeira, material de construção e ferragens",
      "active_share": 0.42883891006013614
    },
    {
      "code": "1531901",
      "total": 45259,
      "active": 5645,
      "label": "Fabricação de calçados de couro",
      "active_share": 0.12472657372014406
    },
    {
      "code": "6422100",
      "total": 45232,
      "active": 15222,
      "label": "Bancos múltiplos, com carteira comercial",
      "active_share": 0.3365316590024761
    },
    {
      "code": "7723300",
      "total": 44222,
      "active": 8455,
      "label": "Aluguel de objetos do vestuário, jóias e acessórios",
      "active_share": 0.1911944281127041
    },
    {
      "code": "4313400",
      "total": 44177,
      "active": 22649,
      "label": "Obras de terraplenagem",
      "active_share": 0.5126875976186703
    },
    {
      "code": "8592903",
      "total": 43923,
      "active": 21713,
      "label": "Ensino de música",
      "active_share": 0.49434237187805935
    },
    {
      "code": "8299707",
      "total": 43388,
      "active": 9134,
      "label": "Salas de acesso à internet",
      "active_share": 0.21051903752189546
    },
    {
      "code": "9529199",
      "total": 43024,
      "active": 15624,
      "label": "Reparação e manutenção de outros objetos e equipamentos pessoais e domésticos não especificados anteriormente",
      "active_share": 0.36314615098549646
    },
    {
      "code": "0134200",
      "total": 42963,
      "active": 32277,
      "label": "Cultivo de café",
      "active_share": 0.7512743523496962
    },
    {
      "code": "5813100",
      "total": 42918,
      "active": 16641,
      "label": "Edição de revistas",
      "active_share": 0.3877394100377464
    },
    {
      "code": "4759801",
      "total": 42670,
      "active": 18013,
      "label": "Comércio varejista de artigos de tapeçaria, cortinas e persianas",
      "active_share": 0.4221467072884931
    },
    {
      "code": "4616800",
      "total": 42606,
      "active": 15492,
      "label": "Representantes comerciais e agentes do comércio de têxteis, vestuário, calçados e artigos de viagem",
      "active_share": 0.3636107590480214
    },
    {
      "code": "4511101",
      "total": 42525,
      "active": 18959,
      "label": "Comércio a varejo de automóveis, camionetas e utilitários novos",
      "active_share": 0.4458318636096414
    },
    {
      "code": "7490103",
      "total": 42401,
      "active": 22262,
      "label": "Serviços de agronomia e de consultoria às atividades agrícolas e pecuárias",
      "active_share": 0.525034786915403
    },
    {
      "code": "8511200",
      "total": 41472,
      "active": 19006,
      "label": "Educação infantil - creche",
      "active_share": 0.45828510802469136
    },
    {
      "code": "8219901",
      "total": 41457,
      "active": 14048,
      "label": "Fotocópias",
      "active_share": 0.33885712907349785
    },
    {
      "code": "6399200",
      "total": 41137,
      "active": 20010,
      "label": "Outras atividades de prestação de serviços de informação não especificadas anteriormente",
      "active_share": 0.48642341444441745
    },
    {
      "code": "8630501",
      "total": 41038,
      "active": 32079,
      "label": "Atividade médica ambulatorial com recursos para realização de procedimentos cirúrgicos",
      "active_share": 0.7816901408450704
    },
    {
      "code": "5911199",
      "total": 40740,
      "active": 27092,
      "label": "Atividades de produção cinematográfica, de vídeos e de programas de televisão não especificadas anteriormente",
      "active_share": 0.6649975454099165
    },
    {
      "code": "4789008",
      "total": 40359,
      "active": 14020,
      "label": "Comércio varejista de artigos fotográficos e para filmagem",
      "active_share": 0.34738224435689685
    },
    {
      "code": "7721700",
      "total": 40229,
      "active": 18477,
      "label": "Aluguel de equipamentos recreativos e esportivos",
      "active_share": 0.4592955330731562
    },
    {
      "code": "4771704",
      "total": 40049,
      "active": 14565,
      "label": "Comércio varejista de medicamentos veterinários",
      "active_share": 0.3636794926215386
    },
    {
      "code": "7490199",
      "total": 39346,
      "active": 22094,
      "label": "Outras atividades profissionais, científicas e técnicas não especificadas anteriormente",
      "active_share": 0.5615310323794033
    },
    {
      "code": "1340501",
      "total": 38836,
      "active": 12328,
      "label": "Estamparia e texturização em fios, tecidos, artefatos têxteis e peças do vestuário",
      "active_share": 0.31743742918941187
    },
    {
      "code": "2599301",
      "total": 38470,
      "active": 16826,
      "label": "Serviços de confecção de armações metálicas para a construção",
      "active_share": 0.4373797764491812
    },
    {
      "code": "2330399",
      "total": 38076,
      "active": 14309,
      "label": "Fabricação de outros artefatos e produtos de concreto, cimento, fibrocimento, gesso e materiais semelhantes",
      "active_share": 0.37580102951990757
    },
    {
      "code": "5620103",
      "total": 36571,
      "active": 11429,
      "label": "Cantinas - serviços de alimentação privativos",
      "active_share": 0.31251538103962156
    },
    {
      "code": "8111700",
      "total": 35951,
      "active": 18305,
      "label": "Serviços combinados para apoio a edifícios, exceto condomínios prediais",
      "active_share": 0.5091652527050707
    },
    {
      "code": "2229399",
      "total": 35682,
      "active": 16745,
      "label": "Fabricação de artefatos de material plástico para outros usos não especificados anteriormente",
      "active_share": 0.4692842329465837
    },
    {
      "code": "4921301",
      "total": 34981,
      "active": 9679,
      "label": "Transporte rodoviário coletivo de passageiros, com itinerário fixo, municipal",
      "active_share": 0.2766930619479146
    },
    {
      "code": "6619399",
      "total": 34702,
      "active": 15990,
      "label": "Outras atividades auxiliares dos serviços financeiros não especificadas anteriormente",
      "active_share": 0.4607803584807792
    },
    {
      "code": "4930203",
      "total": 33996,
      "active": 18006,
      "label": "Transporte rodoviário de produtos perigosos",
      "active_share": 0.5296505471231909
    },
    {
      "code": "4763604",
      "total": 33663,
      "active": 13555,
      "label": "Comércio varejista de artigos de caça, pesca e camping",
      "active_share": 0.4026676172652467
    },
    {
      "code": "9493600",
      "total": 33649,
      "active": 20765,
      "label": "Atividades de organizações associativas ligadas à cultura e à arte",
      "active_share": 0.6171060061220244
    },
    {
      "code": "9001999",
      "total": 33613,
      "active": 11625,
      "label": "Artes cênicas, espetáculos e atividades complementares não especificadas anteriormente",
      "active_share": 0.3458483324904055
    },
    {
      "code": "1422300",
      "total": 33542,
      "active": 14093,
      "label": "Fabricação de artigos do vestuário, produzidos em malharias e tricotagens, exceto meias",
      "active_share": 0.42015979965416494
    },
    {
      "code": "4782202",
      "total": 33536,
      "active": 10081,
      "label": "Comércio varejista de artigos de viagem",
      "active_share": 0.30060233778625955
    },
    {
      "code": "1531902",
      "total": 33486,
      "active": 12779,
      "label": "Acabamento de calçados de couro sob contrato",
      "active_share": 0.3816221704592964
    },
    {
      "code": "6110803",
      "total": 32910,
      "active": 23449,
      "label": "Serviços de comunicação multimídia - SCM",
      "active_share": 0.7125189911880887
    },
    {
      "code": "1351100",
      "total": 32837,
      "active": 10217,
      "label": "Fabricação de artefatos têxteis para uso doméstico",
      "active_share": 0.31114291804976096
    },
    {
      "code": "2342702",
      "total": 32832,
      "active": 7127,
      "label": "Fabricação de artefatos de cerâmica e barro cozido para uso na construção, exceto azulejos e pisos",
      "active_share": 0.21707480506822613
    },
    {
      "code": "4632001",
      "total": 32524,
      "active": 7332,
      "label": "Comércio atacadista de cereais e leguminosas beneficiados",
      "active_share": 0.2254335260115607
    },
    {
      "code": "7912100",
      "total": 32499,
      "active": 17078,
      "label": "Operadores turísticos",
      "active_share": 0.5254930920951414
    },
    {
      "code": "4511103",
      "total": 32490,
      "active": 1625,
      "label": "Comércio por atacado de automóveis, camionetas e utilitários novos e usados",
      "active_share": 0.05001538935056941
    },
    {
      "code": "8650099",
      "total": 32290,
      "active": 16695,
      "label": "Atividades de profissionais da área de saúde não especificadas anteriormente",
      "active_share": 0.5170331371941778
    },
    {
      "code": "5812302",
      "total": 32039,
      "active": 13592,
      "label": "Edição de jornais não diários",
      "active_share": 0.424232966072599
    },
    {
      "code": "3314711",
      "total": 31981,
      "active": 18843,
      "label": "Manutenção e reparação de máquinas e equipamentos para agricultura e pecuária",
      "active_share": 0.5891935836903162
    },
    {
      "code": "8650001",
      "total": 31626,
      "active": 15784,
      "label": "Atividades de enfermagem",
      "active_share": 0.4990830329475748
    },
    {
      "code": "4671100",
      "total": 31503,
      "active": 5574,
      "label": "Comércio atacadista de madeira e produtos derivados",
      "active_share": 0.1769355299495286
    },
    {
      "code": "8599601",
      "total": 31462,
      "active": 14539,
      "label": "Formação de condutores",
      "active_share": 0.4621130252367936
    },
    {
      "code": "9001901",
      "total": 31429,
      "active": 17347,
      "label": "Produção teatral",
      "active_share": 0.5519424735117249
    },
    {
      "code": "0131800",
      "total": 31368,
      "active": 23030,
      "label": "Cultivo de laranja",
      "active_share": 0.7341877072175466
    },
    {
      "code": "8011101",
      "total": 31126,
      "active": 9377,
      "label": "Atividades de vigilância e segurança privada",
      "active_share": 0.30125939728844053
    },
    {
      "code": "4618401",
      "total": 30949,
      "active": 11715,
      "label": "Representantes comerciais e agentes do comércio de medicamentos, cosméticos e produtos de perfumaria",
      "active_share": 0.37852596206662575
    },
    {
      "code": "2330301",
      "total": 30417,
      "active": 6983,
      "label": "Fabricação de estruturas pré-moldadas de concreto armado, em série e sob encomenda",
      "active_share": 0.2295755662951639
    },
    {
      "code": "4635401",
      "total": 30338,
      "active": 2183,
      "label": "Comércio atacadista de água mineral",
      "active_share": 0.07195596281890698
    },
    {
      "code": "8650006",
      "total": 30304,
      "active": 23516,
      "label": "Atividades de fonoaudiologia",
      "active_share": 0.7760031678986272
    },
    {
      "code": "7722500",
      "total": 30035,
      "active": 1529,
      "label": "Aluguel de fitas de vídeo, DVDs e similares",
      "active_share": 0.050907274846012984
    },
    {
      "code": "2599399",
      "total": 29771,
      "active": 11634,
      "label": "Fabricação de outros produtos de metal não especificados anteriormente",
      "active_share": 0.39078297672231366
    },
    {
      "code": "4729602",
      "total": 29490,
      "active": 14555,
      "label": "Comércio varejista de mercadorias em lojas de conveniência",
      "active_share": 0.4935571380128857
    },
    {
      "code": "4637101",
      "total": 29366,
      "active": 1556,
      "label": "Comércio atacadista de café torrado, moído e solúvel",
      "active_share": 0.052986446911394126
    },
    {
      "code": "1052000",
      "total": 29221,
      "active": 8785,
      "label": "Fabricação de laticínios",
      "active_share": 0.30063995072037236
    },
    {
      "code": "4761002",
      "total": 28955,
      "active": 6544,
      "label": "Comércio varejista de jornais e revistas",
      "active_share": 0.22600587117941634
    },
    {
      "code": "8690901",
      "total": 28952,
      "active": 10153,
      "label": "Atividades de práticas integrativas e complementares em saúde humana",
      "active_share": 0.3506838905775076
    },
    {
      "code": "4663000",
      "total": 28941,
      "active": 13198,
      "label": "Comércio atacadista de Máquinas e equipamentos para uso industrial; partes e peças",
      "active_share": 0.4560312359628209
    },
    {
      "code": "1093701",
      "total": 28921,
      "active": 8413,
      "label": "Fabricação de produtos derivados do cacau e de chocolates",
      "active_share": 0.2908958888005256
    },
    {
      "code": "4744004",
      "total": 28246,
      "active": 11476,
      "label": "Comércio varejista de cal, areia, pedra britada, tijolos e telhas",
      "active_share": 0.40628761594562063
    },
    {
      "code": "6619302",
      "total": 28039,
      "active": 12473,
      "label": "Correspondentes de instituições financeiras",
      "active_share": 0.44484468062341737
    },
    {
      "code": "3299003",
      "total": 27992,
      "active": 13632,
      "label": "Fabricação de letras, letreiros e placas de qualquer material, exceto luminosos",
      "active_share": 0.4869962846527579
    },
    {
      "code": "4646001",
      "total": 27562,
      "active": 9290,
      "label": "Comércio atacadista de cosméticos e produtos de perfumaria",
      "active_share": 0.33705826863072347
    },
    {
      "code": "8650002",
      "total": 27242,
      "active": 19030,
      "label": "Atividades de profissionais da nutrição",
      "active_share": 0.6985537038396593
    },
    {
      "code": "8550301",
      "total": 27113,
      "active": 22630,
      "label": "Administração de caixas escolares",
      "active_share": 0.8346549625640837
    },
    {
      "code": "8591100",
      "total": 27002,
      "active": 16800,
      "label": "Ensino de esportes",
      "active_share": 0.6221761351011036
    },
    {
      "code": "9412099",
      "total": 26701,
      "active": 11337,
      "label": "Outras atividades associativas profissionais",
      "active_share": 0.42459083929440844
    },
    {
      "code": "8800600",
      "total": 26598,
      "active": 16905,
      "label": "Serviços de assistência social sem alojamento",
      "active_share": 0.6355741033160388
    },
    {
      "code": "7990200",
      "total": 26591,
      "active": 12471,
      "label": "Serviços de reservas e outros serviços de turismo não especificados anteriormente",
      "active_share": 0.4689932683990824
    },
    {
      "code": "3314710",
      "total": 26558,
      "active": 14646,
      "label": "Manutenção e reparação de máquinas e equipamentos para uso geral não especificados anteriormente",
      "active_share": 0.5514722494163717
    },
    {
      "code": "9319101",
      "total": 26519,
      "active": 13670,
      "label": "Produção e promoção de eventos esportivos",
      "active_share": 0.5154794675515668
    },
    {
      "code": "9603304",
      "total": 26337,
      "active": 13105,
      "label": "Serviços de funerárias",
      "active_share": 0.4975889433116908
    },
    {
      "code": "4789003",
      "total": 26074,
      "active": 10744,
      "label": "Comércio varejista de objetos de arte",
      "active_share": 0.41205798880110456
    },
    {
      "code": "4683400",
      "total": 25937,
      "active": 13618,
      "label": "Comércio atacadista de defensivos agrícolas, adubos, fertilizantes e corretivos do solo",
      "active_share": 0.5250414465821028
    },
    {
      "code": "5211701",
      "total": 25196,
      "active": 6584,
      "label": "Armazéns gerais - emissão de warrant",
      "active_share": 0.26131131925702494
    },
    {
      "code": "4762800",
      "total": 25071,
      "active": 3360,
      "label": "Comércio varejista de discos, CDs, DVDs e fitas",
      "active_share": 0.13401938494675122
    },
    {
      "code": "8122200",
      "total": 25037,
      "active": 8772,
      "label": "Imunização e controle de pragas urbanas",
      "active_share": 0.350361465031753
    },
    {
      "code": "5590603",
      "total": 24988,
      "active": 6958,
      "label": "Pensões (alojamento)",
      "active_share": 0.2784536577557227
    },
    {
      "code": "7119703",
      "total": 24904,
      "active": 12053,
      "label": "Serviços de desenho técnico relacionados à arquitetura e engenharia",
      "active_share": 0.4839784773530357
    },
    {
      "code": "1529700",
      "total": 24622,
      "active": 7379,
      "label": "Fabricação de artefatos de couro não especificados anteriormente",
      "active_share": 0.29969133295426853
    },
    {
      "code": "8550302",
      "total": 24585,
      "active": 16038,
      "label": "Atividades de apoio à educação, exceto caixas escolares",
      "active_share": 0.6523489932885906
    },
    {
      "code": "4623109",
      "total": 24558,
      "active": 7148,
      "label": "Comércio atacadista de alimentos para animais",
      "active_share": 0.291066047723756
    },
    {
      "code": "8020001",
      "total": 24353,
      "active": 12883,
      "label": "Atividades de monitoramento de sistemas de segurança eletrônico",
      "active_share": 0.5290107994908225
    },
    {
      "code": "4329101",
      "total": 24157,
      "active": 11742,
      "label": "Instalação de painéis publicitários",
      "active_share": 0.48607029018503956
    },
    {
      "code": "4649499",
      "total": 23923,
      "active": 10671,
      "label": "Comércio atacadista de outros equipamentos e artigos de uso pessoal e doméstico não especificados anteriormente",
      "active_share": 0.44605609664339757
    },
    {
      "code": "4783102",
      "total": 23909,
      "active": 9491,
      "label": "Comércio varejista de artigos de relojoaria",
      "active_share": 0.3969634865531808
    },
    {
      "code": "1031700",
      "total": 23578,
      "active": 9337,
      "label": "Fabricação de conservas de frutas",
      "active_share": 0.3960047501908559
    },
    {
      "code": "4299599",
      "total": 23500,
      "active": 8179,
      "label": "Outras obras de engenharia civil não especificadas anteriormente",
      "active_share": 0.34804255319148936
    },
    {
      "code": "1539400",
      "total": 23422,
      "active": 4394,
      "label": "Fabricação de calçados de materiais não especificados anteriormente",
      "active_share": 0.1876014003927931
    },
    {
      "code": "1521100",
      "total": 23134,
      "active": 7487,
      "label": "Fabricação de artigos para viagem, bolsas e semelhantes de qualquer material",
      "active_share": 0.32363620644938185
    },
    {
      "code": "4644301",
      "total": 22953,
      "active": 7388,
      "label": "Comércio atacadista de medicamentos e drogas de uso humano",
      "active_share": 0.32187513614778024
    },
    {
      "code": "3313901",
      "total": 22949,
      "active": 12429,
      "label": "Manutenção e reparação de geradores, transformadores e motores elétricos",
      "active_share": 0.5415922262407948
    },
    {
      "code": "9609207",
      "total": 22877,
      "active": 12695,
      "label": "Alojamento de animais domésticos",
      "active_share": 0.5549241596363159
    },
    {
      "code": "0161099",
      "total": 22874,
      "active": 10836,
      "label": "Atividades de apoio à agricultura não especificadas anteriormente",
      "active_share": 0.4737256273498295
    },
    {
      "code": "2399101",
      "total": 22848,
      "active": 3718,
      "label": "Decoração, lapidação, gravação, vitrificação e outros trabalhos em cerâmica, louça, vidro e cristal",
      "active_share": 0.16272759103641457
    },
    {
      "code": "9609202",
      "total": 22838,
      "active": 2255,
      "label": "Agências matrimoniais",
      "active_share": 0.09873894386548734
    },
    {
      "code": "2511000",
      "total": 22613,
      "active": 7397,
      "label": "Fabricação de estruturas metálicas",
      "active_share": 0.327112722770088
    },
    {
      "code": "4744003",
      "total": 22397,
      "active": 10677,
      "label": "Comércio varejista de materiais hidráulicos",
      "active_share": 0.4767156315577979
    },
    {
      "code": "4541203",
      "total": 22373,
      "active": 10089,
      "label": "Comércio a varejo de motocicletas e motonetas novas",
      "active_share": 0.450945335895946
    },
    {
      "code": "4686902",
      "total": 22358,
      "active": 10442,
      "label": "Comércio atacadista de embalagens",
      "active_share": 0.4670364075498703
    },
    {
      "code": "4754703",
      "total": 22292,
      "active": 8883,
      "label": "Comércio varejista de artigos de iluminação",
      "active_share": 0.3984837609904899
    },
    {
      "code": "9319199",
      "total": 22102,
      "active": 11059,
      "label": "Outras atividades esportivas não especificadas anteriormente",
      "active_share": 0.5003619581938286
    },
    {
      "code": "1092900",
      "total": 22097,
      "active": 9177,
      "label": "Fabricação de biscoitos e bolachas",
      "active_share": 0.41530524505588995
    },
    {
      "code": "1053800",
      "total": 22069,
      "active": 5750,
      "label": "Fabricação de sorvetes e outros gelados comestíveis",
      "active_share": 0.2605464678961439
    },
    {
      "code": "4399101",
      "total": 21950,
      "active": 13882,
      "label": "Administração de obras",
      "active_share": 0.6324373576309795
    },
    {
      "code": "1013901",
      "total": 21895,
      "active": 8200,
      "label": "Fabricação de produtos de carne",
      "active_share": 0.37451472939027175
    },
    {
      "code": "3511501",
      "total": 21811,
      "active": 13538,
      "label": "Geração de energia elétrica",
      "active_share": 0.6206959790931181
    },
    {
      "code": "3314702",
      "total": 21666,
      "active": 11234,
      "label": "Manutenção e reparação de equipamentos hidráulicos e pneumáticos, exceto válvulas",
      "active_share": 0.5185082617926705
    },
    {
      "code": "7719599",
      "total": 21597,
      "active": 12277,
      "label": "Locação de outros meios de transporte não especificados anteriormente, sem condutor",
      "active_share": 0.5684585822104922
    },
    {
      "code": "3832700",
      "total": 21328,
      "active": 9039,
      "label": "Recuperação de materiais plásticos",
      "active_share": 0.4238090772693173
    },
    {
      "code": "4687703",
      "total": 21321,
      "active": 9220,
      "label": "Comércio atacadista de resíduos e sucatas metálicos",
      "active_share": 0.4324375029313822
    },
    {
      "code": "7820500",
      "total": 21137,
      "active": 5006,
      "label": "Locação de mão-de-obra temporária",
      "active_share": 0.2368358802100582
    },
    {
      "code": "4649408",
      "total": 21122,
      "active": 5203,
      "label": "Comércio atacadista de produtos de higiene, limpeza e conservação domiciliar",
      "active_share": 0.2463308398825869
    },
    {
      "code": "4756300",
      "total": 21112,
      "active": 7425,
      "label": "Comércio varejista especializado de instrumentos musicais e acessórios",
      "active_share": 0.3516957180750284
    },
    {
      "code": "2532201",
      "total": 21022,
      "active": 9762,
      "label": "Produção de artefatos estampados de metal",
      "active_share": 0.464370659309295
    },
    {
      "code": "4679699",
      "total": 21009,
      "active": 8941,
      "label": "Comércio atacadista de materiais de construção em geral",
      "active_share": 0.4255795135418154
    },
    {
      "code": "4612500",
      "total": 20925,
      "active": 8837,
      "label": "Representantes comerciais e agentes do comércio de combustíveis, minerais, produtos siderúrgicos e químicos",
      "active_share": 0.4223178016726404
    },
    {
      "code": "4645101",
      "total": 20723,
      "active": 10986,
      "label": "Comércio atacadista de instrumentos e materiais para uso médico, cirúrgico, hospitalar e de laboratórios",
      "active_share": 0.5301355981276842
    },
    {
      "code": "0210101",
      "total": 20662,
      "active": 11117,
      "label": "Cultivo de eucalipto",
      "active_share": 0.5380408479334043
    },
    {
      "code": "7319004",
      "total": 20655,
      "active": 13486,
      "label": "Consultoria em publicidade",
      "active_share": 0.6529169692568385
    },
    {
      "code": "3319800",
      "total": 20505,
      "active": 10930,
      "label": "Manutenção e reparação de equipamentos e produtos não especificados anteriormente",
      "active_share": 0.5330407217751768
    },
    {
      "code": "0322101",
      "total": 20429,
      "active": 4376,
      "label": "Criação de peixes em água doce",
      "active_share": 0.21420529639238337
    },
    {
      "code": "3314799",
      "total": 20414,
      "active": 10853,
      "label": "Manutenção e reparação de outras máquinas e equipamentos para usos industriais não especificados anteriormente",
      "active_share": 0.5316449495444303
    },
    {
      "code": "8299706",
      "total": 20337,
      "active": 13831,
      "label": "Casas lotéricas",
      "active_share": 0.6800904754880267
    },
    {
      "code": "6010100",
      "total": 20305,
      "active": 7490,
      "label": "Atividades de rádio",
      "active_share": 0.36887466141344494
    },
    {
      "code": "8640205",
      "total": 20186,
      "active": 11313,
      "label": "Serviços de diagnóstico por imagem com uso de radiação ionizante, exceto tomografia",
      "active_share": 0.5604379272763301
    },
    {
      "code": "6912500",
      "total": 19960,
      "active": 16563,
      "label": "Cartórios",
      "active_share": 0.829809619238477
    },
    {
      "code": "4292801",
      "total": 19954,
      "active": 8557,
      "label": "Montagem de estruturas metálicas",
      "active_share": 0.4288363235441515
    },
    {
      "code": "6810203",
      "total": 19942,
      "active": 16513,
      "label": "Loteamento de imóveis próprios",
      "active_share": 0.8280513489118444
    },
    {
      "code": "2543800",
      "total": 19918,
      "active": 8980,
      "label": "Fabricação de ferramentas",
      "active_share": 0.450848478762928
    },
    {
      "code": "4732600",
      "total": 19853,
      "active": 9160,
      "label": "Comércio varejista de lubrificantes",
      "active_share": 0.46139122550747996
    },
    {
      "code": "4611700",
      "total": 19792,
      "active": 8659,
      "label": "Representantes comerciais e agentes do comércio de matérias-primas agrícolas e animais vivos",
      "active_share": 0.4375
    },
    {
      "code": "2349499",
      "total": 19723,
      "active": 8414,
      "label": "Fabricação de produtos cerâmicos não-refratários não especificados anteriormente",
      "active_share": 0.4266085281143842
    },
    {
      "code": "3313999",
      "total": 19708,
      "active": 9604,
      "label": "Manutenção e reparação de máquinas, aparelhos e materiais elétricos não especificados anteriormente",
      "active_share": 0.48731479602192
    },
    {
      "code": "1352900",
      "total": 19668,
      "active": 8473,
      "label": "Fabricação de artefatos de tapeçaria",
      "active_share": 0.43080130160667074
    },
    {
      "code": "4691500",
      "total": 19592,
      "active": 9970,
      "label": "Comércio atacadista de mercadorias em geral, com predominância de produtos alimentícios",
      "active_share": 0.5088811759902001
    },
    {
      "code": "8660700",
      "total": 19361,
      "active": 14495,
      "label": "Atividades de apoio à gestão de saúde",
      "active_share": 0.7486700067145292
    },
    {
      "code": "4634601",
      "total": 19357,
      "active": 4415,
      "label": "Comércio atacadista de carnes bovinas e suínas e derivados",
      "active_share": 0.22808286408017772
    },
    {
      "code": "3831901",
      "total": 19291,
      "active": 9137,
      "label": "Recuperação de sucatas de alumínio",
      "active_share": 0.4736405577730548
    },
    {
      "code": "2330302",
      "total": 19146,
      "active": 7599,
      "label": "Fabricação de artefatos de cimento para uso na construção",
      "active_share": 0.3968975242870573
    },
    {
      "code": "5829800",
      "total": 18986,
      "active": 2833,
      "label": "Edição integrada à impressão de cadastros, listas e de outros produtos gráficos",
      "active_share": 0.14921521120825873
    },
    {
      "code": "7731400",
      "total": 18761,
      "active": 9140,
      "label": "Aluguel de máquinas e equipamentos agrícolas sem operador",
      "active_share": 0.4871808538990459
    },
    {
      "code": "4213800",
      "total": 18220,
      "active": 7187,
      "label": "Obras de urbanização - ruas, praças e calçadas",
      "active_share": 0.394456641053787
    },
    {
      "code": "9329804",
      "total": 18220,
      "active": 2903,
      "label": "Exploração de jogos eletrônicos recreativos",
      "active_share": 0.1593304061470911
    },
    {
      "code": "4614100",
      "total": 18168,
      "active": 6524,
      "label": "Representantes comerciais e agentes do comércio de máquinas, equipamentos, embarcações e aeronaves",
      "active_share": 0.35909291061206516
    },
    {
      "code": "7739003",
      "total": 18043,
      "active": 9215,
      "label": "Aluguel de palcos, coberturas e outras estruturas de uso temporário, exceto andaimes",
      "active_share": 0.510724380646234
    },
    {
      "code": "4669999",
      "total": 17986,
      "active": 7718,
      "label": "Comércio atacadista de outras máquinas e equipamentos não especificados anteriormente; partes e peças",
      "active_share": 0.42911153119092627
    },
    {
      "code": "9529104",
      "total": 17953,
      "active": 7857,
      "label": "Reparação de bicicletas, triciclos e outros veículos não-motorizados",
      "active_share": 0.4376427338049351
    },
    {
      "code": "4647801",
      "total": 17898,
      "active": 4006,
      "label": "Comércio atacadista de artigos de escritório e de papelaria",
      "active_share": 0.2238238909375349
    },
    {
      "code": "2222600",
      "total": 17847,
      "active": 6579,
      "label": "Fabricação de embalagens de material plástico",
      "active_share": 0.3686333837619768
    },
    {
      "code": "8541400",
      "total": 17672,
      "active": 7227,
      "label": "Educação profissional de nível técnico",
      "active_share": 0.40895201448619284
    },
    {
      "code": "0119999",
      "total": 17281,
      "active": 13699,
      "label": "Cultivo de outras plantas de lavoura temporária não especificadas anteriormente",
      "active_share": 0.7927203286846826
    },
    {
      "code": "9200301",
      "total": 17225,
      "active": 349,
      "label": "Casas de bingo",
      "active_share": 0.020261248185776487
    },
    {
      "code": "4211101",
      "total": 17219,
      "active": 7319,
      "label": "Construção de rodovias e ferrovias",
      "active_share": 0.4250537197282072
    },
    {
      "code": "1413403",
      "total": 17153,
      "active": 7270,
      "label": "Facção de roupas profissionais",
      "active_share": 0.42383256573194195
    },
    {
      "code": "6491300",
      "total": 17087,
      "active": 4230,
      "label": "Sociedades de fomento mercantil - factoring",
      "active_share": 0.24755662199332826
    },
    {
      "code": "4322303",
      "total": 17006,
      "active": 8607,
      "label": "Instalações de sistema de prevenção contra incêndio",
      "active_share": 0.5061154886510644
    },
    {
      "code": "0810006",
      "total": 16962,
      "active": 7874,
      "label": "Extração de areia, cascalho ou pedregulho e beneficiamento associado",
      "active_share": 0.4642141256927249
    },
    {
      "code": "4661300",
      "total": 16895,
      "active": 9827,
      "label": "Comércio atacadista de máquinas, aparelhos e equipamentos para uso agropecuário; partes e peças",
      "active_share": 0.581651376146789
    },
    {
      "code": "3839499",
      "total": 16881,
      "active": 5981,
      "label": "Recuperação de materiais não especificados anteriormente",
      "active_share": 0.3543036549967419
    },
    {
      "code": "4635499",
      "total": 16864,
      "active": 5136,
      "label": "Comércio atacadista de bebidas não especificadas anteriormente",
      "active_share": 0.3045540796963947
    },
    {
      "code": "0161002",
      "total": 16695,
      "active": 8265,
      "label": "Serviço de poda de árvores para lavouras",
      "active_share": 0.4950584007187781
    },
    {
      "code": "6190601",
      "total": 16657,
      "active": 8436,
      "label": "Provedores de acesso às redes de comunicações",
      "active_share": 0.5064537431710392
    },
    {
      "code": "7740300",
      "total": 16646,
      "active": 10415,
      "label": "Gestão de ativos intangíveis não-financeiros",
      "active_share": 0.6256758380391686
    },
    {
      "code": "4785701",
      "total": 16626,
      "active": 2215,
      "label": "Comércio varejista de antigüidades",
      "active_share": 0.1332250691687718
    },
    {
      "code": "4615000",
      "total": 16558,
      "active": 5944,
      "label": "Representantes comerciais e agentes do comércio de eletrodomésticos, móveis e artigos de uso doméstico",
      "active_share": 0.358980553206909
    },
    {
      "code": "9411100",
      "total": 16459,
      "active": 8612,
      "label": "Atividades de organizações associativas patronais e empresariais",
      "active_share": 0.5232395649796464
    },
    {
      "code": "1099699",
      "total": 16422,
      "active": 5496,
      "label": "Fabricação de outros produtos alimentícios não especificados anteriormente",
      "active_share": 0.3346729996346365
    },
    {
      "code": "8292000",
      "total": 16390,
      "active": 6210,
      "label": "Envasamento e empacotamento sob contrato",
      "active_share": 0.3788895668090299
    },
    {
      "code": "4635402",
      "total": 16301,
      "active": 4398,
      "label": "Comércio atacadista de cerveja, chope e refrigerante",
      "active_share": 0.26979939880988896
    },
    {
      "code": "8220200",
      "total": 16051,
      "active": 5586,
      "label": "Atividades de teleatendimento",
      "active_share": 0.34801569995638904
    },
    {
      "code": "8020002",
      "total": 16029,
      "active": 7778,
      "label": "Outras atividades de serviços de segurança",
      "active_share": 0.4852454925447626
    },
    {
      "code": "8690999",
      "total": 15891,
      "active": 4931,
      "label": "Outras atividades de atenção à saúde humana não especificadas anteriormente",
      "active_share": 0.3103014284815304
    },
    {
      "code": "8520100",
      "total": 15652,
      "active": 5970,
      "label": "Ensino médio",
      "active_share": 0.38142090467671863
    },
    {
      "code": "3103900",
      "total": 15434,
      "active": 6565,
      "label": "Fabricação de móveis de outros materiais, exceto madeira e metal",
      "active_share": 0.42535959569781
    },
    {
      "code": "4637199",
      "total": 15302,
      "active": 7286,
      "label": "Comércio atacadista especializado em outros produtos alimentícios não especificados anteriormente",
      "active_share": 0.4761469089007973
    },
    {
      "code": "4771702",
      "total": 15199,
      "active": 8265,
      "label": "Comércio varejista de produtos farmacêuticos, com manipulação de fórmulas",
      "active_share": 0.5437857753799592
    },
    {
      "code": "1095300",
      "total": 15124,
      "active": 5266,
      "label": "Fabricação de especiarias, molhos, temperos e condimentos",
      "active_share": 0.34818830997090716
    },
    {
      "code": "5211799",
      "total": 15094,
      "active": 7973,
      "label": "Depósitos de mercadorias para terceiros, exceto armazéns gerais e guarda-móveis",
      "active_share": 0.528223135020538
    },
    {
      "code": "7119701",
      "total": 14742,
      "active": 8410,
      "label": "Serviços de cartografia, topografia e geodésia",
      "active_share": 0.5704789038122371
    },
    {
      "code": "0210107",
      "total": 14711,
      "active": 5285,
      "label": "Extração de madeira em florestas plantadas",
      "active_share": 0.359254979267215
    },
    {
      "code": "0155501",
      "total": 14702,
      "active": 7900,
      "label": "Criação de frangos para corte",
      "active_share": 0.5373418582505781
    },
    {
      "code": "4329103",
      "total": 14463,
      "active": 7102,
      "label": "Instalação, manutenção e reparação de elevadores, escadas e esteiras rolantes",
      "active_share": 0.4910461176795962
    },
    {
      "code": "7119799",
      "total": 14359,
      "active": 4104,
      "label": "Atividades técnicas relacionadas à engenharia e arquitetura não especificadas anteriormente",
      "active_share": 0.28581377533254404
    },
    {
      "code": "7410202",
      "total": 14283,
      "active": 7834,
      "label": "Design de interiores",
      "active_share": 0.5484842120002801
    },
    {
      "code": "4921302",
      "total": 14215,
      "active": 3632,
      "label": "Transporte rodoviário coletivo de passageiros, com itinerário fixo, intermunicipal em região metropolitana",
      "active_share": 0.25550474850510024
    },
    {
      "code": "8650005",
      "total": 14184,
      "active": 11771,
      "label": "Atividades de terapia ocupacional",
      "active_share": 0.829878736604625
    },
    {
      "code": "0159802",
      "total": 13935,
      "active": 5583,
      "label": "Criação de animais de estimação",
      "active_share": 0.4006458557588805
    },
    {
      "code": "9529101",
      "total": 13933,
      "active": 4898,
      "label": "Reparação de calçados, bolsas e artigos de viagem",
      "active_share": 0.35153951051460564
    },
    {
      "code": "4672900",
      "total": 13907,
      "active": 6638,
      "label": "Comércio atacadista de ferragens e ferramentas",
      "active_share": 0.4773135830876537
    },
    {
      "code": "2950600",
      "total": 13854,
      "active": 7563,
      "label": "Recondicionamento e recuperação de motores para veículos automotores",
      "active_share": 0.5459073191857947
    },
    {
      "code": "3831999",
      "total": 13756,
      "active": 5828,
      "label": "Recuperação de materiais metálicos, exceto alumínio",
      "active_share": 0.42366967141610934
    },
    {
      "code": "0230600",
      "total": 13719,
      "active": 4776,
      "label": "Atividades de apoio à produção florestal",
      "active_share": 0.3481303301989941
    },
    {
      "code": "6920602",
      "total": 13634,
      "active": 7351,
      "label": "Atividades de consultoria e auditoria contábil e tributária",
      "active_share": 0.5391667889100777
    },
    {
      "code": "2219600",
      "total": 13588,
      "active": 4167,
      "label": "Fabricação de artefatos de borracha não especificados anteriormente",
      "active_share": 0.3066676479246394
    },
    {
      "code": "4530706",
      "total": 13508,
      "active": 5071,
      "label": "Representantes comerciais e agentes do comércio de peças e acessórios novos e usados para veículos automotores",
      "active_share": 0.3754071661237785
    },
    {
      "code": "7312200",
      "total": 13208,
      "active": 5506,
      "label": "Agenciamento de espaços para publicidade, exceto em veículos de comunicação",
      "active_share": 0.4168685645063598
    },
    {
      "code": "2062200",
      "total": 13118,
      "active": 2458,
      "label": "Fabricação de produtos de limpeza e polimento",
      "active_share": 0.18737612440920873
    },
    {
      "code": "3311200",
      "total": 13081,
      "active": 6008,
      "label": "Manutenção e reparação de tanques, reservatórios metálicos e caldeiras, exceto para veículos",
      "active_share": 0.4592921030502255
    },
    {
      "code": "4631100",
      "total": 13044,
      "active": 3002,
      "label": "Comércio atacadista de leite e laticínios",
      "active_share": 0.2301441275682306
    },
    {
      "code": "2063100",
      "total": 12951,
      "active": 3543,
      "label": "Fabricação de cosméticos, produtos de perfumaria e de higiene pessoal",
      "active_share": 0.2735696085244383
    },
    {
      "code": "3250706",
      "total": 12884,
      "active": 8265,
      "label": "Serviços de prótese dentária",
      "active_share": 0.641493325054331
    },
    {
      "code": "6110801",
      "total": 12874,
      "active": 2205,
      "label": "Serviços de telefonia fixa comutada - STFC",
      "active_share": 0.17127543886903837
    },
    {
      "code": "8640201",
      "total": 12824,
      "active": 2304,
      "label": "Laboratórios de anatomia patológica e citológica",
      "active_share": 0.17966313162819714
    },
    {
      "code": "1414200",
      "total": 12770,
      "active": 3089,
      "label": "Fabricação de acessórios do vestuário, exceto para segurança e proteção",
      "active_share": 0.2418950665622553
    },
    {
      "code": "5211702",
      "total": 12737,
      "active": 7202,
      "label": "Guarda-móveis",
      "active_share": 0.5654392714139908
    },
    {
      "code": "1822999",
      "total": 12607,
      "active": 3648,
      "label": "Serviços de acabamentos gráficos, exceto encadernação e plastificação",
      "active_share": 0.289363052272547
    },
    {
      "code": "8592902",
      "total": 12559,
      "active": 6243,
      "label": "Ensino de artes cênicas, exceto dança",
      "active_share": 0.49709371765267935
    },
    {
      "code": "3102100",
      "total": 12339,
      "active": 4166,
      "label": "Fabricação de móveis com predominância de metal",
      "active_share": 0.337628657103493
    },
    {
      "code": "6424703",
      "total": 12320,
      "active": 9556,
      "label": "Cooperativas de crédito mútuo",
      "active_share": 0.7756493506493507
    },
    {
      "code": "7733100",
      "total": 12277,
      "active": 6086,
      "label": "Aluguel de máquinas e equipamentos para escritórios",
      "active_share": 0.495723711004317
    },
    {
      "code": "4651601",
      "total": 12083,
      "active": 4183,
      "label": "Comércio atacadista de equipamentos de informática",
      "active_share": 0.34618886038235536
    },
    {
      "code": "7729201",
      "total": 12068,
      "active": 1891,
      "label": "Aluguel de aparelhos de jogos eletrônicos",
      "active_share": 0.15669539277427907
    },
    {
      "code": "5310502",
      "total": 12062,
      "active": 5856,
      "label": "Atividades de franqueadas do Correio Nacional",
      "active_share": 0.4854916265959211
    },
    {
      "code": "1413401",
      "total": 12035,
      "active": 3835,
      "label": "Confecção de roupas profissionais, exceto sob medida",
      "active_share": 0.3186539260490237
    },
    {
      "code": "2829199",
      "total": 12014,
      "active": 4354,
      "label": "Fabricação de outras máquinas e equipamentos de uso geral não especificados anteriormente, peças e acessórios",
      "active_share": 0.36241052105876476
    },
    {
      "code": "8412400",
      "total": 12010,
      "active": 10900,
      "label": "Regulação das atividades de saúde, educação, serviços culturais e outros serviços sociais",
      "active_share": 0.9075770191507078
    },
    {
      "code": "0810001",
      "total": 11871,
      "active": 421,
      "label": "Extração de ardósia e beneficiamento associado",
      "active_share": 0.035464577541908855
    },
    {
      "code": "0159801",
      "total": 11829,
      "active": 7125,
      "label": "Apicultura",
      "active_share": 0.6023332487953335
    },
    {
      "code": "5920100",
      "total": 11799,
      "active": 4431,
      "label": "Atividades de gravação de som e de edição de música",
      "active_share": 0.3755403000254259
    },
    {
      "code": "0162899",
      "total": 11783,
      "active": 4298,
      "label": "Atividades de apoio à pecuária não especificadas anteriormente",
      "active_share": 0.3647627938555546
    },
    {
      "code": "3240099",
      "total": 11744,
      "active": 4227,
      "label": "Fabricação de outros brinquedos e jogos recreativos não especificados anteriormente",
      "active_share": 0.3599284741144414
    },
    {
      "code": "0133404",
      "total": 11719,
      "active": 9336,
      "label": "Cultivo de cítricos, exceto laranja",
      "active_share": 0.7966550046932332
    },
    {
      "code": "4922101",
      "total": 11688,
      "active": 3696,
      "label": "Transporte rodoviário coletivo de passageiros, com itinerário fixo, intermunicipal, exceto em região metropolitana",
      "active_share": 0.3162217659137577
    },
    {
      "code": "7120100",
      "total": 11662,
      "active": 6749,
      "label": "Testes e análises técnicas",
      "active_share": 0.5787172011661808
    },
    {
      "code": "7490105",
      "total": 11637,
      "active": 6828,
      "label": "Agenciamento de profissionais para atividades esportivas, culturais e artísticas",
      "active_share": 0.5867491621551947
    },
    {
      "code": "3299006",
      "total": 11424,
      "active": 6242,
      "label": "Fabricação de velas, inclusive decorativas",
      "active_share": 0.5463935574229691
    },
    {
      "code": "2229301",
      "total": 11389,
      "active": 2174,
      "label": "Fabricação de artefatos de material plástico para uso pessoal e doméstico",
      "active_share": 0.19088594257616998
    },
    {
      "code": "0116401",
      "total": 11376,
      "active": 7632,
      "label": "Cultivo de amendoim",
      "active_share": 0.6708860759493671
    },
    {
      "code": "9529106",
      "total": 11323,
      "active": 5530,
      "label": "Reparação de jóias",
      "active_share": 0.48838647001678
    },
    {
      "code": "3314719",
      "total": 11156,
      "active": 5501,
      "label": "Manutenção e reparação de máquinas e equipamentos para as indústrias de alimentos, bebidas e fumo",
      "active_share": 0.4930978845464324
    },
    {
      "code": "4649402",
      "total": 11143,
      "active": 5635,
      "label": "Comércio atacadista de aparelhos eletrônicos de uso pessoal e doméstico",
      "active_share": 0.505698644889168
    },
    {
      "code": "0161001",
      "total": 11136,
      "active": 5540,
      "label": "Serviço de pulverização e controle de pragas agrícolas",
      "active_share": 0.49748563218390807
    },
    {
      "code": "4641901",
      "total": 11089,
      "active": 4216,
      "label": "Comércio atacadista de tecidos",
      "active_share": 0.3801965912165209
    },
    {
      "code": "1411802",
      "total": 11075,
      "active": 4586,
      "label": "Facção de roupas íntimas",
      "active_share": 0.41408577878103836
    },
    {
      "code": "4689302",
      "total": 11000,
      "active": 982,
      "label": "Comércio atacadista de fios e fibras beneficiados",
      "active_share": 0.08927272727272727
    },
    {
      "code": "1066000",
      "total": 10992,
      "active": 4899,
      "label": "Fabricação de alimentos para animais",
      "active_share": 0.44568777292576417
    },
    {
      "code": "4399105",
      "total": 10981,
      "active": 5454,
      "label": "Perfuração e construção de poços de água",
      "active_share": 0.49667607686003096
    },
    {
      "code": "3702900",
      "total": 10934,
      "active": 5032,
      "label": "Atividades relacionadas a esgoto, exceto a gestão de redes",
      "active_share": 0.4602158404975306
    },
    {
      "code": "7119704",
      "total": 10887,
      "active": 7017,
      "label": "Serviços de perícia técnica relacionados à segurança do trabalho",
      "active_share": 0.6445301736015431
    },
    {
      "code": "4634603",
      "total": 10874,
      "active": 3063,
      "label": "Comércio atacadista de pescados e frutos do mar",
      "active_share": 0.2816810741217583
    },
    {
      "code": "2061400",
      "total": 10851,
      "active": 1167,
      "label": "Fabricação de sabões e detergentes sintéticos",
      "active_share": 0.10754769145700857
    },
    {
      "code": "0133402",
      "total": 10798,
      "active": 8276,
      "label": "Cultivo de banana",
      "active_share": 0.7664382293017226
    },
    {
      "code": "7210000",
      "total": 10767,
      "active": 6791,
      "label": "Pesquisa e desenvolvimento experimental em ciências físicas e naturais",
      "active_share": 0.6307235070121668
    },
    {
      "code": "1099604",
      "total": 10734,
      "active": 5543,
      "label": "Fabricação de gelo comum",
      "active_share": 0.5163964971119807
    },
    {
      "code": "4329104",
      "total": 10581,
      "active": 4138,
      "label": "Montagem e instalação de sistemas e equipamentos de iluminação e sinalização em vias públicas, portos e aeroportos",
      "active_share": 0.3910783479822323
    },
    {
      "code": "8532500",
      "total": 10531,
      "active": 6723,
      "label": "Educação superior - graduação e pós-graduação",
      "active_share": 0.6384009115943405
    },
    {
      "code": "4689301",
      "total": 10523,
      "active": 2756,
      "label": "Comércio atacadista de produtos da extração mineral, exceto combustíveis",
      "active_share": 0.2619024992872755
    },
    {
      "code": "0151203",
      "total": 10481,
      "active": 8469,
      "label": "Criação de bovinos, exceto para corte e leite",
      "active_share": 0.8080335845816239
    },
    {
      "code": "4520004",
      "total": 10441,
      "active": 4062,
      "label": "Serviços de alinhamento e balanceamento de veículos automotores",
      "active_share": 0.3890431950962551
    },
    {
      "code": "9329801",
      "total": 10437,
      "active": 1748,
      "label": "Discotecas, danceterias, salões de dança e similares",
      "active_share": 0.16748107693781739
    },
    {
      "code": "3299004",
      "total": 10348,
      "active": 4797,
      "label": "Fabricação de painéis e letreiros luminosos",
      "active_share": 0.4635678391959799
    },
    {
      "code": "5822101",
      "total": 10170,
      "active": 1346,
      "label": "Edição integrada à impressão de jornais diários",
      "active_share": 0.13235004916420845
    },
    {
      "code": "3291400",
      "total": 10111,
      "active": 1916,
      "label": "Fabricação de escovas, pincéis e vassouras",
      "active_share": 0.18949658787459203
    },
    {
      "code": "1540800",
      "total": 10045,
      "active": 4023,
      "label": "Fabricação de partes para calçados, de qualquer material",
      "active_share": 0.4004977600796416
    },
    {
      "code": "5310501",
      "total": 9932,
      "active": 7540,
      "label": "Atividades do Correio Nacional",
      "active_share": 0.7591623036649214
    },
    {
      "code": "4643501",
      "total": 9928,
      "active": 1757,
      "label": "Comércio atacadista de calçados",
      "active_share": 0.17697421434327157
    },
    {
      "code": "8640299",
      "total": 9920,
      "active": 3952,
      "label": "Atividades de serviços de complementação diagnóstica e terapêutica não especificadas anteriormente",
      "active_share": 0.39838709677419354
    },
    {
      "code": "6499901",
      "total": 9886,
      "active": 3570,
      "label": "Clubes de investimento",
      "active_share": 0.3611167307303257
    },
    {
      "code": "4681801",
      "total": 9867,
      "active": 2301,
      "label": "Comércio atacadista de álcool carburante, biodiesel, gasolina e demais derivados de petróleo, exceto lubrificantes, não realizado por transportador re",
      "active_share": 0.233201581027668
    },
    {
      "code": "7420002",
      "total": 9763,
      "active": 4242,
      "label": "Atividades de produção de fotografias aéreas e submarinas",
      "active_share": 0.4344975929529858
    },
    {
      "code": "6499999",
      "total": 9681,
      "active": 3248,
      "label": "Outras atividades de serviços financeiros não especificadas anteriormente",
      "active_share": 0.33550253073029646
    },
    {
      "code": "4512902",
      "total": 9679,
      "active": 5024,
      "label": "Comércio sob consignação de veículos automotores",
      "active_share": 0.5190618865585288
    },
    {
      "code": "8531700",
      "total": 9672,
      "active": 4470,
      "label": "Educação superior - graduação",
      "active_share": 0.4621588089330025
    },
    {
      "code": "1822901",
      "total": 9613,
      "active": 4344,
      "label": "Serviços de encadernação e plastificação",
      "active_share": 0.45188806824092376
    },
    {
      "code": "0132600",
      "total": 9599,
      "active": 6730,
      "label": "Cultivo de uva",
      "active_share": 0.7011146994478592
    },
    {
      "code": "5911102",
      "total": 9575,
      "active": 6174,
      "label": "Produção de filmes para publicidade",
      "active_share": 0.6448041775456919
    },
    {
      "code": "1731100",
      "total": 9543,
      "active": 3787,
      "label": "Fabricação de embalagens de papel",
      "active_share": 0.39683537671591745
    },
    {
      "code": "7410299",
      "total": 9515,
      "active": 6581,
      "label": "atividades de design não especificadas anteriormente",
      "active_share": 0.6916447714135575
    },
    {
      "code": "0119906",
      "total": 9402,
      "active": 7464,
      "label": "Cultivo de mandioca",
      "active_share": 0.793873643905552
    },
    {
      "code": "1011201",
      "total": 9284,
      "active": 2334,
      "label": "Frigorífico - abate de bovinos",
      "active_share": 0.25140025850926323
    },
    {
      "code": "0122900",
      "total": 9209,
      "active": 6053,
      "label": "Cultivo de flores e plantas ornamentais",
      "active_share": 0.6572917797806493
    },
    {
      "code": "1012101",
      "total": 9163,
      "active": 942,
      "label": "Abate de aves",
      "active_share": 0.10280475826694314
    },
    {
      "code": "4329199",
      "total": 9111,
      "active": 3062,
      "label": "Outras obras de instalações em construções não especificadas anteriormente",
      "active_share": 0.33607726923499065
    },
    {
      "code": "6550200",
      "total": 9078,
      "active": 2853,
      "label": "Planos de saúde",
      "active_share": 0.3142762723066755
    },
    {
      "code": "5250804",
      "total": 8971,
      "active": 5298,
      "label": "Organização logística do transporte de carga",
      "active_share": 0.5905696131980828
    },
    {
      "code": "3600601",
      "total": 8946,
      "active": 7299,
      "label": "Captação, tratamento e distribuição de água",
      "active_share": 0.8158953722334004
    },
    {
      "code": "4673700",
      "total": 8886,
      "active": 4263,
      "label": "Comércio atacadista de material elétrico",
      "active_share": 0.4797434166103984
    },
    {
      "code": "4623199",
      "total": 8856,
      "active": 3605,
      "label": "Comércio atacadista de matérias-primas agrícolas não especificadas anteriormente",
      "active_share": 0.4070686540198735
    },
    {
      "code": "4692300",
      "total": 8839,
      "active": 5014,
      "label": "Comércio atacadista de mercadorias em geral, com predominância de insumos agropecuários",
      "active_share": 0.567258739676434
    },
    {
      "code": "0133499",
      "total": 8818,
      "active": 6683,
      "label": "Cultivo de frutas de lavoura permanente não especificadas anteriormente",
      "active_share": 0.7578816058063053
    },
    {
      "code": "1622602",
      "total": 8811,
      "active": 2624,
      "label": "Fabricação de esquadrias de madeira e de peças de madeira para instalações industriais e comerciais",
      "active_share": 0.29780955623652255
    },
    {
      "code": "5510803",
      "total": 8800,
      "active": 4305,
      "label": "Motéis",
      "active_share": 0.48920454545454545
    },
    {
      "code": "6391700",
      "total": 8792,
      "active": 4154,
      "label": "Agências de notícias",
      "active_share": 0.4724749772520473
    },
    {
      "code": "4512901",
      "total": 8783,
      "active": 2738,
      "label": "Representantes comerciais e agentes do comércio de veículos automotores",
      "active_share": 0.3117385859045884
    },
    {
      "code": "8720499",
      "total": 8723,
      "active": 4549,
      "label": "Atividades de assistência psicossocial e à saúde a portadores de distúrbios psíquicos, deficiência mental e dependência química e grupos similares não",
      "active_share": 0.5214948985440788
    },
    {
      "code": "3314712",
      "total": 8669,
      "active": 5077,
      "label": "Manutenção e reparação de tratores agrícolas",
      "active_share": 0.5856500173030338
    },
    {
      "code": "4391600",
      "total": 8619,
      "active": 2785,
      "label": "Obras de fundações",
      "active_share": 0.3231233321731059
    },
    {
      "code": "2869100",
      "total": 8599,
      "active": 4152,
      "label": "Fabricação de máquinas e equipamentos para uso industrial específico não especificados anteriormente, peças e acessórios",
      "active_share": 0.4828468426561228
    },
    {
      "code": "4520008",
      "total": 8533,
      "active": 4227,
      "label": "Serviços de capotaria",
      "active_share": 0.49537091292628616
    },
    {
      "code": "3314720",
      "total": 8462,
      "active": 4318,
      "label": "Manutenção e reparação de máquinas e equipamentos para a indústria têxtil, do vestuário, do couro e calçados",
      "active_share": 0.5102812573859608
    },
    {
      "code": "2099199",
      "total": 8338,
      "active": 1940,
      "label": "Fabricação de outros produtos químicos não especificados anteriormente",
      "active_share": 0.23266970496521946
    },
    {
      "code": "7420003",
      "total": 8301,
      "active": 3583,
      "label": "Laboratórios fotográficos",
      "active_share": 0.43163474280207204
    },
    {
      "code": "9311500",
      "total": 8267,
      "active": 5389,
      "label": "Gestão de instalações de esportes",
      "active_share": 0.6518688762549897
    },
    {
      "code": "1081302",
      "total": 8253,
      "active": 2545,
      "label": "Torrefação e moagem de café",
      "active_share": 0.3083727129528656
    },
    {
      "code": "1629302",
      "total": 8251,
      "active": 3048,
      "label": "Fabricação de artefatos diversos de cortiça, bambu, palha, vime e outros materiais trançados, exceto móveis",
      "active_share": 0.3694097685129075
    },
    {
      "code": "1033301",
      "total": 8236,
      "active": 2902,
      "label": "Fabricação de sucos concentrados de frutas, hortaliças e legumes",
      "active_share": 0.35235551238465274
    },
    {
      "code": "1330800",
      "total": 8229,
      "active": 1198,
      "label": "Fabricação de tecidos de malha",
      "active_share": 0.1455826953457285
    },
    {
      "code": "3211602",
      "total": 8184,
      "active": 3578,
      "label": "Fabricação de artefatos de joalheria e ourivesaria",
      "active_share": 0.4371945259042033
    },
    {
      "code": "1623400",
      "total": 8178,
      "active": 3099,
      "label": "Fabricação de artefatos de tanoaria e de embalagens de madeira",
      "active_share": 0.3789435069699193
    },
    {
      "code": "4652400",
      "total": 8167,
      "active": 4259,
      "label": "Comércio atacadista de componentes eletrônicos e equipamentos de telefonia e comunicação",
      "active_share": 0.52148891881964
    },
    {
      "code": "6201502",
      "total": 8141,
      "active": 5520,
      "label": "Web design",
      "active_share": 0.6780493796830857
    },
    {
      "code": "4541207",
      "total": 8104,
      "active": 4122,
      "label": "Comércio a varejo de peças e acessórios usados para motocicletas e motonetas",
      "active_share": 0.5086377097729516
    },
    {
      "code": "1099601",
      "total": 8100,
      "active": 289,
      "label": "Fabricação de vinagres",
      "active_share": 0.03567901234567901
    },
    {
      "code": "4744006",
      "total": 8089,
      "active": 4573,
      "label": "Comércio varejista de pedras para revestimento",
      "active_share": 0.5653356409939424
    },
    {
      "code": "5240199",
      "total": 8069,
      "active": 4805,
      "label": "Atividades auxiliares dos transportes aéreos, exceto operação dos aeroportos e campos de aterrissagem",
      "active_share": 0.5954889081670591
    },
    {
      "code": "6612605",
      "total": 8009,
      "active": 3448,
      "label": "Agentes de investimentos em aplicações financeiras",
      "active_share": 0.43051566987139467
    },
    {
      "code": "4684299",
      "total": 7988,
      "active": 3632,
      "label": "Comércio atacadista de outros produtos químicos e petroquímicos não especificados anteriormente",
      "active_share": 0.45468202303455185
    },
    {
      "code": "4329105",
      "total": 7970,
      "active": 3603,
      "label": "Tratamentos térmicos, acústicos ou de vibração",
      "active_share": 0.4520702634880803
    },
    {
      "code": "1061901",
      "total": 7943,
      "active": 1160,
      "label": "Beneficiamento de arroz",
      "active_share": 0.14604053883922952
    },
    {
      "code": "5250803",
      "total": 7941,
      "active": 3561,
      "label": "Agenciamento de cargas, exceto para o transporte marítimo",
      "active_share": 0.4484321873819418
    },
    {
      "code": "6511101",
      "total": 7865,
      "active": 567,
      "label": "Sociedade seguradora de seguros vida",
      "active_share": 0.07209154481881755
    },
    {
      "code": "1033302",
      "total": 7844,
      "active": 3218,
      "label": "Fabricação de sucos de frutas, hortaliças e legumes, exceto concentrados",
      "active_share": 0.41024987251402345
    },
    {
      "code": "2539002",
      "total": 7836,
      "active": 4473,
      "label": "Serviços de tratamento e revestimento em metais",
      "active_share": 0.5708269525267994
    },
    {
      "code": "0210108",
      "total": 7826,
      "active": 3655,
      "label": "Produção de carvão vegetal - florestas plantadas",
      "active_share": 0.46703296703296704
    },
    {
      "code": "4292802",
      "total": 7809,
      "active": 3821,
      "label": "Obras de montagem industrial",
      "active_share": 0.4893072096299142
    },
    {
      "code": "5099801",
      "total": 7790,
      "active": 3945,
      "label": "Transporte aquaviário para passeios turísticos",
      "active_share": 0.506418485237484
    },
    {
      "code": "8730199",
      "total": 7781,
      "active": 3802,
      "label": "Atividades de assistência social prestadas em residências coletivas e particulares não especificadas anteriormente",
      "active_share": 0.48862614059889475
    },
    {
      "code": "3317102",
      "total": 7764,
      "active": 3945,
      "label": "Manutenção e reparação de embarcações para esporte e lazer",
      "active_share": 0.5081143740340031
    },
    {
      "code": "4623106",
      "total": 7733,
      "active": 3840,
      "label": "Comércio atacadista de sementes, flores, plantas e gramas",
      "active_share": 0.4965731281520755
    },
    {
      "code": "3600602",
      "total": 7716,
      "active": 3636,
      "label": "Distribuição de água por caminhões",
      "active_share": 0.4712286158631415
    },
    {
      "code": "4687701",
      "total": 7691,
      "active": 3373,
      "label": "Comércio atacadista de resíduos de papel e papelão",
      "active_share": 0.43856455597451566
    },
    {
      "code": "2593400",
      "total": 7574,
      "active": 2056,
      "label": "Fabricação de artigos de metal para uso doméstico e pessoal",
      "active_share": 0.2714549775547927
    },
    {
      "code": "4751202",
      "total": 7560,
      "active": 2193,
      "label": "Recarga de cartuchos para equipamentos de informática",
      "active_share": 0.2900793650793651
    },
    {
      "code": "4687702",
      "total": 7525,
      "active": 3203,
      "label": "Comércio atacadista de resíduos e sucatas não-metálicos, exceto de papel e papelão",
      "active_share": 0.42564784053156146
    },
    {
      "code": "4642702",
      "total": 7509,
      "active": 3771,
      "label": "Comércio atacadista de roupas e acessórios para uso profissional e de segurança do trabalho",
      "active_share": 0.5021973631642029
    },
    {
      "code": "7320300",
      "total": 7337,
      "active": 2895,
      "label": "Pesquisas de mercado e de opinião pública",
      "active_share": 0.3945754395529508
    },
    {
      "code": "4618402",
      "total": 7313,
      "active": 2970,
      "label": "Representantes comerciais e agentes do comércio de instrumentos e materiais odonto-médico-hospitalares",
      "active_share": 0.4061260768494462
    },
    {
      "code": "2319200",
      "total": 7272,
      "active": 2663,
      "label": "Fabricação de artigos de vidro",
      "active_share": 0.3661991199119912
    },
    {
      "code": "4665600",
      "total": 7229,
      "active": 3238,
      "label": "Comércio atacadista de máquinas e equipamentos para uso comercial; partes e peças",
      "active_share": 0.44791810762207773
    },
    {
      "code": "8299702",
      "total": 7222,
      "active": 653,
      "label": "Emissão de vales-alimentação, vales-transporte e similares",
      "active_share": 0.09041816671282193
    },
    {
      "code": "1111901",
      "total": 7216,
      "active": 1989,
      "label": "Fabricação de aguardente de cana-de-açúcar",
      "active_share": 0.27563747228381374
    },
    {
      "code": "1063500",
      "total": 7200,
      "active": 2018,
      "label": "Fabricação de farinha de mandioca e derivados",
      "active_share": 0.2802777777777778
    },
    {
      "code": "4922102",
      "total": 7189,
      "active": 2869,
      "label": "Transporte rodoviário coletivo de passageiros, com itinerário fixo, interestadual",
      "active_share": 0.39908193072750037
    },
    {
      "code": "2833000",
      "total": 7172,
      "active": 3420,
      "label": "Fabricação de máquinas e equipamentos para a agricultura e pecuária, peças e acessórios, exceto para irrigação",
      "active_share": 0.47685443390964866
    },
    {
      "code": "8640207",
      "total": 7154,
      "active": 5214,
      "label": "Serviços de diagnóstico por imagem sem uso de radiação ionizante, exceto ressonância magnética",
      "active_share": 0.7288230360637405
    },
    {
      "code": "2949299",
      "total": 7078,
      "active": 2687,
      "label": "Fabricação de outras peças e acessórios para veículos automotores não especificadas anteriormente",
      "active_share": 0.37962701328058773
    },
    {
      "code": "3211601",
      "total": 7050,
      "active": 1342,
      "label": "Lapidação de gemas",
      "active_share": 0.19035460992907802
    },
    {
      "code": "4771703",
      "total": 7018,
      "active": 764,
      "label": "Comércio varejista de produtos farmacêuticos homeopáticos",
      "active_share": 0.10886292390994586
    },
    {
      "code": "9609204",
      "total": 6996,
      "active": 321,
      "label": "Exploração de máquinas de serviços pessoais acionadas por moeda",
      "active_share": 0.04588336192109777
    },
    {
      "code": "2391501",
      "total": 6985,
      "active": 1073,
      "label": "Britamento de pedras, exceto associado à extração",
      "active_share": 0.15361488904795992
    },
    {
      "code": "1032599",
      "total": 6870,
      "active": 2185,
      "label": "Fabricação de conservas de legumes e outros vegetais, exceto palmito",
      "active_share": 0.3180494905385735
    },
    {
      "code": "4649410",
      "total": 6857,
      "active": 2904,
      "label": "Comércio atacadista de jóias, relógios e bijuterias, inclusive pedras preciosas e semipreciosas lapidadas",
      "active_share": 0.42350882310048127
    },
    {
      "code": "6423900",
      "total": 6817,
      "active": 4682,
      "label": "Caixas econômicas",
      "active_share": 0.6868123808126742
    },
    {
      "code": "1069400",
      "total": 6814,
      "active": 1645,
      "label": "Moagem e fabricação de produtos de origem vegetal não especificados anteriormente",
      "active_share": 0.24141473437041386
    },
    {
      "code": "9001904",
      "total": 6791,
      "active": 572,
      "label": "Produção de espetáculos circenses, de marionetes e similares",
      "active_share": 0.08422912678545133
    },
    {
      "code": "4641903",
      "total": 6744,
      "active": 2533,
      "label": "Comércio atacadista de artigos de armarinho",
      "active_share": 0.37559311981020166
    },
    {
      "code": "6629100",
      "total": 6728,
      "active": 1774,
      "label": "Atividades auxiliares dos seguros, da previdência complementar e dos planos de saúde não especificadas anteriormente",
      "active_share": 0.2636741973840666
    },
    {
      "code": "4330401",
      "total": 6704,
      "active": 2464,
      "label": "Impermeabilização em obras de engenharia civil",
      "active_share": 0.36754176610978523
    },
    {
      "code": "8030700",
      "total": 6692,
      "active": 467,
      "label": "Atividades de investigação particular",
      "active_share": 0.06978481769276748
    },
    {
      "code": "4621400",
      "total": 6684,
      "active": 2818,
      "label": "Comércio atacadista de café em grão",
      "active_share": 0.42160383004189106
    },
    {
      "code": "4685100",
      "total": 6683,
      "active": 3031,
      "label": "Comércio atacadista de produtos siderúrgicos e metalúrgicos, exceto para construção",
      "active_share": 0.45353882986682625
    },
    {
      "code": "4541204",
      "total": 6654,
      "active": 3730,
      "label": "Comércio a varejo de motocicletas e motonetas usadas",
      "active_share": 0.5605650736399158
    },
    {
      "code": "5913800",
      "total": 6543,
      "active": 499,
      "label": "Distribuição cinematográfica, de vídeo e de programas de televisão",
      "active_share": 0.07626471037750268
    },
    {
      "code": "7739002",
      "total": 6529,
      "active": 3299,
      "label": "Aluguel de equipamentos científicos, médicos e hospitalares, sem operador",
      "active_share": 0.5052841170163884
    },
    {
      "code": "4221902",
      "total": 6452,
      "active": 3109,
      "label": "Construção de estações e redes de distribuição de energia elétrica",
      "active_share": 0.4818660880347179
    },
    {
      "code": "3314706",
      "total": 6443,
      "active": 3147,
      "label": "Manutenção e reparação de máquinas, aparelhos e equipamentos para instalações térmicas",
      "active_share": 0.48843706347974547
    },
    {
      "code": "2330305",
      "total": 6433,
      "active": 3270,
      "label": "Preparação de massa de concreto e argamassa para construção",
      "active_share": 0.5083164930825431
    },
    {
      "code": "4222701",
      "total": 6417,
      "active": 3510,
      "label": "Construção de redes de abastecimento de água, coleta de esgoto e construções correlatas, exceto obras de irrigação",
      "active_share": 0.5469845722300141
    },
    {
      "code": "0312401",
      "total": 6322,
      "active": 5540,
      "label": "Pesca de peixes em água doce",
      "active_share": 0.8763049667826637
    },
    {
      "code": "0810099",
      "total": 6288,
      "active": 2995,
      "label": "Extração e britamento de pedras e outros materiais para construção e beneficiamento associado",
      "active_share": 0.47630407124681934
    },
    {
      "code": "8430200",
      "total": 6287,
      "active": 4098,
      "label": "Seguridade social obrigatória",
      "active_share": 0.6518212183871481
    },
    {
      "code": "9529103",
      "total": 6235,
      "active": 2904,
      "label": "Reparação de relógios",
      "active_share": 0.4657578187650361
    },
    {
      "code": "4530702",
      "total": 6229,
      "active": 2910,
      "label": "Comércio por atacado de pneumáticos e câmaras-de-ar",
      "active_share": 0.467169690158934
    },
    {
      "code": "6470102",
      "total": 6226,
      "active": 4447,
      "label": "Fundos de investimento previdenciários",
      "active_share": 0.714262769033087
    },
    {
      "code": "7732202",
      "total": 6168,
      "active": 3290,
      "label": "Aluguel de andaimes",
      "active_share": 0.5333981841763943
    },
    {
      "code": "5099899",
      "total": 6065,
      "active": 2350,
      "label": "Outros transportes aquaviários não especificados anteriormente",
      "active_share": 0.38746908491343773
    },
    {
      "code": "4679602",
      "total": 6028,
      "active": 3009,
      "label": "Comércio atacadista de mármores e granitos",
      "active_share": 0.49917053749170537
    },
    {
      "code": "4632003",
      "total": 6021,
      "active": 2050,
      "label": "Comércio atacadista de cereais e leguminosas beneficiados, farinhas, amidos e féculas, com atividade de fracionamento e acondicionamento associada",
      "active_share": 0.3404750041521342
    },
    {
      "code": "9002702",
      "total": 5974,
      "active": 2911,
      "label": "Restauração de obras-de-arte",
      "active_share": 0.48727820555741547
    },
    {
      "code": "8011102",
      "total": 5965,
      "active": 2698,
      "label": "Serviços de adestramento de cães de guarda",
      "active_share": 0.4523051131601006
    },
    {
      "code": "0893200",
      "total": 5961,
      "active": 743,
      "label": "Extração de gemas (pedras preciosas e semipreciosas)",
      "active_share": 0.12464351618855897
    },
    {
      "code": "2229302",
      "total": 5908,
      "active": 2863,
      "label": "Fabricação de artefatos de material plástico para usos industriais",
      "active_share": 0.48459715639810425
    },
    {
      "code": "2212900",
      "total": 5907,
      "active": 1993,
      "label": "Reforma de pneumáticos usados",
      "active_share": 0.3373963094633486
    },
    {
      "code": "0119909",
      "total": 5854,
      "active": 4692,
      "label": "Cultivo de tomate rasteiro",
      "active_share": 0.8015032456440041
    },
    {
      "code": "4622200",
      "total": 5845,
      "active": 3348,
      "label": "Comércio atacadista de soja",
      "active_share": 0.5727972626176219
    },
    {
      "code": "3514000",
      "total": 5792,
      "active": 4735,
      "label": "Distribuição de energia elétrica",
      "active_share": 0.8175069060773481
    },
    {
      "code": "4649404",
      "total": 5782,
      "active": 2439,
      "label": "Comércio atacadista de móveis e artigos de colchoaria",
      "active_share": 0.42182635766170873
    },
    {
      "code": "0152102",
      "total": 5772,
      "active": 4633,
      "label": "Criação de eqüinos",
      "active_share": 0.8026680526680526
    },
    {
      "code": "4623101",
      "total": 5738,
      "active": 2188,
      "label": "Comércio atacadista de animais vivos",
      "active_share": 0.381317532241199
    },
    {
      "code": "9002701",
      "total": 5732,
      "active": 3748,
      "label": "Atividades de artistas plásticos, jornalistas independentes e escritores",
      "active_share": 0.6538729937194696
    },
    {
      "code": "7119702",
      "total": 5725,
      "active": 3259,
      "label": "Atividades de estudos geológicos",
      "active_share": 0.5692576419213974
    },
    {
      "code": "3312102",
      "total": 5721,
      "active": 3313,
      "label": "Manutenção e reparação de aparelhos e instrumentos de medida, teste e controle",
      "active_share": 0.5790945638874323
    },
    {
      "code": "1093702",
      "total": 5718,
      "active": 1979,
      "label": "Fabricação de frutas cristalizadas, balas e semelhantes",
      "active_share": 0.34610003497726477
    },
    {
      "code": "2592601",
      "total": 5718,
      "active": 1191,
      "label": "Fabricação de produtos de trefilados de metal padronizados",
      "active_share": 0.20828961175236096
    },
    {
      "code": "9601703",
      "total": 5662,
      "active": 2304,
      "label": "Toalheiros",
      "active_share": 0.4069233486400565
    },
    {
      "code": "0810002",
      "total": 5643,
      "active": 2834,
      "label": "Extração de granito e beneficiamento associado",
      "active_share": 0.5022151337940811
    },
    {
      "code": "1811302",
      "total": 5622,
      "active": 1514,
      "label": "Impressão de livros, revistas e outras publicações periódicas",
      "active_share": 0.26929918178584134
    },
    {
      "code": "6120501",
      "total": 5614,
      "active": 1621,
      "label": "Telefonia móvel celular",
      "active_share": 0.28874242964018526
    },
    {
      "code": "3314701",
      "total": 5609,
      "active": 2839,
      "label": "Manutenção e reparação de máquinas motrizes não-elétricas",
      "active_share": 0.5061508290247816
    },
    {
      "code": "4679604",
      "total": 5596,
      "active": 2936,
      "label": "Comércio atacadista especializado de materiais de construção não especificados anteriormente",
      "active_share": 0.5246604717655469
    },
    {
      "code": "5250802",
      "total": 5593,
      "active": 2140,
      "label": "Atividades de despachantes aduaneiros",
      "active_share": 0.3826211335598069
    },
    {
      "code": "2071100",
      "total": 5587,
      "active": 1911,
      "label": "Fabricação de tintas, vernizes, esmaltes e lacas",
      "active_share": 0.34204403078575263
    },
    {
      "code": "5821200",
      "total": 5549,
      "active": 979,
      "label": "Edição integrada à impressão de livros",
      "active_share": 0.17642818525860515
    },
    {
      "code": "3292202",
      "total": 5521,
      "active": 1935,
      "label": "Fabricação de equipamentos e acessórios para segurança pessoal e profissional",
      "active_share": 0.3504799855098714
    },
    {
      "code": "4639702",
      "total": 5372,
      "active": 1541,
      "label": "Comércio atacadista de produtos alimentícios em geral, com atividade de fracionamento e acondicionamento associada",
      "active_share": 0.2868577810871184
    },
    {
      "code": "5232000",
      "total": 5359,
      "active": 2190,
      "label": "Atividades de agenciamento marítimo",
      "active_share": 0.40865833177831684
    },
    {
      "code": "4221905",
      "total": 5337,
      "active": 1695,
      "label": "Manutenção de estações e redes de telecomunicações",
      "active_share": 0.31759415401911184
    },
    {
      "code": "4637107",
      "total": 5302,
      "active": 1956,
      "label": "Comércio atacadista de chocolates, confeitos, balas, bombons e semelhantes",
      "active_share": 0.3689173896642776
    },
    {
      "code": "4399104",
      "total": 5227,
      "active": 3491,
      "label": "Serviços de operação e fornecimento de equipamentos para transporte e elevação de cargas e pessoas para uso em obras",
      "active_share": 0.6678783240864741
    },
    {
      "code": "4664800",
      "total": 5223,
      "active": 2525,
      "label": "Comércio atacadista de máquinas, aparelhos e equipamentos para uso odonto-médico-hospitalar; partes e peças",
      "active_share": 0.48343863679877463
    },
    {
      "code": "6493000",
      "total": 5201,
      "active": 1753,
      "label": "Administração de consórcios para aquisição de bens e direitos",
      "active_share": 0.33705056719861565
    },
    {
      "code": "6021700",
      "total": 5135,
      "active": 1803,
      "label": "Atividades de televisão aberta",
      "active_share": 0.3511197663096397
    },
    {
      "code": "1622601",
      "total": 5131,
      "active": 313,
      "label": "Fabricação de casas de madeira pré-fabricadas",
      "active_share": 0.061001754044045994
    },
    {
      "code": "5911101",
      "total": 5099,
      "active": 2082,
      "label": "Estúdios cinematográficos",
      "active_share": 0.40831535595214746
    },
    {
      "code": "0116499",
      "total": 5071,
      "active": 3512,
      "label": "Cultivo de outras oleaginosas de lavoura temporária não especificadas anteriormente",
      "active_share": 0.6925655689213173
    },
    {
      "code": "0155505",
      "total": 5071,
      "active": 3387,
      "label": "Produção de ovos",
      "active_share": 0.6679155985012818
    },
    {
      "code": "4647802",
      "total": 5045,
      "active": 1713,
      "label": "Comércio atacadista de livros, jornais e outras publicações",
      "active_share": 0.33954410307234884
    },
    {
      "code": "4637106",
      "total": 5032,
      "active": 2852,
      "label": "Comércio atacadista de sorvetes",
      "active_share": 0.5667726550079492
    },
    {
      "code": "5021101",
      "total": 4986,
      "active": 2018,
      "label": "Transporte por navegação interior de carga, municipal, exceto travessia",
      "active_share": 0.4047332531087044
    },
    {
      "code": "1621800",
      "total": 4977,
      "active": 1368,
      "label": "Fabricação de madeira laminada e de chapas de madeira compensada, prensada e aglomerada",
      "active_share": 0.27486437613019893
    },
    {
      "code": "1510600",
      "total": 4957,
      "active": 1112,
      "label": "Curtimento e outras preparações de couro",
      "active_share": 0.2243292313899536
    },
    {
      "code": "5590601",
      "total": 4946,
      "active": 2081,
      "label": "Albergues, exceto assistenciais",
      "active_share": 0.42074403558431056
    },
    {
      "code": "2610800",
      "total": 4907,
      "active": 1529,
      "label": "Fabricação de componentes eletrônicos",
      "active_share": 0.3115956796413287
    },
    {
      "code": "3312103",
      "total": 4906,
      "active": 2336,
      "label": "Manutenção e reparação de aparelhos eletromédicos e eletroterapêuticos e equipamentos de irradiação",
      "active_share": 0.47615165103954343
    },
    {
      "code": "3230200",
      "total": 4878,
      "active": 1905,
      "label": "Fabricação de artefatos para pesca e esporte",
      "active_share": 0.3905289052890529
    },
    {
      "code": "2930101",
      "total": 4857,
      "active": 2616,
      "label": "Fabricação de cabines, carrocerias e reboques para caminhões",
      "active_share": 0.5386040765904879
    },
    {
      "code": "4291000",
      "total": 4849,
      "active": 597,
      "label": "Obras portuárias, marítimas e fluviais",
      "active_share": 0.1231181686945762
    },
    {
      "code": "8592901",
      "total": 4735,
      "active": 2733,
      "label": "Ensino de dança",
      "active_share": 0.5771911298838437
    },
    {
      "code": "3314713",
      "total": 4727,
      "active": 2552,
      "label": "Manutenção e reparação de máquinas-ferramenta",
      "active_share": 0.5398773006134969
    },
    {
      "code": "2451200",
      "total": 4723,
      "active": 919,
      "label": "Fundição de ferro e aço",
      "active_share": 0.19457971628202414
    },
    {
      "code": "5914600",
      "total": 4695,
      "active": 1496,
      "label": "Atividades de exibição cinematográfica",
      "active_share": 0.31863684771033013
    },
    {
      "code": "6492100",
      "total": 4607,
      "active": 3813,
      "label": "Securitização de créditos",
      "active_share": 0.8276535706533535
    },
    {
      "code": "2740602",
      "total": 4596,
      "active": 1721,
      "label": "Fabricação de luminárias e outros equipamentos de iluminação",
      "active_share": 0.37445604873803306
    },
    {
      "code": "7830200",
      "total": 4580,
      "active": 1879,
      "label": "Fornecimento e gestão de recursos humanos para terceiros",
      "active_share": 0.41026200873362445
    },
    {
      "code": "0111301",
      "total": 4560,
      "active": 2235,
      "label": "Cultivo de arroz",
      "active_share": 0.4901315789473684
    },
    {
      "code": "0724301",
      "total": 4524,
      "active": 1488,
      "label": "Extração de minério de metais preciosos",
      "active_share": 0.32891246684350134
    },
    {
      "code": "4929903",
      "total": 4518,
      "active": 1528,
      "label": "Organização de excursões em veículos rodoviários próprios, municipal",
      "active_share": 0.3382027445772466
    },
    {
      "code": "4221904",
      "total": 4496,
      "active": 1636,
      "label": "Construção de estações e redes de telecomunicações",
      "active_share": 0.3638790035587189
    },
    {
      "code": "5912001",
      "total": 4472,
      "active": 2649,
      "label": "Serviços de dublagem",
      "active_share": 0.5923524150268337
    },
    {
      "code": "0322104",
      "total": 4466,
      "active": 1612,
      "label": "Criação de peixes ornamentais em água doce",
      "active_share": 0.36094939543215404
    },
    {
      "code": "3104700",
      "total": 4443,
      "active": 1423,
      "label": "Fabricação de colchões",
      "active_share": 0.32027909070447896
    },
    {
      "code": "4929904",
      "total": 4411,
      "active": 918,
      "label": "Organização de excursões em veículos rodoviários próprios, intermunicipal, interestadual e internacional",
      "active_share": 0.2081160734527318
    },
    {
      "code": "6512000",
      "total": 4376,
      "active": 695,
      "label": "Sociedade seguradora de seguros não vida",
      "active_share": 0.15882084095063986
    },
    {
      "code": "2399199",
      "total": 4366,
      "active": 1537,
      "label": "Fabricação de outros produtos de minerais não-metálicos não especificados anteriormente",
      "active_share": 0.3520384791571232
    },
    {
      "code": "2013402",
      "total": 4364,
      "active": 1475,
      "label": "Fabricação de adubos e fertilizantes, exceto organo-minerais",
      "active_share": 0.33799266727772687
    },
    {
      "code": "2790299",
      "total": 4356,
      "active": 1625,
      "label": "Fabricação de outros equipamentos e aparelhos elétricos não especificados anteriormente",
      "active_share": 0.37304866850321394
    },
    {
      "code": "4645103",
      "total": 4328,
      "active": 1907,
      "label": "Comércio atacadista de produtos odontológicos",
      "active_share": 0.4406192236598891
    },
    {
      "code": "9103100",
      "total": 4307,
      "active": 816,
      "label": "Atividades de jardins botânicos, zoológicos, parques nacionais, reservas ecológicas e áreas de proteção ambiental",
      "active_share": 0.18945902019967495
    },
    {
      "code": "4637104",
      "total": 4305,
      "active": 1320,
      "label": "Comércio atacadista de pães, bolos, biscoitos e similares",
      "active_share": 0.30662020905923343
    },
    {
      "code": "0119903",
      "total": 4289,
      "active": 2956,
      "label": "Cultivo de batata-inglesa",
      "active_share": 0.6892049428771275
    },
    {
      "code": "5222200",
      "total": 4278,
      "active": 548,
      "label": "Terminais rodoviários e ferroviários",
      "active_share": 0.12809724170172979
    },
    {
      "code": "7220700",
      "total": 4244,
      "active": 2161,
      "label": "Pesquisa e desenvolvimento experimental em ciências sociais e humanas",
      "active_share": 0.5091894439208294
    },
    {
      "code": "4623102",
      "total": 4224,
      "active": 1138,
      "label": "Comércio atacadista de couros, lãs, peles e outros subprodutos não-comestíveis de origem animal",
      "active_share": 0.2694128787878788
    },
    {
      "code": "1113502",
      "total": 4181,
      "active": 2379,
      "label": "Fabricação de cervejas e chopes",
      "active_share": 0.5690026309495336
    },
    {
      "code": "6421200",
      "total": 4174,
      "active": 637,
      "label": "Bancos comerciais",
      "active_share": 0.15261140392908482
    },
    {
      "code": "1064300",
      "total": 4150,
      "active": 1161,
      "label": "Fabricação de farinha de milho e derivados, exceto óleos de milho",
      "active_share": 0.2797590361445783
    },
    {
      "code": "2823200",
      "total": 4112,
      "active": 1606,
      "label": "Fabricação de máquinas e aparelhos de refrigeração e ventilação para uso industrial e comercial, peças e acessórios",
      "active_share": 0.39056420233463035
    },
    {
      "code": "1413402",
      "total": 4110,
      "active": 1359,
      "label": "Confecção, sob medida, de roupas profissionais",
      "active_share": 0.33065693430656934
    },
    {
      "code": "0154700",
      "total": 4100,
      "active": 2168,
      "label": "Criação de suínos",
      "active_share": 0.5287804878048781
    },
    {
      "code": "2029100",
      "total": 4064,
      "active": 584,
      "label": "Fabricação de produtos químicos orgânicos não especificados anteriormente",
      "active_share": 0.1437007874015748
    },
    {
      "code": "0311601",
      "total": 4059,
      "active": 1760,
      "label": "Pesca de peixes em água salgada",
      "active_share": 0.43360433604336046
    },
    {
      "code": "4632002",
      "total": 4058,
      "active": 970,
      "label": "Comércio atacadista de farinhas, amidos e féculas",
      "active_share": 0.23903400689995072
    },
    {
      "code": "4646002",
      "total": 4032,
      "active": 1403,
      "label": "Comércio atacadista de produtos de higiene pessoal",
      "active_share": 0.3479662698412698
    },
    {
      "code": "4541201",
      "total": 4019,
      "active": 695,
      "label": "Comércio por atacado de motocicletas e motonetas",
      "active_share": 0.17292858920129386
    },
    {
      "code": "4541202",
      "total": 4019,
      "active": 1823,
      "label": "Comércio por atacado de peças e acessórios para motocicletas e motonetas",
      "active_share": 0.45359542174670314
    },
    {
      "code": "4681803",
      "total": 4007,
      "active": 1458,
      "label": "Comércio atacadista de combustíveis de origem vegetal, exceto álcool carburante",
      "active_share": 0.36386323933117043
    },
    {
      "code": "6911702",
      "total": 3965,
      "active": 1707,
      "label": "Atividades auxiliares da justiça",
      "active_share": 0.4305170239596469
    },
    {
      "code": "5250801",
      "total": 3955,
      "active": 2121,
      "label": "Comissaria de despachos",
      "active_share": 0.536283185840708
    },
    {
      "code": "4681805",
      "total": 3891,
      "active": 1835,
      "label": "Comércio atacadista de lubrificantes",
      "active_share": 0.47160113081470056
    },
    {
      "code": "4542101",
      "total": 3889,
      "active": 1902,
      "label": "Representantes comerciais e agentes do comércio de motocicletas e motonetas, peças e acessórios",
      "active_share": 0.4890717408074055
    },
    {
      "code": "2949201",
      "total": 3863,
      "active": 269,
      "label": "Fabricação de bancos e estofados para veículos automotores",
      "active_share": 0.06963499870566917
    },
    {
      "code": "4763605",
      "total": 3853,
      "active": 1999,
      "label": "Comércio varejista de embarcações e outros veículos recreativos; peças e acessórios",
      "active_share": 0.5188165066182195
    },
    {
      "code": "1742701",
      "total": 3783,
      "active": 223,
      "label": "Fabricação de fraldas descartáveis",
      "active_share": 0.05894792492730637
    },
    {
      "code": "4674500",
      "total": 3748,
      "active": 1450,
      "label": "Comércio atacadista de cimento",
      "active_share": 0.38687299893276417
    },
    {
      "code": "7410203",
      "total": 3733,
      "active": 2713,
      "label": "Design de produto",
      "active_share": 0.7267613179748191
    },
    {
      "code": "4635403",
      "total": 3682,
      "active": 1266,
      "label": "Comércio atacadista de bebidas com atividade de fracionamento e acondicionamento associada",
      "active_share": 0.3438348723519826
    },
    {
      "code": "2840200",
      "total": 3673,
      "active": 1693,
      "label": "Fabricação de máquinas-ferramenta, peças e acessórios",
      "active_share": 0.4609311189763136
    },
    {
      "code": "5823900",
      "total": 3658,
      "active": 419,
      "label": "Edição integrada à impressão de revistas",
      "active_share": 0.11454346637506835
    },
    {
      "code": "4641902",
      "total": 3631,
      "active": 1376,
      "label": "Comércio atacadista de artigos de cama, mesa e banho",
      "active_share": 0.3789589644725971
    },
    {
      "code": "0163600",
      "total": 3620,
      "active": 2009,
      "label": "Atividades de pós-colheita",
      "active_share": 0.5549723756906078
    },
    {
      "code": "4311801",
      "total": 3618,
      "active": 782,
      "label": "Demolição de edifícios e outras estruturas",
      "active_share": 0.21614151464897732
    },
    {
      "code": "1121600",
      "total": 3612,
      "active": 2050,
      "label": "Fabricação de águas envasadas",
      "active_share": 0.5675526024363233
    },
    {
      "code": "2391502",
      "total": 3586,
      "active": 965,
      "label": "Aparelhamento de pedras para construção, exceto associado à extração",
      "active_share": 0.2691020635805912
    },
    {
      "code": "3299002",
      "total": 3557,
      "active": 986,
      "label": "Fabricação de canetas, lápis e outros artigos para escritório",
      "active_share": 0.2771998875456846
    },
    {
      "code": "1732000",
      "total": 3554,
      "active": 1720,
      "label": "Fabricação de embalagens de cartolina e papel-cartão",
      "active_share": 0.4839617332583005
    },
    {
      "code": "8533300",
      "total": 3552,
      "active": 1826,
      "label": "Educação superior - pós-graduação e extensão",
      "active_share": 0.5140765765765766
    },
    {
      "code": "4212000",
      "total": 3526,
      "active": 1355,
      "label": "Construção de obras de arte especiais",
      "active_share": 0.38428814520703347
    },
    {
      "code": "6461100",
      "total": 3521,
      "active": 2518,
      "label": "Holdings de instituições financeiras",
      "active_share": 0.7151377449588185
    },
    {
      "code": "1051100",
      "total": 3512,
      "active": 1035,
      "label": "Preparação do leite",
      "active_share": 0.29470387243735763
    },
    {
      "code": "0899199",
      "total": 3512,
      "active": 1443,
      "label": "Extração de outros minerais não-metálicos não especificados anteriormente",
      "active_share": 0.410876993166287
    },
    {
      "code": "4679601",
      "total": 3499,
      "active": 1447,
      "label": "Comércio atacadista de tintas, vernizes e similares",
      "active_share": 0.41354672763646755
    },
    {
      "code": "2651500",
      "total": 3480,
      "active": 1818,
      "label": "Fabricação de aparelhos e equipamentos de medida, teste e controle",
      "active_share": 0.5224137931034483
    },
    {
      "code": "0210103",
      "total": 3479,
      "active": 2655,
      "label": "Cultivo de pinus",
      "active_share": 0.7631503305547571
    },
    {
      "code": "5590602",
      "total": 3428,
      "active": 1546,
      "label": "Campings",
      "active_share": 0.4509918319719953
    },
    {
      "code": "1533500",
      "total": 3419,
      "active": 1072,
      "label": "Fabricação de calçados de material sintético",
      "active_share": 0.31354197133664813
    },
    {
      "code": "4662100",
      "total": 3350,
      "active": 2148,
      "label": "Comércio atacadista de máquinas, equipamentos para terraplenagem, mineração e construção; partes e peças",
      "active_share": 0.6411940298507462
    },
    {
      "code": "9603301",
      "total": 3344,
      "active": 993,
      "label": "Gestão e manutenção de cemitérios",
      "active_share": 0.29694976076555024
    },
    {
      "code": "1741902",
      "total": 3336,
      "active": 1565,
      "label": "Fabricação de produtos de papel, cartolina, papel cartão e papelão ondulado para uso comercial e de escritório, exceto formulário contínuo",
      "active_share": 0.4691247002398082
    },
    {
      "code": "2862300",
      "total": 3324,
      "active": 1335,
      "label": "Fabricação de máquinas e equipamentos para as indústrias de alimentos, bebidas e fumo, peças e acessórios",
      "active_share": 0.4016245487364621
    },
    {
      "code": "9321200",
      "total": 3313,
      "active": 1711,
      "label": "Parques de diversão e parques temáticos",
      "active_share": 0.5164503471174162
    },
    {
      "code": "4221903",
      "total": 3306,
      "active": 1378,
      "label": "Manutenção de redes de distribuição de energia elétrica",
      "active_share": 0.41681790683605563
    },
    {
      "code": "6436100",
      "total": 3284,
      "active": 606,
      "label": "Sociedades de crédito, financiamento e investimento - financeiras",
      "active_share": 0.18453105968331304
    },
    {
      "code": "4636202",
      "total": 3277,
      "active": 794,
      "label": "Comércio atacadista de cigarros, cigarrilhas e charutos",
      "active_share": 0.2422947818126335
    },
    {
      "code": "5111100",
      "total": 3272,
      "active": 1229,
      "label": "Transporte aéreo de passageiros regular",
      "active_share": 0.3756112469437653
    },
    {
      "code": "3299005",
      "total": 3252,
      "active": 1462,
      "label": "Fabricação de aviamentos para costura",
      "active_share": 0.44956949569495697
    },
    {
      "code": "0139399",
      "total": 3232,
      "active": 2599,
      "label": "Cultivo de outras plantas de lavoura permanente não especificadas anteriormente",
      "active_share": 0.8041460396039604
    },
    {
      "code": "7729299",
      "total": 3175,
      "active": 1063,
      "label": "Aluguel de outros objetos pessoais e domésticos não especificados anteriormente",
      "active_share": 0.3348031496062992
    },
    {
      "code": "4643502",
      "total": 3174,
      "active": 1338,
      "label": "Comércio atacadista de bolsas, malas e artigos de viagem",
      "active_share": 0.4215500945179584
    },
    {
      "code": "5011401",
      "total": 3163,
      "active": 1325,
      "label": "Transporte marítimo de cabotagem - Carga",
      "active_share": 0.41890610180208665
    },
    {
      "code": "0119905",
      "total": 3147,
      "active": 2418,
      "label": "Cultivo de feijão",
      "active_share": 0.7683508102955195
    },
    {
      "code": "2229303",
      "total": 3138,
      "active": 1570,
      "label": "Fabricação de artefatos de material plástico para uso na construção, exceto tubos e acessórios",
      "active_share": 0.5003186743148502
    },
    {
      "code": "2731700",
      "total": 3126,
      "active": 1856,
      "label": "Fabricação de aparelhos e equipamentos para distribuição e controle de energia elétrica",
      "active_share": 0.5937300063979527
    },
    {
      "code": "3512300",
      "total": 3122,
      "active": 2122,
      "label": "Transmissão de energia elétrica",
      "active_share": 0.6796925048046124
    },
    {
      "code": "2541100",
      "total": 3119,
      "active": 1285,
      "label": "Fabricação de artigos de cutelaria",
      "active_share": 0.4119910227637063
    },
    {
      "code": "2592602",
      "total": 3110,
      "active": 1436,
      "label": "Fabricação de produtos de trefilados de metal, exceto padronizados",
      "active_share": 0.4617363344051447
    },
    {
      "code": "2599302",
      "total": 3101,
      "active": 2240,
      "label": "Serviço de corte e dobra de metais",
      "active_share": 0.7223476297968398
    },
    {
      "code": "5510802",
      "total": 3100,
      "active": 1436,
      "label": "Apart-hotéis",
      "active_share": 0.4632258064516129
    },
    {
      "code": "3314708",
      "total": 3099,
      "active": 1847,
      "label": "Manutenção e reparação de máquinas, equipamentos e aparelhos para transporte e elevação de cargas",
      "active_share": 0.5959987092610519
    },
    {
      "code": "3220500",
      "total": 3075,
      "active": 1293,
      "label": "Fabricação de instrumentos musicais, peças e acessórios",
      "active_share": 0.42048780487804877
    },
    {
      "code": "1733800",
      "total": 3068,
      "active": 1339,
      "label": "Fabricação de chapas e de embalagens de papelão ondulado",
      "active_share": 0.4364406779661017
    },
    {
      "code": "1071600",
      "total": 3052,
      "active": 1041,
      "label": "Fabricação de açúcar em bruto",
      "active_share": 0.3410878112712975
    },
    {
      "code": "8424800",
      "total": 3038,
      "active": 1745,
      "label": "Segurança e ordem pública",
      "active_share": 0.5743910467412772
    },
    {
      "code": "4682600",
      "total": 3036,
      "active": 1072,
      "label": "Comércio atacadista de gás liqüefeito de petróleo (GLP)",
      "active_share": 0.3530961791831357
    },
    {
      "code": "2452100",
      "total": 2999,
      "active": 854,
      "label": "Fundição de metais não-ferrosos e suas ligas",
      "active_share": 0.2847615871957319
    },
    {
      "code": "4399102",
      "total": 2998,
      "active": 1364,
      "label": "Montagem e desmontagem de andaimes e outras estruturas temporárias",
      "active_share": 0.4549699799866578
    },
    {
      "code": "4633802",
      "total": 2922,
      "active": 1270,
      "label": "Comércio atacadista de aves vivas e ovos",
      "active_share": 0.4346338124572211
    },
    {
      "code": "0141502",
      "total": 2921,
      "active": 1702,
      "label": "Produção de sementes certificadas de forrageiras para formação de pasto",
      "active_share": 0.5826771653543307
    },
    {
      "code": "0111399",
      "total": 2882,
      "active": 1981,
      "label": "Cultivo de outros cereais não especificados anteriormente",
      "active_share": 0.6873698820263706
    },
    {
      "code": "0133410",
      "total": 2874,
      "active": 2101,
      "label": "Cultivo de manga",
      "active_share": 0.7310368823938761
    },
    {
      "code": "7490102",
      "total": 2854,
      "active": 1345,
      "label": "Escafandria e mergulho",
      "active_share": 0.4712683952347582
    },
    {
      "code": "2930103",
      "total": 2853,
      "active": 1300,
      "label": "Fabricação de cabines, carrocerias e reboques para outros veículos automotores, exceto caminhões e ônibus",
      "active_share": 0.4556607080266386
    },
    {
      "code": "1610204",
      "total": 2847,
      "active": 1362,
      "label": "Serrarias sem desdobramento de madeira em bruto  -Resserragem",
      "active_share": 0.47839831401475236
    },
    {
      "code": "6621501",
      "total": 2846,
      "active": 1217,
      "label": "Peritos e avaliadores de seguros",
      "active_share": 0.4276177090653549
    },
    {
      "code": "3329599",
      "total": 2843,
      "active": 1640,
      "label": "Instalação de outros equipamentos não especificados anteriormente",
      "active_share": 0.5768554344002814
    },
    {
      "code": "1354500",
      "total": 2807,
      "active": 986,
      "label": "Fabricação de tecidos especiais, inclusive artefatos",
      "active_share": 0.3512646954043463
    },
    {
      "code": "8630506",
      "total": 2804,
      "active": 1727,
      "label": "Serviços de vacinação e imunização humana",
      "active_share": 0.6159058487874465
    },
    {
      "code": "9603399",
      "total": 2790,
      "active": 1317,
      "label": "Atividades funerárias e serviços relacionados não especificados anteriormente",
      "active_share": 0.4720430107526882
    },
    {
      "code": "5091202",
      "total": 2787,
      "active": 1276,
      "label": "Transporte por navegação de travessia intermunicipal, interestadual e internacional",
      "active_share": 0.45783997129529963
    },
    {
      "code": "8640204",
      "total": 2745,
      "active": 2015,
      "label": "Serviços de tomografia",
      "active_share": 0.7340619307832422
    },
    {
      "code": "4929999",
      "total": 2744,
      "active": 480,
      "label": "Outros transportes rodoviários de passageiros não especificados anteriormente",
      "active_share": 0.1749271137026239
    },
    {
      "code": "1311100",
      "total": 2739,
      "active": 887,
      "label": "Preparação e fiação de fibras de algodão",
      "active_share": 0.3238408178167214
    },
    {
      "code": "4644302",
      "total": 2710,
      "active": 1333,
      "label": "Comércio atacadista de medicamentos e drogas de uso veterinário",
      "active_share": 0.4918819188191882
    },
    {
      "code": "4312600",
      "total": 2704,
      "active": 1537,
      "label": "Perfurações e sondagens",
      "active_share": 0.5684171597633136
    },
    {
      "code": "8690904",
      "total": 2694,
      "active": 2098,
      "label": "Atividades de podologia",
      "active_share": 0.7787676317743133
    },
    {
      "code": "0142300",
      "total": 2684,
      "active": 1983,
      "label": "Produção de mudas e outras formas de propagação vegetal, certificadas",
      "active_share": 0.738822652757079
    },
    {
      "code": "1099605",
      "total": 2678,
      "active": 1089,
      "label": "Fabricação de produtos para infusão (chá, mate, etc.)",
      "active_share": 0.4066467513069455
    },
    {
      "code": "2392300",
      "total": 2677,
      "active": 671,
      "label": "Fabricação de cal e gesso",
      "active_share": 0.25065371684721705
    },
    {
      "code": "0119904",
      "total": 2667,
      "active": 1868,
      "label": "Cultivo de cebola",
      "active_share": 0.7004124484439445
    },
    {
      "code": "5091201",
      "total": 2665,
      "active": 967,
      "label": "Transporte por navegação de travessia, municipal",
      "active_share": 0.36285178236397747
    },
    {
      "code": "4789009",
      "total": 2647,
      "active": 1770,
      "label": "Comércio varejista de armas e munições",
      "active_share": 0.6686815262561391
    },
    {
      "code": "6470103",
      "total": 2630,
      "active": 1999,
      "label": "Fundos de investimento imobiliários",
      "active_share": 0.7600760456273764
    },
    {
      "code": "4623108",
      "total": 2630,
      "active": 1100,
      "label": "Comércio atacadista de matérias-primas agrícolas com atividade de fracionamento e acondicionamento associada",
      "active_share": 0.41825095057034223
    },
    {
      "code": "0710301",
      "total": 2618,
      "active": 744,
      "label": "Extração de minério de ferro",
      "active_share": 0.28418640183346067
    },
    {
      "code": "9329803",
      "total": 2607,
      "active": 832,
      "label": "Exploração de jogos de sinuca, bilhar e similares",
      "active_share": 0.3191407748369774
    },
    {
      "code": "9900800",
      "total": 2595,
      "active": 2061,
      "label": "Organismos internacionais e outras instituições extraterritoriais",
      "active_share": 0.7942196531791907
    },
    {
      "code": "3317101",
      "total": 2584,
      "active": 1290,
      "label": "Manutenção e reparação de embarcações e estruturas flutuantes",
      "active_share": 0.49922600619195046
    },
    {
      "code": "3314718",
      "total": 2569,
      "active": 1109,
      "label": "Manutenção e reparação de máquinas para a indústria metalúrgica, exceto máquinas-ferramenta",
      "active_share": 0.43168548073180224
    },
    {
      "code": "2513600",
      "total": 2553,
      "active": 1043,
      "label": "Fabricação de obras de caldeiraria pesada",
      "active_share": 0.40853897375636505
    },
    {
      "code": "1322700",
      "total": 2538,
      "active": 880,
      "label": "Tecelagem de fios de fibras têxteis naturais, exceto algodão",
      "active_share": 0.3467297084318361
    },
    {
      "code": "9102302",
      "total": 2505,
      "active": 429,
      "label": "Restauração e conservação de lugares e prédios históricos",
      "active_share": 0.17125748502994012
    },
    {
      "code": "1112700",
      "total": 2502,
      "active": 1240,
      "label": "Fabricação de vinho",
      "active_share": 0.495603517186251
    },
    {
      "code": "1721400",
      "total": 2497,
      "active": 752,
      "label": "Fabricação de papel",
      "active_share": 0.3011613936724069
    },
    {
      "code": "1122401",
      "total": 2464,
      "active": 461,
      "label": "Fabricação de refrigerantes",
      "active_share": 0.18709415584415584
    },
    {
      "code": "4681802",
      "total": 2453,
      "active": 1220,
      "label": "Comércio atacadista de combustíveis realizado por transportador retalhista (T.R.R.)",
      "active_share": 0.49735018344883813
    },
    {
      "code": "6613400",
      "total": 2440,
      "active": 983,
      "label": "Administração de cartões de crédito",
      "active_share": 0.4028688524590164
    },
    {
      "code": "3314709",
      "total": 2426,
      "active": 851,
      "label": "Manutenção e reparação de máquinas de escrever, calcular e de outros equipamentos não-eletrônicos para escritório",
      "active_share": 0.35078318219291016
    },
    {
      "code": "0810007",
      "total": 2421,
      "active": 1215,
      "label": "Extração de argila e beneficiamento associado",
      "active_share": 0.5018587360594795
    },
    {
      "code": "1065101",
      "total": 2370,
      "active": 954,
      "label": "Fabricação de amidos e féculas de vegetais",
      "active_share": 0.40253164556962023
    },
    {
      "code": "2121101",
      "total": 2366,
      "active": 552,
      "label": "Fabricação de medicamentos alopáticos para uso humano",
      "active_share": 0.23330515638207946
    },
    {
      "code": "8422100",
      "total": 2357,
      "active": 1646,
      "label": "Defesa",
      "active_share": 0.6983453542638948
    },
    {
      "code": "2521700",
      "total": 2338,
      "active": 704,
      "label": "Fabricação de tanques, reservatórios metálicos e caldeiras para aquecimento central",
      "active_share": 0.3011120615911035
    },
    {
      "code": "3250705",
      "total": 2336,
      "active": 783,
      "label": "Fabricação de materiais para medicina e odontologia",
      "active_share": 0.3351883561643836
    },
    {
      "code": "4684201",
      "total": 2316,
      "active": 1052,
      "label": "Comércio atacadista de resinas e elastômeros",
      "active_share": 0.4542314335060449
    },
    {
      "code": "2733300",
      "total": 2293,
      "active": 769,
      "label": "Fabricação de fios, cabos e condutores elétricos isolados",
      "active_share": 0.33536851286524205
    },
    {
      "code": "6541300",
      "total": 2289,
      "active": 1564,
      "label": "Previdência complementar fechada",
      "active_share": 0.6832678025338575
    },
    {
      "code": "3812200",
      "total": 2270,
      "active": 1056,
      "label": "Coleta de resíduos perigosos",
      "active_share": 0.46519823788546255
    },
    {
      "code": "3511502",
      "total": 2235,
      "active": 1542,
      "label": "Atividades de coordenação e controle da operação da geração e transmissão de energia elétrica",
      "active_share": 0.6899328859060403
    },
    {
      "code": "6612601",
      "total": 2224,
      "active": 304,
      "label": "Corretoras de títulos e valores mobiliários",
      "active_share": 0.1366906474820144
    },
    {
      "code": "4511104",
      "total": 2220,
      "active": 1298,
      "label": "Comércio por atacado de caminhões novos e usados",
      "active_share": 0.5846846846846847
    },
    {
      "code": "8299701",
      "total": 2213,
      "active": 971,
      "label": "Medição de consumo de energia elétrica, gás e água",
      "active_share": 0.438770899231812
    },
    {
      "code": "0220904",
      "total": 2207,
      "active": 1235,
      "label": "Coleta de látex em florestas nativas",
      "active_share": 0.5595831445400997
    },
    {
      "code": "8711501",
      "total": 2207,
      "active": 1038,
      "label": "Clínicas e residências geriátricas",
      "active_share": 0.4703217036701405
    },
    {
      "code": "4311802",
      "total": 2202,
      "active": 798,
      "label": "Preparação de canteiro e limpeza de terreno",
      "active_share": 0.36239782016348776
    },
    {
      "code": "5231102",
      "total": 2186,
      "active": 1066,
      "label": "Atividades do Operador Portuário",
      "active_share": 0.4876486733760293
    },
    {
      "code": "4686901",
      "total": 2170,
      "active": 875,
      "label": "Comércio atacadista de papel e papelão em bruto",
      "active_share": 0.4032258064516129
    },
    {
      "code": "2221800",
      "total": 2158,
      "active": 825,
      "label": "Fabricação de laminados planos e tubulares de material plástico",
      "active_share": 0.38229842446709916
    },
    {
      "code": "0141501",
      "total": 2144,
      "active": 1386,
      "label": "Produção de sementes certificadas, exceto de forrageiras para pasto",
      "active_share": 0.6464552238805971
    },
    {
      "code": "1020102",
      "total": 2131,
      "active": 617,
      "label": "Fabricação de conservas de peixes, crustáceos e moluscos",
      "active_share": 0.2895354293758799
    },
    {
      "code": "0321302",
      "total": 2129,
      "active": 1038,
      "label": "Criação de camarões em água salgada e salobra",
      "active_share": 0.48755284170972285
    },
    {
      "code": "4679603",
      "total": 2128,
      "active": 967,
      "label": "Comércio atacadista de vidros, espelhos, vitrais e molduras",
      "active_share": 0.4544172932330827
    },
    {
      "code": "9003500",
      "total": 2128,
      "active": 927,
      "label": "Gestão de espaços para artes cênicas, espetáculos e outras atividades artísticas",
      "active_share": 0.4356203007518797
    },
    {
      "code": "1321900",
      "total": 2121,
      "active": 883,
      "label": "Tecelagem de fios de algodão",
      "active_share": 0.4163130598774163
    },
    {
      "code": "2621300",
      "total": 2099,
      "active": 483,
      "label": "Fabricação de equipamentos de informática",
      "active_share": 0.230109575988566
    },
    {
      "code": "2093200",
      "total": 2091,
      "active": 1103,
      "label": "Fabricação de aditivos de uso industrial",
      "active_share": 0.5274988043998087
    },
    {
      "code": "0910600",
      "total": 2091,
      "active": 1046,
      "label": "Atividades de apoio à extração de petróleo e gás natural",
      "active_share": 0.5002391200382592
    },
    {
      "code": "0600001",
      "total": 2067,
      "active": 1223,
      "label": "Extração de petróleo e gás natural",
      "active_share": 0.5916787614900823
    },
    {
      "code": "1111902",
      "total": 2061,
      "active": 790,
      "label": "Fabricação de outras aguardentes e bebidas destiladas",
      "active_share": 0.38330907326540514
    },
    {
      "code": "6424704",
      "total": 2058,
      "active": 1230,
      "label": "Cooperativas de crédito rural",
      "active_share": 0.597667638483965
    },
    {
      "code": "2052500",
      "total": 2039,
      "active": 270,
      "label": "Fabricação de desinfestantes domissanitários",
      "active_share": 0.13241785188818048
    },
    {
      "code": "4636201",
      "total": 2030,
      "active": 309,
      "label": "Comércio atacadista de fumo beneficiado",
      "active_share": 0.1522167487684729
    },
    {
      "code": "1062700",
      "total": 2029,
      "active": 525,
      "label": "Moagem de trigo e fabricação de derivados",
      "active_share": 0.25874815179891575
    },
    {
      "code": "6911703",
      "total": 2006,
      "active": 1300,
      "label": "Agente de propriedade industrial",
      "active_share": 0.6480558325024925
    },
    {
      "code": "2861500",
      "total": 1999,
      "active": 878,
      "label": "Fabricação de máquinas para a indústria metalúrgica, peças e acessórios, exceto máquinas-ferramenta",
      "active_share": 0.43921960980490243
    },
    {
      "code": "1353700",
      "total": 1994,
      "active": 617,
      "label": "Fabricação de artefatos de cordoaria",
      "active_share": 0.3094282848545637
    },
    {
      "code": "8720401",
      "total": 1981,
      "active": 1000,
      "label": "Atividades de centros de assistência psicossocial",
      "active_share": 0.5047955577990914
    },
    {
      "code": "0119908",
      "total": 1976,
      "active": 1250,
      "label": "Cultivo de melancia",
      "active_share": 0.6325910931174089
    },
    {
      "code": "4637105",
      "total": 1972,
      "active": 486,
      "label": "Comércio atacadista de massas alimentícias",
      "active_share": 0.24645030425963488
    },
    {
      "code": "5112901",
      "total": 1958,
      "active": 704,
      "label": "Serviço de táxi aéreo e locação de aeronaves com tripulação",
      "active_share": 0.3595505617977528
    },
    {
      "code": "2822402",
      "total": 1948,
      "active": 941,
      "label": "Fabricação de máquinas, equipamentos e aparelhos para transporte e elevação de cargas, peças e acessórios",
      "active_share": 0.4830595482546201
    },
    {
      "code": "1931400",
      "total": 1945,
      "active": 618,
      "label": "Fabricação de álcool",
      "active_share": 0.3177377892030848
    },
    {
      "code": "0162803",
      "total": 1938,
      "active": 1170,
      "label": "Serviço de manejo de animais",
      "active_share": 0.6037151702786377
    },
    {
      "code": "1830003",
      "total": 1927,
      "active": 1197,
      "label": "Reprodução de software em qualquer suporte",
      "active_share": 0.6211728074727556
    },
    {
      "code": "8640203",
      "total": 1915,
      "active": 1367,
      "label": "Serviços de diálise e nefrologia",
      "active_share": 0.7138381201044386
    },
    {
      "code": "8622400",
      "total": 1900,
      "active": 858,
      "label": "Serviços de remoção de pacientes, exceto os serviços móveis de atendimento a urgências",
      "active_share": 0.4515789473684211
    },
    {
      "code": "4637103",
      "total": 1871,
      "active": 796,
      "label": "Comércio atacadista de óleos e gorduras",
      "active_share": 0.4254409406734367
    },
    {
      "code": "0119901",
      "total": 1865,
      "active": 708,
      "label": "Cultivo de abacaxi",
      "active_share": 0.3796246648793566
    },
    {
      "code": "2640000",
      "total": 1838,
      "active": 604,
      "label": "Fabricação de aparelhos de recepção, reprodução, gravação e amplificação de áudio e vídeo",
      "active_share": 0.32861806311207836
    },
    {
      "code": "4789006",
      "total": 1814,
      "active": 696,
      "label": "Comércio varejista de fogos de artifício e artigos pirotécnicos",
      "active_share": 0.3836824696802646
    },
    {
      "code": "8640209",
      "total": 1814,
      "active": 1388,
      "label": "Serviços de diagnóstico por métodos ópticos - endoscopia e outros exames análogos",
      "active_share": 0.7651598676957001
    },
    {
      "code": "4651602",
      "total": 1813,
      "active": 809,
      "label": "Comércio atacadista de suprimentos para informática",
      "active_share": 0.44622173193601766
    },
    {
      "code": "6612604",
      "total": 1812,
      "active": 531,
      "label": "Corretoras de contratos de mercadorias",
      "active_share": 0.29304635761589404
    },
    {
      "code": "0210106",
      "total": 1809,
      "active": 975,
      "label": "Cultivo de mudas em viveiros florestais",
      "active_share": 0.538971807628524
    },
    {
      "code": "4329102",
      "total": 1792,
      "active": 889,
      "label": "Instalação de equipamentos para orientação à navegação marítima fluvial e lacustre",
      "active_share": 0.49609375
    },
    {
      "code": "0112101",
      "total": 1780,
      "active": 1155,
      "label": "Cultivo de algodão herbáceo",
      "active_share": 0.648876404494382
    },
    {
      "code": "8640208",
      "total": 1772,
      "active": 1137,
      "label": "Serviços de diagnóstico por registro gráfico - ECG, EEG e outros exames análogos",
      "active_share": 0.641647855530474
    },
    {
      "code": "3821100",
      "total": 1768,
      "active": 1106,
      "label": "Tratamento e disposição de resíduos não-perigosos",
      "active_share": 0.6255656108597285
    },
    {
      "code": "7729203",
      "total": 1761,
      "active": 767,
      "label": "Aluguel de material médico",
      "active_share": 0.4355479840999432
    },
    {
      "code": "3513100",
      "total": 1755,
      "active": 1116,
      "label": "Comércio atacadista de energia elétrica",
      "active_share": 0.6358974358974359
    },
    {
      "code": "1041400",
      "total": 1744,
      "active": 757,
      "label": "Fabricação de óleos vegetais em bruto, exceto óleo de milho",
      "active_share": 0.43405963302752293
    },
    {
      "code": "9001905",
      "total": 1727,
      "active": 736,
      "label": "Produção de espetáculos de rodeios, vaquejadas e similares",
      "active_share": 0.4261725535610886
    },
    {
      "code": "2622100",
      "total": 1668,
      "active": 406,
      "label": "Fabricação de periféricos para equipamentos de informática",
      "active_share": 0.2434052757793765
    },
    {
      "code": "1220499",
      "total": 1661,
      "active": 610,
      "label": "Fabricação de outros produtos do fumo, exceto cigarros, cigarrilhas e charutos",
      "active_share": 0.36724864539434077
    },
    {
      "code": "3012100",
      "total": 1660,
      "active": 490,
      "label": "Construção de embarcações para esporte e lazer",
      "active_share": 0.29518072289156627
    },
    {
      "code": "2812700",
      "total": 1659,
      "active": 828,
      "label": "Fabricação de equipamentos hidráulicos e pneumáticos, peças e acessórios, exceto válvulas",
      "active_share": 0.49909584086799275
    },
    {
      "code": "3092000",
      "total": 1658,
      "active": 786,
      "label": "Fabricação de bicicletas e triciclos não-motorizados, peças e acessórios",
      "active_share": 0.47406513872135103
    },
    {
      "code": "6520100",
      "total": 1657,
      "active": 116,
      "label": "Sociedade seguradora de seguros saúde",
      "active_share": 0.0700060350030175
    },
    {
      "code": "2341900",
      "total": 1655,
      "active": 449,
      "label": "Fabricação de produtos cerâmicos refratários",
      "active_share": 0.27129909365558913
    },
    {
      "code": "0153902",
      "total": 1629,
      "active": 1043,
      "label": "Criação de ovinos, inclusive para produção de lã",
      "active_share": 0.6402701043585022
    },
    {
      "code": "4618403",
      "total": 1627,
      "active": 568,
      "label": "Representantes comerciais e agentes do comércio de jornais, revistas e outras publicações",
      "active_share": 0.34910878918254457
    },
    {
      "code": "0210199",
      "total": 1621,
      "active": 1316,
      "label": "Produção de produtos não-madeireiros não especificados anteriormente em florestas plantadas",
      "active_share": 0.811844540407156
    },
    {
      "code": "5239799",
      "total": 1619,
      "active": 614,
      "label": "Atividades auxiliares dos transportes aquaviários não especificadas anteriormente",
      "active_share": 0.3792464484249537
    },
    {
      "code": "8425600",
      "total": 1617,
      "active": 1428,
      "label": "Defesa Civil",
      "active_share": 0.8831168831168831
    },
    {
      "code": "0220902",
      "total": 1589,
      "active": 407,
      "label": "Produção de carvão vegetal - florestas nativas",
      "active_share": 0.2561359345500315
    },
    {
      "code": "1312000",
      "total": 1586,
      "active": 397,
      "label": "Preparação e fiação de fibras têxteis naturais, exceto algodão",
      "active_share": 0.25031525851197983
    },
    {
      "code": "9001903",
      "total": 1586,
      "active": 818,
      "label": "Produção de espetáculos de dança",
      "active_share": 0.5157629255989912
    },
    {
      "code": "5021102",
      "total": 1586,
      "active": 850,
      "label": "Transporte por navegação interior de carga, intermunicipal, interestadual e internacional, exceto travessia",
      "active_share": 0.5359394703656999
    },
    {
      "code": "3314717",
      "total": 1584,
      "active": 971,
      "label": "Manutenção e reparação de máquinas e equipamentos de terraplenagem, pavimentação e construção, exceto tratores",
      "active_share": 0.6130050505050505
    },
    {
      "code": "1742799",
      "total": 1573,
      "active": 802,
      "label": "Fabricação de produtos de papel para uso doméstico e higiênico-sanitário não especificados anteriormente",
      "active_share": 0.5098537825810553
    },
    {
      "code": "4669901",
      "total": 1571,
      "active": 903,
      "label": "Comércio atacadista de bombas e compressores; partes e peças",
      "active_share": 0.5747931253978358
    },
    {
      "code": "0155504",
      "total": 1571,
      "active": 668,
      "label": "Criação de aves, exceto galináceos",
      "active_share": 0.4252068746021642
    },
    {
      "code": "3250701",
      "total": 1563,
      "active": 705,
      "label": "Fabricação de instrumentos não-eletrônicos e utensílios para uso médico, cirúrgico, odontológico e de laboratório",
      "active_share": 0.4510556621880998
    },
    {
      "code": "6619303",
      "total": 1563,
      "active": 94,
      "label": "Representações de bancos estrangeiros",
      "active_share": 0.060140754958413305
    },
    {
      "code": "2449199",
      "total": 1561,
      "active": 494,
      "label": "Metalurgia de outros metais não-ferrosos e suas ligas não especificados anteriormente",
      "active_share": 0.3164638052530429
    },
    {
      "code": "1122403",
      "total": 1547,
      "active": 453,
      "label": "Fabricação de refrescos, xaropes e pós para refrescos, exceto refrescos de frutas",
      "active_share": 0.29282482223658696
    },
    {
      "code": "0322105",
      "total": 1544,
      "active": 155,
      "label": "Ranicultura",
      "active_share": 0.10038860103626943
    },
    {
      "code": "1532700",
      "total": 1538,
      "active": 287,
      "label": "Fabricação de tênis de qualquer material",
      "active_share": 0.18660598179453836
    },
    {
      "code": "2759799",
      "total": 1531,
      "active": 545,
      "label": "Fabricação de outros aparelhos eletrodomésticos não especificados anteriormente, peças e acessórios",
      "active_share": 0.3559764859568909
    },
    {
      "code": "0133409",
      "total": 1531,
      "active": 1171,
      "label": "Cultivo de maracujá",
      "active_share": 0.7648595689092097
    },
    {
      "code": "3316301",
      "total": 1525,
      "active": 966,
      "label": "Manutenção e reparação de aeronaves, exceto a manutenção na pista",
      "active_share": 0.6334426229508197
    },
    {
      "code": "4649403",
      "total": 1521,
      "active": 679,
      "label": "Comércio atacadista de bicicletas, triciclos e outros veículos recreativos",
      "active_share": 0.44641683103221563
    },
    {
      "code": "1013902",
      "total": 1505,
      "active": 696,
      "label": "Preparação de subprodutos do abate",
      "active_share": 0.46245847176079735
    },
    {
      "code": "4634602",
      "total": 1499,
      "active": 714,
      "label": "Comércio atacadista de aves abatidas e derivados",
      "active_share": 0.47631754503002
    },
    {
      "code": "8640212",
      "total": 1487,
      "active": 903,
      "label": "Serviços de hemoterapia",
      "active_share": 0.6072629455279085
    },
    {
      "code": "0810004",
      "total": 1485,
      "active": 879,
      "label": "Extração de calcário e dolomita e beneficiamento associado",
      "active_share": 0.591919191919192
    },
    {
      "code": "5250805",
      "total": 1475,
      "active": 758,
      "label": "Operador de transporte multimodal - OTM",
      "active_share": 0.5138983050847458
    },
    {
      "code": "0152101",
      "total": 1468,
      "active": 948,
      "label": "Criação de bufalinos",
      "active_share": 0.6457765667574932
    },
    {
      "code": "2732500",
      "total": 1467,
      "active": 429,
      "label": "Fabricação de material elétrico para instalações em circuito de consumo",
      "active_share": 0.29243353783231085
    },
    {
      "code": "4649406",
      "total": 1463,
      "active": 713,
      "label": "Comércio atacadista de lustres, luminárias e abajures",
      "active_share": 0.48735475051264526
    },
    {
      "code": "2441501",
      "total": 1447,
      "active": 262,
      "label": "Produção de alumínio e suas ligas em formas primárias",
      "active_share": 0.18106427090532135
    },
    {
      "code": "8690903",
      "total": 1440,
      "active": 1003,
      "label": "Atividades de acupuntura",
      "active_share": 0.6965277777777777
    },
    {
      "code": "9200399",
      "total": 1440,
      "active": 589,
      "label": "Exploração de jogos de azar e apostas não especificados anteriormente",
      "active_share": 0.40902777777777777
    },
    {
      "code": "3099700",
      "total": 1439,
      "active": 244,
      "label": "Fabricação de equipamentos de transporte não especificados anteriormente",
      "active_share": 0.1695621959694232
    },
    {
      "code": "2945000",
      "total": 1435,
      "active": 495,
      "label": "Fabricação de material elétrico e eletrônico para veículos automotores, exceto baterias",
      "active_share": 0.34494773519163763
    },
    {
      "code": "8621601",
      "total": 1423,
      "active": 781,
      "label": "UTI móvel",
      "active_share": 0.5488404778636683
    },
    {
      "code": "8599602",
      "total": 1421,
      "active": 818,
      "label": "Cursos de pilotagem",
      "active_share": 0.5756509500351865
    },
    {
      "code": "2311700",
      "total": 1420,
      "active": 711,
      "label": "Fabricação de vidro plano e de segurança",
      "active_share": 0.5007042253521127
    },
    {
      "code": "4623105",
      "total": 1413,
      "active": 515,
      "label": "Comércio atacadista de cacau",
      "active_share": 0.36447275300778487
    },
    {
      "code": "3313902",
      "total": 1412,
      "active": 747,
      "label": "Manutenção e reparação de baterias e acumuladores elétricos, exceto para veículos",
      "active_share": 0.5290368271954674
    },
    {
      "code": "6612602",
      "total": 1408,
      "active": 268,
      "label": "Distribuidoras de títulos e valores mobiliários",
      "active_share": 0.1903409090909091
    },
    {
      "code": "8640206",
      "total": 1406,
      "active": 1028,
      "label": "Serviços de ressonância magnética",
      "active_share": 0.7311522048364154
    },
    {
      "code": "5912002",
      "total": 1404,
      "active": 713,
      "label": "Serviços de mixagem sonora em produção audiovisual",
      "active_share": 0.5078347578347578
    },
    {
      "code": "4649405",
      "total": 1403,
      "active": 531,
      "label": "Comércio atacadista de artigos de tapeçaria; persianas e cortinas",
      "active_share": 0.37847469707769066
    },
    {
      "code": "6511102",
      "total": 1401,
      "active": 744,
      "label": "Planos de auxílio-funeral",
      "active_share": 0.5310492505353319
    },
    {
      "code": "4211102",
      "total": 1397,
      "active": 781,
      "label": "Pintura para sinalização em pistas rodoviárias e aeroportos",
      "active_share": 0.5590551181102362
    },
    {
      "code": "1323500",
      "total": 1391,
      "active": 512,
      "label": "Tecelagem de fios de fibras artificiais e sintéticas",
      "active_share": 0.3680805176132279
    },
    {
      "code": "8542200",
      "total": 1382,
      "active": 894,
      "label": "Educação profissional de nível tecnológico",
      "active_share": 0.6468885672937771
    },
    {
      "code": "2813500",
      "total": 1382,
      "active": 676,
      "label": "Fabricação de válvulas, registros e dispositivos semelhantes, peças e acessórios",
      "active_share": 0.48914616497829233
    },
    {
      "code": "5240101",
      "total": 1376,
      "active": 322,
      "label": "Operação dos aeroportos e campos de aterrissagem",
      "active_share": 0.23401162790697674
    },
    {
      "code": "8299703",
      "total": 1361,
      "active": 595,
      "label": "Serviços de gravação de carimbos, exceto confecção",
      "active_share": 0.4371785451873622
    },
    {
      "code": "0220901",
      "total": 1358,
      "active": 666,
      "label": "Extração de madeira em florestas nativas",
      "active_share": 0.49042709867452133
    },
    {
      "code": "1011205",
      "total": 1357,
      "active": 382,
      "label": "Matadouro - abate de reses sob contrato - exceto abate de suínos",
      "active_share": 0.2815033161385409
    },
    {
      "code": "5229001",
      "total": 1341,
      "active": 408,
      "label": "Serviços de apoio ao transporte por táxi, inclusive centrais de chamada",
      "active_share": 0.3042505592841163
    },
    {
      "code": "6621502",
      "total": 1324,
      "active": 703,
      "label": "Auditoria e consultoria atuarial",
      "active_share": 0.5309667673716012
    },
    {
      "code": "1020101",
      "total": 1322,
      "active": 879,
      "label": "Preservação de peixes, crustáceos e moluscos",
      "active_share": 0.6649016641452344
    },
    {
      "code": "2320600",
      "total": 1319,
      "active": 247,
      "label": "Fabricação de cimento",
      "active_share": 0.18726307808946172
    },
    {
      "code": "2710402",
      "total": 1318,
      "active": 560,
      "label": "Fabricação de transformadores, indutores, conversores, sincronizadores e semelhantes, peças e acessórios",
      "active_share": 0.424886191198786
    },
    {
      "code": "4649407",
      "total": 1314,
      "active": 157,
      "label": "Comércio atacadista de filmes, CDs, DVDs, fitas e discos",
      "active_share": 0.11948249619482496
    },
    {
      "code": "0892401",
      "total": 1301,
      "active": 203,
      "label": "Extração de sal marinho",
      "active_share": 0.15603382013835512
    },
    {
      "code": "4637102",
      "total": 1300,
      "active": 450,
      "label": "Comércio atacadista de açúcar",
      "active_share": 0.34615384615384615
    },
    {
      "code": "3250707",
      "total": 1286,
      "active": 652,
      "label": "Fabricação de artigos ópticos",
      "active_share": 0.5069984447900466
    },
    {
      "code": "8730102",
      "total": 1281,
      "active": 799,
      "label": "Albergues assistenciais",
      "active_share": 0.6237314597970336
    },
    {
      "code": "2941700",
      "total": 1270,
      "active": 585,
      "label": "Fabricação de peças e acessórios para o sistema motor de veículos automotores",
      "active_share": 0.46062992125984253
    },
    {
      "code": "2591800",
      "total": 1268,
      "active": 333,
      "label": "Fabricação de embalagens metálicas",
      "active_share": 0.26261829652996843
    },
    {
      "code": "0159899",
      "total": 1265,
      "active": 665,
      "label": "Criação de outros animais não especificados anteriormente",
      "active_share": 0.525691699604743
    },
    {
      "code": "2013401",
      "total": 1230,
      "active": 970,
      "label": "Fabricação de adubos e fertilizantes organo-minerais",
      "active_share": 0.7886178861788617
    },
    {
      "code": "3314704",
      "total": 1216,
      "active": 701,
      "label": "Manutenção e reparação de compressores",
      "active_share": 0.5764802631578947
    },
    {
      "code": "0990403",
      "total": 1210,
      "active": 754,
      "label": "Atividades de apoio à extração de minerais não-metálicos",
      "active_share": 0.6231404958677685
    },
    {
      "code": "9101500",
      "total": 1195,
      "active": 444,
      "label": "Atividades de bibliotecas e arquivos",
      "active_share": 0.37154811715481173
    },
    {
      "code": "2710401",
      "total": 1190,
      "active": 777,
      "label": "Fabricação de geradores de corrente contínua e alternada, peças e acessórios",
      "active_share": 0.6529411764705882
    },
    {
      "code": "4649409",
      "total": 1184,
      "active": 391,
      "label": "Comércio atacadista de produtos de higiene, limpeza e conservação domiciliar, com atividade de fracionamento e acondicionamento associada",
      "active_share": 0.3302364864864865
    },
    {
      "code": "2031200",
      "total": 1176,
      "active": 327,
      "label": "Fabricação de resinas termoplásticas",
      "active_share": 0.2780612244897959
    },
    {
      "code": "0810009",
      "total": 1166,
      "active": 459,
      "label": "Extração de basalto e beneficiamento associado",
      "active_share": 0.3936535162950257
    },
    {
      "code": "1812100",
      "total": 1164,
      "active": 429,
      "label": "Impressão de material de segurança",
      "active_share": 0.36855670103092786
    },
    {
      "code": "6141800",
      "total": 1158,
      "active": 305,
      "label": "Operadoras de televisão por assinatura por cabo",
      "active_share": 0.26338514680483593
    },
    {
      "code": "3314705",
      "total": 1148,
      "active": 571,
      "label": "Manutenção e reparação de equipamentos de transmissão para fins industriais",
      "active_share": 0.49738675958188155
    },
    {
      "code": "6120599",
      "total": 1142,
      "active": 311,
      "label": "Serviços de telecomunicações sem fio não especificados anteriormente",
      "active_share": 0.2723292469352014
    },
    {
      "code": "1012103",
      "total": 1138,
      "active": 551,
      "label": "Frigorífico - abate de suínos",
      "active_share": 0.484182776801406
    },
    {
      "code": "4319300",
      "total": 1137,
      "active": 587,
      "label": "Serviços de preparação do terreno não especificados anteriormente",
      "active_share": 0.5162708883025505
    },
    {
      "code": "8423000",
      "total": 1132,
      "active": 673,
      "label": "Justiça",
      "active_share": 0.5945229681978799
    },
    {
      "code": "6542100",
      "total": 1132,
      "active": 191,
      "label": "Previdência complementar aberta",
      "active_share": 0.1687279151943463
    },
    {
      "code": "1421500",
      "total": 1117,
      "active": 365,
      "label": "Fabricação de meias",
      "active_share": 0.3267681289167413
    },
    {
      "code": "6612603",
      "total": 1112,
      "active": 393,
      "label": "Corretoras de câmbio",
      "active_share": 0.3534172661870504
    },
    {
      "code": "5022002",
      "total": 1104,
      "active": 559,
      "label": "Transporte por navegação interior de passageiros em linhas regulares, intermunicipal, interestadual e internacional, exceto travessia",
      "active_share": 0.5063405797101449
    },
    {
      "code": "0891600",
      "total": 1092,
      "active": 324,
      "label": "Extração de minerais para fabricação de adubos, fertilizantes e outros produtos químicos",
      "active_share": 0.2967032967032967
    },
    {
      "code": "2631100",
      "total": 1090,
      "active": 363,
      "label": "Fabricação de equipamentos transmissores de comunicação, peças e acessórios",
      "active_share": 0.3330275229357798
    },
    {
      "code": "0162801",
      "total": 1081,
      "active": 701,
      "label": "Serviço de inseminação artificial em animais",
      "active_share": 0.6484736355226642
    },
    {
      "code": "0321304",
      "total": 1073,
      "active": 228,
      "label": "Criação de peixes ornamentais em água salgada e salobra",
      "active_share": 0.2124883504193849
    },
    {
      "code": "2091600",
      "total": 1071,
      "active": 411,
      "label": "Fabricação de adesivos e selantes",
      "active_share": 0.38375350140056025
    },
    {
      "code": "3312104",
      "total": 1069,
      "active": 217,
      "label": "Manutenção e reparação de equipamentos e instrumentos ópticos",
      "active_share": 0.2029934518241347
    },
    {
      "code": "8299704",
      "total": 1067,
      "active": 490,
      "label": "Leiloeiros independentes",
      "active_share": 0.4592314901593252
    },
    {
      "code": "0121102",
      "total": 1056,
      "active": 883,
      "label": "Cultivo de morango",
      "active_share": 0.8361742424242424
    },
    {
      "code": "9102301",
      "total": 1051,
      "active": 690,
      "label": "Atividades de museus e de exploração de lugares e prédios históricos e atrações similares",
      "active_share": 0.6565176022835395
    },
    {
      "code": "4299501",
      "total": 1049,
      "active": 567,
      "label": "Construção de instalações esportivas e recreativas",
      "active_share": 0.540514775977121
    },
    {
      "code": "1220401",
      "total": 1048,
      "active": 96,
      "label": "Fabricação de cigarros",
      "active_share": 0.0916030534351145
    },
    {
      "code": "8640210",
      "total": 1045,
      "active": 712,
      "label": "Serviços de quimioterapia",
      "active_share": 0.6813397129186602
    },
    {
      "code": "4645102",
      "total": 1041,
      "active": 556,
      "label": "Comércio atacadista de próteses e artigos de ortopedia",
      "active_share": 0.5341018251681076
    },
    {
      "code": "0155502",
      "total": 1016,
      "active": 463,
      "label": "Produção de pintos de um dia",
      "active_share": 0.45570866141732286
    },
    {
      "code": "0899102",
      "total": 999,
      "active": 455,
      "label": "Extração de quartzo",
      "active_share": 0.45545545545545546
    },
    {
      "code": "5030101",
      "total": 996,
      "active": 593,
      "label": "Navegação de apoio marítimo",
      "active_share": 0.5953815261044176
    },
    {
      "code": "3011302",
      "total": 983,
      "active": 393,
      "label": "Construção de embarcações para uso comercial e para usos especiais, exceto de grande porte",
      "active_share": 0.3997965412004069
    },
    {
      "code": "3701100",
      "total": 978,
      "active": 695,
      "label": "Gestão de redes de esgoto",
      "active_share": 0.7106339468302658
    },
    {
      "code": "6130200",
      "total": 956,
      "active": 367,
      "label": "Telecomunicações por satélite",
      "active_share": 0.38389121338912136
    },
    {
      "code": "6110899",
      "total": 953,
      "active": 270,
      "label": "Serviços de telecomunicações por fio não especificados anteriormente",
      "active_share": 0.2833158447009444
    },
    {
      "code": "2424502",
      "total": 942,
      "active": 458,
      "label": "Produção de relaminados, trefilados e perfilados de aço, exceto arames",
      "active_share": 0.4861995753715499
    },
    {
      "code": "2864000",
      "total": 934,
      "active": 293,
      "label": "Fabricação de máquinas e equipamentos para as indústrias do vestuário, do couro e de calçados, peças e acessórios",
      "active_share": 0.31370449678800855
    },
    {
      "code": "2660400",
      "total": 930,
      "active": 433,
      "label": "Fabricação de aparelhos eletromédicos e eletroterapêuticos e equipamentos de irradiação",
      "active_share": 0.46559139784946235
    },
    {
      "code": "2122000",
      "total": 930,
      "active": 312,
      "label": "Fabricação de medicamentos para uso veterinário",
      "active_share": 0.33548387096774196
    },
    {
      "code": "3011301",
      "total": 924,
      "active": 324,
      "label": "Construção de embarcações de grande porte",
      "active_share": 0.35064935064935066
    },
    {
      "code": "6450600",
      "total": 918,
      "active": 115,
      "label": "Sociedades de capitalização",
      "active_share": 0.12527233115468409
    },
    {
      "code": "0112199",
      "total": 911,
      "active": 766,
      "label": "Cultivo de outras fibras de lavoura temporária não especificadas anteriormente",
      "active_share": 0.8408342480790341
    },
    {
      "code": "7719501",
      "total": 894,
      "active": 422,
      "label": "Locação de embarcações sem tripulação, exceto para fins recreativos",
      "active_share": 0.4720357941834452
    },
    {
      "code": "7319001",
      "total": 879,
      "active": 551,
      "label": "Criação de estandes para feiras e exposições",
      "active_share": 0.626848691695108
    },
    {
      "code": "9603303",
      "total": 878,
      "active": 255,
      "label": "Serviços de sepultamento",
      "active_share": 0.29043280182232345
    },
    {
      "code": "1122499",
      "total": 878,
      "active": 264,
      "label": "Fabricação de outras bebidas não-alcoólicas não especificadas anteriormente",
      "active_share": 0.30068337129840544
    },
    {
      "code": "2223400",
      "total": 876,
      "active": 507,
      "label": "Fabricação de tubos e acessórios de material plástico para uso na construção",
      "active_share": 0.5787671232876712
    },
    {
      "code": "2815102",
      "total": 873,
      "active": 341,
      "label": "Fabricação de equipamentos de transmissão para fins industriais, exceto rolamentos",
      "active_share": 0.39060710194730813
    },
    {
      "code": "0220999",
      "total": 871,
      "active": 420,
      "label": "Coleta de produtos não-madeireiros não especificados anteriormente em florestas nativas",
      "active_share": 0.48220436280137774
    },
    {
      "code": "1313800",
      "total": 867,
      "active": 193,
      "label": "Fiação de fibras artificiais e sintéticas",
      "active_share": 0.22260668973471742
    },
    {
      "code": "8711503",
      "total": 861,
      "active": 462,
      "label": "Atividades de assistência a deficientes físicos, imunodeprimidos e convalescentes",
      "active_share": 0.5365853658536586
    },
    {
      "code": "2019399",
      "total": 855,
      "active": 406,
      "label": "Fabricação de outros produtos químicos inorgânicos não especificados anteriormente",
      "active_share": 0.47485380116959064
    },
    {
      "code": "5812300",
      "total": 853,
      "active": 87,
      "label": "Edição de jornais",
      "active_share": 0.10199296600234467
    },
    {
      "code": "5022001",
      "total": 849,
      "active": 197,
      "label": "Transporte por navegação interior de passageiros em linhas regulares, municipal, exceto travessia",
      "active_share": 0.232037691401649
    },
    {
      "code": "4623103",
      "total": 848,
      "active": 331,
      "label": "Comércio atacadista de algodão",
      "active_share": 0.3903301886792453
    },
    {
      "code": "6440900",
      "total": 844,
      "active": 244,
      "label": "Arrendamento mercantil",
      "active_share": 0.2890995260663507
    },
    {
      "code": "8012900",
      "total": 838,
      "active": 343,
      "label": "Atividades de transporte de valores",
      "active_share": 0.40930787589498807
    },
    {
      "code": "9601702",
      "total": 828,
      "active": 347,
      "label": "Tinturarias",
      "active_share": 0.4190821256038647
    },
    {
      "code": "1340502",
      "total": 821,
      "active": 411,
      "label": "Alvejamento, tingimento e torção em fios, tecidos, artefatos têxteis e peças do vestuário",
      "active_share": 0.5006090133982948
    },
    {
      "code": "2412100",
      "total": 820,
      "active": 161,
      "label": "Produção de ferroligas",
      "active_share": 0.19634146341463415
    },
    {
      "code": "2790202",
      "total": 811,
      "active": 257,
      "label": "Fabricação de equipamentos para sinalização e alarme",
      "active_share": 0.31689272503082616
    },
    {
      "code": "0133405",
      "total": 810,
      "active": 553,
      "label": "Cultivo de coco-da-baía",
      "active_share": 0.682716049382716
    },
    {
      "code": "2014200",
      "total": 797,
      "active": 400,
      "label": "Fabricação de gases industriais",
      "active_share": 0.5018820577164367
    },
    {
      "code": "6022501",
      "total": 796,
      "active": 251,
      "label": "Programadoras",
      "active_share": 0.31532663316582915
    },
    {
      "code": "2632900",
      "total": 796,
      "active": 123,
      "label": "Fabricação de aparelhos telefônicos e de outros equipamentos de comunicação, peças e acessórios",
      "active_share": 0.15452261306532664
    },
    {
      "code": "0135100",
      "total": 796,
      "active": 412,
      "label": "Cultivo de cacau",
      "active_share": 0.5175879396984925
    },
    {
      "code": "1061902",
      "total": 794,
      "active": 157,
      "label": "Fabricação de produtos do arroz",
      "active_share": 0.1977329974811083
    },
    {
      "code": "0133408",
      "total": 794,
      "active": 488,
      "label": "Cultivo de mamão",
      "active_share": 0.6146095717884131
    },
    {
      "code": "2821601",
      "total": 791,
      "active": 306,
      "label": "Fabricação de fornos industriais, aparelhos e equipamentos não-elétricos para instalações térmicas, peças e acessórios",
      "active_share": 0.3868520859671302
    },
    {
      "code": "4623104",
      "total": 780,
      "active": 302,
      "label": "Comércio atacadista de fumo em folha não beneficiado",
      "active_share": 0.3871794871794872
    },
    {
      "code": "0155503",
      "total": 779,
      "active": 534,
      "label": "Criação de outros galináceos, exceto para corte",
      "active_share": 0.6854942233632862
    },
    {
      "code": "2531402",
      "total": 779,
      "active": 118,
      "label": "Produção de forjados de metais não-ferrosos e suas ligas",
      "active_share": 0.1514762516046213
    },
    {
      "code": "0729401",
      "total": 771,
      "active": 65,
      "label": "Extração de minérios de nióbio e titânio",
      "active_share": 0.08430609597924774
    },
    {
      "code": "2825900",
      "total": 769,
      "active": 498,
      "label": "Fabricação de máquinas e equipamentos para saneamento básico e ambiental, peças e acessórios",
      "active_share": 0.647594278283485
    },
    {
      "code": "2411300",
      "total": 766,
      "active": 242,
      "label": "Produção de ferro-gusa",
      "active_share": 0.31592689295039167
    },
    {
      "code": "2944100",
      "total": 763,
      "active": 405,
      "label": "Fabricação de peças e acessórios para o sistema de direção e suspensão de veículos automotores",
      "active_share": 0.5307994757536042
    },
    {
      "code": "2110600",
      "total": 763,
      "active": 220,
      "label": "Fabricação de produtos farmoquímicos",
      "active_share": 0.28833551769331583
    },
    {
      "code": "3250703",
      "total": 755,
      "active": 311,
      "label": "Fabricação de aparelhos e utensílios para correção de defeitos físicos e aparelhos ortopédicos em geral sob encomenda",
      "active_share": 0.4119205298013245
    },
    {
      "code": "0810003",
      "total": 745,
      "active": 356,
      "label": "Extração de mármore e beneficiamento associado",
      "active_share": 0.4778523489932886
    },
    {
      "code": "3314703",
      "total": 736,
      "active": 412,
      "label": "Manutenção e reparação de válvulas industriais",
      "active_share": 0.5597826086956522
    },
    {
      "code": "0162802",
      "total": 735,
      "active": 334,
      "label": "Serviço de tosquiamento de ovinos",
      "active_share": 0.454421768707483
    },
    {
      "code": "2531401",
      "total": 730,
      "active": 165,
      "label": "Produção de forjados de aço",
      "active_share": 0.22602739726027396
    },
    {
      "code": "3250709",
      "total": 724,
      "active": 442,
      "label": "Serviço de laboratório óptico",
      "active_share": 0.6104972375690608
    },
    {
      "code": "1811301",
      "total": 720,
      "active": 285,
      "label": "Impressão de jornais",
      "active_share": 0.3958333333333333
    },
    {
      "code": "0990402",
      "total": 720,
      "active": 435,
      "label": "Atividades de apoio à extração de minerais metálicos não-ferrosos",
      "active_share": 0.6041666666666666
    },
    {
      "code": "2051700",
      "total": 715,
      "active": 315,
      "label": "Fabricação de defensivos agrícolas",
      "active_share": 0.4405594405594406
    },
    {
      "code": "0153901",
      "total": 694,
      "active": 452,
      "label": "Criação de caprinos",
      "active_share": 0.6512968299711815
    },
    {
      "code": "8640211",
      "total": 692,
      "active": 470,
      "label": "Serviços de radioterapia",
      "active_share": 0.6791907514450867
    },
    {
      "code": "1081301",
      "total": 689,
      "active": 340,
      "label": "Beneficiamento de café",
      "active_share": 0.4934687953555878
    },
    {
      "code": "3839401",
      "total": 686,
      "active": 451,
      "label": "Usinas de compostagem",
      "active_share": 0.6574344023323615
    },
    {
      "code": "0311604",
      "total": 681,
      "active": 179,
      "label": "Atividades de apoio à pesca em água salgada",
      "active_share": 0.26284875183553597
    },
    {
      "code": "8621602",
      "total": 677,
      "active": 402,
      "label": "Serviços móveis de atendimento a urgências, exceto por UTI móvel",
      "active_share": 0.5937961595273265
    },
    {
      "code": "5112999",
      "total": 676,
      "active": 224,
      "label": "Outros serviços de transporte aéreo de passageiros não-regular",
      "active_share": 0.33136094674556216
    },
    {
      "code": "6435201",
      "total": 675,
      "active": 26,
      "label": "Sociedades de crédito imobiliário",
      "active_share": 0.03851851851851852
    },
    {
      "code": "2441502",
      "total": 674,
      "active": 316,
      "label": "Produção de laminados de alumínio",
      "active_share": 0.4688427299703264
    },
    {
      "code": "2073800",
      "total": 673,
      "active": 204,
      "label": "Fabricação de impermeabilizantes, solventes e produtos afins",
      "active_share": 0.3031203566121842
    },
    {
      "code": "1099607",
      "total": 669,
      "active": 502,
      "label": "Fabricação de alimentos dietéticos e complementos alimentares",
      "active_share": 0.750373692077728
    },
    {
      "code": "6120502",
      "total": 660,
      "active": 330,
      "label": "Serviço móvel especializado - SME",
      "active_share": 0.5
    },
    {
      "code": "0322107",
      "total": 660,
      "active": 224,
      "label": "Atividades de apoio à aqüicultura em água doce",
      "active_share": 0.3393939393939394
    },
    {
      "code": "0311602",
      "total": 651,
      "active": 472,
      "label": "Pesca de crustáceos e moluscos em água salgada",
      "active_share": 0.7250384024577573
    },
    {
      "code": "2811900",
      "total": 649,
      "active": 170,
      "label": "Fabricação de motores e turbinas, peças e acessórios, exceto para aviões e veículos rodoviários",
      "active_share": 0.26194144838212635
    },
    {
      "code": "0220906",
      "total": 648,
      "active": 397,
      "label": "Conservação de florestas nativas",
      "active_share": 0.6126543209876543
    },
    {
      "code": "9412001",
      "total": 648,
      "active": 600,
      "label": "Atividades de fiscalização profissional",
      "active_share": 0.9259259259259259
    },
    {
      "code": "0133401",
      "total": 644,
      "active": 431,
      "label": "Cultivo de açaí",
      "active_share": 0.6692546583850931
    },
    {
      "code": "1032501",
      "total": 631,
      "active": 361,
      "label": "Fabricação de conservas de palmito",
      "active_share": 0.572107765451664
    },
    {
      "code": "0721901",
      "total": 626,
      "active": 270,
      "label": "Extração de minério de alumínio",
      "active_share": 0.43130990415335463
    },
    {
      "code": "0729404",
      "total": 625,
      "active": 277,
      "label": "Extração de minérios de cobre, chumbo, zinco e outros minerais metálicos não-ferrosos não especificados anteriormente",
      "active_share": 0.4432
    },
    {
      "code": "4511105",
      "total": 624,
      "active": 393,
      "label": "Comércio por atacado de reboques e semi-reboques novos e usados",
      "active_share": 0.6298076923076923
    },
    {
      "code": "3314721",
      "total": 622,
      "active": 330,
      "label": "Manutenção e reparação de máquinas e aparelhos para a indústria de celulose, papel e papelão e artefatos",
      "active_share": 0.5305466237942122
    },
    {
      "code": "2751100",
      "total": 622,
      "active": 201,
      "label": "Fabricação de fogões, refrigeradores e máquinas de lavar e secar para uso doméstico, peças e acessórios",
      "active_share": 0.32315112540192925
    },
    {
      "code": "8730101",
      "total": 620,
      "active": 408,
      "label": "Orfanatos",
      "active_share": 0.6580645161290323
    },
    {
      "code": "5030102",
      "total": 616,
      "active": 385,
      "label": "Navegação de apoio portuário",
      "active_share": 0.625
    },
    {
      "code": "0139304",
      "total": 613,
      "active": 467,
      "label": "Cultivo de plantas para condimento, exceto pimenta-do-reino",
      "active_share": 0.7618270799347472
    },
    {
      "code": "2422901",
      "total": 611,
      "active": 155,
      "label": "Produção de laminados planos de aço ao carbono, revestidos ou não",
      "active_share": 0.25368248772504093
    },
    {
      "code": "3822000",
      "total": 608,
      "active": 396,
      "label": "Tratamento e disposição de resíduos perigosos",
      "active_share": 0.6513157894736842
    },
    {
      "code": "4634699",
      "total": 604,
      "active": 272,
      "label": "Comércio atacadista de carnes e derivados de outros animais",
      "active_share": 0.4503311258278146
    },
    {
      "code": "1042200",
      "total": 602,
      "active": 252,
      "label": "Fabricação de óleos vegetais refinados, exceto óleo de milho",
      "active_share": 0.4186046511627907
    },
    {
      "code": "2431800",
      "total": 596,
      "active": 180,
      "label": "Produção de tubos de aço com costura",
      "active_share": 0.30201342281879195
    },
    {
      "code": "2722801",
      "total": 593,
      "active": 170,
      "label": "Fabricação de baterias e acumuladores para veículos automotores",
      "active_share": 0.2866779089376054
    },
    {
      "code": "2330303",
      "total": 591,
      "active": 188,
      "label": "Fabricação de artefatos de fibrocimento para uso na construção",
      "active_share": 0.31810490693739424
    },
    {
      "code": "0810008",
      "total": 591,
      "active": 303,
      "label": "Extração de saibro e beneficiamento associado",
      "active_share": 0.5126903553299492
    },
    {
      "code": "8413200",
      "total": 585,
      "active": 436,
      "label": "Regulação das atividades econômicas",
      "active_share": 0.7452991452991453
    },
    {
      "code": "4911600",
      "total": 582,
      "active": 217,
      "label": "Transporte ferroviário de carga",
      "active_share": 0.37285223367697595
    },
    {
      "code": "2852600",
      "total": 581,
      "active": 273,
      "label": "Fabricação de outras máquinas e equipamentos para uso na extração mineral, peças e acessórios, exceto na extração de petróleo",
      "active_share": 0.46987951807228917
    },
    {
      "code": "1921700",
      "total": 579,
      "active": 232,
      "label": "Fabricação de produtos do refino de petróleo",
      "active_share": 0.4006908462867012
    },
    {
      "code": "1830001",
      "total": 577,
      "active": 115,
      "label": "Reprodução de som em qualquer suporte",
      "active_share": 0.19930675909878684
    },
    {
      "code": "7719502",
      "total": 576,
      "active": 311,
      "label": "Locação de aeronaves sem tripulação",
      "active_share": 0.5399305555555556
    },
    {
      "code": "2910701",
      "total": 569,
      "active": 195,
      "label": "Fabricação de automóveis, camionetas e utilitários",
      "active_share": 0.3427065026362039
    },
    {
      "code": "3314715",
      "total": 558,
      "active": 291,
      "label": "Manutenção e reparação de máquinas e equipamentos para uso na extração mineral, exceto na extração de petróleo",
      "active_share": 0.521505376344086
    },
    {
      "code": "4542102",
      "total": 558,
      "active": 294,
      "label": "Comércio sob consignação de motocicletas e motonetas",
      "active_share": 0.5268817204301075
    },
    {
      "code": "2342701",
      "total": 556,
      "active": 206,
      "label": "Fabricação de azulejos e pisos",
      "active_share": 0.37050359712230213
    },
    {
      "code": "1830002",
      "total": 553,
      "active": 94,
      "label": "Reprodução de vídeo em qualquer suporte",
      "active_share": 0.16998191681735986
    },
    {
      "code": "3314722",
      "total": 549,
      "active": 326,
      "label": "Manutenção e reparação de máquinas e aparelhos para a indústria do plástico",
      "active_share": 0.5938069216757741
    },
    {
      "code": "4221901",
      "total": 548,
      "active": 260,
      "label": "Construção de barragens e represas para geração de energia elétrica",
      "active_share": 0.4744525547445255
    },
    {
      "code": "2863100",
      "total": 548,
      "active": 211,
      "label": "Fabricação de máquinas e equipamentos para a indústria têxtil, peças e acessórios",
      "active_share": 0.38503649635036497
    },
    {
      "code": "8711504",
      "total": 543,
      "active": 391,
      "label": "Centros de apoio a pacientes com câncer e com AIDS",
      "active_share": 0.7200736648250461
    },
    {
      "code": "2442300",
      "total": 542,
      "active": 92,
      "label": "Metalurgia dos metais preciosos",
      "active_share": 0.16974169741697417
    },
    {
      "code": "1742702",
      "total": 540,
      "active": 20,
      "label": "Fabricação de absorventes higiênicos",
      "active_share": 0.037037037037037035
    },
    {
      "code": "3314714",
      "total": 540,
      "active": 292,
      "label": "Manutenção e reparação de máquinas e equipamentos para a prospecção e extração de petróleo",
      "active_share": 0.5407407407407407
    },
    {
      "code": "0114800",
      "total": 539,
      "active": 72,
      "label": "Cultivo de fumo",
      "active_share": 0.13358070500927643
    },
    {
      "code": "1099602",
      "total": 538,
      "active": 209,
      "label": "Fabricação de pós alimentícios",
      "active_share": 0.38847583643122674
    },
    {
      "code": "6499902",
      "total": 538,
      "active": 340,
      "label": "Sociedades de investimento",
      "active_share": 0.6319702602230484
    },
    {
      "code": "9329802",
      "total": 532,
      "active": 182,
      "label": "Exploração de boliches",
      "active_share": 0.34210526315789475
    },
    {
      "code": "2822401",
      "total": 526,
      "active": 347,
      "label": "Fabricação de máquinas, equipamentos e aparelhos para transporte e elevação de pessoas, peças e acessórios",
      "active_share": 0.6596958174904943
    },
    {
      "code": "2866600",
      "total": 523,
      "active": 310,
      "label": "Fabricação de máquinas e equipamentos para a indústria do plástico, peças e acessórios",
      "active_share": 0.5927342256214149
    },
    {
      "code": "5120000",
      "total": 517,
      "active": 287,
      "label": "Transporte aéreo de carga",
      "active_share": 0.5551257253384912
    },
    {
      "code": "0210105",
      "total": 516,
      "active": 294,
      "label": "Cultivo de espécies madeireiras, exceto eucalipto, acácia-negra, pinus e teca",
      "active_share": 0.5697674418604651
    },
    {
      "code": "0723501",
      "total": 514,
      "active": 222,
      "label": "Extração de minério de manganês",
      "active_share": 0.43190661478599224
    },
    {
      "code": "4222702",
      "total": 514,
      "active": 327,
      "label": "Obras de irrigação",
      "active_share": 0.6361867704280155
    },
    {
      "code": "0322102",
      "total": 509,
      "active": 268,
      "label": "Criação de camarões em água doce",
      "active_share": 0.5265225933202358
    },
    {
      "code": "3900500",
      "total": 504,
      "active": 250,
      "label": "Descontaminação e outros serviços de gestão de resíduos",
      "active_share": 0.49603174603174605
    },
    {
      "code": "8711505",
      "total": 501,
      "active": 260,
      "label": "Condomínios residenciais para idosos e deficientes físicos",
      "active_share": 0.5189620758483033
    },
    {
      "code": "3314716",
      "total": 500,
      "active": 272,
      "label": "Manutenção e reparação de tratores, exceto agrícolas",
      "active_share": 0.544
    },
    {
      "code": "2424501",
      "total": 497,
      "active": 98,
      "label": "Produção de arames de aço",
      "active_share": 0.19718309859154928
    },
    {
      "code": "1932200",
      "total": 496,
      "active": 206,
      "label": "Fabricação de biocombustíveis, exceto álcool",
      "active_share": 0.4153225806451613
    },
    {
      "code": "5012201",
      "total": 495,
      "active": 165,
      "label": "Transporte marítimo de longo curso - Carga",
      "active_share": 0.3333333333333333
    },
    {
      "code": "6190602",
      "total": 490,
      "active": 211,
      "label": "Provedores de voz sobre protocolo internet - VOIP",
      "active_share": 0.4306122448979592
    },
    {
      "code": "2854200",
      "total": 487,
      "active": 238,
      "label": "Fabricação de máquinas e equipamentos para terraplenagem, pavimentação e construção, peças e acessórios, exceto tratores",
      "active_share": 0.4887063655030801
    },
    {
      "code": "2211100",
      "total": 486,
      "active": 142,
      "label": "Fabricação de pneumáticos e de câmaras-de-ar",
      "active_share": 0.29218106995884774
    },
    {
      "code": "9603305",
      "total": 484,
      "active": 325,
      "label": "Serviços de somatoconservação",
      "active_share": 0.6714876033057852
    },
    {
      "code": "2040100",
      "total": 483,
      "active": 149,
      "label": "Fabricação de fibras artificiais e sintéticas",
      "active_share": 0.3084886128364389
    },
    {
      "code": "0500301",
      "total": 477,
      "active": 82,
      "label": "Extração de carvão mineral",
      "active_share": 0.1719077568134172
    },
    {
      "code": "2550101",
      "total": 477,
      "active": 31,
      "label": "Fabricação de equipamento bélico pesado, exceto veículos militares de combate",
      "active_share": 0.0649895178197065
    },
    {
      "code": "2710403",
      "total": 476,
      "active": 213,
      "label": "Fabricação de motores elétricos, peças e acessórios",
      "active_share": 0.4474789915966387
    },
    {
      "code": "1710900",
      "total": 474,
      "active": 158,
      "label": "Fabricação de celulose e outras pastas para a fabricação de papel",
      "active_share": 0.3333333333333333
    },
    {
      "code": "5221400",
      "total": 473,
      "active": 317,
      "label": "Concessionárias de rodovias, pontes, túneis e serviços relacionados",
      "active_share": 0.6701902748414377
    },
    {
      "code": "0111303",
      "total": 473,
      "active": 313,
      "label": "Cultivo de trigo",
      "active_share": 0.6617336152219874
    },
    {
      "code": "3091101",
      "total": 472,
      "active": 149,
      "label": "Fabricação de motocicletas",
      "active_share": 0.3156779661016949
    },
    {
      "code": "2439300",
      "total": 470,
      "active": 156,
      "label": "Produção de outros tubos de ferro e aço",
      "active_share": 0.33191489361702126
    },
    {
      "code": "3041500",
      "total": 456,
      "active": 123,
      "label": "Fabricação de aeronaves",
      "active_share": 0.26973684210526316
    },
    {
      "code": "6424701",
      "total": 456,
      "active": 18,
      "label": "Bancos cooperativos",
      "active_share": 0.039473684210526314
    },
    {
      "code": "0133407",
      "total": 454,
      "active": 306,
      "label": "Cultivo de maçã",
      "active_share": 0.6740088105726872
    },
    {
      "code": "0159804",
      "total": 451,
      "active": 304,
      "label": "Criação de bicho-da-seda",
      "active_share": 0.6740576496674058
    },
    {
      "code": "2865800",
      "total": 443,
      "active": 193,
      "label": "Fabricação de máquinas e equipamentos para as indústrias de celulose, papel e papelão e artefatos, peças e acessórios",
      "active_share": 0.435665914221219
    },
    {
      "code": "2330304",
      "total": 436,
      "active": 129,
      "label": "Fabricação de casas pré-moldadas de concreto",
      "active_share": 0.2958715596330275
    },
    {
      "code": "8299705",
      "total": 427,
      "active": 268,
      "label": "Serviços de levantamento de fundos sob contrato",
      "active_share": 0.6276346604215457
    },
    {
      "code": "2943300",
      "total": 419,
      "active": 182,
      "label": "Fabricação de peças e acessórios para o sistema de freios de veículos automotores",
      "active_share": 0.4343675417661098
    },
    {
      "code": "6438799",
      "total": 419,
      "active": 298,
      "label": "Outras instituições de intermediação não-monetária não especificadas anteriormente",
      "active_share": 0.711217183770883
    },
    {
      "code": "3091102",
      "total": 418,
      "active": 300,
      "label": "Fabricação de peças e acessórios para motocicletas",
      "active_share": 0.7177033492822966
    },
    {
      "code": "2652300",
      "total": 415,
      "active": 54,
      "label": "Fabricação de cronômetros e relógios",
      "active_share": 0.13012048192771083
    },
    {
      "code": "2832100",
      "total": 411,
      "active": 314,
      "label": "Fabricação de equipamentos para irrigação agrícola, peças e acessórios",
      "active_share": 0.7639902676399026
    },
    {
      "code": "7739001",
      "total": 410,
      "active": 214,
      "label": "Aluguel de máquinas e equipamentos para extração de minérios e petróleo, sem operador",
      "active_share": 0.5219512195121951
    },
    {
      "code": "4713005",
      "total": 408,
      "active": 204,
      "label": "Lojas francas (Duty free) de aeroportos, portos e em fronteiras terrestres",
      "active_share": 0.5
    },
    {
      "code": "0990401",
      "total": 405,
      "active": 226,
      "label": "Atividades de apoio à extração de minério de ferro",
      "active_share": 0.5580246913580247
    },
    {
      "code": "3315500",
      "total": 405,
      "active": 163,
      "label": "Manutenção e reparação de veículos ferroviários",
      "active_share": 0.4024691358024691
    },
    {
      "code": "2449101",
      "total": 405,
      "active": 29,
      "label": "Produção de zinco em formas primárias",
      "active_share": 0.07160493827160494
    },
    {
      "code": "8630507",
      "total": 402,
      "active": 298,
      "label": "Atividades de reprodução humana assistida",
      "active_share": 0.7412935323383084
    },
    {
      "code": "5239701",
      "total": 395,
      "active": 348,
      "label": "Serviços de praticagem",
      "active_share": 0.8810126582278481
    },
    {
      "code": "1314600",
      "total": 395,
      "active": 100,
      "label": "Fabricação de linhas para costurar e bordar",
      "active_share": 0.25316455696202533
    },
    {
      "code": "7420005",
      "total": 393,
      "active": 137,
      "label": "Serviços de microfilmagem",
      "active_share": 0.3486005089058524
    },
    {
      "code": "4940000",
      "total": 391,
      "active": 190,
      "label": "Transporte dutoviário",
      "active_share": 0.4859335038363171
    },
    {
      "code": "4223500",
      "total": 383,
      "active": 156,
      "label": "Construção de redes de transportes por dutos, exceto para água e esgoto",
      "active_share": 0.4073107049608355
    },
    {
      "code": "2942500",
      "total": 377,
      "active": 197,
      "label": "Fabricação de peças e acessórios para os sistemas de marcha e transmissão de veículos automotores",
      "active_share": 0.5225464190981433
    },
    {
      "code": "2522500",
      "total": 376,
      "active": 119,
      "label": "Fabricação de caldeiras geradoras de vapor, exceto para aquecimento central e para veículos",
      "active_share": 0.31648936170212766
    },
    {
      "code": "6110802",
      "total": 370,
      "active": 117,
      "label": "Serviços de redes de transportes de telecomunicações - SRTT",
      "active_share": 0.3162162162162162
    },
    {
      "code": "2092401",
      "total": 363,
      "active": 53,
      "label": "Fabricação de pólvoras, explosivos e detonantes",
      "active_share": 0.14600550964187328
    },
    {
      "code": "1072401",
      "total": 360,
      "active": 68,
      "label": "Fabricação de açúcar de cana refinado",
      "active_share": 0.18888888888888888
    },
    {
      "code": "0119907",
      "total": 354,
      "active": 196,
      "label": "Cultivo de melão",
      "active_share": 0.5536723163841808
    },
    {
      "code": "6499905",
      "total": 352,
      "active": 217,
      "label": "Concessão de crédito pelas OSCIP",
      "active_share": 0.6164772727272727
    },
    {
      "code": "0133411",
      "total": 352,
      "active": 292,
      "label": "Cultivo de pêssego",
      "active_share": 0.8295454545454546
    },
    {
      "code": "1012102",
      "total": 343,
      "active": 80,
      "label": "Abate de pequenos animais",
      "active_share": 0.23323615160349853
    },
    {
      "code": "1610205",
      "total": 343,
      "active": 274,
      "label": "Serviço de tratamento de madeira realizado sob contrato",
      "active_share": 0.7988338192419825
    },
    {
      "code": "3316302",
      "total": 336,
      "active": 182,
      "label": "Manutenção de aeronaves na pista",
      "active_share": 0.5416666666666666
    },
    {
      "code": "1922599",
      "total": 333,
      "active": 210,
      "label": "Fabricação de outros produtos derivados do petróleo, exceto produtos do refino",
      "active_share": 0.6306306306306306
    },
    {
      "code": "3299001",
      "total": 329,
      "active": 157,
      "label": "Fabricação de guarda-chuvas e similares",
      "active_share": 0.47720364741641336
    },
    {
      "code": "0312404",
      "total": 327,
      "active": 194,
      "label": "Atividades de apoio à pesca em água doce",
      "active_share": 0.5932721712538226
    },
    {
      "code": "9603302",
      "total": 326,
      "active": 237,
      "label": "Serviços de cremação",
      "active_share": 0.7269938650306749
    },
    {
      "code": "9609205",
      "total": 326,
      "active": 186,
      "label": "Atividades de sauna e banhos",
      "active_share": 0.5705521472392638
    },
    {
      "code": "3520401",
      "total": 325,
      "active": 201,
      "label": "Produção de gás; processamento de gás natural",
      "active_share": 0.6184615384615385
    },
    {
      "code": "2092402",
      "total": 323,
      "active": 81,
      "label": "Fabricação de artigos pirotécnicos",
      "active_share": 0.25077399380804954
    },
    {
      "code": "2032100",
      "total": 318,
      "active": 117,
      "label": "Fabricação de resinas termofixas",
      "active_share": 0.36792452830188677
    },
    {
      "code": "6431000",
      "total": 311,
      "active": 89,
      "label": "Bancos múltiplos, sem carteira comercial",
      "active_share": 0.2861736334405145
    },
    {
      "code": "3240003",
      "total": 309,
      "active": 135,
      "label": "Fabricação de mesas de bilhar, de sinuca e acessórios associada à locação",
      "active_share": 0.4368932038834951
    },
    {
      "code": "2821602",
      "total": 309,
      "active": 121,
      "label": "Fabricação de estufas e fornos elétricos para fins industriais, peças e acessórios",
      "active_share": 0.39158576051779936
    },
    {
      "code": "2831300",
      "total": 302,
      "active": 127,
      "label": "Fabricação de tratores agrícolas, peças e acessórios",
      "active_share": 0.4205298013245033
    },
    {
      "code": "2022300",
      "total": 301,
      "active": 54,
      "label": "Fabricação de intermediários para plastificantes, resinas e fibras",
      "active_share": 0.17940199335548174
    },
    {
      "code": "3520402",
      "total": 300,
      "active": 190,
      "label": "Distribuição de combustíveis gasosos por redes urbanas",
      "active_share": 0.6333333333333333
    },
    {
      "code": "2829101",
      "total": 298,
      "active": 39,
      "label": "Fabricação de máquinas de escrever, calcular e outros equipamentos não-eletrônicos para escritório, peças e acessórios",
      "active_share": 0.13087248322147652
    },
    {
      "code": "8421300",
      "total": 296,
      "active": 218,
      "label": "Relações exteriores",
      "active_share": 0.7364864864864865
    },
    {
      "code": "0152103",
      "total": 296,
      "active": 156,
      "label": "Criação de asininos e muares",
      "active_share": 0.527027027027027
    },
    {
      "code": "2021500",
      "total": 294,
      "active": 72,
      "label": "Fabricação de produtos petroquímicos básicos",
      "active_share": 0.24489795918367346
    },
    {
      "code": "2740601",
      "total": 293,
      "active": 69,
      "label": "Fabricação de lâmpadas",
      "active_share": 0.2354948805460751
    },
    {
      "code": "2670101",
      "total": 291,
      "active": 78,
      "label": "Fabricação de equipamentos e instrumentos ópticos, peças e acessórios",
      "active_share": 0.26804123711340205
    },
    {
      "code": "2721000",
      "total": 289,
      "active": 51,
      "label": "Fabricação de pilhas, baterias e acumuladores elétricos, exceto para veículos automotores",
      "active_share": 0.17647058823529413
    },
    {
      "code": "2423702",
      "total": 288,
      "active": 119,
      "label": "Produção de laminados longos de aço, exceto tubos",
      "active_share": 0.4131944444444444
    },
    {
      "code": "1082100",
      "total": 281,
      "active": 91,
      "label": "Fabricação de produtos à base de café",
      "active_share": 0.3238434163701068
    },
    {
      "code": "0810005",
      "total": 273,
      "active": 149,
      "label": "Extração de gesso e caulim",
      "active_share": 0.5457875457875457
    },
    {
      "code": "0892403",
      "total": 271,
      "active": 105,
      "label": "Refino e outros tratamentos do sal",
      "active_share": 0.3874538745387454
    },
    {
      "code": "6432800",
      "total": 269,
      "active": 46,
      "label": "Bancos de investimento",
      "active_share": 0.17100371747211895
    },
    {
      "code": "9200302",
      "total": 265,
      "active": 58,
      "label": "Exploração de apostas em corridas de cavalos",
      "active_share": 0.2188679245283019
    },
    {
      "code": "2824102",
      "total": 264,
      "active": 118,
      "label": "Fabricação de aparelhos e equipamentos de ar condicionado para uso não-industrial",
      "active_share": 0.44696969696969696
    },
    {
      "code": "1741901",
      "total": 262,
      "active": 58,
      "label": "Fabricação de formulários contínuos",
      "active_share": 0.22137404580152673
    },
    {
      "code": "2072000",
      "total": 257,
      "active": 106,
      "label": "Fabricação de tintas de impressão",
      "active_share": 0.41245136186770426
    },
    {
      "code": "4922103",
      "total": 257,
      "active": 62,
      "label": "Transporte rodoviário coletivo de passageiros, com itinerário fixo, internacional",
      "active_share": 0.24124513618677043
    },
    {
      "code": "5231101",
      "total": 256,
      "active": 178,
      "label": "Administração da infra-estrutura portuária",
      "active_share": 0.6953125
    },
    {
      "code": "1113501",
      "total": 251,
      "active": 20,
      "label": "Fabricação de malte, inclusive malte uísque",
      "active_share": 0.0796812749003984
    },
    {
      "code": "6022502",
      "total": 250,
      "active": 88,
      "label": "Atividades relacionadas à televisão por assinatura, exceto programadoras",
      "active_share": 0.352
    },
    {
      "code": "0119902",
      "total": 249,
      "active": 191,
      "label": "Cultivo de alho",
      "active_share": 0.7670682730923695
    },
    {
      "code": "0710302",
      "total": 247,
      "active": 140,
      "label": "Pelotização, sinterização e outros beneficiamentos de minério de ferro",
      "active_share": 0.5668016194331984
    },
    {
      "code": "2851800",
      "total": 241,
      "active": 101,
      "label": "Fabricação de máquinas e equipamentos para a prospecção e extração de petróleo, peças e acessórios",
      "active_share": 0.4190871369294606
    },
    {
      "code": "0322199",
      "total": 241,
      "active": 95,
      "label": "Cultivos e semicultivos da aqüicultura em água doce não especificados anteriormente",
      "active_share": 0.3941908713692946
    },
    {
      "code": "0139301",
      "total": 240,
      "active": 203,
      "label": "Cultivo de chá-da-índia",
      "active_share": 0.8458333333333333
    },
    {
      "code": "2121102",
      "total": 231,
      "active": 36,
      "label": "Fabricação de medicamentos homeopáticos para uso humano",
      "active_share": 0.15584415584415584
    },
    {
      "code": "4681804",
      "total": 228,
      "active": 89,
      "label": "Comércio atacadista de combustíveis de origem mineral em bruto",
      "active_share": 0.39035087719298245
    },
    {
      "code": "3240001",
      "total": 226,
      "active": 136,
      "label": "Fabricação de jogos eletrônicos",
      "active_share": 0.6017699115044248
    },
    {
      "code": "0133403",
      "total": 226,
      "active": 126,
      "label": "Cultivo de caju",
      "active_share": 0.5575221238938053
    },
    {
      "code": "2012600",
      "total": 224,
      "active": 112,
      "label": "Fabricação de intermediários para fertilizantes",
      "active_share": 0.5
    },
    {
      "code": "4511106",
      "total": 220,
      "active": 119,
      "label": "Comércio por atacado de ônibus e microônibus novos e usados",
      "active_share": 0.5409090909090909
    },
    {
      "code": "3250702",
      "total": 220,
      "active": 142,
      "label": "Fabricação de mobiliário para uso médico, cirúrgico, odontológico e de laboratório",
      "active_share": 0.6454545454545455
    },
    {
      "code": "6143400",
      "total": 219,
      "active": 53,
      "label": "Operadoras de televisão por assinatura por satélite",
      "active_share": 0.2420091324200913
    },
    {
      "code": "0321301",
      "total": 216,
      "active": 125,
      "label": "Criação de peixes em água salgada e salobra",
      "active_share": 0.5787037037037037
    },
    {
      "code": "0729405",
      "total": 214,
      "active": 73,
      "label": "Beneficiamento de minérios de cobre, chumbo, zinco e outros minerais metálicos não-ferrosos não especificados anteriormente",
      "active_share": 0.3411214953271028
    },
    {
      "code": "0724302",
      "total": 209,
      "active": 102,
      "label": "Beneficiamento de minério de metais preciosos",
      "active_share": 0.4880382775119617
    },
    {
      "code": "1220402",
      "total": 209,
      "active": 118,
      "label": "Fabricação de cigarrilhas e charutos",
      "active_share": 0.5645933014354066
    },
    {
      "code": "0722701",
      "total": 209,
      "active": 101,
      "label": "Extração de minério de estanho",
      "active_share": 0.48325358851674644
    },
    {
      "code": "0210104",
      "total": 203,
      "active": 134,
      "label": "Cultivo de teca",
      "active_share": 0.6600985221674877
    },
    {
      "code": "1722200",
      "total": 203,
      "active": 58,
      "label": "Fabricação de cartolina e papel-cartão",
      "active_share": 0.2857142857142857
    },
    {
      "code": "1011203",
      "total": 202,
      "active": 87,
      "label": "Frigorífico - abate de ovinos e caprinos",
      "active_share": 0.4306930693069307
    },
    {
      "code": "4912402",
      "total": 202,
      "active": 37,
      "label": "Transporte ferroviário de passageiros municipal e em região metropolitana",
      "active_share": 0.18316831683168316
    },
    {
      "code": "0139305",
      "total": 201,
      "active": 111,
      "label": "Cultivo de dendê",
      "active_share": 0.5522388059701493
    },
    {
      "code": "6437900",
      "total": 199,
      "active": 72,
      "label": "Sociedades de crédito ao microempreendedor",
      "active_share": 0.36180904522613067
    },
    {
      "code": "4912401",
      "total": 197,
      "active": 20,
      "label": "Transporte ferroviário de passageiros intermunicipal e interestadual",
      "active_share": 0.10152284263959391
    },
    {
      "code": "2814301",
      "total": 196,
      "active": 101,
      "label": "Fabricação de compressores para uso industrial, peças e acessórios",
      "active_share": 0.5153061224489796
    },
    {
      "code": "6424702",
      "total": 191,
      "active": 95,
      "label": "Cooperativas centrais de crédito",
      "active_share": 0.4973821989528796
    },
    {
      "code": "2099101",
      "total": 190,
      "active": 23,
      "label": "Fabricação de chapas, filmes, papéis e outros materiais e produtos químicos para fotografia",
      "active_share": 0.12105263157894737
    },
    {
      "code": "8650007",
      "total": 189,
      "active": 108,
      "label": "Atividades de terapia de nutrição enteral e parenteral",
      "active_share": 0.5714285714285714
    },
    {
      "code": "2532202",
      "total": 189,
      "active": 47,
      "label": "Metalurgia do pó",
      "active_share": 0.24867724867724866
    },
    {
      "code": "2312500",
      "total": 185,
      "active": 40,
      "label": "Fabricação de embalagens de vidro",
      "active_share": 0.21621621621621623
    },
    {
      "code": "6434400",
      "total": 183,
      "active": 61,
      "label": "Agências de fomento",
      "active_share": 0.3333333333333333
    },
    {
      "code": "0500302",
      "total": 179,
      "active": 58,
      "label": "Beneficiamento de carvão mineral",
      "active_share": 0.3240223463687151
    },
    {
      "code": "3211603",
      "total": 179,
      "active": 77,
      "label": "Cunhagem de moedas e medalhas",
      "active_share": 0.4301675977653631
    },
    {
      "code": "2033900",
      "total": 177,
      "active": 66,
      "label": "Fabricação de elastômeros",
      "active_share": 0.3728813559322034
    },
    {
      "code": "2121103",
      "total": 172,
      "active": 82,
      "label": "Fabricação de medicamentos fitoterápicos para uso humano",
      "active_share": 0.47674418604651164
    },
    {
      "code": "3250704",
      "total": 169,
      "active": 114,
      "label": "Fabricação de aparelhos e utensílios para correção de defeitos físicos e aparelhos ortopédicos em geral, exceto sob encomenda",
      "active_share": 0.6745562130177515
    },
    {
      "code": "2790201",
      "total": 167,
      "active": 74,
      "label": "Fabricação de eletrodos, contatos e outros artigos de carvão e grafita para uso elétrico, eletroímãs e isoladores",
      "active_share": 0.4431137724550898
    },
    {
      "code": "4950700",
      "total": 164,
      "active": 69,
      "label": "Trens turísticos, teleféricos e similares",
      "active_share": 0.42073170731707316
    },
    {
      "code": "3530100",
      "total": 162,
      "active": 91,
      "label": "Produção e distribuição de vapor, água quente e ar condicionado",
      "active_share": 0.5617283950617284
    },
    {
      "code": "0725100",
      "total": 160,
      "active": 11,
      "label": "Extração de minerais radioativos",
      "active_share": 0.06875
    },
    {
      "code": "1210700",
      "total": 159,
      "active": 85,
      "label": "Processamento industrial do fumo",
      "active_share": 0.5345911949685535
    },
    {
      "code": "2443100",
      "total": 159,
      "active": 59,
      "label": "Metalurgia do cobre",
      "active_share": 0.3710691823899371
    },
    {
      "code": "3032600",
      "total": 157,
      "active": 72,
      "label": "Fabricação de peças e acessórios para veículos ferroviários",
      "active_share": 0.4585987261146497
    },
    {
      "code": "5822102",
      "total": 155,
      "active": 101,
      "label": "Edição integrada à impressão de jornais não diários",
      "active_share": 0.6516129032258065
    },
    {
      "code": "2123800",
      "total": 155,
      "active": 83,
      "label": "Fabricação de preparações farmacêuticas",
      "active_share": 0.535483870967742
    },
    {
      "code": "5011402",
      "total": 153,
      "active": 75,
      "label": "Transporte marítimo de cabotagem - passageiros",
      "active_share": 0.49019607843137253
    },
    {
      "code": "2920401",
      "total": 152,
      "active": 83,
      "label": "Fabricação de caminhões e ônibus",
      "active_share": 0.5460526315789473
    },
    {
      "code": "1043100",
      "total": 151,
      "active": 49,
      "label": "Fabricação de margarina e outras gorduras vegetais e de óleos não-comestíveis de animais",
      "active_share": 0.32450331125827814
    },
    {
      "code": "1122402",
      "total": 149,
      "active": 71,
      "label": "Fabricação de chá mate e outros chás prontos para consumo",
      "active_share": 0.47651006711409394
    },
    {
      "code": "3031800",
      "total": 147,
      "active": 40,
      "label": "Fabricação de locomotivas, vagões e outros materiais rodantes",
      "active_share": 0.272108843537415
    },
    {
      "code": "6530800",
      "total": 147,
      "active": 58,
      "label": "Resseguros",
      "active_share": 0.3945578231292517
    },
    {
      "code": "2399102",
      "total": 145,
      "active": 95,
      "label": "Fabricação de abrasivos",
      "active_share": 0.6551724137931034
    },
    {
      "code": "0321305",
      "total": 143,
      "active": 66,
      "label": "Atividades de apoio à aqüicultura em água salgada e salobra",
      "active_share": 0.46153846153846156
    },
    {
      "code": "1099603",
      "total": 140,
      "active": 48,
      "label": "Fabricação de fermentos e leveduras",
      "active_share": 0.34285714285714286
    },
    {
      "code": "2421100",
      "total": 139,
      "active": 50,
      "label": "Produção de semi-acabados de aço",
      "active_share": 0.3597122302158273
    },
    {
      "code": "6435202",
      "total": 138,
      "active": 71,
      "label": "Associações de poupança e empréstimo",
      "active_share": 0.5144927536231884
    },
    {
      "code": "0810010",
      "total": 138,
      "active": 72,
      "label": "Beneficiamento de gesso e caulim associado à extração",
      "active_share": 0.5217391304347826
    },
    {
      "code": "3292201",
      "total": 137,
      "active": 73,
      "label": "Fabricação de roupas de proteção e segurança e resistentes a fogo",
      "active_share": 0.5328467153284672
    },
    {
      "code": "6619305",
      "total": 129,
      "active": 80,
      "label": "Operadoras de cartões de débito",
      "active_share": 0.6201550387596899
    },
    {
      "code": "2670102",
      "total": 127,
      "active": 45,
      "label": "Fabricação de aparelhos fotográficos e cinematográficos, peças e acessórios",
      "active_share": 0.3543307086614173
    },
    {
      "code": "2011800",
      "total": 126,
      "active": 49,
      "label": "Fabricação de cloro e álcalis",
      "active_share": 0.3888888888888889
    },
    {
      "code": "2930102",
      "total": 126,
      "active": 55,
      "label": "Fabricação de carrocerias para ônibus",
      "active_share": 0.4365079365079365
    },
    {
      "code": "2759701",
      "total": 126,
      "active": 71,
      "label": "Fabricação de aparelhos elétricos de uso pessoal, peças e acessórios",
      "active_share": 0.5634920634920635
    },
    {
      "code": "4684202",
      "total": 124,
      "active": 36,
      "label": "Comércio atacadista de solventes",
      "active_share": 0.2903225806451613
    },
    {
      "code": "2423701",
      "total": 121,
      "active": 38,
      "label": "Produção de tubos de aço sem costura",
      "active_share": 0.3140495867768595
    },
    {
      "code": "6611804",
      "total": 121,
      "active": 65,
      "label": "Administração de mercados de balcão organizados",
      "active_share": 0.5371900826446281
    },
    {
      "code": "8640214",
      "total": 117,
      "active": 70,
      "label": "Serviços de bancos de células e tecidos humanos",
      "active_share": 0.5982905982905983
    },
    {
      "code": "1922502",
      "total": 115,
      "active": 44,
      "label": "Rerrefino de óleos lubrificantes",
      "active_share": 0.3826086956521739
    },
    {
      "code": "2550102",
      "total": 113,
      "active": 41,
      "label": "Fabricação de armas de fogo, outras armas e munições",
      "active_share": 0.36283185840707965
    },
    {
      "code": "2680900",
      "total": 112,
      "active": 15,
      "label": "Fabricação de mídias virgens, magnéticas e ópticas",
      "active_share": 0.13392857142857142
    },
    {
      "code": "0139302",
      "total": 112,
      "active": 58,
      "label": "Cultivo de erva-mate",
      "active_share": 0.5178571428571429
    },
    {
      "code": "2824101",
      "total": 111,
      "active": 69,
      "label": "Fabricação de aparelhos e equipamentos de ar condicionado para uso industrial",
      "active_share": 0.6216216216216216
    },
    {
      "code": "2722802",
      "total": 110,
      "active": 29,
      "label": "Recondicionamento de baterias e acumuladores para veículos automotores",
      "active_share": 0.2636363636363636
    },
    {
      "code": "0220905",
      "total": 110,
      "active": 66,
      "label": "Coleta de palmito em florestas nativas",
      "active_share": 0.6
    },
    {
      "code": "0220903",
      "total": 109,
      "active": 49,
      "label": "Coleta de castanha-do-pará em florestas nativas",
      "active_share": 0.44954128440366975
    },
    {
      "code": "6619304",
      "total": 105,
      "active": 8,
      "label": "Caixas eletrônicos",
      "active_share": 0.0761904761904762
    },
    {
      "code": "0210102",
      "total": 101,
      "active": 30,
      "label": "Cultivo de acácia-negra",
      "active_share": 0.297029702970297
    },
    {
      "code": "6611801",
      "total": 97,
      "active": 14,
      "label": "Bolsa de valores",
      "active_share": 0.14432989690721648
    },
    {
      "code": "6619301",
      "total": 97,
      "active": 30,
      "label": "Serviços de liquidação e custódia",
      "active_share": 0.30927835051546393
    },
    {
      "code": "3240002",
      "total": 91,
      "active": 52,
      "label": "Fabricação de mesas de bilhar, de sinuca e acessórios não associada à locação",
      "active_share": 0.5714285714285714
    },
    {
      "code": "0321399",
      "total": 91,
      "active": 51,
      "label": "Cultivos e semicultivos da aqüicultura em água salgada e salobra não especificados anteriormente",
      "active_share": 0.5604395604395604
    },
    {
      "code": "4912403",
      "total": 90,
      "active": 58,
      "label": "Transporte metroviário",
      "active_share": 0.6444444444444445
    },
    {
      "code": "1910100",
      "total": 87,
      "active": 15,
      "label": "Coquerias",
      "active_share": 0.1724137931034483
    },
    {
      "code": "0116403",
      "total": 85,
      "active": 38,
      "label": "Cultivo de mamona",
      "active_share": 0.4470588235294118
    },
    {
      "code": "2449103",
      "total": 84,
      "active": 20,
      "label": "Fabricação de ânodos para galvanoplastia",
      "active_share": 0.23809523809523808
    },
    {
      "code": "0321303",
      "total": 84,
      "active": 45,
      "label": "Criação de ostras e mexilhões em água salgada e salobra",
      "active_share": 0.5357142857142857
    },
    {
      "code": "2422902",
      "total": 84,
      "active": 36,
      "label": "Produção de laminados planos de aços especiais",
      "active_share": 0.42857142857142855
    },
    {
      "code": "2853400",
      "total": 81,
      "active": 27,
      "label": "Fabricação de tratores, peças e acessórios, exceto agrícolas",
      "active_share": 0.3333333333333333
    },
    {
      "code": "2349401",
      "total": 81,
      "active": 35,
      "label": "Fabricação de material sanitário de cerâmica",
      "active_share": 0.43209876543209874
    },
    {
      "code": "8640213",
      "total": 80,
      "active": 40,
      "label": "Serviços de litotripcia",
      "active_share": 0.5
    },
    {
      "code": "0139303",
      "total": 78,
      "active": 47,
      "label": "Cultivo de pimenta-do-reino",
      "active_share": 0.6025641025641025
    },
    {
      "code": "5231103",
      "total": 76,
      "active": 53,
      "label": "Gestão de terminais aquaviários",
      "active_share": 0.6973684210526315
    },
    {
      "code": "3042300",
      "total": 74,
      "active": 44,
      "label": "Fabricação de turbinas, motores e outros componentes e peças para aeronaves",
      "active_share": 0.5945945945945946
    },
    {
      "code": "2815101",
      "total": 70,
      "active": 47,
      "label": "Fabricação de rolamentos para fins industriais",
      "active_share": 0.6714285714285714
    },
    {
      "code": "0723502",
      "total": 69,
      "active": 21,
      "label": "Beneficiamento de minério de manganês",
      "active_share": 0.30434782608695654
    },
    {
      "code": "0312403",
      "total": 69,
      "active": 9,
      "label": "Coleta de outros produtos aquáticos de água doce",
      "active_share": 0.13043478260869565
    },
    {
      "code": "0729403",
      "total": 64,
      "active": 30,
      "label": "Extração de minério de níquel",
      "active_share": 0.46875
    },
    {
      "code": "0899101",
      "total": 62,
      "active": 36,
      "label": "Extração de grafita",
      "active_share": 0.5806451612903226
    },
    {
      "code": "6142600",
      "total": 62,
      "active": 9,
      "label": "Operadoras de televisão por assinatura por microondas",
      "active_share": 0.14516129032258066
    },
    {
      "code": "4623107",
      "total": 60,
      "active": 17,
      "label": "Comércio atacadista de sisal",
      "active_share": 0.2833333333333333
    },
    {
      "code": "6611803",
      "total": 58,
      "active": 22,
      "label": "Bolsa de mercadorias e futuros",
      "active_share": 0.3793103448275862
    },
    {
      "code": "5012202",
      "total": 56,
      "active": 20,
      "label": "Transporte marítimo de longo curso - Passageiros",
      "active_share": 0.35714285714285715
    },
    {
      "code": "6499903",
      "total": 55,
      "active": 39,
      "label": "Fundo garantidor de crédito",
      "active_share": 0.7090909090909091
    },
    {
      "code": "0722702",
      "total": 52,
      "active": 23,
      "label": "Beneficiamento de minério de estanho",
      "active_share": 0.4423076923076923
    },
    {
      "code": "1922501",
      "total": 52,
      "active": 24,
      "label": "Formulação de combustíveis",
      "active_share": 0.46153846153846156
    },
    {
      "code": "0170900",
      "total": 51,
      "active": 16,
      "label": "Caça e serviços relacionados",
      "active_share": 0.3137254901960784
    },
    {
      "code": "0600003",
      "total": 49,
      "active": 21,
      "label": "Extração e beneficiamento de areias betuminosas",
      "active_share": 0.42857142857142855
    },
    {
      "code": "2094100",
      "total": 49,
      "active": 19,
      "label": "Fabricação de catalisadores",
      "active_share": 0.3877551020408163
    },
    {
      "code": "0311603",
      "total": 46,
      "active": 11,
      "label": "Coleta de outros produtos marinhos",
      "active_share": 0.2391304347826087
    },
    {
      "code": "6611802",
      "total": 44,
      "active": 14,
      "label": "Bolsa de mercadorias",
      "active_share": 0.3181818181818182
    },
    {
      "code": "6433600",
      "total": 42,
      "active": 22,
      "label": "Bancos de desenvolvimento",
      "active_share": 0.5238095238095238
    },
    {
      "code": "1012104",
      "total": 42,
      "active": 20,
      "label": "Matadouro - abate de suínos sob contrato",
      "active_share": 0.47619047619047616
    },
    {
      "code": "2910703",
      "total": 41,
      "active": 15,
      "label": "Fabricação de motores para automóveis, camionetas e utilitários",
      "active_share": 0.36585365853658536
    },
    {
      "code": "5130700",
      "total": 40,
      "active": 15,
      "label": "Transporte espacial",
      "active_share": 0.375
    },
    {
      "code": "2910702",
      "total": 39,
      "active": 20,
      "label": "Fabricação de chassis com motor para automóveis, camionetas e utilitários",
      "active_share": 0.5128205128205128
    },
    {
      "code": "0116402",
      "total": 38,
      "active": 25,
      "label": "Cultivo de girassol",
      "active_share": 0.6578947368421053
    },
    {
      "code": "0721902",
      "total": 38,
      "active": 19,
      "label": "Beneficiamento de minério de alumínio",
      "active_share": 0.5
    },
    {
      "code": "5030103",
      "total": 38,
      "active": 27,
      "label": "Serviço de rebocadores e empurradores",
      "active_share": 0.7105263157894737
    },
    {
      "code": "1011202",
      "total": 37,
      "active": 8,
      "label": "Frigorífico - abate de eqüinos",
      "active_share": 0.21621621621621623
    },
    {
      "code": "2449102",
      "total": 35,
      "active": 17,
      "label": "Produção de laminados de zinco",
      "active_share": 0.4857142857142857
    },
    {
      "code": "1220403",
      "total": 33,
      "active": 9,
      "label": "Fabricação de filtros para cigarros",
      "active_share": 0.2727272727272727
    },
    {
      "code": "4751200",
      "total": 31,
      "active": 6,
      "label": "Comércio varejista especializado de equipamentos e suprimentos de informática",
      "active_share": 0.1935483870967742
    },
    {
      "code": "6499904",
      "total": 27,
      "active": 15,
      "label": "Caixas de financiamento de corporações",
      "active_share": 0.5555555555555556
    },
    {
      "code": "2814302",
      "total": 27,
      "active": 17,
      "label": "Fabricação de compressores para uso não industrial, peças e acessórios",
      "active_share": 0.6296296296296297
    },
    {
      "code": "3511500",
      "total": 27,
      "active": 9,
      "label": "Geração de energia elétrica",
      "active_share": 0.3333333333333333
    },
    {
      "code": "0133406",
      "total": 26,
      "active": 8,
      "label": "Cultivo de guaraná",
      "active_share": 0.3076923076923077
    },
    {
      "code": "1122404",
      "total": 23,
      "active": 7,
      "label": "Fabricação de bebidas isotônicas",
      "active_share": 0.30434782608695654
    },
    {
      "code": "0729402",
      "total": 23,
      "active": 16,
      "label": "Extração de minério de tungstênio",
      "active_share": 0.6956521739130435
    },
    {
      "code": "1099606",
      "total": 22,
      "active": 8,
      "label": "Fabricação de adoçantes naturais e artificiais",
      "active_share": 0.36363636363636365
    },
    {
      "code": "6438701",
      "total": 22,
      "active": 12,
      "label": "Bancos de câmbio",
      "active_share": 0.5454545454545454
    },
    {
      "code": "0159803",
      "total": 22,
      "active": 3,
      "label": "Criação de escargô",
      "active_share": 0.13636363636363635
    },
    {
      "code": "6435203",
      "total": 21,
      "active": 8,
      "label": "Companhias hipotecárias",
      "active_share": 0.38095238095238093
    },
    {
      "code": "8690902",
      "total": 19,
      "active": 6,
      "label": "Atividades de banco de leite humano",
      "active_share": 0.3157894736842105
    },
    {
      "code": "0322106",
      "total": 19,
      "active": 11,
      "label": "Criação de jacaré",
      "active_share": 0.5789473684210527
    },
    {
      "code": "0892402",
      "total": 18,
      "active": 4,
      "label": "Extração de sal-gema",
      "active_share": 0.2222222222222222
    },
    {
      "code": "1011204",
      "total": 17,
      "active": 2,
      "label": "Frigorífico - abate de bufalinos",
      "active_share": 0.11764705882352941
    },
    {
      "code": "2920402",
      "total": 14,
      "active": 8,
      "label": "Fabricação de motores para caminhões e ônibus",
      "active_share": 0.5714285714285714
    },
    {
      "code": "4633803",
      "total": 14,
      "active": 3,
      "label": "Comércio atacadista de coelhos e outros pequenos animais vivos para alimentação",
      "active_share": 0.21428571428571427
    },
    {
      "code": "2092403",
      "total": 13,
      "active": 8,
      "label": "Fabricação de fósforos de segurança",
      "active_share": 0.6153846153846154
    },
    {
      "code": "6410700",
      "total": 12,
      "active": 10,
      "label": "Banco Central",
      "active_share": 0.8333333333333334
    },
    {
      "code": "2539000",
      "total": 11,
      "active": 4,
      "label": "Serviços de usinagem, solda, tratamento e revestimento em metais",
      "active_share": 0.36363636363636365
    },
    {
      "code": "0112102",
      "total": 11,
      "active": 6,
      "label": "Cultivo de juta",
      "active_share": 0.5454545454545454
    },
    {
      "code": "0899103",
      "total": 8,
      "active": 1,
      "label": "Extração de amianto",
      "active_share": 0.125
    },
    {
      "code": "0312402",
      "total": 8,
      "active": 4,
      "label": "Pesca de crustáceos e moluscos em água doce",
      "active_share": 0.5
    },
    {
      "code": "3050400",
      "total": 7,
      "active": 6,
      "label": "Fabricação de veículos militares de combate",
      "active_share": 0.8571428571428571
    },
    {
      "code": "0600002",
      "total": 7,
      "active": 4,
      "label": "Extração e beneficiamento de xisto",
      "active_share": 0.5714285714285714
    },
    {
      "code": "1065102",
      "total": 6,
      "active": 4,
      "label": "Fabricação de óleo de milho em bruto",
      "active_share": 0.6666666666666666
    },
    {
      "code": "2019301",
      "total": 6,
      "active": 3,
      "label": "Elaboração de combustíveis nucleares",
      "active_share": 0.5
    },
    {
      "code": "1091100",
      "total": 5,
      "active": 1,
      "label": "Fabricação de produtos de panificação",
      "active_share": 0.2
    },
    {
      "code": "1072402",
      "total": 5,
      "active": 0,
      "label": "Fabricação de açúcar de cereais (dextrose) e de beterraba",
      "active_share": 0.0
    },
    {
      "code": "0210109",
      "total": 5,
      "active": 1,
      "label": "Produção de casca de acácia-negra - florestas plantadas",
      "active_share": 0.2
    },
    {
      "code": "4721101",
      "total": 4,
      "active": 0,
      "label": "Padaria e confeitaria com predominância de produção própria",
      "active_share": 0.0
    },
    {
      "code": "0322103",
      "total": 3,
      "active": 0,
      "label": "Criação de ostras e mexilhões em água doce",
      "active_share": 0.0
    },
    {
      "code": "1822900",
      "total": 2,
      "active": 0,
      "label": "Serviços de acabamentos gráficos",
      "active_share": 0.0
    },
    {
      "code": "3091100",
      "total": 2,
      "active": 2,
      "label": "Fabricação de motocicletas, peças e acessórios",
      "active_share": 1.0
    },
    {
      "code": "9609201",
      "total": 2,
      "active": 0,
      "label": "Clinicas de estética e similares",
      "active_share": 0.0
    },
    {
      "code": "5611202",
      "total": 1,
      "active": 0,
      "label": "Bares e outros estabelecimentos especializados em servir bebidas",
      "active_share": 0.0
    },
    {
      "code": "1065103",
      "total": 1,
      "active": 0,
      "label": "Fabricação de óleo de milho refinado",
      "active_share": 0.0
    }
  ],
  "cohorts": [
    {
      "year": 1891,
      "total": 1,
      "active": 1,
      "active_share": 1.0
    },
    {
      "year": 1893,
      "total": 1,
      "active": 1,
      "active_share": 1.0
    },
    {
      "year": 1899,
      "total": 2,
      "active": 2,
      "active_share": 1.0
    },
    {
      "year": 1901,
      "total": 161,
      "active": 147,
      "active_share": 0.9130434782608695
    },
    {
      "year": 1902,
      "total": 3,
      "active": 3,
      "active_share": 1.0
    },
    {
      "year": 1903,
      "total": 8,
      "active": 7,
      "active_share": 0.875
    },
    {
      "year": 1904,
      "total": 8,
      "active": 6,
      "active_share": 0.75
    },
    {
      "year": 1905,
      "total": 4,
      "active": 4,
      "active_share": 1.0
    },
    {
      "year": 1906,
      "total": 6,
      "active": 4,
      "active_share": 0.6666666666666666
    },
    {
      "year": 1907,
      "total": 4,
      "active": 4,
      "active_share": 1.0
    },
    {
      "year": 1908,
      "total": 6,
      "active": 5,
      "active_share": 0.8333333333333334
    },
    {
      "year": 1909,
      "total": 4,
      "active": 4,
      "active_share": 1.0
    },
    {
      "year": 1910,
      "total": 3,
      "active": 2,
      "active_share": 0.6666666666666666
    },
    {
      "year": 1911,
      "total": 4,
      "active": 4,
      "active_share": 1.0
    },
    {
      "year": 1912,
      "total": 4,
      "active": 4,
      "active_share": 1.0
    },
    {
      "year": 1913,
      "total": 3,
      "active": 3,
      "active_share": 1.0
    },
    {
      "year": 1914,
      "total": 4,
      "active": 3,
      "active_share": 0.75
    },
    {
      "year": 1915,
      "total": 7,
      "active": 7,
      "active_share": 1.0
    },
    {
      "year": 1916,
      "total": 2,
      "active": 1,
      "active_share": 0.5
    },
    {
      "year": 1917,
      "total": 5,
      "active": 4,
      "active_share": 0.8
    },
    {
      "year": 1918,
      "total": 7,
      "active": 5,
      "active_share": 0.7142857142857143
    },
    {
      "year": 1919,
      "total": 4,
      "active": 3,
      "active_share": 0.75
    },
    {
      "year": 1920,
      "total": 8,
      "active": 6,
      "active_share": 0.75
    },
    {
      "year": 1921,
      "total": 6,
      "active": 6,
      "active_share": 1.0
    },
    {
      "year": 1922,
      "total": 13,
      "active": 12,
      "active_share": 0.9230769230769231
    },
    {
      "year": 1923,
      "total": 3,
      "active": 2,
      "active_share": 0.6666666666666666
    },
    {
      "year": 1924,
      "total": 7,
      "active": 5,
      "active_share": 0.7142857142857143
    },
    {
      "year": 1925,
      "total": 11,
      "active": 8,
      "active_share": 0.7272727272727273
    },
    {
      "year": 1926,
      "total": 6,
      "active": 4,
      "active_share": 0.6666666666666666
    },
    {
      "year": 1927,
      "total": 10,
      "active": 7,
      "active_share": 0.7
    },
    {
      "year": 1928,
      "total": 3,
      "active": 2,
      "active_share": 0.6666666666666666
    },
    {
      "year": 1929,
      "total": 18,
      "active": 13,
      "active_share": 0.7222222222222222
    },
    {
      "year": 1930,
      "total": 9,
      "active": 7,
      "active_share": 0.7777777777777778
    },
    {
      "year": 1931,
      "total": 15,
      "active": 8,
      "active_share": 0.5333333333333333
    },
    {
      "year": 1932,
      "total": 15,
      "active": 8,
      "active_share": 0.5333333333333333
    },
    {
      "year": 1933,
      "total": 19,
      "active": 11,
      "active_share": 0.5789473684210527
    },
    {
      "year": 1934,
      "total": 40,
      "active": 33,
      "active_share": 0.825
    },
    {
      "year": 1935,
      "total": 11,
      "active": 9,
      "active_share": 0.8181818181818182
    },
    {
      "year": 1936,
      "total": 19,
      "active": 14,
      "active_share": 0.7368421052631579
    },
    {
      "year": 1937,
      "total": 19,
      "active": 10,
      "active_share": 0.5263157894736842
    },
    {
      "year": 1938,
      "total": 19,
      "active": 15,
      "active_share": 0.7894736842105263
    },
    {
      "year": 1939,
      "total": 30,
      "active": 22,
      "active_share": 0.7333333333333333
    },
    {
      "year": 1940,
      "total": 20,
      "active": 12,
      "active_share": 0.6
    },
    {
      "year": 1941,
      "total": 36,
      "active": 24,
      "active_share": 0.6666666666666666
    },
    {
      "year": 1942,
      "total": 25,
      "active": 17,
      "active_share": 0.68
    },
    {
      "year": 1943,
      "total": 54,
      "active": 32,
      "active_share": 0.5925925925925926
    },
    {
      "year": 1944,
      "total": 48,
      "active": 26,
      "active_share": 0.5416666666666666
    },
    {
      "year": 1945,
      "total": 68,
      "active": 51,
      "active_share": 0.75
    },
    {
      "year": 1946,
      "total": 70,
      "active": 42,
      "active_share": 0.6
    },
    {
      "year": 1947,
      "total": 65,
      "active": 39,
      "active_share": 0.6
    },
    {
      "year": 1948,
      "total": 79,
      "active": 50,
      "active_share": 0.6329113924050633
    },
    {
      "year": 1949,
      "total": 75,
      "active": 52,
      "active_share": 0.6933333333333334
    },
    {
      "year": 1950,
      "total": 78,
      "active": 49,
      "active_share": 0.6282051282051282
    },
    {
      "year": 1951,
      "total": 87,
      "active": 49,
      "active_share": 0.5632183908045977
    },
    {
      "year": 1952,
      "total": 105,
      "active": 71,
      "active_share": 0.6761904761904762
    },
    {
      "year": 1953,
      "total": 114,
      "active": 69,
      "active_share": 0.6052631578947368
    },
    {
      "year": 1954,
      "total": 168,
      "active": 105,
      "active_share": 0.625
    },
    {
      "year": 1955,
      "total": 161,
      "active": 99,
      "active_share": 0.6149068322981367
    },
    {
      "year": 1956,
      "total": 158,
      "active": 95,
      "active_share": 0.6012658227848101
    },
    {
      "year": 1957,
      "total": 179,
      "active": 116,
      "active_share": 0.6480446927374302
    },
    {
      "year": 1958,
      "total": 218,
      "active": 115,
      "active_share": 0.5275229357798165
    },
    {
      "year": 1959,
      "total": 229,
      "active": 139,
      "active_share": 0.6069868995633187
    },
    {
      "year": 1960,
      "total": 285,
      "active": 161,
      "active_share": 0.5649122807017544
    },
    {
      "year": 1961,
      "total": 280,
      "active": 171,
      "active_share": 0.6107142857142858
    },
    {
      "year": 1962,
      "total": 334,
      "active": 200,
      "active_share": 0.5988023952095808
    },
    {
      "year": 1963,
      "total": 417,
      "active": 253,
      "active_share": 0.6067146282973621
    },
    {
      "year": 1964,
      "total": 407,
      "active": 224,
      "active_share": 0.5503685503685504
    },
    {
      "year": 1965,
      "total": 5132,
      "active": 919,
      "active_share": 0.17907248636009354
    },
    {
      "year": 1966,
      "total": 160202,
      "active": 20660,
      "active_share": 0.12896218524113306
    },
    {
      "year": 1967,
      "total": 40902,
      "active": 4791,
      "active_share": 0.11713363649699281
    },
    {
      "year": 1968,
      "total": 43597,
      "active": 5442,
      "active_share": 0.12482510264467739
    },
    {
      "year": 1969,
      "total": 59653,
      "active": 6920,
      "active_share": 0.11600422443129432
    },
    {
      "year": 1970,
      "total": 64818,
      "active": 11603,
      "active_share": 0.1790089172760653
    },
    {
      "year": 1971,
      "total": 82922,
      "active": 11699,
      "active_share": 0.14108439256168448
    },
    {
      "year": 1972,
      "total": 85827,
      "active": 9590,
      "active_share": 0.11173639996737623
    },
    {
      "year": 1973,
      "total": 114455,
      "active": 12571,
      "active_share": 0.109833559040671
    },
    {
      "year": 1974,
      "total": 121071,
      "active": 17000,
      "active_share": 0.14041347638988694
    },
    {
      "year": 1975,
      "total": 137931,
      "active": 13162,
      "active_share": 0.09542452385613097
    },
    {
      "year": 1976,
      "total": 168125,
      "active": 14490,
      "active_share": 0.08618587360594795
    },
    {
      "year": 1977,
      "total": 284885,
      "active": 20293,
      "active_share": 0.07123225161029889
    },
    {
      "year": 1978,
      "total": 258361,
      "active": 19166,
      "active_share": 0.07418302297947446
    },
    {
      "year": 1979,
      "total": 276516,
      "active": 19368,
      "active_share": 0.07004296315583908
    },
    {
      "year": 1980,
      "total": 294828,
      "active": 20009,
      "active_share": 0.06786668837423854
    },
    {
      "year": 1981,
      "total": 294081,
      "active": 26157,
      "active_share": 0.08894488253236353
    },
    {
      "year": 1982,
      "total": 310726,
      "active": 24865,
      "active_share": 0.0800222704247472
    },
    {
      "year": 1983,
      "total": 346323,
      "active": 27191,
      "active_share": 0.07851341089098905
    },
    {
      "year": 1984,
      "total": 335611,
      "active": 30791,
      "active_share": 0.0917460989061741
    },
    {
      "year": 1985,
      "total": 411117,
      "active": 42993,
      "active_share": 0.10457606958603026
    },
    {
      "year": 1986,
      "total": 626437,
      "active": 49237,
      "active_share": 0.07859848636016072
    },
    {
      "year": 1987,
      "total": 541026,
      "active": 45354,
      "active_share": 0.08382961262490157
    },
    {
      "year": 1988,
      "total": 501932,
      "active": 48569,
      "active_share": 0.09676410350406031
    },
    {
      "year": 1989,
      "total": 568491,
      "active": 55845,
      "active_share": 0.09823374512525264
    },
    {
      "year": 1990,
      "total": 639545,
      "active": 64885,
      "active_share": 0.10145494062184834
    },
    {
      "year": 1991,
      "total": 639485,
      "active": 71353,
      "active_share": 0.11157884860473663
    },
    {
      "year": 1992,
      "total": 550563,
      "active": 70383,
      "active_share": 0.12783823104712813
    },
    {
      "year": 1993,
      "total": 608965,
      "active": 80680,
      "active_share": 0.13248708874894288
    },
    {
      "year": 1994,
      "total": 627775,
      "active": 84373,
      "active_share": 0.1344000637170961
    },
    {
      "year": 1995,
      "total": 623219,
      "active": 90856,
      "active_share": 0.14578502901869167
    },
    {
      "year": 1996,
      "total": 628340,
      "active": 104770,
      "active_share": 0.1667409364356877
    },
    {
      "year": 1997,
      "total": 677622,
      "active": 125612,
      "active_share": 0.185371785449705
    },
    {
      "year": 1998,
      "total": 590530,
      "active": 105641,
      "active_share": 0.1788918429207661
    },
    {
      "year": 1999,
      "total": 637674,
      "active": 126205,
      "active_share": 0.19791460840492164
    },
    {
      "year": 2000,
      "total": 619224,
      "active": 128408,
      "active_share": 0.2073692234151131
    },
    {
      "year": 2001,
      "total": 623625,
      "active": 131035,
      "active_share": 0.21011826017237922
    },
    {
      "year": 2002,
      "total": 608329,
      "active": 132733,
      "active_share": 0.21819278712670281
    },
    {
      "year": 2003,
      "total": 593154,
      "active": 143593,
      "active_share": 0.24208384331893573
    },
    {
      "year": 2004,
      "total": 1036778,
      "active": 145854,
      "active_share": 0.14068006844281034
    },
    {
      "year": 2005,
      "total": 613208,
      "active": 153302,
      "active_share": 0.25
    },
    {
      "year": 2006,
      "total": 808094,
      "active": 300569,
      "active_share": 0.37194806544783154
    },
    {
      "year": 2007,
      "total": 750918,
      "active": 255345,
      "active_share": 0.34004378640543975
    },
    {
      "year": 2008,
      "total": 1216417,
      "active": 242080,
      "active_share": 0.19901070110003397
    },
    {
      "year": 2009,
      "total": 873145,
      "active": 265812,
      "active_share": 0.3044305355925992
    },
    {
      "year": 2010,
      "total": 1544366,
      "active": 399002,
      "active_share": 0.25835974114944255
    },
    {
      "year": 2011,
      "total": 1726894,
      "active": 464666,
      "active_share": 0.26907615638249943
    },
    {
      "year": 2012,
      "total": 2332959,
      "active": 476108,
      "active_share": 0.20407902582085669
    },
    {
      "year": 2013,
      "total": 1979336,
      "active": 524831,
      "active_share": 0.2651550823104314
    },
    {
      "year": 2014,
      "total": 2023184,
      "active": 542466,
      "active_share": 0.26812489620321234
    },
    {
      "year": 2015,
      "total": 2128232,
      "active": 638446,
      "active_share": 0.29998891098338903
    },
    {
      "year": 2016,
      "total": 2654675,
      "active": 687602,
      "active_share": 0.2590155103732095
    },
    {
      "year": 2017,
      "total": 2372830,
      "active": 792469,
      "active_share": 0.33397630677292517
    },
    {
      "year": 2018,
      "total": 2763113,
      "active": 975893,
      "active_share": 0.3531860622421161
    },
    {
      "year": 2019,
      "total": 3272788,
      "active": 1255265,
      "active_share": 0.38354607753389464
    },
    {
      "year": 2020,
      "total": 4013694,
      "active": 1359698,
      "active_share": 0.33876473891632
    },
    {
      "year": 2021,
      "total": 4139620,
      "active": 1744574,
      "active_share": 0.4214333682801803
    },
    {
      "year": 2022,
      "total": 3977694,
      "active": 1904203,
      "active_share": 0.47872033394222885
    },
    {
      "year": 2023,
      "total": 3985063,
      "active": 2419239,
      "active_share": 0.6070767262650553
    },
    {
      "year": 2024,
      "total": 4844307,
      "active": 2649108,
      "active_share": 0.5468497351633578
    },
    {
      "year": 2025,
      "total": 5195568,
      "active": 3953407,
      "active_share": 0.7609191141372801
    },
    {
      "year": 2026,
      "total": 4749185,
      "active": 4208815,
      "active_share": 0.8862183722049152
    }
  ],
  "company_profile": {
    "size": [
      {
        "code": "01",
        "count": 53422438,
        "label": "Microenterprise"
      },
      {
        "code": "05",
        "count": 14927587,
        "label": "Other"
      },
      {
        "code": "03",
        "count": 2163300,
        "label": "Small enterprise"
      },
      {
        "code": "Unknown",
        "count": 4112,
        "label": "Unknown"
      }
    ],
    "capital": {
      "n": 70517437,
      "zero": 17595528,
      "negative": 0,
      "missing": 0,
      "suspected_sentinel_999999999999": 124,
      "median": 1500.0,
      "p90": 50000.0,
      "p99": 522837.04000002146,
      "max": 999999999999.0,
      "valid_n": 70517437
    },
    "legal_forms": [
      {
        "code": "2135",
        "count": 45727417,
        "label": "Empresário (Individual)"
      },
      {
        "code": "2062",
        "count": 16866279,
        "label": "Sociedade Empresária Limitada"
      },
      {
        "code": "4090",
        "count": 2958486,
        "label": "Candidato a Cargo Político Eletivo"
      },
      {
        "code": "3999",
        "count": 1436578,
        "label": "Associação Privada"
      },
      {
        "code": "2240",
        "count": 810093,
        "label": "Sociedade Simples Limitada"
      },
      {
        "code": "4120",
        "count": 641792,
        "label": "Produtor Rural (Pessoa Física)"
      },
      {
        "code": "3085",
        "count": 338346,
        "label": "Condomínio Edilício"
      },
      {
        "code": "4014",
        "count": 215750,
        "label": "Empresa Individual Imobiliária"
      },
      {
        "code": "2305",
        "count": 213289,
        "label": "Empresa Individual de Responsabilidade Limitada (de Natureza Empresária)"
      },
      {
        "code": "2321",
        "count": 174910,
        "label": "Sociedade Unipessoal de Advocacia"
      },
      {
        "code": "3271",
        "count": 144147,
        "label": "Órgão de Direção Local de Partido Político"
      },
      {
        "code": "3220",
        "count": 138733,
        "label": "Organização Religiosa"
      },
      {
        "code": "2216",
        "count": 114849,
        "label": "Empresa Domiciliada no Exterior"
      },
      {
        "code": "2054",
        "count": 103357,
        "label": "Sociedade Anônima Fechada"
      },
      {
        "code": "2232",
        "count": 101480,
        "label": "Sociedade Simples Pura"
      },
      {
        "code": "2224",
        "count": 101370,
        "label": "Clube/Fundo de Investimento"
      },
      {
        "code": "2127",
        "count": 72760,
        "label": "Sociedade em Conta de Participação"
      },
      {
        "code": "3212",
        "count": 57656,
        "label": "Fundação ou Associação Domiciliada no Exterior"
      },
      {
        "code": "2143",
        "count": 46940,
        "label": "Cooperativa"
      },
      {
        "code": "3131",
        "count": 44371,
        "label": "Entidade Sindical"
      },
      {
        "code": "1333",
        "count": 36027,
        "label": "Fundo Público da Administração Direta Municipal"
      },
      {
        "code": "2348",
        "count": 28031,
        "label": "Empresa Simples de Inovação"
      },
      {
        "code": "2151",
        "count": 27498,
        "label": "Consórcio de Sociedades"
      },
      {
        "code": "3034",
        "count": 24229,
        "label": "Serviço Notarial e Registral (Cartório)"
      },
      {
        "code": "2070",
        "count": 17853,
        "label": "Sociedade Empresária em Nome Coletivo"
      },
      {
        "code": "3069",
        "count": 14268,
        "label": "Fundação Privada"
      },
      {
        "code": "1031",
        "count": 12025,
        "label": "Órgão Público do Poder Executivo Municipal"
      },
      {
        "code": "1066",
        "count": 5677,
        "label": "Órgão Público do Poder Legislativo Municipal"
      },
      {
        "code": "1244",
        "count": 5637,
        "label": "Município"
      },
      {
        "code": "2313",
        "count": 3390,
        "label": "Empresa Individual de Responsabilidade Limitada (de Natureza Simples)"
      },
      {
        "code": "1120",
        "count": 3336,
        "label": "Autarquia Municipal"
      },
      {
        "code": "2046",
        "count": 3189,
        "label": "Sociedade Anônima Aberta"
      },
      {
        "code": "1023",
        "count": 2635,
        "label": "Órgão Público do Poder Executivo Estadual ou do Distrito Federal"
      },
      {
        "code": "3301",
        "count": 2268,
        "label": "Organização Social (OS)"
      },
      {
        "code": "1155",
        "count": 2009,
        "label": "Fundação Pública de Direito Público Municipal"
      },
      {
        "code": "1210",
        "count": 1687,
        "label": "Consórcio Público de Direito Público (Associação Pública)"
      },
      {
        "code": "2011",
        "count": 1480,
        "label": "Empresa Pública"
      },
      {
        "code": "8885",
        "count": 1406,
        "label": "Natureza Jurídica não informada"
      },
      {
        "code": "2100",
        "count": 1394,
        "label": "Sociedade Mercantil de Capital e Indústria"
      },
      {
        "code": "3328",
        "count": 1248,
        "label": "Plano de Benefícios de Previdência Complementar Fechada"
      },
      {
        "code": "3263",
        "count": 1185,
        "label": "Órgão de Direção Regional de Partido Político"
      },
      {
        "code": "1325",
        "count": 1140,
        "label": "Fundo Público da Administração Direta Estadual ou do Distrito Federal"
      },
      {
        "code": "1015",
        "count": 908,
        "label": "Órgão Público do Poder Executivo Federal"
      },
      {
        "code": "1104",
        "count": 888,
        "label": "Autarquia Federal"
      },
      {
        "code": "2038",
        "count": 780,
        "label": "Sociedade de Economia Mista"
      },
      {
        "code": "2160",
        "count": 720,
        "label": "Grupo de Sociedades"
      },
      {
        "code": "2178",
        "count": 676,
        "label": "Estabelecimento, no Brasil, de Sociedade Estrangeira"
      },
      {
        "code": "3077",
        "count": 670,
        "label": "Serviço Social Autônomo"
      },
      {
        "code": "1112",
        "count": 637,
        "label": "Autarquia Estadual ou do Distrito Federal"
      },
      {
        "code": "3115",
        "count": 628,
        "label": "Entidade de Mediação e Arbitragem"
      },
      {
        "code": "5029",
        "count": 477,
        "label": "Representação Diplomática Estrangeira"
      },
      {
        "code": "3280",
        "count": 451,
        "label": "Comitê Financeiro de Partido Político"
      },
      {
        "code": "2089",
        "count": 398,
        "label": "Sociedade Empresária em Comandita Simples"
      },
      {
        "code": "2283",
        "count": 391,
        "label": "Consórcio de Empregadores"
      },
      {
        "code": "1082",
        "count": 354,
        "label": "Órgão Público do Poder Judiciário Estadual"
      },
      {
        "code": "2097",
        "count": 351,
        "label": "Sociedade Empresária em Comandita por Ações"
      },
      {
        "code": "1180",
        "count": 346,
        "label": "Órgão Público Autônomo Municipal"
      },
      {
        "code": "1147",
        "count": 325,
        "label": "Fundação Pública de Direito Público Estadual ou do Distrito Federal"
      },
      {
        "code": "2259",
        "count": 299,
        "label": "Sociedade Simples em Nome Coletivo"
      },
      {
        "code": "2330",
        "count": 266,
        "label": "Cooperativas de Consumo"
      },
      {
        "code": "3255",
        "count": 190,
        "label": "Órgão de Direção Nacional de Partido Político"
      },
      {
        "code": "1279",
        "count": 172,
        "label": "Fundação Pública de Direito Privado Municipal"
      },
      {
        "code": "1074",
        "count": 162,
        "label": "Órgão Público do Poder Judiciário Federal"
      },
      {
        "code": "3204",
        "count": 144,
        "label": "Estabelecimento, no Brasil, de Fundação ou Associação Estrangeiras"
      },
      {
        "code": "5010",
        "count": 134,
        "label": "Organização Internacional"
      },
      {
        "code": "1309",
        "count": 114,
        "label": "Fundo Público da Administração Indireta Municipal"
      },
      {
        "code": "1139",
        "count": 95,
        "label": "Fundação Pública de Direito Público Federal"
      },
      {
        "code": "3239",
        "count": 91,
        "label": "Comunidade Indígena"
      },
      {
        "code": "1058",
        "count": 73,
        "label": "Órgão Público do Poder Legislativo Estadual ou do Distrito Federal"
      },
      {
        "code": "1317",
        "count": 71,
        "label": "Fundo Público da Administração Direta Federal"
      },
      {
        "code": "1171",
        "count": 65,
        "label": "Órgão Público Autônomo Estadual ou do Distrito Federal"
      },
      {
        "code": "3247",
        "count": 64,
        "label": "Fundo Privado"
      },
      {
        "code": "1228",
        "count": 41,
        "label": "Consórcio Público de Direito Privado"
      },
      {
        "code": "2267",
        "count": 41,
        "label": "Sociedade Simples em Comandita Simples"
      },
      {
        "code": "3107",
        "count": 38,
        "label": "Comissão de Conciliação Prévia"
      },
      {
        "code": "1260",
        "count": 30,
        "label": "Fundação Pública de Direito Privado Estadual ou do Distrito Federal"
      },
      {
        "code": "1236",
        "count": 29,
        "label": "Estado ou Distrito Federal"
      },
      {
        "code": "1295",
        "count": 27,
        "label": "Fundo Público da Administração Indireta Estadual ou do Distrito Federal"
      },
      {
        "code": "2291",
        "count": 25,
        "label": "Consórcio Simples"
      },
      {
        "code": "5037",
        "count": 9,
        "label": "Outras Instituições Extraterritoriais"
      },
      {
        "code": "1040",
        "count": 8,
        "label": "Órgão Público do Poder Legislativo Federal"
      },
      {
        "code": "3298",
        "count": 7,
        "label": "Frente Plebiscitária ou Referendária"
      },
      {
        "code": "0000",
        "count": 6,
        "label": "Natureza Jurídica não informada"
      },
      {
        "code": "1198",
        "count": 4,
        "label": "Comissão Polinacional"
      },
      {
        "code": "3310",
        "count": 4,
        "label": "DEMAIS CONDOMÍNIOS"
      },
      {
        "code": "1252",
        "count": 4,
        "label": "Fundação Pública de Direito Privado Federal"
      },
      {
        "code": "1163",
        "count": 3,
        "label": "Órgão Público Autônomo Federal"
      },
      {
        "code": "2275",
        "count": 3,
        "label": "Empresa Binacional"
      },
      {
        "code": "1287",
        "count": 1,
        "label": "Fundo Público da Administração Indireta Federal"
      },
      {
        "code": "1350",
        "count": 1,
        "label": "ENTIDADE PÚBLICA SOB REGIME ESPECIAL"
      },
      {
        "code": "1341",
        "count": 1,
        "label": "União"
      }
    ]
  },
  "quality": {
    "missing_or_invalid_opening_date": 0,
    "missing_or_invalid_status_date": 115377,
    "status_date_before_opening": 1065,
    "opening_date_after_retrieval": 0,
    "status_date_after_retrieval": 0,
    "malformed_cnpj_base": 0,
    "min_opening_date": "1891-10-23",
    "max_opening_date": "2026-10-11",
    "min_status_date": "1899-10-16",
    "max_status_date": "2026-10-11",
    "unmatched_cnae_records": 0,
    "missing_establishment_keys": 0,
    "duplicate_establishment_keys": 0,
    "duplicate_company_keys": 1,
    "duplicate_company_source_records": 1,
    "ambiguous_company_profile_keys": 0,
    "missing_company_keys": 0,
    "remaining_duplicate_company_keys": 0,
    "duplicate_company_resolution_note": "Company roots are counted once. Duplicate fields are coalesced only when reported values agree; nature 0000 and size 00 denote not reported. Genuine conflicts become missing and are flagged. Raw source profiles remain unchanged.",
    "establishment_records_without_entity_match": 0,
    "entity_linkage_note": "Unmatched establishment records are retained in snapshot counts; company-profile summaries use their own company denominator.",
    "national_snapshot_note": "Current registration status, not continuous operation, survival, economic activity, revenue or profitability."
  },
  "survival_feasibility": {
    "identified": false,
    "observed_months": 41,
    "required_months": 60,
    "reason": "Available releases span fewer than five years; opening dates in a current snapshot do not recover complete status histories."
  },
  "ibge": {
    "schema_version": "1.1.0",
    "available": true,
    "title": "IBGE employer business survival: 2017 cohort observed through 2022",
    "acquired_at_utc": "2026-10-19T15:59:41.977554+00:00",
    "reference_year": 2022,
    "cohort_year": 2017,
    "observation_years": [
      2018,
      2019,
      2020,
      2021,
      2022
    ],
    "source_portal": "https://www.ibge.gov.br/estatisticas/economicas/servicos/22649-demografia-das-empresas-e-estatisticas-de-empreendedorismo.html",
    "download_directory": "https://ftp.ibge.gov.br/Demografia_das_Empresas_e_Estatisticas_de_Empreendedorismo/2022/",
    "sources": [
      {
        "url": "https://ftp.ibge.gov.br/Demografia_das_Empresas_e_Estatisticas_de_Empreendedorismo/2022/xlsx/Tabela_2_1.xlsx",
        "local_path": "data/ibge/Tabela_2_1.xlsx",
        "sha256": "a0cd6badda641925345d55957966ed4698c8e29cd064a9d1a9c2416f15885598",
        "bytes": 16882
      },
      {
        "url": "https://ftp.ibge.gov.br/Demografia_das_Empresas_e_Estatisticas_de_Empreendedorismo/2022/xlsx/Tabela_2_2.xlsx",
        "local_path": "data/ibge/Tabela_2_2.xlsx",
        "sha256": "4b79eca6e71716de236f6793b7e78c88ae6179385fd177c2f21d6f09c4132a58",
        "bytes": 58849
      },
      {
        "url": "https://www.ibge.gov.br/biblioteca/visualizacao/livros/liv102143.pdf",
        "local_path": "research/liv102143.pdf",
        "sha256": "dcf9feafb710e155705979ecbc9740bc986e17be04553352c1d2aa2e9acaf352",
        "bytes": 1313633
      }
    ],
    "latest_release_verification": {
      "status": "2022 is the latest year listed in this official FTP product directory on acquisition; not a guarantee about other products",
      "url": "https://ftp.ibge.gov.br/Demografia_das_Empresas_e_Estatisticas_de_Empreendedorismo/"
    },
    "definitions": {
      "employer_enterprises": "Enterprises with at least one salaried employee on 31 December; national enterprise statistics, not all registered businesses.",
      "employer_local_units": "Employer establishments/local units; distinct from enterprises. State comparisons use this population and its own Brazil comparator.",
      "birth": "Employer births include new activity, activity restarted after over 24 months of inactivity, and existing enterprises entering employer status after at least 24 months without employees.",
      "survival": "Active as an employer in birth year and each consecutive observation year; losing employer status can end survival without legal business closure.",
      "births": "Published 2017 cohort denominator for the same population and group as the rate. Not the 2022 count of active businesses.",
      "size": "Published salaried-personnel bands; association with survival is descriptive, not causal.",
      "curve": "Published percentages for ages 1-5, fixed 2017 cohort. No inferred count of survivors is supplied.",
      "symbols": {
        "-": "exact numeric zero, not rounding",
        "x": "confidentiality suppression; null",
        "..": "not applicable; null",
        "...": "not available; null"
      }
    },
    "national": {
      "population": "employer_enterprises",
      "geography": "Brasil",
      "label": "Total",
      "cohort_year": 2017,
      "births": 261302,
      "births_published_value": 261302,
      "five_year_survival_pct": 37.31889,
      "curve": [
        {
          "age": 1,
          "year": 2018,
          "survival_pct": 76.21603,
          "published_value": 76.21603
        },
        {
          "age": 2,
          "year": 2019,
          "survival_pct": 59.63253,
          "published_value": 59.63253
        },
        {
          "age": 3,
          "year": 2020,
          "survival_pct": 49.36434,
          "published_value": 49.36434
        },
        {
          "age": 4,
          "year": 2021,
          "survival_pct": 42.27752,
          "published_value": 42.27752
        },
        {
          "age": 5,
          "year": 2022,
          "survival_pct": 37.31889,
          "published_value": 37.31889
        }
      ],
      "source_table": "2.1",
      "source_row": 7
    },
    "national_curve": [
      {
        "age": 1,
        "year": 2018,
        "survival_pct": 76.21603,
        "published_value": 76.21603
      },
      {
        "age": 2,
        "year": 2019,
        "survival_pct": 59.63253,
        "published_value": 59.63253
      },
      {
        "age": 3,
        "year": 2020,
        "survival_pct": 49.36434,
        "published_value": 49.36434
      },
      {
        "age": 4,
        "year": 2021,
        "survival_pct": 42.27752,
        "published_value": 42.27752
      },
      {
        "age": 5,
        "year": 2022,
        "survival_pct": 37.31889,
        "published_value": 37.31889
      }
    ],
    "sectors": [
      {
        "population": "employer_enterprises",
        "geography": "Brasil",
        "label": "A Agricultura, pecuária, produção florestal, pesca e aquicultura",
        "section": "A",
        "cohort_year": 2017,
        "births": 2177,
        "births_published_value": 2177,
        "five_year_survival_pct": 41.93845,
        "curve": [
          {
            "age": 1,
            "year": 2018,
            "survival_pct": 76.80294,
            "published_value": 76.80294
          },
          {
            "age": 2,
            "year": 2019,
            "survival_pct": 62.19568,
            "published_value": 62.19568
          },
          {
            "age": 3,
            "year": 2020,
            "survival_pct": 53.19247,
            "published_value": 53.19247
          },
          {
            "age": 4,
            "year": 2021,
            "survival_pct": 46.62379,
            "published_value": 46.62379
          },
          {
            "age": 5,
            "year": 2022,
            "survival_pct": 41.93845,
            "published_value": 41.93845
          }
        ],
        "source_table": "2.1",
        "source_row": 13
      },
      {
        "population": "employer_enterprises",
        "geography": "Brasil",
        "label": "B Indústrias extrativas",
        "section": "B",
        "cohort_year": 2017,
        "births": 391,
        "births_published_value": 391,
        "five_year_survival_pct": 40.15345,
        "curve": [
          {
            "age": 1,
            "year": 2018,
            "survival_pct": 74.93606,
            "published_value": 74.93606
          },
          {
            "age": 2,
            "year": 2019,
            "survival_pct": 58.56777,
            "published_value": 58.56777
          },
          {
            "age": 3,
            "year": 2020,
            "survival_pct": 50.12788,
            "published_value": 50.12788
          },
          {
            "age": 4,
            "year": 2021,
            "survival_pct": 45.26854,
            "published_value": 45.26854
          },
          {
            "age": 5,
            "year": 2022,
            "survival_pct": 40.15345,
            "published_value": 40.15345
          }
        ],
        "source_table": "2.1",
        "source_row": 14
      },
      {
        "population": "employer_enterprises",
        "geography": "Brasil",
        "label": "C Indústrias de transformação",
        "section": "C",
        "cohort_year": 2017,
        "births": 20925,
        "births_published_value": 20925,
        "five_year_survival_pct": 42.27957,
        "curve": [
          {
            "age": 1,
            "year": 2018,
            "survival_pct": 78.26045,
            "published_value": 78.26045
          },
          {
            "age": 2,
            "year": 2019,
            "survival_pct": 62.70968,
            "published_value": 62.70968
          },
          {
            "age": 3,
            "year": 2020,
            "survival_pct": 53.15173,
            "published_value": 53.15173
          },
          {
            "age": 4,
            "year": 2021,
            "survival_pct": 46.76225,
            "published_value": 46.76225
          },
          {
            "age": 5,
            "year": 2022,
            "survival_pct": 42.27957,
            "published_value": 42.27957
          }
        ],
        "source_table": "2.1",
        "source_row": 15
      },
      {
        "population": "employer_enterprises",
        "geography": "Brasil",
        "label": "D Eletricidade e gás",
        "section": "D",
        "cohort_year": 2017,
        "births": 119,
        "births_published_value": 119,
        "five_year_survival_pct": 57.98319,
        "curve": [
          {
            "age": 1,
            "year": 2018,
            "survival_pct": 89.07563,
            "published_value": 89.07563
          },
          {
            "age": 2,
            "year": 2019,
            "survival_pct": 73.94958,
            "published_value": 73.94958
          },
          {
            "age": 3,
            "year": 2020,
            "survival_pct": 65.54622,
            "published_value": 65.54622
          },
          {
            "age": 4,
            "year": 2021,
            "survival_pct": 62.18487,
            "published_value": 62.18487
          },
          {
            "age": 5,
            "year": 2022,
            "survival_pct": 57.98319,
            "published_value": 57.98319
          }
        ],
        "source_table": "2.1",
        "source_row": 16
      },
      {
        "population": "employer_enterprises",
        "geography": "Brasil",
        "label": "E Água, esgoto, atividades de gestão de resíduos e descontaminação",
        "section": "E",
        "cohort_year": 2017,
        "births": 739,
        "births_published_value": 739,
        "five_year_survival_pct": 42.21922,
        "curve": [
          {
            "age": 1,
            "year": 2018,
            "survival_pct": 76.04871,
            "published_value": 76.04871
          },
          {
            "age": 2,
            "year": 2019,
            "survival_pct": 61.56969,
            "published_value": 61.56969
          },
          {
            "age": 3,
            "year": 2020,
            "survival_pct": 53.31529,
            "published_value": 53.31529
          },
          {
            "age": 4,
            "year": 2021,
            "survival_pct": 47.22598,
            "published_value": 47.22598
          },
          {
            "age": 5,
            "year": 2022,
            "survival_pct": 42.21922,
            "published_value": 42.21922
          }
        ],
        "source_table": "2.1",
        "source_row": 17
      },
      {
        "population": "employer_enterprises",
        "geography": "Brasil",
        "label": "F Construção",
        "section": "F",
        "cohort_year": 2017,
        "births": 17709,
        "births_published_value": 17709,
        "five_year_survival_pct": 26.16749,
        "curve": [
          {
            "age": 1,
            "year": 2018,
            "survival_pct": 66.0681,
            "published_value": 66.0681
          },
          {
            "age": 2,
            "year": 2019,
            "survival_pct": 47.48433,
            "published_value": 47.48433
          },
          {
            "age": 3,
            "year": 2020,
            "survival_pct": 37.83952,
            "published_value": 37.83952
          },
          {
            "age": 4,
            "year": 2021,
            "survival_pct": 31.5207,
            "published_value": 31.5207
          },
          {
            "age": 5,
            "year": 2022,
            "survival_pct": 26.16749,
            "published_value": 26.16749
          }
        ],
        "source_table": "2.1",
        "source_row": 18
      },
      {
        "population": "employer_enterprises",
        "geography": "Brasil",
        "label": "G Comércio; reparação de veículos automotores e motocicletas",
        "section": "G",
        "cohort_year": 2017,
        "births": 111520,
        "births_published_value": 111520,
        "five_year_survival_pct": 37.0122,
        "curve": [
          {
            "age": 1,
            "year": 2018,
            "survival_pct": 76.63558,
            "published_value": 76.63558
          },
          {
            "age": 2,
            "year": 2019,
            "survival_pct": 59.22794,
            "published_value": 59.22794
          },
          {
            "age": 3,
            "year": 2020,
            "survival_pct": 49.12213,
            "published_value": 49.12213
          },
          {
            "age": 4,
            "year": 2021,
            "survival_pct": 42.04179,
            "published_value": 42.04179
          },
          {
            "age": 5,
            "year": 2022,
            "survival_pct": 37.0122,
            "published_value": 37.0122
          }
        ],
        "source_table": "2.1",
        "source_row": 19
      },
      {
        "population": "employer_enterprises",
        "geography": "Brasil",
        "label": "H Transporte, armazenagem e correio",
        "section": "H",
        "cohort_year": 2017,
        "births": 13748,
        "births_published_value": 13748,
        "five_year_survival_pct": 34.25953,
        "curve": [
          {
            "age": 1,
            "year": 2018,
            "survival_pct": 74.41082,
            "published_value": 74.41082
          },
          {
            "age": 2,
            "year": 2019,
            "survival_pct": 57.45563,
            "published_value": 57.45563
          },
          {
            "age": 3,
            "year": 2020,
            "survival_pct": 47.07594,
            "published_value": 47.07594
          },
          {
            "age": 4,
            "year": 2021,
            "survival_pct": 39.35845,
            "published_value": 39.35845
          },
          {
            "age": 5,
            "year": 2022,
            "survival_pct": 34.25953,
            "published_value": 34.25953
          }
        ],
        "source_table": "2.1",
        "source_row": 20
      },
      {
        "population": "employer_enterprises",
        "geography": "Brasil",
        "label": "I Alojamento e alimentação",
        "section": "I",
        "cohort_year": 2017,
        "births": 26776,
        "births_published_value": 26776,
        "five_year_survival_pct": 30.57589,
        "curve": [
          {
            "age": 1,
            "year": 2018,
            "survival_pct": 74.41365,
            "published_value": 74.41365
          },
          {
            "age": 2,
            "year": 2019,
            "survival_pct": 56.27054,
            "published_value": 56.27054
          },
          {
            "age": 3,
            "year": 2020,
            "survival_pct": 43.71826,
            "published_value": 43.71826
          },
          {
            "age": 4,
            "year": 2021,
            "survival_pct": 35.43472,
            "published_value": 35.43472
          },
          {
            "age": 5,
            "year": 2022,
            "survival_pct": 30.57589,
            "published_value": 30.57589
          }
        ],
        "source_table": "2.1",
        "source_row": 21
      },
      {
        "population": "employer_enterprises",
        "geography": "Brasil",
        "label": "J Informação e comunicação",
        "section": "J",
        "cohort_year": 2017,
        "births": 4793,
        "births_published_value": 4793,
        "five_year_survival_pct": 43.83476,
        "curve": [
          {
            "age": 1,
            "year": 2018,
            "survival_pct": 78.88588,
            "published_value": 78.88588
          },
          {
            "age": 2,
            "year": 2019,
            "survival_pct": 65.19925,
            "published_value": 65.19925
          },
          {
            "age": 3,
            "year": 2020,
            "survival_pct": 56.10265,
            "published_value": 56.10265
          },
          {
            "age": 4,
            "year": 2021,
            "survival_pct": 49.21761,
            "published_value": 49.21761
          },
          {
            "age": 5,
            "year": 2022,
            "survival_pct": 43.83476,
            "published_value": 43.83476
          }
        ],
        "source_table": "2.1",
        "source_row": 22
      },
      {
        "population": "employer_enterprises",
        "geography": "Brasil",
        "label": "K Atividades financeiras, de seguros e serviços relacionados",
        "section": "K",
        "cohort_year": 2017,
        "births": 2800,
        "births_published_value": 2800,
        "five_year_survival_pct": 42.32143,
        "curve": [
          {
            "age": 1,
            "year": 2018,
            "survival_pct": 77.42857,
            "published_value": 77.42857
          },
          {
            "age": 2,
            "year": 2019,
            "survival_pct": 62.75,
            "published_value": 62.75
          },
          {
            "age": 3,
            "year": 2020,
            "survival_pct": 54.46429,
            "published_value": 54.46429
          },
          {
            "age": 4,
            "year": 2021,
            "survival_pct": 47.28571,
            "published_value": 47.28571
          },
          {
            "age": 5,
            "year": 2022,
            "survival_pct": 42.32143,
            "published_value": 42.32143
          }
        ],
        "source_table": "2.1",
        "source_row": 23
      },
      {
        "population": "employer_enterprises",
        "geography": "Brasil",
        "label": "L Atividades imobiliárias",
        "section": "L",
        "cohort_year": 2017,
        "births": 3270,
        "births_published_value": 3270,
        "five_year_survival_pct": 43.5474,
        "curve": [
          {
            "age": 1,
            "year": 2018,
            "survival_pct": 77.40061,
            "published_value": 77.40061
          },
          {
            "age": 2,
            "year": 2019,
            "survival_pct": 63.21101,
            "published_value": 63.21101
          },
          {
            "age": 3,
            "year": 2020,
            "survival_pct": 54.25076,
            "published_value": 54.25076
          },
          {
            "age": 4,
            "year": 2021,
            "survival_pct": 48.68502,
            "published_value": 48.68502
          },
          {
            "age": 5,
            "year": 2022,
            "survival_pct": 43.5474,
            "published_value": 43.5474
          }
        ],
        "source_table": "2.1",
        "source_row": 24
      },
      {
        "population": "employer_enterprises",
        "geography": "Brasil",
        "label": "M Atividades profissionais, científicas e técnicas",
        "section": "M",
        "cohort_year": 2017,
        "births": 13289,
        "births_published_value": 13289,
        "five_year_survival_pct": 41.09414,
        "curve": [
          {
            "age": 1,
            "year": 2018,
            "survival_pct": 76.96591,
            "published_value": 76.96591
          },
          {
            "age": 2,
            "year": 2019,
            "survival_pct": 62.27707,
            "published_value": 62.27707
          },
          {
            "age": 3,
            "year": 2020,
            "survival_pct": 52.8407,
            "published_value": 52.8407
          },
          {
            "age": 4,
            "year": 2021,
            "survival_pct": 46.06065,
            "published_value": 46.06065
          },
          {
            "age": 5,
            "year": 2022,
            "survival_pct": 41.09414,
            "published_value": 41.09414
          }
        ],
        "source_table": "2.1",
        "source_row": 25
      },
      {
        "population": "employer_enterprises",
        "geography": "Brasil",
        "label": "N Atividades administrativas e serviços complementares",
        "section": "N",
        "cohort_year": 2017,
        "births": 16236,
        "births_published_value": 16236,
        "five_year_survival_pct": 39.14141,
        "curve": [
          {
            "age": 1,
            "year": 2018,
            "survival_pct": 76.77384,
            "published_value": 76.77384
          },
          {
            "age": 2,
            "year": 2019,
            "survival_pct": 61.45602,
            "published_value": 61.45602
          },
          {
            "age": 3,
            "year": 2020,
            "survival_pct": 51.07169,
            "published_value": 51.07169
          },
          {
            "age": 4,
            "year": 2021,
            "survival_pct": 43.86548,
            "published_value": 43.86548
          },
          {
            "age": 5,
            "year": 2022,
            "survival_pct": 39.14141,
            "published_value": 39.14141
          }
        ],
        "source_table": "2.1",
        "source_row": 26
      },
      {
        "population": "employer_enterprises",
        "geography": "Brasil",
        "label": "O Administração pública, defesa e seguridade social",
        "section": "O",
        "cohort_year": 2017,
        "births": 7,
        "births_published_value": 7,
        "five_year_survival_pct": 42.85714,
        "curve": [
          {
            "age": 1,
            "year": 2018,
            "survival_pct": 71.42857,
            "published_value": 71.42857
          },
          {
            "age": 2,
            "year": 2019,
            "survival_pct": 57.14286,
            "published_value": 57.14286
          },
          {
            "age": 3,
            "year": 2020,
            "survival_pct": 42.85714,
            "published_value": 42.85714
          },
          {
            "age": 4,
            "year": 2021,
            "survival_pct": 42.85714,
            "published_value": 42.85714
          },
          {
            "age": 5,
            "year": 2022,
            "survival_pct": 42.85714,
            "published_value": 42.85714
          }
        ],
        "source_table": "2.1",
        "source_row": 27
      },
      {
        "population": "employer_enterprises",
        "geography": "Brasil",
        "label": "P Educação",
        "section": "P",
        "cohort_year": 2017,
        "births": 5731,
        "births_published_value": 5731,
        "five_year_survival_pct": 43.6922,
        "curve": [
          {
            "age": 1,
            "year": 2018,
            "survival_pct": 81.539,
            "published_value": 81.539
          },
          {
            "age": 2,
            "year": 2019,
            "survival_pct": 68.52207,
            "published_value": 68.52207
          },
          {
            "age": 3,
            "year": 2020,
            "survival_pct": 56.86617,
            "published_value": 56.86617
          },
          {
            "age": 4,
            "year": 2021,
            "survival_pct": 48.7524,
            "published_value": 48.7524
          },
          {
            "age": 5,
            "year": 2022,
            "survival_pct": 43.6922,
            "published_value": 43.6922
          }
        ],
        "source_table": "2.1",
        "source_row": 28
      },
      {
        "population": "employer_enterprises",
        "geography": "Brasil",
        "label": "Q Saúde humana e serviços sociais",
        "section": "Q",
        "cohort_year": 2017,
        "births": 11541,
        "births_published_value": 11541,
        "five_year_survival_pct": 54.71796,
        "curve": [
          {
            "age": 1,
            "year": 2018,
            "survival_pct": 85.20925,
            "published_value": 85.20925
          },
          {
            "age": 2,
            "year": 2019,
            "survival_pct": 74.62958,
            "published_value": 74.62958
          },
          {
            "age": 3,
            "year": 2020,
            "survival_pct": 65.59224,
            "published_value": 65.59224
          },
          {
            "age": 4,
            "year": 2021,
            "survival_pct": 59.45759,
            "published_value": 59.45759
          },
          {
            "age": 5,
            "year": 2022,
            "survival_pct": 54.71796,
            "published_value": 54.71796
          }
        ],
        "source_table": "2.1",
        "source_row": 29
      },
      {
        "population": "employer_enterprises",
        "geography": "Brasil",
        "label": "R Artes, cultura, esporte e recreação",
        "section": "R",
        "cohort_year": 2017,
        "births": 3277,
        "births_published_value": 3277,
        "five_year_survival_pct": 34.63534,
        "curve": [
          {
            "age": 1,
            "year": 2018,
            "survival_pct": 76.3198,
            "published_value": 76.3198
          },
          {
            "age": 2,
            "year": 2019,
            "survival_pct": 60.60421,
            "published_value": 60.60421
          },
          {
            "age": 3,
            "year": 2020,
            "survival_pct": 47.08575,
            "published_value": 47.08575
          },
          {
            "age": 4,
            "year": 2021,
            "survival_pct": 39.33476,
            "published_value": 39.33476
          },
          {
            "age": 5,
            "year": 2022,
            "survival_pct": 34.63534,
            "published_value": 34.63534
          }
        ],
        "source_table": "2.1",
        "source_row": 30
      },
      {
        "population": "employer_enterprises",
        "geography": "Brasil",
        "label": "S Outras atividades de serviços",
        "section": "S",
        "cohort_year": 2017,
        "births": 6254,
        "births_published_value": 6254,
        "five_year_survival_pct": 30.81228,
        "curve": [
          {
            "age": 1,
            "year": 2018,
            "survival_pct": 74.19252,
            "published_value": 74.19252
          },
          {
            "age": 2,
            "year": 2019,
            "survival_pct": 54.58906,
            "published_value": 54.58906
          },
          {
            "age": 3,
            "year": 2020,
            "survival_pct": 43.25232,
            "published_value": 43.25232
          },
          {
            "age": 4,
            "year": 2021,
            "survival_pct": 35.81708,
            "published_value": 35.81708
          },
          {
            "age": 5,
            "year": 2022,
            "survival_pct": 30.81228,
            "published_value": 30.81228
          }
        ],
        "source_table": "2.1",
        "source_row": 31
      },
      {
        "population": "employer_enterprises",
        "geography": "Brasil",
        "label": "U Organismos internacionais e outras instituições extraterritoriais",
        "section": "U",
        "cohort_year": 2017,
        "births": 0,
        "births_published_value": "-",
        "five_year_survival_pct": 0,
        "curve": [
          {
            "age": 1,
            "year": 2018,
            "survival_pct": 0,
            "published_value": "-"
          },
          {
            "age": 2,
            "year": 2019,
            "survival_pct": 0,
            "published_value": "-"
          },
          {
            "age": 3,
            "year": 2020,
            "survival_pct": 0,
            "published_value": "-"
          },
          {
            "age": 4,
            "year": 2021,
            "survival_pct": 0,
            "published_value": "-"
          },
          {
            "age": 5,
            "year": 2022,
            "survival_pct": 0,
            "published_value": "-"
          }
        ],
        "source_table": "2.1",
        "source_row": 32
      }
    ],
    "sizes": [
      {
        "population": "employer_enterprises",
        "geography": "Brasil",
        "label": "1 a 9",
        "cohort_year": 2017,
        "births": 242505,
        "births_published_value": 242505,
        "five_year_survival_pct": 35.88091,
        "curve": [
          {
            "age": 1,
            "year": 2018,
            "survival_pct": 75.07433,
            "published_value": 75.07433
          },
          {
            "age": 2,
            "year": 2019,
            "survival_pct": 58.04087,
            "published_value": 58.04087
          },
          {
            "age": 3,
            "year": 2020,
            "survival_pct": 47.72232,
            "published_value": 47.72232
          },
          {
            "age": 4,
            "year": 2021,
            "survival_pct": 40.73607,
            "published_value": 40.73607
          },
          {
            "age": 5,
            "year": 2022,
            "survival_pct": 35.88091,
            "published_value": 35.88091
          }
        ],
        "source_table": "2.1",
        "source_row": 9
      },
      {
        "population": "employer_enterprises",
        "geography": "Brasil",
        "label": "10 a 49",
        "cohort_year": 2017,
        "births": 17192,
        "births_published_value": 17192,
        "five_year_survival_pct": 55.40368,
        "curve": [
          {
            "age": 1,
            "year": 2018,
            "survival_pct": 90.84458,
            "published_value": 90.84458
          },
          {
            "age": 2,
            "year": 2019,
            "survival_pct": 80.03141,
            "published_value": 80.03141
          },
          {
            "age": 3,
            "year": 2020,
            "survival_pct": 70.13146,
            "published_value": 70.13146
          },
          {
            "age": 4,
            "year": 2021,
            "survival_pct": 61.61587,
            "published_value": 61.61587
          },
          {
            "age": 5,
            "year": 2022,
            "survival_pct": 55.40368,
            "published_value": 55.40368
          }
        ],
        "source_table": "2.1",
        "source_row": 10
      },
      {
        "population": "employer_enterprises",
        "geography": "Brasil",
        "label": "50 ou mais",
        "cohort_year": 2017,
        "births": 1605,
        "births_published_value": 1605,
        "five_year_survival_pct": 60.87227,
        "curve": [
          {
            "age": 1,
            "year": 2018,
            "survival_pct": 92.02492,
            "published_value": 92.02492
          },
          {
            "age": 2,
            "year": 2019,
            "survival_pct": 81.61994,
            "published_value": 81.61994
          },
          {
            "age": 3,
            "year": 2020,
            "survival_pct": 75.01558,
            "published_value": 75.01558
          },
          {
            "age": 4,
            "year": 2021,
            "survival_pct": 68.03738,
            "published_value": 68.03738
          },
          {
            "age": 5,
            "year": 2022,
            "survival_pct": 60.87227,
            "published_value": 60.87227
          }
        ],
        "source_table": "2.1",
        "source_row": 11
      }
    ],
    "national_curve_with_origin": [
      {
        "age": 0,
        "year": 2017,
        "survival_pct": 100,
        "published_value": null,
        "basis": "cohort origin by definition"
      },
      {
        "age": 1,
        "year": 2018,
        "survival_pct": 76.21603,
        "published_value": 76.21603
      },
      {
        "age": 2,
        "year": 2019,
        "survival_pct": 59.63253,
        "published_value": 59.63253
      },
      {
        "age": 3,
        "year": 2020,
        "survival_pct": 49.36434,
        "published_value": 49.36434
      },
      {
        "age": 4,
        "year": 2021,
        "survival_pct": 42.27752,
        "published_value": 42.27752
      },
      {
        "age": 5,
        "year": 2022,
        "survival_pct": 37.31889,
        "published_value": 37.31889
      }
    ],
    "local_units_national": {
      "population": "employer_local_units",
      "geography": "Brasil",
      "geography_level": "country",
      "region": null,
      "label": "Total",
      "section": null,
      "cohort_year": 2017,
      "births": 296850,
      "births_published_value": 296850,
      "five_year_survival_pct": 37.8538,
      "curve": [
        {
          "age": 1,
          "year": 2018,
          "survival_pct": 76.81792,
          "published_value": 76.81792
        },
        {
          "age": 2,
          "year": 2019,
          "survival_pct": 60.667,
          "published_value": 60.667
        },
        {
          "age": 3,
          "year": 2020,
          "survival_pct": 50.24693,
          "published_value": 50.24693
        },
        {
          "age": 4,
          "year": 2021,
          "survival_pct": 43.00623,
          "published_value": 43.00623
        },
        {
          "age": 5,
          "year": 2022,
          "survival_pct": 37.8538,
          "published_value": 37.8538
        }
      ],
      "source_table": "2.2",
      "source_row": 6
    },
    "states": [
      {
        "population": "employer_local_units",
        "geography": "Rondônia",
        "geography_level": "state",
        "region": "Norte",
        "label": "Total",
        "section": null,
        "cohort_year": 2017,
        "births": 2744,
        "births_published_value": 2744,
        "five_year_survival_pct": 36.40671,
        "curve": [
          {
            "age": 1,
            "year": 2018,
            "survival_pct": 76.78571,
            "published_value": 76.78571
          },
          {
            "age": 2,
            "year": 2019,
            "survival_pct": 58.01749,
            "published_value": 58.01749
          },
          {
            "age": 3,
            "year": 2020,
            "survival_pct": 48.3965,
            "published_value": 48.3965
          },
          {
            "age": 4,
            "year": 2021,
            "survival_pct": 40.99854,
            "published_value": 40.99854
          },
          {
            "age": 5,
            "year": 2022,
            "survival_pct": 36.40671,
            "published_value": 36.40671
          }
        ],
        "source_table": "2.2",
        "source_row": 48,
        "uf": "RO",
        "name": "Rondônia"
      },
      {
        "population": "employer_local_units",
        "geography": "Acre",
        "geography_level": "state",
        "region": "Norte",
        "label": "Total",
        "section": null,
        "cohort_year": 2017,
        "births": 704,
        "births_published_value": 704,
        "five_year_survival_pct": 34.65909,
        "curve": [
          {
            "age": 1,
            "year": 2018,
            "survival_pct": 74.85795,
            "published_value": 74.85795
          },
          {
            "age": 2,
            "year": 2019,
            "survival_pct": 58.23864,
            "published_value": 58.23864
          },
          {
            "age": 3,
            "year": 2020,
            "survival_pct": 47.15909,
            "published_value": 47.15909
          },
          {
            "age": 4,
            "year": 2021,
            "survival_pct": 41.05114,
            "published_value": 41.05114
          },
          {
            "age": 5,
            "year": 2022,
            "survival_pct": 34.65909,
            "published_value": 34.65909
          }
        ],
        "source_table": "2.2",
        "source_row": 69,
        "uf": "AC",
        "name": "Acre"
      },
      {
        "population": "employer_local_units",
        "geography": "Amazonas",
        "geography_level": "state",
        "region": "Norte",
        "label": "Total",
        "section": null,
        "cohort_year": 2017,
        "births": 2569,
        "births_published_value": 2569,
        "five_year_survival_pct": 35.30557,
        "curve": [
          {
            "age": 1,
            "year": 2018,
            "survival_pct": 75.78824,
            "published_value": 75.78824
          },
          {
            "age": 2,
            "year": 2019,
            "survival_pct": 58.93344,
            "published_value": 58.93344
          },
          {
            "age": 3,
            "year": 2020,
            "survival_pct": 47.91748,
            "published_value": 47.91748
          },
          {
            "age": 4,
            "year": 2021,
            "survival_pct": 39.70417,
            "published_value": 39.70417
          },
          {
            "age": 5,
            "year": 2022,
            "survival_pct": 35.30557,
            "published_value": 35.30557
          }
        ],
        "source_table": "2.2",
        "source_row": 90,
        "uf": "AM",
        "name": "Amazonas"
      },
      {
        "population": "employer_local_units",
        "geography": "Roraima",
        "geography_level": "state",
        "region": "Norte",
        "label": "Total",
        "section": null,
        "cohort_year": 2017,
        "births": 565,
        "births_published_value": 565,
        "five_year_survival_pct": 37.69912,
        "curve": [
          {
            "age": 1,
            "year": 2018,
            "survival_pct": 74.86726,
            "published_value": 74.86726
          },
          {
            "age": 2,
            "year": 2019,
            "survival_pct": 57.52212,
            "published_value": 57.52212
          },
          {
            "age": 3,
            "year": 2020,
            "survival_pct": 49.20354,
            "published_value": 49.20354
          },
          {
            "age": 4,
            "year": 2021,
            "survival_pct": 42.30088,
            "published_value": 42.30088
          },
          {
            "age": 5,
            "year": 2022,
            "survival_pct": 37.69912,
            "published_value": 37.69912
          }
        ],
        "source_table": "2.2",
        "source_row": 111,
        "uf": "RR",
        "name": "Roraima"
      },
      {
        "population": "employer_local_units",
        "geography": "Pará",
        "geography_level": "state",
        "region": "Norte",
        "label": "Total",
        "section": null,
        "cohort_year": 2017,
        "births": 5940,
        "births_published_value": 5940,
        "five_year_survival_pct": 38.97306,
        "curve": [
          {
            "age": 1,
            "year": 2018,
            "survival_pct": 77.37374,
            "published_value": 77.37374
          },
          {
            "age": 2,
            "year": 2019,
            "survival_pct": 61.24579,
            "published_value": 61.24579
          },
          {
            "age": 3,
            "year": 2020,
            "survival_pct": 50.6229,
            "published_value": 50.6229
          },
          {
            "age": 4,
            "year": 2021,
            "survival_pct": 43.43434,
            "published_value": 43.43434
          },
          {
            "age": 5,
            "year": 2022,
            "survival_pct": 38.97306,
            "published_value": 38.97306
          }
        ],
        "source_table": "2.2",
        "source_row": 132,
        "uf": "PA",
        "name": "Pará"
      },
      {
        "population": "employer_local_units",
        "geography": "Amapá",
        "geography_level": "state",
        "region": "Norte",
        "label": "Total",
        "section": null,
        "cohort_year": 2017,
        "births": 804,
        "births_published_value": 804,
        "five_year_survival_pct": 27.8607,
        "curve": [
          {
            "age": 1,
            "year": 2018,
            "survival_pct": 74.50249,
            "published_value": 74.50249
          },
          {
            "age": 2,
            "year": 2019,
            "survival_pct": 54.85075,
            "published_value": 54.85075
          },
          {
            "age": 3,
            "year": 2020,
            "survival_pct": 42.53731,
            "published_value": 42.53731
          },
          {
            "age": 4,
            "year": 2021,
            "survival_pct": 33.83085,
            "published_value": 33.83085
          },
          {
            "age": 5,
            "year": 2022,
            "survival_pct": 27.8607,
            "published_value": 27.8607
          }
        ],
        "source_table": "2.2",
        "source_row": 153,
        "uf": "AP",
        "name": "Amapá"
      },
      {
        "population": "employer_local_units",
        "geography": "Tocantins",
        "geography_level": "state",
        "region": "Norte",
        "label": "Total",
        "section": null,
        "cohort_year": 2017,
        "births": 2164,
        "births_published_value": 2164,
        "five_year_survival_pct": 35.7671,
        "curve": [
          {
            "age": 1,
            "year": 2018,
            "survival_pct": 75.27726,
            "published_value": 75.27726
          },
          {
            "age": 2,
            "year": 2019,
            "survival_pct": 58.82625,
            "published_value": 58.82625
          },
          {
            "age": 3,
            "year": 2020,
            "survival_pct": 48.56747,
            "published_value": 48.56747
          },
          {
            "age": 4,
            "year": 2021,
            "survival_pct": 41.08133,
            "published_value": 41.08133
          },
          {
            "age": 5,
            "year": 2022,
            "survival_pct": 35.7671,
            "published_value": 35.7671
          }
        ],
        "source_table": "2.2",
        "source_row": 174,
        "uf": "TO",
        "name": "Tocantins"
      },
      {
        "population": "employer_local_units",
        "geography": "Maranhão",
        "geography_level": "state",
        "region": "Nordeste",
        "label": "Total",
        "section": null,
        "cohort_year": 2017,
        "births": 4640,
        "births_published_value": 4640,
        "five_year_survival_pct": 37.88793,
        "curve": [
          {
            "age": 1,
            "year": 2018,
            "survival_pct": 77.15517,
            "published_value": 77.15517
          },
          {
            "age": 2,
            "year": 2019,
            "survival_pct": 60.64655,
            "published_value": 60.64655
          },
          {
            "age": 3,
            "year": 2020,
            "survival_pct": 50.12931,
            "published_value": 50.12931
          },
          {
            "age": 4,
            "year": 2021,
            "survival_pct": 42.73707,
            "published_value": 42.73707
          },
          {
            "age": 5,
            "year": 2022,
            "survival_pct": 37.88793,
            "published_value": 37.88793
          }
        ],
        "source_table": "2.2",
        "source_row": 216,
        "uf": "MA",
        "name": "Maranhão"
      },
      {
        "population": "employer_local_units",
        "geography": "Piauí",
        "geography_level": "state",
        "region": "Nordeste",
        "label": "Total",
        "section": null,
        "cohort_year": 2017,
        "births": 3009,
        "births_published_value": 3009,
        "five_year_survival_pct": 39.91359,
        "curve": [
          {
            "age": 1,
            "year": 2018,
            "survival_pct": 78.73048,
            "published_value": 78.73048
          },
          {
            "age": 2,
            "year": 2019,
            "survival_pct": 62.67863,
            "published_value": 62.67863
          },
          {
            "age": 3,
            "year": 2020,
            "survival_pct": 52.87471,
            "published_value": 52.87471
          },
          {
            "age": 4,
            "year": 2021,
            "survival_pct": 44.9651,
            "published_value": 44.9651
          },
          {
            "age": 5,
            "year": 2022,
            "survival_pct": 39.91359,
            "published_value": 39.91359
          }
        ],
        "source_table": "2.2",
        "source_row": 237,
        "uf": "PI",
        "name": "Piauí"
      },
      {
        "population": "employer_local_units",
        "geography": "Ceará",
        "geography_level": "state",
        "region": "Nordeste",
        "label": "Total",
        "section": null,
        "cohort_year": 2017,
        "births": 7960,
        "births_published_value": 7960,
        "five_year_survival_pct": 37.72613,
        "curve": [
          {
            "age": 1,
            "year": 2018,
            "survival_pct": 76.38191,
            "published_value": 76.38191
          },
          {
            "age": 2,
            "year": 2019,
            "survival_pct": 60.50251,
            "published_value": 60.50251
          },
          {
            "age": 3,
            "year": 2020,
            "survival_pct": 50.61558,
            "published_value": 50.61558
          },
          {
            "age": 4,
            "year": 2021,
            "survival_pct": 43.26633,
            "published_value": 43.26633
          },
          {
            "age": 5,
            "year": 2022,
            "survival_pct": 37.72613,
            "published_value": 37.72613
          }
        ],
        "source_table": "2.2",
        "source_row": 258,
        "uf": "CE",
        "name": "Ceará"
      },
      {
        "population": "employer_local_units",
        "geography": "Rio Grande do Norte",
        "geography_level": "state",
        "region": "Nordeste",
        "label": "Total",
        "section": null,
        "cohort_year": 2017,
        "births": 4125,
        "births_published_value": 4125,
        "five_year_survival_pct": 36.92121,
        "curve": [
          {
            "age": 1,
            "year": 2018,
            "survival_pct": 77.30909,
            "published_value": 77.30909
          },
          {
            "age": 2,
            "year": 2019,
            "survival_pct": 58.54545,
            "published_value": 58.54545
          },
          {
            "age": 3,
            "year": 2020,
            "survival_pct": 49.11515,
            "published_value": 49.11515
          },
          {
            "age": 4,
            "year": 2021,
            "survival_pct": 42.20606,
            "published_value": 42.20606
          },
          {
            "age": 5,
            "year": 2022,
            "survival_pct": 36.92121,
            "published_value": 36.92121
          }
        ],
        "source_table": "2.2",
        "source_row": 279,
        "uf": "RN",
        "name": "Rio Grande do Norte"
      },
      {
        "population": "employer_local_units",
        "geography": "Paraíba",
        "geography_level": "state",
        "region": "Nordeste",
        "label": "Total",
        "section": null,
        "cohort_year": 2017,
        "births": 3559,
        "births_published_value": 3559,
        "five_year_survival_pct": 40.15173,
        "curve": [
          {
            "age": 1,
            "year": 2018,
            "survival_pct": 77.97134,
            "published_value": 77.97134
          },
          {
            "age": 2,
            "year": 2019,
            "survival_pct": 60.69121,
            "published_value": 60.69121
          },
          {
            "age": 3,
            "year": 2020,
            "survival_pct": 51.61562,
            "published_value": 51.61562
          },
          {
            "age": 4,
            "year": 2021,
            "survival_pct": 45.15313,
            "published_value": 45.15313
          },
          {
            "age": 5,
            "year": 2022,
            "survival_pct": 40.15173,
            "published_value": 40.15173
          }
        ],
        "source_table": "2.2",
        "source_row": 300,
        "uf": "PB",
        "name": "Paraíba"
      },
      {
        "population": "employer_local_units",
        "geography": "Pernambuco",
        "geography_level": "state",
        "region": "Nordeste",
        "label": "Total",
        "section": null,
        "cohort_year": 2017,
        "births": 9284,
        "births_published_value": 9284,
        "five_year_survival_pct": 37.87161,
        "curve": [
          {
            "age": 1,
            "year": 2018,
            "survival_pct": 77.83283,
            "published_value": 77.83283
          },
          {
            "age": 2,
            "year": 2019,
            "survival_pct": 61.00819,
            "published_value": 61.00819
          },
          {
            "age": 3,
            "year": 2020,
            "survival_pct": 51.13098,
            "published_value": 51.13098
          },
          {
            "age": 4,
            "year": 2021,
            "survival_pct": 43.38647,
            "published_value": 43.38647
          },
          {
            "age": 5,
            "year": 2022,
            "survival_pct": 37.87161,
            "published_value": 37.87161
          }
        ],
        "source_table": "2.2",
        "source_row": 321,
        "uf": "PE",
        "name": "Pernambuco"
      },
      {
        "population": "employer_local_units",
        "geography": "Alagoas",
        "geography_level": "state",
        "region": "Nordeste",
        "label": "Total",
        "section": null,
        "cohort_year": 2017,
        "births": 2928,
        "births_published_value": 2928,
        "five_year_survival_pct": 35.8265,
        "curve": [
          {
            "age": 1,
            "year": 2018,
            "survival_pct": 75.99044,
            "published_value": 75.99044
          },
          {
            "age": 2,
            "year": 2019,
            "survival_pct": 58.19672,
            "published_value": 58.19672
          },
          {
            "age": 3,
            "year": 2020,
            "survival_pct": 47.57514,
            "published_value": 47.57514
          },
          {
            "age": 4,
            "year": 2021,
            "survival_pct": 39.65164,
            "published_value": 39.65164
          },
          {
            "age": 5,
            "year": 2022,
            "survival_pct": 35.8265,
            "published_value": 35.8265
          }
        ],
        "source_table": "2.2",
        "source_row": 342,
        "uf": "AL",
        "name": "Alagoas"
      },
      {
        "population": "employer_local_units",
        "geography": "Sergipe",
        "geography_level": "state",
        "region": "Nordeste",
        "label": "Total",
        "section": null,
        "cohort_year": 2017,
        "births": 2274,
        "births_published_value": 2274,
        "five_year_survival_pct": 40.45734,
        "curve": [
          {
            "age": 1,
            "year": 2018,
            "survival_pct": 76.86895,
            "published_value": 76.86895
          },
          {
            "age": 2,
            "year": 2019,
            "survival_pct": 62.35708,
            "published_value": 62.35708
          },
          {
            "age": 3,
            "year": 2020,
            "survival_pct": 52.41865,
            "published_value": 52.41865
          },
          {
            "age": 4,
            "year": 2021,
            "survival_pct": 45.16271,
            "published_value": 45.16271
          },
          {
            "age": 5,
            "year": 2022,
            "survival_pct": 40.45734,
            "published_value": 40.45734
          }
        ],
        "source_table": "2.2",
        "source_row": 363,
        "uf": "SE",
        "name": "Sergipe"
      },
      {
        "population": "employer_local_units",
        "geography": "Bahia",
        "geography_level": "state",
        "region": "Nordeste",
        "label": "Total",
        "section": null,
        "cohort_year": 2017,
        "births": 15394,
        "births_published_value": 15394,
        "five_year_survival_pct": 37.46265,
        "curve": [
          {
            "age": 1,
            "year": 2018,
            "survival_pct": 76.85462,
            "published_value": 76.85462
          },
          {
            "age": 2,
            "year": 2019,
            "survival_pct": 60.94582,
            "published_value": 60.94582
          },
          {
            "age": 3,
            "year": 2020,
            "survival_pct": 50.55866,
            "published_value": 50.55866
          },
          {
            "age": 4,
            "year": 2021,
            "survival_pct": 42.91282,
            "published_value": 42.91282
          },
          {
            "age": 5,
            "year": 2022,
            "survival_pct": 37.46265,
            "published_value": 37.46265
          }
        ],
        "source_table": "2.2",
        "source_row": 384,
        "uf": "BA",
        "name": "Bahia"
      },
      {
        "population": "employer_local_units",
        "geography": "Minas Gerais",
        "geography_level": "state",
        "region": "Sudeste",
        "label": "Total",
        "section": null,
        "cohort_year": 2017,
        "births": 32179,
        "births_published_value": 32179,
        "five_year_survival_pct": 37.47475,
        "curve": [
          {
            "age": 1,
            "year": 2018,
            "survival_pct": 76.51263,
            "published_value": 76.51263
          },
          {
            "age": 2,
            "year": 2019,
            "survival_pct": 59.96457,
            "published_value": 59.96457
          },
          {
            "age": 3,
            "year": 2020,
            "survival_pct": 49.71565,
            "published_value": 49.71565
          },
          {
            "age": 4,
            "year": 2021,
            "survival_pct": 42.66136,
            "published_value": 42.66136
          },
          {
            "age": 5,
            "year": 2022,
            "survival_pct": 37.47475,
            "published_value": 37.47475
          }
        ],
        "source_table": "2.2",
        "source_row": 426,
        "uf": "MG",
        "name": "Minas Gerais"
      },
      {
        "population": "employer_local_units",
        "geography": "Espírito Santo",
        "geography_level": "state",
        "region": "Sudeste",
        "label": "Total",
        "section": null,
        "cohort_year": 2017,
        "births": 6186,
        "births_published_value": 6186,
        "five_year_survival_pct": 38.94277,
        "curve": [
          {
            "age": 1,
            "year": 2018,
            "survival_pct": 76.91562,
            "published_value": 76.91562
          },
          {
            "age": 2,
            "year": 2019,
            "survival_pct": 61.59069,
            "published_value": 61.59069
          },
          {
            "age": 3,
            "year": 2020,
            "survival_pct": 50.9861,
            "published_value": 50.9861
          },
          {
            "age": 4,
            "year": 2021,
            "survival_pct": 44.14808,
            "published_value": 44.14808
          },
          {
            "age": 5,
            "year": 2022,
            "survival_pct": 38.94277,
            "published_value": 38.94277
          }
        ],
        "source_table": "2.2",
        "source_row": 447,
        "uf": "ES",
        "name": "Espírito Santo"
      },
      {
        "population": "employer_local_units",
        "geography": "Rio de Janeiro",
        "geography_level": "state",
        "region": "Sudeste",
        "label": "Total",
        "section": null,
        "cohort_year": 2017,
        "births": 19597,
        "births_published_value": 19597,
        "five_year_survival_pct": 38.64877,
        "curve": [
          {
            "age": 1,
            "year": 2018,
            "survival_pct": 78.90493,
            "published_value": 78.90493
          },
          {
            "age": 2,
            "year": 2019,
            "survival_pct": 62.94841,
            "published_value": 62.94841
          },
          {
            "age": 3,
            "year": 2020,
            "survival_pct": 51.56912,
            "published_value": 51.56912
          },
          {
            "age": 4,
            "year": 2021,
            "survival_pct": 44.19554,
            "published_value": 44.19554
          },
          {
            "age": 5,
            "year": 2022,
            "survival_pct": 38.64877,
            "published_value": 38.64877
          }
        ],
        "source_table": "2.2",
        "source_row": 468,
        "uf": "RJ",
        "name": "Rio de Janeiro"
      },
      {
        "population": "employer_local_units",
        "geography": "São Paulo",
        "geography_level": "state",
        "region": "Sudeste",
        "label": "Total",
        "section": null,
        "cohort_year": 2017,
        "births": 77841,
        "births_published_value": 77841,
        "five_year_survival_pct": 38.48101,
        "curve": [
          {
            "age": 1,
            "year": 2018,
            "survival_pct": 77.29474,
            "published_value": 77.29474
          },
          {
            "age": 2,
            "year": 2019,
            "survival_pct": 61.49073,
            "published_value": 61.49073
          },
          {
            "age": 3,
            "year": 2020,
            "survival_pct": 51.00268,
            "published_value": 51.00268
          },
          {
            "age": 4,
            "year": 2021,
            "survival_pct": 43.65951,
            "published_value": 43.65951
          },
          {
            "age": 5,
            "year": 2022,
            "survival_pct": 38.48101,
            "published_value": 38.48101
          }
        ],
        "source_table": "2.2",
        "source_row": 489,
        "uf": "SP",
        "name": "São Paulo"
      },
      {
        "population": "employer_local_units",
        "geography": "Paraná",
        "geography_level": "state",
        "region": "Sul",
        "label": "Total",
        "section": null,
        "cohort_year": 2017,
        "births": 23578,
        "births_published_value": 23578,
        "five_year_survival_pct": 36.96242,
        "curve": [
          {
            "age": 1,
            "year": 2018,
            "survival_pct": 75.84189,
            "published_value": 75.84189
          },
          {
            "age": 2,
            "year": 2019,
            "survival_pct": 59.46221,
            "published_value": 59.46221
          },
          {
            "age": 3,
            "year": 2020,
            "survival_pct": 49.10086,
            "published_value": 49.10086
          },
          {
            "age": 4,
            "year": 2021,
            "survival_pct": 42.02222,
            "published_value": 42.02222
          },
          {
            "age": 5,
            "year": 2022,
            "survival_pct": 36.96242,
            "published_value": 36.96242
          }
        ],
        "source_table": "2.2",
        "source_row": 531,
        "uf": "PR",
        "name": "Paraná"
      },
      {
        "population": "employer_local_units",
        "geography": "Santa Catarina",
        "geography_level": "state",
        "region": "Sul",
        "label": "Total",
        "section": null,
        "cohort_year": 2017,
        "births": 17513,
        "births_published_value": 17513,
        "five_year_survival_pct": 39.98173,
        "curve": [
          {
            "age": 1,
            "year": 2018,
            "survival_pct": 76.56027,
            "published_value": 76.56027
          },
          {
            "age": 2,
            "year": 2019,
            "survival_pct": 61.36584,
            "published_value": 61.36584
          },
          {
            "age": 3,
            "year": 2020,
            "survival_pct": 51.53886,
            "published_value": 51.53886
          },
          {
            "age": 4,
            "year": 2021,
            "survival_pct": 44.9666,
            "published_value": 44.9666
          },
          {
            "age": 5,
            "year": 2022,
            "survival_pct": 39.98173,
            "published_value": 39.98173
          }
        ],
        "source_table": "2.2",
        "source_row": 552,
        "uf": "SC",
        "name": "Santa Catarina"
      },
      {
        "population": "employer_local_units",
        "geography": "Rio Grande do Sul",
        "geography_level": "state",
        "region": "Sul",
        "label": "Total",
        "section": null,
        "cohort_year": 2017,
        "births": 20225,
        "births_published_value": 20225,
        "five_year_survival_pct": 38.41286,
        "curve": [
          {
            "age": 1,
            "year": 2018,
            "survival_pct": 76.81088,
            "published_value": 76.81088
          },
          {
            "age": 2,
            "year": 2019,
            "survival_pct": 61.32509,
            "published_value": 61.32509
          },
          {
            "age": 3,
            "year": 2020,
            "survival_pct": 50.60569,
            "published_value": 50.60569
          },
          {
            "age": 4,
            "year": 2021,
            "survival_pct": 43.62423,
            "published_value": 43.62423
          },
          {
            "age": 5,
            "year": 2022,
            "survival_pct": 38.41286,
            "published_value": 38.41286
          }
        ],
        "source_table": "2.2",
        "source_row": 573,
        "uf": "RS",
        "name": "Rio Grande do Sul"
      },
      {
        "population": "employer_local_units",
        "geography": "Mato Grosso do Sul",
        "geography_level": "state",
        "region": "Centro-Oeste",
        "label": "Total",
        "section": null,
        "cohort_year": 2017,
        "births": 4377,
        "births_published_value": 4377,
        "five_year_survival_pct": 36.73749,
        "curve": [
          {
            "age": 1,
            "year": 2018,
            "survival_pct": 74.98286,
            "published_value": 74.98286
          },
          {
            "age": 2,
            "year": 2019,
            "survival_pct": 58.48755,
            "published_value": 58.48755
          },
          {
            "age": 3,
            "year": 2020,
            "survival_pct": 48.06945,
            "published_value": 48.06945
          },
          {
            "age": 4,
            "year": 2021,
            "survival_pct": 41.26114,
            "published_value": 41.26114
          },
          {
            "age": 5,
            "year": 2022,
            "survival_pct": 36.73749,
            "published_value": 36.73749
          }
        ],
        "source_table": "2.2",
        "source_row": 615,
        "uf": "MS",
        "name": "Mato Grosso do Sul"
      },
      {
        "population": "employer_local_units",
        "geography": "Mato Grosso",
        "geography_level": "state",
        "region": "Centro-Oeste",
        "label": "Total",
        "section": null,
        "cohort_year": 2017,
        "births": 7143,
        "births_published_value": 7143,
        "five_year_survival_pct": 37.40725,
        "curve": [
          {
            "age": 1,
            "year": 2018,
            "survival_pct": 75.55649,
            "published_value": 75.55649
          },
          {
            "age": 2,
            "year": 2019,
            "survival_pct": 59.03682,
            "published_value": 59.03682
          },
          {
            "age": 3,
            "year": 2020,
            "survival_pct": 49.22302,
            "published_value": 49.22302
          },
          {
            "age": 4,
            "year": 2021,
            "survival_pct": 41.90116,
            "published_value": 41.90116
          },
          {
            "age": 5,
            "year": 2022,
            "survival_pct": 37.40725,
            "published_value": 37.40725
          }
        ],
        "source_table": "2.2",
        "source_row": 636,
        "uf": "MT",
        "name": "Mato Grosso"
      },
      {
        "population": "employer_local_units",
        "geography": "Goiás",
        "geography_level": "state",
        "region": "Centro-Oeste",
        "label": "Total",
        "section": null,
        "cohort_year": 2017,
        "births": 12814,
        "births_published_value": 12814,
        "five_year_survival_pct": 35.67973,
        "curve": [
          {
            "age": 1,
            "year": 2018,
            "survival_pct": 74.75418,
            "published_value": 74.75418
          },
          {
            "age": 2,
            "year": 2019,
            "survival_pct": 58.12393,
            "published_value": 58.12393
          },
          {
            "age": 3,
            "year": 2020,
            "survival_pct": 47.92415,
            "published_value": 47.92415
          },
          {
            "age": 4,
            "year": 2021,
            "survival_pct": 40.9396,
            "published_value": 40.9396
          },
          {
            "age": 5,
            "year": 2022,
            "survival_pct": 35.67973,
            "published_value": 35.67973
          }
        ],
        "source_table": "2.2",
        "source_row": 657,
        "uf": "GO",
        "name": "Goiás"
      },
      {
        "population": "employer_local_units",
        "geography": "Distrito Federal",
        "geography_level": "state",
        "region": "Centro-Oeste",
        "label": "Total",
        "section": null,
        "cohort_year": 2017,
        "births": 6734,
        "births_published_value": 6734,
        "five_year_survival_pct": 32.56608,
        "curve": [
          {
            "age": 1,
            "year": 2018,
            "survival_pct": 75.60143,
            "published_value": 75.60143
          },
          {
            "age": 2,
            "year": 2019,
            "survival_pct": 58.44966,
            "published_value": 58.44966
          },
          {
            "age": 3,
            "year": 2020,
            "survival_pct": 46.139,
            "published_value": 46.139
          },
          {
            "age": 4,
            "year": 2021,
            "survival_pct": 37.77844,
            "published_value": 37.77844
          },
          {
            "age": 5,
            "year": 2022,
            "survival_pct": 32.56608,
            "published_value": 32.56608
          }
        ],
        "source_table": "2.2",
        "source_row": 678,
        "uf": "DF",
        "name": "Distrito Federal"
      }
    ],
    "regions": [
      {
        "population": "employer_local_units",
        "geography": "Norte",
        "geography_level": "region",
        "region": null,
        "label": "Total",
        "section": null,
        "cohort_year": 2017,
        "births": 15490,
        "births_published_value": 15490,
        "five_year_survival_pct": 36.643,
        "curve": [
          {
            "age": 1,
            "year": 2018,
            "survival_pct": 76.35894,
            "published_value": 76.35894
          },
          {
            "age": 2,
            "year": 2019,
            "survival_pct": 59.34797,
            "published_value": 59.34797
          },
          {
            "age": 3,
            "year": 2020,
            "survival_pct": 48.86378,
            "published_value": 48.86378
          },
          {
            "age": 4,
            "year": 2021,
            "survival_pct": 41.40736,
            "published_value": 41.40736
          },
          {
            "age": 5,
            "year": 2022,
            "survival_pct": 36.643,
            "published_value": 36.643
          }
        ],
        "source_table": "2.2",
        "source_row": 27
      },
      {
        "population": "employer_local_units",
        "geography": "Nordeste",
        "geography_level": "region",
        "region": null,
        "label": "Total",
        "section": null,
        "cohort_year": 2017,
        "births": 53173,
        "births_published_value": 53173,
        "five_year_survival_pct": 37.92526,
        "curve": [
          {
            "age": 1,
            "year": 2018,
            "survival_pct": 77.15006,
            "published_value": 77.15006
          },
          {
            "age": 2,
            "year": 2019,
            "survival_pct": 60.66801,
            "published_value": 60.66801
          },
          {
            "age": 3,
            "year": 2020,
            "survival_pct": 50.63472,
            "published_value": 50.63472
          },
          {
            "age": 4,
            "year": 2021,
            "survival_pct": 43.161,
            "published_value": 43.161
          },
          {
            "age": 5,
            "year": 2022,
            "survival_pct": 37.92526,
            "published_value": 37.92526
          }
        ],
        "source_table": "2.2",
        "source_row": 195
      },
      {
        "population": "employer_local_units",
        "geography": "Sudeste",
        "geography_level": "region",
        "region": null,
        "label": "Total",
        "section": null,
        "cohort_year": 2017,
        "births": 135803,
        "births_published_value": 135803,
        "five_year_survival_pct": 38.28781,
        "curve": [
          {
            "age": 1,
            "year": 2018,
            "survival_pct": 77.32451,
            "published_value": 77.32451
          },
          {
            "age": 2,
            "year": 2019,
            "survival_pct": 61.34401,
            "published_value": 61.34401
          },
          {
            "age": 3,
            "year": 2020,
            "survival_pct": 50.7787,
            "published_value": 50.7787
          },
          {
            "age": 4,
            "year": 2021,
            "survival_pct": 43.5226,
            "published_value": 43.5226
          },
          {
            "age": 5,
            "year": 2022,
            "survival_pct": 38.28781,
            "published_value": 38.28781
          }
        ],
        "source_table": "2.2",
        "source_row": 405
      },
      {
        "population": "employer_local_units",
        "geography": "Sul",
        "geography_level": "region",
        "region": null,
        "label": "Total",
        "section": null,
        "cohort_year": 2017,
        "births": 61316,
        "births_published_value": 61316,
        "five_year_survival_pct": 38.30322,
        "curve": [
          {
            "age": 1,
            "year": 2018,
            "survival_pct": 76.36669,
            "published_value": 76.36669
          },
          {
            "age": 2,
            "year": 2019,
            "survival_pct": 60.62039,
            "published_value": 60.62039
          },
          {
            "age": 3,
            "year": 2020,
            "survival_pct": 50.29356,
            "published_value": 50.29356
          },
          {
            "age": 4,
            "year": 2021,
            "survival_pct": 43.39161,
            "published_value": 43.39161
          },
          {
            "age": 5,
            "year": 2022,
            "survival_pct": 38.30322,
            "published_value": 38.30322
          }
        ],
        "source_table": "2.2",
        "source_row": 510
      },
      {
        "population": "employer_local_units",
        "geography": "Centro-Oeste",
        "geography_level": "region",
        "region": null,
        "label": "Total",
        "section": null,
        "cohort_year": 2017,
        "births": 31068,
        "births_published_value": 31068,
        "five_year_survival_pct": 35.55105,
        "curve": [
          {
            "age": 1,
            "year": 2018,
            "survival_pct": 75.1545,
            "published_value": 75.1545
          },
          {
            "age": 2,
            "year": 2019,
            "survival_pct": 58.45565,
            "published_value": 58.45565
          },
          {
            "age": 3,
            "year": 2020,
            "survival_pct": 47.85632,
            "published_value": 47.85632
          },
          {
            "age": 4,
            "year": 2021,
            "survival_pct": 40.52079,
            "published_value": 40.52079
          },
          {
            "age": 5,
            "year": 2022,
            "survival_pct": 35.55105,
            "published_value": 35.55105
          }
        ],
        "source_table": "2.2",
        "source_row": 594
      }
    ],
    "standardised_states": [
      {
        "uf": "RO",
        "name": "Rondônia",
        "population": "employer_local_units",
        "cohort_year": 2017,
        "observation_year": 2022,
        "raw_full_five_year_pct": 36.40671,
        "raw_common_five_year_pct": 36.38352425082027,
        "standardised_five_year_pct": 36.49841025090778,
        "difference_from_national_common_pp": -1.3380239499600464,
        "composition_shift_pp": 0.11488600008750893,
        "full_births": 2744,
        "common_births": 2743,
        "state_cohort_coverage_pct": 99.96355685131195,
        "min_included_sector_births": 8,
        "included_sections": [
          "A",
          "B",
          "C",
          "E",
          "F",
          "G",
          "H",
          "I",
          "J",
          "K",
          "L",
          "M",
          "N",
          "P",
          "Q",
          "R",
          "S"
        ],
        "excluded_sections": [
          "D",
          "O"
        ],
        "sector_support": [
          {
            "section": "A",
            "births": 15,
            "five_year_survival_pct": 46.66667,
            "national_weight_pct": 0.8698495969359716,
            "source_row": 49
          },
          {
            "section": "B",
            "births": 10,
            "five_year_survival_pct": 50,
            "national_weight_pct": 0.1871188086432032,
            "source_row": 50
          },
          {
            "section": "C",
            "births": 170,
            "five_year_survival_pct": 44.11765,
            "national_weight_pct": 7.668499644305688,
            "source_row": 51
          },
          {
            "section": "E",
            "births": 8,
            "five_year_survival_pct": 75,
            "national_weight_pct": 0.2865783555796806,
            "source_row": 53
          },
          {
            "section": "F",
            "births": 144,
            "five_year_survival_pct": 20.13889,
            "national_weight_pct": 6.132776809405165,
            "source_row": 54
          },
          {
            "section": "G",
            "births": 1401,
            "five_year_survival_pct": 35.33191,
            "national_weight_pct": 44.44493144034281,
            "source_row": 55
          },
          {
            "section": "H",
            "births": 128,
            "five_year_survival_pct": 39.0625,
            "national_weight_pct": 5.332380319821445,
            "source_row": 56
          },
          {
            "section": "I",
            "births": 203,
            "five_year_survival_pct": 33.00493,
            "national_weight_pct": 9.943931787608353,
            "source_row": 57
          },
          {
            "section": "J",
            "births": 41,
            "five_year_survival_pct": 39.02439,
            "national_weight_pct": 1.8081408482045023,
            "source_row": 58
          },
          {
            "section": "K",
            "births": 45,
            "five_year_survival_pct": 62.22222,
            "national_weight_pct": 1.3260149088175104,
            "source_row": 59
          },
          {
            "section": "L",
            "births": 9,
            "five_year_survival_pct": 88.88889,
            "national_weight_pct": 1.1493477813778012,
            "source_row": 60
          },
          {
            "section": "M",
            "births": 176,
            "five_year_survival_pct": 37.5,
            "national_weight_pct": 4.67797021608008,
            "source_row": 61
          },
          {
            "section": "N",
            "births": 125,
            "five_year_survival_pct": 32,
            "national_weight_pct": 6.08962148056493,
            "source_row": 62
          },
          {
            "section": "P",
            "births": 40,
            "five_year_survival_pct": 30,
            "national_weight_pct": 2.1756354453596223,
            "source_row": 64
          },
          {
            "section": "Q",
            "births": 156,
            "five_year_survival_pct": 43.58974,
            "national_weight_pct": 4.430838528268426,
            "source_row": 65
          },
          {
            "section": "R",
            "births": 19,
            "five_year_survival_pct": 36.84211,
            "national_weight_pct": 1.2066634524937374,
            "source_row": 66
          },
          {
            "section": "S",
            "births": 53,
            "five_year_survival_pct": 35.84906,
            "national_weight_pct": 2.2697005761910702,
            "source_row": 67
          }
        ],
        "standardised_rank": 19,
        "raw_common_rank": 20,
        "rank_change_vs_raw_common": 1
      },
      {
        "uf": "AC",
        "name": "Acre",
        "population": "employer_local_units",
        "cohort_year": 2017,
        "observation_year": 2022,
        "raw_full_five_year_pct": 34.65909,
        "raw_common_five_year_pct": 34.659088295454545,
        "standardised_five_year_pct": 33.7401556464702,
        "difference_from_national_common_pp": -4.096278554397628,
        "composition_shift_pp": -0.9189326489843452,
        "full_births": 704,
        "common_births": 704,
        "state_cohort_coverage_pct": 100.0,
        "min_included_sector_births": 2,
        "included_sections": [
          "A",
          "B",
          "C",
          "E",
          "F",
          "G",
          "H",
          "I",
          "J",
          "K",
          "L",
          "M",
          "N",
          "P",
          "Q",
          "R",
          "S"
        ],
        "excluded_sections": [
          "D",
          "O"
        ],
        "sector_support": [
          {
            "section": "A",
            "births": 8,
            "five_year_survival_pct": 37.5,
            "national_weight_pct": 0.8698495969359716,
            "source_row": 70
          },
          {
            "section": "B",
            "births": 2,
            "five_year_survival_pct": 0,
            "national_weight_pct": 0.1871188086432032,
            "source_row": 71
          },
          {
            "section": "C",
            "births": 37,
            "five_year_survival_pct": 37.83784,
            "national_weight_pct": 7.668499644305688,
            "source_row": 72
          },
          {
            "section": "E",
            "births": 2,
            "five_year_survival_pct": 100,
            "national_weight_pct": 0.2865783555796806,
            "source_row": 74
          },
          {
            "section": "F",
            "births": 36,
            "five_year_survival_pct": 19.44444,
            "national_weight_pct": 6.132776809405165,
            "source_row": 75
          },
          {
            "section": "G",
            "births": 370,
            "five_year_survival_pct": 34.59459,
            "national_weight_pct": 44.44493144034281,
            "source_row": 76
          },
          {
            "section": "H",
            "births": 14,
            "five_year_survival_pct": 35.71429,
            "national_weight_pct": 5.332380319821445,
            "source_row": 77
          },
          {
            "section": "I",
            "births": 55,
            "five_year_survival_pct": 27.27273,
            "national_weight_pct": 9.943931787608353,
            "source_row": 78
          },
          {
            "section": "J",
            "births": 7,
            "five_year_survival_pct": 42.85714,
            "national_weight_pct": 1.8081408482045023,
            "source_row": 79
          },
          {
            "section": "K",
            "births": 10,
            "five_year_survival_pct": 50,
            "national_weight_pct": 1.3260149088175104,
            "source_row": 80
          },
          {
            "section": "L",
            "births": 4,
            "five_year_survival_pct": 0,
            "national_weight_pct": 1.1493477813778012,
            "source_row": 81
          },
          {
            "section": "M",
            "births": 41,
            "five_year_survival_pct": 39.02439,
            "national_weight_pct": 4.67797021608008,
            "source_row": 82
          },
          {
            "section": "N",
            "births": 36,
            "five_year_survival_pct": 25,
            "national_weight_pct": 6.08962148056493,
            "source_row": 83
          },
          {
            "section": "P",
            "births": 17,
            "five_year_survival_pct": 47.05882,
            "national_weight_pct": 2.1756354453596223,
            "source_row": 85
          },
          {
            "section": "Q",
            "births": 45,
            "five_year_survival_pct": 53.33333,
            "national_weight_pct": 4.430838528268426,
            "source_row": 86
          },
          {
            "section": "R",
            "births": 7,
            "five_year_survival_pct": 28.57143,
            "national_weight_pct": 1.2066634524937374,
            "source_row": 87
          },
          {
            "section": "S",
            "births": 13,
            "five_year_survival_pct": 23.07692,
            "national_weight_pct": 2.2697005761910702,
            "source_row": 88
          }
        ],
        "standardised_rank": 25,
        "raw_common_rank": 25,
        "rank_change_vs_raw_common": 0
      },
      {
        "uf": "AM",
        "name": "Amazonas",
        "population": "employer_local_units",
        "cohort_year": 2017,
        "observation_year": 2022,
        "raw_full_five_year_pct": 35.30557,
        "raw_common_five_year_pct": 35.360626194931776,
        "standardised_five_year_pct": 34.99331856390529,
        "difference_from_national_common_pp": -2.843115636962537,
        "composition_shift_pp": -0.36730763102648467,
        "full_births": 2569,
        "common_births": 2565,
        "state_cohort_coverage_pct": 99.84429739198131,
        "min_included_sector_births": 4,
        "included_sections": [
          "A",
          "B",
          "C",
          "E",
          "F",
          "G",
          "H",
          "I",
          "J",
          "K",
          "L",
          "M",
          "N",
          "P",
          "Q",
          "R",
          "S"
        ],
        "excluded_sections": [
          "D",
          "O"
        ],
        "sector_support": [
          {
            "section": "A",
            "births": 6,
            "five_year_survival_pct": 0,
            "national_weight_pct": 0.8698495969359716,
            "source_row": 91
          },
          {
            "section": "B",
            "births": 4,
            "five_year_survival_pct": 50,
            "national_weight_pct": 0.1871188086432032,
            "source_row": 92
          },
          {
            "section": "C",
            "births": 131,
            "five_year_survival_pct": 36.64122,
            "national_weight_pct": 7.668499644305688,
            "source_row": 93
          },
          {
            "section": "E",
            "births": 5,
            "five_year_survival_pct": 40,
            "national_weight_pct": 0.2865783555796806,
            "source_row": 95
          },
          {
            "section": "F",
            "births": 161,
            "five_year_survival_pct": 20.49689,
            "national_weight_pct": 6.132776809405165,
            "source_row": 96
          },
          {
            "section": "G",
            "births": 1275,
            "five_year_survival_pct": 36.31373,
            "national_weight_pct": 44.44493144034281,
            "source_row": 97
          },
          {
            "section": "H",
            "births": 101,
            "five_year_survival_pct": 44.55446,
            "national_weight_pct": 5.332380319821445,
            "source_row": 98
          },
          {
            "section": "I",
            "births": 231,
            "five_year_survival_pct": 27.70563,
            "national_weight_pct": 9.943931787608353,
            "source_row": 99
          },
          {
            "section": "J",
            "births": 41,
            "five_year_survival_pct": 56.09756,
            "national_weight_pct": 1.8081408482045023,
            "source_row": 100
          },
          {
            "section": "K",
            "births": 16,
            "five_year_survival_pct": 6.25,
            "national_weight_pct": 1.3260149088175104,
            "source_row": 101
          },
          {
            "section": "L",
            "births": 16,
            "five_year_survival_pct": 31.25,
            "national_weight_pct": 1.1493477813778012,
            "source_row": 102
          },
          {
            "section": "M",
            "births": 123,
            "five_year_survival_pct": 29.26829,
            "national_weight_pct": 4.67797021608008,
            "source_row": 103
          },
          {
            "section": "N",
            "births": 184,
            "five_year_survival_pct": 41.30435,
            "national_weight_pct": 6.08962148056493,
            "source_row": 104
          },
          {
            "section": "P",
            "births": 64,
            "five_year_survival_pct": 37.5,
            "national_weight_pct": 2.1756354453596223,
            "source_row": 106
          },
          {
            "section": "Q",
            "births": 146,
            "five_year_survival_pct": 40.41096,
            "national_weight_pct": 4.430838528268426,
            "source_row": 107
          },
          {
            "section": "R",
            "births": 15,
            "five_year_survival_pct": 46.66667,
            "national_weight_pct": 1.2066634524937374,
            "source_row": 108
          },
          {
            "section": "S",
            "births": 46,
            "five_year_survival_pct": 41.30435,
            "national_weight_pct": 2.2697005761910702,
            "source_row": 109
          }
        ],
        "standardised_rank": 23,
        "raw_common_rank": 24,
        "rank_change_vs_raw_common": 1
      },
      {
        "uf": "RR",
        "name": "Roraima",
        "population": "employer_local_units",
        "cohort_year": 2017,
        "observation_year": 2022,
        "raw_full_five_year_pct": 37.69912,
        "raw_common_five_year_pct": 37.69911660176991,
        "standardised_five_year_pct": 36.15184594913065,
        "difference_from_national_common_pp": -1.6845882517371749,
        "composition_shift_pp": -1.5472706526392557,
        "full_births": 565,
        "common_births": 565,
        "state_cohort_coverage_pct": 100.0,
        "min_included_sector_births": 1,
        "included_sections": [
          "A",
          "B",
          "C",
          "E",
          "F",
          "G",
          "H",
          "I",
          "J",
          "K",
          "L",
          "M",
          "N",
          "P",
          "Q",
          "R",
          "S"
        ],
        "excluded_sections": [
          "D",
          "O"
        ],
        "sector_support": [
          {
            "section": "A",
            "births": 1,
            "five_year_survival_pct": 0,
            "national_weight_pct": 0.8698495969359716,
            "source_row": 112
          },
          {
            "section": "B",
            "births": 3,
            "five_year_survival_pct": 33.33333,
            "national_weight_pct": 0.1871188086432032,
            "source_row": 113
          },
          {
            "section": "C",
            "births": 36,
            "five_year_survival_pct": 16.66667,
            "national_weight_pct": 7.668499644305688,
            "source_row": 114
          },
          {
            "section": "E",
            "births": 2,
            "five_year_survival_pct": 0,
            "national_weight_pct": 0.2865783555796806,
            "source_row": 116
          },
          {
            "section": "F",
            "births": 34,
            "five_year_survival_pct": 29.41176,
            "national_weight_pct": 6.132776809405165,
            "source_row": 117
          },
          {
            "section": "G",
            "births": 271,
            "five_year_survival_pct": 37.63838,
            "national_weight_pct": 44.44493144034281,
            "source_row": 118
          },
          {
            "section": "H",
            "births": 16,
            "five_year_survival_pct": 18.75,
            "national_weight_pct": 5.332380319821445,
            "source_row": 119
          },
          {
            "section": "I",
            "births": 65,
            "five_year_survival_pct": 38.46154,
            "national_weight_pct": 9.943931787608353,
            "source_row": 120
          },
          {
            "section": "J",
            "births": 11,
            "five_year_survival_pct": 45.45455,
            "national_weight_pct": 1.8081408482045023,
            "source_row": 121
          },
          {
            "section": "K",
            "births": 6,
            "five_year_survival_pct": 50,
            "national_weight_pct": 1.3260149088175104,
            "source_row": 122
          },
          {
            "section": "L",
            "births": 6,
            "five_year_survival_pct": 50,
            "national_weight_pct": 1.1493477813778012,
            "source_row": 123
          },
          {
            "section": "M",
            "births": 31,
            "five_year_survival_pct": 41.93548,
            "national_weight_pct": 4.67797021608008,
            "source_row": 124
          },
          {
            "section": "N",
            "births": 26,
            "five_year_survival_pct": 26.92308,
            "national_weight_pct": 6.08962148056493,
            "source_row": 125
          },
          {
            "section": "P",
            "births": 8,
            "five_year_survival_pct": 37.5,
            "national_weight_pct": 2.1756354453596223,
            "source_row": 127
          },
          {
            "section": "Q",
            "births": 36,
            "five_year_survival_pct": 69.44444,
            "national_weight_pct": 4.430838528268426,
            "source_row": 128
          },
          {
            "section": "R",
            "births": 5,
            "five_year_survival_pct": 40,
            "national_weight_pct": 1.2066634524937374,
            "source_row": 129
          },
          {
            "section": "S",
            "births": 8,
            "five_year_survival_pct": 62.5,
            "national_weight_pct": 2.2697005761910702,
            "source_row": 130
          }
        ],
        "standardised_rank": 20,
        "raw_common_rank": 13,
        "rank_change_vs_raw_common": -7
      },
      {
        "uf": "PA",
        "name": "Pará",
        "population": "employer_local_units",
        "cohort_year": 2017,
        "observation_year": 2022,
        "raw_full_five_year_pct": 38.97306,
        "raw_common_five_year_pct": 38.88607456877637,
        "standardised_five_year_pct": 38.61557311780393,
        "difference_from_national_common_pp": 0.7791389169361054,
        "composition_shift_pp": -0.2705014509724393,
        "full_births": 5940,
        "common_births": 5925,
        "state_cohort_coverage_pct": 99.74747474747475,
        "min_included_sector_births": 12,
        "included_sections": [
          "A",
          "B",
          "C",
          "E",
          "F",
          "G",
          "H",
          "I",
          "J",
          "K",
          "L",
          "M",
          "N",
          "P",
          "Q",
          "R",
          "S"
        ],
        "excluded_sections": [
          "D",
          "O"
        ],
        "sector_support": [
          {
            "section": "A",
            "births": 68,
            "five_year_survival_pct": 51.47059,
            "national_weight_pct": 0.8698495969359716,
            "source_row": 133
          },
          {
            "section": "B",
            "births": 12,
            "five_year_survival_pct": 58.33333,
            "national_weight_pct": 0.1871188086432032,
            "source_row": 134
          },
          {
            "section": "C",
            "births": 357,
            "five_year_survival_pct": 38.65546,
            "national_weight_pct": 7.668499644305688,
            "source_row": 135
          },
          {
            "section": "E",
            "births": 25,
            "five_year_survival_pct": 24,
            "national_weight_pct": 0.2865783555796806,
            "source_row": 137
          },
          {
            "section": "F",
            "births": 309,
            "five_year_survival_pct": 28.15534,
            "national_weight_pct": 6.132776809405165,
            "source_row": 138
          },
          {
            "section": "G",
            "births": 3181,
            "five_year_survival_pct": 37.75542,
            "national_weight_pct": 44.44493144034281,
            "source_row": 139
          },
          {
            "section": "H",
            "births": 247,
            "five_year_survival_pct": 39.27126,
            "national_weight_pct": 5.332380319821445,
            "source_row": 140
          },
          {
            "section": "I",
            "births": 381,
            "five_year_survival_pct": 31.49606,
            "national_weight_pct": 9.943931787608353,
            "source_row": 141
          },
          {
            "section": "J",
            "births": 71,
            "five_year_survival_pct": 54.92958,
            "national_weight_pct": 1.8081408482045023,
            "source_row": 142
          },
          {
            "section": "K",
            "births": 82,
            "five_year_survival_pct": 65.85366,
            "national_weight_pct": 1.3260149088175104,
            "source_row": 143
          },
          {
            "section": "L",
            "births": 42,
            "five_year_survival_pct": 42.85714,
            "national_weight_pct": 1.1493477813778012,
            "source_row": 144
          },
          {
            "section": "M",
            "births": 260,
            "five_year_survival_pct": 35,
            "national_weight_pct": 4.67797021608008,
            "source_row": 145
          },
          {
            "section": "N",
            "births": 294,
            "five_year_survival_pct": 44.89796,
            "national_weight_pct": 6.08962148056493,
            "source_row": 146
          },
          {
            "section": "P",
            "births": 138,
            "five_year_survival_pct": 49.27536,
            "national_weight_pct": 2.1756354453596223,
            "source_row": 148
          },
          {
            "section": "Q",
            "births": 302,
            "five_year_survival_pct": 52.64901,
            "national_weight_pct": 4.430838528268426,
            "source_row": 149
          },
          {
            "section": "R",
            "births": 56,
            "five_year_survival_pct": 35.71429,
            "national_weight_pct": 1.2066634524937374,
            "source_row": 150
          },
          {
            "section": "S",
            "births": 100,
            "five_year_survival_pct": 32,
            "national_weight_pct": 2.2697005761910702,
            "source_row": 151
          }
        ],
        "standardised_rank": 7,
        "raw_common_rank": 5,
        "rank_change_vs_raw_common": -2
      },
      {
        "uf": "AP",
        "name": "Amapá",
        "population": "employer_local_units",
        "cohort_year": 2017,
        "observation_year": 2022,
        "raw_full_five_year_pct": 27.8607,
        "raw_common_five_year_pct": 27.86069486318408,
        "standardised_five_year_pct": 26.750978535281167,
        "difference_from_national_common_pp": -11.085455665586661,
        "composition_shift_pp": -1.1097163279029125,
        "full_births": 804,
        "common_births": 804,
        "state_cohort_coverage_pct": 100.0,
        "min_included_sector_births": 1,
        "included_sections": [
          "A",
          "B",
          "C",
          "E",
          "F",
          "G",
          "H",
          "I",
          "J",
          "K",
          "L",
          "M",
          "N",
          "P",
          "Q",
          "R",
          "S"
        ],
        "excluded_sections": [
          "D",
          "O"
        ],
        "sector_support": [
          {
            "section": "A",
            "births": 3,
            "five_year_survival_pct": 66.66667,
            "national_weight_pct": 0.8698495969359716,
            "source_row": 154
          },
          {
            "section": "B",
            "births": 2,
            "five_year_survival_pct": 100,
            "national_weight_pct": 0.1871188086432032,
            "source_row": 155
          },
          {
            "section": "C",
            "births": 40,
            "five_year_survival_pct": 15,
            "national_weight_pct": 7.668499644305688,
            "source_row": 156
          },
          {
            "section": "E",
            "births": 1,
            "five_year_survival_pct": 0,
            "national_weight_pct": 0.2865783555796806,
            "source_row": 158
          },
          {
            "section": "F",
            "births": 57,
            "five_year_survival_pct": 26.31579,
            "national_weight_pct": 6.132776809405165,
            "source_row": 159
          },
          {
            "section": "G",
            "births": 428,
            "five_year_survival_pct": 28.50467,
            "national_weight_pct": 44.44493144034281,
            "source_row": 160
          },
          {
            "section": "H",
            "births": 12,
            "five_year_survival_pct": 33.33333,
            "national_weight_pct": 5.332380319821445,
            "source_row": 161
          },
          {
            "section": "I",
            "births": 69,
            "five_year_survival_pct": 15.94203,
            "national_weight_pct": 9.943931787608353,
            "source_row": 162
          },
          {
            "section": "J",
            "births": 10,
            "five_year_survival_pct": 40,
            "national_weight_pct": 1.8081408482045023,
            "source_row": 163
          },
          {
            "section": "K",
            "births": 8,
            "five_year_survival_pct": 0,
            "national_weight_pct": 1.3260149088175104,
            "source_row": 164
          },
          {
            "section": "L",
            "births": 2,
            "five_year_survival_pct": 0,
            "national_weight_pct": 1.1493477813778012,
            "source_row": 165
          },
          {
            "section": "M",
            "births": 23,
            "five_year_survival_pct": 17.3913,
            "national_weight_pct": 4.67797021608008,
            "source_row": 166
          },
          {
            "section": "N",
            "births": 42,
            "five_year_survival_pct": 35.71429,
            "national_weight_pct": 6.08962148056493,
            "source_row": 167
          },
          {
            "section": "P",
            "births": 26,
            "five_year_survival_pct": 34.61538,
            "national_weight_pct": 2.1756354453596223,
            "source_row": 169
          },
          {
            "section": "Q",
            "births": 51,
            "five_year_survival_pct": 47.05882,
            "national_weight_pct": 4.430838528268426,
            "source_row": 170
          },
          {
            "section": "R",
            "births": 13,
            "five_year_survival_pct": 30.76923,
            "national_weight_pct": 1.2066634524937374,
            "source_row": 171
          },
          {
            "section": "S",
            "births": 17,
            "five_year_survival_pct": 11.76471,
            "national_weight_pct": 2.2697005761910702,
            "source_row": 172
          }
        ],
        "standardised_rank": 27,
        "raw_common_rank": 27,
        "rank_change_vs_raw_common": 0
      },
      {
        "uf": "TO",
        "name": "Tocantins",
        "population": "employer_local_units",
        "cohort_year": 2017,
        "observation_year": 2022,
        "raw_full_five_year_pct": 35.7671,
        "raw_common_five_year_pct": 35.76709768946396,
        "standardised_five_year_pct": 34.76235530534081,
        "difference_from_national_common_pp": -3.074078895527016,
        "composition_shift_pp": -1.0047423841231478,
        "full_births": 2164,
        "common_births": 2164,
        "state_cohort_coverage_pct": 100.0,
        "min_included_sector_births": 6,
        "included_sections": [
          "A",
          "B",
          "C",
          "E",
          "F",
          "G",
          "H",
          "I",
          "J",
          "K",
          "L",
          "M",
          "N",
          "P",
          "Q",
          "R",
          "S"
        ],
        "excluded_sections": [
          "D",
          "O"
        ],
        "sector_support": [
          {
            "section": "A",
            "births": 45,
            "five_year_survival_pct": 37.77778,
            "national_weight_pct": 0.8698495969359716,
            "source_row": 175
          },
          {
            "section": "B",
            "births": 6,
            "five_year_survival_pct": 33.33333,
            "national_weight_pct": 0.1871188086432032,
            "source_row": 176
          },
          {
            "section": "C",
            "births": 114,
            "five_year_survival_pct": 31.57895,
            "national_weight_pct": 7.668499644305688,
            "source_row": 177
          },
          {
            "section": "E",
            "births": 9,
            "five_year_survival_pct": 44.44444,
            "national_weight_pct": 0.2865783555796806,
            "source_row": 179
          },
          {
            "section": "F",
            "births": 123,
            "five_year_survival_pct": 20.3252,
            "national_weight_pct": 6.132776809405165,
            "source_row": 180
          },
          {
            "section": "G",
            "births": 1106,
            "five_year_survival_pct": 38.0651,
            "national_weight_pct": 44.44493144034281,
            "source_row": 181
          },
          {
            "section": "H",
            "births": 96,
            "five_year_survival_pct": 28.125,
            "national_weight_pct": 5.332380319821445,
            "source_row": 182
          },
          {
            "section": "I",
            "births": 152,
            "five_year_survival_pct": 25,
            "national_weight_pct": 9.943931787608353,
            "source_row": 183
          },
          {
            "section": "J",
            "births": 24,
            "five_year_survival_pct": 41.66667,
            "national_weight_pct": 1.8081408482045023,
            "source_row": 184
          },
          {
            "section": "K",
            "births": 21,
            "five_year_survival_pct": 57.14286,
            "national_weight_pct": 1.3260149088175104,
            "source_row": 185
          },
          {
            "section": "L",
            "births": 24,
            "five_year_survival_pct": 50,
            "national_weight_pct": 1.1493477813778012,
            "source_row": 186
          },
          {
            "section": "M",
            "births": 127,
            "five_year_survival_pct": 40.94488,
            "national_weight_pct": 4.67797021608008,
            "source_row": 187
          },
          {
            "section": "N",
            "births": 105,
            "five_year_survival_pct": 34.28571,
            "national_weight_pct": 6.08962148056493,
            "source_row": 188
          },
          {
            "section": "P",
            "births": 49,
            "five_year_survival_pct": 26.53061,
            "national_weight_pct": 2.1756354453596223,
            "source_row": 190
          },
          {
            "section": "Q",
            "births": 121,
            "five_year_survival_pct": 47.93388,
            "national_weight_pct": 4.430838528268426,
            "source_row": 191
          },
          {
            "section": "R",
            "births": 12,
            "five_year_survival_pct": 16.66667,
            "national_weight_pct": 1.2066634524937374,
            "source_row": 192
          },
          {
            "section": "S",
            "births": 30,
            "five_year_survival_pct": 30,
            "national_weight_pct": 2.2697005761910702,
            "source_row": 193
          }
        ],
        "standardised_rank": 24,
        "raw_common_rank": 22,
        "rank_change_vs_raw_common": -2
      },
      {
        "uf": "MA",
        "name": "Maranhão",
        "population": "employer_local_units",
        "cohort_year": 2017,
        "observation_year": 2022,
        "raw_full_five_year_pct": 37.88793,
        "raw_common_five_year_pct": 37.8745420219875,
        "standardised_five_year_pct": 37.28493816043668,
        "difference_from_national_common_pp": -0.5514960404311466,
        "composition_shift_pp": -0.5896038615508203,
        "full_births": 4640,
        "common_births": 4639,
        "state_cohort_coverage_pct": 99.97844827586206,
        "min_included_sector_births": 10,
        "included_sections": [
          "A",
          "B",
          "C",
          "E",
          "F",
          "G",
          "H",
          "I",
          "J",
          "K",
          "L",
          "M",
          "N",
          "P",
          "Q",
          "R",
          "S"
        ],
        "excluded_sections": [
          "D",
          "O"
        ],
        "sector_support": [
          {
            "section": "A",
            "births": 48,
            "five_year_survival_pct": 50,
            "national_weight_pct": 0.8698495969359716,
            "source_row": 217
          },
          {
            "section": "B",
            "births": 10,
            "five_year_survival_pct": 40,
            "national_weight_pct": 0.1871188086432032,
            "source_row": 218
          },
          {
            "section": "C",
            "births": 186,
            "five_year_survival_pct": 33.87097,
            "national_weight_pct": 7.668499644305688,
            "source_row": 219
          },
          {
            "section": "E",
            "births": 16,
            "five_year_survival_pct": 25,
            "national_weight_pct": 0.2865783555796806,
            "source_row": 221
          },
          {
            "section": "F",
            "births": 248,
            "five_year_survival_pct": 28.22581,
            "national_weight_pct": 6.132776809405165,
            "source_row": 222
          },
          {
            "section": "G",
            "births": 2629,
            "five_year_survival_pct": 38.2655,
            "national_weight_pct": 44.44493144034281,
            "source_row": 223
          },
          {
            "section": "H",
            "births": 137,
            "five_year_survival_pct": 33.57664,
            "national_weight_pct": 5.332380319821445,
            "source_row": 224
          },
          {
            "section": "I",
            "births": 303,
            "five_year_survival_pct": 34.32343,
            "national_weight_pct": 9.943931787608353,
            "source_row": 225
          },
          {
            "section": "J",
            "births": 73,
            "five_year_survival_pct": 54.79452,
            "national_weight_pct": 1.8081408482045023,
            "source_row": 226
          },
          {
            "section": "K",
            "births": 42,
            "five_year_survival_pct": 42.85714,
            "national_weight_pct": 1.3260149088175104,
            "source_row": 227
          },
          {
            "section": "L",
            "births": 40,
            "five_year_survival_pct": 40,
            "national_weight_pct": 1.1493477813778012,
            "source_row": 228
          },
          {
            "section": "M",
            "births": 177,
            "five_year_survival_pct": 32.20339,
            "national_weight_pct": 4.67797021608008,
            "source_row": 229
          },
          {
            "section": "N",
            "births": 213,
            "five_year_survival_pct": 42.25352,
            "national_weight_pct": 6.08962148056493,
            "source_row": 230
          },
          {
            "section": "P",
            "births": 99,
            "five_year_survival_pct": 37.37374,
            "national_weight_pct": 2.1756354453596223,
            "source_row": 232
          },
          {
            "section": "Q",
            "births": 270,
            "five_year_survival_pct": 48.14815,
            "national_weight_pct": 4.430838528268426,
            "source_row": 233
          },
          {
            "section": "R",
            "births": 55,
            "five_year_survival_pct": 38.18182,
            "national_weight_pct": 1.2066634524937374,
            "source_row": 234
          },
          {
            "section": "S",
            "births": 93,
            "five_year_survival_pct": 29.03226,
            "national_weight_pct": 2.2697005761910702,
            "source_row": 235
          }
        ],
        "standardised_rank": 15,
        "raw_common_rank": 11,
        "rank_change_vs_raw_common": -4
      },
      {
        "uf": "PI",
        "name": "Piauí",
        "population": "employer_local_units",
        "cohort_year": 2017,
        "observation_year": 2022,
        "raw_full_five_year_pct": 39.91359,
        "raw_common_five_year_pct": 39.91359269192423,
        "standardised_five_year_pct": 39.35091810773997,
        "difference_from_national_common_pp": 1.5144839068721438,
        "composition_shift_pp": -0.5626745841842578,
        "full_births": 3009,
        "common_births": 3009,
        "state_cohort_coverage_pct": 100.0,
        "min_included_sector_births": 7,
        "included_sections": [
          "A",
          "B",
          "C",
          "E",
          "F",
          "G",
          "H",
          "I",
          "J",
          "K",
          "L",
          "M",
          "N",
          "P",
          "Q",
          "R",
          "S"
        ],
        "excluded_sections": [
          "D",
          "O"
        ],
        "sector_support": [
          {
            "section": "A",
            "births": 31,
            "five_year_survival_pct": 38.70968,
            "national_weight_pct": 0.8698495969359716,
            "source_row": 238
          },
          {
            "section": "B",
            "births": 7,
            "five_year_survival_pct": 42.85714,
            "national_weight_pct": 0.1871188086432032,
            "source_row": 239
          },
          {
            "section": "C",
            "births": 177,
            "five_year_survival_pct": 42.93785,
            "national_weight_pct": 7.668499644305688,
            "source_row": 240
          },
          {
            "section": "E",
            "births": 10,
            "five_year_survival_pct": 40,
            "national_weight_pct": 0.2865783555796806,
            "source_row": 242
          },
          {
            "section": "F",
            "births": 162,
            "five_year_survival_pct": 31.48148,
            "national_weight_pct": 6.132776809405165,
            "source_row": 243
          },
          {
            "section": "G",
            "births": 1612,
            "five_year_survival_pct": 41.067,
            "national_weight_pct": 44.44493144034281,
            "source_row": 244
          },
          {
            "section": "H",
            "births": 75,
            "five_year_survival_pct": 25.33333,
            "national_weight_pct": 5.332380319821445,
            "source_row": 245
          },
          {
            "section": "I",
            "births": 275,
            "five_year_survival_pct": 33.81818,
            "national_weight_pct": 9.943931787608353,
            "source_row": 246
          },
          {
            "section": "J",
            "births": 43,
            "five_year_survival_pct": 53.48837,
            "national_weight_pct": 1.8081408482045023,
            "source_row": 247
          },
          {
            "section": "K",
            "births": 14,
            "five_year_survival_pct": 50,
            "national_weight_pct": 1.3260149088175104,
            "source_row": 248
          },
          {
            "section": "L",
            "births": 16,
            "five_year_survival_pct": 43.75,
            "national_weight_pct": 1.1493477813778012,
            "source_row": 249
          },
          {
            "section": "M",
            "births": 115,
            "five_year_survival_pct": 39.13043,
            "national_weight_pct": 4.67797021608008,
            "source_row": 250
          },
          {
            "section": "N",
            "births": 122,
            "five_year_survival_pct": 40.16393,
            "national_weight_pct": 6.08962148056493,
            "source_row": 251
          },
          {
            "section": "P",
            "births": 57,
            "five_year_survival_pct": 47.36842,
            "national_weight_pct": 2.1756354453596223,
            "source_row": 253
          },
          {
            "section": "Q",
            "births": 183,
            "five_year_survival_pct": 53.00546,
            "national_weight_pct": 4.430838528268426,
            "source_row": 254
          },
          {
            "section": "R",
            "births": 49,
            "five_year_survival_pct": 20.40816,
            "national_weight_pct": 1.2066634524937374,
            "source_row": 255
          },
          {
            "section": "S",
            "births": 61,
            "five_year_survival_pct": 26.22951,
            "national_weight_pct": 2.2697005761910702,
            "source_row": 256
          }
        ],
        "standardised_rank": 4,
        "raw_common_rank": 4,
        "rank_change_vs_raw_common": 0
      },
      {
        "uf": "CE",
        "name": "Ceará",
        "population": "employer_local_units",
        "cohort_year": 2017,
        "observation_year": 2022,
        "raw_full_five_year_pct": 37.72613,
        "raw_common_five_year_pct": 37.751510672786715,
        "standardised_five_year_pct": 37.645630750194705,
        "difference_from_national_common_pp": -0.19080345067312265,
        "composition_shift_pp": -0.10587992259200973,
        "full_births": 7960,
        "common_births": 7952,
        "state_cohort_coverage_pct": 99.89949748743719,
        "min_included_sector_births": 17,
        "included_sections": [
          "A",
          "B",
          "C",
          "E",
          "F",
          "G",
          "H",
          "I",
          "J",
          "K",
          "L",
          "M",
          "N",
          "P",
          "Q",
          "R",
          "S"
        ],
        "excluded_sections": [
          "D",
          "O"
        ],
        "sector_support": [
          {
            "section": "A",
            "births": 54,
            "five_year_survival_pct": 42.59259,
            "national_weight_pct": 0.8698495969359716,
            "source_row": 259
          },
          {
            "section": "B",
            "births": 17,
            "five_year_survival_pct": 41.17647,
            "national_weight_pct": 0.1871188086432032,
            "source_row": 260
          },
          {
            "section": "C",
            "births": 691,
            "five_year_survival_pct": 39.65268,
            "national_weight_pct": 7.668499644305688,
            "source_row": 261
          },
          {
            "section": "E",
            "births": 27,
            "five_year_survival_pct": 66.66667,
            "national_weight_pct": 0.2865783555796806,
            "source_row": 263
          },
          {
            "section": "F",
            "births": 449,
            "five_year_survival_pct": 26.72606,
            "national_weight_pct": 6.132776809405165,
            "source_row": 264
          },
          {
            "section": "G",
            "births": 3620,
            "five_year_survival_pct": 37.29282,
            "national_weight_pct": 44.44493144034281,
            "source_row": 265
          },
          {
            "section": "H",
            "births": 289,
            "five_year_survival_pct": 36.6782,
            "national_weight_pct": 5.332380319821445,
            "source_row": 266
          },
          {
            "section": "I",
            "births": 772,
            "five_year_survival_pct": 31.34715,
            "national_weight_pct": 9.943931787608353,
            "source_row": 267
          },
          {
            "section": "J",
            "births": 164,
            "five_year_survival_pct": 49.39024,
            "national_weight_pct": 1.8081408482045023,
            "source_row": 268
          },
          {
            "section": "K",
            "births": 87,
            "five_year_survival_pct": 41.37931,
            "national_weight_pct": 1.3260149088175104,
            "source_row": 269
          },
          {
            "section": "L",
            "births": 100,
            "five_year_survival_pct": 39,
            "national_weight_pct": 1.1493477813778012,
            "source_row": 270
          },
          {
            "section": "M",
            "births": 378,
            "five_year_survival_pct": 37.83069,
            "national_weight_pct": 4.67797021608008,
            "source_row": 271
          },
          {
            "section": "N",
            "births": 484,
            "five_year_survival_pct": 40.49587,
            "national_weight_pct": 6.08962148056493,
            "source_row": 272
          },
          {
            "section": "P",
            "births": 184,
            "five_year_survival_pct": 47.28261,
            "national_weight_pct": 2.1756354453596223,
            "source_row": 274
          },
          {
            "section": "Q",
            "births": 329,
            "five_year_survival_pct": 50.15198,
            "national_weight_pct": 4.430838528268426,
            "source_row": 275
          },
          {
            "section": "R",
            "births": 105,
            "five_year_survival_pct": 40,
            "national_weight_pct": 1.2066634524937374,
            "source_row": 276
          },
          {
            "section": "S",
            "births": 202,
            "five_year_survival_pct": 36.13861,
            "national_weight_pct": 2.2697005761910702,
            "source_row": 277
          }
        ],
        "standardised_rank": 11,
        "raw_common_rank": 12,
        "rank_change_vs_raw_common": 1
      },
      {
        "uf": "RN",
        "name": "Rio Grande do Norte",
        "population": "employer_local_units",
        "cohort_year": 2017,
        "observation_year": 2022,
        "raw_full_five_year_pct": 36.92121,
        "raw_common_five_year_pct": 36.983973108305,
        "standardised_five_year_pct": 37.37137065498326,
        "difference_from_national_common_pp": -0.46506354588456844,
        "composition_shift_pp": 0.3873975466782582,
        "full_births": 4125,
        "common_births": 4118,
        "state_cohort_coverage_pct": 99.83030303030303,
        "min_included_sector_births": 17,
        "included_sections": [
          "A",
          "B",
          "C",
          "E",
          "F",
          "G",
          "H",
          "I",
          "J",
          "K",
          "L",
          "M",
          "N",
          "P",
          "Q",
          "R",
          "S"
        ],
        "excluded_sections": [
          "D",
          "O"
        ],
        "sector_support": [
          {
            "section": "A",
            "births": 65,
            "five_year_survival_pct": 55.38462,
            "national_weight_pct": 0.8698495969359716,
            "source_row": 280
          },
          {
            "section": "B",
            "births": 17,
            "five_year_survival_pct": 35.29412,
            "national_weight_pct": 0.1871188086432032,
            "source_row": 281
          },
          {
            "section": "C",
            "births": 324,
            "five_year_survival_pct": 38.88889,
            "national_weight_pct": 7.668499644305688,
            "source_row": 282
          },
          {
            "section": "E",
            "births": 29,
            "five_year_survival_pct": 58.62069,
            "national_weight_pct": 0.2865783555796806,
            "source_row": 284
          },
          {
            "section": "F",
            "births": 298,
            "five_year_survival_pct": 22.48322,
            "national_weight_pct": 6.132776809405165,
            "source_row": 285
          },
          {
            "section": "G",
            "births": 1927,
            "five_year_survival_pct": 36.37779,
            "national_weight_pct": 44.44493144034281,
            "source_row": 286
          },
          {
            "section": "H",
            "births": 84,
            "five_year_survival_pct": 45.2381,
            "national_weight_pct": 5.332380319821445,
            "source_row": 287
          },
          {
            "section": "I",
            "births": 422,
            "five_year_survival_pct": 28.90995,
            "national_weight_pct": 9.943931787608353,
            "source_row": 288
          },
          {
            "section": "J",
            "births": 57,
            "five_year_survival_pct": 45.61404,
            "national_weight_pct": 1.8081408482045023,
            "source_row": 289
          },
          {
            "section": "K",
            "births": 50,
            "five_year_survival_pct": 38,
            "national_weight_pct": 1.3260149088175104,
            "source_row": 290
          },
          {
            "section": "L",
            "births": 59,
            "five_year_survival_pct": 49.15254,
            "national_weight_pct": 1.1493477813778012,
            "source_row": 291
          },
          {
            "section": "M",
            "births": 143,
            "five_year_survival_pct": 38.46154,
            "national_weight_pct": 4.67797021608008,
            "source_row": 292
          },
          {
            "section": "N",
            "births": 218,
            "five_year_survival_pct": 36.23853,
            "national_weight_pct": 6.08962148056493,
            "source_row": 293
          },
          {
            "section": "P",
            "births": 82,
            "five_year_survival_pct": 52.43902,
            "national_weight_pct": 2.1756354453596223,
            "source_row": 295
          },
          {
            "section": "Q",
            "births": 165,
            "five_year_survival_pct": 57.57576,
            "national_weight_pct": 4.430838528268426,
            "source_row": 296
          },
          {
            "section": "R",
            "births": 64,
            "five_year_survival_pct": 39.0625,
            "national_weight_pct": 1.2066634524937374,
            "source_row": 297
          },
          {
            "section": "S",
            "births": 114,
            "five_year_survival_pct": 34.21053,
            "national_weight_pct": 2.2697005761910702,
            "source_row": 298
          }
        ],
        "standardised_rank": 13,
        "raw_common_rank": 17,
        "rank_change_vs_raw_common": 4
      },
      {
        "uf": "PB",
        "name": "Paraíba",
        "population": "employer_local_units",
        "cohort_year": 2017,
        "observation_year": 2022,
        "raw_full_five_year_pct": 40.15173,
        "raw_common_five_year_pct": 40.151728033155386,
        "standardised_five_year_pct": 40.213884902748795,
        "difference_from_national_common_pp": 2.377450701880967,
        "composition_shift_pp": 0.062156869593408715,
        "full_births": 3559,
        "common_births": 3559,
        "state_cohort_coverage_pct": 100.0,
        "min_included_sector_births": 6,
        "included_sections": [
          "A",
          "B",
          "C",
          "E",
          "F",
          "G",
          "H",
          "I",
          "J",
          "K",
          "L",
          "M",
          "N",
          "P",
          "Q",
          "R",
          "S"
        ],
        "excluded_sections": [
          "D",
          "O"
        ],
        "sector_support": [
          {
            "section": "A",
            "births": 22,
            "five_year_survival_pct": 54.54545,
            "national_weight_pct": 0.8698495969359716,
            "source_row": 301
          },
          {
            "section": "B",
            "births": 6,
            "five_year_survival_pct": 50,
            "national_weight_pct": 0.1871188086432032,
            "source_row": 302
          },
          {
            "section": "C",
            "births": 244,
            "five_year_survival_pct": 40.57377,
            "national_weight_pct": 7.668499644305688,
            "source_row": 303
          },
          {
            "section": "E",
            "births": 12,
            "five_year_survival_pct": 33.33333,
            "national_weight_pct": 0.2865783555796806,
            "source_row": 305
          },
          {
            "section": "F",
            "births": 300,
            "five_year_survival_pct": 23.66667,
            "national_weight_pct": 6.132776809405165,
            "source_row": 306
          },
          {
            "section": "G",
            "births": 1715,
            "five_year_survival_pct": 39.88338,
            "national_weight_pct": 44.44493144034281,
            "source_row": 307
          },
          {
            "section": "H",
            "births": 86,
            "five_year_survival_pct": 32.55814,
            "national_weight_pct": 5.332380319821445,
            "source_row": 308
          },
          {
            "section": "I",
            "births": 315,
            "five_year_survival_pct": 36.50794,
            "national_weight_pct": 9.943931787608353,
            "source_row": 309
          },
          {
            "section": "J",
            "births": 74,
            "five_year_survival_pct": 58.10811,
            "national_weight_pct": 1.8081408482045023,
            "source_row": 310
          },
          {
            "section": "K",
            "births": 49,
            "five_year_survival_pct": 51.02041,
            "national_weight_pct": 1.3260149088175104,
            "source_row": 311
          },
          {
            "section": "L",
            "births": 35,
            "five_year_survival_pct": 31.42857,
            "national_weight_pct": 1.1493477813778012,
            "source_row": 312
          },
          {
            "section": "M",
            "births": 125,
            "five_year_survival_pct": 40,
            "national_weight_pct": 4.67797021608008,
            "source_row": 313
          },
          {
            "section": "N",
            "births": 191,
            "five_year_survival_pct": 46.0733,
            "national_weight_pct": 6.08962148056493,
            "source_row": 314
          },
          {
            "section": "P",
            "births": 91,
            "five_year_survival_pct": 45.05495,
            "national_weight_pct": 2.1756354453596223,
            "source_row": 316
          },
          {
            "section": "Q",
            "births": 170,
            "five_year_survival_pct": 60.58824,
            "national_weight_pct": 4.430838528268426,
            "source_row": 317
          },
          {
            "section": "R",
            "births": 36,
            "five_year_survival_pct": 44.44444,
            "national_weight_pct": 1.2066634524937374,
            "source_row": 318
          },
          {
            "section": "S",
            "births": 88,
            "five_year_survival_pct": 40.90909,
            "national_weight_pct": 2.2697005761910702,
            "source_row": 319
          }
        ],
        "standardised_rank": 2,
        "raw_common_rank": 2,
        "rank_change_vs_raw_common": 0
      },
      {
        "uf": "PE",
        "name": "Pernambuco",
        "population": "employer_local_units",
        "cohort_year": 2017,
        "observation_year": 2022,
        "raw_full_five_year_pct": 37.87161,
        "raw_common_five_year_pct": 37.877156835129306,
        "standardised_five_year_pct": 37.82716788208481,
        "difference_from_national_common_pp": -0.009266318783019756,
        "composition_shift_pp": -0.049988953044497464,
        "full_births": 9284,
        "common_births": 9280,
        "state_cohort_coverage_pct": 99.9569151227919,
        "min_included_sector_births": 11,
        "included_sections": [
          "A",
          "B",
          "C",
          "E",
          "F",
          "G",
          "H",
          "I",
          "J",
          "K",
          "L",
          "M",
          "N",
          "P",
          "Q",
          "R",
          "S"
        ],
        "excluded_sections": [
          "D",
          "O"
        ],
        "sector_support": [
          {
            "section": "A",
            "births": 49,
            "five_year_survival_pct": 51.02041,
            "national_weight_pct": 0.8698495969359716,
            "source_row": 322
          },
          {
            "section": "B",
            "births": 11,
            "five_year_survival_pct": 45.45455,
            "national_weight_pct": 0.1871188086432032,
            "source_row": 323
          },
          {
            "section": "C",
            "births": 736,
            "five_year_survival_pct": 39.67391,
            "national_weight_pct": 7.668499644305688,
            "source_row": 324
          },
          {
            "section": "E",
            "births": 33,
            "five_year_survival_pct": 39.39394,
            "national_weight_pct": 0.2865783555796806,
            "source_row": 326
          },
          {
            "section": "F",
            "births": 418,
            "five_year_survival_pct": 24.64115,
            "national_weight_pct": 6.132776809405165,
            "source_row": 327
          },
          {
            "section": "G",
            "births": 4530,
            "five_year_survival_pct": 36.35762,
            "national_weight_pct": 44.44493144034281,
            "source_row": 328
          },
          {
            "section": "H",
            "births": 356,
            "five_year_survival_pct": 39.32584,
            "national_weight_pct": 5.332380319821445,
            "source_row": 329
          },
          {
            "section": "I",
            "births": 898,
            "five_year_survival_pct": 32.85078,
            "national_weight_pct": 9.943931787608353,
            "source_row": 330
          },
          {
            "section": "J",
            "births": 165,
            "five_year_survival_pct": 40.60606,
            "national_weight_pct": 1.8081408482045023,
            "source_row": 331
          },
          {
            "section": "K",
            "births": 105,
            "five_year_survival_pct": 57.14286,
            "national_weight_pct": 1.3260149088175104,
            "source_row": 332
          },
          {
            "section": "L",
            "births": 102,
            "five_year_survival_pct": 49.01961,
            "national_weight_pct": 1.1493477813778012,
            "source_row": 333
          },
          {
            "section": "M",
            "births": 410,
            "five_year_survival_pct": 38.78049,
            "national_weight_pct": 4.67797021608008,
            "source_row": 334
          },
          {
            "section": "N",
            "births": 480,
            "five_year_survival_pct": 40.20833,
            "national_weight_pct": 6.08962148056493,
            "source_row": 335
          },
          {
            "section": "P",
            "births": 222,
            "five_year_survival_pct": 49.0991,
            "national_weight_pct": 2.1756354453596223,
            "source_row": 337
          },
          {
            "section": "Q",
            "births": 416,
            "five_year_survival_pct": 57.93269,
            "national_weight_pct": 4.430838528268426,
            "source_row": 338
          },
          {
            "section": "R",
            "births": 120,
            "five_year_survival_pct": 35.83333,
            "national_weight_pct": 1.2066634524937374,
            "source_row": 339
          },
          {
            "section": "S",
            "births": 229,
            "five_year_survival_pct": 31.87773,
            "national_weight_pct": 2.2697005761910702,
            "source_row": 340
          }
        ],
        "standardised_rank": 10,
        "raw_common_rank": 10,
        "rank_change_vs_raw_common": 0
      },
      {
        "uf": "AL",
        "name": "Alagoas",
        "population": "employer_local_units",
        "cohort_year": 2017,
        "observation_year": 2022,
        "raw_full_five_year_pct": 35.8265,
        "raw_common_five_year_pct": 35.83874359070721,
        "standardised_five_year_pct": 35.68342622215554,
        "difference_from_national_common_pp": -2.1530079787122887,
        "composition_shift_pp": -0.1553173685516711,
        "full_births": 2928,
        "common_births": 2927,
        "state_cohort_coverage_pct": 99.96584699453553,
        "min_included_sector_births": 2,
        "included_sections": [
          "A",
          "B",
          "C",
          "E",
          "F",
          "G",
          "H",
          "I",
          "J",
          "K",
          "L",
          "M",
          "N",
          "P",
          "Q",
          "R",
          "S"
        ],
        "excluded_sections": [
          "D",
          "O"
        ],
        "sector_support": [
          {
            "section": "A",
            "births": 15,
            "five_year_survival_pct": 53.33333,
            "national_weight_pct": 0.8698495969359716,
            "source_row": 343
          },
          {
            "section": "B",
            "births": 2,
            "five_year_survival_pct": 0,
            "national_weight_pct": 0.1871188086432032,
            "source_row": 344
          },
          {
            "section": "C",
            "births": 184,
            "five_year_survival_pct": 31.52174,
            "national_weight_pct": 7.668499644305688,
            "source_row": 345
          },
          {
            "section": "E",
            "births": 13,
            "five_year_survival_pct": 30.76923,
            "national_weight_pct": 0.2865783555796806,
            "source_row": 347
          },
          {
            "section": "F",
            "births": 152,
            "five_year_survival_pct": 26.97368,
            "national_weight_pct": 6.132776809405165,
            "source_row": 348
          },
          {
            "section": "G",
            "births": 1454,
            "five_year_survival_pct": 34.663,
            "national_weight_pct": 44.44493144034281,
            "source_row": 349
          },
          {
            "section": "H",
            "births": 109,
            "five_year_survival_pct": 27.52294,
            "national_weight_pct": 5.332380319821445,
            "source_row": 350
          },
          {
            "section": "I",
            "births": 302,
            "five_year_survival_pct": 32.78146,
            "national_weight_pct": 9.943931787608353,
            "source_row": 351
          },
          {
            "section": "J",
            "births": 63,
            "five_year_survival_pct": 42.85714,
            "national_weight_pct": 1.8081408482045023,
            "source_row": 352
          },
          {
            "section": "K",
            "births": 36,
            "five_year_survival_pct": 30.55556,
            "national_weight_pct": 1.3260149088175104,
            "source_row": 353
          },
          {
            "section": "L",
            "births": 21,
            "five_year_survival_pct": 61.90476,
            "national_weight_pct": 1.1493477813778012,
            "source_row": 354
          },
          {
            "section": "M",
            "births": 102,
            "five_year_survival_pct": 42.15686,
            "national_weight_pct": 4.67797021608008,
            "source_row": 355
          },
          {
            "section": "N",
            "births": 150,
            "five_year_survival_pct": 40.66667,
            "national_weight_pct": 6.08962148056493,
            "source_row": 356
          },
          {
            "section": "P",
            "births": 92,
            "five_year_survival_pct": 46.73913,
            "national_weight_pct": 2.1756354453596223,
            "source_row": 358
          },
          {
            "section": "Q",
            "births": 138,
            "five_year_survival_pct": 52.17391,
            "national_weight_pct": 4.430838528268426,
            "source_row": 359
          },
          {
            "section": "R",
            "births": 41,
            "five_year_survival_pct": 43.90244,
            "national_weight_pct": 1.2066634524937374,
            "source_row": 360
          },
          {
            "section": "S",
            "births": 53,
            "five_year_survival_pct": 32.07547,
            "national_weight_pct": 2.2697005761910702,
            "source_row": 361
          }
        ],
        "standardised_rank": 21,
        "raw_common_rank": 21,
        "rank_change_vs_raw_common": 0
      },
      {
        "uf": "SE",
        "name": "Sergipe",
        "population": "employer_local_units",
        "cohort_year": 2017,
        "observation_year": 2022,
        "raw_full_five_year_pct": 40.45734,
        "raw_common_five_year_pct": 40.40492882042253,
        "standardised_five_year_pct": 40.43190874883261,
        "difference_from_national_common_pp": 2.595474547964784,
        "composition_shift_pp": 0.026979928410078458,
        "full_births": 2274,
        "common_births": 2272,
        "state_cohort_coverage_pct": 99.91204925241864,
        "min_included_sector_births": 4,
        "included_sections": [
          "A",
          "B",
          "C",
          "E",
          "F",
          "G",
          "H",
          "I",
          "J",
          "K",
          "L",
          "M",
          "N",
          "P",
          "Q",
          "R",
          "S"
        ],
        "excluded_sections": [
          "D",
          "O"
        ],
        "sector_support": [
          {
            "section": "A",
            "births": 15,
            "five_year_survival_pct": 40,
            "national_weight_pct": 0.8698495969359716,
            "source_row": 364
          },
          {
            "section": "B",
            "births": 8,
            "five_year_survival_pct": 25,
            "national_weight_pct": 0.1871188086432032,
            "source_row": 365
          },
          {
            "section": "C",
            "births": 119,
            "five_year_survival_pct": 47.05882,
            "national_weight_pct": 7.668499644305688,
            "source_row": 366
          },
          {
            "section": "E",
            "births": 4,
            "five_year_survival_pct": 0,
            "national_weight_pct": 0.2865783555796806,
            "source_row": 368
          },
          {
            "section": "F",
            "births": 141,
            "five_year_survival_pct": 26.95035,
            "national_weight_pct": 6.132776809405165,
            "source_row": 369
          },
          {
            "section": "G",
            "births": 1062,
            "five_year_survival_pct": 40.86629,
            "national_weight_pct": 44.44493144034281,
            "source_row": 370
          },
          {
            "section": "H",
            "births": 80,
            "five_year_survival_pct": 38.75,
            "national_weight_pct": 5.332380319821445,
            "source_row": 371
          },
          {
            "section": "I",
            "births": 190,
            "five_year_survival_pct": 29.47368,
            "national_weight_pct": 9.943931787608353,
            "source_row": 372
          },
          {
            "section": "J",
            "births": 52,
            "five_year_survival_pct": 42.30769,
            "national_weight_pct": 1.8081408482045023,
            "source_row": 373
          },
          {
            "section": "K",
            "births": 25,
            "five_year_survival_pct": 60,
            "national_weight_pct": 1.3260149088175104,
            "source_row": 374
          },
          {
            "section": "L",
            "births": 25,
            "five_year_survival_pct": 52,
            "national_weight_pct": 1.1493477813778012,
            "source_row": 375
          },
          {
            "section": "M",
            "births": 139,
            "five_year_survival_pct": 43.88489,
            "national_weight_pct": 4.67797021608008,
            "source_row": 376
          },
          {
            "section": "N",
            "births": 147,
            "five_year_survival_pct": 38.09524,
            "national_weight_pct": 6.08962148056493,
            "source_row": 377
          },
          {
            "section": "P",
            "births": 68,
            "five_year_survival_pct": 51.47059,
            "national_weight_pct": 2.1756354453596223,
            "source_row": 379
          },
          {
            "section": "Q",
            "births": 91,
            "five_year_survival_pct": 60.43956,
            "national_weight_pct": 4.430838528268426,
            "source_row": 380
          },
          {
            "section": "R",
            "births": 46,
            "five_year_survival_pct": 28.26087,
            "national_weight_pct": 1.2066634524937374,
            "source_row": 381
          },
          {
            "section": "S",
            "births": 60,
            "five_year_survival_pct": 41.66667,
            "national_weight_pct": 2.2697005761910702,
            "source_row": 382
          }
        ],
        "standardised_rank": 1,
        "raw_common_rank": 1,
        "rank_change_vs_raw_common": 0
      },
      {
        "uf": "BA",
        "name": "Bahia",
        "population": "employer_local_units",
        "cohort_year": 2017,
        "observation_year": 2022,
        "raw_full_five_year_pct": 37.46265,
        "raw_common_five_year_pct": 37.447997586453454,
        "standardised_five_year_pct": 37.29963858109999,
        "difference_from_national_common_pp": -0.5367956197678367,
        "composition_shift_pp": -0.1483590053534627,
        "full_births": 15394,
        "common_births": 15384,
        "state_cohort_coverage_pct": 99.93503962582824,
        "min_included_sector_births": 42,
        "included_sections": [
          "A",
          "B",
          "C",
          "E",
          "F",
          "G",
          "H",
          "I",
          "J",
          "K",
          "L",
          "M",
          "N",
          "P",
          "Q",
          "R",
          "S"
        ],
        "excluded_sections": [
          "D",
          "O"
        ],
        "sector_support": [
          {
            "section": "A",
            "births": 156,
            "five_year_survival_pct": 39.10256,
            "national_weight_pct": 0.8698495969359716,
            "source_row": 385
          },
          {
            "section": "B",
            "births": 65,
            "five_year_survival_pct": 32.30769,
            "national_weight_pct": 0.1871188086432032,
            "source_row": 386
          },
          {
            "section": "C",
            "births": 901,
            "five_year_survival_pct": 39.17869,
            "national_weight_pct": 7.668499644305688,
            "source_row": 387
          },
          {
            "section": "E",
            "births": 42,
            "five_year_survival_pct": 33.33333,
            "national_weight_pct": 0.2865783555796806,
            "source_row": 389
          },
          {
            "section": "F",
            "births": 818,
            "five_year_survival_pct": 24.20538,
            "national_weight_pct": 6.132776809405165,
            "source_row": 390
          },
          {
            "section": "G",
            "births": 7901,
            "five_year_survival_pct": 37.21048,
            "national_weight_pct": 44.44493144034281,
            "source_row": 391
          },
          {
            "section": "H",
            "births": 619,
            "five_year_survival_pct": 33.11793,
            "national_weight_pct": 5.332380319821445,
            "source_row": 392
          },
          {
            "section": "I",
            "births": 1351,
            "five_year_survival_pct": 31.23612,
            "national_weight_pct": 9.943931787608353,
            "source_row": 393
          },
          {
            "section": "J",
            "births": 252,
            "five_year_survival_pct": 48.01587,
            "national_weight_pct": 1.8081408482045023,
            "source_row": 394
          },
          {
            "section": "K",
            "births": 126,
            "five_year_survival_pct": 38.88889,
            "national_weight_pct": 1.3260149088175104,
            "source_row": 395
          },
          {
            "section": "L",
            "births": 117,
            "five_year_survival_pct": 42.73504,
            "national_weight_pct": 1.1493477813778012,
            "source_row": 396
          },
          {
            "section": "M",
            "births": 676,
            "five_year_survival_pct": 41.12426,
            "national_weight_pct": 4.67797021608008,
            "source_row": 397
          },
          {
            "section": "N",
            "births": 800,
            "five_year_survival_pct": 43.375,
            "national_weight_pct": 6.08962148056493,
            "source_row": 398
          },
          {
            "section": "P",
            "births": 352,
            "five_year_survival_pct": 40.625,
            "national_weight_pct": 2.1756354453596223,
            "source_row": 400
          },
          {
            "section": "Q",
            "births": 733,
            "five_year_survival_pct": 54.43383,
            "national_weight_pct": 4.430838528268426,
            "source_row": 401
          },
          {
            "section": "R",
            "births": 179,
            "five_year_survival_pct": 35.19553,
            "national_weight_pct": 1.2066634524937374,
            "source_row": 402
          },
          {
            "section": "S",
            "births": 296,
            "five_year_survival_pct": 32.77027,
            "national_weight_pct": 2.2697005761910702,
            "source_row": 403
          }
        ],
        "standardised_rank": 14,
        "raw_common_rank": 15,
        "rank_change_vs_raw_common": 1
      },
      {
        "uf": "MG",
        "name": "Minas Gerais",
        "population": "employer_local_units",
        "cohort_year": 2017,
        "observation_year": 2022,
        "raw_full_five_year_pct": 37.47475,
        "raw_common_five_year_pct": 37.45879600006219,
        "standardised_five_year_pct": 37.45903573648952,
        "difference_from_national_common_pp": -0.3773984643783095,
        "composition_shift_pp": 0.0002397364273249991,
        "full_births": 32179,
        "common_births": 32158,
        "state_cohort_coverage_pct": 99.9347400478573,
        "min_included_sector_births": 73,
        "included_sections": [
          "A",
          "B",
          "C",
          "E",
          "F",
          "G",
          "H",
          "I",
          "J",
          "K",
          "L",
          "M",
          "N",
          "P",
          "Q",
          "R",
          "S"
        ],
        "excluded_sections": [
          "D",
          "O"
        ],
        "sector_support": [
          {
            "section": "A",
            "births": 397,
            "five_year_survival_pct": 45.08816,
            "national_weight_pct": 0.8698495969359716,
            "source_row": 427
          },
          {
            "section": "B",
            "births": 141,
            "five_year_survival_pct": 43.26241,
            "national_weight_pct": 0.1871188086432032,
            "source_row": 428
          },
          {
            "section": "C",
            "births": 2798,
            "five_year_survival_pct": 42.85204,
            "national_weight_pct": 7.668499644305688,
            "source_row": 429
          },
          {
            "section": "E",
            "births": 73,
            "five_year_survival_pct": 42.46575,
            "national_weight_pct": 0.2865783555796806,
            "source_row": 431
          },
          {
            "section": "F",
            "births": 2132,
            "five_year_survival_pct": 21.90432,
            "national_weight_pct": 6.132776809405165,
            "source_row": 432
          },
          {
            "section": "G",
            "births": 13502,
            "five_year_survival_pct": 37.66849,
            "national_weight_pct": 44.44493144034281,
            "source_row": 433
          },
          {
            "section": "H",
            "births": 2059,
            "five_year_survival_pct": 33.94852,
            "national_weight_pct": 5.332380319821445,
            "source_row": 434
          },
          {
            "section": "I",
            "births": 3114,
            "five_year_survival_pct": 29.70456,
            "national_weight_pct": 9.943931787608353,
            "source_row": 435
          },
          {
            "section": "J",
            "births": 528,
            "five_year_survival_pct": 42.23485,
            "national_weight_pct": 1.8081408482045023,
            "source_row": 436
          },
          {
            "section": "K",
            "births": 369,
            "five_year_survival_pct": 49.8645,
            "national_weight_pct": 1.3260149088175104,
            "source_row": 437
          },
          {
            "section": "L",
            "births": 400,
            "five_year_survival_pct": 39.75,
            "national_weight_pct": 1.1493477813778012,
            "source_row": 438
          },
          {
            "section": "M",
            "births": 1548,
            "five_year_survival_pct": 39.92248,
            "national_weight_pct": 4.67797021608008,
            "source_row": 439
          },
          {
            "section": "N",
            "births": 1820,
            "five_year_survival_pct": 39.34066,
            "national_weight_pct": 6.08962148056493,
            "source_row": 440
          },
          {
            "section": "P",
            "births": 606,
            "five_year_survival_pct": 42.73927,
            "national_weight_pct": 2.1756354453596223,
            "source_row": 442
          },
          {
            "section": "Q",
            "births": 1531,
            "five_year_survival_pct": 58.26257,
            "national_weight_pct": 4.430838528268426,
            "source_row": 443
          },
          {
            "section": "R",
            "births": 484,
            "five_year_survival_pct": 28.09917,
            "national_weight_pct": 1.2066634524937374,
            "source_row": 444
          },
          {
            "section": "S",
            "births": 656,
            "five_year_survival_pct": 32.31707,
            "national_weight_pct": 2.2697005761910702,
            "source_row": 445
          }
        ],
        "standardised_rank": 12,
        "raw_common_rank": 14,
        "rank_change_vs_raw_common": 2
      },
      {
        "uf": "ES",
        "name": "Espírito Santo",
        "population": "employer_local_units",
        "cohort_year": 2017,
        "observation_year": 2022,
        "raw_full_five_year_pct": 38.94277,
        "raw_common_five_year_pct": 38.869086830849,
        "standardised_five_year_pct": 38.42829672080188,
        "difference_from_national_common_pp": 0.5918625199340539,
        "composition_shift_pp": -0.4407901100471179,
        "full_births": 6186,
        "common_births": 6172,
        "state_cohort_coverage_pct": 99.77368250889104,
        "min_included_sector_births": 22,
        "included_sections": [
          "A",
          "B",
          "C",
          "E",
          "F",
          "G",
          "H",
          "I",
          "J",
          "K",
          "L",
          "M",
          "N",
          "P",
          "Q",
          "R",
          "S"
        ],
        "excluded_sections": [
          "D",
          "O"
        ],
        "sector_support": [
          {
            "section": "A",
            "births": 53,
            "five_year_survival_pct": 39.62264,
            "national_weight_pct": 0.8698495969359716,
            "source_row": 448
          },
          {
            "section": "B",
            "births": 28,
            "five_year_survival_pct": 28.57143,
            "national_weight_pct": 0.1871188086432032,
            "source_row": 449
          },
          {
            "section": "C",
            "births": 486,
            "five_year_survival_pct": 43.82716,
            "national_weight_pct": 7.668499644305688,
            "source_row": 450
          },
          {
            "section": "E",
            "births": 22,
            "five_year_survival_pct": 63.63636,
            "national_weight_pct": 0.2865783555796806,
            "source_row": 452
          },
          {
            "section": "F",
            "births": 403,
            "five_year_survival_pct": 23.82134,
            "national_weight_pct": 6.132776809405165,
            "source_row": 453
          },
          {
            "section": "G",
            "births": 2736,
            "five_year_survival_pct": 37.6462,
            "national_weight_pct": 44.44493144034281,
            "source_row": 454
          },
          {
            "section": "H",
            "births": 279,
            "five_year_survival_pct": 37.63441,
            "national_weight_pct": 5.332380319821445,
            "source_row": 455
          },
          {
            "section": "I",
            "births": 617,
            "five_year_survival_pct": 29.49757,
            "national_weight_pct": 9.943931787608353,
            "source_row": 456
          },
          {
            "section": "J",
            "births": 96,
            "five_year_survival_pct": 52.08333,
            "national_weight_pct": 1.8081408482045023,
            "source_row": 457
          },
          {
            "section": "K",
            "births": 143,
            "five_year_survival_pct": 83.91608,
            "national_weight_pct": 1.3260149088175104,
            "source_row": 458
          },
          {
            "section": "L",
            "births": 42,
            "five_year_survival_pct": 47.61905,
            "national_weight_pct": 1.1493477813778012,
            "source_row": 459
          },
          {
            "section": "M",
            "births": 281,
            "five_year_survival_pct": 39.85765,
            "national_weight_pct": 4.67797021608008,
            "source_row": 460
          },
          {
            "section": "N",
            "births": 344,
            "five_year_survival_pct": 36.62791,
            "national_weight_pct": 6.08962148056493,
            "source_row": 461
          },
          {
            "section": "P",
            "births": 130,
            "five_year_survival_pct": 40,
            "national_weight_pct": 2.1756354453596223,
            "source_row": 463
          },
          {
            "section": "Q",
            "births": 304,
            "five_year_survival_pct": 57.23684,
            "national_weight_pct": 4.430838528268426,
            "source_row": 464
          },
          {
            "section": "R",
            "births": 89,
            "five_year_survival_pct": 40.44944,
            "national_weight_pct": 1.2066634524937374,
            "source_row": 465
          },
          {
            "section": "S",
            "births": 119,
            "five_year_survival_pct": 33.61345,
            "national_weight_pct": 2.2697005761910702,
            "source_row": 466
          }
        ],
        "standardised_rank": 8,
        "raw_common_rank": 6,
        "rank_change_vs_raw_common": -2
      },
      {
        "uf": "RJ",
        "name": "Rio de Janeiro",
        "population": "employer_local_units",
        "cohort_year": 2017,
        "observation_year": 2022,
        "raw_full_five_year_pct": 38.64877,
        "raw_common_five_year_pct": 38.6281229899382,
        "standardised_five_year_pct": 38.775423579262515,
        "difference_from_national_common_pp": 0.9389893783946874,
        "composition_shift_pp": 0.1473005893243169,
        "full_births": 19597,
        "common_births": 19579,
        "state_cohort_coverage_pct": 99.9081492065112,
        "min_included_sector_births": 32,
        "included_sections": [
          "A",
          "B",
          "C",
          "E",
          "F",
          "G",
          "H",
          "I",
          "J",
          "K",
          "L",
          "M",
          "N",
          "P",
          "Q",
          "R",
          "S"
        ],
        "excluded_sections": [
          "D",
          "O"
        ],
        "sector_support": [
          {
            "section": "A",
            "births": 41,
            "five_year_survival_pct": 56.09756,
            "national_weight_pct": 0.8698495969359716,
            "source_row": 469
          },
          {
            "section": "B",
            "births": 32,
            "five_year_survival_pct": 43.75,
            "national_weight_pct": 0.1871188086432032,
            "source_row": 470
          },
          {
            "section": "C",
            "births": 1000,
            "five_year_survival_pct": 39.2,
            "national_weight_pct": 7.668499644305688,
            "source_row": 471
          },
          {
            "section": "E",
            "births": 48,
            "five_year_survival_pct": 31.25,
            "national_weight_pct": 0.2865783555796806,
            "source_row": 473
          },
          {
            "section": "F",
            "births": 990,
            "five_year_survival_pct": 28.28283,
            "national_weight_pct": 6.132776809405165,
            "source_row": 474
          },
          {
            "section": "G",
            "births": 8431,
            "five_year_survival_pct": 38.21611,
            "national_weight_pct": 44.44493144034281,
            "source_row": 475
          },
          {
            "section": "H",
            "births": 766,
            "five_year_survival_pct": 42.1671,
            "national_weight_pct": 5.332380319821445,
            "source_row": 476
          },
          {
            "section": "I",
            "births": 2500,
            "five_year_survival_pct": 31,
            "national_weight_pct": 9.943931787608353,
            "source_row": 477
          },
          {
            "section": "J",
            "births": 365,
            "five_year_survival_pct": 46.0274,
            "national_weight_pct": 1.8081408482045023,
            "source_row": 478
          },
          {
            "section": "K",
            "births": 304,
            "five_year_survival_pct": 53.61842,
            "national_weight_pct": 1.3260149088175104,
            "source_row": 479
          },
          {
            "section": "L",
            "births": 263,
            "five_year_survival_pct": 46.76806,
            "national_weight_pct": 1.1493477813778012,
            "source_row": 480
          },
          {
            "section": "M",
            "births": 997,
            "five_year_survival_pct": 44.2327,
            "national_weight_pct": 4.67797021608008,
            "source_row": 481
          },
          {
            "section": "N",
            "births": 1288,
            "five_year_survival_pct": 39.20807,
            "national_weight_pct": 6.08962148056493,
            "source_row": 482
          },
          {
            "section": "P",
            "births": 509,
            "five_year_survival_pct": 49.7053,
            "national_weight_pct": 2.1756354453596223,
            "source_row": 484
          },
          {
            "section": "Q",
            "births": 1060,
            "five_year_survival_pct": 53.30189,
            "national_weight_pct": 4.430838528268426,
            "source_row": 485
          },
          {
            "section": "R",
            "births": 309,
            "five_year_survival_pct": 40.12945,
            "national_weight_pct": 1.2066634524937374,
            "source_row": 486
          },
          {
            "section": "S",
            "births": 676,
            "five_year_survival_pct": 26.18343,
            "national_weight_pct": 2.2697005761910702,
            "source_row": 487
          }
        ],
        "standardised_rank": 5,
        "raw_common_rank": 7,
        "rank_change_vs_raw_common": 2
      },
      {
        "uf": "SP",
        "name": "São Paulo",
        "population": "employer_local_units",
        "cohort_year": 2017,
        "observation_year": 2022,
        "raw_full_five_year_pct": 38.48101,
        "raw_common_five_year_pct": 38.457089427836706,
        "standardised_five_year_pct": 38.6702680175858,
        "difference_from_national_common_pp": 0.83383381671797,
        "composition_shift_pp": 0.21317858974909143,
        "full_births": 77841,
        "common_births": 77775,
        "state_cohort_coverage_pct": 99.91521177785486,
        "min_included_sector_births": 42,
        "included_sections": [
          "A",
          "B",
          "C",
          "E",
          "F",
          "G",
          "H",
          "I",
          "J",
          "K",
          "L",
          "M",
          "N",
          "P",
          "Q",
          "R",
          "S"
        ],
        "excluded_sections": [
          "D",
          "O"
        ],
        "sector_support": [
          {
            "section": "A",
            "births": 404,
            "five_year_survival_pct": 37.37624,
            "national_weight_pct": 0.8698495969359716,
            "source_row": 490
          },
          {
            "section": "B",
            "births": 42,
            "five_year_survival_pct": 61.90476,
            "national_weight_pct": 0.1871188086432032,
            "source_row": 491
          },
          {
            "section": "C",
            "births": 5119,
            "five_year_survival_pct": 45.71205,
            "national_weight_pct": 7.668499644305688,
            "source_row": 492
          },
          {
            "section": "E",
            "births": 170,
            "five_year_survival_pct": 50,
            "national_weight_pct": 0.2865783555796806,
            "source_row": 494
          },
          {
            "section": "F",
            "births": 4763,
            "five_year_survival_pct": 29.07831,
            "national_weight_pct": 6.132776809405165,
            "source_row": 495
          },
          {
            "section": "G",
            "births": 33106,
            "five_year_survival_pct": 38.55797,
            "national_weight_pct": 44.44493144034281,
            "source_row": 496
          },
          {
            "section": "H",
            "births": 4538,
            "five_year_survival_pct": 33.67122,
            "national_weight_pct": 5.332380319821445,
            "source_row": 497
          },
          {
            "section": "I",
            "births": 8538,
            "five_year_survival_pct": 31.24854,
            "national_weight_pct": 9.943931787608353,
            "source_row": 498
          },
          {
            "section": "J",
            "births": 1648,
            "five_year_survival_pct": 42.05097,
            "national_weight_pct": 1.8081408482045023,
            "source_row": 499
          },
          {
            "section": "K",
            "births": 1278,
            "five_year_survival_pct": 47.49609,
            "national_weight_pct": 1.3260149088175104,
            "source_row": 500
          },
          {
            "section": "L",
            "births": 1055,
            "five_year_survival_pct": 44.73934,
            "national_weight_pct": 1.1493477813778012,
            "source_row": 501
          },
          {
            "section": "M",
            "births": 3719,
            "five_year_survival_pct": 41.67787,
            "national_weight_pct": 4.67797021608008,
            "source_row": 502
          },
          {
            "section": "N",
            "births": 5795,
            "five_year_survival_pct": 39.43054,
            "national_weight_pct": 6.08962148056493,
            "source_row": 503
          },
          {
            "section": "P",
            "births": 1780,
            "five_year_survival_pct": 44.4382,
            "national_weight_pct": 2.1756354453596223,
            "source_row": 505
          },
          {
            "section": "Q",
            "births": 3098,
            "five_year_survival_pct": 53.48612,
            "national_weight_pct": 4.430838528268426,
            "source_row": 506
          },
          {
            "section": "R",
            "births": 857,
            "five_year_survival_pct": 37.68961,
            "national_weight_pct": 1.2066634524937374,
            "source_row": 507
          },
          {
            "section": "S",
            "births": 1865,
            "five_year_survival_pct": 31.31367,
            "national_weight_pct": 2.2697005761910702,
            "source_row": 508
          }
        ],
        "standardised_rank": 6,
        "raw_common_rank": 8,
        "rank_change_vs_raw_common": 2
      },
      {
        "uf": "PR",
        "name": "Paraná",
        "population": "employer_local_units",
        "cohort_year": 2017,
        "observation_year": 2022,
        "raw_full_five_year_pct": 36.96242,
        "raw_common_five_year_pct": 36.933458933967074,
        "standardised_five_year_pct": 36.98818185426311,
        "difference_from_national_common_pp": -0.8482523466047169,
        "composition_shift_pp": 0.05472292029603665,
        "full_births": 23578,
        "common_births": 23564,
        "state_cohort_coverage_pct": 99.94062261430146,
        "min_included_sector_births": 21,
        "included_sections": [
          "A",
          "B",
          "C",
          "E",
          "F",
          "G",
          "H",
          "I",
          "J",
          "K",
          "L",
          "M",
          "N",
          "P",
          "Q",
          "R",
          "S"
        ],
        "excluded_sections": [
          "D",
          "O"
        ],
        "sector_support": [
          {
            "section": "A",
            "births": 301,
            "five_year_survival_pct": 41.86047,
            "national_weight_pct": 0.8698495969359716,
            "source_row": 532
          },
          {
            "section": "B",
            "births": 21,
            "five_year_survival_pct": 42.85714,
            "national_weight_pct": 0.1871188086432032,
            "source_row": 533
          },
          {
            "section": "C",
            "births": 2357,
            "five_year_survival_pct": 41.36614,
            "national_weight_pct": 7.668499644305688,
            "source_row": 534
          },
          {
            "section": "E",
            "births": 62,
            "five_year_survival_pct": 53.22581,
            "national_weight_pct": 0.2865783555796806,
            "source_row": 536
          },
          {
            "section": "F",
            "births": 1678,
            "five_year_survival_pct": 24.67223,
            "national_weight_pct": 6.132776809405165,
            "source_row": 537
          },
          {
            "section": "G",
            "births": 10024,
            "five_year_survival_pct": 36.72187,
            "national_weight_pct": 44.44493144034281,
            "source_row": 538
          },
          {
            "section": "H",
            "births": 1689,
            "five_year_survival_pct": 35.58319,
            "national_weight_pct": 5.332380319821445,
            "source_row": 539
          },
          {
            "section": "I",
            "births": 2097,
            "five_year_survival_pct": 27.61087,
            "national_weight_pct": 9.943931787608353,
            "source_row": 540
          },
          {
            "section": "J",
            "births": 387,
            "five_year_survival_pct": 41.60207,
            "national_weight_pct": 1.8081408482045023,
            "source_row": 541
          },
          {
            "section": "K",
            "births": 307,
            "five_year_survival_pct": 50.16287,
            "national_weight_pct": 1.3260149088175104,
            "source_row": 542
          },
          {
            "section": "L",
            "births": 230,
            "five_year_survival_pct": 37.3913,
            "national_weight_pct": 1.1493477813778012,
            "source_row": 543
          },
          {
            "section": "M",
            "births": 1038,
            "five_year_survival_pct": 40.17341,
            "national_weight_pct": 4.67797021608008,
            "source_row": 544
          },
          {
            "section": "N",
            "births": 1317,
            "five_year_survival_pct": 42.52088,
            "national_weight_pct": 6.08962148056493,
            "source_row": 545
          },
          {
            "section": "P",
            "births": 428,
            "five_year_survival_pct": 41.35514,
            "national_weight_pct": 2.1756354453596223,
            "source_row": 547
          },
          {
            "section": "Q",
            "births": 933,
            "five_year_survival_pct": 53.37621,
            "national_weight_pct": 4.430838528268426,
            "source_row": 548
          },
          {
            "section": "R",
            "births": 239,
            "five_year_survival_pct": 39.33054,
            "national_weight_pct": 1.2066634524937374,
            "source_row": 549
          },
          {
            "section": "S",
            "births": 456,
            "five_year_survival_pct": 30.26316,
            "national_weight_pct": 2.2697005761910702,
            "source_row": 550
          }
        ],
        "standardised_rank": 17,
        "raw_common_rank": 18,
        "rank_change_vs_raw_common": 1
      },
      {
        "uf": "SC",
        "name": "Santa Catarina",
        "population": "employer_local_units",
        "cohort_year": 2017,
        "observation_year": 2022,
        "raw_full_five_year_pct": 39.98173,
        "raw_common_five_year_pct": 39.9725658987255,
        "standardised_five_year_pct": 39.79623074085562,
        "difference_from_national_common_pp": 1.9597965399877921,
        "composition_shift_pp": -0.17633515786987886,
        "full_births": 17513,
        "common_births": 17497,
        "state_cohort_coverage_pct": 99.90863929652258,
        "min_included_sector_births": 23,
        "included_sections": [
          "A",
          "B",
          "C",
          "E",
          "F",
          "G",
          "H",
          "I",
          "J",
          "K",
          "L",
          "M",
          "N",
          "P",
          "Q",
          "R",
          "S"
        ],
        "excluded_sections": [
          "D",
          "O"
        ],
        "sector_support": [
          {
            "section": "A",
            "births": 141,
            "five_year_survival_pct": 39.00709,
            "national_weight_pct": 0.8698495969359716,
            "source_row": 553
          },
          {
            "section": "B",
            "births": 23,
            "five_year_survival_pct": 43.47826,
            "national_weight_pct": 0.1871188086432032,
            "source_row": 554
          },
          {
            "section": "C",
            "births": 2345,
            "five_year_survival_pct": 47.03625,
            "national_weight_pct": 7.668499644305688,
            "source_row": 555
          },
          {
            "section": "E",
            "births": 63,
            "five_year_survival_pct": 42.85714,
            "national_weight_pct": 0.2865783555796806,
            "source_row": 557
          },
          {
            "section": "F",
            "births": 1250,
            "five_year_survival_pct": 31.36,
            "national_weight_pct": 6.132776809405165,
            "source_row": 558
          },
          {
            "section": "G",
            "births": 6772,
            "five_year_survival_pct": 39.02835,
            "national_weight_pct": 44.44493144034281,
            "source_row": 559
          },
          {
            "section": "H",
            "births": 1091,
            "five_year_survival_pct": 39.96334,
            "national_weight_pct": 5.332380319821445,
            "source_row": 560
          },
          {
            "section": "I",
            "births": 1827,
            "five_year_survival_pct": 31.63656,
            "national_weight_pct": 9.943931787608353,
            "source_row": 561
          },
          {
            "section": "J",
            "births": 298,
            "five_year_survival_pct": 42.28188,
            "national_weight_pct": 1.8081408482045023,
            "source_row": 562
          },
          {
            "section": "K",
            "births": 202,
            "five_year_survival_pct": 53.9604,
            "national_weight_pct": 1.3260149088175104,
            "source_row": 563
          },
          {
            "section": "L",
            "births": 231,
            "five_year_survival_pct": 40.69264,
            "national_weight_pct": 1.1493477813778012,
            "source_row": 564
          },
          {
            "section": "M",
            "births": 753,
            "five_year_survival_pct": 45.68393,
            "national_weight_pct": 4.67797021608008,
            "source_row": 565
          },
          {
            "section": "N",
            "births": 983,
            "five_year_survival_pct": 41.91251,
            "national_weight_pct": 6.08962148056493,
            "source_row": 566
          },
          {
            "section": "P",
            "births": 340,
            "five_year_survival_pct": 44.41176,
            "national_weight_pct": 2.1756354453596223,
            "source_row": 568
          },
          {
            "section": "Q",
            "births": 631,
            "five_year_survival_pct": 55.62599,
            "national_weight_pct": 4.430838528268426,
            "source_row": 569
          },
          {
            "section": "R",
            "births": 208,
            "five_year_survival_pct": 32.21154,
            "national_weight_pct": 1.2066634524937374,
            "source_row": 570
          },
          {
            "section": "S",
            "births": 339,
            "five_year_survival_pct": 28.31858,
            "national_weight_pct": 2.2697005761910702,
            "source_row": 571
          }
        ],
        "standardised_rank": 3,
        "raw_common_rank": 3,
        "rank_change_vs_raw_common": 0
      },
      {
        "uf": "RS",
        "name": "Rio Grande do Sul",
        "population": "employer_local_units",
        "cohort_year": 2017,
        "observation_year": 2022,
        "raw_full_five_year_pct": 38.41286,
        "raw_common_five_year_pct": 38.41017033240997,
        "standardised_five_year_pct": 38.38267944174537,
        "difference_from_national_common_pp": 0.5462452408775391,
        "composition_shift_pp": -0.027490890664601864,
        "full_births": 20225,
        "common_births": 20216,
        "state_cohort_coverage_pct": 99.95550061804697,
        "min_included_sector_births": 31,
        "included_sections": [
          "A",
          "B",
          "C",
          "E",
          "F",
          "G",
          "H",
          "I",
          "J",
          "K",
          "L",
          "M",
          "N",
          "P",
          "Q",
          "R",
          "S"
        ],
        "excluded_sections": [
          "D",
          "O"
        ],
        "sector_support": [
          {
            "section": "A",
            "births": 159,
            "five_year_survival_pct": 50.31447,
            "national_weight_pct": 0.8698495969359716,
            "source_row": 574
          },
          {
            "section": "B",
            "births": 31,
            "five_year_survival_pct": 58.06452,
            "national_weight_pct": 0.1871188086432032,
            "source_row": 575
          },
          {
            "section": "C",
            "births": 2072,
            "five_year_survival_pct": 45.46332,
            "national_weight_pct": 7.668499644305688,
            "source_row": 576
          },
          {
            "section": "E",
            "births": 62,
            "five_year_survival_pct": 43.54839,
            "national_weight_pct": 0.2865783555796806,
            "source_row": 578
          },
          {
            "section": "F",
            "births": 1373,
            "five_year_survival_pct": 26.58412,
            "national_weight_pct": 6.132776809405165,
            "source_row": 579
          },
          {
            "section": "G",
            "births": 8730,
            "five_year_survival_pct": 37.77778,
            "national_weight_pct": 44.44493144034281,
            "source_row": 580
          },
          {
            "section": "H",
            "births": 1284,
            "five_year_survival_pct": 35.12461,
            "national_weight_pct": 5.332380319821445,
            "source_row": 581
          },
          {
            "section": "I",
            "births": 1741,
            "five_year_survival_pct": 31.87823,
            "national_weight_pct": 9.943931787608353,
            "source_row": 582
          },
          {
            "section": "J",
            "births": 362,
            "five_year_survival_pct": 43.09392,
            "national_weight_pct": 1.8081408482045023,
            "source_row": 583
          },
          {
            "section": "K",
            "births": 265,
            "five_year_survival_pct": 49.81132,
            "national_weight_pct": 1.3260149088175104,
            "source_row": 584
          },
          {
            "section": "L",
            "births": 234,
            "five_year_survival_pct": 43.58974,
            "national_weight_pct": 1.1493477813778012,
            "source_row": 585
          },
          {
            "section": "M",
            "births": 980,
            "five_year_survival_pct": 43.06122,
            "national_weight_pct": 4.67797021608008,
            "source_row": 586
          },
          {
            "section": "N",
            "births": 1107,
            "five_year_survival_pct": 37.12737,
            "national_weight_pct": 6.08962148056493,
            "source_row": 587
          },
          {
            "section": "P",
            "births": 421,
            "five_year_survival_pct": 43.46793,
            "national_weight_pct": 2.1756354453596223,
            "source_row": 589
          },
          {
            "section": "Q",
            "births": 739,
            "five_year_survival_pct": 57.78078,
            "national_weight_pct": 4.430838528268426,
            "source_row": 590
          },
          {
            "section": "R",
            "births": 223,
            "five_year_survival_pct": 32.73543,
            "national_weight_pct": 1.2066634524937374,
            "source_row": 591
          },
          {
            "section": "S",
            "births": 433,
            "five_year_survival_pct": 28.40647,
            "national_weight_pct": 2.2697005761910702,
            "source_row": 592
          }
        ],
        "standardised_rank": 9,
        "raw_common_rank": 9,
        "rank_change_vs_raw_common": 0
      },
      {
        "uf": "MS",
        "name": "Mato Grosso do Sul",
        "population": "employer_local_units",
        "cohort_year": 2017,
        "observation_year": 2022,
        "raw_full_five_year_pct": 36.73749,
        "raw_common_five_year_pct": 36.72535825062886,
        "standardised_five_year_pct": 36.75958376489786,
        "difference_from_national_common_pp": -1.0768504359699662,
        "composition_shift_pp": 0.034225514269003554,
        "full_births": 4377,
        "common_births": 4373,
        "state_cohort_coverage_pct": 99.90861320539182,
        "min_included_sector_births": 7,
        "included_sections": [
          "A",
          "B",
          "C",
          "E",
          "F",
          "G",
          "H",
          "I",
          "J",
          "K",
          "L",
          "M",
          "N",
          "P",
          "Q",
          "R",
          "S"
        ],
        "excluded_sections": [
          "D",
          "O"
        ],
        "sector_support": [
          {
            "section": "A",
            "births": 132,
            "five_year_survival_pct": 40.90909,
            "national_weight_pct": 0.8698495969359716,
            "source_row": 616
          },
          {
            "section": "B",
            "births": 7,
            "five_year_survival_pct": 42.85714,
            "national_weight_pct": 0.1871188086432032,
            "source_row": 617
          },
          {
            "section": "C",
            "births": 272,
            "five_year_survival_pct": 35.66176,
            "national_weight_pct": 7.668499644305688,
            "source_row": 618
          },
          {
            "section": "E",
            "births": 27,
            "five_year_survival_pct": 37.03704,
            "national_weight_pct": 0.2865783555796806,
            "source_row": 620
          },
          {
            "section": "F",
            "births": 255,
            "five_year_survival_pct": 21.17647,
            "national_weight_pct": 6.132776809405165,
            "source_row": 621
          },
          {
            "section": "G",
            "births": 1844,
            "five_year_survival_pct": 37.52711,
            "national_weight_pct": 44.44493144034281,
            "source_row": 622
          },
          {
            "section": "H",
            "births": 313,
            "five_year_survival_pct": 33.22684,
            "national_weight_pct": 5.332380319821445,
            "source_row": 623
          },
          {
            "section": "I",
            "births": 429,
            "five_year_survival_pct": 30.30303,
            "national_weight_pct": 9.943931787608353,
            "source_row": 624
          },
          {
            "section": "J",
            "births": 82,
            "five_year_survival_pct": 36.58537,
            "national_weight_pct": 1.8081408482045023,
            "source_row": 625
          },
          {
            "section": "K",
            "births": 43,
            "five_year_survival_pct": 65.11628,
            "national_weight_pct": 1.3260149088175104,
            "source_row": 626
          },
          {
            "section": "L",
            "births": 44,
            "five_year_survival_pct": 43.18182,
            "national_weight_pct": 1.1493477813778012,
            "source_row": 627
          },
          {
            "section": "M",
            "births": 230,
            "five_year_survival_pct": 43.91304,
            "national_weight_pct": 4.67797021608008,
            "source_row": 628
          },
          {
            "section": "N",
            "births": 244,
            "five_year_survival_pct": 33.60656,
            "national_weight_pct": 6.08962148056493,
            "source_row": 629
          },
          {
            "section": "P",
            "births": 63,
            "five_year_survival_pct": 53.96825,
            "national_weight_pct": 2.1756354453596223,
            "source_row": 631
          },
          {
            "section": "Q",
            "births": 208,
            "five_year_survival_pct": 52.40385,
            "national_weight_pct": 4.430838528268426,
            "source_row": 632
          },
          {
            "section": "R",
            "births": 48,
            "five_year_survival_pct": 22.91667,
            "national_weight_pct": 1.2066634524937374,
            "source_row": 633
          },
          {
            "section": "S",
            "births": 132,
            "five_year_survival_pct": 36.36364,
            "national_weight_pct": 2.2697005761910702,
            "source_row": 634
          }
        ],
        "standardised_rank": 18,
        "raw_common_rank": 19,
        "rank_change_vs_raw_common": 1
      },
      {
        "uf": "MT",
        "name": "Mato Grosso",
        "population": "employer_local_units",
        "cohort_year": 2017,
        "observation_year": 2022,
        "raw_full_five_year_pct": 37.40725,
        "raw_common_five_year_pct": 37.438702236233716,
        "standardised_five_year_pct": 37.16813562934293,
        "difference_from_national_common_pp": -0.6682985715249004,
        "composition_shift_pp": -0.2705666068907888,
        "full_births": 7143,
        "common_births": 7137,
        "state_cohort_coverage_pct": 99.9160016799664,
        "min_included_sector_births": 20,
        "included_sections": [
          "A",
          "B",
          "C",
          "E",
          "F",
          "G",
          "H",
          "I",
          "J",
          "K",
          "L",
          "M",
          "N",
          "P",
          "Q",
          "R",
          "S"
        ],
        "excluded_sections": [
          "D",
          "O"
        ],
        "sector_support": [
          {
            "section": "A",
            "births": 167,
            "five_year_survival_pct": 43.71257,
            "national_weight_pct": 0.8698495969359716,
            "source_row": 637
          },
          {
            "section": "B",
            "births": 20,
            "five_year_survival_pct": 25,
            "national_weight_pct": 0.1871188086432032,
            "source_row": 638
          },
          {
            "section": "C",
            "births": 538,
            "five_year_survival_pct": 40.89219,
            "national_weight_pct": 7.668499644305688,
            "source_row": 639
          },
          {
            "section": "E",
            "births": 25,
            "five_year_survival_pct": 44,
            "national_weight_pct": 0.2865783555796806,
            "source_row": 641
          },
          {
            "section": "F",
            "births": 407,
            "five_year_survival_pct": 26.53563,
            "national_weight_pct": 6.132776809405165,
            "source_row": 642
          },
          {
            "section": "G",
            "births": 3247,
            "five_year_survival_pct": 37.69634,
            "national_weight_pct": 44.44493144034281,
            "source_row": 643
          },
          {
            "section": "H",
            "births": 495,
            "five_year_survival_pct": 35.55556,
            "national_weight_pct": 5.332380319821445,
            "source_row": 644
          },
          {
            "section": "I",
            "births": 594,
            "five_year_survival_pct": 28.78788,
            "national_weight_pct": 9.943931787608353,
            "source_row": 645
          },
          {
            "section": "J",
            "births": 110,
            "five_year_survival_pct": 45.45455,
            "national_weight_pct": 1.8081408482045023,
            "source_row": 646
          },
          {
            "section": "K",
            "births": 100,
            "five_year_survival_pct": 48,
            "national_weight_pct": 1.3260149088175104,
            "source_row": 647
          },
          {
            "section": "L",
            "births": 73,
            "five_year_survival_pct": 36.9863,
            "national_weight_pct": 1.1493477813778012,
            "source_row": 648
          },
          {
            "section": "M",
            "births": 344,
            "five_year_survival_pct": 38.95349,
            "national_weight_pct": 4.67797021608008,
            "source_row": 649
          },
          {
            "section": "N",
            "births": 353,
            "five_year_survival_pct": 37.11048,
            "national_weight_pct": 6.08962148056493,
            "source_row": 650
          },
          {
            "section": "P",
            "births": 143,
            "five_year_survival_pct": 42.65734,
            "national_weight_pct": 2.1756354453596223,
            "source_row": 652
          },
          {
            "section": "Q",
            "births": 334,
            "five_year_survival_pct": 49.7006,
            "national_weight_pct": 4.430838528268426,
            "source_row": 653
          },
          {
            "section": "R",
            "births": 69,
            "five_year_survival_pct": 37.68116,
            "national_weight_pct": 1.2066634524937374,
            "source_row": 654
          },
          {
            "section": "S",
            "births": 118,
            "five_year_survival_pct": 34.74576,
            "national_weight_pct": 2.2697005761910702,
            "source_row": 655
          }
        ],
        "standardised_rank": 16,
        "raw_common_rank": 16,
        "rank_change_vs_raw_common": 0
      },
      {
        "uf": "GO",
        "name": "Goiás",
        "population": "employer_local_units",
        "cohort_year": 2017,
        "observation_year": 2022,
        "raw_full_five_year_pct": 35.67973,
        "raw_common_five_year_pct": 35.6182596467094,
        "standardised_five_year_pct": 35.68151946655968,
        "difference_from_national_common_pp": -2.15491473430815,
        "composition_shift_pp": 0.06325981985028051,
        "full_births": 12814,
        "common_births": 12794,
        "state_cohort_coverage_pct": 99.84392071172155,
        "min_included_sector_births": 24,
        "included_sections": [
          "A",
          "B",
          "C",
          "E",
          "F",
          "G",
          "H",
          "I",
          "J",
          "K",
          "L",
          "M",
          "N",
          "P",
          "Q",
          "R",
          "S"
        ],
        "excluded_sections": [
          "D",
          "O"
        ],
        "sector_support": [
          {
            "section": "A",
            "births": 171,
            "five_year_survival_pct": 43.27485,
            "national_weight_pct": 0.8698495969359716,
            "source_row": 658
          },
          {
            "section": "B",
            "births": 24,
            "five_year_survival_pct": 29.16667,
            "national_weight_pct": 0.1871188086432032,
            "source_row": 659
          },
          {
            "section": "C",
            "births": 1057,
            "five_year_survival_pct": 38.59981,
            "national_weight_pct": 7.668499644305688,
            "source_row": 660
          },
          {
            "section": "E",
            "births": 48,
            "five_year_survival_pct": 25,
            "national_weight_pct": 0.2865783555796806,
            "source_row": 662
          },
          {
            "section": "F",
            "births": 736,
            "five_year_survival_pct": 25.67935,
            "national_weight_pct": 6.132776809405165,
            "source_row": 663
          },
          {
            "section": "G",
            "births": 6038,
            "five_year_survival_pct": 34.77973,
            "national_weight_pct": 44.44493144034281,
            "source_row": 664
          },
          {
            "section": "H",
            "births": 657,
            "five_year_survival_pct": 37.59513,
            "national_weight_pct": 5.332380319821445,
            "source_row": 665
          },
          {
            "section": "I",
            "births": 1155,
            "five_year_survival_pct": 28.22511,
            "national_weight_pct": 9.943931787608353,
            "source_row": 666
          },
          {
            "section": "J",
            "births": 215,
            "five_year_survival_pct": 41.39535,
            "national_weight_pct": 1.8081408482045023,
            "source_row": 667
          },
          {
            "section": "K",
            "births": 110,
            "five_year_survival_pct": 46.36364,
            "national_weight_pct": 1.3260149088175104,
            "source_row": 668
          },
          {
            "section": "L",
            "births": 137,
            "five_year_survival_pct": 39.41606,
            "national_weight_pct": 1.1493477813778012,
            "source_row": 669
          },
          {
            "section": "M",
            "births": 599,
            "five_year_survival_pct": 37.5626,
            "national_weight_pct": 4.67797021608008,
            "source_row": 670
          },
          {
            "section": "N",
            "births": 794,
            "five_year_survival_pct": 40.05038,
            "national_weight_pct": 6.08962148056493,
            "source_row": 671
          },
          {
            "section": "P",
            "births": 237,
            "five_year_survival_pct": 36.28692,
            "national_weight_pct": 2.1756354453596223,
            "source_row": 673
          },
          {
            "section": "Q",
            "births": 467,
            "five_year_survival_pct": 55.03212,
            "national_weight_pct": 4.430838528268426,
            "source_row": 674
          },
          {
            "section": "R",
            "births": 136,
            "five_year_survival_pct": 33.08824,
            "national_weight_pct": 1.2066634524937374,
            "source_row": 675
          },
          {
            "section": "S",
            "births": 213,
            "five_year_survival_pct": 32.39437,
            "national_weight_pct": 2.2697005761910702,
            "source_row": 676
          }
        ],
        "standardised_rank": 22,
        "raw_common_rank": 23,
        "rank_change_vs_raw_common": 1
      },
      {
        "uf": "DF",
        "name": "Distrito Federal",
        "population": "employer_local_units",
        "cohort_year": 2017,
        "observation_year": 2022,
        "raw_full_five_year_pct": 32.56608,
        "raw_common_five_year_pct": 32.550535503864445,
        "standardised_five_year_pct": 32.06287932910321,
        "difference_from_national_common_pp": -5.773554871764617,
        "composition_shift_pp": -0.48765617476123424,
        "full_births": 6734,
        "common_births": 6728,
        "state_cohort_coverage_pct": 99.91089991089991,
        "min_included_sector_births": 4,
        "included_sections": [
          "A",
          "B",
          "C",
          "E",
          "F",
          "G",
          "H",
          "I",
          "J",
          "K",
          "L",
          "M",
          "N",
          "P",
          "Q",
          "R",
          "S"
        ],
        "excluded_sections": [
          "D",
          "O"
        ],
        "sector_support": [
          {
            "section": "A",
            "births": 13,
            "five_year_survival_pct": 30.76923,
            "national_weight_pct": 0.8698495969359716,
            "source_row": 679
          },
          {
            "section": "B",
            "births": 4,
            "five_year_survival_pct": 75,
            "national_weight_pct": 0.1871188086432032,
            "source_row": 680
          },
          {
            "section": "C",
            "births": 254,
            "five_year_survival_pct": 27.55906,
            "national_weight_pct": 7.668499644305688,
            "source_row": 681
          },
          {
            "section": "E",
            "births": 12,
            "five_year_survival_pct": 50,
            "national_weight_pct": 0.2865783555796806,
            "source_row": 683
          },
          {
            "section": "F",
            "births": 353,
            "five_year_survival_pct": 26.34561,
            "national_weight_pct": 6.132776809405165,
            "source_row": 684
          },
          {
            "section": "G",
            "births": 2913,
            "five_year_survival_pct": 32.8184,
            "national_weight_pct": 44.44493144034281,
            "source_row": 685
          },
          {
            "section": "H",
            "births": 196,
            "five_year_survival_pct": 27.04082,
            "national_weight_pct": 5.332380319821445,
            "source_row": 686
          },
          {
            "section": "I",
            "births": 898,
            "five_year_survival_pct": 26.94878,
            "national_weight_pct": 9.943931787608353,
            "source_row": 687
          },
          {
            "section": "J",
            "births": 124,
            "five_year_survival_pct": 27.41935,
            "national_weight_pct": 1.8081408482045023,
            "source_row": 688
          },
          {
            "section": "K",
            "births": 90,
            "five_year_survival_pct": 37.77778,
            "national_weight_pct": 1.3260149088175104,
            "source_row": 689
          },
          {
            "section": "L",
            "births": 82,
            "five_year_survival_pct": 46.34146,
            "national_weight_pct": 1.1493477813778012,
            "source_row": 690
          },
          {
            "section": "M",
            "births": 340,
            "five_year_survival_pct": 36.17647,
            "national_weight_pct": 4.67797021608008,
            "source_row": 691
          },
          {
            "section": "N",
            "births": 400,
            "five_year_survival_pct": 32.5,
            "national_weight_pct": 6.08962148056493,
            "source_row": 692
          },
          {
            "section": "P",
            "births": 207,
            "five_year_survival_pct": 36.71498,
            "national_weight_pct": 2.1756354453596223,
            "source_row": 694
          },
          {
            "section": "Q",
            "births": 485,
            "five_year_survival_pct": 49.07216,
            "national_weight_pct": 4.430838528268426,
            "source_row": 695
          },
          {
            "section": "R",
            "births": 95,
            "five_year_survival_pct": 31.57895,
            "national_weight_pct": 1.2066634524937374,
            "source_row": 696
          },
          {
            "section": "S",
            "births": 262,
            "five_year_survival_pct": 22.90076,
            "national_weight_pct": 2.2697005761910702,
            "source_row": 697
          }
        ],
        "standardised_rank": 26,
        "raw_common_rank": 26,
        "rank_change_vs_raw_common": 0
      }
    ],
    "sector_standardisation": {
      "minimum_births_in_every_state_sector": 1,
      "included_sections": [
        "A",
        "B",
        "C",
        "E",
        "F",
        "G",
        "H",
        "I",
        "J",
        "K",
        "L",
        "M",
        "N",
        "P",
        "Q",
        "R",
        "S"
      ],
      "excluded_positive_national_sections": [
        "D",
        "O"
      ],
      "national_common_births": 296603,
      "national_total_births": 296850,
      "national_cohort_coverage_pct": 99.91679299309415,
      "national_common_five_year_pct": 37.83643420086783,
      "weights_pct": {
        "A": 0.8698495969359716,
        "B": 0.1871188086432032,
        "C": 7.668499644305688,
        "E": 0.2865783555796806,
        "F": 6.132776809405165,
        "G": 44.44493144034281,
        "H": 5.332380319821445,
        "I": 9.943931787608353,
        "J": 1.8081408482045023,
        "K": 1.3260149088175104,
        "L": 1.1493477813778012,
        "M": 4.67797021608008,
        "N": 6.08962148056493,
        "P": 2.1756354453596223,
        "Q": 4.430838528268426,
        "R": 1.2066634524937374,
        "S": 2.2697005761910702
      },
      "method": "Direct descriptive standardisation: sum over common-support sectors of (Brazil 2017 local-unit birth share among included sectors * state published sector five-year survival percentage). Same national weights for every state. No invented rate for absent sectors.",
      "scope": "Employer local units only. Adjusts CNAE-section birth-cohort composition only; no size, municipality, founder, or firm-level adjustment; no causal or predictive model. Rankings are descriptive sensitivity diagnostics, not location recommendations.",
      "raw_common_method": "State sector-birth-weighted average of published rates over exactly the included sectors; rates retain published rounding.",
      "rank_convention": "Rank 1 is highest descriptive survival percentage; positive rank change means movement toward rank 1. No statistical significance is implied.",
      "zero_national_birth_sections": [
        "U"
      ],
      "sensitivity_analyses": [
        {
          "minimum_births_in_every_state_sector": 10,
          "included_sections": [
            "C",
            "F",
            "G",
            "H",
            "I",
            "M",
            "N",
            "Q"
          ],
          "excluded_positive_national_sections": [
            "A",
            "B",
            "D",
            "E",
            "J",
            "K",
            "L",
            "O",
            "P",
            "R",
            "S"
          ],
          "national_common_births": 263149,
          "national_total_births": 296850,
          "national_cohort_coverage_pct": 88.64712817921509,
          "national_common_five_year_pct": 37.45938568427013,
          "weights_pct": {
            "C": 8.643392146654556,
            "F": 6.91243364025704,
            "G": 50.095193217530756,
            "H": 6.010283147570388,
            "I": 11.20809883374058,
            "M": 5.272678216523719,
            "N": 6.86379199616947,
            "Q": 4.994128801553493
          },
          "states": [
            {
              "uf": "RO",
              "name": "Rondônia",
              "population": "employer_local_units",
              "cohort_year": 2017,
              "observation_year": 2022,
              "raw_full_five_year_pct": 36.40671,
              "raw_common_five_year_pct": 35.557333919296845,
              "standardised_five_year_pct": 35.30252504322646,
              "difference_from_national_common_pp": -2.1568606410436715,
              "composition_shift_pp": -0.2548088760703848,
              "full_births": 2744,
              "common_births": 2503,
              "state_cohort_coverage_pct": 91.21720116618076,
              "min_included_sector_births": 125,
              "included_sections": [
                "C",
                "F",
                "G",
                "H",
                "I",
                "M",
                "N",
                "Q"
              ],
              "excluded_sections": [
                "A",
                "B",
                "D",
                "E",
                "J",
                "K",
                "L",
                "O",
                "P",
                "R",
                "S"
              ],
              "sector_support": [
                {
                  "section": "C",
                  "births": 170,
                  "five_year_survival_pct": 44.11765,
                  "national_weight_pct": 8.643392146654556,
                  "source_row": 51
                },
                {
                  "section": "F",
                  "births": 144,
                  "five_year_survival_pct": 20.13889,
                  "national_weight_pct": 6.91243364025704,
                  "source_row": 54
                },
                {
                  "section": "G",
                  "births": 1401,
                  "five_year_survival_pct": 35.33191,
                  "national_weight_pct": 50.095193217530756,
                  "source_row": 55
                },
                {
                  "section": "H",
                  "births": 128,
                  "five_year_survival_pct": 39.0625,
                  "national_weight_pct": 6.010283147570388,
                  "source_row": 56
                },
                {
                  "section": "I",
                  "births": 203,
                  "five_year_survival_pct": 33.00493,
                  "national_weight_pct": 11.20809883374058,
                  "source_row": 57
                },
                {
                  "section": "M",
                  "births": 176,
                  "five_year_survival_pct": 37.5,
                  "national_weight_pct": 5.272678216523719,
                  "source_row": 61
                },
                {
                  "section": "N",
                  "births": 125,
                  "five_year_survival_pct": 32,
                  "national_weight_pct": 6.86379199616947,
                  "source_row": 62
                },
                {
                  "section": "Q",
                  "births": 156,
                  "five_year_survival_pct": 43.58974,
                  "national_weight_pct": 4.994128801553493,
                  "source_row": 65
                }
              ],
              "standardised_rank": 20,
              "raw_common_rank": 21,
              "rank_change_vs_raw_common": 1,
              "rank_change_vs_primary_standardisation": -1
            },
            {
              "uf": "AC",
              "name": "Acre",
              "population": "employer_local_units",
              "cohort_year": 2017,
              "observation_year": 2022,
              "raw_full_five_year_pct": 34.65909,
              "raw_common_five_year_pct": 34.384855315457415,
              "standardised_five_year_pct": 33.58518179632072,
              "difference_from_national_common_pp": -3.874203887949413,
              "composition_shift_pp": -0.7996735191366966,
              "full_births": 704,
              "common_births": 634,
              "state_cohort_coverage_pct": 90.05681818181819,
              "min_included_sector_births": 14,
              "included_sections": [
                "C",
                "F",
                "G",
                "H",
                "I",
                "M",
                "N",
                "Q"
              ],
              "excluded_sections": [
                "A",
                "B",
                "D",
                "E",
                "J",
                "K",
                "L",
                "O",
                "P",
                "R",
                "S"
              ],
              "sector_support": [
                {
                  "section": "C",
                  "births": 37,
                  "five_year_survival_pct": 37.83784,
                  "national_weight_pct": 8.643392146654556,
                  "source_row": 72
                },
                {
                  "section": "F",
                  "births": 36,
                  "five_year_survival_pct": 19.44444,
                  "national_weight_pct": 6.91243364025704,
                  "source_row": 75
                },
                {
                  "section": "G",
                  "births": 370,
                  "five_year_survival_pct": 34.59459,
                  "national_weight_pct": 50.095193217530756,
                  "source_row": 76
                },
                {
                  "section": "H",
                  "births": 14,
                  "five_year_survival_pct": 35.71429,
                  "national_weight_pct": 6.010283147570388,
                  "source_row": 77
                },
                {
                  "section": "I",
                  "births": 55,
                  "five_year_survival_pct": 27.27273,
                  "national_weight_pct": 11.20809883374058,
                  "source_row": 78
                },
                {
                  "section": "M",
                  "births": 41,
                  "five_year_survival_pct": 39.02439,
                  "national_weight_pct": 5.272678216523719,
                  "source_row": 82
                },
                {
                  "section": "N",
                  "births": 36,
                  "five_year_survival_pct": 25,
                  "national_weight_pct": 6.86379199616947,
                  "source_row": 83
                },
                {
                  "section": "Q",
                  "births": 45,
                  "five_year_survival_pct": 53.33333,
                  "national_weight_pct": 4.994128801553493,
                  "source_row": 86
                }
              ],
              "standardised_rank": 25,
              "raw_common_rank": 25,
              "rank_change_vs_raw_common": 0,
              "rank_change_vs_primary_standardisation": 0
            },
            {
              "uf": "AM",
              "name": "Amazonas",
              "population": "employer_local_units",
              "cohort_year": 2017,
              "observation_year": 2022,
              "raw_full_five_year_pct": 35.30557,
              "raw_common_five_year_pct": 35.03401619047619,
              "standardised_five_year_pct": 34.954877866151875,
              "difference_from_national_common_pp": -2.504507818118256,
              "composition_shift_pp": -0.07913832432431178,
              "full_births": 2569,
              "common_births": 2352,
              "state_cohort_coverage_pct": 91.55313351498637,
              "min_included_sector_births": 101,
              "included_sections": [
                "C",
                "F",
                "G",
                "H",
                "I",
                "M",
                "N",
                "Q"
              ],
              "excluded_sections": [
                "A",
                "B",
                "D",
                "E",
                "J",
                "K",
                "L",
                "O",
                "P",
                "R",
                "S"
              ],
              "sector_support": [
                {
                  "section": "C",
                  "births": 131,
                  "five_year_survival_pct": 36.64122,
                  "national_weight_pct": 8.643392146654556,
                  "source_row": 93
                },
                {
                  "section": "F",
                  "births": 161,
                  "five_year_survival_pct": 20.49689,
                  "national_weight_pct": 6.91243364025704,
                  "source_row": 96
                },
                {
                  "section": "G",
                  "births": 1275,
                  "five_year_survival_pct": 36.31373,
                  "national_weight_pct": 50.095193217530756,
                  "source_row": 97
                },
                {
                  "section": "H",
                  "births": 101,
                  "five_year_survival_pct": 44.55446,
                  "national_weight_pct": 6.010283147570388,
                  "source_row": 98
                },
                {
                  "section": "I",
                  "births": 231,
                  "five_year_survival_pct": 27.70563,
                  "national_weight_pct": 11.20809883374058,
                  "source_row": 99
                },
                {
                  "section": "M",
                  "births": 123,
                  "five_year_survival_pct": 29.26829,
                  "national_weight_pct": 5.272678216523719,
                  "source_row": 103
                },
                {
                  "section": "N",
                  "births": 184,
                  "five_year_survival_pct": 41.30435,
                  "national_weight_pct": 6.86379199616947,
                  "source_row": 104
                },
                {
                  "section": "Q",
                  "births": 146,
                  "five_year_survival_pct": 40.41096,
                  "national_weight_pct": 4.994128801553493,
                  "source_row": 107
                }
              ],
              "standardised_rank": 22,
              "raw_common_rank": 24,
              "rank_change_vs_raw_common": 2,
              "rank_change_vs_primary_standardisation": 1
            },
            {
              "uf": "RR",
              "name": "Roraima",
              "population": "employer_local_units",
              "cohort_year": 2017,
              "observation_year": 2022,
              "raw_full_five_year_pct": 37.69912,
              "raw_common_five_year_pct": 37.08738027184465,
              "standardised_five_year_pct": 35.293600637851554,
              "difference_from_national_common_pp": -2.165785046418577,
              "composition_shift_pp": -1.793779633993097,
              "full_births": 565,
              "common_births": 515,
              "state_cohort_coverage_pct": 91.15044247787611,
              "min_included_sector_births": 16,
              "included_sections": [
                "C",
                "F",
                "G",
                "H",
                "I",
                "M",
                "N",
                "Q"
              ],
              "excluded_sections": [
                "A",
                "B",
                "D",
                "E",
                "J",
                "K",
                "L",
                "O",
                "P",
                "R",
                "S"
              ],
              "sector_support": [
                {
                  "section": "C",
                  "births": 36,
                  "five_year_survival_pct": 16.66667,
                  "national_weight_pct": 8.643392146654556,
                  "source_row": 114
                },
                {
                  "section": "F",
                  "births": 34,
                  "five_year_survival_pct": 29.41176,
                  "national_weight_pct": 6.91243364025704,
                  "source_row": 117
                },
                {
                  "section": "G",
                  "births": 271,
                  "five_year_survival_pct": 37.63838,
                  "national_weight_pct": 50.095193217530756,
                  "source_row": 118
                },
                {
                  "section": "H",
                  "births": 16,
                  "five_year_survival_pct": 18.75,
                  "national_weight_pct": 6.010283147570388,
                  "source_row": 119
                },
                {
                  "section": "I",
                  "births": 65,
                  "five_year_survival_pct": 38.46154,
                  "national_weight_pct": 11.20809883374058,
                  "source_row": 120
                },
                {
                  "section": "M",
                  "births": 31,
                  "five_year_survival_pct": 41.93548,
                  "national_weight_pct": 5.272678216523719,
                  "source_row": 124
                },
                {
                  "section": "N",
                  "births": 26,
                  "five_year_survival_pct": 26.92308,
                  "national_weight_pct": 6.86379199616947,
                  "source_row": 125
                },
                {
                  "section": "Q",
                  "births": 36,
                  "five_year_survival_pct": 69.44444,
                  "national_weight_pct": 4.994128801553493,
                  "source_row": 128
                }
              ],
              "standardised_rank": 21,
              "raw_common_rank": 14,
              "rank_change_vs_raw_common": -7,
              "rank_change_vs_primary_standardisation": -1
            },
            {
              "uf": "PA",
              "name": "Pará",
              "population": "employer_local_units",
              "cohort_year": 2017,
              "observation_year": 2022,
              "raw_full_five_year_pct": 38.97306,
              "raw_common_five_year_pct": 37.98536703057587,
              "standardised_five_year_pct": 37.64793557467442,
              "difference_from_national_common_pp": 0.18854989040428904,
              "composition_shift_pp": -0.3374314559014522,
              "full_births": 5940,
              "common_births": 5331,
              "state_cohort_coverage_pct": 89.74747474747475,
              "min_included_sector_births": 247,
              "included_sections": [
                "C",
                "F",
                "G",
                "H",
                "I",
                "M",
                "N",
                "Q"
              ],
              "excluded_sections": [
                "A",
                "B",
                "D",
                "E",
                "J",
                "K",
                "L",
                "O",
                "P",
                "R",
                "S"
              ],
              "sector_support": [
                {
                  "section": "C",
                  "births": 357,
                  "five_year_survival_pct": 38.65546,
                  "national_weight_pct": 8.643392146654556,
                  "source_row": 135
                },
                {
                  "section": "F",
                  "births": 309,
                  "five_year_survival_pct": 28.15534,
                  "national_weight_pct": 6.91243364025704,
                  "source_row": 138
                },
                {
                  "section": "G",
                  "births": 3181,
                  "five_year_survival_pct": 37.75542,
                  "national_weight_pct": 50.095193217530756,
                  "source_row": 139
                },
                {
                  "section": "H",
                  "births": 247,
                  "five_year_survival_pct": 39.27126,
                  "national_weight_pct": 6.010283147570388,
                  "source_row": 140
                },
                {
                  "section": "I",
                  "births": 381,
                  "five_year_survival_pct": 31.49606,
                  "national_weight_pct": 11.20809883374058,
                  "source_row": 141
                },
                {
                  "section": "M",
                  "births": 260,
                  "five_year_survival_pct": 35,
                  "national_weight_pct": 5.272678216523719,
                  "source_row": 145
                },
                {
                  "section": "N",
                  "births": 294,
                  "five_year_survival_pct": 44.89796,
                  "national_weight_pct": 6.86379199616947,
                  "source_row": 146
                },
                {
                  "section": "Q",
                  "births": 302,
                  "five_year_survival_pct": 52.64901,
                  "national_weight_pct": 4.994128801553493,
                  "source_row": 149
                }
              ],
              "standardised_rank": 8,
              "raw_common_rank": 8,
              "rank_change_vs_raw_common": 0,
              "rank_change_vs_primary_standardisation": -1
            },
            {
              "uf": "AP",
              "name": "Amapá",
              "population": "employer_local_units",
              "cohort_year": 2017,
              "observation_year": 2022,
              "raw_full_five_year_pct": 27.8607,
              "raw_common_five_year_pct": 27.839333407202215,
              "standardised_five_year_pct": 26.90378579766596,
              "difference_from_national_common_pp": -10.55559988660417,
              "composition_shift_pp": -0.935547609536254,
              "full_births": 804,
              "common_births": 722,
              "state_cohort_coverage_pct": 89.80099502487562,
              "min_included_sector_births": 12,
              "included_sections": [
                "C",
                "F",
                "G",
                "H",
                "I",
                "M",
                "N",
                "Q"
              ],
              "excluded_sections": [
                "A",
                "B",
                "D",
                "E",
                "J",
                "K",
                "L",
                "O",
                "P",
                "R",
                "S"
              ],
              "sector_support": [
                {
                  "section": "C",
                  "births": 40,
                  "five_year_survival_pct": 15,
                  "national_weight_pct": 8.643392146654556,
                  "source_row": 156
                },
                {
                  "section": "F",
                  "births": 57,
                  "five_year_survival_pct": 26.31579,
                  "national_weight_pct": 6.91243364025704,
                  "source_row": 159
                },
                {
                  "section": "G",
                  "births": 428,
                  "five_year_survival_pct": 28.50467,
                  "national_weight_pct": 50.095193217530756,
                  "source_row": 160
                },
                {
                  "section": "H",
                  "births": 12,
                  "five_year_survival_pct": 33.33333,
                  "national_weight_pct": 6.010283147570388,
                  "source_row": 161
                },
                {
                  "section": "I",
                  "births": 69,
                  "five_year_survival_pct": 15.94203,
                  "national_weight_pct": 11.20809883374058,
                  "source_row": 162
                },
                {
                  "section": "M",
                  "births": 23,
                  "five_year_survival_pct": 17.3913,
                  "national_weight_pct": 5.272678216523719,
                  "source_row": 166
                },
                {
                  "section": "N",
                  "births": 42,
                  "five_year_survival_pct": 35.71429,
                  "national_weight_pct": 6.86379199616947,
                  "source_row": 167
                },
                {
                  "section": "Q",
                  "births": 51,
                  "five_year_survival_pct": 47.05882,
                  "national_weight_pct": 4.994128801553493,
                  "source_row": 170
                }
              ],
              "standardised_rank": 27,
              "raw_common_rank": 27,
              "rank_change_vs_raw_common": 0,
              "rank_change_vs_primary_standardisation": 0
            },
            {
              "uf": "TO",
              "name": "Tocantins",
              "population": "employer_local_units",
              "cohort_year": 2017,
              "observation_year": 2022,
              "raw_full_five_year_pct": 35.7671,
              "raw_common_five_year_pct": 35.648147782921804,
              "standardised_five_year_pct": 34.60173197781485,
              "difference_from_national_common_pp": -2.857653706455281,
              "composition_shift_pp": -1.0464158051069532,
              "full_births": 2164,
              "common_births": 1944,
              "state_cohort_coverage_pct": 89.83364140480592,
              "min_included_sector_births": 96,
              "included_sections": [
                "C",
                "F",
                "G",
                "H",
                "I",
                "M",
                "N",
                "Q"
              ],
              "excluded_sections": [
                "A",
                "B",
                "D",
                "E",
                "J",
                "K",
                "L",
                "O",
                "P",
                "R",
                "S"
              ],
              "sector_support": [
                {
                  "section": "C",
                  "births": 114,
                  "five_year_survival_pct": 31.57895,
                  "national_weight_pct": 8.643392146654556,
                  "source_row": 177
                },
                {
                  "section": "F",
                  "births": 123,
                  "five_year_survival_pct": 20.3252,
                  "national_weight_pct": 6.91243364025704,
                  "source_row": 180
                },
                {
                  "section": "G",
                  "births": 1106,
                  "five_year_survival_pct": 38.0651,
                  "national_weight_pct": 50.095193217530756,
                  "source_row": 181
                },
                {
                  "section": "H",
                  "births": 96,
                  "five_year_survival_pct": 28.125,
                  "national_weight_pct": 6.010283147570388,
                  "source_row": 182
                },
                {
                  "section": "I",
                  "births": 152,
                  "five_year_survival_pct": 25,
                  "national_weight_pct": 11.20809883374058,
                  "source_row": 183
                },
                {
                  "section": "M",
                  "births": 127,
                  "five_year_survival_pct": 40.94488,
                  "national_weight_pct": 5.272678216523719,
                  "source_row": 187
                },
                {
                  "section": "N",
                  "births": 105,
                  "five_year_survival_pct": 34.28571,
                  "national_weight_pct": 6.86379199616947,
                  "source_row": 188
                },
                {
                  "section": "Q",
                  "births": 121,
                  "five_year_survival_pct": 47.93388,
                  "national_weight_pct": 4.994128801553493,
                  "source_row": 191
                }
              ],
              "standardised_rank": 24,
              "raw_common_rank": 20,
              "rank_change_vs_raw_common": -4,
              "rank_change_vs_primary_standardisation": 0
            },
            {
              "uf": "MA",
              "name": "Maranhão",
              "population": "employer_local_units",
              "cohort_year": 2017,
              "observation_year": 2022,
              "raw_full_five_year_pct": 37.88793,
              "raw_common_five_year_pct": 37.61710306509728,
              "standardised_five_year_pct": 36.91567788021235,
              "difference_from_national_common_pp": -0.5437078040577816,
              "composition_shift_pp": -0.7014251848849327,
              "full_births": 4640,
              "common_births": 4163,
              "state_cohort_coverage_pct": 89.71982758620689,
              "min_included_sector_births": 137,
              "included_sections": [
                "C",
                "F",
                "G",
                "H",
                "I",
                "M",
                "N",
                "Q"
              ],
              "excluded_sections": [
                "A",
                "B",
                "D",
                "E",
                "J",
                "K",
                "L",
                "O",
                "P",
                "R",
                "S"
              ],
              "sector_support": [
                {
                  "section": "C",
                  "births": 186,
                  "five_year_survival_pct": 33.87097,
                  "national_weight_pct": 8.643392146654556,
                  "source_row": 219
                },
                {
                  "section": "F",
                  "births": 248,
                  "five_year_survival_pct": 28.22581,
                  "national_weight_pct": 6.91243364025704,
                  "source_row": 222
                },
                {
                  "section": "G",
                  "births": 2629,
                  "five_year_survival_pct": 38.2655,
                  "national_weight_pct": 50.095193217530756,
                  "source_row": 223
                },
                {
                  "section": "H",
                  "births": 137,
                  "five_year_survival_pct": 33.57664,
                  "national_weight_pct": 6.010283147570388,
                  "source_row": 224
                },
                {
                  "section": "I",
                  "births": 303,
                  "five_year_survival_pct": 34.32343,
                  "national_weight_pct": 11.20809883374058,
                  "source_row": 225
                },
                {
                  "section": "M",
                  "births": 177,
                  "five_year_survival_pct": 32.20339,
                  "national_weight_pct": 5.272678216523719,
                  "source_row": 229
                },
                {
                  "section": "N",
                  "births": 213,
                  "five_year_survival_pct": 42.25352,
                  "national_weight_pct": 6.86379199616947,
                  "source_row": 230
                },
                {
                  "section": "Q",
                  "births": 270,
                  "five_year_survival_pct": 48.14815,
                  "national_weight_pct": 4.994128801553493,
                  "source_row": 233
                }
              ],
              "standardised_rank": 14,
              "raw_common_rank": 9,
              "rank_change_vs_raw_common": -5,
              "rank_change_vs_primary_standardisation": 1
            },
            {
              "uf": "PI",
              "name": "Piauí",
              "population": "employer_local_units",
              "cohort_year": 2017,
              "observation_year": 2022,
              "raw_full_five_year_pct": 39.91359,
              "raw_common_five_year_pct": 40.13230450202131,
              "standardised_five_year_pct": 39.24014728492223,
              "difference_from_national_common_pp": 1.7807616006520988,
              "composition_shift_pp": -0.8921572170990828,
              "full_births": 3009,
              "common_births": 2721,
              "state_cohort_coverage_pct": 90.42871385842473,
              "min_included_sector_births": 75,
              "included_sections": [
                "C",
                "F",
                "G",
                "H",
                "I",
                "M",
                "N",
                "Q"
              ],
              "excluded_sections": [
                "A",
                "B",
                "D",
                "E",
                "J",
                "K",
                "L",
                "O",
                "P",
                "R",
                "S"
              ],
              "sector_support": [
                {
                  "section": "C",
                  "births": 177,
                  "five_year_survival_pct": 42.93785,
                  "national_weight_pct": 8.643392146654556,
                  "source_row": 240
                },
                {
                  "section": "F",
                  "births": 162,
                  "five_year_survival_pct": 31.48148,
                  "national_weight_pct": 6.91243364025704,
                  "source_row": 243
                },
                {
                  "section": "G",
                  "births": 1612,
                  "five_year_survival_pct": 41.067,
                  "national_weight_pct": 50.095193217530756,
                  "source_row": 244
                },
                {
                  "section": "H",
                  "births": 75,
                  "five_year_survival_pct": 25.33333,
                  "national_weight_pct": 6.010283147570388,
                  "source_row": 245
                },
                {
                  "section": "I",
                  "births": 275,
                  "five_year_survival_pct": 33.81818,
                  "national_weight_pct": 11.20809883374058,
                  "source_row": 246
                },
                {
                  "section": "M",
                  "births": 115,
                  "five_year_survival_pct": 39.13043,
                  "national_weight_pct": 5.272678216523719,
                  "source_row": 250
                },
                {
                  "section": "N",
                  "births": 122,
                  "five_year_survival_pct": 40.16393,
                  "national_weight_pct": 6.86379199616947,
                  "source_row": 251
                },
                {
                  "section": "Q",
                  "births": 183,
                  "five_year_survival_pct": 53.00546,
                  "national_weight_pct": 4.994128801553493,
                  "source_row": 254
                }
              ],
              "standardised_rank": 4,
              "raw_common_rank": 1,
              "rank_change_vs_raw_common": -3,
              "rank_change_vs_primary_standardisation": 0
            },
            {
              "uf": "CE",
              "name": "Ceará",
              "population": "employer_local_units",
              "cohort_year": 2017,
              "observation_year": 2022,
              "raw_full_five_year_pct": 37.72613,
              "raw_common_five_year_pct": 37.02224959212778,
              "standardised_five_year_pct": 36.95344856583152,
              "difference_from_national_common_pp": -0.5059371184386094,
              "composition_shift_pp": -0.0688010262962564,
              "full_births": 7960,
              "common_births": 7012,
              "state_cohort_coverage_pct": 88.09045226130654,
              "min_included_sector_births": 289,
              "included_sections": [
                "C",
                "F",
                "G",
                "H",
                "I",
                "M",
                "N",
                "Q"
              ],
              "excluded_sections": [
                "A",
                "B",
                "D",
                "E",
                "J",
                "K",
                "L",
                "O",
                "P",
                "R",
                "S"
              ],
              "sector_support": [
                {
                  "section": "C",
                  "births": 691,
                  "five_year_survival_pct": 39.65268,
                  "national_weight_pct": 8.643392146654556,
                  "source_row": 261
                },
                {
                  "section": "F",
                  "births": 449,
                  "five_year_survival_pct": 26.72606,
                  "national_weight_pct": 6.91243364025704,
                  "source_row": 264
                },
                {
                  "section": "G",
                  "births": 3620,
                  "five_year_survival_pct": 37.29282,
                  "national_weight_pct": 50.095193217530756,
                  "source_row": 265
                },
                {
                  "section": "H",
                  "births": 289,
                  "five_year_survival_pct": 36.6782,
                  "national_weight_pct": 6.010283147570388,
                  "source_row": 266
                },
                {
                  "section": "I",
                  "births": 772,
                  "five_year_survival_pct": 31.34715,
                  "national_weight_pct": 11.20809883374058,
                  "source_row": 267
                },
                {
                  "section": "M",
                  "births": 378,
                  "five_year_survival_pct": 37.83069,
                  "national_weight_pct": 5.272678216523719,
                  "source_row": 271
                },
                {
                  "section": "N",
                  "births": 484,
                  "five_year_survival_pct": 40.49587,
                  "national_weight_pct": 6.86379199616947,
                  "source_row": 272
                },
                {
                  "section": "Q",
                  "births": 329,
                  "five_year_survival_pct": 50.15198,
                  "national_weight_pct": 4.994128801553493,
                  "source_row": 275
                }
              ],
              "standardised_rank": 13,
              "raw_common_rank": 15,
              "rank_change_vs_raw_common": 2,
              "rank_change_vs_primary_standardisation": -2
            },
            {
              "uf": "RN",
              "name": "Rio Grande do Norte",
              "population": "employer_local_units",
              "cohort_year": 2017,
              "observation_year": 2022,
              "raw_full_five_year_pct": 36.92121,
              "raw_common_five_year_pct": 35.827981209159454,
              "standardised_five_year_pct": 36.488872960870076,
              "difference_from_national_common_pp": -0.9705127234000557,
              "composition_shift_pp": 0.6608917517106221,
              "full_births": 4125,
              "common_births": 3581,
              "state_cohort_coverage_pct": 86.81212121212121,
              "min_included_sector_births": 84,
              "included_sections": [
                "C",
                "F",
                "G",
                "H",
                "I",
                "M",
                "N",
                "Q"
              ],
              "excluded_sections": [
                "A",
                "B",
                "D",
                "E",
                "J",
                "K",
                "L",
                "O",
                "P",
                "R",
                "S"
              ],
              "sector_support": [
                {
                  "section": "C",
                  "births": 324,
                  "five_year_survival_pct": 38.88889,
                  "national_weight_pct": 8.643392146654556,
                  "source_row": 282
                },
                {
                  "section": "F",
                  "births": 298,
                  "five_year_survival_pct": 22.48322,
                  "national_weight_pct": 6.91243364025704,
                  "source_row": 285
                },
                {
                  "section": "G",
                  "births": 1927,
                  "five_year_survival_pct": 36.37779,
                  "national_weight_pct": 50.095193217530756,
                  "source_row": 286
                },
                {
                  "section": "H",
                  "births": 84,
                  "five_year_survival_pct": 45.2381,
                  "national_weight_pct": 6.010283147570388,
                  "source_row": 287
                },
                {
                  "section": "I",
                  "births": 422,
                  "five_year_survival_pct": 28.90995,
                  "national_weight_pct": 11.20809883374058,
                  "source_row": 288
                },
                {
                  "section": "M",
                  "births": 143,
                  "five_year_survival_pct": 38.46154,
                  "national_weight_pct": 5.272678216523719,
                  "source_row": 292
                },
                {
                  "section": "N",
                  "births": 218,
                  "five_year_survival_pct": 36.23853,
                  "national_weight_pct": 6.86379199616947,
                  "source_row": 293
                },
                {
                  "section": "Q",
                  "births": 165,
                  "five_year_survival_pct": 57.57576,
                  "national_weight_pct": 4.994128801553493,
                  "source_row": 296
                }
              ],
              "standardised_rank": 17,
              "raw_common_rank": 19,
              "rank_change_vs_raw_common": 2,
              "rank_change_vs_primary_standardisation": -4
            },
            {
              "uf": "PB",
              "name": "Paraíba",
              "population": "employer_local_units",
              "cohort_year": 2017,
              "observation_year": 2022,
              "raw_full_five_year_pct": 40.15173,
              "raw_common_five_year_pct": 39.35155747616021,
              "standardised_five_year_pct": 39.468533088592395,
              "difference_from_national_common_pp": 2.0091474043222632,
              "composition_shift_pp": 0.11697561243218502,
              "full_births": 3559,
              "common_births": 3146,
              "state_cohort_coverage_pct": 88.39561674627704,
              "min_included_sector_births": 86,
              "included_sections": [
                "C",
                "F",
                "G",
                "H",
                "I",
                "M",
                "N",
                "Q"
              ],
              "excluded_sections": [
                "A",
                "B",
                "D",
                "E",
                "J",
                "K",
                "L",
                "O",
                "P",
                "R",
                "S"
              ],
              "sector_support": [
                {
                  "section": "C",
                  "births": 244,
                  "five_year_survival_pct": 40.57377,
                  "national_weight_pct": 8.643392146654556,
                  "source_row": 303
                },
                {
                  "section": "F",
                  "births": 300,
                  "five_year_survival_pct": 23.66667,
                  "national_weight_pct": 6.91243364025704,
                  "source_row": 306
                },
                {
                  "section": "G",
                  "births": 1715,
                  "five_year_survival_pct": 39.88338,
                  "national_weight_pct": 50.095193217530756,
                  "source_row": 307
                },
                {
                  "section": "H",
                  "births": 86,
                  "five_year_survival_pct": 32.55814,
                  "national_weight_pct": 6.010283147570388,
                  "source_row": 308
                },
                {
                  "section": "I",
                  "births": 315,
                  "five_year_survival_pct": 36.50794,
                  "national_weight_pct": 11.20809883374058,
                  "source_row": 309
                },
                {
                  "section": "M",
                  "births": 125,
                  "five_year_survival_pct": 40,
                  "national_weight_pct": 5.272678216523719,
                  "source_row": 313
                },
                {
                  "section": "N",
                  "births": 191,
                  "five_year_survival_pct": 46.0733,
                  "national_weight_pct": 6.86379199616947,
                  "source_row": 314
                },
                {
                  "section": "Q",
                  "births": 170,
                  "five_year_survival_pct": 60.58824,
                  "national_weight_pct": 4.994128801553493,
                  "source_row": 317
                }
              ],
              "standardised_rank": 3,
              "raw_common_rank": 4,
              "rank_change_vs_raw_common": 1,
              "rank_change_vs_primary_standardisation": -1
            },
            {
              "uf": "PE",
              "name": "Pernambuco",
              "population": "employer_local_units",
              "cohort_year": 2017,
              "observation_year": 2022,
              "raw_full_five_year_pct": 37.87161,
              "raw_common_five_year_pct": 37.239206074721004,
              "standardised_five_year_pct": 37.08925671729704,
              "difference_from_national_common_pp": -0.37012896697309117,
              "composition_shift_pp": -0.14994935742396365,
              "full_births": 9284,
              "common_births": 8244,
              "state_cohort_coverage_pct": 88.797931925894,
              "min_included_sector_births": 356,
              "included_sections": [
                "C",
                "F",
                "G",
                "H",
                "I",
                "M",
                "N",
                "Q"
              ],
              "excluded_sections": [
                "A",
                "B",
                "D",
                "E",
                "J",
                "K",
                "L",
                "O",
                "P",
                "R",
                "S"
              ],
              "sector_support": [
                {
                  "section": "C",
                  "births": 736,
                  "five_year_survival_pct": 39.67391,
                  "national_weight_pct": 8.643392146654556,
                  "source_row": 324
                },
                {
                  "section": "F",
                  "births": 418,
                  "five_year_survival_pct": 24.64115,
                  "national_weight_pct": 6.91243364025704,
                  "source_row": 327
                },
                {
                  "section": "G",
                  "births": 4530,
                  "five_year_survival_pct": 36.35762,
                  "national_weight_pct": 50.095193217530756,
                  "source_row": 328
                },
                {
                  "section": "H",
                  "births": 356,
                  "five_year_survival_pct": 39.32584,
                  "national_weight_pct": 6.010283147570388,
                  "source_row": 329
                },
                {
                  "section": "I",
                  "births": 898,
                  "five_year_survival_pct": 32.85078,
                  "national_weight_pct": 11.20809883374058,
                  "source_row": 330
                },
                {
                  "section": "M",
                  "births": 410,
                  "five_year_survival_pct": 38.78049,
                  "national_weight_pct": 5.272678216523719,
                  "source_row": 334
                },
                {
                  "section": "N",
                  "births": 480,
                  "five_year_survival_pct": 40.20833,
                  "national_weight_pct": 6.86379199616947,
                  "source_row": 335
                },
                {
                  "section": "Q",
                  "births": 416,
                  "five_year_survival_pct": 57.93269,
                  "national_weight_pct": 4.994128801553493,
                  "source_row": 338
                }
              ],
              "standardised_rank": 11,
              "raw_common_rank": 12,
              "rank_change_vs_raw_common": 1,
              "rank_change_vs_primary_standardisation": -1
            },
            {
              "uf": "AL",
              "name": "Alagoas",
              "population": "employer_local_units",
              "cohort_year": 2017,
              "observation_year": 2022,
              "raw_full_five_year_pct": 35.8265,
              "raw_common_five_year_pct": 35.044385449633346,
              "standardised_five_year_pct": 34.90167069622153,
              "difference_from_national_common_pp": -2.557714988048602,
              "composition_shift_pp": -0.14271475341181628,
              "full_births": 2928,
              "common_births": 2591,
              "state_cohort_coverage_pct": 88.49043715846994,
              "min_included_sector_births": 102,
              "included_sections": [
                "C",
                "F",
                "G",
                "H",
                "I",
                "M",
                "N",
                "Q"
              ],
              "excluded_sections": [
                "A",
                "B",
                "D",
                "E",
                "J",
                "K",
                "L",
                "O",
                "P",
                "R",
                "S"
              ],
              "sector_support": [
                {
                  "section": "C",
                  "births": 184,
                  "five_year_survival_pct": 31.52174,
                  "national_weight_pct": 8.643392146654556,
                  "source_row": 345
                },
                {
                  "section": "F",
                  "births": 152,
                  "five_year_survival_pct": 26.97368,
                  "national_weight_pct": 6.91243364025704,
                  "source_row": 348
                },
                {
                  "section": "G",
                  "births": 1454,
                  "five_year_survival_pct": 34.663,
                  "national_weight_pct": 50.095193217530756,
                  "source_row": 349
                },
                {
                  "section": "H",
                  "births": 109,
                  "five_year_survival_pct": 27.52294,
                  "national_weight_pct": 6.010283147570388,
                  "source_row": 350
                },
                {
                  "section": "I",
                  "births": 302,
                  "five_year_survival_pct": 32.78146,
                  "national_weight_pct": 11.20809883374058,
                  "source_row": 351
                },
                {
                  "section": "M",
                  "births": 102,
                  "five_year_survival_pct": 42.15686,
                  "national_weight_pct": 5.272678216523719,
                  "source_row": 355
                },
                {
                  "section": "N",
                  "births": 150,
                  "five_year_survival_pct": 40.66667,
                  "national_weight_pct": 6.86379199616947,
                  "source_row": 356
                },
                {
                  "section": "Q",
                  "births": 138,
                  "five_year_survival_pct": 52.17391,
                  "national_weight_pct": 4.994128801553493,
                  "source_row": 359
                }
              ],
              "standardised_rank": 23,
              "raw_common_rank": 23,
              "rank_change_vs_raw_common": 0,
              "rank_change_vs_primary_standardisation": -2
            },
            {
              "uf": "SE",
              "name": "Sergipe",
              "population": "employer_local_units",
              "cohort_year": 2017,
              "observation_year": 2022,
              "raw_full_five_year_pct": 40.45734,
              "raw_common_five_year_pct": 39.969526693753174,
              "standardised_five_year_pct": 39.98199079502487,
              "difference_from_national_common_pp": 2.522605110754739,
              "composition_shift_pp": 0.012464101271696393,
              "full_births": 2274,
              "common_births": 1969,
              "state_cohort_coverage_pct": 86.58751099384345,
              "min_included_sector_births": 80,
              "included_sections": [
                "C",
                "F",
                "G",
                "H",
                "I",
                "M",
                "N",
                "Q"
              ],
              "excluded_sections": [
                "A",
                "B",
                "D",
                "E",
                "J",
                "K",
                "L",
                "O",
                "P",
                "R",
                "S"
              ],
              "sector_support": [
                {
                  "section": "C",
                  "births": 119,
                  "five_year_survival_pct": 47.05882,
                  "national_weight_pct": 8.643392146654556,
                  "source_row": 366
                },
                {
                  "section": "F",
                  "births": 141,
                  "five_year_survival_pct": 26.95035,
                  "national_weight_pct": 6.91243364025704,
                  "source_row": 369
                },
                {
                  "section": "G",
                  "births": 1062,
                  "five_year_survival_pct": 40.86629,
                  "national_weight_pct": 50.095193217530756,
                  "source_row": 370
                },
                {
                  "section": "H",
                  "births": 80,
                  "five_year_survival_pct": 38.75,
                  "national_weight_pct": 6.010283147570388,
                  "source_row": 371
                },
                {
                  "section": "I",
                  "births": 190,
                  "five_year_survival_pct": 29.47368,
                  "national_weight_pct": 11.20809883374058,
                  "source_row": 372
                },
                {
                  "section": "M",
                  "births": 139,
                  "five_year_survival_pct": 43.88489,
                  "national_weight_pct": 5.272678216523719,
                  "source_row": 376
                },
                {
                  "section": "N",
                  "births": 147,
                  "five_year_survival_pct": 38.09524,
                  "national_weight_pct": 6.86379199616947,
                  "source_row": 377
                },
                {
                  "section": "Q",
                  "births": 91,
                  "five_year_survival_pct": 60.43956,
                  "national_weight_pct": 4.994128801553493,
                  "source_row": 380
                }
              ],
              "standardised_rank": 1,
              "raw_common_rank": 3,
              "rank_change_vs_raw_common": 2,
              "rank_change_vs_primary_standardisation": 0
            },
            {
              "uf": "BA",
              "name": "Bahia",
              "population": "employer_local_units",
              "cohort_year": 2017,
              "observation_year": 2022,
              "raw_full_five_year_pct": 37.46265,
              "raw_common_five_year_pct": 37.26356960286977,
              "standardised_five_year_pct": 37.055682323588535,
              "difference_from_national_common_pp": -0.40370336068159673,
              "composition_shift_pp": -0.20788727928123762,
              "full_births": 15394,
              "common_births": 13799,
              "state_cohort_coverage_pct": 89.63882031960505,
              "min_included_sector_births": 619,
              "included_sections": [
                "C",
                "F",
                "G",
                "H",
                "I",
                "M",
                "N",
                "Q"
              ],
              "excluded_sections": [
                "A",
                "B",
                "D",
                "E",
                "J",
                "K",
                "L",
                "O",
                "P",
                "R",
                "S"
              ],
              "sector_support": [
                {
                  "section": "C",
                  "births": 901,
                  "five_year_survival_pct": 39.17869,
                  "national_weight_pct": 8.643392146654556,
                  "source_row": 387
                },
                {
                  "section": "F",
                  "births": 818,
                  "five_year_survival_pct": 24.20538,
                  "national_weight_pct": 6.91243364025704,
                  "source_row": 390
                },
                {
                  "section": "G",
                  "births": 7901,
                  "five_year_survival_pct": 37.21048,
                  "national_weight_pct": 50.095193217530756,
                  "source_row": 391
                },
                {
                  "section": "H",
                  "births": 619,
                  "five_year_survival_pct": 33.11793,
                  "national_weight_pct": 6.010283147570388,
                  "source_row": 392
                },
                {
                  "section": "I",
                  "births": 1351,
                  "five_year_survival_pct": 31.23612,
                  "national_weight_pct": 11.20809883374058,
                  "source_row": 393
                },
                {
                  "section": "M",
                  "births": 676,
                  "five_year_survival_pct": 41.12426,
                  "national_weight_pct": 5.272678216523719,
                  "source_row": 397
                },
                {
                  "section": "N",
                  "births": 800,
                  "five_year_survival_pct": 43.375,
                  "national_weight_pct": 6.86379199616947,
                  "source_row": 398
                },
                {
                  "section": "Q",
                  "births": 733,
                  "five_year_survival_pct": 54.43383,
                  "national_weight_pct": 4.994128801553493,
                  "source_row": 401
                }
              ],
              "standardised_rank": 12,
              "raw_common_rank": 11,
              "rank_change_vs_raw_common": -1,
              "rank_change_vs_primary_standardisation": 2
            },
            {
              "uf": "MG",
              "name": "Minas Gerais",
              "population": "employer_local_units",
              "cohort_year": 2017,
              "observation_year": 2022,
              "raw_full_five_year_pct": 37.47475,
              "raw_common_five_year_pct": 37.19477854230985,
              "standardised_five_year_pct": 37.17276567902595,
              "difference_from_national_common_pp": -0.2866200052441812,
              "composition_shift_pp": -0.022012863283897843,
              "full_births": 32179,
              "common_births": 28504,
              "state_cohort_coverage_pct": 88.57950837502719,
              "min_included_sector_births": 1531,
              "included_sections": [
                "C",
                "F",
                "G",
                "H",
                "I",
                "M",
                "N",
                "Q"
              ],
              "excluded_sections": [
                "A",
                "B",
                "D",
                "E",
                "J",
                "K",
                "L",
                "O",
                "P",
                "R",
                "S"
              ],
              "sector_support": [
                {
                  "section": "C",
                  "births": 2798,
                  "five_year_survival_pct": 42.85204,
                  "national_weight_pct": 8.643392146654556,
                  "source_row": 429
                },
                {
                  "section": "F",
                  "births": 2132,
                  "five_year_survival_pct": 21.90432,
                  "national_weight_pct": 6.91243364025704,
                  "source_row": 432
                },
                {
                  "section": "G",
                  "births": 13502,
                  "five_year_survival_pct": 37.66849,
                  "national_weight_pct": 50.095193217530756,
                  "source_row": 433
                },
                {
                  "section": "H",
                  "births": 2059,
                  "five_year_survival_pct": 33.94852,
                  "national_weight_pct": 6.010283147570388,
                  "source_row": 434
                },
                {
                  "section": "I",
                  "births": 3114,
                  "five_year_survival_pct": 29.70456,
                  "national_weight_pct": 11.20809883374058,
                  "source_row": 435
                },
                {
                  "section": "M",
                  "births": 1548,
                  "five_year_survival_pct": 39.92248,
                  "national_weight_pct": 5.272678216523719,
                  "source_row": 439
                },
                {
                  "section": "N",
                  "births": 1820,
                  "five_year_survival_pct": 39.34066,
                  "national_weight_pct": 6.86379199616947,
                  "source_row": 440
                },
                {
                  "section": "Q",
                  "births": 1531,
                  "five_year_survival_pct": 58.26257,
                  "national_weight_pct": 4.994128801553493,
                  "source_row": 443
                }
              ],
              "standardised_rank": 10,
              "raw_common_rank": 13,
              "rank_change_vs_raw_common": 3,
              "rank_change_vs_primary_standardisation": 2
            },
            {
              "uf": "ES",
              "name": "Espírito Santo",
              "population": "employer_local_units",
              "cohort_year": 2017,
              "observation_year": 2022,
              "raw_full_five_year_pct": 38.94277,
              "raw_common_five_year_pct": 37.39449616697248,
              "standardised_five_year_pct": 37.335886351040664,
              "difference_from_national_common_pp": -0.12349933322946782,
              "composition_shift_pp": -0.05860981593181691,
              "full_births": 6186,
              "common_births": 5450,
              "state_cohort_coverage_pct": 88.10216618170061,
              "min_included_sector_births": 279,
              "included_sections": [
                "C",
                "F",
                "G",
                "H",
                "I",
                "M",
                "N",
                "Q"
              ],
              "excluded_sections": [
                "A",
                "B",
                "D",
                "E",
                "J",
                "K",
                "L",
                "O",
                "P",
                "R",
                "S"
              ],
              "sector_support": [
                {
                  "section": "C",
                  "births": 486,
                  "five_year_survival_pct": 43.82716,
                  "national_weight_pct": 8.643392146654556,
                  "source_row": 450
                },
                {
                  "section": "F",
                  "births": 403,
                  "five_year_survival_pct": 23.82134,
                  "national_weight_pct": 6.91243364025704,
                  "source_row": 453
                },
                {
                  "section": "G",
                  "births": 2736,
                  "five_year_survival_pct": 37.6462,
                  "national_weight_pct": 50.095193217530756,
                  "source_row": 454
                },
                {
                  "section": "H",
                  "births": 279,
                  "five_year_survival_pct": 37.63441,
                  "national_weight_pct": 6.010283147570388,
                  "source_row": 455
                },
                {
                  "section": "I",
                  "births": 617,
                  "five_year_survival_pct": 29.49757,
                  "national_weight_pct": 11.20809883374058,
                  "source_row": 456
                },
                {
                  "section": "M",
                  "births": 281,
                  "five_year_survival_pct": 39.85765,
                  "national_weight_pct": 5.272678216523719,
                  "source_row": 460
                },
                {
                  "section": "N",
                  "births": 344,
                  "five_year_survival_pct": 36.62791,
                  "national_weight_pct": 6.86379199616947,
                  "source_row": 461
                },
                {
                  "section": "Q",
                  "births": 304,
                  "five_year_survival_pct": 57.23684,
                  "national_weight_pct": 4.994128801553493,
                  "source_row": 464
                }
              ],
              "standardised_rank": 9,
              "raw_common_rank": 10,
              "rank_change_vs_raw_common": 1,
              "rank_change_vs_primary_standardisation": -1
            },
            {
              "uf": "RJ",
              "name": "Rio de Janeiro",
              "population": "employer_local_units",
              "cohort_year": 2017,
              "observation_year": 2022,
              "raw_full_five_year_pct": 38.64877,
              "raw_common_five_year_pct": 38.18107228569752,
              "standardised_five_year_pct": 38.18192181338329,
              "difference_from_national_common_pp": 0.7225361291131591,
              "composition_shift_pp": 0.000849527685772955,
              "full_births": 19597,
              "common_births": 17032,
              "state_cohort_coverage_pct": 86.9112619278461,
              "min_included_sector_births": 766,
              "included_sections": [
                "C",
                "F",
                "G",
                "H",
                "I",
                "M",
                "N",
                "Q"
              ],
              "excluded_sections": [
                "A",
                "B",
                "D",
                "E",
                "J",
                "K",
                "L",
                "O",
                "P",
                "R",
                "S"
              ],
              "sector_support": [
                {
                  "section": "C",
                  "births": 1000,
                  "five_year_survival_pct": 39.2,
                  "national_weight_pct": 8.643392146654556,
                  "source_row": 471
                },
                {
                  "section": "F",
                  "births": 990,
                  "five_year_survival_pct": 28.28283,
                  "national_weight_pct": 6.91243364025704,
                  "source_row": 474
                },
                {
                  "section": "G",
                  "births": 8431,
                  "five_year_survival_pct": 38.21611,
                  "national_weight_pct": 50.095193217530756,
                  "source_row": 475
                },
                {
                  "section": "H",
                  "births": 766,
                  "five_year_survival_pct": 42.1671,
                  "national_weight_pct": 6.010283147570388,
                  "source_row": 476
                },
                {
                  "section": "I",
                  "births": 2500,
                  "five_year_survival_pct": 31,
                  "national_weight_pct": 11.20809883374058,
                  "source_row": 477
                },
                {
                  "section": "M",
                  "births": 997,
                  "five_year_survival_pct": 44.2327,
                  "national_weight_pct": 5.272678216523719,
                  "source_row": 481
                },
                {
                  "section": "N",
                  "births": 1288,
                  "five_year_survival_pct": 39.20807,
                  "national_weight_pct": 6.86379199616947,
                  "source_row": 482
                },
                {
                  "section": "Q",
                  "births": 1060,
                  "five_year_survival_pct": 53.30189,
                  "national_weight_pct": 4.994128801553493,
                  "source_row": 485
                }
              ],
              "standardised_rank": 6,
              "raw_common_rank": 5,
              "rank_change_vs_raw_common": -1,
              "rank_change_vs_primary_standardisation": -1
            },
            {
              "uf": "SP",
              "name": "São Paulo",
              "population": "employer_local_units",
              "cohort_year": 2017,
              "observation_year": 2022,
              "raw_full_five_year_pct": 38.48101,
              "raw_common_five_year_pct": 38.11812187328906,
              "standardised_five_year_pct": 38.37801904795382,
              "difference_from_national_common_pp": 0.9186333636836892,
              "composition_shift_pp": 0.2598971746647578,
              "full_births": 77841,
              "common_births": 68676,
              "state_cohort_coverage_pct": 88.22599915211778,
              "min_included_sector_births": 3098,
              "included_sections": [
                "C",
                "F",
                "G",
                "H",
                "I",
                "M",
                "N",
                "Q"
              ],
              "excluded_sections": [
                "A",
                "B",
                "D",
                "E",
                "J",
                "K",
                "L",
                "O",
                "P",
                "R",
                "S"
              ],
              "sector_support": [
                {
                  "section": "C",
                  "births": 5119,
                  "five_year_survival_pct": 45.71205,
                  "national_weight_pct": 8.643392146654556,
                  "source_row": 492
                },
                {
                  "section": "F",
                  "births": 4763,
                  "five_year_survival_pct": 29.07831,
                  "national_weight_pct": 6.91243364025704,
                  "source_row": 495
                },
                {
                  "section": "G",
                  "births": 33106,
                  "five_year_survival_pct": 38.55797,
                  "national_weight_pct": 50.095193217530756,
                  "source_row": 496
                },
                {
                  "section": "H",
                  "births": 4538,
                  "five_year_survival_pct": 33.67122,
                  "national_weight_pct": 6.010283147570388,
                  "source_row": 497
                },
                {
                  "section": "I",
                  "births": 8538,
                  "five_year_survival_pct": 31.24854,
                  "national_weight_pct": 11.20809883374058,
                  "source_row": 498
                },
                {
                  "section": "M",
                  "births": 3719,
                  "five_year_survival_pct": 41.67787,
                  "national_weight_pct": 5.272678216523719,
                  "source_row": 502
                },
                {
                  "section": "N",
                  "births": 5795,
                  "five_year_survival_pct": 39.43054,
                  "national_weight_pct": 6.86379199616947,
                  "source_row": 503
                },
                {
                  "section": "Q",
                  "births": 3098,
                  "five_year_survival_pct": 53.48612,
                  "national_weight_pct": 4.994128801553493,
                  "source_row": 506
                }
              ],
              "standardised_rank": 5,
              "raw_common_rank": 6,
              "rank_change_vs_raw_common": 1,
              "rank_change_vs_primary_standardisation": 1
            },
            {
              "uf": "PR",
              "name": "Paraná",
              "population": "employer_local_units",
              "cohort_year": 2017,
              "observation_year": 2022,
              "raw_full_five_year_pct": 36.96242,
              "raw_common_five_year_pct": 36.55420544030663,
              "standardised_five_year_pct": 36.612521095273024,
              "difference_from_national_common_pp": -0.8468645889971071,
              "composition_shift_pp": 0.05831565496639257,
              "full_births": 23578,
              "common_births": 21133,
              "state_cohort_coverage_pct": 89.63016371193486,
              "min_included_sector_births": 933,
              "included_sections": [
                "C",
                "F",
                "G",
                "H",
                "I",
                "M",
                "N",
                "Q"
              ],
              "excluded_sections": [
                "A",
                "B",
                "D",
                "E",
                "J",
                "K",
                "L",
                "O",
                "P",
                "R",
                "S"
              ],
              "sector_support": [
                {
                  "section": "C",
                  "births": 2357,
                  "five_year_survival_pct": 41.36614,
                  "national_weight_pct": 8.643392146654556,
                  "source_row": 534
                },
                {
                  "section": "F",
                  "births": 1678,
                  "five_year_survival_pct": 24.67223,
                  "national_weight_pct": 6.91243364025704,
                  "source_row": 537
                },
                {
                  "section": "G",
                  "births": 10024,
                  "five_year_survival_pct": 36.72187,
                  "national_weight_pct": 50.095193217530756,
                  "source_row": 538
                },
                {
                  "section": "H",
                  "births": 1689,
                  "five_year_survival_pct": 35.58319,
                  "national_weight_pct": 6.010283147570388,
                  "source_row": 539
                },
                {
                  "section": "I",
                  "births": 2097,
                  "five_year_survival_pct": 27.61087,
                  "national_weight_pct": 11.20809883374058,
                  "source_row": 540
                },
                {
                  "section": "M",
                  "births": 1038,
                  "five_year_survival_pct": 40.17341,
                  "national_weight_pct": 5.272678216523719,
                  "source_row": 544
                },
                {
                  "section": "N",
                  "births": 1317,
                  "five_year_survival_pct": 42.52088,
                  "national_weight_pct": 6.86379199616947,
                  "source_row": 545
                },
                {
                  "section": "Q",
                  "births": 933,
                  "five_year_survival_pct": 53.37621,
                  "national_weight_pct": 4.994128801553493,
                  "source_row": 548
                }
              ],
              "standardised_rank": 16,
              "raw_common_rank": 17,
              "rank_change_vs_raw_common": 1,
              "rank_change_vs_primary_standardisation": 1
            },
            {
              "uf": "SC",
              "name": "Santa Catarina",
              "population": "employer_local_units",
              "cohort_year": 2017,
              "observation_year": 2022,
              "raw_full_five_year_pct": 39.98173,
              "raw_common_five_year_pct": 39.988499094045494,
              "standardised_five_year_pct": 39.79594859197641,
              "difference_from_national_common_pp": 2.3365629077062806,
              "composition_shift_pp": -0.19255050206908209,
              "full_births": 17513,
              "common_births": 15652,
              "state_cohort_coverage_pct": 89.37360817678297,
              "min_included_sector_births": 631,
              "included_sections": [
                "C",
                "F",
                "G",
                "H",
                "I",
                "M",
                "N",
                "Q"
              ],
              "excluded_sections": [
                "A",
                "B",
                "D",
                "E",
                "J",
                "K",
                "L",
                "O",
                "P",
                "R",
                "S"
              ],
              "sector_support": [
                {
                  "section": "C",
                  "births": 2345,
                  "five_year_survival_pct": 47.03625,
                  "national_weight_pct": 8.643392146654556,
                  "source_row": 555
                },
                {
                  "section": "F",
                  "births": 1250,
                  "five_year_survival_pct": 31.36,
                  "national_weight_pct": 6.91243364025704,
                  "source_row": 558
                },
                {
                  "section": "G",
                  "births": 6772,
                  "five_year_survival_pct": 39.02835,
                  "national_weight_pct": 50.095193217530756,
                  "source_row": 559
                },
                {
                  "section": "H",
                  "births": 1091,
                  "five_year_survival_pct": 39.96334,
                  "national_weight_pct": 6.010283147570388,
                  "source_row": 560
                },
                {
                  "section": "I",
                  "births": 1827,
                  "five_year_survival_pct": 31.63656,
                  "national_weight_pct": 11.20809883374058,
                  "source_row": 561
                },
                {
                  "section": "M",
                  "births": 753,
                  "five_year_survival_pct": 45.68393,
                  "national_weight_pct": 5.272678216523719,
                  "source_row": 565
                },
                {
                  "section": "N",
                  "births": 983,
                  "five_year_survival_pct": 41.91251,
                  "national_weight_pct": 6.86379199616947,
                  "source_row": 566
                },
                {
                  "section": "Q",
                  "births": 631,
                  "five_year_survival_pct": 55.62599,
                  "national_weight_pct": 4.994128801553493,
                  "source_row": 569
                }
              ],
              "standardised_rank": 2,
              "raw_common_rank": 2,
              "rank_change_vs_raw_common": 0,
              "rank_change_vs_primary_standardisation": 1
            },
            {
              "uf": "RS",
              "name": "Rio Grande do Sul",
              "population": "employer_local_units",
              "cohort_year": 2017,
              "observation_year": 2022,
              "raw_full_five_year_pct": 38.41286,
              "raw_common_five_year_pct": 38.11716428935981,
              "standardised_five_year_pct": 38.08053820185523,
              "difference_from_national_common_pp": 0.6211525175850952,
              "composition_shift_pp": -0.036626087504586735,
              "full_births": 20225,
              "common_births": 18026,
              "state_cohort_coverage_pct": 89.12731767614339,
              "min_included_sector_births": 739,
              "included_sections": [
                "C",
                "F",
                "G",
                "H",
                "I",
                "M",
                "N",
                "Q"
              ],
              "excluded_sections": [
                "A",
                "B",
                "D",
                "E",
                "J",
                "K",
                "L",
                "O",
                "P",
                "R",
                "S"
              ],
              "sector_support": [
                {
                  "section": "C",
                  "births": 2072,
                  "five_year_survival_pct": 45.46332,
                  "national_weight_pct": 8.643392146654556,
                  "source_row": 576
                },
                {
                  "section": "F",
                  "births": 1373,
                  "five_year_survival_pct": 26.58412,
                  "national_weight_pct": 6.91243364025704,
                  "source_row": 579
                },
                {
                  "section": "G",
                  "births": 8730,
                  "five_year_survival_pct": 37.77778,
                  "national_weight_pct": 50.095193217530756,
                  "source_row": 580
                },
                {
                  "section": "H",
                  "births": 1284,
                  "five_year_survival_pct": 35.12461,
                  "national_weight_pct": 6.010283147570388,
                  "source_row": 581
                },
                {
                  "section": "I",
                  "births": 1741,
                  "five_year_survival_pct": 31.87823,
                  "national_weight_pct": 11.20809883374058,
                  "source_row": 582
                },
                {
                  "section": "M",
                  "births": 980,
                  "five_year_survival_pct": 43.06122,
                  "national_weight_pct": 5.272678216523719,
                  "source_row": 586
                },
                {
                  "section": "N",
                  "births": 1107,
                  "five_year_survival_pct": 37.12737,
                  "national_weight_pct": 6.86379199616947,
                  "source_row": 587
                },
                {
                  "section": "Q",
                  "births": 739,
                  "five_year_survival_pct": 57.78078,
                  "national_weight_pct": 4.994128801553493,
                  "source_row": 590
                }
              ],
              "standardised_rank": 7,
              "raw_common_rank": 7,
              "rank_change_vs_raw_common": 0,
              "rank_change_vs_primary_standardisation": 2
            },
            {
              "uf": "MS",
              "name": "Mato Grosso do Sul",
              "population": "employer_local_units",
              "cohort_year": 2017,
              "observation_year": 2022,
              "raw_full_five_year_pct": 36.73749,
              "raw_common_five_year_pct": 36.07377887747035,
              "standardised_five_year_pct": 35.978087615495404,
              "difference_from_national_common_pp": -1.481298068774727,
              "composition_shift_pp": -0.09569126197494882,
              "full_births": 4377,
              "common_births": 3795,
              "state_cohort_coverage_pct": 86.70322138450994,
              "min_included_sector_births": 208,
              "included_sections": [
                "C",
                "F",
                "G",
                "H",
                "I",
                "M",
                "N",
                "Q"
              ],
              "excluded_sections": [
                "A",
                "B",
                "D",
                "E",
                "J",
                "K",
                "L",
                "O",
                "P",
                "R",
                "S"
              ],
              "sector_support": [
                {
                  "section": "C",
                  "births": 272,
                  "five_year_survival_pct": 35.66176,
                  "national_weight_pct": 8.643392146654556,
                  "source_row": 618
                },
                {
                  "section": "F",
                  "births": 255,
                  "five_year_survival_pct": 21.17647,
                  "national_weight_pct": 6.91243364025704,
                  "source_row": 621
                },
                {
                  "section": "G",
                  "births": 1844,
                  "five_year_survival_pct": 37.52711,
                  "national_weight_pct": 50.095193217530756,
                  "source_row": 622
                },
                {
                  "section": "H",
                  "births": 313,
                  "five_year_survival_pct": 33.22684,
                  "national_weight_pct": 6.010283147570388,
                  "source_row": 623
                },
                {
                  "section": "I",
                  "births": 429,
                  "five_year_survival_pct": 30.30303,
                  "national_weight_pct": 11.20809883374058,
                  "source_row": 624
                },
                {
                  "section": "M",
                  "births": 230,
                  "five_year_survival_pct": 43.91304,
                  "national_weight_pct": 5.272678216523719,
                  "source_row": 628
                },
                {
                  "section": "N",
                  "births": 244,
                  "five_year_survival_pct": 33.60656,
                  "national_weight_pct": 6.86379199616947,
                  "source_row": 629
                },
                {
                  "section": "Q",
                  "births": 208,
                  "five_year_survival_pct": 52.40385,
                  "national_weight_pct": 4.994128801553493,
                  "source_row": 632
                }
              ],
              "standardised_rank": 18,
              "raw_common_rank": 18,
              "rank_change_vs_raw_common": 0,
              "rank_change_vs_primary_standardisation": 0
            },
            {
              "uf": "MT",
              "name": "Mato Grosso",
              "population": "employer_local_units",
              "cohort_year": 2017,
              "observation_year": 2022,
              "raw_full_five_year_pct": 37.40725,
              "raw_common_five_year_pct": 36.91381795468948,
              "standardised_five_year_pct": 36.69953870294016,
              "difference_from_national_common_pp": -0.7598469813299715,
              "composition_shift_pp": -0.21427925174931772,
              "full_births": 7143,
              "common_births": 6312,
              "state_cohort_coverage_pct": 88.3662326753465,
              "min_included_sector_births": 334,
              "included_sections": [
                "C",
                "F",
                "G",
                "H",
                "I",
                "M",
                "N",
                "Q"
              ],
              "excluded_sections": [
                "A",
                "B",
                "D",
                "E",
                "J",
                "K",
                "L",
                "O",
                "P",
                "R",
                "S"
              ],
              "sector_support": [
                {
                  "section": "C",
                  "births": 538,
                  "five_year_survival_pct": 40.89219,
                  "national_weight_pct": 8.643392146654556,
                  "source_row": 639
                },
                {
                  "section": "F",
                  "births": 407,
                  "five_year_survival_pct": 26.53563,
                  "national_weight_pct": 6.91243364025704,
                  "source_row": 642
                },
                {
                  "section": "G",
                  "births": 3247,
                  "five_year_survival_pct": 37.69634,
                  "national_weight_pct": 50.095193217530756,
                  "source_row": 643
                },
                {
                  "section": "H",
                  "births": 495,
                  "five_year_survival_pct": 35.55556,
                  "national_weight_pct": 6.010283147570388,
                  "source_row": 644
                },
                {
                  "section": "I",
                  "births": 594,
                  "five_year_survival_pct": 28.78788,
                  "national_weight_pct": 11.20809883374058,
                  "source_row": 645
                },
                {
                  "section": "M",
                  "births": 344,
                  "five_year_survival_pct": 38.95349,
                  "national_weight_pct": 5.272678216523719,
                  "source_row": 649
                },
                {
                  "section": "N",
                  "births": 353,
                  "five_year_survival_pct": 37.11048,
                  "national_weight_pct": 6.86379199616947,
                  "source_row": 650
                },
                {
                  "section": "Q",
                  "births": 334,
                  "five_year_survival_pct": 49.7006,
                  "national_weight_pct": 4.994128801553493,
                  "source_row": 653
                }
              ],
              "standardised_rank": 15,
              "raw_common_rank": 16,
              "rank_change_vs_raw_common": 1,
              "rank_change_vs_primary_standardisation": 1
            },
            {
              "uf": "GO",
              "name": "Goiás",
              "population": "employer_local_units",
              "cohort_year": 2017,
              "observation_year": 2022,
              "raw_full_five_year_pct": 35.67973,
              "raw_common_five_year_pct": 35.38207529600974,
              "standardised_five_year_pct": 35.43535066528849,
              "difference_from_national_common_pp": -2.0240350189816425,
              "composition_shift_pp": 0.05327536927875087,
              "full_births": 12814,
              "common_births": 11503,
              "state_cohort_coverage_pct": 89.7690026533479,
              "min_included_sector_births": 467,
              "included_sections": [
                "C",
                "F",
                "G",
                "H",
                "I",
                "M",
                "N",
                "Q"
              ],
              "excluded_sections": [
                "A",
                "B",
                "D",
                "E",
                "J",
                "K",
                "L",
                "O",
                "P",
                "R",
                "S"
              ],
              "sector_support": [
                {
                  "section": "C",
                  "births": 1057,
                  "five_year_survival_pct": 38.59981,
                  "national_weight_pct": 8.643392146654556,
                  "source_row": 660
                },
                {
                  "section": "F",
                  "births": 736,
                  "five_year_survival_pct": 25.67935,
                  "national_weight_pct": 6.91243364025704,
                  "source_row": 663
                },
                {
                  "section": "G",
                  "births": 6038,
                  "five_year_survival_pct": 34.77973,
                  "national_weight_pct": 50.095193217530756,
                  "source_row": 664
                },
                {
                  "section": "H",
                  "births": 657,
                  "five_year_survival_pct": 37.59513,
                  "national_weight_pct": 6.010283147570388,
                  "source_row": 665
                },
                {
                  "section": "I",
                  "births": 1155,
                  "five_year_survival_pct": 28.22511,
                  "national_weight_pct": 11.20809883374058,
                  "source_row": 666
                },
                {
                  "section": "M",
                  "births": 599,
                  "five_year_survival_pct": 37.5626,
                  "national_weight_pct": 5.272678216523719,
                  "source_row": 670
                },
                {
                  "section": "N",
                  "births": 794,
                  "five_year_survival_pct": 40.05038,
                  "national_weight_pct": 6.86379199616947,
                  "source_row": 671
                },
                {
                  "section": "Q",
                  "births": 467,
                  "five_year_survival_pct": 55.03212,
                  "national_weight_pct": 4.994128801553493,
                  "source_row": 674
                }
              ],
              "standardised_rank": 19,
              "raw_common_rank": 22,
              "rank_change_vs_raw_common": 3,
              "rank_change_vs_primary_standardisation": 3
            },
            {
              "uf": "DF",
              "name": "Distrito Federal",
              "population": "employer_local_units",
              "cohort_year": 2017,
              "observation_year": 2022,
              "raw_full_five_year_pct": 32.56608,
              "raw_common_five_year_pct": 32.625450133584515,
              "standardised_five_year_pct": 31.878205199373735,
              "difference_from_national_common_pp": -5.581180484896397,
              "composition_shift_pp": -0.7472449342107801,
              "full_births": 6734,
              "common_births": 5839,
              "state_cohort_coverage_pct": 86.7092367092367,
              "min_included_sector_births": 196,
              "included_sections": [
                "C",
                "F",
                "G",
                "H",
                "I",
                "M",
                "N",
                "Q"
              ],
              "excluded_sections": [
                "A",
                "B",
                "D",
                "E",
                "J",
                "K",
                "L",
                "O",
                "P",
                "R",
                "S"
              ],
              "sector_support": [
                {
                  "section": "C",
                  "births": 254,
                  "five_year_survival_pct": 27.55906,
                  "national_weight_pct": 8.643392146654556,
                  "source_row": 681
                },
                {
                  "section": "F",
                  "births": 353,
                  "five_year_survival_pct": 26.34561,
                  "national_weight_pct": 6.91243364025704,
                  "source_row": 684
                },
                {
                  "section": "G",
                  "births": 2913,
                  "five_year_survival_pct": 32.8184,
                  "national_weight_pct": 50.095193217530756,
                  "source_row": 685
                },
                {
                  "section": "H",
                  "births": 196,
                  "five_year_survival_pct": 27.04082,
                  "national_weight_pct": 6.010283147570388,
                  "source_row": 686
                },
                {
                  "section": "I",
                  "births": 898,
                  "five_year_survival_pct": 26.94878,
                  "national_weight_pct": 11.20809883374058,
                  "source_row": 687
                },
                {
                  "section": "M",
                  "births": 340,
                  "five_year_survival_pct": 36.17647,
                  "national_weight_pct": 5.272678216523719,
                  "source_row": 691
                },
                {
                  "section": "N",
                  "births": 400,
                  "five_year_survival_pct": 32.5,
                  "national_weight_pct": 6.86379199616947,
                  "source_row": 692
                },
                {
                  "section": "Q",
                  "births": 485,
                  "five_year_survival_pct": 49.07216,
                  "national_weight_pct": 4.994128801553493,
                  "source_row": 695
                }
              ],
              "standardised_rank": 26,
              "raw_common_rank": 26,
              "rank_change_vs_raw_common": 0,
              "rank_change_vs_primary_standardisation": 0
            }
          ],
          "states_with_rank_change_vs_primary": 20,
          "max_absolute_rank_change_vs_primary": 4
        },
        {
          "minimum_births_in_every_state_sector": 30,
          "included_sections": [
            "C",
            "F",
            "G",
            "I",
            "Q"
          ],
          "excluded_positive_national_sections": [
            "A",
            "B",
            "D",
            "E",
            "H",
            "J",
            "K",
            "L",
            "M",
            "N",
            "O",
            "P",
            "R",
            "S"
          ],
          "national_common_births": 215396,
          "national_total_births": 296850,
          "national_cohort_coverage_pct": 72.56055246757622,
          "national_common_five_year_pct": 37.22028275887203,
          "weights_pct": {
            "C": 10.55962042006351,
            "F": 8.44491076900221,
            "G": 61.201229363590784,
            "I": 13.69291908856246,
            "Q": 6.101320358781035
          },
          "states": [
            {
              "uf": "RO",
              "name": "Rondônia",
              "population": "employer_local_units",
              "cohort_year": 2017,
              "observation_year": 2022,
              "raw_full_five_year_pct": 36.40671,
              "raw_common_five_year_pct": 35.39055294117647,
              "standardised_five_year_pct": 35.16181898735353,
              "difference_from_national_common_pp": -2.058463771518504,
              "composition_shift_pp": -0.22873395382294603,
              "full_births": 2744,
              "common_births": 2074,
              "state_cohort_coverage_pct": 75.58309037900875,
              "min_included_sector_births": 144,
              "included_sections": [
                "C",
                "F",
                "G",
                "I",
                "Q"
              ],
              "excluded_sections": [
                "A",
                "B",
                "D",
                "E",
                "H",
                "J",
                "K",
                "L",
                "M",
                "N",
                "O",
                "P",
                "R",
                "S"
              ],
              "sector_support": [
                {
                  "section": "C",
                  "births": 170,
                  "five_year_survival_pct": 44.11765,
                  "national_weight_pct": 10.55962042006351,
                  "source_row": 51
                },
                {
                  "section": "F",
                  "births": 144,
                  "five_year_survival_pct": 20.13889,
                  "national_weight_pct": 8.44491076900221,
                  "source_row": 54
                },
                {
                  "section": "G",
                  "births": 1401,
                  "five_year_survival_pct": 35.33191,
                  "national_weight_pct": 61.201229363590784,
                  "source_row": 55
                },
                {
                  "section": "I",
                  "births": 203,
                  "five_year_survival_pct": 33.00493,
                  "national_weight_pct": 13.69291908856246,
                  "source_row": 57
                },
                {
                  "section": "Q",
                  "births": 156,
                  "five_year_survival_pct": 43.58974,
                  "national_weight_pct": 6.101320358781035,
                  "source_row": 65
                }
              ],
              "standardised_rank": 20,
              "raw_common_rank": 21,
              "rank_change_vs_raw_common": 1,
              "rank_change_vs_primary_standardisation": -1
            },
            {
              "uf": "AC",
              "name": "Acre",
              "population": "employer_local_units",
              "cohort_year": 2017,
              "observation_year": 2022,
              "raw_full_five_year_pct": 34.65909,
              "raw_common_five_year_pct": 34.622464493554325,
              "standardised_five_year_pct": 33.79838243342494,
              "difference_from_national_common_pp": -3.4219003254470906,
              "composition_shift_pp": -0.8240820601293848,
              "full_births": 704,
              "common_births": 543,
              "state_cohort_coverage_pct": 77.13068181818181,
              "min_included_sector_births": 36,
              "included_sections": [
                "C",
                "F",
                "G",
                "I",
                "Q"
              ],
              "excluded_sections": [
                "A",
                "B",
                "D",
                "E",
                "H",
                "J",
                "K",
                "L",
                "M",
                "N",
                "O",
                "P",
                "R",
                "S"
              ],
              "sector_support": [
                {
                  "section": "C",
                  "births": 37,
                  "five_year_survival_pct": 37.83784,
                  "national_weight_pct": 10.55962042006351,
                  "source_row": 72
                },
                {
                  "section": "F",
                  "births": 36,
                  "five_year_survival_pct": 19.44444,
                  "national_weight_pct": 8.44491076900221,
                  "source_row": 75
                },
                {
                  "section": "G",
                  "births": 370,
                  "five_year_survival_pct": 34.59459,
                  "national_weight_pct": 61.201229363590784,
                  "source_row": 76
                },
                {
                  "section": "I",
                  "births": 55,
                  "five_year_survival_pct": 27.27273,
                  "national_weight_pct": 13.69291908856246,
                  "source_row": 78
                },
                {
                  "section": "Q",
                  "births": 45,
                  "five_year_survival_pct": 53.33333,
                  "national_weight_pct": 6.101320358781035,
                  "source_row": 86
                }
              ],
              "standardised_rank": 25,
              "raw_common_rank": 24,
              "rank_change_vs_raw_common": -1,
              "rank_change_vs_primary_standardisation": 0
            },
            {
              "uf": "AM",
              "name": "Amazonas",
              "population": "employer_local_units",
              "cohort_year": 2017,
              "observation_year": 2022,
              "raw_full_five_year_pct": 35.30557,
              "raw_common_five_year_pct": 34.310702443415636,
              "standardised_five_year_pct": 34.08387863651136,
              "difference_from_national_common_pp": -3.1364041223606733,
              "composition_shift_pp": -0.22682380690427806,
              "full_births": 2569,
              "common_births": 1944,
              "state_cohort_coverage_pct": 75.67146749708057,
              "min_included_sector_births": 131,
              "included_sections": [
                "C",
                "F",
                "G",
                "I",
                "Q"
              ],
              "excluded_sections": [
                "A",
                "B",
                "D",
                "E",
                "H",
                "J",
                "K",
                "L",
                "M",
                "N",
                "O",
                "P",
                "R",
                "S"
              ],
              "sector_support": [
                {
                  "section": "C",
                  "births": 131,
                  "five_year_survival_pct": 36.64122,
                  "national_weight_pct": 10.55962042006351,
                  "source_row": 93
                },
                {
                  "section": "F",
                  "births": 161,
                  "five_year_survival_pct": 20.49689,
                  "national_weight_pct": 8.44491076900221,
                  "source_row": 96
                },
                {
                  "section": "G",
                  "births": 1275,
                  "five_year_survival_pct": 36.31373,
                  "national_weight_pct": 61.201229363590784,
                  "source_row": 97
                },
                {
                  "section": "I",
                  "births": 231,
                  "five_year_survival_pct": 27.70563,
                  "national_weight_pct": 13.69291908856246,
                  "source_row": 99
                },
                {
                  "section": "Q",
                  "births": 146,
                  "five_year_survival_pct": 40.41096,
                  "national_weight_pct": 6.101320358781035,
                  "source_row": 107
                }
              ],
              "standardised_rank": 24,
              "raw_common_rank": 25,
              "rank_change_vs_raw_common": 1,
              "rank_change_vs_primary_standardisation": -1
            },
            {
              "uf": "RR",
              "name": "Roraima",
              "population": "employer_local_units",
              "cohort_year": 2017,
              "observation_year": 2022,
              "raw_full_five_year_pct": 37.69912,
              "raw_common_five_year_pct": 38.00905176470588,
              "standardised_five_year_pct": 36.78242055697413,
              "difference_from_national_common_pp": -0.43786220189790015,
              "composition_shift_pp": -1.2266312077317494,
              "full_births": 565,
              "common_births": 442,
              "state_cohort_coverage_pct": 78.23008849557522,
              "min_included_sector_births": 34,
              "included_sections": [
                "C",
                "F",
                "G",
                "I",
                "Q"
              ],
              "excluded_sections": [
                "A",
                "B",
                "D",
                "E",
                "H",
                "J",
                "K",
                "L",
                "M",
                "N",
                "O",
                "P",
                "R",
                "S"
              ],
              "sector_support": [
                {
                  "section": "C",
                  "births": 36,
                  "five_year_survival_pct": 16.66667,
                  "national_weight_pct": 10.55962042006351,
                  "source_row": 114
                },
                {
                  "section": "F",
                  "births": 34,
                  "five_year_survival_pct": 29.41176,
                  "national_weight_pct": 8.44491076900221,
                  "source_row": 117
                },
                {
                  "section": "G",
                  "births": 271,
                  "five_year_survival_pct": 37.63838,
                  "national_weight_pct": 61.201229363590784,
                  "source_row": 118
                },
                {
                  "section": "I",
                  "births": 65,
                  "five_year_survival_pct": 38.46154,
                  "national_weight_pct": 13.69291908856246,
                  "source_row": 120
                },
                {
                  "section": "Q",
                  "births": 36,
                  "five_year_survival_pct": 69.44444,
                  "national_weight_pct": 6.101320358781035,
                  "source_row": 128
                }
              ],
              "standardised_rank": 12,
              "raw_common_rank": 7,
              "rank_change_vs_raw_common": -5,
              "rank_change_vs_primary_standardisation": 8
            },
            {
              "uf": "PA",
              "name": "Pará",
              "population": "employer_local_units",
              "cohort_year": 2017,
              "observation_year": 2022,
              "raw_full_five_year_pct": 38.97306,
              "raw_common_five_year_pct": 37.63796692715232,
              "standardised_five_year_pct": 37.09135915643745,
              "difference_from_national_common_pp": -0.12892360243458256,
              "composition_shift_pp": -0.5466077707148713,
              "full_births": 5940,
              "common_births": 4530,
              "state_cohort_coverage_pct": 76.26262626262626,
              "min_included_sector_births": 302,
              "included_sections": [
                "C",
                "F",
                "G",
                "I",
                "Q"
              ],
              "excluded_sections": [
                "A",
                "B",
                "D",
                "E",
                "H",
                "J",
                "K",
                "L",
                "M",
                "N",
                "O",
                "P",
                "R",
                "S"
              ],
              "sector_support": [
                {
                  "section": "C",
                  "births": 357,
                  "five_year_survival_pct": 38.65546,
                  "national_weight_pct": 10.55962042006351,
                  "source_row": 135
                },
                {
                  "section": "F",
                  "births": 309,
                  "five_year_survival_pct": 28.15534,
                  "national_weight_pct": 8.44491076900221,
                  "source_row": 138
                },
                {
                  "section": "G",
                  "births": 3181,
                  "five_year_survival_pct": 37.75542,
                  "national_weight_pct": 61.201229363590784,
                  "source_row": 139
                },
                {
                  "section": "I",
                  "births": 381,
                  "five_year_survival_pct": 31.49606,
                  "national_weight_pct": 13.69291908856246,
                  "source_row": 141
                },
                {
                  "section": "Q",
                  "births": 302,
                  "five_year_survival_pct": 52.64901,
                  "national_weight_pct": 6.101320358781035,
                  "source_row": 149
                }
              ],
              "standardised_rank": 9,
              "raw_common_rank": 9,
              "rank_change_vs_raw_common": 0,
              "rank_change_vs_primary_standardisation": -2
            },
            {
              "uf": "AP",
              "name": "Amapá",
              "population": "employer_local_units",
              "cohort_year": 2017,
              "observation_year": 2022,
              "raw_full_five_year_pct": 27.8607,
              "raw_common_five_year_pct": 27.596897178294576,
              "standardised_five_year_pct": 26.305635146938663,
              "difference_from_national_common_pp": -10.914647611933368,
              "composition_shift_pp": -1.291262031355913,
              "full_births": 804,
              "common_births": 645,
              "state_cohort_coverage_pct": 80.22388059701493,
              "min_included_sector_births": 40,
              "included_sections": [
                "C",
                "F",
                "G",
                "I",
                "Q"
              ],
              "excluded_sections": [
                "A",
                "B",
                "D",
                "E",
                "H",
                "J",
                "K",
                "L",
                "M",
                "N",
                "O",
                "P",
                "R",
                "S"
              ],
              "sector_support": [
                {
                  "section": "C",
                  "births": 40,
                  "five_year_survival_pct": 15,
                  "national_weight_pct": 10.55962042006351,
                  "source_row": 156
                },
                {
                  "section": "F",
                  "births": 57,
                  "five_year_survival_pct": 26.31579,
                  "national_weight_pct": 8.44491076900221,
                  "source_row": 159
                },
                {
                  "section": "G",
                  "births": 428,
                  "five_year_survival_pct": 28.50467,
                  "national_weight_pct": 61.201229363590784,
                  "source_row": 160
                },
                {
                  "section": "I",
                  "births": 69,
                  "five_year_survival_pct": 15.94203,
                  "national_weight_pct": 13.69291908856246,
                  "source_row": 162
                },
                {
                  "section": "Q",
                  "births": 51,
                  "five_year_survival_pct": 47.05882,
                  "national_weight_pct": 6.101320358781035,
                  "source_row": 170
                }
              ],
              "standardised_rank": 27,
              "raw_common_rank": 27,
              "rank_change_vs_raw_common": 0,
              "rank_change_vs_primary_standardisation": 0
            },
            {
              "uf": "TO",
              "name": "Tocantins",
              "population": "employer_local_units",
              "cohort_year": 2017,
              "observation_year": 2022,
              "raw_full_five_year_pct": 35.7671,
              "raw_common_five_year_pct": 35.76732672029703,
              "standardised_five_year_pct": 34.69520076607736,
              "difference_from_national_common_pp": -2.525081992794668,
              "composition_shift_pp": -1.0721259542196648,
              "full_births": 2164,
              "common_births": 1616,
              "state_cohort_coverage_pct": 74.67652495378928,
              "min_included_sector_births": 114,
              "included_sections": [
                "C",
                "F",
                "G",
                "I",
                "Q"
              ],
              "excluded_sections": [
                "A",
                "B",
                "D",
                "E",
                "H",
                "J",
                "K",
                "L",
                "M",
                "N",
                "O",
                "P",
                "R",
                "S"
              ],
              "sector_support": [
                {
                  "section": "C",
                  "births": 114,
                  "five_year_survival_pct": 31.57895,
                  "national_weight_pct": 10.55962042006351,
                  "source_row": 177
                },
                {
                  "section": "F",
                  "births": 123,
                  "five_year_survival_pct": 20.3252,
                  "national_weight_pct": 8.44491076900221,
                  "source_row": 180
                },
                {
                  "section": "G",
                  "births": 1106,
                  "five_year_survival_pct": 38.0651,
                  "national_weight_pct": 61.201229363590784,
                  "source_row": 181
                },
                {
                  "section": "I",
                  "births": 152,
                  "five_year_survival_pct": 25,
                  "national_weight_pct": 13.69291908856246,
                  "source_row": 183
                },
                {
                  "section": "Q",
                  "births": 121,
                  "five_year_survival_pct": 47.93388,
                  "national_weight_pct": 6.101320358781035,
                  "source_row": 191
                }
              ],
              "standardised_rank": 22,
              "raw_common_rank": 19,
              "rank_change_vs_raw_common": -3,
              "rank_change_vs_primary_standardisation": 2
            },
            {
              "uf": "MA",
              "name": "Maranhão",
              "population": "employer_local_units",
              "cohort_year": 2017,
              "observation_year": 2022,
              "raw_full_five_year_pct": 37.88793,
              "raw_common_five_year_pct": 37.76127628987899,
              "standardised_five_year_pct": 37.01679913169232,
              "difference_from_national_common_pp": -0.20348362717970758,
              "composition_shift_pp": -0.7444771581866689,
              "full_births": 4640,
              "common_births": 3636,
              "state_cohort_coverage_pct": 78.36206896551724,
              "min_included_sector_births": 186,
              "included_sections": [
                "C",
                "F",
                "G",
                "I",
                "Q"
              ],
              "excluded_sections": [
                "A",
                "B",
                "D",
                "E",
                "H",
                "J",
                "K",
                "L",
                "M",
                "N",
                "O",
                "P",
                "R",
                "S"
              ],
              "sector_support": [
                {
                  "section": "C",
                  "births": 186,
                  "five_year_survival_pct": 33.87097,
                  "national_weight_pct": 10.55962042006351,
                  "source_row": 219
                },
                {
                  "section": "F",
                  "births": 248,
                  "five_year_survival_pct": 28.22581,
                  "national_weight_pct": 8.44491076900221,
                  "source_row": 222
                },
                {
                  "section": "G",
                  "births": 2629,
                  "five_year_survival_pct": 38.2655,
                  "national_weight_pct": 61.201229363590784,
                  "source_row": 223
                },
                {
                  "section": "I",
                  "births": 303,
                  "five_year_survival_pct": 34.32343,
                  "national_weight_pct": 13.69291908856246,
                  "source_row": 225
                },
                {
                  "section": "Q",
                  "births": 270,
                  "five_year_survival_pct": 48.14815,
                  "national_weight_pct": 6.101320358781035,
                  "source_row": 233
                }
              ],
              "standardised_rank": 11,
              "raw_common_rank": 8,
              "rank_change_vs_raw_common": -3,
              "rank_change_vs_primary_standardisation": 4
            },
            {
              "uf": "PI",
              "name": "Piauí",
              "population": "employer_local_units",
              "cohort_year": 2017,
              "observation_year": 2022,
              "raw_full_five_year_pct": 39.91359,
              "raw_common_five_year_pct": 40.639270190950604,
              "standardised_five_year_pct": 40.190894680913296,
              "difference_from_national_common_pp": 2.9706119220412646,
              "composition_shift_pp": -0.4483755100373088,
              "full_births": 3009,
              "common_births": 2409,
              "state_cohort_coverage_pct": 80.05982053838484,
              "min_included_sector_births": 162,
              "included_sections": [
                "C",
                "F",
                "G",
                "I",
                "Q"
              ],
              "excluded_sections": [
                "A",
                "B",
                "D",
                "E",
                "H",
                "J",
                "K",
                "L",
                "M",
                "N",
                "O",
                "P",
                "R",
                "S"
              ],
              "sector_support": [
                {
                  "section": "C",
                  "births": 177,
                  "five_year_survival_pct": 42.93785,
                  "national_weight_pct": 10.55962042006351,
                  "source_row": 240
                },
                {
                  "section": "F",
                  "births": 162,
                  "five_year_survival_pct": 31.48148,
                  "national_weight_pct": 8.44491076900221,
                  "source_row": 243
                },
                {
                  "section": "G",
                  "births": 1612,
                  "five_year_survival_pct": 41.067,
                  "national_weight_pct": 61.201229363590784,
                  "source_row": 244
                },
                {
                  "section": "I",
                  "births": 275,
                  "five_year_survival_pct": 33.81818,
                  "national_weight_pct": 13.69291908856246,
                  "source_row": 246
                },
                {
                  "section": "Q",
                  "births": 183,
                  "five_year_survival_pct": 53.00546,
                  "national_weight_pct": 6.101320358781035,
                  "source_row": 254
                }
              ],
              "standardised_rank": 1,
              "raw_common_rank": 1,
              "rank_change_vs_raw_common": 0,
              "rank_change_vs_primary_standardisation": 3
            },
            {
              "uf": "CE",
              "name": "Ceará",
              "population": "employer_local_units",
              "cohort_year": 2017,
              "observation_year": 2022,
              "raw_full_five_year_pct": 37.72613,
              "raw_common_five_year_pct": 36.7002239276574,
              "standardised_five_year_pct": 36.62010156994559,
              "difference_from_national_common_pp": -0.6001811889264417,
              "composition_shift_pp": -0.08012235771180798,
              "full_births": 7960,
              "common_births": 5861,
              "state_cohort_coverage_pct": 73.63065326633166,
              "min_included_sector_births": 329,
              "included_sections": [
                "C",
                "F",
                "G",
                "I",
                "Q"
              ],
              "excluded_sections": [
                "A",
                "B",
                "D",
                "E",
                "H",
                "J",
                "K",
                "L",
                "M",
                "N",
                "O",
                "P",
                "R",
                "S"
              ],
              "sector_support": [
                {
                  "section": "C",
                  "births": 691,
                  "five_year_survival_pct": 39.65268,
                  "national_weight_pct": 10.55962042006351,
                  "source_row": 261
                },
                {
                  "section": "F",
                  "births": 449,
                  "five_year_survival_pct": 26.72606,
                  "national_weight_pct": 8.44491076900221,
                  "source_row": 264
                },
                {
                  "section": "G",
                  "births": 3620,
                  "five_year_survival_pct": 37.29282,
                  "national_weight_pct": 61.201229363590784,
                  "source_row": 265
                },
                {
                  "section": "I",
                  "births": 772,
                  "five_year_survival_pct": 31.34715,
                  "national_weight_pct": 13.69291908856246,
                  "source_row": 267
                },
                {
                  "section": "Q",
                  "births": 329,
                  "five_year_survival_pct": 50.15198,
                  "national_weight_pct": 6.101320358781035,
                  "source_row": 275
                }
              ],
              "standardised_rank": 13,
              "raw_common_rank": 16,
              "rank_change_vs_raw_common": 3,
              "rank_change_vs_primary_standardisation": -2
            },
            {
              "uf": "RN",
              "name": "Rio Grande do Norte",
              "population": "employer_local_units",
              "cohort_year": 2017,
              "observation_year": 2022,
              "raw_full_five_year_pct": 36.92121,
              "raw_common_five_year_pct": 35.42729609375,
              "standardised_five_year_pct": 35.74035936052666,
              "difference_from_national_common_pp": -1.4799233983453703,
              "composition_shift_pp": 0.3130632667766591,
              "full_births": 4125,
              "common_births": 3136,
              "state_cohort_coverage_pct": 76.02424242424243,
              "min_included_sector_births": 165,
              "included_sections": [
                "C",
                "F",
                "G",
                "I",
                "Q"
              ],
              "excluded_sections": [
                "A",
                "B",
                "D",
                "E",
                "H",
                "J",
                "K",
                "L",
                "M",
                "N",
                "O",
                "P",
                "R",
                "S"
              ],
              "sector_support": [
                {
                  "section": "C",
                  "births": 324,
                  "five_year_survival_pct": 38.88889,
                  "national_weight_pct": 10.55962042006351,
                  "source_row": 282
                },
                {
                  "section": "F",
                  "births": 298,
                  "five_year_survival_pct": 22.48322,
                  "national_weight_pct": 8.44491076900221,
                  "source_row": 285
                },
                {
                  "section": "G",
                  "births": 1927,
                  "five_year_survival_pct": 36.37779,
                  "national_weight_pct": 61.201229363590784,
                  "source_row": 286
                },
                {
                  "section": "I",
                  "births": 422,
                  "five_year_survival_pct": 28.90995,
                  "national_weight_pct": 13.69291908856246,
                  "source_row": 288
                },
                {
                  "section": "Q",
                  "births": 165,
                  "five_year_survival_pct": 57.57576,
                  "national_weight_pct": 6.101320358781035,
                  "source_row": 296
                }
              ],
              "standardised_rank": 19,
              "raw_common_rank": 20,
              "rank_change_vs_raw_common": 1,
              "rank_change_vs_primary_standardisation": -6
            },
            {
              "uf": "PB",
              "name": "Paraíba",
              "population": "employer_local_units",
              "cohort_year": 2017,
              "observation_year": 2022,
              "raw_full_five_year_pct": 40.15173,
              "raw_common_five_year_pct": 39.06705520408163,
              "standardised_five_year_pct": 39.387869444604355,
              "difference_from_national_common_pp": 2.1675866857323243,
              "composition_shift_pp": 0.3208142405227221,
              "full_births": 3559,
              "common_births": 2744,
              "state_cohort_coverage_pct": 77.10030907558303,
              "min_included_sector_births": 170,
              "included_sections": [
                "C",
                "F",
                "G",
                "I",
                "Q"
              ],
              "excluded_sections": [
                "A",
                "B",
                "D",
                "E",
                "H",
                "J",
                "K",
                "L",
                "M",
                "N",
                "O",
                "P",
                "R",
                "S"
              ],
              "sector_support": [
                {
                  "section": "C",
                  "births": 244,
                  "five_year_survival_pct": 40.57377,
                  "national_weight_pct": 10.55962042006351,
                  "source_row": 303
                },
                {
                  "section": "F",
                  "births": 300,
                  "five_year_survival_pct": 23.66667,
                  "national_weight_pct": 8.44491076900221,
                  "source_row": 306
                },
                {
                  "section": "G",
                  "births": 1715,
                  "five_year_survival_pct": 39.88338,
                  "national_weight_pct": 61.201229363590784,
                  "source_row": 307
                },
                {
                  "section": "I",
                  "births": 315,
                  "five_year_survival_pct": 36.50794,
                  "national_weight_pct": 13.69291908856246,
                  "source_row": 309
                },
                {
                  "section": "Q",
                  "births": 170,
                  "five_year_survival_pct": 60.58824,
                  "national_weight_pct": 6.101320358781035,
                  "source_row": 317
                }
              ],
              "standardised_rank": 3,
              "raw_common_rank": 4,
              "rank_change_vs_raw_common": 1,
              "rank_change_vs_primary_standardisation": -1
            },
            {
              "uf": "PE",
              "name": "Pernambuco",
              "population": "employer_local_units",
              "cohort_year": 2017,
              "observation_year": 2022,
              "raw_full_five_year_pct": 37.87161,
              "raw_common_five_year_pct": 36.83909924835667,
              "standardised_five_year_pct": 36.55453757381753,
              "difference_from_national_common_pp": -0.6657451850545044,
              "composition_shift_pp": -0.28456167453914105,
              "full_births": 9284,
              "common_births": 6998,
              "state_cohort_coverage_pct": 75.37699267557088,
              "min_included_sector_births": 416,
              "included_sections": [
                "C",
                "F",
                "G",
                "I",
                "Q"
              ],
              "excluded_sections": [
                "A",
                "B",
                "D",
                "E",
                "H",
                "J",
                "K",
                "L",
                "M",
                "N",
                "O",
                "P",
                "R",
                "S"
              ],
              "sector_support": [
                {
                  "section": "C",
                  "births": 736,
                  "five_year_survival_pct": 39.67391,
                  "national_weight_pct": 10.55962042006351,
                  "source_row": 324
                },
                {
                  "section": "F",
                  "births": 418,
                  "five_year_survival_pct": 24.64115,
                  "national_weight_pct": 8.44491076900221,
                  "source_row": 327
                },
                {
                  "section": "G",
                  "births": 4530,
                  "five_year_survival_pct": 36.35762,
                  "national_weight_pct": 61.201229363590784,
                  "source_row": 328
                },
                {
                  "section": "I",
                  "births": 898,
                  "five_year_survival_pct": 32.85078,
                  "national_weight_pct": 13.69291908856246,
                  "source_row": 330
                },
                {
                  "section": "Q",
                  "births": 416,
                  "five_year_survival_pct": 57.93269,
                  "national_weight_pct": 6.101320358781035,
                  "source_row": 338
                }
              ],
              "standardised_rank": 15,
              "raw_common_rank": 15,
              "rank_change_vs_raw_common": 0,
              "rank_change_vs_primary_standardisation": -5
            },
            {
              "uf": "AL",
              "name": "Alagoas",
              "population": "employer_local_units",
              "cohort_year": 2017,
              "observation_year": 2022,
              "raw_full_five_year_pct": 35.8265,
              "raw_common_five_year_pct": 34.708521085201795,
              "standardised_five_year_pct": 34.49269762186856,
              "difference_from_national_common_pp": -2.727585137003473,
              "composition_shift_pp": -0.215823463333237,
              "full_births": 2928,
              "common_births": 2230,
              "state_cohort_coverage_pct": 76.16120218579235,
              "min_included_sector_births": 138,
              "included_sections": [
                "C",
                "F",
                "G",
                "I",
                "Q"
              ],
              "excluded_sections": [
                "A",
                "B",
                "D",
                "E",
                "H",
                "J",
                "K",
                "L",
                "M",
                "N",
                "O",
                "P",
                "R",
                "S"
              ],
              "sector_support": [
                {
                  "section": "C",
                  "births": 184,
                  "five_year_survival_pct": 31.52174,
                  "national_weight_pct": 10.55962042006351,
                  "source_row": 345
                },
                {
                  "section": "F",
                  "births": 152,
                  "five_year_survival_pct": 26.97368,
                  "national_weight_pct": 8.44491076900221,
                  "source_row": 348
                },
                {
                  "section": "G",
                  "births": 1454,
                  "five_year_survival_pct": 34.663,
                  "national_weight_pct": 61.201229363590784,
                  "source_row": 349
                },
                {
                  "section": "I",
                  "births": 302,
                  "five_year_survival_pct": 32.78146,
                  "national_weight_pct": 13.69291908856246,
                  "source_row": 351
                },
                {
                  "section": "Q",
                  "births": 138,
                  "five_year_survival_pct": 52.17391,
                  "national_weight_pct": 6.101320358781035,
                  "source_row": 359
                }
              ],
              "standardised_rank": 23,
              "raw_common_rank": 22,
              "rank_change_vs_raw_common": -1,
              "rank_change_vs_primary_standardisation": -2
            },
            {
              "uf": "SE",
              "name": "Sergipe",
              "population": "employer_local_units",
              "cohort_year": 2017,
              "observation_year": 2022,
              "raw_full_five_year_pct": 40.45734,
              "raw_common_five_year_pct": 39.86275612601373,
              "standardised_five_year_pct": 39.97925598474438,
              "difference_from_national_common_pp": 2.758973225872346,
              "composition_shift_pp": 0.1164998587306485,
              "full_births": 2274,
              "common_births": 1603,
              "state_cohort_coverage_pct": 70.49252418645558,
              "min_included_sector_births": 91,
              "included_sections": [
                "C",
                "F",
                "G",
                "I",
                "Q"
              ],
              "excluded_sections": [
                "A",
                "B",
                "D",
                "E",
                "H",
                "J",
                "K",
                "L",
                "M",
                "N",
                "O",
                "P",
                "R",
                "S"
              ],
              "sector_support": [
                {
                  "section": "C",
                  "births": 119,
                  "five_year_survival_pct": 47.05882,
                  "national_weight_pct": 10.55962042006351,
                  "source_row": 366
                },
                {
                  "section": "F",
                  "births": 141,
                  "five_year_survival_pct": 26.95035,
                  "national_weight_pct": 8.44491076900221,
                  "source_row": 369
                },
                {
                  "section": "G",
                  "births": 1062,
                  "five_year_survival_pct": 40.86629,
                  "national_weight_pct": 61.201229363590784,
                  "source_row": 370
                },
                {
                  "section": "I",
                  "births": 190,
                  "five_year_survival_pct": 29.47368,
                  "national_weight_pct": 13.69291908856246,
                  "source_row": 372
                },
                {
                  "section": "Q",
                  "births": 91,
                  "five_year_survival_pct": 60.43956,
                  "national_weight_pct": 6.101320358781035,
                  "source_row": 380
                }
              ],
              "standardised_rank": 2,
              "raw_common_rank": 2,
              "rank_change_vs_raw_common": 0,
              "rank_change_vs_primary_standardisation": -1
            },
            {
              "uf": "BA",
              "name": "Bahia",
              "population": "employer_local_units",
              "cohort_year": 2017,
              "observation_year": 2022,
              "raw_full_five_year_pct": 37.46265,
              "raw_common_five_year_pct": 36.8421051367054,
              "standardised_five_year_pct": 36.552833893804895,
              "difference_from_national_common_pp": -0.6674488650671364,
              "composition_shift_pp": -0.28927124290050443,
              "full_births": 15394,
              "common_births": 11704,
              "state_cohort_coverage_pct": 76.02962193062233,
              "min_included_sector_births": 733,
              "included_sections": [
                "C",
                "F",
                "G",
                "I",
                "Q"
              ],
              "excluded_sections": [
                "A",
                "B",
                "D",
                "E",
                "H",
                "J",
                "K",
                "L",
                "M",
                "N",
                "O",
                "P",
                "R",
                "S"
              ],
              "sector_support": [
                {
                  "section": "C",
                  "births": 901,
                  "five_year_survival_pct": 39.17869,
                  "national_weight_pct": 10.55962042006351,
                  "source_row": 387
                },
                {
                  "section": "F",
                  "births": 818,
                  "five_year_survival_pct": 24.20538,
                  "national_weight_pct": 8.44491076900221,
                  "source_row": 390
                },
                {
                  "section": "G",
                  "births": 7901,
                  "five_year_survival_pct": 37.21048,
                  "national_weight_pct": 61.201229363590784,
                  "source_row": 391
                },
                {
                  "section": "I",
                  "births": 1351,
                  "five_year_survival_pct": 31.23612,
                  "national_weight_pct": 13.69291908856246,
                  "source_row": 393
                },
                {
                  "section": "Q",
                  "births": 733,
                  "five_year_survival_pct": 54.43383,
                  "national_weight_pct": 6.101320358781035,
                  "source_row": 401
                }
              ],
              "standardised_rank": 16,
              "raw_common_rank": 14,
              "rank_change_vs_raw_common": -2,
              "rank_change_vs_primary_standardisation": -2
            },
            {
              "uf": "MG",
              "name": "Minas Gerais",
              "population": "employer_local_units",
              "cohort_year": 2017,
              "observation_year": 2022,
              "raw_full_five_year_pct": 37.47475,
              "raw_common_five_year_pct": 37.13220802747324,
              "standardised_five_year_pct": 37.05059941888428,
              "difference_from_national_common_pp": -0.1696833399877491,
              "composition_shift_pp": -0.08160860858895802,
              "full_births": 32179,
              "common_births": 23077,
              "state_cohort_coverage_pct": 71.71447217129183,
              "min_included_sector_births": 1531,
              "included_sections": [
                "C",
                "F",
                "G",
                "I",
                "Q"
              ],
              "excluded_sections": [
                "A",
                "B",
                "D",
                "E",
                "H",
                "J",
                "K",
                "L",
                "M",
                "N",
                "O",
                "P",
                "R",
                "S"
              ],
              "sector_support": [
                {
                  "section": "C",
                  "births": 2798,
                  "five_year_survival_pct": 42.85204,
                  "national_weight_pct": 10.55962042006351,
                  "source_row": 429
                },
                {
                  "section": "F",
                  "births": 2132,
                  "five_year_survival_pct": 21.90432,
                  "national_weight_pct": 8.44491076900221,
                  "source_row": 432
                },
                {
                  "section": "G",
                  "births": 13502,
                  "five_year_survival_pct": 37.66849,
                  "national_weight_pct": 61.201229363590784,
                  "source_row": 433
                },
                {
                  "section": "I",
                  "births": 3114,
                  "five_year_survival_pct": 29.70456,
                  "national_weight_pct": 13.69291908856246,
                  "source_row": 435
                },
                {
                  "section": "Q",
                  "births": 1531,
                  "five_year_survival_pct": 58.26257,
                  "national_weight_pct": 6.101320358781035,
                  "source_row": 443
                }
              ],
              "standardised_rank": 10,
              "raw_common_rank": 12,
              "rank_change_vs_raw_common": 2,
              "rank_change_vs_primary_standardisation": 2
            },
            {
              "uf": "ES",
              "name": "Espírito Santo",
              "population": "employer_local_units",
              "cohort_year": 2017,
              "observation_year": 2022,
              "raw_full_five_year_pct": 38.94277,
              "raw_common_five_year_pct": 37.2855264034316,
              "standardised_five_year_pct": 37.21089121738565,
              "difference_from_national_common_pp": -0.009391541486380106,
              "composition_shift_pp": -0.07463518604594555,
              "full_births": 6186,
              "common_births": 4546,
              "state_cohort_coverage_pct": 73.48852247009376,
              "min_included_sector_births": 304,
              "included_sections": [
                "C",
                "F",
                "G",
                "I",
                "Q"
              ],
              "excluded_sections": [
                "A",
                "B",
                "D",
                "E",
                "H",
                "J",
                "K",
                "L",
                "M",
                "N",
                "O",
                "P",
                "R",
                "S"
              ],
              "sector_support": [
                {
                  "section": "C",
                  "births": 486,
                  "five_year_survival_pct": 43.82716,
                  "national_weight_pct": 10.55962042006351,
                  "source_row": 450
                },
                {
                  "section": "F",
                  "births": 403,
                  "five_year_survival_pct": 23.82134,
                  "national_weight_pct": 8.44491076900221,
                  "source_row": 453
                },
                {
                  "section": "G",
                  "births": 2736,
                  "five_year_survival_pct": 37.6462,
                  "national_weight_pct": 61.201229363590784,
                  "source_row": 454
                },
                {
                  "section": "I",
                  "births": 617,
                  "five_year_survival_pct": 29.49757,
                  "national_weight_pct": 13.69291908856246,
                  "source_row": 456
                },
                {
                  "section": "Q",
                  "births": 304,
                  "five_year_survival_pct": 57.23684,
                  "national_weight_pct": 6.101320358781035,
                  "source_row": 464
                }
              ],
              "standardised_rank": 8,
              "raw_common_rank": 11,
              "rank_change_vs_raw_common": 3,
              "rank_change_vs_primary_standardisation": 0
            },
            {
              "uf": "RJ",
              "name": "Rio de Janeiro",
              "population": "employer_local_units",
              "cohort_year": 2017,
              "observation_year": 2022,
              "raw_full_five_year_pct": 38.64877,
              "raw_common_five_year_pct": 37.436523031971966,
              "standardised_five_year_pct": 37.413484079695074,
              "difference_from_national_common_pp": 0.19320132082304298,
              "composition_shift_pp": -0.023038952276891678,
              "full_births": 19597,
              "common_births": 13981,
              "state_cohort_coverage_pct": 71.34255243149461,
              "min_included_sector_births": 990,
              "included_sections": [
                "C",
                "F",
                "G",
                "I",
                "Q"
              ],
              "excluded_sections": [
                "A",
                "B",
                "D",
                "E",
                "H",
                "J",
                "K",
                "L",
                "M",
                "N",
                "O",
                "P",
                "R",
                "S"
              ],
              "sector_support": [
                {
                  "section": "C",
                  "births": 1000,
                  "five_year_survival_pct": 39.2,
                  "national_weight_pct": 10.55962042006351,
                  "source_row": 471
                },
                {
                  "section": "F",
                  "births": 990,
                  "five_year_survival_pct": 28.28283,
                  "national_weight_pct": 8.44491076900221,
                  "source_row": 474
                },
                {
                  "section": "G",
                  "births": 8431,
                  "five_year_survival_pct": 38.21611,
                  "national_weight_pct": 61.201229363590784,
                  "source_row": 475
                },
                {
                  "section": "I",
                  "births": 2500,
                  "five_year_survival_pct": 31,
                  "national_weight_pct": 13.69291908856246,
                  "source_row": 477
                },
                {
                  "section": "Q",
                  "births": 1060,
                  "five_year_survival_pct": 53.30189,
                  "national_weight_pct": 6.101320358781035,
                  "source_row": 485
                }
              ],
              "standardised_rank": 7,
              "raw_common_rank": 10,
              "rank_change_vs_raw_common": 3,
              "rank_change_vs_primary_standardisation": -2
            },
            {
              "uf": "SP",
              "name": "São Paulo",
              "population": "employer_local_units",
              "cohort_year": 2017,
              "observation_year": 2022,
              "raw_full_five_year_pct": 38.48101,
              "raw_common_five_year_pct": 38.1059637445079,
              "standardised_five_year_pct": 38.42280478374714,
              "difference_from_national_common_pp": 1.2025220248751083,
              "composition_shift_pp": 0.316841039239236,
              "full_births": 77841,
              "common_births": 54624,
              "state_cohort_coverage_pct": 70.17381585539754,
              "min_included_sector_births": 3098,
              "included_sections": [
                "C",
                "F",
                "G",
                "I",
                "Q"
              ],
              "excluded_sections": [
                "A",
                "B",
                "D",
                "E",
                "H",
                "J",
                "K",
                "L",
                "M",
                "N",
                "O",
                "P",
                "R",
                "S"
              ],
              "sector_support": [
                {
                  "section": "C",
                  "births": 5119,
                  "five_year_survival_pct": 45.71205,
                  "national_weight_pct": 10.55962042006351,
                  "source_row": 492
                },
                {
                  "section": "F",
                  "births": 4763,
                  "five_year_survival_pct": 29.07831,
                  "national_weight_pct": 8.44491076900221,
                  "source_row": 495
                },
                {
                  "section": "G",
                  "births": 33106,
                  "five_year_survival_pct": 38.55797,
                  "national_weight_pct": 61.201229363590784,
                  "source_row": 496
                },
                {
                  "section": "I",
                  "births": 8538,
                  "five_year_survival_pct": 31.24854,
                  "national_weight_pct": 13.69291908856246,
                  "source_row": 498
                },
                {
                  "section": "Q",
                  "births": 3098,
                  "five_year_survival_pct": 53.48612,
                  "national_weight_pct": 6.101320358781035,
                  "source_row": 506
                }
              ],
              "standardised_rank": 5,
              "raw_common_rank": 6,
              "rank_change_vs_raw_common": 1,
              "rank_change_vs_primary_standardisation": 1
            },
            {
              "uf": "PR",
              "name": "Paraná",
              "population": "employer_local_units",
              "cohort_year": 2017,
              "observation_year": 2022,
              "raw_full_five_year_pct": 36.96242,
              "raw_common_five_year_pct": 35.97050834571947,
              "standardised_five_year_pct": 35.96327871617857,
              "difference_from_national_common_pp": -1.2570040426934597,
              "composition_shift_pp": -0.007229629540901783,
              "full_births": 23578,
              "common_births": 17089,
              "state_cohort_coverage_pct": 72.47858172873018,
              "min_included_sector_births": 933,
              "included_sections": [
                "C",
                "F",
                "G",
                "I",
                "Q"
              ],
              "excluded_sections": [
                "A",
                "B",
                "D",
                "E",
                "H",
                "J",
                "K",
                "L",
                "M",
                "N",
                "O",
                "P",
                "R",
                "S"
              ],
              "sector_support": [
                {
                  "section": "C",
                  "births": 2357,
                  "five_year_survival_pct": 41.36614,
                  "national_weight_pct": 10.55962042006351,
                  "source_row": 534
                },
                {
                  "section": "F",
                  "births": 1678,
                  "five_year_survival_pct": 24.67223,
                  "national_weight_pct": 8.44491076900221,
                  "source_row": 537
                },
                {
                  "section": "G",
                  "births": 10024,
                  "five_year_survival_pct": 36.72187,
                  "national_weight_pct": 61.201229363590784,
                  "source_row": 538
                },
                {
                  "section": "I",
                  "births": 2097,
                  "five_year_survival_pct": 27.61087,
                  "national_weight_pct": 13.69291908856246,
                  "source_row": 540
                },
                {
                  "section": "Q",
                  "births": 933,
                  "five_year_survival_pct": 53.37621,
                  "national_weight_pct": 6.101320358781035,
                  "source_row": 548
                }
              ],
              "standardised_rank": 17,
              "raw_common_rank": 18,
              "rank_change_vs_raw_common": 1,
              "rank_change_vs_primary_standardisation": 0
            },
            {
              "uf": "SC",
              "name": "Santa Catarina",
              "population": "employer_local_units",
              "cohort_year": 2017,
              "observation_year": 2022,
              "raw_full_five_year_pct": 39.98173,
              "raw_common_five_year_pct": 39.50877093645225,
              "standardised_five_year_pct": 39.22689189316422,
              "difference_from_national_common_pp": 2.006609134292191,
              "composition_shift_pp": -0.28187904328802915,
              "full_births": 17513,
              "common_births": 12825,
              "state_cohort_coverage_pct": 73.23131388111689,
              "min_included_sector_births": 631,
              "included_sections": [
                "C",
                "F",
                "G",
                "I",
                "Q"
              ],
              "excluded_sections": [
                "A",
                "B",
                "D",
                "E",
                "H",
                "J",
                "K",
                "L",
                "M",
                "N",
                "O",
                "P",
                "R",
                "S"
              ],
              "sector_support": [
                {
                  "section": "C",
                  "births": 2345,
                  "five_year_survival_pct": 47.03625,
                  "national_weight_pct": 10.55962042006351,
                  "source_row": 555
                },
                {
                  "section": "F",
                  "births": 1250,
                  "five_year_survival_pct": 31.36,
                  "national_weight_pct": 8.44491076900221,
                  "source_row": 558
                },
                {
                  "section": "G",
                  "births": 6772,
                  "five_year_survival_pct": 39.02835,
                  "national_weight_pct": 61.201229363590784,
                  "source_row": 559
                },
                {
                  "section": "I",
                  "births": 1827,
                  "five_year_survival_pct": 31.63656,
                  "national_weight_pct": 13.69291908856246,
                  "source_row": 561
                },
                {
                  "section": "Q",
                  "births": 631,
                  "five_year_survival_pct": 55.62599,
                  "national_weight_pct": 6.101320358781035,
                  "source_row": 569
                }
              ],
              "standardised_rank": 4,
              "raw_common_rank": 3,
              "rank_change_vs_raw_common": -1,
              "rank_change_vs_primary_standardisation": -1
            },
            {
              "uf": "RS",
              "name": "Rio Grande do Sul",
              "population": "employer_local_units",
              "cohort_year": 2017,
              "observation_year": 2022,
              "raw_full_five_year_pct": 38.41286,
              "raw_common_five_year_pct": 38.12350802115319,
              "standardised_five_year_pct": 38.05667575572434,
              "difference_from_national_common_pp": 0.8363929968523109,
              "composition_shift_pp": -0.06683226542885023,
              "full_births": 20225,
              "common_births": 14655,
              "state_cohort_coverage_pct": 72.45982694684795,
              "min_included_sector_births": 739,
              "included_sections": [
                "C",
                "F",
                "G",
                "I",
                "Q"
              ],
              "excluded_sections": [
                "A",
                "B",
                "D",
                "E",
                "H",
                "J",
                "K",
                "L",
                "M",
                "N",
                "O",
                "P",
                "R",
                "S"
              ],
              "sector_support": [
                {
                  "section": "C",
                  "births": 2072,
                  "five_year_survival_pct": 45.46332,
                  "national_weight_pct": 10.55962042006351,
                  "source_row": 576
                },
                {
                  "section": "F",
                  "births": 1373,
                  "five_year_survival_pct": 26.58412,
                  "national_weight_pct": 8.44491076900221,
                  "source_row": 579
                },
                {
                  "section": "G",
                  "births": 8730,
                  "five_year_survival_pct": 37.77778,
                  "national_weight_pct": 61.201229363590784,
                  "source_row": 580
                },
                {
                  "section": "I",
                  "births": 1741,
                  "five_year_survival_pct": 31.87823,
                  "national_weight_pct": 13.69291908856246,
                  "source_row": 582
                },
                {
                  "section": "Q",
                  "births": 739,
                  "five_year_survival_pct": 57.78078,
                  "national_weight_pct": 6.101320358781035,
                  "source_row": 590
                }
              ],
              "standardised_rank": 6,
              "raw_common_rank": 5,
              "rank_change_vs_raw_common": -1,
              "rank_change_vs_primary_standardisation": 3
            },
            {
              "uf": "MS",
              "name": "Mato Grosso do Sul",
              "population": "employer_local_units",
              "cohort_year": 2017,
              "observation_year": 2022,
              "raw_full_five_year_pct": 36.73749,
              "raw_common_five_year_pct": 35.97074138297872,
              "standardised_five_year_pct": 35.86782929938346,
              "difference_from_national_common_pp": -1.3524534594885722,
              "composition_shift_pp": -0.10291208359526394,
              "full_births": 4377,
              "common_births": 3008,
              "state_cohort_coverage_pct": 68.72286954535069,
              "min_included_sector_births": 208,
              "included_sections": [
                "C",
                "F",
                "G",
                "I",
                "Q"
              ],
              "excluded_sections": [
                "A",
                "B",
                "D",
                "E",
                "H",
                "J",
                "K",
                "L",
                "M",
                "N",
                "O",
                "P",
                "R",
                "S"
              ],
              "sector_support": [
                {
                  "section": "C",
                  "births": 272,
                  "five_year_survival_pct": 35.66176,
                  "national_weight_pct": 10.55962042006351,
                  "source_row": 618
                },
                {
                  "section": "F",
                  "births": 255,
                  "five_year_survival_pct": 21.17647,
                  "national_weight_pct": 8.44491076900221,
                  "source_row": 621
                },
                {
                  "section": "G",
                  "births": 1844,
                  "five_year_survival_pct": 37.52711,
                  "national_weight_pct": 61.201229363590784,
                  "source_row": 622
                },
                {
                  "section": "I",
                  "births": 429,
                  "five_year_survival_pct": 30.30303,
                  "national_weight_pct": 13.69291908856246,
                  "source_row": 624
                },
                {
                  "section": "Q",
                  "births": 208,
                  "five_year_survival_pct": 52.40385,
                  "national_weight_pct": 6.101320358781035,
                  "source_row": 632
                }
              ],
              "standardised_rank": 18,
              "raw_common_rank": 17,
              "rank_change_vs_raw_common": -1,
              "rank_change_vs_primary_standardisation": 0
            },
            {
              "uf": "MT",
              "name": "Mato Grosso",
              "population": "employer_local_units",
              "cohort_year": 2017,
              "observation_year": 2022,
              "raw_full_five_year_pct": 37.40725,
              "raw_common_five_year_pct": 36.89453451757812,
              "standardised_five_year_pct": 36.60388776797155,
              "difference_from_national_common_pp": -0.6163949909004813,
              "composition_shift_pp": -0.290646749606573,
              "full_births": 7143,
              "common_births": 5120,
              "state_cohort_coverage_pct": 71.67856642867143,
              "min_included_sector_births": 334,
              "included_sections": [
                "C",
                "F",
                "G",
                "I",
                "Q"
              ],
              "excluded_sections": [
                "A",
                "B",
                "D",
                "E",
                "H",
                "J",
                "K",
                "L",
                "M",
                "N",
                "O",
                "P",
                "R",
                "S"
              ],
              "sector_support": [
                {
                  "section": "C",
                  "births": 538,
                  "five_year_survival_pct": 40.89219,
                  "national_weight_pct": 10.55962042006351,
                  "source_row": 639
                },
                {
                  "section": "F",
                  "births": 407,
                  "five_year_survival_pct": 26.53563,
                  "national_weight_pct": 8.44491076900221,
                  "source_row": 642
                },
                {
                  "section": "G",
                  "births": 3247,
                  "five_year_survival_pct": 37.69634,
                  "national_weight_pct": 61.201229363590784,
                  "source_row": 643
                },
                {
                  "section": "I",
                  "births": 594,
                  "five_year_survival_pct": 28.78788,
                  "national_weight_pct": 13.69291908856246,
                  "source_row": 645
                },
                {
                  "section": "Q",
                  "births": 334,
                  "five_year_survival_pct": 49.7006,
                  "national_weight_pct": 6.101320358781035,
                  "source_row": 653
                }
              ],
              "standardised_rank": 14,
              "raw_common_rank": 13,
              "rank_change_vs_raw_common": -1,
              "rank_change_vs_primary_standardisation": 2
            },
            {
              "uf": "GO",
              "name": "Goiás",
              "population": "employer_local_units",
              "cohort_year": 2017,
              "observation_year": 2022,
              "raw_full_five_year_pct": 35.67973,
              "raw_common_five_year_pct": 34.697980810324765,
              "standardised_five_year_pct": 34.75274135814964,
              "difference_from_national_common_pp": -2.4675414007223893,
              "composition_shift_pp": 0.05476054782487694,
              "full_births": 12814,
              "common_births": 9453,
              "state_cohort_coverage_pct": 73.77087560480724,
              "min_included_sector_births": 467,
              "included_sections": [
                "C",
                "F",
                "G",
                "I",
                "Q"
              ],
              "excluded_sections": [
                "A",
                "B",
                "D",
                "E",
                "H",
                "J",
                "K",
                "L",
                "M",
                "N",
                "O",
                "P",
                "R",
                "S"
              ],
              "sector_support": [
                {
                  "section": "C",
                  "births": 1057,
                  "five_year_survival_pct": 38.59981,
                  "national_weight_pct": 10.55962042006351,
                  "source_row": 660
                },
                {
                  "section": "F",
                  "births": 736,
                  "five_year_survival_pct": 25.67935,
                  "national_weight_pct": 8.44491076900221,
                  "source_row": 663
                },
                {
                  "section": "G",
                  "births": 6038,
                  "five_year_survival_pct": 34.77973,
                  "national_weight_pct": 61.201229363590784,
                  "source_row": 664
                },
                {
                  "section": "I",
                  "births": 1155,
                  "five_year_survival_pct": 28.22511,
                  "national_weight_pct": 13.69291908856246,
                  "source_row": 666
                },
                {
                  "section": "Q",
                  "births": 467,
                  "five_year_survival_pct": 55.03212,
                  "national_weight_pct": 6.101320358781035,
                  "source_row": 674
                }
              ],
              "standardised_rank": 21,
              "raw_common_rank": 23,
              "rank_change_vs_raw_common": 2,
              "rank_change_vs_primary_standardisation": 1
            },
            {
              "uf": "DF",
              "name": "Distrito Federal",
              "population": "employer_local_units",
              "cohort_year": 2017,
              "observation_year": 2022,
              "raw_full_five_year_pct": 32.56608,
              "raw_common_five_year_pct": 32.61268668366306,
              "standardised_five_year_pct": 31.90438397017586,
              "difference_from_national_common_pp": -5.31589878869617,
              "composition_shift_pp": -0.7083027134871962,
              "full_births": 6734,
              "common_births": 4903,
              "state_cohort_coverage_pct": 72.80962280962281,
              "min_included_sector_births": 254,
              "included_sections": [
                "C",
                "F",
                "G",
                "I",
                "Q"
              ],
              "excluded_sections": [
                "A",
                "B",
                "D",
                "E",
                "H",
                "J",
                "K",
                "L",
                "M",
                "N",
                "O",
                "P",
                "R",
                "S"
              ],
              "sector_support": [
                {
                  "section": "C",
                  "births": 254,
                  "five_year_survival_pct": 27.55906,
                  "national_weight_pct": 10.55962042006351,
                  "source_row": 681
                },
                {
                  "section": "F",
                  "births": 353,
                  "five_year_survival_pct": 26.34561,
                  "national_weight_pct": 8.44491076900221,
                  "source_row": 684
                },
                {
                  "section": "G",
                  "births": 2913,
                  "five_year_survival_pct": 32.8184,
                  "national_weight_pct": 61.201229363590784,
                  "source_row": 685
                },
                {
                  "section": "I",
                  "births": 898,
                  "five_year_survival_pct": 26.94878,
                  "national_weight_pct": 13.69291908856246,
                  "source_row": 687
                },
                {
                  "section": "Q",
                  "births": 485,
                  "five_year_survival_pct": 49.07216,
                  "national_weight_pct": 6.101320358781035,
                  "source_row": 695
                }
              ],
              "standardised_rank": 26,
              "raw_common_rank": 26,
              "rank_change_vs_raw_common": 0,
              "rank_change_vs_primary_standardisation": 0
            }
          ],
          "states_with_rank_change_vs_primary": 21,
          "max_absolute_rank_change_vs_primary": 8
        }
      ]
    },
    "controls": {
      "enterprise_size_birth_sum": 261302,
      "enterprise_sector_birth_sum": 261302,
      "state_local_unit_birth_sum": 296850,
      "state_birth_weighted_five_year_pct": 37.85379931345797,
      "local_unit_records": 693,
      "all_curves_nonincreasing": true
    },
    "limitations": [
      "Published aggregate tables provide no individual enterprise histories, municipality survival estimates, founder covariates, or fitted adjusted survival model.",
      "State rankings describe employer local units, while national enterprise sector/size comparisons describe employer enterprises; do not combine their denominators.",
      "Five-year rates cover the pandemic period but alone do not identify a causal pandemic effect.",
      "Rates retain workbook precision; publication text typically rounds to one decimal. No invented uncertainty intervals or reconstructed survivor counts.",
      "Small sector denominators require care: electricity/gas has 119 enterprise births, public administration 7; display denominators alongside comparisons.",
      "PDF size-section heading says local units, but its body and Chart 3 say enterprises; Table 2.1 size groups sum to the 261302-enterprise cohort. Table 2.1 title contains extraneous salary/age wording; extracted columns are births and survival rates only."
    ]
  },
  "depth": {
    "time": [
      {
        "age": 0,
        "year": 2017,
        "survival_pct": 100,
        "annual_attrition_pct": null,
        "original_cohort_loss_pp": null,
        "conditional_to_horizon_pct": 37.31889,
        "horizon_age": 5
      },
      {
        "age": 1,
        "year": 2018,
        "survival_pct": 76.21603,
        "annual_attrition_pct": 23.78397,
        "original_cohort_loss_pp": 23.783969999999997,
        "conditional_to_horizon_pct": 48.96462069724702,
        "horizon_age": 5
      },
      {
        "age": 2,
        "year": 2019,
        "survival_pct": 59.63253,
        "annual_attrition_pct": 21.758546069639152,
        "original_cohort_loss_pp": 16.5835,
        "conditional_to_horizon_pct": 62.58142996783803,
        "horizon_age": 5
      },
      {
        "age": 3,
        "year": 2020,
        "survival_pct": 49.36434,
        "annual_attrition_pct": 17.219108429576945,
        "original_cohort_loss_pp": 10.268190000000004,
        "conditional_to_horizon_pct": 75.59888372861867,
        "horizon_age": 5
      },
      {
        "age": 4,
        "year": 2021,
        "survival_pct": 42.27752,
        "annual_attrition_pct": 14.356152639739527,
        "original_cohort_loss_pp": 7.086819999999996,
        "conditional_to_horizon_pct": 88.2712372911183,
        "horizon_age": 5
      },
      {
        "age": 5,
        "year": 2022,
        "survival_pct": 37.31889,
        "annual_attrition_pct": 11.72876270888169,
        "original_cohort_loss_pp": 4.958629999999999,
        "conditional_to_horizon_pct": 100.0,
        "horizon_age": 5
      }
    ],
    "within_industry": [
      {
        "section": "A",
        "label": "A Agricultura, pecuária, produção florestal, pesca e aquicultura",
        "national_births": 2580,
        "national_five_year_pct": 43.06202,
        "national_source_row": 7,
        "states": [
          {
            "uf": "RO",
            "name": "Rondônia",
            "births": 15,
            "five_year_survival_pct": 46.66667,
            "source_row": 49
          },
          {
            "uf": "AC",
            "name": "Acre",
            "births": 8,
            "five_year_survival_pct": 37.5,
            "source_row": 70
          },
          {
            "uf": "AM",
            "name": "Amazonas",
            "births": 6,
            "five_year_survival_pct": 0,
            "source_row": 91
          },
          {
            "uf": "RR",
            "name": "Roraima",
            "births": 1,
            "five_year_survival_pct": 0,
            "source_row": 112
          },
          {
            "uf": "PA",
            "name": "Pará",
            "births": 68,
            "five_year_survival_pct": 51.47059,
            "source_row": 133
          },
          {
            "uf": "AP",
            "name": "Amapá",
            "births": 3,
            "five_year_survival_pct": 66.66667,
            "source_row": 154
          },
          {
            "uf": "TO",
            "name": "Tocantins",
            "births": 45,
            "five_year_survival_pct": 37.77778,
            "source_row": 175
          },
          {
            "uf": "MA",
            "name": "Maranhão",
            "births": 48,
            "five_year_survival_pct": 50,
            "source_row": 217
          },
          {
            "uf": "PI",
            "name": "Piauí",
            "births": 31,
            "five_year_survival_pct": 38.70968,
            "source_row": 238
          },
          {
            "uf": "CE",
            "name": "Ceará",
            "births": 54,
            "five_year_survival_pct": 42.59259,
            "source_row": 259
          },
          {
            "uf": "RN",
            "name": "Rio Grande do Norte",
            "births": 65,
            "five_year_survival_pct": 55.38462,
            "source_row": 280
          },
          {
            "uf": "PB",
            "name": "Paraíba",
            "births": 22,
            "five_year_survival_pct": 54.54545,
            "source_row": 301
          },
          {
            "uf": "PE",
            "name": "Pernambuco",
            "births": 49,
            "five_year_survival_pct": 51.02041,
            "source_row": 322
          },
          {
            "uf": "AL",
            "name": "Alagoas",
            "births": 15,
            "five_year_survival_pct": 53.33333,
            "source_row": 343
          },
          {
            "uf": "SE",
            "name": "Sergipe",
            "births": 15,
            "five_year_survival_pct": 40,
            "source_row": 364
          },
          {
            "uf": "BA",
            "name": "Bahia",
            "births": 156,
            "five_year_survival_pct": 39.10256,
            "source_row": 385
          },
          {
            "uf": "MG",
            "name": "Minas Gerais",
            "births": 397,
            "five_year_survival_pct": 45.08816,
            "source_row": 427
          },
          {
            "uf": "ES",
            "name": "Espírito Santo",
            "births": 53,
            "five_year_survival_pct": 39.62264,
            "source_row": 448
          },
          {
            "uf": "RJ",
            "name": "Rio de Janeiro",
            "births": 41,
            "five_year_survival_pct": 56.09756,
            "source_row": 469
          },
          {
            "uf": "SP",
            "name": "São Paulo",
            "births": 404,
            "five_year_survival_pct": 37.37624,
            "source_row": 490
          },
          {
            "uf": "PR",
            "name": "Paraná",
            "births": 301,
            "five_year_survival_pct": 41.86047,
            "source_row": 532
          },
          {
            "uf": "SC",
            "name": "Santa Catarina",
            "births": 141,
            "five_year_survival_pct": 39.00709,
            "source_row": 553
          },
          {
            "uf": "RS",
            "name": "Rio Grande do Sul",
            "births": 159,
            "five_year_survival_pct": 50.31447,
            "source_row": 574
          },
          {
            "uf": "MS",
            "name": "Mato Grosso do Sul",
            "births": 132,
            "five_year_survival_pct": 40.90909,
            "source_row": 616
          },
          {
            "uf": "MT",
            "name": "Mato Grosso",
            "births": 167,
            "five_year_survival_pct": 43.71257,
            "source_row": 637
          },
          {
            "uf": "GO",
            "name": "Goiás",
            "births": 171,
            "five_year_survival_pct": 43.27485,
            "source_row": 658
          },
          {
            "uf": "DF",
            "name": "Distrito Federal",
            "births": 13,
            "five_year_survival_pct": 30.76923,
            "source_row": 679
          }
        ]
      },
      {
        "section": "B",
        "label": "B Indústrias extrativas",
        "national_births": 555,
        "national_five_year_pct": 42.16216,
        "national_source_row": 8,
        "states": [
          {
            "uf": "RO",
            "name": "Rondônia",
            "births": 10,
            "five_year_survival_pct": 50,
            "source_row": 50
          },
          {
            "uf": "AC",
            "name": "Acre",
            "births": 2,
            "five_year_survival_pct": 0,
            "source_row": 71
          },
          {
            "uf": "AM",
            "name": "Amazonas",
            "births": 4,
            "five_year_survival_pct": 50,
            "source_row": 92
          },
          {
            "uf": "RR",
            "name": "Roraima",
            "births": 3,
            "five_year_survival_pct": 33.33333,
            "source_row": 113
          },
          {
            "uf": "PA",
            "name": "Pará",
            "births": 12,
            "five_year_survival_pct": 58.33333,
            "source_row": 134
          },
          {
            "uf": "AP",
            "name": "Amapá",
            "births": 2,
            "five_year_survival_pct": 100,
            "source_row": 155
          },
          {
            "uf": "TO",
            "name": "Tocantins",
            "births": 6,
            "five_year_survival_pct": 33.33333,
            "source_row": 176
          },
          {
            "uf": "MA",
            "name": "Maranhão",
            "births": 10,
            "five_year_survival_pct": 40,
            "source_row": 218
          },
          {
            "uf": "PI",
            "name": "Piauí",
            "births": 7,
            "five_year_survival_pct": 42.85714,
            "source_row": 239
          },
          {
            "uf": "CE",
            "name": "Ceará",
            "births": 17,
            "five_year_survival_pct": 41.17647,
            "source_row": 260
          },
          {
            "uf": "RN",
            "name": "Rio Grande do Norte",
            "births": 17,
            "five_year_survival_pct": 35.29412,
            "source_row": 281
          },
          {
            "uf": "PB",
            "name": "Paraíba",
            "births": 6,
            "five_year_survival_pct": 50,
            "source_row": 302
          },
          {
            "uf": "PE",
            "name": "Pernambuco",
            "births": 11,
            "five_year_survival_pct": 45.45455,
            "source_row": 323
          },
          {
            "uf": "AL",
            "name": "Alagoas",
            "births": 2,
            "five_year_survival_pct": 0,
            "source_row": 344
          },
          {
            "uf": "SE",
            "name": "Sergipe",
            "births": 8,
            "five_year_survival_pct": 25,
            "source_row": 365
          },
          {
            "uf": "BA",
            "name": "Bahia",
            "births": 65,
            "five_year_survival_pct": 32.30769,
            "source_row": 386
          },
          {
            "uf": "MG",
            "name": "Minas Gerais",
            "births": 141,
            "five_year_survival_pct": 43.26241,
            "source_row": 428
          },
          {
            "uf": "ES",
            "name": "Espírito Santo",
            "births": 28,
            "five_year_survival_pct": 28.57143,
            "source_row": 449
          },
          {
            "uf": "RJ",
            "name": "Rio de Janeiro",
            "births": 32,
            "five_year_survival_pct": 43.75,
            "source_row": 470
          },
          {
            "uf": "SP",
            "name": "São Paulo",
            "births": 42,
            "five_year_survival_pct": 61.90476,
            "source_row": 491
          },
          {
            "uf": "PR",
            "name": "Paraná",
            "births": 21,
            "five_year_survival_pct": 42.85714,
            "source_row": 533
          },
          {
            "uf": "SC",
            "name": "Santa Catarina",
            "births": 23,
            "five_year_survival_pct": 43.47826,
            "source_row": 554
          },
          {
            "uf": "RS",
            "name": "Rio Grande do Sul",
            "births": 31,
            "five_year_survival_pct": 58.06452,
            "source_row": 575
          },
          {
            "uf": "MS",
            "name": "Mato Grosso do Sul",
            "births": 7,
            "five_year_survival_pct": 42.85714,
            "source_row": 617
          },
          {
            "uf": "MT",
            "name": "Mato Grosso",
            "births": 20,
            "five_year_survival_pct": 25,
            "source_row": 638
          },
          {
            "uf": "GO",
            "name": "Goiás",
            "births": 24,
            "five_year_survival_pct": 29.16667,
            "source_row": 659
          },
          {
            "uf": "DF",
            "name": "Distrito Federal",
            "births": 4,
            "five_year_survival_pct": 75,
            "source_row": 680
          }
        ]
      },
      {
        "section": "C",
        "label": "C Indústrias de transformação",
        "national_births": 22745,
        "national_five_year_pct": 42.55441,
        "national_source_row": 9,
        "states": [
          {
            "uf": "RO",
            "name": "Rondônia",
            "births": 170,
            "five_year_survival_pct": 44.11765,
            "source_row": 51
          },
          {
            "uf": "AC",
            "name": "Acre",
            "births": 37,
            "five_year_survival_pct": 37.83784,
            "source_row": 72
          },
          {
            "uf": "AM",
            "name": "Amazonas",
            "births": 131,
            "five_year_survival_pct": 36.64122,
            "source_row": 93
          },
          {
            "uf": "RR",
            "name": "Roraima",
            "births": 36,
            "five_year_survival_pct": 16.66667,
            "source_row": 114
          },
          {
            "uf": "PA",
            "name": "Pará",
            "births": 357,
            "five_year_survival_pct": 38.65546,
            "source_row": 135
          },
          {
            "uf": "AP",
            "name": "Amapá",
            "births": 40,
            "five_year_survival_pct": 15,
            "source_row": 156
          },
          {
            "uf": "TO",
            "name": "Tocantins",
            "births": 114,
            "five_year_survival_pct": 31.57895,
            "source_row": 177
          },
          {
            "uf": "MA",
            "name": "Maranhão",
            "births": 186,
            "five_year_survival_pct": 33.87097,
            "source_row": 219
          },
          {
            "uf": "PI",
            "name": "Piauí",
            "births": 177,
            "five_year_survival_pct": 42.93785,
            "source_row": 240
          },
          {
            "uf": "CE",
            "name": "Ceará",
            "births": 691,
            "five_year_survival_pct": 39.65268,
            "source_row": 261
          },
          {
            "uf": "RN",
            "name": "Rio Grande do Norte",
            "births": 324,
            "five_year_survival_pct": 38.88889,
            "source_row": 282
          },
          {
            "uf": "PB",
            "name": "Paraíba",
            "births": 244,
            "five_year_survival_pct": 40.57377,
            "source_row": 303
          },
          {
            "uf": "PE",
            "name": "Pernambuco",
            "births": 736,
            "five_year_survival_pct": 39.67391,
            "source_row": 324
          },
          {
            "uf": "AL",
            "name": "Alagoas",
            "births": 184,
            "five_year_survival_pct": 31.52174,
            "source_row": 345
          },
          {
            "uf": "SE",
            "name": "Sergipe",
            "births": 119,
            "five_year_survival_pct": 47.05882,
            "source_row": 366
          },
          {
            "uf": "BA",
            "name": "Bahia",
            "births": 901,
            "five_year_survival_pct": 39.17869,
            "source_row": 387
          },
          {
            "uf": "MG",
            "name": "Minas Gerais",
            "births": 2798,
            "five_year_survival_pct": 42.85204,
            "source_row": 429
          },
          {
            "uf": "ES",
            "name": "Espírito Santo",
            "births": 486,
            "five_year_survival_pct": 43.82716,
            "source_row": 450
          },
          {
            "uf": "RJ",
            "name": "Rio de Janeiro",
            "births": 1000,
            "five_year_survival_pct": 39.2,
            "source_row": 471
          },
          {
            "uf": "SP",
            "name": "São Paulo",
            "births": 5119,
            "five_year_survival_pct": 45.71205,
            "source_row": 492
          },
          {
            "uf": "PR",
            "name": "Paraná",
            "births": 2357,
            "five_year_survival_pct": 41.36614,
            "source_row": 534
          },
          {
            "uf": "SC",
            "name": "Santa Catarina",
            "births": 2345,
            "five_year_survival_pct": 47.03625,
            "source_row": 555
          },
          {
            "uf": "RS",
            "name": "Rio Grande do Sul",
            "births": 2072,
            "five_year_survival_pct": 45.46332,
            "source_row": 576
          },
          {
            "uf": "MS",
            "name": "Mato Grosso do Sul",
            "births": 272,
            "five_year_survival_pct": 35.66176,
            "source_row": 618
          },
          {
            "uf": "MT",
            "name": "Mato Grosso",
            "births": 538,
            "five_year_survival_pct": 40.89219,
            "source_row": 639
          },
          {
            "uf": "GO",
            "name": "Goiás",
            "births": 1057,
            "five_year_survival_pct": 38.59981,
            "source_row": 660
          },
          {
            "uf": "DF",
            "name": "Distrito Federal",
            "births": 254,
            "five_year_survival_pct": 27.55906,
            "source_row": 681
          }
        ]
      },
      {
        "section": "D",
        "label": "D Eletricidade e gás",
        "national_births": 239,
        "national_five_year_pct": 58.99582,
        "national_source_row": 10,
        "states": [
          {
            "uf": "RO",
            "name": "Rondônia",
            "births": 1,
            "five_year_survival_pct": 100,
            "source_row": 52
          },
          {
            "uf": "AC",
            "name": "Acre",
            "births": 0,
            "five_year_survival_pct": null,
            "source_row": 73
          },
          {
            "uf": "AM",
            "name": "Amazonas",
            "births": 4,
            "five_year_survival_pct": 0,
            "source_row": 94
          },
          {
            "uf": "RR",
            "name": "Roraima",
            "births": 0,
            "five_year_survival_pct": null,
            "source_row": 115
          },
          {
            "uf": "PA",
            "name": "Pará",
            "births": 15,
            "five_year_survival_pct": 73.33333,
            "source_row": 136
          },
          {
            "uf": "AP",
            "name": "Amapá",
            "births": 0,
            "five_year_survival_pct": null,
            "source_row": 157
          },
          {
            "uf": "TO",
            "name": "Tocantins",
            "births": 0,
            "five_year_survival_pct": null,
            "source_row": 178
          },
          {
            "uf": "MA",
            "name": "Maranhão",
            "births": 1,
            "five_year_survival_pct": 100,
            "source_row": 220
          },
          {
            "uf": "PI",
            "name": "Piauí",
            "births": 0,
            "five_year_survival_pct": null,
            "source_row": 241
          },
          {
            "uf": "CE",
            "name": "Ceará",
            "births": 7,
            "five_year_survival_pct": 14.28571,
            "source_row": 262
          },
          {
            "uf": "RN",
            "name": "Rio Grande do Norte",
            "births": 6,
            "five_year_survival_pct": 0,
            "source_row": 283
          },
          {
            "uf": "PB",
            "name": "Paraíba",
            "births": 0,
            "five_year_survival_pct": null,
            "source_row": 304
          },
          {
            "uf": "PE",
            "name": "Pernambuco",
            "births": 4,
            "five_year_survival_pct": 25,
            "source_row": 325
          },
          {
            "uf": "AL",
            "name": "Alagoas",
            "births": 0,
            "five_year_survival_pct": null,
            "source_row": 346
          },
          {
            "uf": "SE",
            "name": "Sergipe",
            "births": 2,
            "five_year_survival_pct": 100,
            "source_row": 367
          },
          {
            "uf": "BA",
            "name": "Bahia",
            "births": 9,
            "five_year_survival_pct": 55.55556,
            "source_row": 388
          },
          {
            "uf": "MG",
            "name": "Minas Gerais",
            "births": 21,
            "five_year_survival_pct": 61.90476,
            "source_row": 430
          },
          {
            "uf": "ES",
            "name": "Espírito Santo",
            "births": 14,
            "five_year_survival_pct": 71.42857,
            "source_row": 451
          },
          {
            "uf": "RJ",
            "name": "Rio de Janeiro",
            "births": 17,
            "five_year_survival_pct": 58.82353,
            "source_row": 472
          },
          {
            "uf": "SP",
            "name": "São Paulo",
            "births": 65,
            "five_year_survival_pct": 66.15385,
            "source_row": 493
          },
          {
            "uf": "PR",
            "name": "Paraná",
            "births": 14,
            "five_year_survival_pct": 85.71429,
            "source_row": 535
          },
          {
            "uf": "SC",
            "name": "Santa Catarina",
            "births": 16,
            "five_year_survival_pct": 50,
            "source_row": 556
          },
          {
            "uf": "RS",
            "name": "Rio Grande do Sul",
            "births": 8,
            "five_year_survival_pct": 37.5,
            "source_row": 577
          },
          {
            "uf": "MS",
            "name": "Mato Grosso do Sul",
            "births": 4,
            "five_year_survival_pct": 50,
            "source_row": 619
          },
          {
            "uf": "MT",
            "name": "Mato Grosso",
            "births": 6,
            "five_year_survival_pct": 0,
            "source_row": 640
          },
          {
            "uf": "GO",
            "name": "Goiás",
            "births": 19,
            "five_year_survival_pct": 78.94737,
            "source_row": 661
          },
          {
            "uf": "DF",
            "name": "Distrito Federal",
            "births": 6,
            "five_year_survival_pct": 50,
            "source_row": 682
          }
        ]
      },
      {
        "section": "E",
        "label": "E Água, esgoto, atividades de gestão de resíduos e descontaminação",
        "national_births": 850,
        "national_five_year_pct": 43.41176,
        "national_source_row": 11,
        "states": [
          {
            "uf": "RO",
            "name": "Rondônia",
            "births": 8,
            "five_year_survival_pct": 75,
            "source_row": 53
          },
          {
            "uf": "AC",
            "name": "Acre",
            "births": 2,
            "five_year_survival_pct": 100,
            "source_row": 74
          },
          {
            "uf": "AM",
            "name": "Amazonas",
            "births": 5,
            "five_year_survival_pct": 40,
            "source_row": 95
          },
          {
            "uf": "RR",
            "name": "Roraima",
            "births": 2,
            "five_year_survival_pct": 0,
            "source_row": 116
          },
          {
            "uf": "PA",
            "name": "Pará",
            "births": 25,
            "five_year_survival_pct": 24,
            "source_row": 137
          },
          {
            "uf": "AP",
            "name": "Amapá",
            "births": 1,
            "five_year_survival_pct": 0,
            "source_row": 158
          },
          {
            "uf": "TO",
            "name": "Tocantins",
            "births": 9,
            "five_year_survival_pct": 44.44444,
            "source_row": 179
          },
          {
            "uf": "MA",
            "name": "Maranhão",
            "births": 16,
            "five_year_survival_pct": 25,
            "source_row": 221
          },
          {
            "uf": "PI",
            "name": "Piauí",
            "births": 10,
            "five_year_survival_pct": 40,
            "source_row": 242
          },
          {
            "uf": "CE",
            "name": "Ceará",
            "births": 27,
            "five_year_survival_pct": 66.66667,
            "source_row": 263
          },
          {
            "uf": "RN",
            "name": "Rio Grande do Norte",
            "births": 29,
            "five_year_survival_pct": 58.62069,
            "source_row": 284
          },
          {
            "uf": "PB",
            "name": "Paraíba",
            "births": 12,
            "five_year_survival_pct": 33.33333,
            "source_row": 305
          },
          {
            "uf": "PE",
            "name": "Pernambuco",
            "births": 33,
            "five_year_survival_pct": 39.39394,
            "source_row": 326
          },
          {
            "uf": "AL",
            "name": "Alagoas",
            "births": 13,
            "five_year_survival_pct": 30.76923,
            "source_row": 347
          },
          {
            "uf": "SE",
            "name": "Sergipe",
            "births": 4,
            "five_year_survival_pct": 0,
            "source_row": 368
          },
          {
            "uf": "BA",
            "name": "Bahia",
            "births": 42,
            "five_year_survival_pct": 33.33333,
            "source_row": 389
          },
          {
            "uf": "MG",
            "name": "Minas Gerais",
            "births": 73,
            "five_year_survival_pct": 42.46575,
            "source_row": 431
          },
          {
            "uf": "ES",
            "name": "Espírito Santo",
            "births": 22,
            "five_year_survival_pct": 63.63636,
            "source_row": 452
          },
          {
            "uf": "RJ",
            "name": "Rio de Janeiro",
            "births": 48,
            "five_year_survival_pct": 31.25,
            "source_row": 473
          },
          {
            "uf": "SP",
            "name": "São Paulo",
            "births": 170,
            "five_year_survival_pct": 50,
            "source_row": 494
          },
          {
            "uf": "PR",
            "name": "Paraná",
            "births": 62,
            "five_year_survival_pct": 53.22581,
            "source_row": 536
          },
          {
            "uf": "SC",
            "name": "Santa Catarina",
            "births": 63,
            "five_year_survival_pct": 42.85714,
            "source_row": 557
          },
          {
            "uf": "RS",
            "name": "Rio Grande do Sul",
            "births": 62,
            "five_year_survival_pct": 43.54839,
            "source_row": 578
          },
          {
            "uf": "MS",
            "name": "Mato Grosso do Sul",
            "births": 27,
            "five_year_survival_pct": 37.03704,
            "source_row": 620
          },
          {
            "uf": "MT",
            "name": "Mato Grosso",
            "births": 25,
            "five_year_survival_pct": 44,
            "source_row": 641
          },
          {
            "uf": "GO",
            "name": "Goiás",
            "births": 48,
            "five_year_survival_pct": 25,
            "source_row": 662
          },
          {
            "uf": "DF",
            "name": "Distrito Federal",
            "births": 12,
            "five_year_survival_pct": 50,
            "source_row": 683
          }
        ]
      },
      {
        "section": "F",
        "label": "F Construção",
        "national_births": 18190,
        "national_five_year_pct": 26.43211,
        "national_source_row": 12,
        "states": [
          {
            "uf": "RO",
            "name": "Rondônia",
            "births": 144,
            "five_year_survival_pct": 20.13889,
            "source_row": 54
          },
          {
            "uf": "AC",
            "name": "Acre",
            "births": 36,
            "five_year_survival_pct": 19.44444,
            "source_row": 75
          },
          {
            "uf": "AM",
            "name": "Amazonas",
            "births": 161,
            "five_year_survival_pct": 20.49689,
            "source_row": 96
          },
          {
            "uf": "RR",
            "name": "Roraima",
            "births": 34,
            "five_year_survival_pct": 29.41176,
            "source_row": 117
          },
          {
            "uf": "PA",
            "name": "Pará",
            "births": 309,
            "five_year_survival_pct": 28.15534,
            "source_row": 138
          },
          {
            "uf": "AP",
            "name": "Amapá",
            "births": 57,
            "five_year_survival_pct": 26.31579,
            "source_row": 159
          },
          {
            "uf": "TO",
            "name": "Tocantins",
            "births": 123,
            "five_year_survival_pct": 20.3252,
            "source_row": 180
          },
          {
            "uf": "MA",
            "name": "Maranhão",
            "births": 248,
            "five_year_survival_pct": 28.22581,
            "source_row": 222
          },
          {
            "uf": "PI",
            "name": "Piauí",
            "births": 162,
            "five_year_survival_pct": 31.48148,
            "source_row": 243
          },
          {
            "uf": "CE",
            "name": "Ceará",
            "births": 449,
            "five_year_survival_pct": 26.72606,
            "source_row": 264
          },
          {
            "uf": "RN",
            "name": "Rio Grande do Norte",
            "births": 298,
            "five_year_survival_pct": 22.48322,
            "source_row": 285
          },
          {
            "uf": "PB",
            "name": "Paraíba",
            "births": 300,
            "five_year_survival_pct": 23.66667,
            "source_row": 306
          },
          {
            "uf": "PE",
            "name": "Pernambuco",
            "births": 418,
            "five_year_survival_pct": 24.64115,
            "source_row": 327
          },
          {
            "uf": "AL",
            "name": "Alagoas",
            "births": 152,
            "five_year_survival_pct": 26.97368,
            "source_row": 348
          },
          {
            "uf": "SE",
            "name": "Sergipe",
            "births": 141,
            "five_year_survival_pct": 26.95035,
            "source_row": 369
          },
          {
            "uf": "BA",
            "name": "Bahia",
            "births": 818,
            "five_year_survival_pct": 24.20538,
            "source_row": 390
          },
          {
            "uf": "MG",
            "name": "Minas Gerais",
            "births": 2132,
            "five_year_survival_pct": 21.90432,
            "source_row": 432
          },
          {
            "uf": "ES",
            "name": "Espírito Santo",
            "births": 403,
            "five_year_survival_pct": 23.82134,
            "source_row": 453
          },
          {
            "uf": "RJ",
            "name": "Rio de Janeiro",
            "births": 990,
            "five_year_survival_pct": 28.28283,
            "source_row": 474
          },
          {
            "uf": "SP",
            "name": "São Paulo",
            "births": 4763,
            "five_year_survival_pct": 29.07831,
            "source_row": 495
          },
          {
            "uf": "PR",
            "name": "Paraná",
            "births": 1678,
            "five_year_survival_pct": 24.67223,
            "source_row": 537
          },
          {
            "uf": "SC",
            "name": "Santa Catarina",
            "births": 1250,
            "five_year_survival_pct": 31.36,
            "source_row": 558
          },
          {
            "uf": "RS",
            "name": "Rio Grande do Sul",
            "births": 1373,
            "five_year_survival_pct": 26.58412,
            "source_row": 579
          },
          {
            "uf": "MS",
            "name": "Mato Grosso do Sul",
            "births": 255,
            "five_year_survival_pct": 21.17647,
            "source_row": 621
          },
          {
            "uf": "MT",
            "name": "Mato Grosso",
            "births": 407,
            "five_year_survival_pct": 26.53563,
            "source_row": 642
          },
          {
            "uf": "GO",
            "name": "Goiás",
            "births": 736,
            "five_year_survival_pct": 25.67935,
            "source_row": 663
          },
          {
            "uf": "DF",
            "name": "Distrito Federal",
            "births": 353,
            "five_year_survival_pct": 26.34561,
            "source_row": 684
          }
        ]
      },
      {
        "section": "G",
        "label": "G Comércio; reparação de veículos automotores e motocicletas",
        "national_births": 131825,
        "national_five_year_pct": 37.59302,
        "national_source_row": 13,
        "states": [
          {
            "uf": "RO",
            "name": "Rondônia",
            "births": 1401,
            "five_year_survival_pct": 35.33191,
            "source_row": 55
          },
          {
            "uf": "AC",
            "name": "Acre",
            "births": 370,
            "five_year_survival_pct": 34.59459,
            "source_row": 76
          },
          {
            "uf": "AM",
            "name": "Amazonas",
            "births": 1275,
            "five_year_survival_pct": 36.31373,
            "source_row": 97
          },
          {
            "uf": "RR",
            "name": "Roraima",
            "births": 271,
            "five_year_survival_pct": 37.63838,
            "source_row": 118
          },
          {
            "uf": "PA",
            "name": "Pará",
            "births": 3181,
            "five_year_survival_pct": 37.75542,
            "source_row": 139
          },
          {
            "uf": "AP",
            "name": "Amapá",
            "births": 428,
            "five_year_survival_pct": 28.50467,
            "source_row": 160
          },
          {
            "uf": "TO",
            "name": "Tocantins",
            "births": 1106,
            "five_year_survival_pct": 38.0651,
            "source_row": 181
          },
          {
            "uf": "MA",
            "name": "Maranhão",
            "births": 2629,
            "five_year_survival_pct": 38.2655,
            "source_row": 223
          },
          {
            "uf": "PI",
            "name": "Piauí",
            "births": 1612,
            "five_year_survival_pct": 41.067,
            "source_row": 244
          },
          {
            "uf": "CE",
            "name": "Ceará",
            "births": 3620,
            "five_year_survival_pct": 37.29282,
            "source_row": 265
          },
          {
            "uf": "RN",
            "name": "Rio Grande do Norte",
            "births": 1927,
            "five_year_survival_pct": 36.37779,
            "source_row": 286
          },
          {
            "uf": "PB",
            "name": "Paraíba",
            "births": 1715,
            "five_year_survival_pct": 39.88338,
            "source_row": 307
          },
          {
            "uf": "PE",
            "name": "Pernambuco",
            "births": 4530,
            "five_year_survival_pct": 36.35762,
            "source_row": 328
          },
          {
            "uf": "AL",
            "name": "Alagoas",
            "births": 1454,
            "five_year_survival_pct": 34.663,
            "source_row": 349
          },
          {
            "uf": "SE",
            "name": "Sergipe",
            "births": 1062,
            "five_year_survival_pct": 40.86629,
            "source_row": 370
          },
          {
            "uf": "BA",
            "name": "Bahia",
            "births": 7901,
            "five_year_survival_pct": 37.21048,
            "source_row": 391
          },
          {
            "uf": "MG",
            "name": "Minas Gerais",
            "births": 13502,
            "five_year_survival_pct": 37.66849,
            "source_row": 433
          },
          {
            "uf": "ES",
            "name": "Espírito Santo",
            "births": 2736,
            "five_year_survival_pct": 37.6462,
            "source_row": 454
          },
          {
            "uf": "RJ",
            "name": "Rio de Janeiro",
            "births": 8431,
            "five_year_survival_pct": 38.21611,
            "source_row": 475
          },
          {
            "uf": "SP",
            "name": "São Paulo",
            "births": 33106,
            "five_year_survival_pct": 38.55797,
            "source_row": 496
          },
          {
            "uf": "PR",
            "name": "Paraná",
            "births": 10024,
            "five_year_survival_pct": 36.72187,
            "source_row": 538
          },
          {
            "uf": "SC",
            "name": "Santa Catarina",
            "births": 6772,
            "five_year_survival_pct": 39.02835,
            "source_row": 559
          },
          {
            "uf": "RS",
            "name": "Rio Grande do Sul",
            "births": 8730,
            "five_year_survival_pct": 37.77778,
            "source_row": 580
          },
          {
            "uf": "MS",
            "name": "Mato Grosso do Sul",
            "births": 1844,
            "five_year_survival_pct": 37.52711,
            "source_row": 622
          },
          {
            "uf": "MT",
            "name": "Mato Grosso",
            "births": 3247,
            "five_year_survival_pct": 37.69634,
            "source_row": 643
          },
          {
            "uf": "GO",
            "name": "Goiás",
            "births": 6038,
            "five_year_survival_pct": 34.77973,
            "source_row": 664
          },
          {
            "uf": "DF",
            "name": "Distrito Federal",
            "births": 2913,
            "five_year_survival_pct": 32.8184,
            "source_row": 685
          }
        ]
      },
      {
        "section": "H",
        "label": "H Transporte, armazenagem e correio",
        "national_births": 15816,
        "national_five_year_pct": 35.38821,
        "national_source_row": 14,
        "states": [
          {
            "uf": "RO",
            "name": "Rondônia",
            "births": 128,
            "five_year_survival_pct": 39.0625,
            "source_row": 56
          },
          {
            "uf": "AC",
            "name": "Acre",
            "births": 14,
            "five_year_survival_pct": 35.71429,
            "source_row": 77
          },
          {
            "uf": "AM",
            "name": "Amazonas",
            "births": 101,
            "five_year_survival_pct": 44.55446,
            "source_row": 98
          },
          {
            "uf": "RR",
            "name": "Roraima",
            "births": 16,
            "five_year_survival_pct": 18.75,
            "source_row": 119
          },
          {
            "uf": "PA",
            "name": "Pará",
            "births": 247,
            "five_year_survival_pct": 39.27126,
            "source_row": 140
          },
          {
            "uf": "AP",
            "name": "Amapá",
            "births": 12,
            "five_year_survival_pct": 33.33333,
            "source_row": 161
          },
          {
            "uf": "TO",
            "name": "Tocantins",
            "births": 96,
            "five_year_survival_pct": 28.125,
            "source_row": 182
          },
          {
            "uf": "MA",
            "name": "Maranhão",
            "births": 137,
            "five_year_survival_pct": 33.57664,
            "source_row": 224
          },
          {
            "uf": "PI",
            "name": "Piauí",
            "births": 75,
            "five_year_survival_pct": 25.33333,
            "source_row": 245
          },
          {
            "uf": "CE",
            "name": "Ceará",
            "births": 289,
            "five_year_survival_pct": 36.6782,
            "source_row": 266
          },
          {
            "uf": "RN",
            "name": "Rio Grande do Norte",
            "births": 84,
            "five_year_survival_pct": 45.2381,
            "source_row": 287
          },
          {
            "uf": "PB",
            "name": "Paraíba",
            "births": 86,
            "five_year_survival_pct": 32.55814,
            "source_row": 308
          },
          {
            "uf": "PE",
            "name": "Pernambuco",
            "births": 356,
            "five_year_survival_pct": 39.32584,
            "source_row": 329
          },
          {
            "uf": "AL",
            "name": "Alagoas",
            "births": 109,
            "five_year_survival_pct": 27.52294,
            "source_row": 350
          },
          {
            "uf": "SE",
            "name": "Sergipe",
            "births": 80,
            "five_year_survival_pct": 38.75,
            "source_row": 371
          },
          {
            "uf": "BA",
            "name": "Bahia",
            "births": 619,
            "five_year_survival_pct": 33.11793,
            "source_row": 392
          },
          {
            "uf": "MG",
            "name": "Minas Gerais",
            "births": 2059,
            "five_year_survival_pct": 33.94852,
            "source_row": 434
          },
          {
            "uf": "ES",
            "name": "Espírito Santo",
            "births": 279,
            "five_year_survival_pct": 37.63441,
            "source_row": 455
          },
          {
            "uf": "RJ",
            "name": "Rio de Janeiro",
            "births": 766,
            "five_year_survival_pct": 42.1671,
            "source_row": 476
          },
          {
            "uf": "SP",
            "name": "São Paulo",
            "births": 4538,
            "five_year_survival_pct": 33.67122,
            "source_row": 497
          },
          {
            "uf": "PR",
            "name": "Paraná",
            "births": 1689,
            "five_year_survival_pct": 35.58319,
            "source_row": 539
          },
          {
            "uf": "SC",
            "name": "Santa Catarina",
            "births": 1091,
            "five_year_survival_pct": 39.96334,
            "source_row": 560
          },
          {
            "uf": "RS",
            "name": "Rio Grande do Sul",
            "births": 1284,
            "five_year_survival_pct": 35.12461,
            "source_row": 581
          },
          {
            "uf": "MS",
            "name": "Mato Grosso do Sul",
            "births": 313,
            "five_year_survival_pct": 33.22684,
            "source_row": 623
          },
          {
            "uf": "MT",
            "name": "Mato Grosso",
            "births": 495,
            "five_year_survival_pct": 35.55556,
            "source_row": 644
          },
          {
            "uf": "GO",
            "name": "Goiás",
            "births": 657,
            "five_year_survival_pct": 37.59513,
            "source_row": 665
          },
          {
            "uf": "DF",
            "name": "Distrito Federal",
            "births": 196,
            "five_year_survival_pct": 27.04082,
            "source_row": 686
          }
        ]
      },
      {
        "section": "I",
        "label": "I Alojamento e alimentação",
        "national_births": 29494,
        "national_five_year_pct": 30.5791,
        "national_source_row": 15,
        "states": [
          {
            "uf": "RO",
            "name": "Rondônia",
            "births": 203,
            "five_year_survival_pct": 33.00493,
            "source_row": 57
          },
          {
            "uf": "AC",
            "name": "Acre",
            "births": 55,
            "five_year_survival_pct": 27.27273,
            "source_row": 78
          },
          {
            "uf": "AM",
            "name": "Amazonas",
            "births": 231,
            "five_year_survival_pct": 27.70563,
            "source_row": 99
          },
          {
            "uf": "RR",
            "name": "Roraima",
            "births": 65,
            "five_year_survival_pct": 38.46154,
            "source_row": 120
          },
          {
            "uf": "PA",
            "name": "Pará",
            "births": 381,
            "five_year_survival_pct": 31.49606,
            "source_row": 141
          },
          {
            "uf": "AP",
            "name": "Amapá",
            "births": 69,
            "five_year_survival_pct": 15.94203,
            "source_row": 162
          },
          {
            "uf": "TO",
            "name": "Tocantins",
            "births": 152,
            "five_year_survival_pct": 25,
            "source_row": 183
          },
          {
            "uf": "MA",
            "name": "Maranhão",
            "births": 303,
            "five_year_survival_pct": 34.32343,
            "source_row": 225
          },
          {
            "uf": "PI",
            "name": "Piauí",
            "births": 275,
            "five_year_survival_pct": 33.81818,
            "source_row": 246
          },
          {
            "uf": "CE",
            "name": "Ceará",
            "births": 772,
            "five_year_survival_pct": 31.34715,
            "source_row": 267
          },
          {
            "uf": "RN",
            "name": "Rio Grande do Norte",
            "births": 422,
            "five_year_survival_pct": 28.90995,
            "source_row": 288
          },
          {
            "uf": "PB",
            "name": "Paraíba",
            "births": 315,
            "five_year_survival_pct": 36.50794,
            "source_row": 309
          },
          {
            "uf": "PE",
            "name": "Pernambuco",
            "births": 898,
            "five_year_survival_pct": 32.85078,
            "source_row": 330
          },
          {
            "uf": "AL",
            "name": "Alagoas",
            "births": 302,
            "five_year_survival_pct": 32.78146,
            "source_row": 351
          },
          {
            "uf": "SE",
            "name": "Sergipe",
            "births": 190,
            "five_year_survival_pct": 29.47368,
            "source_row": 372
          },
          {
            "uf": "BA",
            "name": "Bahia",
            "births": 1351,
            "five_year_survival_pct": 31.23612,
            "source_row": 393
          },
          {
            "uf": "MG",
            "name": "Minas Gerais",
            "births": 3114,
            "five_year_survival_pct": 29.70456,
            "source_row": 435
          },
          {
            "uf": "ES",
            "name": "Espírito Santo",
            "births": 617,
            "five_year_survival_pct": 29.49757,
            "source_row": 456
          },
          {
            "uf": "RJ",
            "name": "Rio de Janeiro",
            "births": 2500,
            "five_year_survival_pct": 31,
            "source_row": 477
          },
          {
            "uf": "SP",
            "name": "São Paulo",
            "births": 8538,
            "five_year_survival_pct": 31.24854,
            "source_row": 498
          },
          {
            "uf": "PR",
            "name": "Paraná",
            "births": 2097,
            "five_year_survival_pct": 27.61087,
            "source_row": 540
          },
          {
            "uf": "SC",
            "name": "Santa Catarina",
            "births": 1827,
            "five_year_survival_pct": 31.63656,
            "source_row": 561
          },
          {
            "uf": "RS",
            "name": "Rio Grande do Sul",
            "births": 1741,
            "five_year_survival_pct": 31.87823,
            "source_row": 582
          },
          {
            "uf": "MS",
            "name": "Mato Grosso do Sul",
            "births": 429,
            "five_year_survival_pct": 30.30303,
            "source_row": 624
          },
          {
            "uf": "MT",
            "name": "Mato Grosso",
            "births": 594,
            "five_year_survival_pct": 28.78788,
            "source_row": 645
          },
          {
            "uf": "GO",
            "name": "Goiás",
            "births": 1155,
            "five_year_survival_pct": 28.22511,
            "source_row": 666
          },
          {
            "uf": "DF",
            "name": "Distrito Federal",
            "births": 898,
            "five_year_survival_pct": 26.94878,
            "source_row": 687
          }
        ]
      },
      {
        "section": "J",
        "label": "J Informação e comunicação",
        "national_births": 5363,
        "national_five_year_pct": 43.44583,
        "national_source_row": 16,
        "states": [
          {
            "uf": "RO",
            "name": "Rondônia",
            "births": 41,
            "five_year_survival_pct": 39.02439,
            "source_row": 58
          },
          {
            "uf": "AC",
            "name": "Acre",
            "births": 7,
            "five_year_survival_pct": 42.85714,
            "source_row": 79
          },
          {
            "uf": "AM",
            "name": "Amazonas",
            "births": 41,
            "five_year_survival_pct": 56.09756,
            "source_row": 100
          },
          {
            "uf": "RR",
            "name": "Roraima",
            "births": 11,
            "five_year_survival_pct": 45.45455,
            "source_row": 121
          },
          {
            "uf": "PA",
            "name": "Pará",
            "births": 71,
            "five_year_survival_pct": 54.92958,
            "source_row": 142
          },
          {
            "uf": "AP",
            "name": "Amapá",
            "births": 10,
            "five_year_survival_pct": 40,
            "source_row": 163
          },
          {
            "uf": "TO",
            "name": "Tocantins",
            "births": 24,
            "five_year_survival_pct": 41.66667,
            "source_row": 184
          },
          {
            "uf": "MA",
            "name": "Maranhão",
            "births": 73,
            "five_year_survival_pct": 54.79452,
            "source_row": 226
          },
          {
            "uf": "PI",
            "name": "Piauí",
            "births": 43,
            "five_year_survival_pct": 53.48837,
            "source_row": 247
          },
          {
            "uf": "CE",
            "name": "Ceará",
            "births": 164,
            "five_year_survival_pct": 49.39024,
            "source_row": 268
          },
          {
            "uf": "RN",
            "name": "Rio Grande do Norte",
            "births": 57,
            "five_year_survival_pct": 45.61404,
            "source_row": 289
          },
          {
            "uf": "PB",
            "name": "Paraíba",
            "births": 74,
            "five_year_survival_pct": 58.10811,
            "source_row": 310
          },
          {
            "uf": "PE",
            "name": "Pernambuco",
            "births": 165,
            "five_year_survival_pct": 40.60606,
            "source_row": 331
          },
          {
            "uf": "AL",
            "name": "Alagoas",
            "births": 63,
            "five_year_survival_pct": 42.85714,
            "source_row": 352
          },
          {
            "uf": "SE",
            "name": "Sergipe",
            "births": 52,
            "five_year_survival_pct": 42.30769,
            "source_row": 373
          },
          {
            "uf": "BA",
            "name": "Bahia",
            "births": 252,
            "five_year_survival_pct": 48.01587,
            "source_row": 394
          },
          {
            "uf": "MG",
            "name": "Minas Gerais",
            "births": 528,
            "five_year_survival_pct": 42.23485,
            "source_row": 436
          },
          {
            "uf": "ES",
            "name": "Espírito Santo",
            "births": 96,
            "five_year_survival_pct": 52.08333,
            "source_row": 457
          },
          {
            "uf": "RJ",
            "name": "Rio de Janeiro",
            "births": 365,
            "five_year_survival_pct": 46.0274,
            "source_row": 478
          },
          {
            "uf": "SP",
            "name": "São Paulo",
            "births": 1648,
            "five_year_survival_pct": 42.05097,
            "source_row": 499
          },
          {
            "uf": "PR",
            "name": "Paraná",
            "births": 387,
            "five_year_survival_pct": 41.60207,
            "source_row": 541
          },
          {
            "uf": "SC",
            "name": "Santa Catarina",
            "births": 298,
            "five_year_survival_pct": 42.28188,
            "source_row": 562
          },
          {
            "uf": "RS",
            "name": "Rio Grande do Sul",
            "births": 362,
            "five_year_survival_pct": 43.09392,
            "source_row": 583
          },
          {
            "uf": "MS",
            "name": "Mato Grosso do Sul",
            "births": 82,
            "five_year_survival_pct": 36.58537,
            "source_row": 625
          },
          {
            "uf": "MT",
            "name": "Mato Grosso",
            "births": 110,
            "five_year_survival_pct": 45.45455,
            "source_row": 646
          },
          {
            "uf": "GO",
            "name": "Goiás",
            "births": 215,
            "five_year_survival_pct": 41.39535,
            "source_row": 667
          },
          {
            "uf": "DF",
            "name": "Distrito Federal",
            "births": 124,
            "five_year_survival_pct": 27.41935,
            "source_row": 688
          }
        ]
      },
      {
        "section": "K",
        "label": "K Atividades financeiras, de seguros e serviços relacionados",
        "national_births": 3933,
        "national_five_year_pct": 50.16527,
        "national_source_row": 17,
        "states": [
          {
            "uf": "RO",
            "name": "Rondônia",
            "births": 45,
            "five_year_survival_pct": 62.22222,
            "source_row": 59
          },
          {
            "uf": "AC",
            "name": "Acre",
            "births": 10,
            "five_year_survival_pct": 50,
            "source_row": 80
          },
          {
            "uf": "AM",
            "name": "Amazonas",
            "births": 16,
            "five_year_survival_pct": 6.25,
            "source_row": 101
          },
          {
            "uf": "RR",
            "name": "Roraima",
            "births": 6,
            "five_year_survival_pct": 50,
            "source_row": 122
          },
          {
            "uf": "PA",
            "name": "Pará",
            "births": 82,
            "five_year_survival_pct": 65.85366,
            "source_row": 143
          },
          {
            "uf": "AP",
            "name": "Amapá",
            "births": 8,
            "five_year_survival_pct": 0,
            "source_row": 164
          },
          {
            "uf": "TO",
            "name": "Tocantins",
            "births": 21,
            "five_year_survival_pct": 57.14286,
            "source_row": 185
          },
          {
            "uf": "MA",
            "name": "Maranhão",
            "births": 42,
            "five_year_survival_pct": 42.85714,
            "source_row": 227
          },
          {
            "uf": "PI",
            "name": "Piauí",
            "births": 14,
            "five_year_survival_pct": 50,
            "source_row": 248
          },
          {
            "uf": "CE",
            "name": "Ceará",
            "births": 87,
            "five_year_survival_pct": 41.37931,
            "source_row": 269
          },
          {
            "uf": "RN",
            "name": "Rio Grande do Norte",
            "births": 50,
            "five_year_survival_pct": 38,
            "source_row": 290
          },
          {
            "uf": "PB",
            "name": "Paraíba",
            "births": 49,
            "five_year_survival_pct": 51.02041,
            "source_row": 311
          },
          {
            "uf": "PE",
            "name": "Pernambuco",
            "births": 105,
            "five_year_survival_pct": 57.14286,
            "source_row": 332
          },
          {
            "uf": "AL",
            "name": "Alagoas",
            "births": 36,
            "five_year_survival_pct": 30.55556,
            "source_row": 353
          },
          {
            "uf": "SE",
            "name": "Sergipe",
            "births": 25,
            "five_year_survival_pct": 60,
            "source_row": 374
          },
          {
            "uf": "BA",
            "name": "Bahia",
            "births": 126,
            "five_year_survival_pct": 38.88889,
            "source_row": 395
          },
          {
            "uf": "MG",
            "name": "Minas Gerais",
            "births": 369,
            "five_year_survival_pct": 49.8645,
            "source_row": 437
          },
          {
            "uf": "ES",
            "name": "Espírito Santo",
            "births": 143,
            "five_year_survival_pct": 83.91608,
            "source_row": 458
          },
          {
            "uf": "RJ",
            "name": "Rio de Janeiro",
            "births": 304,
            "five_year_survival_pct": 53.61842,
            "source_row": 479
          },
          {
            "uf": "SP",
            "name": "São Paulo",
            "births": 1278,
            "five_year_survival_pct": 47.49609,
            "source_row": 500
          },
          {
            "uf": "PR",
            "name": "Paraná",
            "births": 307,
            "five_year_survival_pct": 50.16287,
            "source_row": 542
          },
          {
            "uf": "SC",
            "name": "Santa Catarina",
            "births": 202,
            "five_year_survival_pct": 53.9604,
            "source_row": 563
          },
          {
            "uf": "RS",
            "name": "Rio Grande do Sul",
            "births": 265,
            "five_year_survival_pct": 49.81132,
            "source_row": 584
          },
          {
            "uf": "MS",
            "name": "Mato Grosso do Sul",
            "births": 43,
            "five_year_survival_pct": 65.11628,
            "source_row": 626
          },
          {
            "uf": "MT",
            "name": "Mato Grosso",
            "births": 100,
            "five_year_survival_pct": 48,
            "source_row": 647
          },
          {
            "uf": "GO",
            "name": "Goiás",
            "births": 110,
            "five_year_survival_pct": 46.36364,
            "source_row": 668
          },
          {
            "uf": "DF",
            "name": "Distrito Federal",
            "births": 90,
            "five_year_survival_pct": 37.77778,
            "source_row": 689
          }
        ]
      },
      {
        "section": "L",
        "label": "L Atividades imobiliárias",
        "national_births": 3409,
        "national_five_year_pct": 43.06248,
        "national_source_row": 18,
        "states": [
          {
            "uf": "RO",
            "name": "Rondônia",
            "births": 9,
            "five_year_survival_pct": 88.88889,
            "source_row": 60
          },
          {
            "uf": "AC",
            "name": "Acre",
            "births": 4,
            "five_year_survival_pct": 0,
            "source_row": 81
          },
          {
            "uf": "AM",
            "name": "Amazonas",
            "births": 16,
            "five_year_survival_pct": 31.25,
            "source_row": 102
          },
          {
            "uf": "RR",
            "name": "Roraima",
            "births": 6,
            "five_year_survival_pct": 50,
            "source_row": 123
          },
          {
            "uf": "PA",
            "name": "Pará",
            "births": 42,
            "five_year_survival_pct": 42.85714,
            "source_row": 144
          },
          {
            "uf": "AP",
            "name": "Amapá",
            "births": 2,
            "five_year_survival_pct": 0,
            "source_row": 165
          },
          {
            "uf": "TO",
            "name": "Tocantins",
            "births": 24,
            "five_year_survival_pct": 50,
            "source_row": 186
          },
          {
            "uf": "MA",
            "name": "Maranhão",
            "births": 40,
            "five_year_survival_pct": 40,
            "source_row": 228
          },
          {
            "uf": "PI",
            "name": "Piauí",
            "births": 16,
            "five_year_survival_pct": 43.75,
            "source_row": 249
          },
          {
            "uf": "CE",
            "name": "Ceará",
            "births": 100,
            "five_year_survival_pct": 39,
            "source_row": 270
          },
          {
            "uf": "RN",
            "name": "Rio Grande do Norte",
            "births": 59,
            "five_year_survival_pct": 49.15254,
            "source_row": 291
          },
          {
            "uf": "PB",
            "name": "Paraíba",
            "births": 35,
            "five_year_survival_pct": 31.42857,
            "source_row": 312
          },
          {
            "uf": "PE",
            "name": "Pernambuco",
            "births": 102,
            "five_year_survival_pct": 49.01961,
            "source_row": 333
          },
          {
            "uf": "AL",
            "name": "Alagoas",
            "births": 21,
            "five_year_survival_pct": 61.90476,
            "source_row": 354
          },
          {
            "uf": "SE",
            "name": "Sergipe",
            "births": 25,
            "five_year_survival_pct": 52,
            "source_row": 375
          },
          {
            "uf": "BA",
            "name": "Bahia",
            "births": 117,
            "five_year_survival_pct": 42.73504,
            "source_row": 396
          },
          {
            "uf": "MG",
            "name": "Minas Gerais",
            "births": 400,
            "five_year_survival_pct": 39.75,
            "source_row": 438
          },
          {
            "uf": "ES",
            "name": "Espírito Santo",
            "births": 42,
            "five_year_survival_pct": 47.61905,
            "source_row": 459
          },
          {
            "uf": "RJ",
            "name": "Rio de Janeiro",
            "births": 263,
            "five_year_survival_pct": 46.76806,
            "source_row": 480
          },
          {
            "uf": "SP",
            "name": "São Paulo",
            "births": 1055,
            "five_year_survival_pct": 44.73934,
            "source_row": 501
          },
          {
            "uf": "PR",
            "name": "Paraná",
            "births": 230,
            "five_year_survival_pct": 37.3913,
            "source_row": 543
          },
          {
            "uf": "SC",
            "name": "Santa Catarina",
            "births": 231,
            "five_year_survival_pct": 40.69264,
            "source_row": 564
          },
          {
            "uf": "RS",
            "name": "Rio Grande do Sul",
            "births": 234,
            "five_year_survival_pct": 43.58974,
            "source_row": 585
          },
          {
            "uf": "MS",
            "name": "Mato Grosso do Sul",
            "births": 44,
            "five_year_survival_pct": 43.18182,
            "source_row": 627
          },
          {
            "uf": "MT",
            "name": "Mato Grosso",
            "births": 73,
            "five_year_survival_pct": 36.9863,
            "source_row": 648
          },
          {
            "uf": "GO",
            "name": "Goiás",
            "births": 137,
            "five_year_survival_pct": 39.41606,
            "source_row": 669
          },
          {
            "uf": "DF",
            "name": "Distrito Federal",
            "births": 82,
            "five_year_survival_pct": 46.34146,
            "source_row": 690
          }
        ]
      },
      {
        "section": "M",
        "label": "M Atividades profissionais, científicas e técnicas",
        "national_births": 13875,
        "national_five_year_pct": 40.76396,
        "national_source_row": 19,
        "states": [
          {
            "uf": "RO",
            "name": "Rondônia",
            "births": 176,
            "five_year_survival_pct": 37.5,
            "source_row": 61
          },
          {
            "uf": "AC",
            "name": "Acre",
            "births": 41,
            "five_year_survival_pct": 39.02439,
            "source_row": 82
          },
          {
            "uf": "AM",
            "name": "Amazonas",
            "births": 123,
            "five_year_survival_pct": 29.26829,
            "source_row": 103
          },
          {
            "uf": "RR",
            "name": "Roraima",
            "births": 31,
            "five_year_survival_pct": 41.93548,
            "source_row": 124
          },
          {
            "uf": "PA",
            "name": "Pará",
            "births": 260,
            "five_year_survival_pct": 35,
            "source_row": 145
          },
          {
            "uf": "AP",
            "name": "Amapá",
            "births": 23,
            "five_year_survival_pct": 17.3913,
            "source_row": 166
          },
          {
            "uf": "TO",
            "name": "Tocantins",
            "births": 127,
            "five_year_survival_pct": 40.94488,
            "source_row": 187
          },
          {
            "uf": "MA",
            "name": "Maranhão",
            "births": 177,
            "five_year_survival_pct": 32.20339,
            "source_row": 229
          },
          {
            "uf": "PI",
            "name": "Piauí",
            "births": 115,
            "five_year_survival_pct": 39.13043,
            "source_row": 250
          },
          {
            "uf": "CE",
            "name": "Ceará",
            "births": 378,
            "five_year_survival_pct": 37.83069,
            "source_row": 271
          },
          {
            "uf": "RN",
            "name": "Rio Grande do Norte",
            "births": 143,
            "five_year_survival_pct": 38.46154,
            "source_row": 292
          },
          {
            "uf": "PB",
            "name": "Paraíba",
            "births": 125,
            "five_year_survival_pct": 40,
            "source_row": 313
          },
          {
            "uf": "PE",
            "name": "Pernambuco",
            "births": 410,
            "five_year_survival_pct": 38.78049,
            "source_row": 334
          },
          {
            "uf": "AL",
            "name": "Alagoas",
            "births": 102,
            "five_year_survival_pct": 42.15686,
            "source_row": 355
          },
          {
            "uf": "SE",
            "name": "Sergipe",
            "births": 139,
            "five_year_survival_pct": 43.88489,
            "source_row": 376
          },
          {
            "uf": "BA",
            "name": "Bahia",
            "births": 676,
            "five_year_survival_pct": 41.12426,
            "source_row": 397
          },
          {
            "uf": "MG",
            "name": "Minas Gerais",
            "births": 1548,
            "five_year_survival_pct": 39.92248,
            "source_row": 439
          },
          {
            "uf": "ES",
            "name": "Espírito Santo",
            "births": 281,
            "five_year_survival_pct": 39.85765,
            "source_row": 460
          },
          {
            "uf": "RJ",
            "name": "Rio de Janeiro",
            "births": 997,
            "five_year_survival_pct": 44.2327,
            "source_row": 481
          },
          {
            "uf": "SP",
            "name": "São Paulo",
            "births": 3719,
            "five_year_survival_pct": 41.67787,
            "source_row": 502
          },
          {
            "uf": "PR",
            "name": "Paraná",
            "births": 1038,
            "five_year_survival_pct": 40.17341,
            "source_row": 544
          },
          {
            "uf": "SC",
            "name": "Santa Catarina",
            "births": 753,
            "five_year_survival_pct": 45.68393,
            "source_row": 565
          },
          {
            "uf": "RS",
            "name": "Rio Grande do Sul",
            "births": 980,
            "five_year_survival_pct": 43.06122,
            "source_row": 586
          },
          {
            "uf": "MS",
            "name": "Mato Grosso do Sul",
            "births": 230,
            "five_year_survival_pct": 43.91304,
            "source_row": 628
          },
          {
            "uf": "MT",
            "name": "Mato Grosso",
            "births": 344,
            "five_year_survival_pct": 38.95349,
            "source_row": 649
          },
          {
            "uf": "GO",
            "name": "Goiás",
            "births": 599,
            "five_year_survival_pct": 37.5626,
            "source_row": 670
          },
          {
            "uf": "DF",
            "name": "Distrito Federal",
            "births": 340,
            "five_year_survival_pct": 36.17647,
            "source_row": 691
          }
        ]
      },
      {
        "section": "N",
        "label": "N Atividades administrativas e serviços complementares",
        "national_births": 18062,
        "national_five_year_pct": 39.58587,
        "national_source_row": 20,
        "states": [
          {
            "uf": "RO",
            "name": "Rondônia",
            "births": 125,
            "five_year_survival_pct": 32,
            "source_row": 62
          },
          {
            "uf": "AC",
            "name": "Acre",
            "births": 36,
            "five_year_survival_pct": 25,
            "source_row": 83
          },
          {
            "uf": "AM",
            "name": "Amazonas",
            "births": 184,
            "five_year_survival_pct": 41.30435,
            "source_row": 104
          },
          {
            "uf": "RR",
            "name": "Roraima",
            "births": 26,
            "five_year_survival_pct": 26.92308,
            "source_row": 125
          },
          {
            "uf": "PA",
            "name": "Pará",
            "births": 294,
            "five_year_survival_pct": 44.89796,
            "source_row": 146
          },
          {
            "uf": "AP",
            "name": "Amapá",
            "births": 42,
            "five_year_survival_pct": 35.71429,
            "source_row": 167
          },
          {
            "uf": "TO",
            "name": "Tocantins",
            "births": 105,
            "five_year_survival_pct": 34.28571,
            "source_row": 188
          },
          {
            "uf": "MA",
            "name": "Maranhão",
            "births": 213,
            "five_year_survival_pct": 42.25352,
            "source_row": 230
          },
          {
            "uf": "PI",
            "name": "Piauí",
            "births": 122,
            "five_year_survival_pct": 40.16393,
            "source_row": 251
          },
          {
            "uf": "CE",
            "name": "Ceará",
            "births": 484,
            "five_year_survival_pct": 40.49587,
            "source_row": 272
          },
          {
            "uf": "RN",
            "name": "Rio Grande do Norte",
            "births": 218,
            "five_year_survival_pct": 36.23853,
            "source_row": 293
          },
          {
            "uf": "PB",
            "name": "Paraíba",
            "births": 191,
            "five_year_survival_pct": 46.0733,
            "source_row": 314
          },
          {
            "uf": "PE",
            "name": "Pernambuco",
            "births": 480,
            "five_year_survival_pct": 40.20833,
            "source_row": 335
          },
          {
            "uf": "AL",
            "name": "Alagoas",
            "births": 150,
            "five_year_survival_pct": 40.66667,
            "source_row": 356
          },
          {
            "uf": "SE",
            "name": "Sergipe",
            "births": 147,
            "five_year_survival_pct": 38.09524,
            "source_row": 377
          },
          {
            "uf": "BA",
            "name": "Bahia",
            "births": 800,
            "five_year_survival_pct": 43.375,
            "source_row": 398
          },
          {
            "uf": "MG",
            "name": "Minas Gerais",
            "births": 1820,
            "five_year_survival_pct": 39.34066,
            "source_row": 440
          },
          {
            "uf": "ES",
            "name": "Espírito Santo",
            "births": 344,
            "five_year_survival_pct": 36.62791,
            "source_row": 461
          },
          {
            "uf": "RJ",
            "name": "Rio de Janeiro",
            "births": 1288,
            "five_year_survival_pct": 39.20807,
            "source_row": 482
          },
          {
            "uf": "SP",
            "name": "São Paulo",
            "births": 5795,
            "five_year_survival_pct": 39.43054,
            "source_row": 503
          },
          {
            "uf": "PR",
            "name": "Paraná",
            "births": 1317,
            "five_year_survival_pct": 42.52088,
            "source_row": 545
          },
          {
            "uf": "SC",
            "name": "Santa Catarina",
            "births": 983,
            "five_year_survival_pct": 41.91251,
            "source_row": 566
          },
          {
            "uf": "RS",
            "name": "Rio Grande do Sul",
            "births": 1107,
            "five_year_survival_pct": 37.12737,
            "source_row": 587
          },
          {
            "uf": "MS",
            "name": "Mato Grosso do Sul",
            "births": 244,
            "five_year_survival_pct": 33.60656,
            "source_row": 629
          },
          {
            "uf": "MT",
            "name": "Mato Grosso",
            "births": 353,
            "five_year_survival_pct": 37.11048,
            "source_row": 650
          },
          {
            "uf": "GO",
            "name": "Goiás",
            "births": 794,
            "five_year_survival_pct": 40.05038,
            "source_row": 671
          },
          {
            "uf": "DF",
            "name": "Distrito Federal",
            "births": 400,
            "five_year_survival_pct": 32.5,
            "source_row": 692
          }
        ]
      },
      {
        "section": "O",
        "label": "O Administração pública, defesa e seguridade social",
        "national_births": 8,
        "national_five_year_pct": 50,
        "national_source_row": 21,
        "states": [
          {
            "uf": "RO",
            "name": "Rondônia",
            "births": 0,
            "five_year_survival_pct": null,
            "source_row": 63
          },
          {
            "uf": "AC",
            "name": "Acre",
            "births": 0,
            "five_year_survival_pct": null,
            "source_row": 84
          },
          {
            "uf": "AM",
            "name": "Amazonas",
            "births": 0,
            "five_year_survival_pct": null,
            "source_row": 105
          },
          {
            "uf": "RR",
            "name": "Roraima",
            "births": 0,
            "five_year_survival_pct": null,
            "source_row": 126
          },
          {
            "uf": "PA",
            "name": "Pará",
            "births": 0,
            "five_year_survival_pct": null,
            "source_row": 147
          },
          {
            "uf": "AP",
            "name": "Amapá",
            "births": 0,
            "five_year_survival_pct": null,
            "source_row": 168
          },
          {
            "uf": "TO",
            "name": "Tocantins",
            "births": 0,
            "five_year_survival_pct": null,
            "source_row": 189
          },
          {
            "uf": "MA",
            "name": "Maranhão",
            "births": 0,
            "five_year_survival_pct": null,
            "source_row": 231
          },
          {
            "uf": "PI",
            "name": "Piauí",
            "births": 0,
            "five_year_survival_pct": null,
            "source_row": 252
          },
          {
            "uf": "CE",
            "name": "Ceará",
            "births": 1,
            "five_year_survival_pct": 0,
            "source_row": 273
          },
          {
            "uf": "RN",
            "name": "Rio Grande do Norte",
            "births": 1,
            "five_year_survival_pct": 0,
            "source_row": 294
          },
          {
            "uf": "PB",
            "name": "Paraíba",
            "births": 0,
            "five_year_survival_pct": null,
            "source_row": 315
          },
          {
            "uf": "PE",
            "name": "Pernambuco",
            "births": 0,
            "five_year_survival_pct": null,
            "source_row": 336
          },
          {
            "uf": "AL",
            "name": "Alagoas",
            "births": 1,
            "five_year_survival_pct": 0,
            "source_row": 357
          },
          {
            "uf": "SE",
            "name": "Sergipe",
            "births": 0,
            "five_year_survival_pct": null,
            "source_row": 378
          },
          {
            "uf": "BA",
            "name": "Bahia",
            "births": 1,
            "five_year_survival_pct": 100,
            "source_row": 399
          },
          {
            "uf": "MG",
            "name": "Minas Gerais",
            "births": 0,
            "five_year_survival_pct": null,
            "source_row": 441
          },
          {
            "uf": "ES",
            "name": "Espírito Santo",
            "births": 0,
            "five_year_survival_pct": null,
            "source_row": 462
          },
          {
            "uf": "RJ",
            "name": "Rio de Janeiro",
            "births": 1,
            "five_year_survival_pct": 100,
            "source_row": 483
          },
          {
            "uf": "SP",
            "name": "São Paulo",
            "births": 1,
            "five_year_survival_pct": 100,
            "source_row": 504
          },
          {
            "uf": "PR",
            "name": "Paraná",
            "births": 0,
            "five_year_survival_pct": null,
            "source_row": 546
          },
          {
            "uf": "SC",
            "name": "Santa Catarina",
            "births": 0,
            "five_year_survival_pct": null,
            "source_row": 567
          },
          {
            "uf": "RS",
            "name": "Rio Grande do Sul",
            "births": 1,
            "five_year_survival_pct": 100,
            "source_row": 588
          },
          {
            "uf": "MS",
            "name": "Mato Grosso do Sul",
            "births": 0,
            "five_year_survival_pct": null,
            "source_row": 630
          },
          {
            "uf": "MT",
            "name": "Mato Grosso",
            "births": 0,
            "five_year_survival_pct": null,
            "source_row": 651
          },
          {
            "uf": "GO",
            "name": "Goiás",
            "births": 1,
            "five_year_survival_pct": 0,
            "source_row": 672
          },
          {
            "uf": "DF",
            "name": "Distrito Federal",
            "births": 0,
            "five_year_survival_pct": null,
            "source_row": 693
          }
        ]
      },
      {
        "section": "P",
        "label": "P Educação",
        "national_births": 6453,
        "national_five_year_pct": 43.77809,
        "national_source_row": 22,
        "states": [
          {
            "uf": "RO",
            "name": "Rondônia",
            "births": 40,
            "five_year_survival_pct": 30,
            "source_row": 64
          },
          {
            "uf": "AC",
            "name": "Acre",
            "births": 17,
            "five_year_survival_pct": 47.05882,
            "source_row": 85
          },
          {
            "uf": "AM",
            "name": "Amazonas",
            "births": 64,
            "five_year_survival_pct": 37.5,
            "source_row": 106
          },
          {
            "uf": "RR",
            "name": "Roraima",
            "births": 8,
            "five_year_survival_pct": 37.5,
            "source_row": 127
          },
          {
            "uf": "PA",
            "name": "Pará",
            "births": 138,
            "five_year_survival_pct": 49.27536,
            "source_row": 148
          },
          {
            "uf": "AP",
            "name": "Amapá",
            "births": 26,
            "five_year_survival_pct": 34.61538,
            "source_row": 169
          },
          {
            "uf": "TO",
            "name": "Tocantins",
            "births": 49,
            "five_year_survival_pct": 26.53061,
            "source_row": 190
          },
          {
            "uf": "MA",
            "name": "Maranhão",
            "births": 99,
            "five_year_survival_pct": 37.37374,
            "source_row": 232
          },
          {
            "uf": "PI",
            "name": "Piauí",
            "births": 57,
            "five_year_survival_pct": 47.36842,
            "source_row": 253
          },
          {
            "uf": "CE",
            "name": "Ceará",
            "births": 184,
            "five_year_survival_pct": 47.28261,
            "source_row": 274
          },
          {
            "uf": "RN",
            "name": "Rio Grande do Norte",
            "births": 82,
            "five_year_survival_pct": 52.43902,
            "source_row": 295
          },
          {
            "uf": "PB",
            "name": "Paraíba",
            "births": 91,
            "five_year_survival_pct": 45.05495,
            "source_row": 316
          },
          {
            "uf": "PE",
            "name": "Pernambuco",
            "births": 222,
            "five_year_survival_pct": 49.0991,
            "source_row": 337
          },
          {
            "uf": "AL",
            "name": "Alagoas",
            "births": 92,
            "five_year_survival_pct": 46.73913,
            "source_row": 358
          },
          {
            "uf": "SE",
            "name": "Sergipe",
            "births": 68,
            "five_year_survival_pct": 51.47059,
            "source_row": 379
          },
          {
            "uf": "BA",
            "name": "Bahia",
            "births": 352,
            "five_year_survival_pct": 40.625,
            "source_row": 400
          },
          {
            "uf": "MG",
            "name": "Minas Gerais",
            "births": 606,
            "five_year_survival_pct": 42.73927,
            "source_row": 442
          },
          {
            "uf": "ES",
            "name": "Espírito Santo",
            "births": 130,
            "five_year_survival_pct": 40,
            "source_row": 463
          },
          {
            "uf": "RJ",
            "name": "Rio de Janeiro",
            "births": 509,
            "five_year_survival_pct": 49.7053,
            "source_row": 484
          },
          {
            "uf": "SP",
            "name": "São Paulo",
            "births": 1780,
            "five_year_survival_pct": 44.4382,
            "source_row": 505
          },
          {
            "uf": "PR",
            "name": "Paraná",
            "births": 428,
            "five_year_survival_pct": 41.35514,
            "source_row": 547
          },
          {
            "uf": "SC",
            "name": "Santa Catarina",
            "births": 340,
            "five_year_survival_pct": 44.41176,
            "source_row": 568
          },
          {
            "uf": "RS",
            "name": "Rio Grande do Sul",
            "births": 421,
            "five_year_survival_pct": 43.46793,
            "source_row": 589
          },
          {
            "uf": "MS",
            "name": "Mato Grosso do Sul",
            "births": 63,
            "five_year_survival_pct": 53.96825,
            "source_row": 631
          },
          {
            "uf": "MT",
            "name": "Mato Grosso",
            "births": 143,
            "five_year_survival_pct": 42.65734,
            "source_row": 652
          },
          {
            "uf": "GO",
            "name": "Goiás",
            "births": 237,
            "five_year_survival_pct": 36.28692,
            "source_row": 673
          },
          {
            "uf": "DF",
            "name": "Distrito Federal",
            "births": 207,
            "five_year_survival_pct": 36.71498,
            "source_row": 694
          }
        ]
      },
      {
        "section": "Q",
        "label": "Q Saúde humana e serviços sociais",
        "national_births": 13142,
        "national_five_year_pct": 54.08614,
        "national_source_row": 23,
        "states": [
          {
            "uf": "RO",
            "name": "Rondônia",
            "births": 156,
            "five_year_survival_pct": 43.58974,
            "source_row": 65
          },
          {
            "uf": "AC",
            "name": "Acre",
            "births": 45,
            "five_year_survival_pct": 53.33333,
            "source_row": 86
          },
          {
            "uf": "AM",
            "name": "Amazonas",
            "births": 146,
            "five_year_survival_pct": 40.41096,
            "source_row": 107
          },
          {
            "uf": "RR",
            "name": "Roraima",
            "births": 36,
            "five_year_survival_pct": 69.44444,
            "source_row": 128
          },
          {
            "uf": "PA",
            "name": "Pará",
            "births": 302,
            "five_year_survival_pct": 52.64901,
            "source_row": 149
          },
          {
            "uf": "AP",
            "name": "Amapá",
            "births": 51,
            "five_year_survival_pct": 47.05882,
            "source_row": 170
          },
          {
            "uf": "TO",
            "name": "Tocantins",
            "births": 121,
            "five_year_survival_pct": 47.93388,
            "source_row": 191
          },
          {
            "uf": "MA",
            "name": "Maranhão",
            "births": 270,
            "five_year_survival_pct": 48.14815,
            "source_row": 233
          },
          {
            "uf": "PI",
            "name": "Piauí",
            "births": 183,
            "five_year_survival_pct": 53.00546,
            "source_row": 254
          },
          {
            "uf": "CE",
            "name": "Ceará",
            "births": 329,
            "five_year_survival_pct": 50.15198,
            "source_row": 275
          },
          {
            "uf": "RN",
            "name": "Rio Grande do Norte",
            "births": 165,
            "five_year_survival_pct": 57.57576,
            "source_row": 296
          },
          {
            "uf": "PB",
            "name": "Paraíba",
            "births": 170,
            "five_year_survival_pct": 60.58824,
            "source_row": 317
          },
          {
            "uf": "PE",
            "name": "Pernambuco",
            "births": 416,
            "five_year_survival_pct": 57.93269,
            "source_row": 338
          },
          {
            "uf": "AL",
            "name": "Alagoas",
            "births": 138,
            "five_year_survival_pct": 52.17391,
            "source_row": 359
          },
          {
            "uf": "SE",
            "name": "Sergipe",
            "births": 91,
            "five_year_survival_pct": 60.43956,
            "source_row": 380
          },
          {
            "uf": "BA",
            "name": "Bahia",
            "births": 733,
            "five_year_survival_pct": 54.43383,
            "source_row": 401
          },
          {
            "uf": "MG",
            "name": "Minas Gerais",
            "births": 1531,
            "five_year_survival_pct": 58.26257,
            "source_row": 443
          },
          {
            "uf": "ES",
            "name": "Espírito Santo",
            "births": 304,
            "five_year_survival_pct": 57.23684,
            "source_row": 464
          },
          {
            "uf": "RJ",
            "name": "Rio de Janeiro",
            "births": 1060,
            "five_year_survival_pct": 53.30189,
            "source_row": 485
          },
          {
            "uf": "SP",
            "name": "São Paulo",
            "births": 3098,
            "five_year_survival_pct": 53.48612,
            "source_row": 506
          },
          {
            "uf": "PR",
            "name": "Paraná",
            "births": 933,
            "five_year_survival_pct": 53.37621,
            "source_row": 548
          },
          {
            "uf": "SC",
            "name": "Santa Catarina",
            "births": 631,
            "five_year_survival_pct": 55.62599,
            "source_row": 569
          },
          {
            "uf": "RS",
            "name": "Rio Grande do Sul",
            "births": 739,
            "five_year_survival_pct": 57.78078,
            "source_row": 590
          },
          {
            "uf": "MS",
            "name": "Mato Grosso do Sul",
            "births": 208,
            "five_year_survival_pct": 52.40385,
            "source_row": 632
          },
          {
            "uf": "MT",
            "name": "Mato Grosso",
            "births": 334,
            "five_year_survival_pct": 49.7006,
            "source_row": 653
          },
          {
            "uf": "GO",
            "name": "Goiás",
            "births": 467,
            "five_year_survival_pct": 55.03212,
            "source_row": 674
          },
          {
            "uf": "DF",
            "name": "Distrito Federal",
            "births": 485,
            "five_year_survival_pct": 49.07216,
            "source_row": 695
          }
        ]
      },
      {
        "section": "R",
        "label": "R Artes, cultura, esporte e recreação",
        "national_births": 3579,
        "national_five_year_pct": 35.20536,
        "national_source_row": 24,
        "states": [
          {
            "uf": "RO",
            "name": "Rondônia",
            "births": 19,
            "five_year_survival_pct": 36.84211,
            "source_row": 66
          },
          {
            "uf": "AC",
            "name": "Acre",
            "births": 7,
            "five_year_survival_pct": 28.57143,
            "source_row": 87
          },
          {
            "uf": "AM",
            "name": "Amazonas",
            "births": 15,
            "five_year_survival_pct": 46.66667,
            "source_row": 108
          },
          {
            "uf": "RR",
            "name": "Roraima",
            "births": 5,
            "five_year_survival_pct": 40,
            "source_row": 129
          },
          {
            "uf": "PA",
            "name": "Pará",
            "births": 56,
            "five_year_survival_pct": 35.71429,
            "source_row": 150
          },
          {
            "uf": "AP",
            "name": "Amapá",
            "births": 13,
            "five_year_survival_pct": 30.76923,
            "source_row": 171
          },
          {
            "uf": "TO",
            "name": "Tocantins",
            "births": 12,
            "five_year_survival_pct": 16.66667,
            "source_row": 192
          },
          {
            "uf": "MA",
            "name": "Maranhão",
            "births": 55,
            "five_year_survival_pct": 38.18182,
            "source_row": 234
          },
          {
            "uf": "PI",
            "name": "Piauí",
            "births": 49,
            "five_year_survival_pct": 20.40816,
            "source_row": 255
          },
          {
            "uf": "CE",
            "name": "Ceará",
            "births": 105,
            "five_year_survival_pct": 40,
            "source_row": 276
          },
          {
            "uf": "RN",
            "name": "Rio Grande do Norte",
            "births": 64,
            "five_year_survival_pct": 39.0625,
            "source_row": 297
          },
          {
            "uf": "PB",
            "name": "Paraíba",
            "births": 36,
            "five_year_survival_pct": 44.44444,
            "source_row": 318
          },
          {
            "uf": "PE",
            "name": "Pernambuco",
            "births": 120,
            "five_year_survival_pct": 35.83333,
            "source_row": 339
          },
          {
            "uf": "AL",
            "name": "Alagoas",
            "births": 41,
            "five_year_survival_pct": 43.90244,
            "source_row": 360
          },
          {
            "uf": "SE",
            "name": "Sergipe",
            "births": 46,
            "five_year_survival_pct": 28.26087,
            "source_row": 381
          },
          {
            "uf": "BA",
            "name": "Bahia",
            "births": 179,
            "five_year_survival_pct": 35.19553,
            "source_row": 402
          },
          {
            "uf": "MG",
            "name": "Minas Gerais",
            "births": 484,
            "five_year_survival_pct": 28.09917,
            "source_row": 444
          },
          {
            "uf": "ES",
            "name": "Espírito Santo",
            "births": 89,
            "five_year_survival_pct": 40.44944,
            "source_row": 465
          },
          {
            "uf": "RJ",
            "name": "Rio de Janeiro",
            "births": 309,
            "five_year_survival_pct": 40.12945,
            "source_row": 486
          },
          {
            "uf": "SP",
            "name": "São Paulo",
            "births": 857,
            "five_year_survival_pct": 37.68961,
            "source_row": 507
          },
          {
            "uf": "PR",
            "name": "Paraná",
            "births": 239,
            "five_year_survival_pct": 39.33054,
            "source_row": 549
          },
          {
            "uf": "SC",
            "name": "Santa Catarina",
            "births": 208,
            "five_year_survival_pct": 32.21154,
            "source_row": 570
          },
          {
            "uf": "RS",
            "name": "Rio Grande do Sul",
            "births": 223,
            "five_year_survival_pct": 32.73543,
            "source_row": 591
          },
          {
            "uf": "MS",
            "name": "Mato Grosso do Sul",
            "births": 48,
            "five_year_survival_pct": 22.91667,
            "source_row": 633
          },
          {
            "uf": "MT",
            "name": "Mato Grosso",
            "births": 69,
            "five_year_survival_pct": 37.68116,
            "source_row": 654
          },
          {
            "uf": "GO",
            "name": "Goiás",
            "births": 136,
            "five_year_survival_pct": 33.08824,
            "source_row": 675
          },
          {
            "uf": "DF",
            "name": "Distrito Federal",
            "births": 95,
            "five_year_survival_pct": 31.57895,
            "source_row": 696
          }
        ]
      },
      {
        "section": "S",
        "label": "S Outras atividades de serviços",
        "national_births": 6732,
        "national_five_year_pct": 30.89721,
        "national_source_row": 25,
        "states": [
          {
            "uf": "RO",
            "name": "Rondônia",
            "births": 53,
            "five_year_survival_pct": 35.84906,
            "source_row": 67
          },
          {
            "uf": "AC",
            "name": "Acre",
            "births": 13,
            "five_year_survival_pct": 23.07692,
            "source_row": 88
          },
          {
            "uf": "AM",
            "name": "Amazonas",
            "births": 46,
            "five_year_survival_pct": 41.30435,
            "source_row": 109
          },
          {
            "uf": "RR",
            "name": "Roraima",
            "births": 8,
            "five_year_survival_pct": 62.5,
            "source_row": 130
          },
          {
            "uf": "PA",
            "name": "Pará",
            "births": 100,
            "five_year_survival_pct": 32,
            "source_row": 151
          },
          {
            "uf": "AP",
            "name": "Amapá",
            "births": 17,
            "five_year_survival_pct": 11.76471,
            "source_row": 172
          },
          {
            "uf": "TO",
            "name": "Tocantins",
            "births": 30,
            "five_year_survival_pct": 30,
            "source_row": 193
          },
          {
            "uf": "MA",
            "name": "Maranhão",
            "births": 93,
            "five_year_survival_pct": 29.03226,
            "source_row": 235
          },
          {
            "uf": "PI",
            "name": "Piauí",
            "births": 61,
            "five_year_survival_pct": 26.22951,
            "source_row": 256
          },
          {
            "uf": "CE",
            "name": "Ceará",
            "births": 202,
            "five_year_survival_pct": 36.13861,
            "source_row": 277
          },
          {
            "uf": "RN",
            "name": "Rio Grande do Norte",
            "births": 114,
            "five_year_survival_pct": 34.21053,
            "source_row": 298
          },
          {
            "uf": "PB",
            "name": "Paraíba",
            "births": 88,
            "five_year_survival_pct": 40.90909,
            "source_row": 319
          },
          {
            "uf": "PE",
            "name": "Pernambuco",
            "births": 229,
            "five_year_survival_pct": 31.87773,
            "source_row": 340
          },
          {
            "uf": "AL",
            "name": "Alagoas",
            "births": 53,
            "five_year_survival_pct": 32.07547,
            "source_row": 361
          },
          {
            "uf": "SE",
            "name": "Sergipe",
            "births": 60,
            "five_year_survival_pct": 41.66667,
            "source_row": 382
          },
          {
            "uf": "BA",
            "name": "Bahia",
            "births": 296,
            "five_year_survival_pct": 32.77027,
            "source_row": 403
          },
          {
            "uf": "MG",
            "name": "Minas Gerais",
            "births": 656,
            "five_year_survival_pct": 32.31707,
            "source_row": 445
          },
          {
            "uf": "ES",
            "name": "Espírito Santo",
            "births": 119,
            "five_year_survival_pct": 33.61345,
            "source_row": 466
          },
          {
            "uf": "RJ",
            "name": "Rio de Janeiro",
            "births": 676,
            "five_year_survival_pct": 26.18343,
            "source_row": 487
          },
          {
            "uf": "SP",
            "name": "São Paulo",
            "births": 1865,
            "five_year_survival_pct": 31.31367,
            "source_row": 508
          },
          {
            "uf": "PR",
            "name": "Paraná",
            "births": 456,
            "five_year_survival_pct": 30.26316,
            "source_row": 550
          },
          {
            "uf": "SC",
            "name": "Santa Catarina",
            "births": 339,
            "five_year_survival_pct": 28.31858,
            "source_row": 571
          },
          {
            "uf": "RS",
            "name": "Rio Grande do Sul",
            "births": 433,
            "five_year_survival_pct": 28.40647,
            "source_row": 592
          },
          {
            "uf": "MS",
            "name": "Mato Grosso do Sul",
            "births": 132,
            "five_year_survival_pct": 36.36364,
            "source_row": 634
          },
          {
            "uf": "MT",
            "name": "Mato Grosso",
            "births": 118,
            "five_year_survival_pct": 34.74576,
            "source_row": 655
          },
          {
            "uf": "GO",
            "name": "Goiás",
            "births": 213,
            "five_year_survival_pct": 32.39437,
            "source_row": 676
          },
          {
            "uf": "DF",
            "name": "Distrito Federal",
            "births": 262,
            "five_year_survival_pct": 22.90076,
            "source_row": 697
          }
        ]
      }
    ],
    "ranking_sensitivity": [
      {
        "uf": "RO",
        "name": "Rondônia",
        "standardised_rank": 19,
        "standardised_five_year_pct": 36.49841025090778,
        "common_births": 2743,
        "min_included_sector_births": 8,
        "rank_min_10": 20,
        "rate_min_10": 35.30252504322646,
        "coverage_min_10_pct": 91.21720116618076,
        "rank_min_30": 20,
        "rate_min_30": 35.16181898735353,
        "coverage_min_30_pct": 75.58309037900875,
        "max_rank_movement": 1
      },
      {
        "uf": "AC",
        "name": "Acre",
        "standardised_rank": 25,
        "standardised_five_year_pct": 33.7401556464702,
        "common_births": 704,
        "min_included_sector_births": 2,
        "rank_min_10": 25,
        "rate_min_10": 33.58518179632072,
        "coverage_min_10_pct": 90.05681818181819,
        "rank_min_30": 25,
        "rate_min_30": 33.79838243342494,
        "coverage_min_30_pct": 77.13068181818181,
        "max_rank_movement": 0
      },
      {
        "uf": "AM",
        "name": "Amazonas",
        "standardised_rank": 23,
        "standardised_five_year_pct": 34.99331856390529,
        "common_births": 2565,
        "min_included_sector_births": 4,
        "rank_min_10": 22,
        "rate_min_10": 34.954877866151875,
        "coverage_min_10_pct": 91.55313351498637,
        "rank_min_30": 24,
        "rate_min_30": 34.08387863651136,
        "coverage_min_30_pct": 75.67146749708057,
        "max_rank_movement": 1
      },
      {
        "uf": "RR",
        "name": "Roraima",
        "standardised_rank": 20,
        "standardised_five_year_pct": 36.15184594913065,
        "common_births": 565,
        "min_included_sector_births": 1,
        "rank_min_10": 21,
        "rate_min_10": 35.293600637851554,
        "coverage_min_10_pct": 91.15044247787611,
        "rank_min_30": 12,
        "rate_min_30": 36.78242055697413,
        "coverage_min_30_pct": 78.23008849557522,
        "max_rank_movement": 8
      },
      {
        "uf": "PA",
        "name": "Pará",
        "standardised_rank": 7,
        "standardised_five_year_pct": 38.61557311780393,
        "common_births": 5925,
        "min_included_sector_births": 12,
        "rank_min_10": 8,
        "rate_min_10": 37.64793557467442,
        "coverage_min_10_pct": 89.74747474747475,
        "rank_min_30": 9,
        "rate_min_30": 37.09135915643745,
        "coverage_min_30_pct": 76.26262626262626,
        "max_rank_movement": 2
      },
      {
        "uf": "AP",
        "name": "Amapá",
        "standardised_rank": 27,
        "standardised_five_year_pct": 26.750978535281167,
        "common_births": 804,
        "min_included_sector_births": 1,
        "rank_min_10": 27,
        "rate_min_10": 26.90378579766596,
        "coverage_min_10_pct": 89.80099502487562,
        "rank_min_30": 27,
        "rate_min_30": 26.305635146938663,
        "coverage_min_30_pct": 80.22388059701493,
        "max_rank_movement": 0
      },
      {
        "uf": "TO",
        "name": "Tocantins",
        "standardised_rank": 24,
        "standardised_five_year_pct": 34.76235530534081,
        "common_births": 2164,
        "min_included_sector_births": 6,
        "rank_min_10": 24,
        "rate_min_10": 34.60173197781485,
        "coverage_min_10_pct": 89.83364140480592,
        "rank_min_30": 22,
        "rate_min_30": 34.69520076607736,
        "coverage_min_30_pct": 74.67652495378928,
        "max_rank_movement": 2
      },
      {
        "uf": "MA",
        "name": "Maranhão",
        "standardised_rank": 15,
        "standardised_five_year_pct": 37.28493816043668,
        "common_births": 4639,
        "min_included_sector_births": 10,
        "rank_min_10": 14,
        "rate_min_10": 36.91567788021235,
        "coverage_min_10_pct": 89.71982758620689,
        "rank_min_30": 11,
        "rate_min_30": 37.01679913169232,
        "coverage_min_30_pct": 78.36206896551724,
        "max_rank_movement": 4
      },
      {
        "uf": "PI",
        "name": "Piauí",
        "standardised_rank": 4,
        "standardised_five_year_pct": 39.35091810773997,
        "common_births": 3009,
        "min_included_sector_births": 7,
        "rank_min_10": 4,
        "rate_min_10": 39.24014728492223,
        "coverage_min_10_pct": 90.42871385842473,
        "rank_min_30": 1,
        "rate_min_30": 40.190894680913296,
        "coverage_min_30_pct": 80.05982053838484,
        "max_rank_movement": 3
      },
      {
        "uf": "CE",
        "name": "Ceará",
        "standardised_rank": 11,
        "standardised_five_year_pct": 37.645630750194705,
        "common_births": 7952,
        "min_included_sector_births": 17,
        "rank_min_10": 13,
        "rate_min_10": 36.95344856583152,
        "coverage_min_10_pct": 88.09045226130654,
        "rank_min_30": 13,
        "rate_min_30": 36.62010156994559,
        "coverage_min_30_pct": 73.63065326633166,
        "max_rank_movement": 2
      },
      {
        "uf": "RN",
        "name": "Rio Grande do Norte",
        "standardised_rank": 13,
        "standardised_five_year_pct": 37.37137065498326,
        "common_births": 4118,
        "min_included_sector_births": 17,
        "rank_min_10": 17,
        "rate_min_10": 36.488872960870076,
        "coverage_min_10_pct": 86.81212121212121,
        "rank_min_30": 19,
        "rate_min_30": 35.74035936052666,
        "coverage_min_30_pct": 76.02424242424243,
        "max_rank_movement": 6
      },
      {
        "uf": "PB",
        "name": "Paraíba",
        "standardised_rank": 2,
        "standardised_five_year_pct": 40.213884902748795,
        "common_births": 3559,
        "min_included_sector_births": 6,
        "rank_min_10": 3,
        "rate_min_10": 39.468533088592395,
        "coverage_min_10_pct": 88.39561674627704,
        "rank_min_30": 3,
        "rate_min_30": 39.387869444604355,
        "coverage_min_30_pct": 77.10030907558303,
        "max_rank_movement": 1
      },
      {
        "uf": "PE",
        "name": "Pernambuco",
        "standardised_rank": 10,
        "standardised_five_year_pct": 37.82716788208481,
        "common_births": 9280,
        "min_included_sector_births": 11,
        "rank_min_10": 11,
        "rate_min_10": 37.08925671729704,
        "coverage_min_10_pct": 88.797931925894,
        "rank_min_30": 15,
        "rate_min_30": 36.55453757381753,
        "coverage_min_30_pct": 75.37699267557088,
        "max_rank_movement": 5
      },
      {
        "uf": "AL",
        "name": "Alagoas",
        "standardised_rank": 21,
        "standardised_five_year_pct": 35.68342622215554,
        "common_births": 2927,
        "min_included_sector_births": 2,
        "rank_min_10": 23,
        "rate_min_10": 34.90167069622153,
        "coverage_min_10_pct": 88.49043715846994,
        "rank_min_30": 23,
        "rate_min_30": 34.49269762186856,
        "coverage_min_30_pct": 76.16120218579235,
        "max_rank_movement": 2
      },
      {
        "uf": "SE",
        "name": "Sergipe",
        "standardised_rank": 1,
        "standardised_five_year_pct": 40.43190874883261,
        "common_births": 2272,
        "min_included_sector_births": 4,
        "rank_min_10": 1,
        "rate_min_10": 39.98199079502487,
        "coverage_min_10_pct": 86.58751099384345,
        "rank_min_30": 2,
        "rate_min_30": 39.97925598474438,
        "coverage_min_30_pct": 70.49252418645558,
        "max_rank_movement": 1
      },
      {
        "uf": "BA",
        "name": "Bahia",
        "standardised_rank": 14,
        "standardised_five_year_pct": 37.29963858109999,
        "common_births": 15384,
        "min_included_sector_births": 42,
        "rank_min_10": 12,
        "rate_min_10": 37.055682323588535,
        "coverage_min_10_pct": 89.63882031960505,
        "rank_min_30": 16,
        "rate_min_30": 36.552833893804895,
        "coverage_min_30_pct": 76.02962193062233,
        "max_rank_movement": 2
      },
      {
        "uf": "MG",
        "name": "Minas Gerais",
        "standardised_rank": 12,
        "standardised_five_year_pct": 37.45903573648952,
        "common_births": 32158,
        "min_included_sector_births": 73,
        "rank_min_10": 10,
        "rate_min_10": 37.17276567902595,
        "coverage_min_10_pct": 88.57950837502719,
        "rank_min_30": 10,
        "rate_min_30": 37.05059941888428,
        "coverage_min_30_pct": 71.71447217129183,
        "max_rank_movement": 2
      },
      {
        "uf": "ES",
        "name": "Espírito Santo",
        "standardised_rank": 8,
        "standardised_five_year_pct": 38.42829672080188,
        "common_births": 6172,
        "min_included_sector_births": 22,
        "rank_min_10": 9,
        "rate_min_10": 37.335886351040664,
        "coverage_min_10_pct": 88.10216618170061,
        "rank_min_30": 8,
        "rate_min_30": 37.21089121738565,
        "coverage_min_30_pct": 73.48852247009376,
        "max_rank_movement": 1
      },
      {
        "uf": "RJ",
        "name": "Rio de Janeiro",
        "standardised_rank": 5,
        "standardised_five_year_pct": 38.775423579262515,
        "common_births": 19579,
        "min_included_sector_births": 32,
        "rank_min_10": 6,
        "rate_min_10": 38.18192181338329,
        "coverage_min_10_pct": 86.9112619278461,
        "rank_min_30": 7,
        "rate_min_30": 37.413484079695074,
        "coverage_min_30_pct": 71.34255243149461,
        "max_rank_movement": 2
      },
      {
        "uf": "SP",
        "name": "São Paulo",
        "standardised_rank": 6,
        "standardised_five_year_pct": 38.6702680175858,
        "common_births": 77775,
        "min_included_sector_births": 42,
        "rank_min_10": 5,
        "rate_min_10": 38.37801904795382,
        "coverage_min_10_pct": 88.22599915211778,
        "rank_min_30": 5,
        "rate_min_30": 38.42280478374714,
        "coverage_min_30_pct": 70.17381585539754,
        "max_rank_movement": 1
      },
      {
        "uf": "PR",
        "name": "Paraná",
        "standardised_rank": 17,
        "standardised_five_year_pct": 36.98818185426311,
        "common_births": 23564,
        "min_included_sector_births": 21,
        "rank_min_10": 16,
        "rate_min_10": 36.612521095273024,
        "coverage_min_10_pct": 89.63016371193486,
        "rank_min_30": 17,
        "rate_min_30": 35.96327871617857,
        "coverage_min_30_pct": 72.47858172873018,
        "max_rank_movement": 1
      },
      {
        "uf": "SC",
        "name": "Santa Catarina",
        "standardised_rank": 3,
        "standardised_five_year_pct": 39.79623074085562,
        "common_births": 17497,
        "min_included_sector_births": 23,
        "rank_min_10": 2,
        "rate_min_10": 39.79594859197641,
        "coverage_min_10_pct": 89.37360817678297,
        "rank_min_30": 4,
        "rate_min_30": 39.22689189316422,
        "coverage_min_30_pct": 73.23131388111689,
        "max_rank_movement": 1
      },
      {
        "uf": "RS",
        "name": "Rio Grande do Sul",
        "standardised_rank": 9,
        "standardised_five_year_pct": 38.38267944174537,
        "common_births": 20216,
        "min_included_sector_births": 31,
        "rank_min_10": 7,
        "rate_min_10": 38.08053820185523,
        "coverage_min_10_pct": 89.12731767614339,
        "rank_min_30": 6,
        "rate_min_30": 38.05667575572434,
        "coverage_min_30_pct": 72.45982694684795,
        "max_rank_movement": 3
      },
      {
        "uf": "MS",
        "name": "Mato Grosso do Sul",
        "standardised_rank": 18,
        "standardised_five_year_pct": 36.75958376489786,
        "common_births": 4373,
        "min_included_sector_births": 7,
        "rank_min_10": 18,
        "rate_min_10": 35.978087615495404,
        "coverage_min_10_pct": 86.70322138450994,
        "rank_min_30": 18,
        "rate_min_30": 35.86782929938346,
        "coverage_min_30_pct": 68.72286954535069,
        "max_rank_movement": 0
      },
      {
        "uf": "MT",
        "name": "Mato Grosso",
        "standardised_rank": 16,
        "standardised_five_year_pct": 37.16813562934293,
        "common_births": 7137,
        "min_included_sector_births": 20,
        "rank_min_10": 15,
        "rate_min_10": 36.69953870294016,
        "coverage_min_10_pct": 88.3662326753465,
        "rank_min_30": 14,
        "rate_min_30": 36.60388776797155,
        "coverage_min_30_pct": 71.67856642867143,
        "max_rank_movement": 2
      },
      {
        "uf": "GO",
        "name": "Goiás",
        "standardised_rank": 22,
        "standardised_five_year_pct": 35.68151946655968,
        "common_births": 12794,
        "min_included_sector_births": 24,
        "rank_min_10": 19,
        "rate_min_10": 35.43535066528849,
        "coverage_min_10_pct": 89.7690026533479,
        "rank_min_30": 21,
        "rate_min_30": 34.75274135814964,
        "coverage_min_30_pct": 73.77087560480724,
        "max_rank_movement": 3
      },
      {
        "uf": "DF",
        "name": "Distrito Federal",
        "standardised_rank": 26,
        "standardised_five_year_pct": 32.06287932910321,
        "common_births": 6728,
        "min_included_sector_births": 4,
        "rank_min_10": 26,
        "rate_min_10": 31.878205199373735,
        "coverage_min_10_pct": 86.7092367092367,
        "rank_min_30": 26,
        "rate_min_30": 31.90438397017586,
        "coverage_min_30_pct": 72.80962280962281,
        "max_rank_movement": 0
      }
    ],
    "definitions": {
      "annual_attrition": "100 × (1 − S(t)/S(t−1)); denominator is the surviving cohort at the preceding observation.",
      "original_cohort_loss": "S(t−1) − S(t), percentage points of the original cohort.",
      "conditional_survival": "100 × S(5)/S(t); remaining in the surviving employer-enterprise cohort through year five, conditional on reaching year t.",
      "precision": "Derived from published rounded rates. No integer survivor counts or confidence intervals are reconstructed.",
      "ranking": "Rank 1 is the highest published/reweighted rate. Stricter cell thresholds change the sector support and estimand; rank movement is sensitivity, not a confidence interval."
    },
    "evidence_gaps": [
      {
        "question": "Do later entry cohorts follow the same trajectory?",
        "status": "Not identified by the imported tables",
        "needed": "Comparable later entry cohorts at matched ages, with consistent employer definitions and follow-up; calendar-period effects must be separated from cohort age."
      },
      {
        "question": "What if survival means retaining a registration instead of remaining an employer?",
        "status": "No comparable registration-survival history in this analysis",
        "needed": "Longitudinal registrations with explicit exit, reactivation and censoring rules. Current CNPJ active share is not a substitute."
      }
    ]
  }
};
