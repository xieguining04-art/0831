export type ServiceLanguage = "en" | "zh-CN";
type ServiceCopy = { title: string; summary: string; detail: string; scope: string[]; preparation: string[] };
export type Service = { slug: string; number: string; image: string; alt: Record<ServiceLanguage, string>; content: Record<ServiceLanguage, ServiceCopy> };

export const services: Service[] = [
  { slug: "freight-forwarding", number: "01", image: "/images/sea-freight.webp", alt: { en: "Container ship alongside port cranes", "zh-CN": "集装箱船与港口岸吊" }, content: {
    en: { title: "Freight Forwarding", summary: "One accountable China-side team coordinating suppliers, warehouses, trucks and international carriers.", detail: "Connect the individual steps of your shipment through a single origin-side contact. We review cargo readiness, transport options and handoffs before confirming the booking scope.", scope: ["China pickup and export preparation", "Ocean and air freight coordination", "DHL, FedEx and UPS express options", "Destination handoffs through local partners"], preparation: ["Product name, quantity and cargo photos", "Packed dimensions, gross weight and ready date", "Pickup address, destination and delivery scope"] },
    "zh-CN": { title: "货运代理", summary: "由中国团队统一协调供应商、仓库、车辆与国际承运商。", detail: "通过一位中国端联系人衔接运输各环节。确认订舱范围前，先评估货物准备情况、运输选项和交接安排。", scope: ["中国提货与出口准备", "海运与空运协调", "DHL、FedEx、UPS 快递方案", "通过当地合作伙伴协调目的地交接"], preparation: ["品名、数量及货物照片", "包装尺寸、毛重与备货日期", "提货地址、目的地与交付范围"] }
  } },
  { slug: "china-import-export", number: "02", image: "/images/procurement-warehouse.webp", alt: { en: "Export cartons and order checking in a consolidation warehouse", "zh-CN": "集运仓内的出口纸箱与订单核对场景" }, content: {
    en: { title: "China Procurement & Export", summary: "Practical origin support for purchasing, export preparation, shipment documents and dispatch.", detail: "Bring supplier communication, purchasing requirements and export arrangements into the same plan. Product requirements and destination acceptance should be confirmed before the goods are dispatched.", scope: ["China procurement coordination", "Supplier order and readiness follow-up", "Packing-list and shipment-document coordination", "Warehouse collection and export dispatch"], preparation: ["Product specification and supplier contact", "Order quantities and purchasing requirements", "Destination, packing requirements and target timing"] },
    "zh-CN": { title: "中国进出口与采购", summary: "提供采购、出口准备、运输单证及发货等中国端实务支持。", detail: "将供应商沟通、采购要求和出口安排纳入同一计划。货物发出前，需核实产品要求和目的地承运及进口条件。", scope: ["中国境内采购协调", "供应商订单与交期跟进", "装箱单与运输单证协调", "仓库集货与出口发运"], preparation: ["产品规格与供应商联系方式", "采购数量与订单要求", "目的地、包装要求与期望时间"] }
  } },
  { slug: "air-freight", number: "03", image: "/images/air-freight.webp", alt: { en: "Air cargo being loaded into a freight aircraft", "zh-CN": "货物通过升降平台装入货机" }, content: {
    en: { title: "Air Freight", summary: "Airport and door delivery options for urgent, valuable and time-sensitive international cargo.", detail: "Plan China-origin air shipments around the actual cargo and deadline. Compare flight routing together with origin handling and destination delivery, rather than treating flight time as the whole journey.", scope: ["China-to-worldwide air freight enquiries", "Airport-to-airport and onward delivery planning", "Packing and chargeable-weight review", "Urgent cargo and express-option comparison"], preparation: ["Product description, including batteries or liquids", "Number of pieces, packed sizes and gross weight", "Departure city, destination airport and deadline"] },
    "zh-CN": { title: "国际空运", summary: "为紧急、高价值及有时效要求的国际货物提供机场与派送方案。", detail: "根据实际货物和到货要求规划中国始发空运。综合比较航线、中国端操作与目的地派送，不能将飞行时间直接等同于全程时效。", scope: ["中国发往全球的空运询价", "机场到机场及后续派送规划", "包装与计费重量核对", "急货空运与快递方案比较"], preparation: ["品名及是否含电池、液体等信息", "件数、包装尺寸及毛重", "起运城市、目的机场与时间要求"] }
  } },
  { slug: "oversize-freight", number: "04", image: "/images/project-cargo.webp", alt: { en: "Heavy excavator secured on a low-bed transport trailer", "zh-CN": "固定在低平板运输车上的大型挖掘机" }, content: {
    en: { title: "Oversize Freight", summary: "Planning for machinery, long cargo, heavy pieces and shipments requiring special equipment.", detail: "An oversize shipment starts with a cargo and route review. Lifting, securing, road access and equipment availability are considered before a movement plan is agreed.", scope: ["Machinery and heavy-piece transport planning", "Special equipment and loading coordination", "Pickup access and route review", "Cargo securing and handoff preparation"], preparation: ["Transport dimensions and weight of every piece", "Photos, drawings, lifting points and centre of gravity", "Loading facilities, pickup access and destination"] },
    "zh-CN": { title: "超大货物运输", summary: "为机械、超长货物、重件及需要特殊设备的货物规划运输方案。", detail: "超大货物运输从货物与线路评估开始。确认运输方案前，需要核实吊装、加固、道路通行条件及设备安排。", scope: ["机械与重件运输规划", "特殊设备与装车协调", "提货通道与运输线路评估", "货物加固与交接准备"], preparation: ["每件货物运输状态的尺寸和重量", "照片、图纸、吊点与重心信息", "装卸设备、提货通道与目的地"] }
  } },
  { slug: "sea-freight", number: "05", image: "/images/sea-freight.webp", alt: { en: "Container vessel at an international seaport", "zh-CN": "国际港口内的集装箱船" }, content: {
    en: { title: "Global Sea Freight Booking", summary: "Our main service: worldwide FCL and LCL bookings from China, with a focus on Oceania, Africa and South America.", detail: "Global sea freight booking is TengYoda's main business. Our focus trade lanes connect China with Oceania, Africa and South America. We coordinate collection, loading and documents around the cargo-ready date and confirmed sailing plan.", scope: ["Full-container-load bookings", "Less-than-container-load shipments", "Special-equipment booking enquiries", "Origin collection and container-loading coordination"], preparation: ["Packing list with dimensions, weight and volume", "Supplier location, cargo-ready date and destination port", "Preferred container type and delivery responsibilities"] },
    "zh-CN": { title: "全球海运订舱", summary: "主营中国发往全球整柜、拼箱订舱，优势航线覆盖大洋洲、非洲和南美。", detail: "全球海运订舱是 TengYoda 的主营业务，优势航线为中国至大洋洲、非洲和南美。根据货量、备货日期与确认船期，衔接中国端提货、装柜和单证交接。", scope: ["整柜海运订舱", "海运拼箱运输", "特种箱订舱询价", "中国端集货与装柜协调"], preparation: ["包含尺寸、重量与体积的装箱单", "供应商位置、备货日期与目的港", "期望柜型与交付责任范围"] }
  } },
  { slug: "transport-warehousing", number: "06", image: "/images/china-domestic-trucking.webp", alt: { en: "Container truck beside warehouse loading bays", "zh-CN": "仓库装卸月台旁的集装箱货车" }, content: {
    en: { title: "Transport & Warehousing", summary: "Factory pickup, domestic trucking, warehouse receiving, consolidation and export delivery.", detail: "Keep goods moving between Chinese suppliers, warehouses and export terminals. Pickup windows, receiving instructions and cargo identification are agreed before arrival.", scope: ["China domestic road transport", "Factory pickup and warehouse delivery", "Receiving and shipment identification", "Dispatch to ports and airports"], preparation: ["Pickup and delivery addresses with contact details", "Cargo sizes, weight and loading conditions", "Receiving schedule and order references"] },
    "zh-CN": { title: "运输与仓储", summary: "工厂提货、中国境内陆运、仓库收货、集运与出口交付。", detail: "衔接中国供应商、仓库与出口码头之间的货物流转。货物到达前，确认提货窗口、收货要求及货物标识。", scope: ["中国境内陆路运输", "工厂提货与送仓", "仓库收货及订单识别", "港口与机场交货"], preparation: ["提送货地址与联系人", "货物尺寸、重量及装卸条件", "收货时间与订单编号"] }
  } },
  { slug: "roro-project-cargo", number: "07", image: "/images/project-cargo.webp", alt: { en: "Heavy mobile machinery being prepared for port transport", "zh-CN": "准备进行港口运输的大型移动机械" }, content: {
    en: { title: "RoRo & Project Cargo", summary: "Coordinated transport for vehicles, mobile equipment and complex multi-stage cargo projects.", detail: "Coordinate the stages of non-standard cargo transport with the actual equipment and route in mind. RoRo or alternative options depend on vessel acceptance, cargo condition and handling requirements.", scope: ["Vehicle and mobile-equipment shipment enquiries", "RoRo routing and carrier acceptance coordination", "Breakbulk and project cargo planning", "Multi-stage origin and destination handoffs"], preparation: ["Equipment model, dimensions, weight and condition", "Whether the unit is self-propelled and operational", "Photos, loading restrictions and destination"] },
    "zh-CN": { title: "滚装与项目货物", summary: "协调车辆、移动设备及复杂多阶段项目货物的运输。", detail: "根据实际设备与线路协调非标准货物运输。滚装或其他方案需结合船公司接载条件、货物状态与操作要求确认。", scope: ["车辆与移动设备运输询价", "滚装航线及承运条件协调", "散杂货与项目货物规划", "多阶段起运与目的地交接"], preparation: ["设备型号、尺寸、重量与状态", "设备是否可自行移动及正常运行", "照片、装卸限制与目的地"] }
  } },
  { slug: "cargo-consolidation", number: "08", image: "/images/warehouse-operations.webp", alt: { en: "Palletised supplier goods and a forklift in a consolidation warehouse", "zh-CN": "集运仓内的供应商托盘货物与叉车" }, content: {
    en: { title: "3PL & Consolidation", summary: "Receive goods from multiple suppliers, check incoming cargo and ship one consolidated order.", detail: "Combine supplier orders into one coordinated outbound plan. Agree the receiving checks, storage needs and dispatch trigger in advance so each supplier knows how to label and deliver the goods.", scope: ["Multi-supplier warehouse receiving", "Order and package-count checking", "Packing and consolidation coordination", "Combined export dispatch planning"], preparation: ["Supplier list and order references", "Expected arrival dates, carton counts and sizes", "Checking requirements and final shipping instructions"] },
    "zh-CN": { title: "第三方物流与货物集运", summary: "收取多家供应商货物，核对到货信息后统一安排集运。", detail: "将供应商订单组合为统一发运计划。提前约定收货核对范围、存储需求与发运条件，让每家供应商清楚标记和送货要求。", scope: ["多供应商仓库收货", "订单与包装件数核对", "包装与集运协调", "统一出口发运规划"], preparation: ["供应商清单与订单编号", "预计到货日期、箱数与尺寸", "核对要求与最终发运指示"] }
  } },
  { slug: "international-express", number: "09", image: "/images/international-express-parcels.webp", alt: { en: "Sealed parcels on a roller conveyor before international dispatch", "zh-CN": "国际发运前放在滚筒输送带上的封装包裹" }, content: {
    en: { title: "DHL, FedEx & UPS Express", summary: "International courier options from China for samples, parcels and smaller time-sensitive orders.", detail: "Compare DHL, FedEx and UPS options using the same cargo information and destination postcode. Confirm carrier acceptance, chargeable weight, surcharges and destination responsibilities before dispatch. Carrier names identify the services requested, not an exclusive partnership or agency status.", scope: ["DHL, FedEx and UPS service enquiries", "China-side collection and parcel preparation", "Packed size, weight and delivery-zone review", "Dispatch and shipment-document coordination"], preparation: ["Product description and any batteries, liquids or special contents", "Each parcel’s packed dimensions and gross weight", "Receiver address, postcode, contact number and required timing"] },
    "zh-CN": { title: "DHL、FedEx、UPS 国际快递", summary: "为中国发往全球的样品、包裹及较小急件提供国际快递方案。", detail: "根据同一份货物资料和目的地邮编比较 DHL、FedEx 与 UPS 方案。发货前确认承运条件、计费重量、附加费用和目的地责任。此处品牌名称仅用于说明可咨询的快递服务，不代表独家合作或代理资质声明。", scope: ["DHL、FedEx、UPS 服务询价", "中国端提货与包裹发运准备", "包装尺寸、重量与派送区域核对", "发货与运输单证协调"], preparation: ["品名及是否包含电池、液体等特殊成分", "每件包裹的包装尺寸和毛重", "收件地址、邮编、联系电话及时间要求"] }
  } },
];

