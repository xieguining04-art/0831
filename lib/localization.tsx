import { Children, cloneElement, isValidElement, type ReactNode } from "react";

export type Language = "en" | "zh-CN";

const chinese: Record<string, string> = {
  "FROM CHINA TO THE WORLD": "从中国连接全球",
  "Blog": "博客", "View all articles": "查看全部文章",
  "About Us": "关于我们", "Our Services": "主营服务", "Resources": "物流资讯", "Contact Us": "联系我们",
  "Specialist Solutions": "专业物流方案", "Specialist Services": "专项服务", "Contact": "联系方式",
  "NEED A CUSTOM SOLUTION?": "需要定制物流方案？", "Speak to an expert": "咨询物流顾问",
  "China sourcing and global logistics solutions.": "中国采购与全球物流解决方案。",
  "GLOBAL FREIGHT": "全球货运", "CHINA ORIGIN": "中国始发", "GLOBAL LOGISTICS": "全球物流",
  "FREIGHT · PROCUREMENT · CONSOLIDATION": "国际货运 · 中国采购 · 货物集运",
  "Moving business forward, from China to the world.": "立足中国，让您的货物通达全球。",
  "A practical logistics partner for overseas importers—connecting suppliers, warehouses, trucks, carriers and destination partners through one China-side team.": "为海外进口商提供切实可行的物流服务，由中国团队统一协调供应商、仓库、陆运、国际承运商及目的地合作伙伴。",
  "Speak to Vinson": "联系 Vinson", "Explore our services": "了解我们的服务", "START A CONVERSATION": "开始咨询",
  "Years of cross-border logistics experience.": "跨境物流从业经验（年）。",
  "Target response time for complete quote requests.": "完整询价资料的目标回复时间。",
  "Warehouse locations across China.": "中国境内仓库网点。", "Warehouse and operations locations.": "仓库与运营办公网点。",
  "TENGYODA GLOBAL LOGISTICS": "TENGYODA 全球物流", "Your China-side partner in global trade.": "您在中国的国际贸易与物流伙伴。",
  "TengYoda helps overseas businesses source, collect, consolidate and ship goods from China. We coordinate the details that sit between a supplier purchase order and an international freight booking.": "TengYoda 协助海外企业在中国采购、提货、集运及出口，衔接从供应商订单到国际货运订舱之间的各项工作。",
  "From samples sent by international express to full containers, oversize machinery and multi-supplier projects, every plan is built around the real cargo, route and commercial goal.": "从样品国际快递到整柜运输、超大设备及多供应商项目，我们根据实际货物、路线和商业需求制定方案。",
  "Discover our China network": "查看中国服务网络", "OUR SERVICES": "主营服务",
  "Integrated logistics, adapted to each shipment.": "一体化物流，匹配每一票货物。",
  "Every service can work independently or as one joined-up China origin solution.": "各项服务既可单独提供，也可组合成完整的中国起运方案。",
  "Freight Forwarding": "货运代理", "China Import & Export": "中国进出口服务", "Air Freight": "国际空运",
  "Oversize Freight": "超大货物运输", "Sea Freight": "国际海运", "Transport & Warehousing": "运输与仓储",
  "RoRo & Project Cargo": "滚装与项目货物", "3PL & Consolidation": "第三方物流与集运",
  "One accountable China-side team coordinating suppliers, warehouses, trucks and international carriers.": "由中国团队统一协调供应商、仓库、车辆与国际承运商。",
  "Practical origin support for purchasing, export preparation, shipment documents and dispatch.": "提供采购、出口准备、运输文件和发运等起运地支持。",
  "Airport and door delivery options for urgent, valuable and time-sensitive international cargo.": "为紧急、高价值及有时效要求的国际货物安排到机场或到门方案。",
  "Planning for machinery, long cargo, heavy pieces and shipments requiring special equipment.": "为机械设备、超长货物、重件及特殊设备运输制定方案。",
  "FCL, LCL and special-equipment bookings from major Chinese ports to destinations worldwide.": "从中国主要港口提供全球整箱、拼箱与特种箱订舱服务。",
  "Factory pickup, domestic trucking, warehouse receiving, consolidation and export delivery.": "工厂提货、中国境内陆运、仓库收货、集运与出口交付。",
  "Coordinated transport for vehicles, mobile equipment and complex multi-stage cargo projects.": "协调车辆、移动设备及复杂多阶段项目货物的运输。",
  "Receive goods from multiple suppliers, check incoming cargo and ship one consolidated order.": "接收多家供应商货物、核对入库信息并集中安排发运。",
  "Learn more": "了解更多", "Discuss a custom solution": "咨询定制方案", "SPECIAL CARGO": "特殊货物",
  "Specialised coordination for special situations.": "特殊货物，需要专业协调。",
  "Unusual freight needs more than a standard rate. We review the dimensions, weight, lifting points, packaging, equipment, route restrictions and destination requirements before the cargo moves.": "特殊货运不能仅靠标准运价。发运前，我们会审核尺寸、重量、吊点、包装、设备、路线限制及目的地要求。",
  "Oversize and heavy cargo planning": "超大与重型货物运输规划", "RoRo vehicles and mobile equipment": "滚装车辆与移动设备",
  "Breakbulk and special project shipments": "散杂货与特殊项目运输", "Destination customs coordination through local partners": "通过目的地合作伙伴协调清关",
  "Talk through your cargo": "讨论您的货物需求", "OUR WORKING STANDARD": "我们的服务标准",
  "Prepared carefully. Communicated clearly.": "细致准备，清晰沟通。",
  "We focus on the details that prevent avoidable cost: accurate cargo information, suitable packing, realistic lead times, clear quotation scope and coordinated handoffs.": "我们重视能够减少额外成本的细节：准确的货物资料、合适的包装、合理的交期、明确的报价范围与顺畅的交接。",
  "Start with a shipment review": "先评估您的运输需求", "Ask the right questions": "核实关键运输资料",
  "Product, dimensions, weight, packing, supplier timing and destination.": "品名、尺寸、重量、包装、供应商交期及目的地。",
  "Identify risk before booking": "订舱前识别风险", "Restrictions, documentation and handling requirements are raised early.": "提前确认运输限制、单证及装卸要求。",
  "Keep one direct contact": "专人直接对接", "Vinson coordinates the China-side plan and keeps communication practical.": "Vinson 协调中国端方案，保持直接、务实的沟通。",
  "CHINA NETWORK": "中国服务网络", "Close to the factories and ports where cargo begins.": "贴近工厂与港口，做好起运端服务。",
  "Warehouse and operations support across China's main sourcing regions.": "仓储与运营服务覆盖中国主要采购区域。",
  "Qingdao": "青岛", "Yiwu": "义乌", "Shenzhen": "深圳", "Foshan": "佛山",
  "Warehouse · North China": "仓库 · 华北", "Warehouse · East China": "仓库 · 华东", "Warehouse & office · South China": "仓库及办公室 · 华南", "Operations office · Guangdong": "运营办公室 · 广东",
  "The goal is simple: make every China-side step understandable before the cargo moves.": "我们的目标很简单：在货物出发前，让中国端的每一步都清晰可知。",
  "OUR SERVICE PRINCIPLE": "我们的服务原则", "Clear scope · Practical options · Direct communication": "范围明确 · 方案务实 · 沟通直接",
  "LATEST INSIGHTS": "物流资讯", "Useful guidance for importing from China.": "从中国进口货物的实用指南。",
  "IMPORT GUIDE": "进口指南", "FREIGHT PLANNING": "运输规划", "RISK CONTROL": "风险管理",
  "What overseas buyers should check before purchasing from China": "海外采购商在中国采购前应核实哪些事项",
  "Supplier terms, product compliance, packing, payment milestones and shipment planning.": "供应商条款、产品合规、包装、付款节点与运输规划。",
  "How to choose between express, air freight, LCL and FCL": "如何选择快递、空运、拼箱和整柜运输",
  "Compare urgency, volume, cargo value and destination cost before making a booking.": "订舱前综合比较时效、货量、货值及目的地费用。",
  "Five details that prevent avoidable destination charges": "减少额外目的港费用的五项细节",
  "Accurate documents, suitable packing and early booking protect the shipment plan.": "准确单证、合适包装和提前订舱，让运输计划更加稳妥。",
  "Read more": "阅读更多", "MOVE IN THE RIGHT DIRECTION": "开启合适的物流方案",
  "Tell us what you need to source or ship.": "告诉我们您的采购或运输需求。",
  "Send the cargo name, quantity, dimensions, weight, pickup city, destination and preferred shipping date.": "请提供货物品名、数量、尺寸、重量、提货城市、目的地和预计发运日期。",
  "WhatsApp Vinson": "WhatsApp 联系 Vinson", "CALL": "电话",
  "China procurement, warehousing and global freight solutions for overseas importers.": "为海外进口商提供中国采购、仓储与全球货运服务。",
  "China Procurement": "中国采购", "Cargo Consolidation": "货物集运", "RoRo Services": "滚装运输", "Project Cargo": "项目货物",
  "Breakbulk Shipping": "散杂货运输", "3PL Warehousing": "第三方仓储", "Cross-trade Shipments": "跨境贸易运输", "Customs Coordination": "清关协调",
  "Foshan · Shenzhen · Qingdao · Yiwu": "佛山 · 深圳 · 青岛 · 义乌",
  "© 2026 TengYoda Logistics. Preview website.": "© 2026 TengYoda Logistics. 网站预览版。", "Back to top ↑": "返回顶部 ↑",
  "Main navigation": "主导航", "Open navigation": "打开导航", "TengYoda business facts": "TengYoda 企业信息",
  "Container vessel at an international port": "国际港口的集装箱船", "WhatsApp TengYoda Logistics": "通过 WhatsApp 联系 TengYoda",
};

export function translateText(text: string, language: Language): string {
  if (language === "en") return text;
  const trimmed = text.trim();
  const translation = chinese[trimmed];
  if (translation) return text.replace(trimmed, translation);
  if (trimmed.startsWith("Enquire about ")) return `咨询${chinese[trimmed.slice(14)] ?? trimmed.slice(14)}`;
  return text;
}

// Local, explicit translations only: no external service receives visitor text.
// This page's content is assembled before translation; component internals such
// as clocks and the language selector handle their own labels separately.
export function localizePage(node: ReactNode, language: Language): ReactNode {
  if (language === "en") return node;
  if (typeof node === "string") return translateText(node, language);
  if (!isValidElement<{ children?: ReactNode; "aria-label"?: string; title?: string }>(node)) return node;
  const props: { children?: ReactNode; "aria-label"?: string; title?: string } = {};
  if (node.props["aria-label"]) props["aria-label"] = translateText(node.props["aria-label"], language);
  if (node.props.title) props.title = translateText(node.props.title, language);
  if (node.props.children !== undefined) props.children = Children.map(node.props.children, child => localizePage(child, language));
  return cloneElement(node, props);
}