export function getService(slug: string) { return services.find(service => service.slug === slug); }

export const coreServiceNames: Record<string, Record<ServiceLanguage, string>> = {
  "sea-freight": { en: "Global Sea Freight Booking", "zh-CN": "全球海运订舱" },
  "air-freight": { en: "Global Air Freight", "zh-CN": "全球空运" },
  "international-express": { en: "DHL / FedEx / UPS Express", "zh-CN": "DHL / FedEx / UPS 快递" },
  "china-import-export": { en: "China Procurement", "zh-CN": "中国境内采购" },
  "cargo-consolidation": { en: "Cargo Consolidation", "zh-CN": "货物集运" },
  "transport-warehousing": { en: "China Road Transport", "zh-CN": "中国境内陆运" },
};
export const coreServices = Object.keys(coreServiceNames).map(slug => services.find(service => service.slug === slug)!);
// Homepage selection is independent from the full service catalog and footer.
export const homepageServices = coreServices.map(service => service.slug === "transport-warehousing" ? getService("roro-project-cargo")! : service);
export const primaryService = getService("sea-freight")!;
export const supportingServices = coreServices.filter(service => service.slug !== primaryService.slug);
export const specialistServices = services.filter(service => !Object.hasOwn(coreServiceNames, service.slug));
export const orderedServices = [...coreServices, ...specialistServices];
export function serviceLabel(service: Service, language: ServiceLanguage) { return coreServiceNames[service.slug]?.[language] ?? service.content[language].title; }

const relatedServiceSlugs: Record<string, string[]> = {
  "transport-warehousing": ["cargo-consolidation", "sea-freight", "air-freight"],
  "sea-freight": ["cargo-consolidation", "transport-warehousing", "oversize-freight"],
  "air-freight": ["international-express", "cargo-consolidation", "transport-warehousing"],
  "international-express": ["air-freight", "china-import-export", "cargo-consolidation"],
  "china-import-export": ["cargo-consolidation", "international-express", "sea-freight"],
  "cargo-consolidation": ["china-import-export", "sea-freight", "transport-warehousing"],
  "freight-forwarding": ["sea-freight", "air-freight", "international-express"],
  "oversize-freight": ["roro-project-cargo", "transport-warehousing", "sea-freight"],
  "roro-project-cargo": ["oversize-freight", "sea-freight", "freight-forwarding"],
};
export function relatedServices(slug: string) { return (relatedServiceSlugs[slug] ?? []).map(getService).filter((service): service is Service => Boolean(service)); }
